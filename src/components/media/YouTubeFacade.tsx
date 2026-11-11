"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/*
 * Click-to-load YouTube player. Nothing from YouTube loads until the
 * viewer presses play, and the player uses the privacy-enhanced
 * youtube-nocookie.com domain.
 */
export function YouTubeFacade({ id, title, channel }: { id: string; title: string; channel?: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-[#0e1c2a] text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-90"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-[#0b1622] via-[#0b1622]/30 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f1c9a5] text-[#1b1410] shadow-lg transition group-hover:scale-110">
        <Play aria-hidden className="ml-1 h-7 w-7" fill="currentColor" />
      </span>
      <span className="absolute bottom-3 left-4 right-4">
        <span className="sr-only">Play video: </span>
        <span className="block text-sm font-medium text-white">{title}</span>
        {channel && <span className="block text-xs text-[#d6e0e8]">{channel}</span>}
      </span>
    </button>
  );
}
