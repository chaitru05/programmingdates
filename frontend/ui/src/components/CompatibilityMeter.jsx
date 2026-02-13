import React, { useState, useEffect } from 'react';

export default function CompatibilityMeter({ percentage, coupleType }) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const p = Math.min(100, Math.max(0, Number(percentage) || 0));

  useEffect(() => {
    let raf;
    const start = Date.now();
    const duration = 1200;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      const ease = 1 - (1 - t) * (1 - t);
      setDisplayPercent(Math.round(ease * p));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [p]);

  const badgeColor = p >= 80 ? 'bg-[var(--primary-accent)]' : p >= 60 ? 'bg-[var(--secondary-accent)]' : 'bg-[var(--dark-accent)]/80';

  return (
    <div className="rounded-2xl p-6 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">❤️</span>
          <div>
            <p className="text-2xl font-bold text-[var(--dark-accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {displayPercent}% Match
            </p>
            <p className="text-sm text-[var(--dark-accent)]/80">Compatibility score</p>
          </div>
        </div>
        <div className={`rounded-full px-4 py-2 text-white text-sm font-semibold ${badgeColor}`}>
          {coupleType}
        </div>
      </div>
      <div className="mt-4 h-3 rounded-full bg-white/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--secondary-accent)] to-[var(--primary-accent)] transition-all duration-500 ease-out"
          style={{ width: `${displayPercent}%` }}
        />
      </div>
    </div>
  );
}
