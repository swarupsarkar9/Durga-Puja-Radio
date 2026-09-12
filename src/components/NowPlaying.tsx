import { usePlayerStore } from "../store/playerStore";
import { getThumbnailUrl } from "../data/songs";

export default function NowPlaying() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying   = usePlayerStore((s) => s.isPlaying);
  const hasStarted  = usePlayerStore((s) => s.hasStarted);

  if (!hasStarted || !currentSong) return null;

  return (
    <section className="px-4 pt-8 pb-2">
      <div className="max-w-4xl mx-auto">
        <div
          className="now-playing-card rounded-2xl p-5 flex items-center gap-5"
          style={{
            background: "linear-gradient(135deg, rgba(30,12,10,0.9), rgba(20,7,7,0.85))",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Thumbnail */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-xl ring-1 ring-white/10">
            <img
              src={getThumbnailUrl(currentSong.youtubeId)}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-lg md:text-xl font-bold text-white mb-1 truncate"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {currentSong.title}
            </p>
            <p className="text-sm text-gray-400 mb-3 truncate">{currentSong.artist}</p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-wider text-amber-600 bg-amber-900/25 border border-amber-700/30 px-3 py-0.5 rounded-full font-semibold">
                {currentSong.category}
              </span>
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Playing
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
