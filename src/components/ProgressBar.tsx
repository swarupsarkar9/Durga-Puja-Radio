import { usePlayerStore } from "../store/playerStore";
import { getThumbnailUrl } from "../data/songs";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export default function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    onSeek(percent * duration);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-[10px] text-gray-400 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <div
        className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
        onClick={handleClick}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>
      <span className="text-[10px] text-gray-400 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
