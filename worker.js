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

const ICON_LINK_HEADER =
  '</favicon-v2.ico>; rel="icon"; type="image/x-icon", </icon-48-v2.png>; rel="icon"; type="image/png"; sizes="48x48", </icon-192-v2.png>; rel="icon"; type="image/png"; sizes="192x192"';

const LEGACY_PRICING_PATHS = new Set([
  "/mes",
  "/año",
  "/anio",
  "/month",
  "/year",
  "/pricing",
  "/precios",
]);

const JUNK_PATHS = new Set(["/$", "/&", "/%24", "/%26"]);

function withSecurityHeaders(response, { noindex = false } = {}) {
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    headers.set("Link", ICON_LINK_HEADER);
  }
  if (noindex || response.status === 404) {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const decodedPath = (() => {
      try {
        return decodeURIComponent(url.pathname);
      } catch {
        return url.pathname;
      }
    })();
    const normalizedPath = decodedPath.replace(/\/+$/, "") || "/";

    // Redirect legacy pricing shortcuts mistakenly crawled on dashboard subdomain -> landing
    if (LEGACY_PRICING_PATHS.has(normalizedPath)) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: "https://celaest.com/es",
          Link: ICON_LINK_HEADER,
        },
      });
    }

    // Redirect malformed literal template/junk URLs (/$ , /& , /%24 , /%26) -> canonical dashboard root
    if (JUNK_PATHS.has(url.pathname) || JUNK_PATHS.has(normalizedPath)) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: "https://dashboard.celaest.com/",
          Link: ICON_LINK_HEADER,
        },
      });
    }

    // Redirect legacy/duplicate app.celaest.com -> https://dashboard.celaest.com (301)
    if (
      url.hostname === "app.celaest.com" ||
      (url.hostname === "dashboard.celaest.com" && url.protocol === "http:")
    ) {
      url.protocol = "https:";
      url.hostname = "dashboard.celaest.com";
      return new Response(null, {
        status: 301,
        headers: {
          Location: url.toString(),
          Link: ICON_LINK_HEADER,
        },
      });
    }

    if (/\.(mp4|webm|m4v|mov)$/i.test(url.pathname)) {
      return withSecurityHeaders(await serveRangeAwareVideo(request, env));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const isQueryDuplicate =
      url.searchParams.has("mode") ||
      url.searchParams.has("tab") ||
      url.searchParams.has("plan") ||
      url.searchParams.has("revoked");

    return withSecurityHeaders(assetResponse, {
      noindex: assetResponse.status === 404 || isQueryDuplicate,
    });
  },
};

export default worker;
