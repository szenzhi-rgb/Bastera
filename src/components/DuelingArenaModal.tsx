import React from 'react';
import { ARENA_CHALLENGERS, JJK_DOMAINS } from '../game/isekai';
import { calculateAttackDamage } from '../game/rules';
import type { ArenaChallengerId, HudSnapshot } from '../game/types';

interface DuelingArenaModalProps {
  hud: HudSnapshot;
  onClose: () => void;
  onSelectChallenger: (challengerId: ArenaChallengerId) => void;
}

export const DuelingArenaModal: React.FC<DuelingArenaModalProps> = ({
  hud,
  onClose,
  onSelectChallenger,
}) => {
  const rawEstAtk = Math.round(
    calculateAttackDamage(
      {
        equippedWeapon: hud.equippedWeapon,
        stats: hud.stats,
        comboStep: 1,
        bossesDefeated: hud.bossesDefeated ?? 0,
        damageBoostMultiplier: hud.damageBoostMultiplier,
        damageBoostTimer: hud.damageBoostSeconds,
        dinoFormTimer: hud.dinoFormSeconds,
      } as Parameters<typeof calculateAttackDamage>[0],
      1,
      false,
    ),
  );
  const estAtk = Number.isFinite(rawEstAtk) ? rawEstAtk : 24;
  const baseHp = hud.arenaDuel ? Math.round(hud.maxHp / 3) : hud.maxHp;
  const matchHp = Math.max(115, baseHp) * 3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/82"
      role="dialog"
      aria-modal="true"
      aria-label="Solaris Grand Colosseum Challengers"
      data-testid="dueling-arena-modal"
    >
      <div className="relative w-full max-w-[92%] sm:max-w-4xl max-h-[86%] flex flex-col bg-[#140c16] border-2 border-amber-400 text-amber-50 shadow-[0_14px_40px_rgba(0,0,0,0.95)] overflow-hidden">
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-300" />

        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-[#241328] border-b border-amber-500/45 shrink-0">
          <div className="min-w-0">
            <h2 className="font-display text-sm sm:text-base font-bold text-amber-100 truncate">
              Solaris Grand Colosseum · {ARENA_CHALLENGERS.length} JJK Challengers
            </h2>
            <div className="flex items-center flex-wrap gap-1.5 font-pixel-mono text-[10px] sm:text-xs text-amber-200/90 mt-0.5 tabular-nums">
              <span>Wins: {hud.arenaWins}</span>
              <span aria-hidden="true">·</span>
              <span className="text-yellow-300 font-bold" data-testid="arena-star-stones">
                ★ {hud.starStones}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-fuchsia-200">3x HP ({matchHp})</span>
              <span aria-hidden="true">·</span>
              <span>~{estAtk} ATK</span>
            </div>
          </div>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-2.5 py-1 bg-[#361d2e] hover:bg-[#4b2740] border border-amber-400/75 font-pixel-mono text-[10px] sm:text-xs text-amber-100 cursor-pointer whitespace-nowrap shrink-0"
          >
            Close [Esc]
          </button>
        </div>

        {/* Fighter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-2.5 sm:p-4 overflow-y-auto">
          {ARENA_CHALLENGERS.map((ch) => {
            const domain = JJK_DOMAINS[ch.id];
            return (
              <div
                key={ch.id}
                data-testid={`arena-challenger-card-${ch.id}`}
                className="flex flex-col justify-between gap-2 p-2.5 sm:p-3 bg-[#1b1020] border border-amber-500/45 hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="inline-block w-2.5 h-2.5 border border-white/70 shrink-0"
                          style={{ backgroundColor: ch.auraColor }}
                        />
                        <h3 className="font-display text-sm font-bold text-amber-50">
                          {ch.name}
                        </h3>
                      </div>
                      <div className="font-pixel-mono text-[10px] text-cyan-300 mt-0.5">
                        {ch.title} · {ch.worldOrigin}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-[#110915] border border-purple-400/60 font-pixel-mono text-[9px] font-bold text-purple-200 shrink-0">
                      3x HP · OP AI
                    </span>
                  </div>

                  <div className="mt-2 font-pixel-mono text-[10px] text-amber-300">
                    Weapon: <span className="text-amber-100">{ch.weaponName}</span> · {matchHp} HP · Matched ATK &amp; Speed
                  </div>

                  {domain && (
                    <div
                      className="mt-1.5 px-2 py-0.5 bg-[#110818] border font-pixel-mono text-[10px] font-bold"
                      style={{ borderColor: domain.primaryColor, color: domain.secondaryColor }}
                    >
                      🌀 Domain Expansion: {domain.name}
                    </div>
                  )}

                  <p className="font-pixel-mono text-[10px] text-amber-100/80 mt-2 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {ch.skills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2 py-0.5 bg-[#120a18] border border-amber-500/40 font-pixel-mono text-[9px] text-amber-200"
                        style={{ borderColor: sk.color }}
                      >
                        ✦ {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  tabIndex={-1}
                  data-testid={`challenge-fighter-${ch.id}`}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onSelectChallenger(ch.id);
                    onClose();
                  }}
                  className="w-full py-2 bg-[#7c2d12] hover:bg-[#9a3412] border-2 border-amber-300 font-pixel-mono text-xs font-bold text-amber-50 cursor-pointer"
                >
                  CHALLENGE {ch.name.toUpperCase()} ⚔
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
