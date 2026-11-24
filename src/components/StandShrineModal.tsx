import React from 'react';
import { STANDS, STAND_ORDER, STAND_SKILL_TAGS } from '../game/data';
import type { HudSnapshot, StandId } from '../game/types';
import { PixelStandPortrait } from './PixelPortrait';

interface StandShrineModalProps {
  hud: HudSnapshot;
  onClose: () => void;
  onSelectOrBuyStand: (standId: StandId) => void;
}

export const StandShrineModal: React.FC<StandShrineModalProps> = ({
  hud,
  onClose,
  onSelectOrBuyStand,
}) => {
  const activeStand = STANDS[hud.equippedStand];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/82"
      role="dialog"
      aria-modal="true"
      aria-label="Royal Stand Shrine"
      data-testid="stand-shrine-modal"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#140a10] border-2 border-amber-400 text-amber-50 shadow-[0_14px_40px_rgba(0,0,0,0.95)] overflow-hidden">
        <span className="absolute top-0 left-0 w-2 h-2 bg-amber-300" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-amber-300" />
        <span className="absolute bottom-0 left-0 w-2 h-2 bg-amber-300" />
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-amber-300" />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#240f1a] border-b border-amber-500/45">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-amber-100">
              Royal Stand Shrine · Solaris Sanctuary
            </h2>
            <div className="flex items-center flex-wrap gap-2 text-xs font-pixel-mono text-amber-200/85 mt-1">
              <span>Equipped: {activeStand.name}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums text-yellow-300 font-bold" data-testid="shrine-star-stones">
                ★ {hud.starStones} Star Stones
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums text-amber-200/75">
                {hud.unlockedStands.length}/{STAND_ORDER.length} Stands Awakened
              </span>
            </div>
            <p className="font-pixel-mono text-[11px] text-amber-100/70 mt-1">
              Earn ★ 2–3 Star Stones per victory in the Solaris JJK Colosseum. Awakening a Stand replaces your [3] skill ({hud.equippedStand === 'gyro_ball' ? 'Gyro Ball also replaces [J]' : 'and equips immediately'}).
            </p>
          </div>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-4 py-2 bg-[#381421] hover:bg-[#4e1b2d] border border-amber-400/75 font-pixel-mono text-xs font-medium text-amber-100 cursor-pointer whitespace-nowrap shrink-0"
          >
            Close [Esc]
          </button>
        </div>

        {/* 10 JJBA Pixel Stand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 overflow-y-auto">
          {STAND_ORDER.map((standId) => {
            const def = STANDS[standId];
            const unlocked = hud.unlockedStands.includes(standId);
            const equipped = hud.equippedStand === standId;
            const canAfford = hud.starStones >= def.costStarStones;
            const skillTag = STAND_SKILL_TAGS[standId];

            return (
              <div
                key={standId}
                data-testid={`stand-card-${standId}`}
                className={`flex flex-col justify-between gap-3 p-4 border transition-colors ${
                  equipped
                    ? 'bg-[#25101d] border-amber-300'
                    : 'bg-[#1a0d15] border-amber-500/35 hover:border-amber-400/75'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <PixelStandPortrait standId={standId} size={60} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-bold text-amber-50 truncate">
                        {def.name}
                      </h3>
                      <span
                        className={`font-pixel-mono text-xs font-bold tabular-nums shrink-0 ${
                          equipped
                            ? 'text-emerald-300'
                            : unlocked
                              ? 'text-sky-300'
                              : canAfford
                                ? 'text-yellow-300'
                                : 'text-amber-200/60'
                        }`}
                      >
                        {def.costStarStones === 0 ? 'Starter Stand' : `★ ${def.costStarStones}`}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-1.5 font-pixel-mono text-[11px] text-amber-200/80 mt-0.5">
                      <span>{def.jjbaUser}</span>
                      <span aria-hidden="true">·</span>
                      <span>{def.roleTag}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-300">[3] {skillTag}</span>
                    </div>

                    <div className="font-pixel-mono text-[11px] font-semibold text-amber-100 mt-1.5">
                      {def.abilityName}
                    </div>
                    <p className="font-pixel-mono text-[11px] text-amber-100/75 mt-1 leading-relaxed">
                      {def.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-amber-500/20">
                  <span className="font-pixel-mono text-[11px] text-amber-200/75">
                    {equipped
                      ? 'Active Stand'
                      : unlocked
                        ? 'Awakened · Ready'
                        : canAfford
                          ? `Ready to Awaken (★ ${def.costStarStones})`
                          : `Requires ★ ${def.costStarStones} Star Stones`}
                  </span>

                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={equipped || (!unlocked && !canAfford)}
                    data-testid={`stand-action-${standId}`}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onSelectOrBuyStand(standId);
                    }}
                    className={`px-4 py-2 border font-pixel-mono text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                      equipped
                        ? 'bg-[#173023] border-emerald-400/70 text-emerald-200 cursor-default'
                        : unlocked
                          ? 'bg-[#5c1d2e] hover:bg-[#76253b] border-amber-300 text-amber-50 cursor-pointer'
                          : canAfford
                            ? 'bg-[#7c2d12] hover:bg-[#9a3412] border-yellow-300 text-yellow-50 cursor-pointer'
                            : 'bg-[#1f1318] border-amber-500/25 text-amber-200/40 cursor-not-allowed'
                    }`}
                  >
                    {equipped
                      ? 'Equipped'
                      : unlocked
                        ? 'Equip Stand'
                        : `Awaken (★ ${def.costStarStones})`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
