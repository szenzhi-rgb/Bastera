import React, { useMemo, useState } from 'react';
import {
  RAIDER_DUNGEONS,
  RAIDER_RANKS,
  getNextRaiderRankInfo,
  getRaiderRankDef,
  isRaiderDungeonUnlocked,
} from '../game/raiderGuild';
import type { HudSnapshot, RaiderRankId } from '../game/types';

interface RaiderGuildModalProps {
  hud: HudSnapshot;
  onClose: () => void;
  onEnterDungeon: (dungeonId: number) => { ok: boolean; message: string };
}

export const RaiderGuildModal: React.FC<RaiderGuildModalProps> = ({
  hud,
  onClose,
  onEnterDungeon,
}) => {
  const [rankFilter, setRankFilter] = useState<'ALL' | RaiderRankId>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'cleared'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rankDef = getRaiderRankDef(hud.raiderRank);
  const nextInfo = getNextRaiderRankInfo(hud.raiderPoints);

  const filteredDungeons = useMemo(() => {
    return RAIDER_DUNGEONS.filter((d) => {
      if (rankFilter !== 'ALL' && d.requiredRank !== rankFilter) return false;
      const unlocked = isRaiderDungeonUnlocked(d, hud.raiderRank);
      const cleared = hud.clearedRaiderDungeons.includes(d.id);
      if (statusFilter === 'unlocked' && !unlocked) return false;
      if (statusFilter === 'cleared' && !cleared) return false;
      return true;
    });
  }, [rankFilter, statusFilter, hud.raiderRank, hud.clearedRaiderDungeons]);

  const handleDispatch = (dungeonId: number) => {
    const res = onEnterDungeon(dungeonId);
    if (!res.ok) {
      setErrorMsg(res.message);
      return;
    }
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/84"
      role="dialog"
      aria-modal="true"
      aria-label="Dungeon Raider Guild Dispatch"
      data-testid="raider-guild-modal"
    >
      <div className="relative w-full max-w-[94%] sm:max-w-3xl max-h-[86%] flex flex-col bg-[#110a14] border-2 border-purple-400/85 text-amber-50 shadow-[0_12px_36px_rgba(0,0,0,0.95)] overflow-hidden">
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-purple-300" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-purple-300" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-purple-300" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-purple-300" />

        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1d0f26] border-b border-purple-400/45 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-display text-sm sm:text-base font-bold text-amber-100">
                Dungeon Raider Guild · {RAIDER_DUNGEONS.length} Dungeons
              </h2>
              <span
                data-testid="raider-rank-badge"
                className="px-1.5 py-0.5 border font-pixel-mono text-[9px] font-bold whitespace-nowrap"
                style={{
                  borderColor: rankDef.borderColor,
                  color: rankDef.borderColor,
                  backgroundColor: '#13091a',
                }}
              >
                {rankDef.id} · {rankDef.title}
              </span>
            </div>
            <div className="font-pixel-mono text-[9px] sm:text-[10px] text-purple-200/85 mt-0.5 flex flex-wrap items-center gap-x-2 tabular-nums">
              <span>Pts: <strong className="text-yellow-300">{hud.raiderPoints}</strong></span>
              <span>Cleared: <strong className="text-emerald-300">{hud.clearedRaiderDungeons.length}/{RAIDER_DUNGEONS.length}</strong></span>
              <span>Bonus: <strong className="text-cyan-300">+{rankDef.atkBonusPct}% ATK · +{rankDef.goldBonusPct}% Gold</strong></span>
              {nextInfo.next && (
                <span className="text-amber-200/80">Next ({nextInfo.next.id}): {nextInfo.pointsToNext} pts</span>
              )}
            </div>
          </div>
          <button
            type="button"
            tabIndex={-1}
            data-testid="raider-guild-close-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-2.5 py-1 bg-[#2b1538] hover:bg-[#3f1f52] border border-purple-300/80 font-pixel-mono text-[10px] sm:text-xs text-purple-100 cursor-pointer whitespace-nowrap shrink-0"
          >
            Close [Esc]
          </button>
        </div>

        {/* Rank & Filter Strip */}
        <div className="px-3 py-1.5 bg-[#0d0711] border-b border-purple-500/25 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setRankFilter('ALL')}
              className={`px-2 py-0.5 border font-pixel-mono text-[9px] whitespace-nowrap shrink-0 cursor-pointer ${
                rankFilter === 'ALL'
                  ? 'bg-purple-800 border-amber-300 text-white font-bold'
                  : 'bg-[#190e20] border-purple-700/50 text-purple-200/80'
              }`}
            >
              All 108
            </button>
            {RAIDER_RANKS.map((r) => (
              <button
                key={r.id}
                type="button"
                data-testid={`raider-filter-${r.id}`}
                onClick={() => setRankFilter(r.id)}
                className={`px-2 py-0.5 border font-pixel-mono text-[9px] whitespace-nowrap shrink-0 cursor-pointer ${
                  rankFilter === r.id
                    ? 'bg-purple-800 border-amber-300 text-white font-bold'
                    : 'bg-[#190e20] border-purple-700/50 text-purple-200/80'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {(
                [
                  ['all', 'All'],
                  ['unlocked', 'Unlocked'],
                  ['cleared', 'Cleared'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setStatusFilter(k)}
                  className={`px-2 py-0.5 border font-pixel-mono text-[9px] cursor-pointer whitespace-nowrap ${
                    statusFilter === k
                      ? 'bg-[#7c2d12] border-amber-300 text-amber-50 font-bold'
                      : 'bg-[#150b1a] border-purple-800/60 text-purple-200/75'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="font-pixel-mono text-[9px] text-purple-200/70 tabular-nums">
              Showing {filteredDungeons.length} dungeons
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="px-3 py-1 bg-rose-950 border-b border-rose-400 font-pixel-mono text-[10px] text-rose-100 shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Dungeon List */}
        <div className="p-2.5 sm:p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredDungeons.map((d) => {
            const unlocked = isRaiderDungeonUnlocked(d, hud.raiderRank);
            const cleared = hud.clearedRaiderDungeons.includes(d.id);
            const reqRank = getRaiderRankDef(d.requiredRank);

            return (
              <div
                key={d.id}
                data-testid={`raider-dungeon-card-${d.id}`}
                className={`p-2 border flex flex-col justify-between gap-1.5 ${
                  cleared
                    ? 'bg-[#0e1c17] border-emerald-400/65'
                    : unlocked
                      ? 'bg-[#190e20] border-purple-400/55'
                      : 'bg-[#110a15] border-slate-700/60 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-pixel-mono text-[9px] font-bold text-amber-300 tabular-nums">
                      {d.code} · {d.floors} FLOORS · {d.designLabel.toUpperCase()}
                    </span>
                    <span
                      className="px-1 py-0.5 border font-pixel-mono text-[8px] font-bold shrink-0"
                      style={{
                        borderColor: reqRank.borderColor,
                        color: reqRank.borderColor,
                      }}
                    >
                      {d.requiredRank}
                    </span>
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-amber-50 truncate mt-0.5">
                    {d.name}
                  </div>
                  <div className="font-pixel-mono text-[9px] text-rose-300 truncate">
                    Boss: {d.bossName} ({d.bossTitle})
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-purple-500/20">
                  <div className="font-pixel-mono text-[9px] text-amber-200/85 tabular-nums">
                    +{d.rewardGold}G · +{d.rewardRaiderPoints}Pts · ★{d.rewardStarStones}
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={!unlocked}
                    data-testid={`enter-raider-dungeon-${d.id}`}
                    onClick={() => handleDispatch(d.id)}
                    className={`px-2.5 py-1 border font-pixel-mono text-[9px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                      !unlocked
                        ? 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed'
                        : cleared
                          ? 'bg-emerald-800 hover:bg-emerald-700 border-emerald-300 text-white'
                          : 'bg-[#7c2d12] hover:bg-[#9a3412] border-amber-300 text-amber-50'
                    }`}
                  >
                    {!unlocked ? `Need ${d.requiredRank}` : cleared ? 'Raid Again' : 'Enter Dungeon'}
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
