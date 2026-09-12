import { useEffect, useCallback } from "react";
import { usePlayerStore } from "../store/playerStore";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";

// YouTube player states
const YT_STATE_ENDED = 0;

export default function YouTubePlayer() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const hasStarted = usePlayerStore((s) => s.hasStarted);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const next = usePlayerStore((s) => s.next);

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setCurrentTime(time);
    },
    [setCurrentTime]
  );

  const handleDurationChange = useCallback(
    (dur: number) => {
      setDuration(dur);
    },
    [setDuration]
  );

  const handleStateChange = useCallback(
    (state: number) => {
      if (state === YT_STATE_ENDED) {
        next();
      }
    },
    [next]
  );

  const handleError = useCallback(
    (_error: number) => {
      // Skip to next song on error (e.g., unavailable video)
      console.warn("YouTube player error, skipping to next song...");
      setTimeout(() => {
        next();
      }, 1500);
    },
    [next]
  );

  const { containerRef, seek } = useYouTubePlayer({
    videoId: hasStarted && currentSong ? currentSong.youtubeId : null,
    isPlaying,
    volume,
    isMuted,
    onTimeUpdate: handleTimeUpdate,
    onDurationChange: handleDurationChange,
    onStateChange: handleStateChange,
    onError: handleError,
  });

  // Expose seek to the player store
  useEffect(() => {
    (window as any).__durgaPujaSeek = seek;
    return () => {
      delete (window as any).__durgaPujaSeek;
    };
  }, [seek]);

  return (
    <div className="fixed -z-10 opacity-0 pointer-events-none" style={{ width: 1, height: 1 }}>
      <div ref={containerRef} />
    </div>
  );
}
