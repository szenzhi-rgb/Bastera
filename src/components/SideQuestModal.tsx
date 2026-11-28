import React, { useEffect, useMemo, useState } from 'react';
import type {
  HudSnapshot,
  SideQuestDef,
  SideQuestDialogueChoice,
  SideQuestDialogueNode,
  SideQuestId,
  SideQuestProgress,
} from '../game/types';
import { PixelSideQuestNpcPortrait } from './PixelPortrait';

interface SideQuestModalProps {
  hud: HudSnapshot;
  initialDialogueQuestId?: SideQuestId | null;
  onClose: () => void;
  onAcceptOrTrackQuest: (questId: SideQuestId) => void;
  onTrackQuest: (questId: SideQuestId | null) => void;
  onSelectDialogueChoice: (questId: SideQuestId, nodeId: string, choiceId: string) => void;
}

const REALM_LABELS: Record<'isekai_town' | 'outskirts_forest' | 'outskirts_caves', string> = {
  isekai_town: 'Solaris Town',
  outskirts_forest: 'Outskirts Forest',
  outskirts_caves: 'Outskirts Caves',
};

const TONE_LABELS: Record<SideQuestDialogueChoice['tone'], string> = {
  investigate: 'PRY CLUE',
  quirky: 'SNARK',
  ruthless: 'BLUNT',
  accept: 'CONTRACT',
  extort: 'EXTORT',
};

function getInitialNodeForQuest(
  quest: SideQuestDef & { progress: SideQuestProgress },
): SideQuestDialogueNode {
  if (quest.progress.twistRevealed || quest.progress.stage === 3) {
    return quest.twistConfrontationNodes[0] ?? quest.openingNodes[0];
  }
  if (quest.progress.stage === 1 || quest.progress.stage === 2) {
    return quest.midQuestNodes[0] ?? quest.openingNodes[0];
  }
  return quest.openingNodes[0];
}

export const SideQuestModal: React.FC<SideQuestModalProps> = ({
  hud,
  initialDialogueQuestId = null,
  onClose,
  onAcceptOrTrackQuest,
  onTrackQuest,
  onSelectDialogueChoice,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [dialogueQuestId, setDialogueQuestId] = useState<SideQuestId | null>(initialDialogueQuestId);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(() => {
    if (!initialDialogueQuestId) return null;
    const found = hud.sideQuests.find((q) => q.id === initialDialogueQuestId);
    return found ? getInitialNodeForQuest(found).id : null;
  });
  const [lineIdx, setLineIdx] = useState(0);
  const [npcReplyLines, setNpcReplyLines] = useState<string[] | null>(null);
  const [pendingNextNodeId, setPendingNextNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (initialDialogueQuestId) {
      const found = hud.sideQuests.find((q) => q.id === initialDialogueQuestId);
      if (found) {
        setDialogueQuestId(found.id);
        setActiveNodeId(getInitialNodeForQuest(found).id);
        setLineIdx(0);
        setNpcReplyLines(null);
        setPendingNextNodeId(null);
      }
    }
  }, [initialDialogueQuestId]);

  const completedCount = useMemo(
    () => hud.sideQuests.filter((q) => q.progress.stage === 3).length,
    [hud.sideQuests],
  );
  const activeCount = useMemo(
    () => hud.sideQuests.filter((q) => q.progress.stage === 1 || q.progress.stage === 2).length,
    [hud.sideQuests],
  );
  const cluesCount = useMemo(
    () => hud.sideQuests.filter((q) => q.progress.clueUncovered || q.progress.twistRevealed).length,
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

  const activeQuest = useMemo(
    () => (dialogueQuestId ? hud.sideQuests.find((q) => q.id === dialogueQuestId) ?? null : null),
    [hud.sideQuests, dialogueQuestId],
  );

  const activeNode = useMemo(() => {
    if (!activeQuest) return null;
    const allNodes = [
      ...activeQuest.openingNodes,
      ...activeQuest.midQuestNodes,
      ...activeQuest.twistConfrontationNodes,
    ];
    return allNodes.find((n) => n.id === activeNodeId) ?? getInitialNodeForQuest(activeQuest);
  }, [activeQuest, activeNodeId]);

  const openQuestConversation = (
    quest: SideQuestDef & { progress: SideQuestProgress },
    nodeOverride?: SideQuestDialogueNode,
  ) => {
    const startNode = nodeOverride ?? getInitialNodeForQuest(quest);
    setDialogueQuestId(quest.id);
    setActiveNodeId(startNode.id);
    setLineIdx(0);
    setNpcReplyLines(null);
    setPendingNextNodeId(null);
  };

  const handleChooseOption = (choice: SideQuestDialogueChoice) => {
    if (!activeQuest || !activeNode) return;
    onSelectDialogueChoice(activeQuest.id, activeNode.id, choice.id);
    setNpcReplyLines(choice.npcReply);
    setPendingNextNodeId(choice.nextNodeId ?? null);
  };

  const handleAdvanceAfterReply = () => {
    if (!activeQuest) return;
    if (pendingNextNodeId) {
      setActiveNodeId(pendingNextNodeId);
      setLineIdx(0);
      setNpcReplyLines(null);
      setPendingNextNodeId(null);
    } else {
      setNpcReplyLines(null);
      setDialogueQuestId(null);
      setActiveNodeId(null);
    }
  };

  const renderDialogueTheater = () => {
    if (!activeQuest || !activeNode) return null;
    const displayLines = npcReplyLines ?? activeNode.lines;
    const safeIdx = Math.min(lineIdx, Math.max(0, displayLines.length - 1));
    const onLastLine = safeIdx >= displayLines.length - 1;
    const twistOpen = activeQuest.progress.twistRevealed || activeQuest.progress.stage === 3;
    const seenChoices = activeQuest.progress.chosenOptionIds ?? [];

    return (
      <div className="flex flex-col flex-1 overflow-y-auto pr-1 space-y-4" data-testid="side-quest-dialogue-theater">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-500/25">
          <div className="font-pixel-mono text-xs text-amber-200/85">
            {activeQuest.chapterTitle} · {activeQuest.storyTheme}
          </div>
          <button
            type="button"
            onClick={() => {
              setDialogueQuestId(null);
              setActiveNodeId(null);
              setNpcReplyLines(null);
              setPendingNextNodeId(null);
            }}
            data-testid="sq-back-to-journal-btn"
            className="px-3 py-1.5 bg-[#1f1016] border border-amber-400/65 hover:border-amber-200 font-pixel-mono text-xs text-amber-100 cursor-pointer whitespace-nowrap"
          >
            Back to Ledger Journal
          </button>
        </div>

        {/* Character Portrait + Moody RPG Stage */}
        <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-[#0b0609] border border-amber-500/45">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <PixelSideQuestNpcPortrait
              questIndex={activeQuest.index}
              coatColor={activeQuest.coatColor}
              hairColor={activeQuest.hairColor}
              shirtColor={activeQuest.shirtColor}
              twistRevealed={twistOpen}
              size={84}
            />
            <div className="font-pixel-mono text-[10px] text-amber-300/85 text-center max-w-[96px]">
              {REALM_LABELS[activeQuest.giverRealm]}
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full space-y-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-amber-100">
                  {activeNode.speaker}
                </h3>
                <div className="font-pixel-mono text-[11px] text-rose-300/90">
                  {activeNode.speakerRole} · {activeNode.moodLabel}
                </div>
              </div>
              <span className="font-pixel-mono text-[11px] text-amber-300/75 tabular-nums">
                {npcReplyLines ? 'RESPONSE' : `LINE ${safeIdx + 1}/${displayLines.length}`}
              </span>
            </div>

            {/* Dialogue Text Viewport */}
            <div className="p-3.5 bg-[#150b10] border border-amber-500/30 min-h-[96px] flex flex-col justify-between gap-3">
              {npcReplyLines ? (
                <div className="space-y-2" data-testid="sq-npc-reply-box">
                  {npcReplyLines.map((line, i) => (
                    <p key={i} className="text-sm text-amber-50 leading-relaxed">
                      “{line}”
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-50 leading-relaxed" data-testid="sq-dialogue-line">
                  “{displayLines[safeIdx]}”
                </p>
              )}

              {!npcReplyLines && !onLastLine && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setLineIdx((i) => Math.min(displayLines.length - 1, i + 1))}
                    data-testid="sq-dialogue-next-btn"
                    className="px-4 py-1.5 bg-[#991b1b] border border-amber-300 hover:bg-[#b91c1c] font-pixel-mono text-xs font-bold text-amber-50 cursor-pointer"
                  >
                    Continue Dialogue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Uncovered Solaris Ledger Clue Box */}
        {(activeQuest.progress.clueUncovered || twistOpen) && (
          <div
            data-testid="sq-dialogue-clue-box"
            className="p-3 bg-[#1c0c13] border border-rose-400/65"
          >
            <div className="font-pixel-mono text-[10px] font-bold tracking-wider text-rose-300 uppercase">
              SOLARIS LEDGER CLUE RECORDED
            </div>
            <p className="text-xs text-rose-100 mt-1 leading-relaxed">
              {activeQuest.conspiracyClue}
            </p>
          </div>
        )}

        {/* Interactive Branching Choices */}
        {npcReplyLines ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {pendingNextNodeId ? (
              <button
                type="button"
                onClick={handleAdvanceAfterReply}
                data-testid="sq-reply-continue-btn"
                className="px-4 py-2 bg-[#991b1b] border border-amber-300 hover:bg-[#b91c1c] font-pixel-mono text-xs font-bold text-amber-50 cursor-pointer"
              >
                Continue Conversation
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setNpcReplyLines(null)}
                  className="px-3.5 py-2 bg-[#1c1015] border border-amber-400/60 hover:border-amber-200 font-pixel-mono text-xs text-amber-100 cursor-pointer"
                >
                  Ask Another Question
                </button>
                <button
                  type="button"
                  onClick={handleAdvanceAfterReply}
                  data-testid="sq-reply-finish-btn"
                  className="px-4 py-2 bg-emerald-800 border border-emerald-300 hover:bg-emerald-700 font-pixel-mono text-xs font-bold text-emerald-50 cursor-pointer"
                >
                  Finish Conversation
                </button>
              </>
            )}
          </div>
        ) : (
          onLastLine && (
            <div className="space-y-2" data-testid="sq-dialogue-choices">
              <div className="font-pixel-mono text-[11px] text-amber-300/85">
                Choose your response:
              </div>
              {(activeNode.choices ?? []).map((choice) => {
                const alreadyPicked = seenChoices.includes(choice.id);
                const rewardTags: string[] = [];
                if (choice.bonusGold && !alreadyPicked) rewardTags.push(`+${choice.bonusGold}G`);
                if (choice.bonusStatPoints && !alreadyPicked) rewardTags.push(`+${choice.bonusStatPoints} Stat`);
                if (choice.revealClue && !activeQuest.progress.clueUncovered) rewardTags.push('Clue');
                if (choice.acceptQuest && activeQuest.progress.stage === 0) rewardTags.push('Accept Quest');

                return (
                  <button
                    key={choice.id}
                    type="button"
                    data-testid={`sq-choice-${choice.id}`}
                    onClick={() => handleChooseOption(choice)}
                    className={`w-full text-left p-3 border transition-colors cursor-pointer flex flex-wrap items-center justify-between gap-2 ${
                      choice.tone === 'accept'
                        ? 'bg-[#7f1d1d]/85 border-amber-300 hover:bg-[#991b1b] text-amber-50'
                        : choice.tone === 'extort'
                          ? 'bg-[#2a150b] border-amber-400/80 hover:border-amber-200 text-amber-100'
                          : 'bg-[#1a0e14] border-amber-500/40 hover:border-amber-300 text-amber-100'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium leading-snug flex-1 min-w-[200px]">
                      {choice.label}
                    </span>
                    <span className="font-pixel-mono text-[10px] text-amber-300 shrink-0 tabular-nums">
                      {TONE_LABELS[choice.tone]}
                      {rewardTags.length > 0 ? ` · ${rewardTags.join(' · ')}` : ''}
                      {alreadyPicked ? ' · Asked' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/82"
      role="dialog"
      aria-modal="true"
      aria-label="Solaris Chronicles & Outskirts Side Quests"
      data-testid="side-quests-modal"
    >
      <div className="relative w-full max-w-[92%] sm:max-w-2xl max-h-[86%] flex flex-col bg-[#12090d] border-2 border-amber-400/85 p-2.5 sm:p-4 text-amber-50 shadow-[0_14px_40px_rgba(0,0,0,0.95)] overflow-hidden">
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-300" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-300" />

        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-amber-500/30 pb-2 mb-2.5 shrink-0">
          <div className="min-w-0">
            <div className="font-pixel-mono text-[8.5px] sm:text-[10px] tracking-widest text-rose-400 font-bold uppercase">
              THE SOLARIS LEDGER · SIDE QUESTS
            </div>
            <h2 className="font-display text-sm sm:text-lg font-bold text-amber-100 mt-0.5 truncate">
              10 Side Quests · Woods &amp; Caves
            </h2>
            <p className="font-pixel-mono text-[9px] sm:text-[10px] text-amber-200/80 tabular-nums">
              Clues {cluesCount}/{hud.sideQuests.length} · Done {completedCount}/{hud.sideQuests.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="close-side-quests-btn"
            className="px-2.5 py-1 bg-[#291318] border border-amber-400/70 hover:border-amber-200 font-pixel-mono text-[10px] sm:text-xs text-amber-100 cursor-pointer shrink-0 whitespace-nowrap"
          >
            Close [Q]
          </button>
        </div>

        {activeQuest && activeNode ? (
          renderDialogueTheater()
        ) : (
          <>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap shrink-0">
              {(
                [
                  ['all', `All (${hud.sideQuests.length})`],
                  ['active', `Active (${activeCount})`],
                  ['completed', `Done (${completedCount})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  data-testid={`sq-filter-${key}`}
                  className={`px-2.5 py-1 text-[10px] sm:text-xs font-pixel-mono border cursor-pointer tabular-nums whitespace-nowrap ${
                    filter === key
                      ? 'bg-[#991b1b] border-amber-300 text-amber-50 font-bold'
                      : 'bg-[#1c1015] border-amber-500/30 text-amber-200/80 hover:border-amber-400/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {visibleQuests.length === 0 ? (
                <div className="py-6 text-center bg-[#0d070a] border border-amber-900/45 font-pixel-mono text-xs text-amber-200/70">
                  No quests match this filter yet. Speak to NPCs in Solaris Town, Outskirts Forest, or Outskirts Caves!
                </div>
              ) : (
                visibleQuests.map((q) => {
                  const isCompleted = q.progress.stage === 3;
                  const isActive = q.progress.stage === 1 || q.progress.stage === 2;
                  const isTracked = hud.trackedSideQuestId === q.id;
                  const twistOpen = q.progress.twistRevealed || isCompleted;
                  const clueOpen = Boolean(q.progress.clueUncovered) || twistOpen;

                  return (
                    <div
                      key={q.id}
                      data-testid={`side-quest-card-${q.id}`}
                      className={`p-2.5 sm:p-3 border transition-colors ${
                        isCompleted
                          ? 'bg-[#0d1c14] border-emerald-500/50'
                          : isTracked
                            ? 'bg-[#211018] border-amber-300'
                            : 'bg-[#170c11] border-amber-500/35'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <PixelSideQuestNpcPortrait
                            questIndex={q.index}
                            coatColor={q.coatColor}
                            hairColor={q.hairColor}
                            shirtColor={q.shirtColor}
                            twistRevealed={twistOpen}
                            size={36}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-pixel-mono text-[9px] text-rose-300/85 tabular-nums truncate">
                              #{String(q.index).padStart(2, '0')} · {q.chapterTitle}
                              {isCompleted ? ' · DONE' : isTracked ? ' · TRACKED' : ''}
                            </div>
                            <h3 className="font-display text-xs sm:text-sm font-bold text-amber-100 mt-0.5 truncate">
                              {q.title}
                            </h3>
                            <div className="font-pixel-mono text-[9.5px] text-amber-200/80 mt-0.5 flex flex-wrap gap-x-2">
                              <span>
                                NPC: <strong className="text-amber-100">{q.giverName}</strong>
                              </span>
                              <span>
                                Zone: <strong className="text-rose-300">{REALM_LABELS[q.targetRealm]}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          <button
                            type="button"
                            data-testid={`sq-talk-${q.id}`}
                            onClick={() => openQuestConversation(q)}
                            className="px-3 py-1.5 font-pixel-mono text-[11px] font-bold border border-sky-400/75 bg-[#0f2233] text-sky-100 hover:border-sky-200 cursor-pointer whitespace-nowrap"
                          >
                            {twistOpen
                              ? q.progress.confronted
                                ? 'Replay Confrontation'
                                : 'Confront NPC'
                              : isActive
                                ? 'Interrogate NPC'
                                : 'Talk & Question'}
                          </button>

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
                              className={`px-3 py-1.5 font-pixel-mono text-[11px] font-bold border cursor-pointer whitespace-nowrap ${
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

                      {clueOpen && (
                        <div
                          data-testid={`sq-clue-${q.id}`}
                          className="p-2.5 bg-[#1b0e17] border border-amber-400/40 mb-2.5"
                        >
                          <div className="font-pixel-mono text-[10px] font-bold text-amber-300 uppercase">
                            LEDGER EVIDENCE FOUND
                          </div>
                          <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">
                            {q.conspiracyClue}
                          </p>
                        </div>
                      )}

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
                          PLOT TWIST LOCKED — Slay {q.twistTriggerKills} enemies in {REALM_LABELS[q.targetRealm]} (or interrogate {q.giverName}) to uncover the Solaris Ledger truth.
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
                            ? q.progress.confronted
                              ? 'Target Eliminated · NPC Confronted'
                              : 'Target Eliminated · Confront NPC Available'
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
          </>
        )}
      </div>
    </div>
  );
};
