import { usePlayerStore } from "../store/playerStore";
import { getThumbnailUrl } from "../data/songs";

export default function UpNext() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const hasStarted = usePlayerStore((s) => s.hasStarted);
  const playSongAtIndex = usePlayerStore((s) => s.playSongAtIndex);

  if (!hasStarted) return null;

  // Show next 15 songs
  const nextSongs = queue.slice(currentIndex + 1, currentIndex + 16);

  return (
    <section className="relative py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
            Up Next
          </h2>
          <span className="text-xs text-gray-500 ml-2">
            {queue.length - currentIndex - 1} songs
          </span>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden max-w-2xl">
          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {nextSongs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No more songs in queue
              </div>
            ) : (
              nextSongs.map((song, idx) => {
                const absoluteIndex = currentIndex + 1 + idx;
                const isCurrent = absoluteIndex === currentIndex;

                return (
                  <button
                    key={`${song.id}-${idx}`}
                    onClick={() => playSongAtIndex(absoluteIndex)}
                    className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 text-left group ${
                      isCurrent
                        ? "bg-amber-500/10"
                        : "hover:bg-white/5"
                    } ${idx !== nextSongs.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    {/* Number */}
                    <span className="w-6 text-center text-xs text-gray-500 group-hover:text-amber-400 transition-colors">
                      {idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={getThumbnailUrl(song.youtubeId)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm text-white/90 truncate group-hover:text-amber-200 transition-colors"
                        style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {song.artist}
                      </p>
                    </div>

                    {/* Category */}
                    <span className="hidden sm:inline text-[10px] text-amber-400/50 bg-amber-400/5 px-2 py-0.5 rounded-full">
                      {song.category}
                    </span>

                    {/* Play icon on hover */}
                    <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
