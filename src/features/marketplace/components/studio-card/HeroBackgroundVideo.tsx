"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { youtubeBackgroundEmbedUrl } from "@/features/shared/utils/youtube";

interface HeroBackgroundVideoProps {
  youtubeVideoId?: string | null;
  videoSrc?: string | null;
  title: string;
  active?: boolean;
}

const YT_FRAME_W = 1280;
const YT_FRAME_H = 720;
const YT_OVERSCAN = 1.15;
const YT_ORIGIN_HOST = "https://www.youtube-nocookie.com";

function postYtCommand(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), YT_ORIGIN_HOST);
}

function sendYtListening(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "listening" }), YT_ORIGIN_HOST);
}

function warmYtConnections() {
  if (typeof document === "undefined") return;
  for (const href of [YT_ORIGIN_HOST, "https://i.ytimg.com"]) {
    if (!document.querySelector(`link[data-yt-preconnect="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.dataset.ytPreconnect = href;
      document.head.appendChild(link);
    }
  }
}

function subscribeReducedMotion(cb: () => void) {
  const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  mql?.addEventListener?.("change", cb);
  return () => mql?.removeEventListener?.("change", cb);
}

function getSkipMotionSnapshot() {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const saveData = Boolean((navigator as { connection?: { saveData?: boolean } }).connection?.saveData);
  return Boolean(reduced || saveData);
}

/** Hover-activated HD muted background loop (`1280x720` virtual viewport for crisp YouTube ABR). */
export const HeroBackgroundVideo: React.FC<HeroBackgroundVideoProps> = ({
  youtubeVideoId,
  videoSrc,
  title,
  active = false,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(active);
  const readyTimerRef = useRef<number | null>(null);

  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");
  const [hasActivated, setHasActivated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [box, setBox] = useState({ width: 420, height: 220 });
  const skipMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getSkipMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    return () => {
      if (readyTimerRef.current !== null) window.clearTimeout(readyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
    if (!active || skipMotion) return;
    if (youtubeVideoId) warmYtConnections();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount player lazily on first hover
    setHasActivated(true);
  }, [active, skipMotion, youtubeVideoId]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || skipMotion) return;

    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([entry]) => {
            setInView(Boolean(entry?.isIntersecting));
          },
          { rootMargin: "120px", threshold: 0.05 },
        )
      : null;
    io?.observe(el);

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) setBox({ width, height });
        })
      : null;
    ro?.observe(el);

    return () => {
      io?.disconnect();
      ro?.disconnect();
    };
  }, [skipMotion]);

  // Play on hover when visible; immediately pause when unhovered or hidden
  useEffect(() => {
    const syncPlayback = () => {
      const shouldPlay = active && inView && !document.hidden;
      if (videoRef.current) {
        if (shouldPlay) void videoRef.current.play?.()?.catch?.(() => {});
        else videoRef.current.pause?.();
      }
      if (youtubeVideoId && iframeRef.current) {
        if (shouldPlay) {
          postYtCommand(iframeRef.current, "mute");
          postYtCommand(iframeRef.current, "setPlaybackQuality", ["hd1080"]);
          postYtCommand(iframeRef.current, "playVideo");
        } else {
          postYtCommand(iframeRef.current, "pauseVideo");
        }
      }
    };
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => document.removeEventListener("visibilitychange", syncPlayback);
  }, [active, inView, youtubeVideoId]);

  useEffect(() => {
    if (!youtubeVideoId || !hasActivated) return;
    const onMessage = (ev: MessageEvent) => {
      if (!ev.origin.includes("youtube")) return;
      try {
        const msg = typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data;
        const isPlaying =
          (msg?.event === "onStateChange" && msg.info === 1) ||
          (msg?.event === "infoDelivery" && msg.info?.playerState === 1);
        if (isPlaying) setIsReady(true);
      } catch {
        // Ignore non-JSON postMessage frames from unrelated scripts
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [youtubeVideoId, hasActivated]);

  const ytUrl = useMemo(() => {
    if (!youtubeVideoId) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : undefined;
    return youtubeBackgroundEmbedUrl(youtubeVideoId, origin);
  }, [youtubeVideoId]);

  if (skipMotion || (!videoSrc && !youtubeVideoId)) return null;

  const coverScale = Math.max(box.width / YT_FRAME_W, box.height / YT_FRAME_H) * YT_OVERSCAN;
  const isShowingVideo = active && isReady;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`sb4-hero-video-wrap ${isShowingVideo ? "is-ready" : ""}`}
    >
      {hasActivated && videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setIsReady(true)}
          onPlaying={() => setIsReady(true)}
          className="sb4-hero-video-el"
        />
      ) : hasActivated && youtubeVideoId ? (
        <iframe
          ref={iframeRef}
          src={ytUrl}
          title={`${title} ambient preview`}
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            sendYtListening(iframeRef.current);
            postYtCommand(iframeRef.current, "mute");
            postYtCommand(iframeRef.current, "setPlaybackQuality", ["hd1080"]);
            postYtCommand(iframeRef.current, activeRef.current ? "playVideo" : "pauseVideo");
            if (readyTimerRef.current !== null) window.clearTimeout(readyTimerRef.current);
            readyTimerRef.current = window.setTimeout(() => setIsReady(true), 800);
          }}
          style={{
            transform: `translate(-50%, -50%) scale(${coverScale.toFixed(4)})`,
          }}
          className="sb4-hero-yt-frame"
        />
      ) : null}
    </div>
  );
};
