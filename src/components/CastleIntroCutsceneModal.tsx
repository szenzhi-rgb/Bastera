import React, { useState } from 'react';
import kingBowImg from '../assets/images/castle_cutscene_king_bow_1795870493572.jpg';
import enterTreasuryImg from '../assets/images/castle_cutscene_enter_treasury_1795870494762.jpg';

interface CastleIntroCutsceneModalProps {
  playerName: string;
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 'king_bow',
    badge: 'ACT I · ROYAL AUDIENCE',
    speaker: 'King Aldric of Bastera',
    caption:
      'The sovereign drops to one knee before you in the candle-lit throne hall: "Brave warrior, an ancient hex grips my vault—please investigate my royal treasury."',
  },
  {
    id: 'curse_corridor',
    badge: 'ACT II · CORRIDOR OF SHADOWS',
    speaker: playerNamePlaceholder(),
    caption: '"It\'s that curse again."',
  },
  {
    id: 'enter_treasury',
    badge: 'ACT III · THE ROYAL TREASURY',
    speaker: 'Sealed Vault Threshold',
    caption:
      'Steel drawn, you push past the towering gilded doors into the candle-lit royal treasury where 120 cursed guardians await.',
  },
] as const;

function playerNamePlaceholder(): string {
  return 'Warrior';
}

export const CastleIntroCutsceneModal: React.FC<CastleIntroCutsceneModalProps> = ({
  playerName,
  onComplete,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = SLIDES[slideIndex] ?? SLIDES[0];
  const cleanName = playerName.trim() || 'Warrior';
  const speakerName = slideIndex === 1 ? cleanName : slide.speaker;

  const handleNext = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Enter Castle Intro Cutscene"
      data-testid="castle-intro-cutscene-modal"
    >
      <div className="relative w-full max-w-[92%] sm:max-w-lg max-h-[88%] flex flex-col bg-[#12090d] border-2 border-amber-400/90 text-amber-50 shadow-[0_12px_36px_rgba(0,0,0,0.96)] overflow-hidden">
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-300 z-10" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-300 z-10" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-300 z-10" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-300 z-10" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-[#201016] border-b border-amber-500/40 shrink-0">
          <span className="font-pixel-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-amber-300 uppercase">
            {slide.badge}
          </span>
          <span className="font-pixel-mono text-[9px] text-amber-200/80 tabular-nums">
            {slideIndex + 1} / {SLIDES.length}
          </span>
        </div>

        {/* Visual Scene Frame */}
        <div className="relative w-full h-36 sm:h-60 bg-[#090508] border-b border-amber-500/35 overflow-hidden shrink-0">
          {slideIndex === 0 && (
            <img
              src={kingBowImg}
              alt="King bowing to the warrior in the castle asking him to investigate his treasury"
              className="w-full h-full object-cover object-center"
            />
          )}

          {slideIndex === 1 && (
            <svg
              viewBox="0 0 640 340"
              className="w-full h-full"
              role="img"
              aria-label="Warrior inside the cursed castle corridor saying it's that curse again"
            >
              <defs>
                <linearGradient id="castleCurseSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09050f" />
                  <stop offset="55%" stopColor="#1b0b22" />
                  <stop offset="100%" stopColor="#11080c" />
                </linearGradient>
                <radialGradient id="curseAuraGlow" cx="62%" cy="52%" r="48%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.65" />
                  <stop offset="60%" stopColor="#6b21a8" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#09050f" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="640" height="340" fill="url(#castleCurseSky)" />
              <rect width="640" height="340" fill="url(#curseAuraGlow)" />
              {/* Gothic stone arches */}
              <path d="M55 300 L55 95 Q115 28 175 95 L175 300 Z" fill="#140c16" stroke="#3b2130" strokeWidth="3" />
              <path d="M235 300 L235 80 Q320 14 405 80 L405 300 Z" fill="#0d0712" stroke="#4c283e" strokeWidth="3" />
              <path d="M465 300 L465 95 Q525 28 585 95 L585 300 Z" fill="#140c16" stroke="#3b2130" strokeWidth="3" />
              {/* Crimson royal carpet */}
              <polygon points="0,300 640,300 640,340 0,340" fill="#231218" />
              <polygon points="150,300 490,300 540,340 100,340" fill="#6b111d" stroke="#d97706" strokeWidth="2" />
              {/* Wall sconces */}
              <rect x="200" y="138" width="8" height="24" fill="#d97706" />
              <circle cx="204" cy="131" r="7" fill="#fbbf24" />
              <rect x="432" y="138" width="8" height="24" fill="#d97706" />
              <circle cx="436" cy="131" r="7" fill="#c084fc" />
              {/* Creeping cursed runes & violet tendrils */}
              <path d="M350 288 Q395 230 448 242 T560 198" fill="none" stroke="#c084fc" strokeWidth="4" strokeOpacity="0.8" />
              <path d="M380 296 Q435 262 490 278 T610 236" fill="none" stroke="#e879f9" strokeWidth="2.5" strokeOpacity="0.7" />
              <polygon points="485,155 504,185 485,215 466,185" fill="none" stroke="#f0abfc" strokeWidth="2.5" />
              <circle cx="485" cy="185" r="7" fill="#e879f9" />
              {/* Armored Warrior silhouette turning back toward cursed mist */}
              <path d="M168 186 L132 292 L182 292 Z" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="2" />
              <rect x="164" y="176" width="38" height="68" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="166" y="138" width="32" height="36" fill="#64748b" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="178" y="150" width="18" height="6" fill="#fde047" />
              <path d="M174 138 Q182 114 202 126" fill="none" stroke="#fbbf24" strokeWidth="5" />
              <rect x="166" y="244" width="14" height="54" fill="#334155" />
              <rect x="186" y="244" width="14" height="54" fill="#334155" />
              {/* Drawn steel sword */}
              <polygon points="204,208 292,162 298,170 208,216" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="198" y="204" width="8" height="18" transform="rotate(-26 202 213)" fill="#d97706" />
              {/* Crisp comic speech callout */}
              <rect x="218" y="64" width="234" height="44" fill="#09050a" fillOpacity="0.92" stroke="#fde047" strokeWidth="2" />
              <text
                x="335"
                y="91"
                textAnchor="middle"
                fill="#fef3c7"
                fontFamily="JetBrains Mono, monospace"
                fontSize="15"
                fontWeight="700"
              >
                &quot;It&apos;s that curse again.&quot;
              </text>
            </svg>
          )}

          {slideIndex === 2 && (
            <img
              src={enterTreasuryImg}
              alt="Warrior entering the grand royal treasury doors"
              className="w-full h-full object-cover object-center"
            />
          )}
        </div>

        {/* Caption & Controls */}
        <div className="p-2.5 sm:p-3.5 flex flex-col justify-between gap-2 bg-[#160b10]">
          <div>
            <div className="font-pixel-mono text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase">
              {speakerName}
            </div>
            <p className="font-pixel-mono text-[10px] sm:text-xs text-amber-50 leading-snug mt-0.5">
              {slide.caption}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-500/25">
            <div className="flex items-center gap-1">
              {SLIDES.map((s, idx) => (
                <span
                  key={s.id}
                  className={`h-1.5 transition-all ${
                    idx === slideIndex
                      ? 'w-5 bg-amber-300'
                      : idx < slideIndex
                        ? 'w-2.5 bg-amber-600'
                        : 'w-2.5 bg-amber-950 border border-amber-700/50'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              data-testid="castle-cutscene-next-btn"
              onClick={handleNext}
              className="px-4 py-1.5 bg-[#991b1b] hover:bg-[#b91c1c] border-2 border-amber-300 font-pixel-mono text-xs font-bold text-amber-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
