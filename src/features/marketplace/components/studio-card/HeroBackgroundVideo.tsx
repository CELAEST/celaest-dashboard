"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { youtubeBackgroundEmbedUrl } from "@/features/shared/utils/youtube";

interface HeroBackgroundVideoProps {
  youtubeVideoId?: string | null;
  videoSrc?: string | null;
  posterUrl?: string | null;
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

/**
 * Hybrid hover-activated HD background video:
 *  - Direct MP4/WebM (`videoSrc`): preloads silently in viewport and reveals immediately on hover.
 *  - YouTube (`youtubeVideoId` fallback): silently warms player behind artwork on viewport entry and plays fast on hover.
 */
export const HeroBackgroundVideo: React.FC<HeroBackgroundVideoProps> = ({
  youtubeVideoId,
  videoSrc,
  posterUrl,
  title,
  active = false,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(active);
  const ytWarmedRef = useRef(false);
  const readyTimerRef = useRef<number | null>(null);
  const idlePauseTimerRef = useRef<number | null>(null);

  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");
  const [hasHovered, setHasHovered] = useState(false);
  const [warmMounted, setWarmMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const [box, setBox] = useState({ width: 420, height: 220 });

  const skipMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getSkipMotionSnapshot,
    () => false,
  );

  // Remember first hover without synchronous setState in effect via timer/callback
  useEffect(() => {
    activeRef.current = active;
    if (!active || skipMotion) return;
    if (youtubeVideoId && !videoSrc) warmYtConnections();
    const id = window.setTimeout(() => setHasHovered(true), 0);
    return () => window.clearTimeout(id);
  }, [active, skipMotion, youtubeVideoId, videoSrc]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (readyTimerRef.current !== null) window.clearTimeout(readyTimerRef.current);
      if (idlePauseTimerRef.current !== null) window.clearTimeout(idlePauseTimerRef.current);
    };
  }, []);

  // Track viewport visibility + container box size
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || skipMotion) return;

    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([entry]) => setInView(Boolean(entry?.isIntersecting)),
          { rootMargin: "220px", threshold: 0.01 },
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

  // Opción 2: Silently pre-warm YouTube embed behind poster on hover-capable desktop devices
  useEffect(() => {
    if (skipMotion || videoSrc || !youtubeVideoId || !inView || warmMounted) return;
    const canHover = window.matchMedia?.("(hover: hover)")?.matches ?? true;
    if (!canHover) return;

    const timer = window.setTimeout(() => {
      warmYtConnections();
      setWarmMounted(true);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [skipMotion, videoSrc, youtubeVideoId, inView, warmMounted]);

  // Opción 1 fallback reveal for <video> so fast hover works even while buffering
  useEffect(() => {
    if (!videoSrc || !active) return;
    const timer = window.setTimeout(() => setVideoReady(true), 60);
    return () => window.clearTimeout(timer);
  }, [videoSrc, active]);

  // Sync active hover state with video / YouTube player
  useEffect(() => {
    const syncPlayback = () => {
      const shouldPlay = active && inView && !document.hidden;
      if (videoRef.current) {
        if (shouldPlay) void videoRef.current.play?.()?.catch?.(() => {});
        else videoRef.current.pause?.();
      }
      if (!videoSrc && youtubeVideoId && iframeRef.current) {
        if (shouldPlay) {
          postYtCommand(iframeRef.current, "mute");
          postYtCommand(iframeRef.current, "setPlaybackQuality", ["hd1080"]);
          postYtCommand(iframeRef.current, "playVideo");
          if (readyTimerRef.current !== null) window.clearTimeout(readyTimerRef.current);
          const delay = ytWarmedRef.current ? 140 : 480;
          readyTimerRef.current = window.setTimeout(() => {
            if (activeRef.current) setYtReady(true);
          }, delay);
        } else {
          postYtCommand(iframeRef.current, "pauseVideo");
          if (readyTimerRef.current !== null) window.clearTimeout(readyTimerRef.current);
          readyTimerRef.current = window.setTimeout(() => setYtReady(false), 0);
        }
      }
    };
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => document.removeEventListener("visibilitychange", syncPlayback);
  }, [active, inView, videoSrc, youtubeVideoId]);

  // YouTube player readiness & warm-pause synchronization
  useEffect(() => {
    if (videoSrc || !youtubeVideoId) return;
    const onMessage = (ev: MessageEvent) => {
      if (!ev.origin.includes("youtube")) return;
      try {
        const msg = typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data;
        const isPlaying =
          (msg?.event === "onStateChange" && msg.info === 1) ||
          (msg?.event === "infoDelivery" && msg.info?.playerState === 1);
        if (!isPlaying) return;

        ytWarmedRef.current = true;
        if (activeRef.current) {
          setYtReady(true);
        } else {
          postYtCommand(iframeRef.current, "pauseVideo");
          postYtCommand(iframeRef.current, "seekTo", [0, true]);
        }
      } catch {
        // Ignore non-JSON postMessage frames from unrelated scripts
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [videoSrc, youtubeVideoId]);

  const ytUrl = useMemo(() => {
    if (!youtubeVideoId) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : undefined;
    return youtubeBackgroundEmbedUrl(youtubeVideoId, origin);
  }, [youtubeVideoId]);

  if (skipMotion || (!videoSrc && !youtubeVideoId)) return null;

  const shouldMountVideo = Boolean(videoSrc && (inView || active || hasHovered));
  const shouldMountYt = Boolean(!videoSrc && youtubeVideoId && (active || hasHovered || warmMounted));
  const isShowingVideo = active && (videoSrc ? videoReady : ytReady);
  const coverScale = Math.max(box.width / YT_FRAME_W, box.height / YT_FRAME_H) * YT_OVERSCAN;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`sb4-hero-video-wrap ${isShowingVideo ? "is-ready" : ""}`}
    >
      {shouldMountVideo && videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterUrl || undefined}
          autoPlay={active}
          muted
          loop
          playsInline
          preload={inView ? "auto" : "metadata"}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          className="sb4-hero-video-el"
        />
      ) : shouldMountYt && youtubeVideoId ? (
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
            postYtCommand(iframeRef.current, "playVideo");

            if (activeRef.current) {
              if (readyTimerRef.current !== null) window.clearTimeout(readyTimerRef.current);
              readyTimerRef.current = window.setTimeout(() => {
                if (activeRef.current) setYtReady(true);
              }, 450);
            } else {
              // Warm-up complete safety net if player never emitted state=1
              if (idlePauseTimerRef.current !== null) window.clearTimeout(idlePauseTimerRef.current);
              idlePauseTimerRef.current = window.setTimeout(() => {
                if (!activeRef.current) {
                  ytWarmedRef.current = true;
                  postYtCommand(iframeRef.current, "pauseVideo");
                }
              }, 1600);
            }
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
