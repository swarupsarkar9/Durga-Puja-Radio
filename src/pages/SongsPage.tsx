import { useState, useMemo, useEffect } from "react";
import { dhaakSongs, playlistSongs, regularSongs, searchSongs, getThumbnailUrl } from "../data/songs";
import { usePlayerStore } from "../store/playerStore";
import { useSearchParams } from "react-router-dom";
import ArtistMarquee from "../components/ArtistMarquee";

const TAB_CATEGORIES = [
  { label: "All",                   filter: null },
  { label: "Durga Puja Song",       filter: "Durga Puja Song" },
  { label: "Abhijit Bhattacharya",  filter: "Abhijit Bhattacharya" },
  { label: "Shreya Ghoshal",        filter: "Shreya Ghoshal" },
  { label: "Mita Chatterjee",       filter: "Mita Chatterjee" },
  { label: "Kishore Kumar",         filter: "Kishore Kumar" },
  { label: "Asha Bhosle",           filter: "Asha Bhosle" },
  { label: "Kumar Sanu",            filter: "Kumar Sanu" },
];

export default function SongsPage() {
  const [searchQuery, setSearchQuery]   = useState("");
  const [searchParams]                  = useSearchParams();
  const [activeTab, setActiveTab]       = useState("All");
  const currentSong   = usePlayerStore((s) => s.currentSong);
  const isPlaying     = usePlayerStore((s) => s.isPlaying);
  const hasStarted    = usePlayerStore((s) => s.hasStarted);
  const playSongList = usePlayerStore((s) => s.playSongList);

  useEffect(() => {
    const tp = searchParams.get("tab");
    if (tp === "Dhaak" || tp === "Playlist") setActiveTab(tp);
    else if (tp && TAB_CATEGORIES.find((t) => t.label === tp)) setActiveTab(tp);
  }, [searchParams]);

  const activeFilter = useMemo(
    () => TAB_CATEGORIES.find((t) => t.label === activeTab)?.filter ?? null,
    [activeTab]
  );

  const filteredSongs = useMemo(() => {
    if (activeTab === "Dhaak") {
      return searchQuery.length >= 2 ? searchSongs(searchQuery).filter((song) => song.category === "Dhaak") : dhaakSongs;
    }
    if (activeTab === "Playlist") {
      return searchQuery.length >= 2 ? playlistSongs.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      ) : playlistSongs;
    }
    let base = searchQuery.length >= 2 ? searchSongs(searchQuery) : regularSongs;
    if (activeFilter !== null) base = base.filter((s) => s.category === activeFilter);
    return base;
  }, [searchQuery, activeFilter, activeTab]);

  return (
    <main className="min-h-screen pt-20 pb-32 px-4" style={{ background: "#0d0505" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-1.5"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            গানের তালিকা
          </h1>
          <p className="text-gray-500 text-sm">{regularSongs.length} songs in the collection</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by song title, artist, or category..."
            className="w-full pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(180,130,40,0.35)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Artist and category chips */}
        <div className="mb-7" aria-label="Artists and song filters">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-500/60">Artists &amp; Filters</p>
          <div className="artist-chips-bar">
            {TAB_CATEGORIES.map((tab) => {
            const count = tab.filter === null
              ? regularSongs.length
              : regularSongs.filter((s) => s.category === tab.filter).length;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? "linear-gradient(135deg, #c47a0a, #e09010)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#000" : "#999",
                  border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${isActive ? "text-black/55" : "text-gray-600"}`}>
                  ({count})
                </span>
              </button>
            );
            })}
            {(["Playlist", "Dhaak"] as const).map((tab) => {
            const isDhaak = tab === "Dhaak";
            const count = isDhaak ? dhaakSongs.length : playlistSongs.length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="songs-filter-pill px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? "linear-gradient(135deg, #c47a0a, #e09010)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#000" : "#999",
                  border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {isDhaak ? "🥁 Dhaak" : "📻 Playlist"}<span className={`ml-1.5 text-xs ${isActive ? "text-black/55" : "text-gray-600"}`}>({count})</span>
              </button>
            );
            })}
          </div>
        </div>

        {/* Song list */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(18,8,8,0.7)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          {filteredSongs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              No songs found matching your search.
            </div>
          ) : (
            <div>
              {filteredSongs.map((song, idx) => {
                const sourceList = activeTab === "Dhaak" ? dhaakSongs : activeTab === "Playlist" ? playlistSongs : regularSongs;
                const absoluteIndex = sourceList.findIndex((s) => s.id === song.id);
                const isCurrent = hasStarted && currentSong?.id === song.id;
                const isNowPlaying = isCurrent && isPlaying;

                return (
                  <button
                    key={song.id}
                    onClick={() => playSongList(sourceList, absoluteIndex)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      borderLeft: isCurrent ? "3px solid #c47a0a" : "3px solid transparent",
                      background: isCurrent ? "rgba(180,120,20,0.08)" : undefined,
                    }}
                    onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = ""; }}
                  >
                    {/* Index number */}
                    <span
                      className="w-7 text-center text-xs font-mono flex-shrink-0"
                      style={{ color: isCurrent ? "#c47a0a" : "#555" }}
                    >
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 relative">
                      <img
                        src={getThumbnailUrl(song.youtubeId)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {isNowPlaying ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0s" }} />
                            <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0.15s" }} />
                            <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0.3s" }} />
                          </div>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{
                          fontFamily: "'Noto Serif Bengali', serif",
                          color: isCurrent ? "#f5d76e" : "#ddd",
                        }}
                      >
                        {song.title}
                      </p>
                      <ArtistMarquee artist={song.artist} />
                    </div>

                    {/* Playing indicator (always visible for current song) */}
                    {isNowPlaying && (
                      <div className="hidden sm:flex items-end gap-0.5 h-3 mr-2 flex-shrink-0">
                        <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0s" }} />
                        <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0.15s" }} />
                        <div className="w-0.5 bg-amber-400 rounded-full animate-eq-bar" style={{ animationDelay: "0.3s" }} />
                      </div>
                    )}

                    {/* Category */}
                    <span
                      className="hidden sm:inline text-[10px] font-medium whitespace-nowrap flex-shrink-0"
                      style={{ color: isCurrent ? "#c47a0a" : "#664400" }}
                    >
                      {song.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
