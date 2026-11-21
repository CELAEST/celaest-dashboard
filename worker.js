/**
 * Parses a single HTTP Range header (`bytes=start-end`, `bytes=start-`, `bytes=-suffix`).
 */
export function parseByteRange(rangeHeader, totalSize) {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=") || totalSize <= 0) {
    return null;
  }
  const spec = rangeHeader.slice(6).split(",")[0]?.trim() || "";
  const dashIdx = spec.indexOf("-");
  if (dashIdx === -1) return null;

  const rawStart = spec.slice(0, dashIdx).trim();
  const rawEnd = spec.slice(dashIdx + 1).trim();

  if (rawStart === "") {
    const suffix = Number(rawEnd);
    if (!Number.isInteger(suffix) || suffix <= 0) return null;
    const start = Math.max(0, totalSize - suffix);
    return { start, end: totalSize - 1 };
  }

  const start = Number(rawStart);
  const end = rawEnd === "" ? totalSize - 1 : Math.min(totalSize - 1, Number(rawEnd));
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    start >= totalSize ||
    end < start
  ) {
    return null;
  }
  return { start, end };
}

function sliceByteStream(body, start, end) {
  let offset = 0;
  const transformer = new TransformStream({
    transform(chunk, controller) {
      const chunkStart = offset;
      const chunkEnd = offset + chunk.byteLength - 1;
      offset += chunk.byteLength;

      if (chunkEnd < start) return;
      if (chunkStart > end) {
        controller.terminate();
        return;
      }

      const from = Math.max(0, start - chunkStart);
      const to = Math.min(chunk.byteLength, end - chunkStart + 1);
      controller.enqueue(from === 0 && to === chunk.byteLength ? chunk : chunk.subarray(from, to));

      if (offset > end) {
        controller.terminate();
      }
    },
  });
  return body.pipeThrough(transformer);
}

async function serveRangeAwareVideo(request, env) {
  const assetRes = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
  if (assetRes.status === 404) {
    const headers = new Headers(assetRes.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(assetRes.body, {
      status: 404,
      statusText: assetRes.statusText,
      headers,
    });
  }
  if (!assetRes.ok) return assetRes;

  const headers = new Headers(assetRes.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Vary", "Range");
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "public, max-age=604800");
  }

  let totalSize = Number(headers.get("content-length") || 0);
  const bodyStream = assetRes.body;

  if (totalSize <= 0 && bodyStream) {
    const buf = await assetRes.arrayBuffer();
    totalSize = buf.byteLength;
    headers.set("Content-Length", String(totalSize));
    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }
    const rangeHeader = request.headers.get("range");
    if (!rangeHeader) {
      return new Response(buf, { status: 200, headers });
    }
    const parsed = parseByteRange(rangeHeader, totalSize);
    if (!parsed) {
      headers.set("Content-Range", `bytes */${totalSize}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${parsed.start}-${parsed.end}/${totalSize}`);
    headers.set("Content-Length", String(parsed.end - parsed.start + 1));
    return new Response(buf.slice(parsed.start, parsed.end + 1), {
      status: 206,
      headers,
    });
  }

  if (request.method === "HEAD") {
    await bodyStream?.cancel();
    return new Response(null, { status: 200, headers });
  }

  const rangeHeader = request.headers.get("range");
  if (!rangeHeader || !bodyStream) {
    return new Response(bodyStream, { status: 200, headers });
  }

  const parsed = parseByteRange(rangeHeader, totalSize);
  if (!parsed) {
    await bodyStream.cancel();
    headers.set("Content-Range", `bytes */${totalSize}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${parsed.start}-${parsed.end}/${totalSize}`);
  headers.set("Content-Length", String(parsed.end - parsed.start + 1));
  return new Response(sliceByteStream(bodyStream, parsed.start, parsed.end), {
    status: 206,
    headers,
  });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redirect legacy/duplicate app.celaest.com -> https://dashboard.celaest.com (301)
    if (
      url.hostname === "app.celaest.com" ||
      (url.hostname === "dashboard.celaest.com" && url.protocol === "http:")
    ) {
      url.protocol = "https:";
      url.hostname = "dashboard.celaest.com";
      return Response.redirect(url.toString(), 301);
    }

    if (/\.(mp4|webm|m4v|mov)$/i.test(url.pathname)) {
      return serveRangeAwareVideo(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
