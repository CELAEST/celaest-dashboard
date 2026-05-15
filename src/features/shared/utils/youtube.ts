/**
 * YouTube URL/ID utilities.
 *
 * Mirrors the backend regex in `internal/products/youtube.go` so client-side
 * preview matches what the server will eventually persist. Used by:
 *   - The product create/edit forms (live thumbnail preview while the admin
 *     pastes a URL).
 *   - The `LiteYouTube` facade component (build the embed URL from the id).
 *
 * We deliberately keep it dependency-free and synchronous.
 */

const VIDEO_ID_PATTERN =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^&]*&)*v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/i;

const BARE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extract the canonical 11-char YouTube video id from any supported input.
 * Returns an empty string when the input is not a YouTube reference, so the
 * caller can use it as a boolean check (`if (extractYouTubeId(url))`).
 */
export function extractYouTubeId(input: string | null | undefined): string {
  const s = (input ?? "").trim();
  if (!s) return "";
  if (BARE_ID_PATTERN.test(s)) return s;
  const m = s.match(VIDEO_ID_PATTERN);
  return m ? m[1] : "";
}

/**
 * High-quality thumbnail served straight from YouTube's CDN (~15 KB, no JS).
 * `hqdefault` is the safest size — it always exists for every video; the
 * larger `maxresdefault` only exists for HD uploads.
 */
export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * The privacy-friendly embed URL used by the iframe AFTER the user clicks
 * play. `rel=0` keeps "more videos" suggestions to the same channel and
 * `autoplay=1` is fine here because the click itself counts as a user
 * gesture, so modern browsers won't block playback.
 */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}
