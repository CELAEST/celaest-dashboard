"use client";

import React from "react";
import { PlayCircle } from "@phosphor-icons/react";
import { youtubeEmbedUrl, youtubeThumbnail } from "../utils/youtube";

/**
 * Lightweight YouTube "facade" embed.
 *
 * Rationale (see Paul Irish's lite-youtube-embed, Vercel docs, etc.): a
 * normal `<iframe src="youtube.com/embed/...">` ships ~1.3 MB of JS,
 * cookies and ~12 requests **even if the user never clicks play**. When a
 * product modal renders that's a huge waste.
 *
 * The facade pattern:
 *   1. Initial render is just an `<img>` (≈ 15 KB from `i.ytimg.com`) plus
 *      a play button overlay. Effectively zero JS cost.
 *   2. When the user clicks, we mount the real iframe with `autoplay=1`;
 *      the click itself counts as the user gesture so playback starts
 *      immediately and modern browsers don't block it.
 *   3. We use `youtube-nocookie.com` so we don't drop tracking cookies
 *      until the user opts in (clicks play).
 *
 * Props are deliberately minimal. Pass `fallbackImage` if you want a
 * graceful path when YouTube can't serve the thumbnail (offline, geoblock,
 * private video) — that image is rendered via the same `<img>` element on
 * `onError`.
 */
interface LiteYouTubeProps {
  /** 11-char YouTube video id. */
  videoId: string;
  /** Used for the accessible `alt` text of the thumbnail. */
  title: string;
  /** Optional image to fall back to if the YouTube thumbnail fails to load. */
  fallbackImage?: string;
  /** Optional extra classes for the outer aspect-ratio wrapper. */
  className?: string;
  /** Optional flag to autoplay the video immediately. */
  autoPlay?: boolean;
}

export const LiteYouTube: React.FC<LiteYouTubeProps> = ({
  videoId,
  title,
  fallbackImage,
  className = "",
  autoPlay = false,
}) => {
  const [activated, setActivated] = React.useState(autoPlay);
  const [thumbFailed, setThumbFailed] = React.useState(false);

  // Warm up the connection to YouTube on hover/focus so the first frame
  // arrives a touch faster after the click. Cheap (<1 KB) and standard.
  const handlePrefetch = React.useCallback(() => {
    if (activated) return;
    const linkRel = (rel: string, href: string) => {
      if (document.querySelector(`link[data-yt="${rel}-${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = rel;
      l.href = href;
      l.dataset.yt = `${rel}-${href}`;
      document.head.appendChild(l);
    };
    linkRel("preconnect", "https://www.youtube-nocookie.com");
    linkRel("preconnect", "https://i.ytimg.com");
  }, [activated]);

  const activate = React.useCallback(() => setActivated(true), []);

  const thumbSrc = !thumbFailed
    ? youtubeThumbnail(videoId)
    : fallbackImage || "";

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-black ${className}`}
    >
      {activated ? (
        <iframe
          // The actual heavyweight load — only mounted after a real click.
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={activate}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {thumbSrc && (
            // Plain <img> on purpose: this is a 15 KB asset served by
            // YouTube's own CDN (`i.ytimg.com`). Routing it through
            // next/image would proxy it via our server (extra hop, no
            // optimisation win) and break the cheap-thumbnail tradeoff
            // that motivates the whole lite-embed facade.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbSrc}
              alt={title}
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {/* Gradient + play icon overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent transition-opacity group-hover:from-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle
              size={88}
              weight="fill"
              className="text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110"
            />
          </div>
        </button>
      )}
    </div>
  );
};
