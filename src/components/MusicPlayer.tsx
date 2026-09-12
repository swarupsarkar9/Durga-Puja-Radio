import { useRef, useCallback, useState, useEffect } from "react";
import { usePlayerStore } from "../store/playerStore";
import { getThumbnailUrl } from "../data/songs";

interface MusicPlayerProps {
  onSeek: (time: number) => void;
}

export default function MusicPlayer({ onSeek }: MusicPlayerProps) {
  const currentSong  = usePlayerStore((s) => s.currentSong);
  const isPlaying    = usePlayerStore((s) => s.isPlaying);
  const hasStarted   = usePlayerStore((s) => s.hasStarted);
  const currentTime  = usePlayerStore((s) => s.currentTime);
  const duration     = usePlayerStore((s) => s.duration);
  const repeat       = usePlayerStore((s) => s.repeat);
  const shuffle      = usePlayerStore((s) => s.shuffle);
  const volume       = usePlayerStore((s) => s.volume);
  const isMuted      = usePlayerStore((s) => s.isMuted);
  const togglePlay   = usePlayerStore((s) => s.togglePlay);
  const next         = usePlayerStore((s) => s.next);
  const previous     = usePlayerStore((s) => s.previous);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat  = usePlayerStore((s) => s.cycleRepeat);
  const setVolume    = usePlayerStore((s) => s.setVolume);

  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll title
  const titleRef    = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    setShouldScroll(false);
    if (!titleRef.current) return;
    const el = titleRef.current;
    const timer = setTimeout(() => {
      if (el.scrollWidth > el.clientWidth) setShouldScroll(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentSong?.id]);

  if (!hasStarted || !currentSong) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const seekFromEvent = useCallback((clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    onSeek(pct * duration);
  }, [duration, onSeek]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return;
    setIsDragging(true);
    seekFromEvent(e.clientX, progressRef.current.getBoundingClientRect());

    const onMove = (ev: MouseEvent) => {
      if (!progressRef.current) return;
      seekFromEvent(ev.clientX, progressRef.current.getBoundingClientRect());
    };
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [seekFromEvent]);

  const handleProgressTouchStart = useCallback((e: React.TouchEvent) => {
    if (!progressRef.current) return;
    setIsDragging(true);
    seekFromEvent(e.touches[0].clientX, progressRef.current.getBoundingClientRect());

    const onMove = (ev: TouchEvent) => {
      if (!progressRef.current) return;
      seekFromEvent(ev.touches[0].clientX, progressRef.current.getBoundingClientRect());
    };
    const onEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
  }, [seekFromEvent]);

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
      <div className="max-w-2xl mx-auto">
        <div className="player-card rounded-full overflow-hidden">
          {/* Top row: thumbnail + info + progress */}
          <div className="flex items-center gap-3 px-4 pt-3 pb-1">
            {/* Thumbnail */}
            <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/10">
              <img
                src={getThumbnailUrl(currentSong.youtubeId)}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song info + progress */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="overflow-hidden" ref={titleRef}>
                <p className={`player-title text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap inline-block ${shouldScroll ? "animate-marquee" : "truncate"}`}>
                  {currentSong.title}
                  {shouldScroll && <span className="mx-3 opacity-50">•</span>}
                  {shouldScroll && currentSong.title}
                </p>
              </div>
              {/* Artist */}
              <p className="player-artist text-[9px] sm:text-[10px] text-white/40 truncate mt-0.5">
                {currentSong.artist}
              </p>
              {/* Progress bar row */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="player-time text-[8px] text-white/35 font-mono tabular-nums w-6 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  className="flex-1 h-[3px] bg-white/10 rounded-full cursor-pointer group relative"
                  onMouseDown={handleProgressMouseDown}
                  onTouchStart={handleProgressTouchStart}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-amber-500/80 rounded-full"
                    style={{ width: `${progress}%`, transition: "width 0.2s linear" }}
                  />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow transition-opacity ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    style={{ left: `calc(${progress}% - 4px)` }}
                  />
                </div>
                <span className="player-time text-[8px] text-white/35 font-mono tabular-nums w-6">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom row: controls + volume */}
          <div className="flex items-center px-4 pb-2.5 pt-0.5">
            {/* Controls centred */}
            <div className="flex-1 flex items-center justify-center gap-2">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${shuffle ? "text-amber-400" : "text-white/30 hover:text-white/60"}`}
                aria-label="Shuffle"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                </svg>
              </button>

              {/* Prev */}
              <button
                onClick={previous}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Previous"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-4.5 h-4.5 text-black" fill="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                onClick={next}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Next"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>

              {/* Repeat */}
              <button
                onClick={cycleRepeat}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all relative ${repeat !== "none" ? "text-amber-400" : "text-white/30 hover:text-white/60"}`}
                aria-label="Repeat"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
                {repeat === "one" && (
                  <span className="absolute text-[6px] font-bold text-amber-400 leading-none" style={{ bottom: 4 }}>1</span>
                )}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <button
                onClick={() => setVolume(effectiveVolume > 0 ? 0 : 80)}
                className="text-white/40 hover:text-white/70 transition-colors"
                aria-label="Mute"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  {effectiveVolume === 0 ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                  ) : effectiveVolume < 50 ? (
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  )}
                </svg>
              </button>
              <div className="w-16 sm:w-20">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={effectiveVolume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="player-volume-slider w-full"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
