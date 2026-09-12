import { useEffect, useRef, useState } from "react";

interface ArtistMarqueeProps {
  artist: string;
}

export default function ArtistMarquee({ artist }: ArtistMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const text = textRef.current;
    if (!viewport || !text) return;

    const updateOverflow = () => {
      setIsOverflowing(text.scrollWidth > viewport.clientWidth);
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [artist]);

  return (
    <div ref={viewportRef} className={`artist-marquee text-xs text-gray-500 mt-0.5 ${isOverflowing ? "is-overflowing" : ""}`}>
      <span ref={textRef} className="artist-marquee-track inline-block whitespace-nowrap">
        {artist}
        {isOverflowing && <span aria-hidden="true">&nbsp;&nbsp;•&nbsp;&nbsp;{artist}</span>}
      </span>
    </div>
  );
}