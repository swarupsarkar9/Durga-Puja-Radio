import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePlayerStore } from "../store/playerStore";
import { searchSongs, getThumbnailUrl } from "../data/songs";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const playSongAtIndex = usePlayerStore((s) => s.playSongAtIndex);
  const queue = usePlayerStore((s) => s.queue);

  const results = searchQuery.length >= 2 ? searchSongs(searchQuery) : [];

  const handleSongClick = (songId: number) => {
    const idx = queue.findIndex((s) => s.id === songId);
    if (idx !== -1) playSongAtIndex(idx);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/songs", label: "Songs" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 md:h-16 gap-4">

            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-700/50 shadow-md">
                <img
                  src="/logo.png"
                  alt="Durga Puja Radio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-sm font-bold text-amber-100 tracking-wide"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  Durga Puja
                </span>
                <span className="text-[10px] text-amber-500 uppercase tracking-[0.25em] font-medium mt-0.5">
                  Radio
                </span>
              </div>
            </Link>

            {/* Nav Links - Center */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    location.pathname === link.to
                      ? "bg-amber-700/80 text-amber-100 border border-amber-600/40"
                      : "text-gray-400 hover:text-amber-200 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: Search + Mobile menu */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-400 hover:text-amber-300 transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {searchOpen && (
                  <div className="absolute right-0 top-11 w-80 md:w-96 glass-panel rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
                    <div className="p-3">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search songs, artists..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-600/40 focus:ring-1 focus:ring-amber-600/20"
                          autoFocus
                        />
                      </div>
                    </div>

                    {results.length > 0 && (
                      <div className="max-h-72 overflow-y-auto border-t border-white/5 custom-scrollbar">
                        {results.map((song) => (
                          <button
                            key={song.id}
                            onClick={() => handleSongClick(song.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                          >
                            <img
                              src={getThumbnailUrl(song.youtubeId)}
                              alt=""
                              className="w-9 h-9 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{song.title}</p>
                              <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                            </div>
                            <span className="text-[10px] text-amber-600/80 bg-amber-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                              {song.category}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchQuery.length >= 2 && results.length === 0 && (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No songs found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-amber-300 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/5">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? "bg-amber-700/30 text-amber-200"
                    : "text-gray-300 hover:text-amber-200 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search backdrop */}
      {searchOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
        />
      )}
    </header>
  );
}
