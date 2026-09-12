import { usePlayerStore } from "../store/playerStore";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

const fallingFlowers = Array.from({ length: 36 }, (_, index) => ({
  left: `${2 + ((index * 17) % 96)}%`,
  delay: `${(index * 0.8) % 12}s`,
  duration: `${12 + (index % 5) * 1.5}s`,
  drift: `${(index % 2 === 0 ? 1 : -1) * (16 + (index % 4) * 8)}px`,
  size: `${0.78 + (index % 4) * 0.11}rem`,
}));

export default function HeroSection() {
  const startRadio = usePlayerStore((s) => s.startRadio);
  const hasStarted = usePlayerStore((s) => s.hasStarted);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1b0907] px-4 pt-14">
      {/* Match the reference with a warm veil and a stronger fade at the bottom. */}
      <div
        className="hero-background absolute inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(18, 6, 4, 0.84) 0%, rgba(18, 6, 4, 0.25) 20%, rgba(18, 6, 4, 0.25) 80%, rgba(18, 6, 4, 0.84) 100%), linear-gradient(to bottom, rgba(18, 6, 4, 0.62) 0%, rgba(18, 6, 4, 0.34) 18%, rgba(18, 6, 4, 0.38) 52%, rgba(27, 9, 7, 0.84) 82%, #1b0907 100%), url('/6ac6e24b-f318-4bb1-a2e2-12912c5d71f7.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center 18%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Falling shiuli flowers */}
      <div className="flower-shower fixed inset-0 z-[5] overflow-hidden pointer-events-none" aria-hidden="true">
        {fallingFlowers.map((flower, index) => (
          <span
            key={index}
            className="flower-drop"
            style={{
              left: flower.left,
              animationDelay: flower.delay,
              animationDuration: flower.duration,
              "--flower-size": flower.size,
              "--flower-drift": flower.drift,
            } as CSSProperties}
          >
            {Array.from({ length: 5 }, (_, petalIndex) => (
              <i key={petalIndex} className="flower-drop-petal" style={{ "--petal-angle": `${petalIndex * 72}deg` } as CSSProperties} />
            ))}
            <b className="flower-drop-center" />
          </span>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${15 + i * 14}%`,
              bottom: "8%",
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: "radial-gradient(circle, rgba(245,158,11,0.7), rgba(220,80,20,0.4))",
              animation: `float-up ${4 + i * 0.8}s linear infinite`,
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl mx-auto">

        {/* LIVE badge */}
        <div className="live-badge mb-6 flex items-center gap-2 bg-red-700/80 backdrop-blur-sm border border-red-500/30 rounded-full px-5 py-1.5 shadow-lg shadow-red-900/30">
          <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">Live • Puja Radio</span>
        </div>

        {/* Lotus separator */}
        <div className="hero-lotus mb-3 text-amber-300" aria-hidden="true">
          <svg className="h-9 w-14" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M32 34C26 27 26 19 32 8C38 19 38 27 32 34Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M31 34C23 31 17 25 17 17C25 19 30 25 32 33" />
            <path d="M33 34C41 31 47 25 47 17C39 19 34 25 32 33" />
            <path d="M12 31C20 29 27 31 32 35C37 31 44 29 52 31C44 37 20 37 12 31Z" fill="currentColor" fillOpacity="0.18" />
          </svg>
        </div>

        {/* Bengali title */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-3"
          style={{
            fontFamily: "'Noto Serif Bengali', serif",
            color: "#f5d76e",
            textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(180,120,20,0.25)",
          }}
        >
          দুর্গা পুজো রেডিও
        </h1>

        {/* English title */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
          style={{
            color: "#e8a0a0",
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.02em",
          }}
        >
          Durga Puja Radio
        </h2>

        {/* Bengali tagline */}
        <p
          className="text-base sm:text-lg mb-3 text-amber-200/90"
          style={{ fontFamily: "'Noto Serif Bengali', serif", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
        >
          শারদ উৎসবের গান, একসাথে সারাক্ষণ
        </p>

        {/* English description */}
        <p className="text-sm sm:text-base text-gray-300/80 max-w-md leading-relaxed mb-8"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
          Listen to the best collection of Durga Puja songs, Agomoni and Bengali festival music.
        </p>

        {/* Play button — only before radio starts */}
        {!hasStarted && (
          <button
            onClick={startRadio}
            className="play-radio-button inline-flex items-center gap-3 rounded-full px-8 py-3 text-base font-semibold text-white shadow-xl transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #f5223b, #c1122f)", boxShadow: "0 8px 24px rgba(220,20,45,0.55)" }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <svg className="h-4 w-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            Play Radio
          </button>
        )}

        {hasStarted && (
          <div className="hero-shortcuts mt-7 flex flex-wrap items-center justify-center gap-2.5" aria-label="Radio sections">
            <Link to="/songs" className="hero-shortcut-button">
              <span aria-hidden="true">🎵</span> Songs
            </Link>
            <Link to="/songs?tab=Playlist" className="hero-shortcut-button">
              <span aria-hidden="true">📻</span> Playlist
            </Link>
            <Link to="/songs?tab=Dhaak" className="hero-shortcut-button">
              <span aria-hidden="true">🥁</span> Dhaak
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
