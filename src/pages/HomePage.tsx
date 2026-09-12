import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import NowPlaying from "../components/NowPlaying";
import PujoCountdown from "../components/PujoCountdown";
import { usePlayerStore } from "../store/playerStore";
import { songs, getThumbnailUrl } from "../data/songs";

function SupportUs() {
  const [isOpen, setIsOpen] = useState(false);
  const qrData = "upi://pay?pa=swarupsarkar55555@oksbi&pn=Swarup%20Sarkar";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(qrData)}`;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="support-button absolute left-3 top-0 z-40 flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-transform hover:scale-110 active:scale-95 md:h-16 md:w-16" aria-label="Support us" title="Support Us">
        <span aria-hidden="true">💗</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 pt-20 sm:pt-24" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="support-modal relative z-10 my-4 w-full max-w-lg rounded-[2rem] border border-amber-500/35 px-4 py-6 text-center shadow-2xl sm:px-10 sm:py-8" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-2xl" aria-label="Close support dialog">×</button>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/40 bg-red-950/70 text-3xl shadow-[0_0_30px_rgba(220,40,60,0.3)] sm:mb-5 sm:h-20 sm:w-20 sm:text-4xl">❤️</div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300 sm:mb-3 sm:text-xs sm:tracking-[0.22em]">No subscription · No ads · No payment</p>
            <h2 className="mb-4 text-xl font-bold text-amber-50 sm:mb-5 sm:text-3xl">Just the music, just the memories ❤️</h2>
            <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-white/70 sm:mb-7 sm:text-lg">Help us keep the spirit of Durga Puja alive through music. ❤️<br /><br />Durga Puja Radio is created with love and devotion to bring beautiful Durga Puja songs and devotional music to everyone, anytime and anywhere.<br /><br />If you enjoy listening to our radio and would like to support this project, your contribution can help us with website hosting, maintenance, improvements, and adding more devotional music.<br /><br />Every little support means a lot to us. 🌺<br /><br /><strong>Thank you for being a part of our Durga Puja Radio family.</strong><br /><br /><strong>শুভ দুর্গাপূজা 🙏<br />জয় মা দুর্গা ❤️</strong></p>
            <div className="mx-auto mb-4 w-fit rounded-3xl border-4 border-white bg-white p-2 shadow-[0_0_0_3px_rgba(220,45,55,0.8),0_8px_30px_rgba(0,0,0,0.35)] sm:mb-5 sm:p-3">
              <a href={qrData} aria-label="Pay directly with UPI">
                <img src={qrUrl} alt="UPI QR code for Swarup Sarkar" className="h-44 w-44 sm:h-64 sm:w-64" />
              </a>
            </div>
            <p className="mb-5 text-xs text-white/55 sm:mb-6 sm:text-sm">UPI ID: swarupsarkar55555@oksbi</p>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:mb-5 sm:gap-3">
              <a href={qrUrl} download="durga-puja-radio-upi-qr.png" target="_blank" rel="noopener noreferrer" className="support-action-button rounded-full px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm">
                ↓ Download QR
              </a>
              <a href={qrData} className="support-action-button rounded-full px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm">
                Pay Directly via UPI
              </a>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-xs text-white/55 underline underline-offset-4 transition-colors hover:text-amber-300 sm:text-sm">Dismiss</button>
          </div>
        </div>
      )}
    </>
  );
}

function BengaliClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const clockId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockId);
  }, []);

  const toBengaliDigits = (value: string) => value.replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
  const hours = time.getHours();
  const clockText = `${toBengaliDigits(String(hours % 12 || 12).padStart(2, "0"))}:${toBengaliDigits(String(time.getMinutes()).padStart(2, "0"))}:${toBengaliDigits(String(time.getSeconds()).padStart(2, "0"))} ${hours >= 12 ? "PM" : "AM"}`;
  const dateText = toBengaliDigits(time.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));

  return (
    <div className="digital-clock-position absolute left-1/2 top-0 z-30 -translate-x-1/2" aria-label="Current time">
      <div className="digital-clock rounded-full px-4 py-1.5 text-center">
        <span className="block text-base font-bold tracking-[0.1em] text-amber-300">{clockText}</span>
        <span className="mt-0.5 block text-[9px] tracking-[0.12em] text-amber-100/60">{dateText}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const queue          = usePlayerStore((s) => s.queue);
  const currentIndex   = usePlayerStore((s) => s.currentIndex);
  const hasStarted     = usePlayerStore((s) => s.hasStarted);
  const playSongAtIndex = usePlayerStore((s) => s.playSongAtIndex);

  const upNextSongs = hasStarted
    ? queue.slice(currentIndex + 1, currentIndex + 6)
    : songs.slice(0, 5);

  return (
   <main className="relative min-h-screen">
      {/* Hero */}
      <HeroSection />
      <div className="home-controls pointer-events-none absolute left-0 right-0 z-20">
        <div className="pointer-events-auto relative mx-auto max-w-7xl">
          <SupportUs />
          <PujoCountdown />
          <BengaliClock />
        </div>
      </div>

      <div className="lower-wallpaper" aria-hidden="true">
        <span className="diya-glow diya-glow-left" />
        <span className="diya-glow diya-glow-center" />
        <span className="diya-glow diya-glow-right" />
      </div>

      {/* Now Playing */}
      <div className="relative z-10">
        <NowPlaying />

        {/* Up Next */}
        <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500/80">
              Up Next
            </h2>
          </div>

          {/* Song list */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(22,10,8,0.9), rgba(15,6,6,0.85))",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="divide-y divide-white/[0.04]">
              {upNextSongs.map((song, idx) => {
                const absoluteIndex = hasStarted ? currentIndex + 1 + idx : idx;
                return (
                  <button
                    key={`${song.id}-${idx}`}
                    onClick={() => playSongAtIndex(absoluteIndex)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 transition-colors text-left group hover:bg-white/[0.04]"
                  >
                    {/* Number */}
                    <span className="w-6 text-center text-sm text-gray-600 group-hover:text-amber-500 transition-colors font-mono">
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
                        className="text-sm text-white/85 truncate group-hover:text-amber-200 transition-colors"
                        style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{song.artist}</p>
                    </div>

                    {/* Category */}
                    <span className="hidden sm:inline text-[10px] text-amber-600/60 bg-amber-900/20 border border-amber-800/20 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      {song.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </section>

        {/* Footer */}
        <footer className="footer-section relative px-4 pt-12 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto text-center">

          {/* Lotus */}
          <div className="flex justify-center mb-5">
            <svg className="w-10 h-10 text-amber-500/70 footer-lotus" viewBox="0 0 64 64" fill="currentColor">
              <path d="M32 8C32 8 38 24 38 36C38 44 35 50 32 52C29 50 26 44 26 36C26 24 32 8 32 8Z" />
              <path d="M20 16C20 16 30 22 34 34C30 38 22 36 18 30C14 24 20 16 20 16Z" opacity="0.85" />
              <path d="M12 24C12 24 24 26 30 36C26 42 16 40 12 34C8 28 12 24 12 24Z" opacity="0.7" />
              <path d="M44 16C44 16 34 22 30 34C34 38 42 36 46 30C50 24 44 16 44 16Z" opacity="0.85" />
              <path d="M52 24C52 24 40 26 34 36C38 42 48 40 52 34C56 28 52 24 52 24Z" opacity="0.7" />
              <path d="M22 44C22 44 28 40 32 44C28 48 22 48 22 44Z" opacity="0.5" />
              <path d="M42 44C42 44 36 40 32 44C36 48 42 48 42 44Z" opacity="0.5" />
            </svg>
          </div>

          {/* Bengali title */}
          <h3
            className="text-2xl sm:text-3xl font-bold mb-1 footer-title-shimmer"
            style={{
              fontFamily: "'Noto Serif Bengali', serif",
              background: "linear-gradient(90deg, #f5d76e, #d4a83a, #f5d76e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 100%",
            }}
          >
            দুর্গা পূজো রেডিও
          </h3>

          {/* English title */}
          <h4
            className="text-xl sm:text-2xl font-light mb-1 footer-title-shimmer"
            style={{
              background: "linear-gradient(90deg, #f5d76e, #d4a83a, #f5d76e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 100%",
              animationDelay: "0.4s",
            }}
          >
            Durga Puja Radio
          </h4>

          {/* Bengali tagline */}
          <p
            className="text-xs text-amber-600/55 mb-6"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            শারদ উৎসবের গান, একসাথে সারাক্ষণ
          </p>

          {/* Made with Devotion */}
          <p className="text-amber-500/60 text-sm italic mb-3">Made with Devotion</p>

          {/* Creator */}
          <p className="text-gray-400 text-sm mb-5">
            Created by{" "}
            <span
              className="text-white font-bold footer-title-shimmer"
              style={{
                background: "linear-gradient(90deg, #fff, #f5d76e, #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 100%",
                fontFamily: "'Noto Serif Bengali', serif",
              }}
            >
              SWARUP SARKAR
            </span>
          </p>

          {/* Social links */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="https://www.instagram.com/swarup_sarkar_1805"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-glow pink flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="text-sm">Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/share/1F1CEvZ3yv/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-glow blue flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm">Facebook</span>
            </a>
          </div>

          {/* Contact */}
          <p className="text-gray-500 text-sm mb-6">
            Contact:{" "}
            <a
              href="tel:9832586498"
              className="text-gray-400 hover:text-amber-400 transition-colors"
            >
              9832586498
            </a>
          </p>

          {/* Divider */}
          <div className="w-full h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, rgba(180,130,40,0.2), transparent)" }} />

          {/* Copyright */}
          <p className="text-gray-400 text-xs copyright-glow">
            © {new Date().getFullYear()} Durga Puja Radio. All rights reserved.
          </p>
          <p className="text-gray-500 text-[10px] mt-1">
            This website is not affiliated with YouTube. All songs are played via YouTube's public API.
          </p>
        </div>
        </footer>
      </div>
    </main>
  );
}
