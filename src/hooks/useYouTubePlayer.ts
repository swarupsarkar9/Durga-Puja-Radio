import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  onReady?: (duration: number) => void;
  onStateChange?: (state: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onError?: (error: number) => void;
}

// YouTube player states
const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

export function useYouTubePlayer({
  videoId,
  isPlaying,
  volume,
  isMuted,
  onReady,
  onStateChange,
  onTimeUpdate,
  onDurationChange,
  onError,
}: UseYouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isReadyRef = useRef(false);
  const currentVideoIdRef = useRef<string | null>(null);

  const clearTimeTracking = useCallback(() => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  }, []);

  const startTimeTracking = useCallback(() => {
    clearTimeTracking();
    timeIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        try {
          const time = playerRef.current.getCurrentTime();
          if (typeof time === "number" && !isNaN(time)) {
            onTimeUpdate?.(time);
          }
          const dur = playerRef.current.getDuration();
          if (typeof dur === "number" && !isNaN(dur) && dur > 0) {
            onDurationChange?.(dur);
          }
        } catch {
          // Player not ready
        }
      }
    }, 500);
  }, [clearTimeTracking, onTimeUpdate, onDurationChange]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Create/update player when videoId changes
  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    clearTimeTracking();

    // If player exists and video changed, load new video
    if (playerRef.current && isReadyRef.current) {
      if (currentVideoIdRef.current !== videoId) {
        currentVideoIdRef.current = videoId;
        try {
          playerRef.current.loadVideoById(videoId);
        } catch {
          // Re-create player if loadVideoById fails
          recreatePlayer();
        }
      }
      return;
    }

    function recreatePlayer() {
      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      const checkYT = () => {
        if (!window.YT || !window.YT.Player) {
          setTimeout(checkYT, 100);
          return;
        }

        try {
          playerRef.current = new window.YT.Player(containerRef.current, {
            height: "1",
            width: "1",
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              origin: window.location.origin,
            },
            events: {
              onReady: (event: any) => {
                isReadyRef.current = true;
                currentVideoIdRef.current = videoId;
                const dur = event.target.getDuration();
                if (dur > 0) {
                  onReady?.(dur);
                  onDurationChange?.(dur);
                }
                if (isPlaying) {
                  event.target.playVideo();
                  startTimeTracking();
                }
              },
              onStateChange: (event: any) => {
                onStateChange?.(event.data);
                if (event.data === YT_STATE.PLAYING) {
                  startTimeTracking();
                } else if (event.data === YT_STATE.ENDED) {
                  clearTimeTracking();
                }
              },
              onError: (event: any) => {
                onError?.(event.data);
              },
            },
          });
        } catch (err) {
          console.error("Failed to create YouTube player:", err);
        }
      };

      checkYT();
    }

    recreatePlayer();

    return () => {
      clearTimeTracking();
    };
  }, [videoId]);

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
        startTimeTracking();
      } else {
        playerRef.current.pauseVideo();
        clearTimeTracking();
      }
    } catch {
      // Player not ready
    }
  }, [isPlaying]);

  // Handle volume
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      const vol = isMuted ? 0 : volume;
      playerRef.current.setVolume(vol);
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch {
      // Player not ready
    }
  }, [volume, isMuted]);

  // Seek function
  const seek = useCallback((time: number) => {
    if (playerRef.current && isReadyRef.current) {
      try {
        playerRef.current.seekTo(time, true);
        onTimeUpdate?.(time);
      } catch {
        // Player not ready
      }
    }
  }, [onTimeUpdate]);

  return { containerRef, seek };
}
