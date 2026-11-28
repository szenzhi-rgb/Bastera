import React from 'react';
import type { ElfCutsceneHud, WarriorCustomization, WeaponId } from '../game/types';
import { PixelWarriorPortrait } from './PixelPortrait';

interface ElfCutsceneModalProps {
  cutscene: ElfCutsceneHud;
  equippedWeapon: WeaponId;
  customization: WarriorCustomization;
  onSelectChoice: (choiceId: string) => void;
  onAdvance: () => void;
}

const PORTRAIT_BADGE: Record<ElfCutsceneHud['portraitKind'], { bg: string; glyph: string; border: string }> = {
  queen: { bg: '#064e3b', glyph: '♛', border: '#6ee7b7' },
  swordsman: { bg: '#0f2922', glyph: '⚔', border: '#34d399' },
  herald: { bg: '#1e293b', glyph: '⚑', border: '#fde047' },
  boss: { bg: '#3b071e', glyph: '☠', border: '#fb7185' },
  warrior: { bg: '#1e1b2e', glyph: '🛡', border: '#fbbf24' },
};

export const ElfCutsceneModal: React.FC<ElfCutsceneModalProps> = ({
  cutscene,
  equippedWeapon,
  customization,
  onSelectChoice,
  onAdvance,
}) => {
  const badge = PORTRAIT_BADGE[cutscene.portraitKind];
  const isCoronation = cutscene.act === 'coronation';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/82"
      role="dialog"
      aria-modal="true"
      aria-label="Elf Kingdom Cutscene"
      data-testid="elf-cutscene-modal"
    >
      <div
        className={`relative w-full max-w-[92%] sm:max-w-lg max-h-[86%] flex flex-col border-2 p-2.5 sm:p-4 text-emerald-50 shadow-[0_12px_36px_rgba(0,0,0,0.95)] overflow-y-auto ${
          isCoronation
            ? 'bg-[#091c15] border-emerald-300'
            : cutscene.portraitKind === 'boss'
              ? 'bg-[#1c0812] border-rose-400'
              : 'bg-[#0b1713] border-emerald-400/85'
        }`}
      >
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-emerald-300" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-300" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-emerald-300" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-300" />

        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-emerald-500/35 pb-1.5 mb-2">
          <div className="font-pixel-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-emerald-300 uppercase truncate">
            {isCoronation
              ? 'AETHELGARD EMERALD CORONATION'
              : 'SILVER-BOUGH ROYAL DINNER PARTY'}
          </div>
          <span className="font-pixel-mono text-[9px] text-amber-200 tabular-nums shrink-0">
            SCENE {cutscene.beatIndex + 1}/{cutscene.totalBeats}
          </span>
        </div>

        {/* Speaker Portrait & Title */}
        <div className="flex items-start gap-2.5 sm:gap-3 bg-[#070f0c]/85 border border-emerald-500/30 p-2 sm:p-3 mb-2">
          {cutscene.portraitKind === 'warrior' ? (
            <PixelWarriorPortrait
              weaponId={equippedWeapon}
              customization={customization}
              size={44}
            />
          ) : (
            <div
              className="w-11 h-11 shrink-0 border-2 flex items-center justify-center font-pixel-mono text-lg font-bold"
              style={{
                backgroundColor: badge.bg,
                borderColor: badge.border,
                color: badge.border,
              }}
            >
              {badge.glyph}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <h3 className="font-display text-sm sm:text-base font-bold text-amber-100 truncate">
                {cutscene.speaker}
              </h3>
              <span className="font-pixel-mono text-[8px] sm:text-[9px] text-emerald-300/90 uppercase">
                {cutscene.moodLabel}
              </span>
            </div>
            <div className="font-pixel-mono text-[9px] text-emerald-200/75 mb-1">
              {cutscene.speakerTitle}
            </div>
            <div className="space-y-1">
              {cutscene.lines.map((line, i) => (
                <p
                  key={i}
                  className="font-pixel-mono text-[10px] sm:text-xs text-emerald-50 leading-snug"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Reply Banner */}
        {cutscene.chosenReply && (
          <div
            data-testid="elf-cutscene-reply"
            className="mb-2 p-2 bg-[#11261e] border border-amber-300/65 font-pixel-mono text-[10px] text-amber-100 leading-snug"
          >
            {cutscene.chosenReply}
          </div>
        )}

        {/* Dinner Party Choices */}
        {cutscene.choices && cutscene.choices.length > 0 && !cutscene.chosenReply && (
          <div className="space-y-1.5 mb-2" data-testid="elf-cutscene-choices">
            <div className="font-pixel-mono text-[9px] text-amber-300 uppercase">
              Choose your response:
            </div>
            {cutscene.choices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                data-testid={`elf-choice-${ch.id}`}
                onClick={() => onSelectChoice(ch.id)}
                className="w-full text-left px-2.5 py-1.5 bg-[#102920] hover:bg-[#16382b] border border-emerald-400/70 hover:border-amber-300 flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="font-pixel-mono text-[10px] sm:text-xs text-emerald-50 leading-tight">
                  {ch.label}
                </span>
                {ch.bonusTag && (
                  <span className="font-pixel-mono text-[8px] sm:text-[9px] font-bold text-amber-300 shrink-0 whitespace-nowrap">
                    {ch.bonusTag}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Continue Button */}
        {cutscene.canAdvance && (
          <div className="flex justify-end pt-1 border-t border-emerald-500/25">
            <button
              type="button"
              data-testid="elf-cutscene-next-btn"
              onClick={onAdvance}
              className={`px-4 py-1.5 border-2 font-pixel-mono text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                cutscene.portraitKind === 'boss'
                  ? 'bg-rose-800 hover:bg-rose-700 border-rose-200 text-white'
                  : 'bg-emerald-800 hover:bg-emerald-700 border-emerald-200 text-white'
              }`}
            >
              {cutscene.beatIndex >= cutscene.totalBeats - 1
                ? isCoronation
                  ? 'Claim Emerald Crown & Feast'
                  : 'Draw Steel · Defend the Hall!'
                : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
