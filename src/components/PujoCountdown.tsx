import { useState, useEffect, useCallback } from "react";
import pujaLogo from "../assets/puja-logo.png";

const PUJO_DATES = [
  { name: "মহালয়া",       date: new Date("2026-10-10T05:30:00"), day: "10", dateLabel: "10 October, Saturday" },
  { name: "মহা ষষ্ঠী",     date: new Date("2026-10-16T06:00:00"), day: "16", dateLabel: "16 October, Friday" },
  { name: "মহা সপ্তমী",    date: new Date("2026-10-17T06:00:00"), day: "17-18", dateLabel: "17 & 18 October, Saturday & Sunday" },
  { name: "মহা অষ্টমী",    date: new Date("2026-10-19T06:00:00"), day: "19", dateLabel: "19 October, Monday" },
  { name: "মহা নবমী",      date: new Date("2026-10-20T06:00:00"), day: "20", dateLabel: "20 October, Tuesday" },
  { name: "বিজয়া দশমী",   date: new Date("2026-10-21T06:00:00"), day: "21", dateLabel: "21 October, Wednesday" },
];

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number; total: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total:   diff,
  };
}

function getNextIdx(): number {
  const now = Date.now();
  for (let i = 0; i < PUJO_DATES.length; i++) {
    if (PUJO_DATES[i].date.getTime() > now) return i;
  }
  return PUJO_DATES.length - 1;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function PujoCountdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState<TimeLeft[]>(() => PUJO_DATES.map((d) => calcTimeLeft(d.date)));
  const [nextIdx, setNextIdx] = useState(getNextIdx);

  const tick = useCallback(() => {
    setCounts(PUJO_DATES.map((d) => calcTimeLeft(d.date)));
    setNextIdx(getNextIdx());
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  const nextCount = counts[nextIdx];

  return (
    <>
      {/* Floating circular button — top right */}
      <button
        onClick={() => setIsOpen(true)}
        className="countdown-button absolute right-3 top-0 z-40 w-14 h-14 md:h-16 md:w-16 rounded-full overflow-hidden shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{ boxShadow: "0 4px 20px rgba(180,100,20,0.4), 0 0 0 2px rgba(200,150,40,0.25)" }}
        title="পুজো কাউন্টডাউন"
      >
        <img src={pujaLogo} alt="Durga Puja" className="w-full h-full object-cover" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full border-2 border-amber-400/40 countdown-ring pointer-events-none" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20 md:pt-24"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />

          {/* Modal card */}
          <div
            className="countdown-modal relative z-10 w-full max-w-md max-h-[88vh] overflow-y-auto custom-scrollbar rounded-2xl"
            style={{ background: "linear-gradient(160deg, #1e0c0a, #160707)", border: "1px solid rgba(180,130,40,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="px-6 pt-7 pb-6">
              {/* Title */}
              <div className="text-center mb-6">
                <h2
                  className="text-2xl md:text-3xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  দুর্গা পূজা ২০২৬
                </h2>
                <p className="text-amber-500/70 text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                  কাউন্টডাউন
                </p>
              </div>

              {/* Next event highlight box */}
              <div
                className="rounded-xl p-5 mb-5"
                style={{ background: "rgba(180,120,20,0.08)", border: "1px solid rgba(180,130,40,0.18)" }}
              >
                <p
                  className="text-center text-xs text-amber-500/70 mb-4 uppercase tracking-widest"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  পরবর্তী অনুষ্ঠান
                </p>

                {/* Big countdown numbers */}
                <div className="flex items-baseline justify-center gap-3 mb-4">
                  {[
                    { val: nextCount.days,    label: "দিন" },
                    { val: nextCount.hours,   label: "ঘণ্টা" },
                    { val: nextCount.minutes, label: "মিনিট" },
                    { val: nextCount.seconds, label: "সেকেন্ড", amber: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-baseline gap-1">
                      {i > 0 && <span className="text-white/40 text-xl font-light mb-4">:</span>}
                      <div className="text-center">
                        <div className={`text-3xl md:text-4xl font-bold ${item.amber ? "text-amber-400" : "text-white"}`}>
                          {item.amber ? pad(item.val) : item.val}
                        </div>
                        <div
                          className="text-[10px] text-gray-500 mt-1"
                          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p
                  className="text-center text-base font-semibold text-amber-200"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  {PUJO_DATES[nextIdx].name}
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  {PUJO_DATES[nextIdx].dateLabel}, 2026
                </p>
              </div>

              {/* All events list */}
              <div className="space-y-2.5">
                {PUJO_DATES.map((event, i) => {
                  const c = counts[i];
                  const isNext = i === nextIdx && c.total > 0;
                  const isDone = c.total === 0;

                  return (
                    <div
                      key={event.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: isNext ? "rgba(180,130,20,0.12)" : "rgba(255,255,255,0.03)",
                        border: isNext ? "1px solid rgba(180,130,40,0.25)" : "1px solid rgba(255,255,255,0.05)",
                        opacity: isDone ? 0.45 : 1,
                      }}
                    >
                      {/* Day circle */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: isNext ? "#d4930a" : "rgba(255,255,255,0.08)",
                          color: isNext ? "#000" : isDone ? "#666" : "#ccc",
                        }}
                      >
                        {event.day}
                      </div>

                      {/* Name + date */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold"
                          style={{
                            fontFamily: "'Noto Serif Bengali', serif",
                            color: isNext ? "#f5d76e" : isDone ? "#666" : "#ddd",
                          }}
                        >
                          {event.name}
                        </p>
                        <p className="text-[10px] text-gray-600">
                          {event.dateLabel}
                        </p>
                      </div>

                      {/* Countdown */}
                      {isDone ? (
                        <span className="text-xs text-gray-600">সম্পন্ন ✓</span>
                      ) : (
                        <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                          <span className={isNext ? "text-amber-400" : ""}>{c.days}d</span>
                          <span className="text-gray-700 mx-0.5">:</span>
                          <span className={isNext ? "text-amber-400" : ""}>{pad(c.hours)}h</span>
                          <span className="text-gray-700 mx-0.5">:</span>
                          <span className={isNext ? "text-amber-400" : ""}>{pad(c.minutes)}m</span>
                          <span className="text-gray-700 mx-0.5">:</span>
                          <span className={isNext ? "text-amber-300 font-bold" : ""}>{pad(c.seconds)}s</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
