"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface Props {
  videoId: string;
  src: string;
  poster?: string;
  startAt?: number;
}

export default function VideoPlayer({ videoId, src, poster, startAt = 0 }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  // HLS (.m3u8) via hls.js, plain mp4 natively
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let hls: Hls | undefined;
    if (src && src.endsWith(".m3u8") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (src) {
      video.src = src;
    }
    const onMeta = () => {
      if (startAt > 0 && startAt < video.duration - 5) video.currentTime = startAt;
    };
    video.addEventListener("loadedmetadata", onMeta);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      hls?.destroy();
    };
  }, [src, startAt]);

  // count one view on first play; save progress every 5s and on pause
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let counted = false;
    let last = 0;
    const save = () =>
      fetch(`/api/videos/${videoId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds: Math.floor(video.currentTime) }),
      }).catch(() => {});
    const onPlay = () => {
      if (counted) return;
      counted = true;
      fetch(`/api/videos/${videoId}/view`, { method: "POST" }).catch(() => {});
    };
    const onTime = () => {
      if (Date.now() - last > 5000) {
        last = Date.now();
        save();
      }
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("pause", save);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("pause", save);
    };
  }, [videoId]);

  return (
    <video
      ref={ref}
      poster={poster}
      controls
      className="aspect-video w-full rounded-xl bg-black"
    />
  );
}
