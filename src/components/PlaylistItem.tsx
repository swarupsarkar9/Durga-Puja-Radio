import { Song, getThumbnailUrl } from "../data/songs";
import { usePlayerStore } from "../store/playerStore";

interface PlaylistItemProps {
  song: Song;
  index: number;
  isCurrentSong: boolean;
  isPlaying: boolean;
}

export default function PlaylistItem({ song, index, isCurrentSong, isPlaying }: PlaylistItemProps) {
  const playSongAtIndex = usePlayerStore((s) => s.playSongAtIndex);

  return (
    <button
      onClick={() => playSongAtIndex(index)}
      className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 text-left group ${
        isCurrentSong
          ? "bg-amber-500/10 border-l-2 border-amber-500"
          : "border-l-2 border-transparent hover:bg-white/5"
      }`}
    >
      {/* Number / Playing indicator */}
      <div className="w-8 text-center">
        {isCurrentSong && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-4">
            <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0s" }} />
            <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0.15s" }} />
            <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0.3s" }} />
          </div>
        ) : (
          <span className="text-xs text-gray-500 group-hover:text-amber-400 transition-colors">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md ring-1 ring-white/5">
        <img
          src={getThumbnailUrl(song.youtubeId)}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate transition-colors ${
            isCurrentSong ? "text-amber-200" : "text-white/90 group-hover:text-amber-200"
          }`}
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          {song.title}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {song.artist}
        </p>
      </div>

      {/* Category */}
      <span className="hidden sm:inline text-[10px] text-amber-400/50 bg-amber-400/5 px-2 py-0.5 rounded-full whitespace-nowrap">
        {song.category}
      </span>

      {/* Play icon on hover */}
      <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {isCurrentSong && isPlaying ? (
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
    </button>
  );
}
