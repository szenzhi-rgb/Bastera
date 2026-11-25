import React, { useMemo, useState } from 'react';
import type { HudSnapshot, SideQuestId } from '../game/types';

interface SideQuestModalProps {
  hud: HudSnapshot;
  onClose: () => void;
  onAcceptOrTrackQuest: (questId: SideQuestId) => void;
  onTrackQuest: (questId: SideQuestId | null) => void;
}

const REALM_LABELS: Record<'isekai_town' | 'outskirts_forest' | 'outskirts_caves', string> = {
  isekai_town: 'Solaris Town',
  outskirts_forest: 'Outskirts Forest',
  outskirts_caves: 'Outskirts Caves',
};

export const SideQuestModal: React.FC<SideQuestModalProps> = ({
  hud,
  onClose,
  onAcceptOrTrackQuest,
  onTrackQuest,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const completedCount = useMemo(
    () => hud.sideQuests.filter((q) => q.progress.stage === 3).length,
    [hud.sideQuests],
  );
  const activeCount = useMemo(
    () => hud.sideQuests.filter((q) => q.progress.stage === 1 || q.progress.stage === 2).length,
    [hud.sideQuests],
  );

  const visibleQuests = useMemo(() => {
    if (filter === 'active') {
      return hud.sideQuests.filter((q) => q.progress.stage === 1 || q.progress.stage === 2);
    }
    if (filter === 'completed') {
      return hud.sideQuests.filter((q) => q.progress.stage === 3);
    }
    return hud.sideQuests;
  }, [hud.sideQuests, filter]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/82"
      role="dialog"
      aria-modal="true"
      aria-label="Outskirts Blood-Oath Side Quests"
      data-testid="side-quests-modal"
    >
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-[#12090d] border-2 border-amber-400/85 p-5 text-amber-50 shadow-[0_14px_40px_rgba(0,0,0,0.95)]">
        <span className="absolute top-0 left-0 w-2 h-2 bg-amber-300" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-amber-300" />
        <span className="absolute bottom-0 left-0 w-2 h-2 bg-amber-300" />
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-amber-300" />

        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-500/30 pb-3 mb-4">
          <div>
            <div className="font-pixel-mono text-[10px] tracking-widest text-rose-400 font-bold uppercase">
              OUTSKIRTS CHRONICLES · BLOOD &amp; BETRAYAL
            </div>
            <h2 className="font-display text-xl font-bold text-amber-100 mt-0.5">
              10 Violent Side Quests · Solaris Gate &amp; Beyond
            </h2>
            <p className="font-pixel-mono text-[11px] text-amber-200/80 mt-0.5 tabular-nums">
              Exit via Royal East Gate (Solaris Town East) → Outskirts Forest → Outskirts Caves · Completed {completedCount}/{hud.sideQuests.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="close-side-quests-btn"
            className="px-3 py-1.5 bg-[#291318] border border-amber-400/70 hover:border-amber-200 font-pixel-mono text-xs text-amber-100 cursor-pointer shrink-0"
          >
            Close [Q]
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(
            [
              ['all', `All (${hud.sideQuests.length})`],
              ['active', `Active (${activeCount})`],
              ['completed', `Completed (${completedCount})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              data-testid={`sq-filter-${key}`}
              className={`px-3.5 py-1.5 text-xs font-pixel-mono border cursor-pointer tabular-nums ${
                filter === key
                  ? 'bg-[#991b1b] border-amber-300 text-amber-50 font-bold'
                  : 'bg-[#1c1015] border-amber-500/30 text-amber-200/80 hover:border-amber-400/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {visibleQuests.length === 0 ? (
            <div className="py-10 text-center bg-[#0d070a] border border-amber-900/45 font-pixel-mono text-xs text-amber-200/70">
              No quests match this filter yet. Speak to NPCs in Solaris Town, Outskirts Forest, or Outskirts Caves—or accept a quest below!
            </div>
          ) : (
            visibleQuests.map((q) => {
              const isCompleted = q.progress.stage === 3;
              const isActive = q.progress.stage === 1 || q.progress.stage === 2;
              const isTracked = hud.trackedSideQuestId === q.id;
              const twistOpen = q.progress.twistRevealed || isCompleted;

              return (
                <div
                  key={q.id}
                  data-testid={`side-quest-card-${q.id}`}
                  className={`p-3.5 border transition-colors ${
                    isCompleted
                      ? 'bg-[#0d1c14] border-emerald-500/50'
                      : isTracked
                        ? 'bg-[#211018] border-amber-300'
                        : 'bg-[#170c11] border-amber-500/35'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-pixel-mono text-[10px] px-1.5 py-0.5 bg-[#2a121a] border border-amber-400/50 text-amber-300 font-bold tabular-nums">
                          #{String(q.index).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-base font-bold text-amber-100">
                          {q.title}
                        </h3>
                        {isCompleted && (
                          <span className="font-pixel-mono text-[10px] px-1.5 py-0.5 bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold">
                            COMPLETED
                          </span>
                        )}
                        {!isCompleted && isTracked && (
                          <span className="font-pixel-mono text-[10px] px-1.5 py-0.5 bg-amber-950 border border-amber-300 text-amber-200 font-bold">
                            TRACKED
                          </span>
                        )}
                      </div>
                      <div className="font-pixel-mono text-[11px] text-amber-200/80 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>
                          Giver: <strong className="text-amber-100">{q.giverName}</strong> ({q.giverRoleLabel} · {REALM_LABELS[q.giverRealm]})
                        </span>
                        <span>
                          Hunt Zone: <strong className="text-rose-300">{REALM_LABELS[q.targetRealm]}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCompleted && (
                        <button
                          type="button"
                          data-testid={`sq-action-${q.id}`}
                          onClick={() => {
                            if (isActive && isTracked) {
                              onTrackQuest(null);
                            } else if (isActive) {
                              onTrackQuest(q.id);
                            } else {
                              onAcceptOrTrackQuest(q.id);
                            }
                          }}
                          className={`px-3 py-1.5 font-pixel-mono text-[11px] font-bold border cursor-pointer ${
                            isActive
                              ? isTracked
                                ? 'bg-[#3b151e] border-amber-300 text-amber-100 hover:bg-[#521b27]'
                                : 'bg-amber-600 border-amber-200 text-black hover:bg-amber-500'
                              : 'bg-[#991b1b] border-amber-300 text-amber-50 hover:bg-[#b91c1c]'
                          }`}
                        >
                          {isActive ? (isTracked ? 'Untrack' : 'Track') : 'Accept & Track'}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-amber-100/85 leading-relaxed mb-2.5">
                    {q.hookSummary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5 font-pixel-mono text-[11px]">
                    <div className="p-2 bg-[#10080c] border border-amber-500/25 flex items-center justify-between tabular-nums">
                      <span className="text-amber-200/75">Target Slain Progress</span>
                      <span className="font-bold text-amber-200">
                        {Math.min(q.progress.kills, q.twistTriggerKills)} / {q.twistTriggerKills}
                      </span>
                    </div>
                    <div className="p-2 bg-[#10080c] border border-amber-500/25 flex items-center justify-between gap-2">
                      <span className="text-amber-200/75">Boss Mark</span>
                      <span className="font-bold text-rose-300 truncate">
                        {twistOpen ? q.bossName : '??? (Reveals on Twist)'}
                      </span>
                    </div>
                  </div>

                  {twistOpen ? (
                    <div
                      data-testid={`sq-twist-revealed-${q.id}`}
                      className="p-2.5 bg-[#24090f] border border-rose-500/75 mb-2.5"
                    >
                      <div className="font-pixel-mono text-[10px] font-bold tracking-wider text-rose-300 uppercase">
                        {q.twistTitle}
                      </div>
                      <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                        {q.twistRevelation}
                      </p>
                    </div>
                  ) : (
                    <div
                      data-testid={`sq-twist-locked-${q.id}`}
                      className="p-2.5 bg-[#120b10] border border-amber-900/50 mb-2.5 font-pixel-mono text-[11px] text-amber-300/70"
                    >
                      PLOT TWIST LOCKED — Slay {q.twistTriggerKills} enemies in {REALM_LABELS[q.targetRealm]} to uncover the truth behind {q.giverName}&apos;s contract.
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-500/20 font-pixel-mono text-[11px] tabular-nums">
                    <div className="flex items-center gap-3 text-amber-200">
                      <span>Rewards: <strong className="text-amber-300">+{q.rewardGold}G</strong></span>
                      <span><strong className="text-cyan-300">+{q.rewardStatPoints} Stat Pts</strong></span>
                      <span><strong className="text-yellow-300">+{q.rewardStarStones} ★ Star Stones</strong></span>
                    </div>
                    <span className="text-[10px] text-amber-200/65">
                      {isCompleted
                        ? 'Target Eliminated'
                        : isActive
                          ? twistOpen
                            ? `Hunt ${q.bossName} in ${REALM_LABELS[q.targetRealm]}`
                            : `Hunt in ${REALM_LABELS[q.targetRealm]}`
                          : 'Unaccepted'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
