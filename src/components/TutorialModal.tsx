import React from 'react';
import { SKILLS, STANDS, WEAPONS } from '../game/data';
import type { SkillId, StandId, WeaponId } from '../game/types';
import { PixelSkillIcon, PixelStandPortrait, PixelWeaponIcon } from './PixelPortrait';

interface TutorialModalProps {
  equippedWeapon?: WeaponId;
  equippedStand?: StandId;
  skillSlots?: [SkillId, SkillId, SkillId];
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  equippedWeapon = 'claymore',
  equippedStand = 'star_platinum',
  skillSlots = ['blade_dash', 'candlefire_wave', 'stand_rush'],
  onClose,
}) => {
  const weapon = WEAPONS[equippedWeapon];
  const stand = STANDS[equippedStand];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/82"
      role="dialog"
      aria-modal="true"
      aria-label="How to Fight and Controls Manual"
      data-testid="tutorial-modal"
    >
      <div className="relative w-full max-w-[92%] sm:max-w-3xl max-h-[86%] overflow-y-auto bg-[#140c10] border-2 border-amber-400/80 p-3 sm:p-5 text-amber-50 shadow-[0_14px_42px_rgba(0,0,0,0.94)] space-y-3 sm:space-y-4">
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-300" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-amber-500/30 pb-2">
          <div className="min-w-0">
            <div className="font-pixel-mono text-[8.5px] sm:text-[10px] tracking-[0.2em] text-amber-300 uppercase">
              CITADEL &amp; SOLARIS COMBAT MANUAL
            </div>
            <h2 className="font-display text-base sm:text-xl font-bold text-amber-100 mt-0.5">
              How to Fight
            </h2>
            <p className="font-pixel-mono text-[9.5px] sm:text-[11px] text-amber-100/75 mt-0.5">
              Sword combos, White Aura Overdrive, Stand Guard parries &amp; Solaris Guild hunting.
            </p>
          </div>
          <button
            type="button"
            tabIndex={-1}
            data-testid="close-tutorial-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-2.5 py-1 bg-[#26131a] hover:bg-[#3a1d27] border border-amber-400/70 font-pixel-mono text-[10px] sm:text-xs font-bold text-amber-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Close [Esc]
          </button>
        </div>

        {/* Highlighted Special Double-Tap Techniques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-[#1b1a23] border border-white/65 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-pixel-mono text-xs font-bold text-white tracking-wide">
                WHITE AURA OVERDRIVE
              </span>
              <span className="font-pixel-mono text-[10px] font-bold text-cyan-200 tabular-nums whitespace-nowrap">
                2x [SHIFT] · 1.5s INVULN
              </span>
            </div>
            <p className="font-pixel-mono text-[11px] text-slate-200 leading-relaxed">
              Press <strong className="text-white">[Shift] twice</strong> or click{' '}
              <strong className="text-white">[SHFT] DASH twice</strong> within{' '}
              <span className="tabular-nums text-cyan-200">0.48s</span>. You ignite in a blazing white aura:
            </p>
            <ul className="font-pixel-mono text-[10px] text-amber-100/90 space-y-1">
              <li>* Complete invincibility to blades, hazards &amp; projectiles for 1.5s</li>
              <li>* +30% movement speed burst for aggressive positioning or escapes</li>
              <li>* Leaking white aura wisps &amp; luminous dash afterimages (6.0s cooldown)</li>
            </ul>
          </div>

          <div className="bg-[#1b0e28] border border-fuchsia-400/80 p-3.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <PixelStandPortrait standId={equippedStand} size={42} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-pixel-mono text-xs font-bold text-fuchsia-200 tracking-wide">
                    DEFENSIVE STAND GUARD
                  </span>
                  <span className="font-pixel-mono text-[10px] font-bold text-yellow-300 tabular-nums whitespace-nowrap">
                    2x [3] · 1.5s BARRIER
                  </span>
                </div>
                <div className="font-pixel-mono text-[10px] text-purple-200/80">
                  Equipped: {stand.name}
                </div>
              </div>
            </div>
            <p className="font-pixel-mono text-[11px] text-purple-100 leading-relaxed">
              Press <strong className="text-yellow-200">[3] / [R] twice</strong> or click your{' '}
              <strong className="text-yellow-200">Stand slot twice</strong> within{' '}
              <span className="tabular-nums text-yellow-200">0.48s</span> to project a defensive barrier:
            </p>
            <ul className="font-pixel-mono text-[10px] text-purple-100/90 space-y-1">
              <li>* Blocks melee strikes &amp; reflects enemy projectiles at 1.8x damage</li>
              <li>* Deals rapid shockwave counter-damage around you for 1.5s (7.0s cooldown)</li>
            </ul>
          </div>
        </div>

        {/* Core Weapons & Skills Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-[#191015] border border-amber-500/40 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <PixelWeaponIcon weaponId={equippedWeapon} size={38} />
              <div>
                <div className="font-pixel-mono text-[10px] text-amber-300 uppercase tracking-wider">
                  Swordplay &amp; Combos
                </div>
                <div className="font-display text-sm font-bold text-amber-100">
                  {weapon.name}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 font-pixel-mono text-[10px] text-amber-100/85 leading-relaxed">
              <div>
                <strong className="text-amber-300">[J] or [Z]</strong> · Execute 3-hit sword combo slashes. Chain hits before enemies recover.
              </div>
              <div>
                <strong className="text-cyan-200">[J] + [Shift]</strong> · Rapid input unleashes a piercing <strong>Wind Spin Poke Dash</strong>.
              </div>
              <div>
                <strong className="text-amber-300">[H]</strong> · Drink a Healing Potion Vial quickly during intense boss clashes.
              </div>
            </div>
          </div>

          <div className="bg-[#191015] border border-amber-500/40 p-3.5 space-y-2.5">
            <div className="font-pixel-mono text-[10px] text-amber-300 uppercase tracking-wider">
              3-Slot Active Skill Loadout
            </div>
            <div className="space-y-2">
              {skillSlots.map((sid, idx) => {
                const skill = SKILLS[sid];
                return (
                  <div key={sid} className="flex items-start gap-2.5">
                    <PixelSkillIcon skillId={sid} size={30} />
                    <div className="min-w-0 flex-1 font-pixel-mono text-[10px] leading-snug">
                      <div className="text-amber-100 font-bold">
                        [{idx + 1}] {skill.name}{' '}
                        <span className="text-amber-300/80 tabular-nums">({skill.staminaCost} ST)</span>
                      </div>
                      <div className="text-amber-200/75">{skill.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Movement, Exploration & Progression Table */}
        <div className="bg-[#110a0d] border border-amber-500/35 p-3.5 space-y-2.5">
          <div className="font-pixel-mono text-[10px] text-amber-300 uppercase tracking-wider">
            Controls &amp; Realm Exploration
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 font-pixel-mono text-[10px]">
            <div className="text-amber-100">
              <span className="text-yellow-300 font-bold">[A] / [D]</span> · Move Left / Right
            </div>
            <div className="text-amber-100">
              <span className="text-yellow-300 font-bold">[Space] / [W]</span> · Jump &amp; Air Dodge
            </div>
            <div className="text-amber-100">
              <span className="text-yellow-300 font-bold">[F] / [E]</span> · Enter Doors, Shops &amp; Talk
            </div>
            <div className="text-amber-100">
              <span className="text-yellow-300 font-bold">[C]</span> · Sanctuary (Style, Gear &amp; Stats)
            </div>
            <div className="text-amber-100">
              <span className="text-yellow-300 font-bold">[Q]</span> · Solaris Side Quests &amp; Choices
            </div>
            <div className="text-amber-100">
              <span className="text-yellow-300 font-bold">[I] / [K] / [M]</span> · Bag · Status · Codex Map
            </div>
          </div>
          <div className="pt-2 border-t border-amber-500/20 font-pixel-mono text-[10px] text-amber-200/80 leading-relaxed">
            Citadel Path: Defeat all 15 Guardians and Gyro Zeppeli, or use <strong className="text-sky-300">Enter Isekai</strong> on the Title Screen to enter Solaris Town, climb Guild Ranks F–S, and investigate dark conspiracies through the East Gate into Outskirts Forest &amp; Caves.
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-5 py-2 bg-[#991b1b] hover:bg-[#b91c1c] border border-amber-300 font-pixel-mono text-xs font-bold text-amber-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Back to Battle
          </button>
        </div>
      </div>
    </div>
  );
};
