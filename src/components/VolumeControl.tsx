import { usePlayerStore } from "../store/playerStore";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
}

export default function VolumeControl({ volume, isMuted }: VolumeControlProps) {
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  const effectiveVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      );
    }
    if (volume < 50) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-2 group">
      <button
        onClick={toggleMute}
        className="text-gray-400 hover:text-white transition-colors p-1"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </button>
      <div className="w-20 relative hidden sm:block">
        <input
          type="range"
          min={0}
          max={100}
          value={effectiveVolume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="volume-slider w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
          aria-label="Volume"
        />
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full pointer-events-none"
          style={{ width: `${effectiveVolume}%` }}
        />
      </div>
    </div>
  );
}
