import React from 'react';
import { SKILLS, STANDS, STAND_SKILL_TAGS, TOTAL_BOSSES, WEAPONS } from '../game/data';
import type { HudSnapshot, OrbId, SkillId, StatKey } from '../game/types';
import {
  PixelBossPortrait,
  PixelItemIcon,
  PixelWarriorPortrait,
  PixelWeaponIcon,
} from './PixelPortrait';

interface GameHudProps {
  hud: HudSnapshot;
  isTouchLayout: boolean;
  isMobileLocked?: boolean;
  onOpenInventory: () => void;
  onOpenSanctuary: () => void;
  onOpenMap: () => void;
  onOpenStatus: () => void;
  onOpenSaves: () => void;
  onOpenWorlds: () => void;
  onOpenGuild: () => void;
  onOpenWardrobe: () => void;
  onOpenPotionShop: () => void;
  onOpenWeaponsShop: () => void;
  onOpenCaravanRider: () => void;
  onOpenDuelingArena: () => void;
  onOpenStandShrine: () => void;
  onOpenSideQuests: () => void;
  onOpenRaiderGuild: () => void;
  onOpenTutorial: () => void;
  onAllocateStat: (statKey: StatKey) => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onToggleRotate: () => void;
  onTriggerSkill: (slot: 0 | 1 | 2) => void;
  onUseOrb: (orbId: OrbId) => void;
  onAscendRaiderStairs: () => void;
  onStartElfBanquet: () => void;
  onDash: () => void;
  onCycleWeapon: () => void;
  onAdvanceDialogue: () => void;
  onVirtualKey: (
    action: 'left' | 'right' | 'jump' | 'dash' | 'attack' | 'interact' | 'skill0' | 'skill1' | 'skill2',
    pressed: boolean,
  ) => void;
}

const TOWN_LANDMARKS = [
  { id: 'guild', label: 'Gld', x: 342 },
  { id: 'caravan', label: 'Vnc', x: 482 },
  { id: 'potion', label: 'Pot', x: 648 },
  { id: 'wardrobe', label: 'Wrd', x: 905 },
  { id: 'weapons', label: 'Arm', x: 1185 },
  { id: 'raider', label: 'Rdr', x: 1380 },
  { id: 'shrine', label: 'Shr', x: 1558 },
  { id: 'herald', label: 'Elf', x: 2040 },
  { id: 'onsen', label: 'Spa', x: 2630 },
  { id: 'colosseum', label: 'Arena', x: 3285 },
  { id: 'east_gate', label: 'East', x: 3760 },
] as const;

export const GameHud: React.FC<GameHudProps> = ({
  hud,
  isTouchLayout,
  isMobileLocked = false,
  onOpenInventory,
  onOpenSanctuary,
  onOpenMap,
  onOpenStatus,
  onOpenSaves,
  onOpenWorlds,
  onOpenGuild,
  onOpenWardrobe,
  onOpenPotionShop,
  onOpenWeaponsShop,
  onOpenCaravanRider,
  onOpenDuelingArena,
  onOpenStandShrine,
  onOpenSideQuests,
  onOpenRaiderGuild,
  onOpenTutorial,
  onAllocateStat,
  onTogglePause,
  onToggleMute,
  onToggleRotate,
  onTriggerSkill,
  onUseOrb,
  onAscendRaiderStairs,
  onStartElfBanquet,
  onDash,
  onCycleWeapon,
  onAdvanceDialogue,
  onVirtualKey,
}) => {
  const hpPct = Math.max(0, Math.min(100, (hud.hp / Math.max(1, hud.maxHp)) * 100));
  const stamPct = Math.max(0, Math.min(100, (hud.stamina / Math.max(1, hud.maxStamina)) * 100));
  const weapon = WEAPONS[hud.equippedWeapon];

  const currentLine = hud.dialogue
    ? (hud.dialogue.lines[hud.dialogue.lineIndex] || '').slice(0, hud.dialogue.charIndex)
    : '';

  const playerApproxX = hud.distanceMeters * 16 + 68;
  const nearVanceInTown = hud.realm === 'isekai_town' && Math.abs(playerApproxX - 482) <= 125;
  const nearStandShrine = hud.realm === 'isekai_town' && Math.abs(playerApproxX - 1558) <= 125;
  const nearRaiderHall = hud.realm === 'isekai_town' && Math.abs(playerApproxX - 1380) <= 110;
  const nearElfHerald = hud.realm === 'isekai_town' && Math.abs(playerApproxX - 2040) <= 120;
  const nearCaravanExterior = hud.realm === 'dungeon_exterior' && Math.abs(playerApproxX - 110) <= 135;
  const activeSideQuest =
    hud.sideQuests.find((q) => q.id === hud.trackedSideQuestId) ??
    hud.sideQuests.find((q) => q.progress.stage === 1 || q.progress.stage === 2) ??
    null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-1.5 sm:p-3">
      {/* Top Row: Perimeter Clusters + Boss Bar */}
      <div className="flex items-start justify-between gap-1.5 sm:gap-3">
        {/* Top-Left: HP, Stamina, Progress + Solo Leveling Status Bar */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="relative bg-[#120b0f]/92 border border-amber-500/45 px-2 py-1 sm:px-3 sm:py-1.5 min-w-[155px] sm:min-w-[225px]">
            <span className="absolute top-0 left-0 w-1 h-1 bg-amber-300" />
            <span className="absolute top-0 right-0 w-1 h-1 bg-amber-300" />
            <span className="absolute bottom-0 left-0 w-1 h-1 bg-amber-300" />
            <span className="absolute bottom-0 right-0 w-1 h-1 bg-amber-300" />
            <div className="flex items-center justify-between gap-1.5 text-[9px] sm:text-[11px] font-pixel-mono text-amber-200 mb-0.5 tabular-nums">
              <span>HP {hud.hp}/{hud.maxHp}</span>
              <span className="flex items-center gap-1.5">
                <span className="text-yellow-300" data-testid="hud-star-stones">★{hud.starStones}</span>
                <span className="text-amber-400">{hud.gold}G</span>
              </span>
            </div>
            <div className="relative w-full h-1.5 sm:h-2.5 bg-[#271820] border border-amber-900/60 overflow-hidden mb-1">
              <div
                className="absolute inset-y-0 left-0 bg-amber-100/80 transition-[width] duration-500"
                style={{ width: `${hpPct}%` }}
              />
              <div
                className="relative h-full bg-[#dc2626] transition-[width] duration-150"
                style={{ width: `${hpPct}%` }}
              />
            </div>
            <div className="w-full h-1 sm:h-1.5 bg-[#1e1726] overflow-hidden mb-1">
              <div
                className="h-full bg-[#eab308] transition-[width] duration-75"
                style={{ width: `${stamPct}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-pixel-mono text-amber-100/80 whitespace-nowrap">
              <span className="truncate max-w-[90px] sm:max-w-none">{hud.biomeLabel}</span>
              <span aria-hidden="true">·</span>
              {hud.realm === 'citadel' ? (
                <>
                  <span>B {hud.bossesDefeated}/{hud.totalBosses}</span>
                  <span aria-hidden="true">·</span>
                  <span>S {hud.secretsFound}/{hud.totalSecrets}</span>
                </>
              ) : (
                <>
                  <span className="text-yellow-300 font-bold">
                    {hud.guildRank} ({hud.rankMissionsCompleted}/{hud.missionsRequiredPerRank})
                    {hud.crownUnlocked ? ' ♛' : ''}
                    {hud.elfCrownUnlocked ? ' 🌿' : ''}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className={hud.isNightTime ? 'text-indigo-300' : 'text-amber-300'}>
                    {hud.isNightTime ? '🌙' : '☀'} {hud.secondsToNightToggle}s
                  </span>
                </>
              )}
            </div>
            {hud.damageBoostSeconds > 0 && (
              <div
                data-testid="damage-boost-hud"
                className="mt-1 px-1.5 py-0.5 bg-[#2a0f3b] border border-fuchsia-400/75 font-pixel-mono text-[9px] font-bold text-fuchsia-200 flex items-center justify-between"
              >
                <span>⚡ +{Math.round((hud.damageBoostMultiplier - 1) * 100)}% ATK BOOST</span>
                <span className="text-yellow-300">{Math.ceil(hud.damageBoostSeconds)}s</span>
              </div>
            )}
            {hud.hotSpringSeconds > 0 && (
              <div
                data-testid="hot-spring-hud"
                className="mt-1 px-1.5 py-0.5 bg-[#0f2e2b] border border-teal-400/75 font-pixel-mono text-[9px] font-bold text-teal-200 flex items-center justify-between"
              >
                <span>♨ ONSEN VITALITY +10% SPD</span>
                <span className="text-teal-100 tabular-nums">{Math.ceil(hud.hotSpringSeconds)}s</span>
              </div>
            )}
            {hud.dinoFormSeconds > 0 && (
              <div
                data-testid="dino-form-hud"
                className="mt-1 px-1.5 py-0.5 bg-[#102916] border border-lime-400/75 font-pixel-mono text-[9px] font-bold text-lime-200 flex items-center justify-between"
              >
                <span>DINOSTAND FORM · CLAW SLASH</span>
                <span className="text-lime-100 tabular-nums">{hud.dinoFormSeconds.toFixed(1)}s</span>
              </div>
            )}
            {hud.chiliPepperSeconds > 0 && (
              <div
                data-testid="chili-pepper-hud"
                className="mt-1 px-1.5 py-0.5 bg-[#29210a] border border-yellow-400/75 font-pixel-mono text-[9px] font-bold text-yellow-200 flex items-center justify-between"
              >
                <span>CHILI PEPPER · VOLT ALLY</span>
                <span className="text-yellow-100 tabular-nums">{hud.chiliPepperSeconds.toFixed(1)}s</span>
              </div>
            )}
            {hud.whiteAuraSeconds > 0 && (
              <div
                data-testid="white-aura-hud"
                className="mt-1 px-1.5 py-0.5 bg-[#262933] border border-white font-pixel-mono text-[9px] font-bold text-white flex items-center justify-between shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              >
                <span>WHITE AURA · INVINCIBLE +30% SPD</span>
                <span className="text-cyan-100 tabular-nums">{hud.whiteAuraSeconds.toFixed(1)}s</span>
              </div>
            )}
            {hud.standGuardSeconds > 0 && (
              <div
                data-testid="stand-guard-hud"
                className="mt-1 px-1.5 py-0.5 bg-[#291038] border border-fuchsia-300 font-pixel-mono text-[9px] font-bold text-fuchsia-100 flex items-center justify-between shadow-[0_0_10px_rgba(232,121,249,0.4)]"
              >
                <span>STAND GUARD · DEFLECT &amp; COUNTER</span>
                <span className="text-yellow-200 tabular-nums">{hud.standGuardSeconds.toFixed(1)}s</span>
              </div>
            )}
          </div>

          {/* Solo Leveling Quick Status Bar */}
          <div
            className="pointer-events-auto relative bg-[#051024]/92 border border-sky-400/65 px-1.5 py-0.5 sm:px-2 sm:py-1 flex items-center justify-between gap-1"
            data-testid="hud-status-bar"
          >
            <div className="flex items-center gap-1 flex-wrap text-[8px] sm:text-[10px] font-pixel-mono">
              <span className="text-cyan-300 font-bold">LV.{hud.level}</span>
              <span className={hud.statPoints > 0 ? 'text-yellow-300 font-bold' : 'text-sky-200/70'}>
                P:{hud.statPoints}
              </span>
              {(
                [
                  ['skillDmg', 'SKL'],
                  ['attack', 'ATK'],
                  ['hp', 'HP'],
                  ['speed', 'SPD'],
                ] as const
              ).map(([key, tag]) => (
                <button
                  key={key}
                  type="button"
                  tabIndex={-1}
                  disabled={hud.statPoints <= 0}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onAllocateStat(key);
                  }}
                  title={hud.statPoints > 0 ? `Add +1 to ${tag}` : `${tag} Level ${hud.stats[key]}`}
                  className={`px-1 py-0.5 border text-[7.5px] sm:text-[9px] font-pixel-mono whitespace-nowrap ${
                    hud.statPoints > 0
                      ? 'bg-sky-900/90 border-cyan-300 text-white hover:bg-sky-700 cursor-pointer'
                      : 'bg-[#081730]/80 border-sky-700/50 text-sky-200/80 cursor-default'
                  }`}
                >
                  {tag}:{hud.stats[key]}
                  {hud.statPoints > 0 ? '+' : ''}
                </button>
              ))}
            </div>
            <button
              type="button"
              tabIndex={-1}
              data-testid="open-status-btn"
              onClick={(e) => {
                e.currentTarget.blur();
                onOpenStatus();
              }}
              className="px-1.5 py-0.5 bg-sky-950 hover:bg-sky-800 border border-cyan-300/80 text-[8px] sm:text-[9px] font-pixel-mono font-bold text-cyan-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              STAT [K]
            </button>
          </div>

          {/* In-Place Room & Proximity Actions (Compact Mobile Strip) */}
          {hud.realm !== 'citadel' && (
            <div className="pointer-events-auto flex flex-col gap-0.5 max-w-[235px] sm:max-w-[320px]">
              <div className="flex items-center flex-wrap gap-1">
                {hud.realm === 'isekai_guild' && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-guild-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenGuild();
                    }}
                    className="px-2 py-0.5 bg-[#7c2d12]/95 hover:bg-[#9a3412] border border-amber-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-amber-50 cursor-pointer whitespace-nowrap"
                  >
                    RECEPTION QUESTS
                  </button>
                )}
                {hud.realm === 'raider_guild' && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-raider-guild-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenRaiderGuild();
                    }}
                    className="px-2 py-0.5 bg-[#4c1d95]/95 hover:bg-[#5b21b6] border border-purple-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-purple-50 cursor-pointer whitespace-nowrap"
                  >
                    108 RAIDER DUNGEONS ({hud.raiderRank})
                  </button>
                )}
                {hud.realm === 'isekai_potion_shop' && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-potion-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenPotionShop();
                    }}
                    className="px-2 py-0.5 bg-[#065f46]/95 hover:bg-[#047857] border border-emerald-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-emerald-50 cursor-pointer whitespace-nowrap"
                  >
                    BUY POTIONS
                  </button>
                )}
                {hud.realm === 'isekai_wardrobe' && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-wardrobe-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenWardrobe();
                    }}
                    className="px-2 py-0.5 bg-[#701a75]/95 hover:bg-[#86198f] border border-pink-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-pink-50 cursor-pointer whitespace-nowrap"
                  >
                    WARDROBE SHOP
                  </button>
                )}
                {hud.realm === 'isekai_weapons_shop' && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-weapons-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenWeaponsShop();
                    }}
                    className="px-2 py-0.5 bg-[#78350f]/95 hover:bg-[#92400e] border border-amber-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-amber-50 cursor-pointer whitespace-nowrap"
                  >
                    WEAPONS ARMORY
                  </button>
                )}
                {(nearVanceInTown || nearCaravanExterior || hud.realm === 'elf_kingdom') && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-caravan-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenCaravanRider();
                    }}
                    className="px-2 py-0.5 bg-[#78350f]/95 hover:bg-[#92400e] border border-amber-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-amber-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    CARAVAN [F]
                  </button>
                )}
                {nearStandShrine && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-stand-shrine-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenStandShrine();
                    }}
                    className="px-2 py-0.5 bg-[#4c0f24]/95 hover:bg-[#6b1533] border border-amber-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-amber-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    SHRINE [F]
                  </button>
                )}
                {nearRaiderHall && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-raider-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenRaiderGuild();
                    }}
                    className="px-2 py-0.5 bg-[#4c1d95]/95 hover:bg-[#5b21b6] border border-purple-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-purple-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    RAIDER GUILD
                  </button>
                )}
                {nearElfHerald && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-near-elf-herald-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onVirtualKey('interact', true);
                      setTimeout(() => onVirtualKey('interact', false), 60);
                    }}
                    className="px-2 py-0.5 bg-emerald-900/95 hover:bg-emerald-800 border border-emerald-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-emerald-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    ELF HERALD [F]
                  </button>
                )}
                {hud.realm === 'elf_kingdom' && hud.elfKingdomStage === 'arrived' && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-start-elf-banquet-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onStartElfBanquet();
                    }}
                    className="px-2 py-0.5 bg-emerald-800/95 hover:bg-emerald-700 border border-amber-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-amber-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    ROYAL BANQUET [F]
                  </button>
                )}
                {hud.realm === 'dueling_arena' && !hud.arenaDuel && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="hud-open-arena-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onOpenDuelingArena();
                    }}
                    className="px-2 py-0.5 bg-[#581c87]/95 hover:bg-[#6b21a8] border border-purple-300 font-pixel-mono text-[8px] sm:text-[9px] font-bold text-purple-50 cursor-pointer whitespace-nowrap"
                  >
                    ⚔ JJK DUEL
                  </button>
                )}
              </div>

              {hud.acceptedMissionId &&
                (hud.realm === 'dungeon_exterior' ||
                  hud.realm === 'isekai_town' ||
                  hud.realm.startsWith('isekai_') ||
                  hud.realm === 'dueling_arena') && (
                <div
                  data-testid="accepted-contract-hud-pill"
                  className="px-1.5 py-0.5 bg-[#112217]/92 border border-emerald-400/70 font-pixel-mono text-[7.5px] sm:text-[8.5px] text-emerald-200 truncate"
                >
                  {hud.realm === 'dungeon_exterior'
                    ? 'Walk east -> Dungeon Hole'
                    : 'Quest Ready: Ride Caravan Vance'}
                </div>
              )}

              {/* 4x SMALLER ISEKAI LOCATION BAR & RAID WATCH */}
              {hud.realm === 'isekai_town' && (
                <div className="flex items-center gap-1 flex-wrap">
                  <div
                    data-testid="town-landmark-compass"
                    className="bg-[#120b08]/88 border border-amber-500/45 px-1 py-0.5 flex items-center gap-1 max-w-[148px] sm:max-w-[205px] overflow-x-auto whitespace-nowrap leading-none"
                  >
                    {TOWN_LANDMARKS.map((lm) => {
                      const dx = Math.round((lm.x - playerApproxX) / 16);
                      const dir = Math.abs(dx) <= 2 ? 'HERE' : dx > 0 ? `${dx}▶` : `◀${Math.abs(dx)}`;
                      return (
                        <span
                          key={lm.id}
                          className={`font-pixel-mono text-[7px] leading-none shrink-0 ${
                            Math.abs(dx) <= 2 ? 'text-yellow-300 font-bold' : 'text-amber-100/75'
                          }`}
                        >
                          {lm.label}:{dir}
                        </span>
                      );
                    })}
                  </div>
                  <div
                    data-testid="town-raid-countdown"
                    className={`px-1 py-0.5 border font-pixel-mono text-[7px] leading-none flex items-center gap-1 whitespace-nowrap ${
                      hud.townRaid
                        ? 'bg-rose-950/95 border-rose-400 text-rose-100 font-bold'
                        : 'bg-[#120b10]/90 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <span>{hud.townRaid ? `RAID:${hud.townRaid.name.split(' ')[0]}` : 'Raid'}</span>
                    <span className="text-yellow-300 tabular-nums">
                      {hud.townRaid
                        ? `${hud.townRaid.totalHouses - hud.townRaid.housesBroken}/${hud.townRaid.totalHouses}`
                        : `${Math.floor(hud.secondsToTownRaid / 60)}:${String(hud.secondsToTownRaid % 60).padStart(2, '0')}`}
                    </span>
                  </div>
                </div>
              )}

              {activeSideQuest && activeSideQuest.progress.stage !== 3 && (
                <button
                  type="button"
                  tabIndex={-1}
                  data-testid="side-quest-tracker-banner"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onOpenSideQuests();
                  }}
                  className="text-left px-1.5 py-0.5 bg-[#1f0b12]/92 hover:bg-[#2d1019] border border-rose-400/70 font-pixel-mono text-[7.5px] sm:text-[8.5px] text-amber-100 cursor-pointer tabular-nums max-w-[175px] sm:max-w-[230px]"
                >
                  <div className="flex items-center justify-between gap-1 leading-tight">
                    <span className="text-rose-300 font-bold truncate">
                      ✦ SQ#{activeSideQuest.index}: {activeSideQuest.title}
                    </span>
                    <span className="text-yellow-300 shrink-0">
                      {activeSideQuest.progress.twistRevealed
                        ? 'BOSS'
                        : `${Math.min(activeSideQuest.progress.kills, activeSideQuest.twistTriggerKills)}/${activeSideQuest.twistTriggerKills}`}
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Top-Center: Co-op Guest Lock + Idle Isekai Countdown + Active Isekai Mission + Mega Boss Cutscene + Secret Caption + Boss Bar */}
        <div className="flex flex-col items-center gap-1.5">
          {hud.realm === 'citadel' && hud.idleSecondsToIsekai <= 95 && (
            <div
              data-testid="idle-isekai-timer"
              className="bg-[#081b2e]/95 border border-sky-400/80 px-3 py-1 text-center"
            >
              <span className="font-pixel-mono text-[10px] text-sky-200">
                ⏳ Dimensional Isekai Portal opens in <strong className="text-yellow-300">{hud.idleSecondsToIsekai}s</strong> of stillness
              </span>
            </div>
          )}

          {hud.isekaiMission && (
            <div
              data-testid="isekai-mission-hud"
              className="bg-[#1b0e0a]/95 border-2 border-amber-400 px-3.5 py-2 min-w-[260px] max-w-[380px] shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
            >
              <div className="flex items-center justify-between gap-2 text-[10px] font-pixel-mono">
                <span className="text-amber-300 font-bold">
                  [{hud.isekaiMission.rank}-RANK QUEST] {hud.isekaiMission.title}
                </span>
                {(hud.realm === 'goblin_dungeon' || hud.realm === 'demon_realm') && (
                  <span
                    data-testid="dungeon-depth-badge"
                    className="px-1.5 py-0.5 bg-[#090612] border border-amber-400/60 text-amber-200 shrink-0"
                  >
                    Depth {hud.dungeonDepth}
                  </span>
                )}
              </div>
              <div className="font-pixel-mono text-[10px] text-amber-100 mt-0.5">
                {hud.isekaiMission.objectiveText}
              </div>

              {hud.endlessContractCleared && (hud.realm === 'goblin_dungeon' || hud.realm === 'demon_realm') && (
                <div
                  data-testid="endless-contract-cleared-banner"
                  className="mt-1 px-2 py-0.5 bg-emerald-950 border border-emerald-400 font-pixel-mono text-[9px] font-bold text-emerald-200"
                >
                  ✓ Contract Cleared! Keep delving Deeper OR walk back to West Exit Rope!
                </div>
              )}

              {typeof hud.isekaiMission.carriageHp === 'number' && (
                <div className="mt-1.5">
                  <div className="flex justify-between text-[9px] font-pixel-mono text-pink-200 mb-0.5">
                    <span>Princess Carriage HP</span>
                    <span>
                      {hud.isekaiMission.carriageHp}/{hud.isekaiMission.carriageMaxHp} ({hud.isekaiMission.carriageProgress ?? 0}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#2a141b] border border-pink-400/50">
                    <div
                      className="h-full bg-emerald-500 transition-[width] duration-150"
                      style={{
                        width: `${Math.max(0, ((hud.isekaiMission.carriageHp ?? 0) / Math.max(1, hud.isekaiMission.carriageMaxHp ?? 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {hud.isekaiMission.demonKings && (
                <div className="mt-1.5 space-y-1">
                  {hud.isekaiMission.currentDemonKingStage && (
                    <div className="flex items-center justify-between gap-2 font-pixel-mono text-[9px] text-amber-300 font-bold">
                      <span>
                        1-by-1 {hud.isekaiMission.totalDemonKingStages && hud.isekaiMission.totalDemonKingStages > 3 ? 'Manhwa Pantheon' : 'Citadel'} Stage{' '}
                        {hud.isekaiMission.currentDemonKingStage}/{hud.isekaiMission.totalDemonKingStages ?? hud.isekaiMission.demonKings.length}
                      </span>
                      {hud.isekaiMission.activeKingMeta?.manhwaSource && (
                        <span className="text-fuchsia-300 truncate max-w-[180px]">
                          {hud.isekaiMission.activeKingMeta.manhwaSource}
                        </span>
                      )}
                    </div>
                  )}

                  {hud.isekaiMission.demonKings.length > 3 ? (
                    <>
                      {/* Compact 17-Stage Pip Bar */}
                      <div
                        data-testid="seventeen-kings-pip-bar"
                        className="grid gap-0.5"
                        style={{ gridTemplateColumns: `repeat(${hud.isekaiMission.demonKings.length}, minmax(0, 1fr))` }}
                      >
                        {hud.isekaiMission.demonKings.map((dk, idx) => (
                          <div
                            key={dk.id}
                            title={`Stage ${idx + 1}: ${dk.name}`}
                            className={`h-2 border ${
                              dk.defeated
                                ? 'bg-emerald-500 border-emerald-300'
                                : dk.active
                                  ? 'bg-amber-400 border-yellow-200 animate-pulse'
                                  : 'bg-[#1a0d26] border-purple-700/50'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Active Sovereign Showcase Card */}
                      {(() => {
                        const activeDk =
                          hud.isekaiMission.demonKings.find((d) => d.active && !d.defeated) ??
                          hud.isekaiMission.demonKings.find((d) => !d.defeated) ??
                          hud.isekaiMission.demonKings[0];
                        const meta = hud.isekaiMission.activeKingMeta;
                        return activeDk ? (
                          <div
                            data-testid="active-manhwa-king-card"
                            className="p-1.5 bg-[#12071d] border border-purple-400/65 space-y-1 text-[9px] font-pixel-mono"
                          >
                            <div className="flex justify-between gap-1 text-yellow-200 font-bold">
                              <span className="truncate">
                                ▶ {activeDk.name}
                                {activeDk.windVulnerable ? ' [+30%]' : ''}
                                {activeDk.stunned ? ' [STUN]' : ''}
                              </span>
                              <span className="shrink-0">
                                {activeDk.defeated ? 'SLAIN' : `${activeDk.hp}/${activeDk.maxHp}`}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#1e0b2e] border border-purple-500/50">
                              <div
                                className="h-full bg-rose-500 transition-[width] duration-150"
                                style={{ width: `${Math.max(0, (activeDk.hp / Math.max(1, activeDk.maxHp)) * 100)}%` }}
                              />
                            </div>
                            {meta && (meta.shieldHp ?? 0) > 0 && (
                              <div className="flex items-center justify-between text-[8px] text-cyan-300 font-bold">
                                <span>🛡 Barrier Shield Active</span>
                                <span>{meta.shieldHp}</span>
                              </div>
                            )}
                            {meta && (
                              <div className="text-[8px] text-amber-100/85 space-y-0.5 leading-tight">
                                {meta.weaponName && (
                                  <div className="truncate">
                                    ⚔ <span className="text-amber-300">{meta.weaponName}</span>
                                    {meta.companionName ? ` · Companion: ${meta.companionName}` : ''}
                                  </div>
                                )}
                                {meta.specialDesc && (
                                  <div className="text-cyan-200 truncate">✦ {meta.specialDesc}</div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </>
                  ) : (
                    hud.isekaiMission.demonKings.map((dk) => (
                      <div key={dk.id} className="text-[9px] font-pixel-mono">
                        <div className="flex justify-between text-purple-200 gap-1">
                          <span className={dk.defeated ? 'line-through opacity-55' : dk.active ? 'font-bold text-yellow-200 truncate' : 'opacity-65 truncate'}>
                            {dk.active && !dk.defeated ? '▶ ' : ''}
                            {dk.name}
                            {dk.windVulnerable ? ' [+30%]' : ''}
                            {dk.stunned ? ' [STUN]' : ''}
                          </span>
                          <span className="shrink-0">{dk.defeated ? 'SLAIN' : `${dk.hp}/${dk.maxHp}`}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1e0b2e] border border-purple-500/40">
                          <div
                            className="h-full bg-purple-400 transition-[width] duration-150"
                            style={{ width: `${Math.max(0, (dk.hp / Math.max(1, dk.maxHp)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}

                  {hud.isekaiMission.alliedNpcs && hud.isekaiMission.alliedNpcs.length > 0 && (
                    <div className="pt-1 border-t border-purple-500/30 grid grid-cols-3 gap-1">
                      {hud.isekaiMission.alliedNpcs.map((ally) => (
                        <div key={ally.id} className="text-[8px] font-pixel-mono text-sky-200">
                          <div className="truncate">{ally.name.split(' ')[0]} {ally.hp > 0 ? `${ally.hp}` : 'KO'}</div>
                          <div className="w-full h-1 bg-[#0b192e]">
                            <div
                              className="h-full bg-sky-400"
                              style={{ width: `${Math.max(0, (ally.hp / Math.max(1, ally.maxHp)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Orb Bar for A-Rank & S-Rank Demon Kings Bossfights */}
                  <div
                    data-testid="boss-orb-bar"
                    className="pointer-events-auto mt-1.5 pt-1.5 border-t border-amber-500/35 grid grid-cols-3 gap-1"
                  >
                    {(
                      [
                        { id: 'orb_flame', label: 'Flame', tag: '25%HP' },
                        { id: 'orb_wind', label: 'Wind', tag: '+30%' },
                        { id: 'orb_electric', label: 'Elec', tag: 'STUN' },
                      ] as const
                    ).map((o) => {
                      const count = hud.inventory.find((it) => it.id === o.id)?.count ?? 0;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          tabIndex={-1}
                          disabled={count <= 0}
                          data-testid={`boss-orb-${o.id}`}
                          onClick={(e) => {
                            e.currentTarget.blur();
                            onUseOrb(o.id);
                          }}
                          className="flex items-center justify-between gap-1 px-1.5 py-1 bg-[#140a16] border border-amber-400/60 disabled:opacity-45 hover:border-amber-200 cursor-pointer"
                        >
                          <PixelItemIcon itemId={o.id} size={16} />
                          <div className="text-left leading-none">
                            <div className="font-pixel-mono text-[8px] font-bold text-amber-100">{o.label}</div>
                            <div className="font-pixel-mono text-[8px] text-amber-300">{o.tag} x{count}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {hud.isekaiMission.activeCastBanner && (
                <div className="mt-1.5 px-2 py-0.5 bg-purple-950 border border-fuchsia-400 text-center font-pixel-mono text-[10px] font-bold text-fuchsia-200">
                  🔥 {hud.isekaiMission.activeCastBanner}
                </div>
              )}
            </div>
          )}

          {/* Solaris Town Raid Boss HUD Card (Rimuru Tempest / Goblin Slayer) */}
          {hud.realm === 'isekai_town' && hud.townRaid && (
            <div
              data-testid="town-raid-hud"
              className="bg-[#230912]/95 border-2 border-rose-400 px-3.5 py-2 min-w-[270px] max-w-[400px] shadow-[0_6px_22px_rgba(225,29,72,0.55)]"
            >
              <div className="flex items-center justify-between gap-2 text-[10px] font-pixel-mono">
                <span className="text-rose-200 font-bold truncate">
                  ⚠ TOWN RAID · {hud.townRaid.name}
                </span>
                <span className="text-yellow-300 shrink-0 font-bold">
                  {hud.townRaid.hp}/{hud.townRaid.maxHp}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#330d18] border border-rose-400/60 mt-1">
                <div
                  className="h-full bg-rose-500 transition-[width] duration-150"
                  style={{ width: `${Math.max(0, (hud.townRaid.hp / Math.max(1, hud.townRaid.maxHp)) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 text-[9px] font-pixel-mono text-amber-200 mt-1">
                <span>ATK:{hud.townRaid.attackDamage} · 3x HP Boss</span>
                <span className="text-rose-300 font-bold">
                  Broken Houses: {hud.townRaid.housesBroken}/{hud.townRaid.totalHouses}
                </span>
              </div>
              {hud.townRaid.activeSkillBanner && (
                <div className="mt-1 px-2 py-0.5 bg-[#3b0a1c] border border-amber-300 text-center font-pixel-mono text-[9px] font-bold text-yellow-200">
                  💥 {hud.townRaid.activeSkillBanner}
                </div>
              )}
            </div>
          )}

          {/* Post-Raid NPC House Rebuilding Progress Banner */}
          {hud.realm === 'isekai_town' &&
            !hud.townRaid &&
            hud.townDamageStatus &&
            (hud.townDamageStatus.broken > 0 || hud.townDamageStatus.rebuilding > 0) && (
              <div
                data-testid="town-rebuild-hud"
                className="bg-[#0e2218]/95 border-2 border-emerald-400 px-3.5 py-1.5 text-center shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
              >
                <div className="font-pixel-mono text-[10px] font-bold text-emerald-200">
                  🔨 Townsfolk Rebuilding Damaged Houses ({hud.townDamageStatus.rebuilding} repairing · {hud.townDamageStatus.broken} wrecked left)
                </div>
              </div>
            )}

          {/* JJK Colosseum Top Best-of-3 Scoreboard Bar & Centered Countdown Overlay */}
          {hud.realm === 'dueling_arena' && hud.arenaDuel && (
            <>
              <div
                data-testid="arena-duel-hud"
                className="fixed inset-x-0 top-14 z-20 pointer-events-none flex flex-col items-center px-3"
              >
                <div className="w-full max-w-[660px] bg-[#14091a]/95 border-2 border-purple-400 px-3.5 py-2 shadow-[0_6px_22px_rgba(0,0,0,0.9)]">
                  {/* Top Win / Loss Counter Row */}
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* Left: Player Wins & Losses */}
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center justify-between gap-1 text-[10px] font-pixel-mono tabular-nums">
                        <span className="text-amber-200 font-bold truncate">YOU</span>
                        <span data-testid="arena-player-record" className="text-emerald-300 font-bold whitespace-nowrap">
                          {hud.arenaDuel.playerRoundWins}W · {hud.arenaDuel.opponentRoundWins}L
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#2a1230] border border-amber-400/60 mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-[width] duration-150"
                          style={{ width: `${hpPct}%` }}
                        />
                      </div>
                      <div className="text-[9px] font-pixel-mono text-amber-100/85 mt-0.5 tabular-nums">
                        {hud.hp}/{hud.maxHp} HP
                      </div>
                    </div>

                    {/* Center: Round Counter & Round History Pips */}
                    <div className="col-span-4 flex flex-col items-center text-center">
                      <div
                        data-testid="arena-round-label"
                        className="font-pixel-mono text-[10px] font-bold tracking-wider text-cyan-200 tabular-nums"
                      >
                        ROUND {hud.arenaDuel.roundNumber} / 3
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {[0, 1, 2].map((idx) => {
                          const res = hud.arenaDuel!.roundHistory[idx];
                          return (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 border text-[9px] font-pixel-mono font-bold tabular-nums ${
                                res === 'player'
                                  ? 'bg-amber-950 border-amber-300 text-amber-200'
                                  : res === 'opponent'
                                    ? 'bg-fuchsia-950 border-fuchsia-400 text-fuchsia-200'
                                    : idx + 1 === hud.arenaDuel!.roundNumber
                                      ? 'bg-cyan-950 border-cyan-300 text-cyan-100'
                                      : 'bg-[#1f1026] border-purple-700/60 text-purple-300/60'
                              }`}
                            >
                              R{idx + 1}
                              {res === 'player' ? ' W' : res === 'opponent' ? ' L' : ''}
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-[9px] font-pixel-mono text-purple-200/80 mt-0.5 tabular-nums">
                        ATK:{hud.arenaDuel.matchedAtk} · BEST OF 3
                      </div>
                    </div>

                    {/* Right: Opponent Wins & Losses */}
                    <div className="col-span-4 min-w-0 text-right">
                      <div className="flex items-center justify-between gap-1 text-[10px] font-pixel-mono tabular-nums">
                        <span data-testid="arena-opponent-record" className="text-fuchsia-300 font-bold whitespace-nowrap">
                          {hud.arenaDuel.opponentRoundWins}W · {hud.arenaDuel.playerRoundWins}L
                        </span>
                        <span className="text-amber-300 font-bold truncate">
                          {hud.arenaDuel.name}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#2a1230] border border-fuchsia-400/60 mt-1 overflow-hidden">
                        <div
                          className="h-full bg-fuchsia-500 transition-[width] duration-150 ml-auto"
                          style={{
                            width: `${Math.max(0, (hud.arenaDuel.hp / Math.max(1, hud.arenaDuel.maxHp)) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[9px] font-pixel-mono text-purple-200/85 mt-0.5 tabular-nums">
                        <span className="text-yellow-300 font-bold truncate">
                          {hud.arenaDuel.aiActionTag ?? hud.arenaDuel.title}
                        </span>
                        <span className="shrink-0">
                          {hud.arenaDuel.hp}/{hud.arenaDuel.maxHp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {hud.arenaDuel.activeDomain && (
                    <div
                      data-testid="arena-domain-hud"
                      className="mt-1.5 px-2 py-0.5 bg-[#290b3d] border border-cyan-300 text-center font-pixel-mono text-[9px] font-bold text-cyan-100 tabular-nums"
                    >
                      DOMAIN EXPANSION: {hud.arenaDuel.activeDomain.name.toUpperCase()} ({hud.arenaDuel.activeDomain.secondsLeft.toFixed(1)}s)
                    </div>
                  )}
                  {hud.arenaDuel.activeSkillBanner && (
                    <div className="mt-1 px-2 py-0.5 bg-purple-950 border border-fuchsia-300 text-center font-pixel-mono text-[10px] font-bold text-amber-200">
                      {hud.arenaDuel.activeSkillBanner}
                    </div>
                  )}
                </div>
              </div>

              {(hud.arenaDuel.roundPhase === 'countdown' ||
                hud.arenaDuel.roundPhase === 'round_over' ||
                (hud.arenaDuel.roundPhase === 'fighting' && hud.arenaDuel.fightBannerActive)) && (
                <div
                  data-testid="arena-countdown-overlay"
                  className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center"
                >
                  <div className="bg-[#120718]/92 border-2 border-amber-300 px-8 py-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.92)]">
                    {hud.arenaDuel.roundPhase === 'countdown' && (
                      <>
                        <div className="font-pixel-mono text-xs font-bold tracking-widest text-cyan-300">
                          ROUND {hud.arenaDuel.roundNumber} OF 3
                        </div>
                        <div className="font-display text-4xl sm:text-5xl font-bold text-amber-300 mt-1 tabular-nums">
                          {hud.arenaDuel.countdownSeconds > 0 ? hud.arenaDuel.countdownSeconds : 'READY'}
                        </div>
                        <div className="font-pixel-mono text-[10px] text-purple-200 mt-1">
                          FIRST TO 2 WINS · CONTROLS LOCKED
                        </div>
                      </>
                    )}
                    {hud.arenaDuel.roundPhase === 'fighting' && hud.arenaDuel.fightBannerActive && (
                      <div className="font-display text-4xl sm:text-5xl font-bold tracking-wider text-yellow-300">
                        FIGHT!
                      </div>
                    )}
                    {hud.arenaDuel.roundPhase === 'round_over' && (
                      <>
                        <div className="font-display text-2xl sm:text-3xl font-bold text-amber-200">
                          {hud.arenaDuel.lastRoundWinner === 'player'
                            ? `ROUND ${hud.arenaDuel.roundNumber} WON!`
                            : `ROUND ${hud.arenaDuel.roundNumber} LOST!`}
                        </div>
                        <div className="font-pixel-mono text-xs text-cyan-200 mt-1 tabular-nums">
                          SCORE: YOU {hud.arenaDuel.playerRoundWins} - {hud.arenaDuel.opponentRoundWins} {hud.arenaDuel.name.toUpperCase()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {hud.worldRole === 'guest' && (
            <div
              data-testid="coop-guest-badge"
              className="bg-[#0b1b2b]/95 border-2 border-cyan-400 px-3 py-1 text-center shadow-[0_3px_12px_rgba(34,211,238,0.3)]"
            >
              <span className="font-pixel-mono text-[10px] font-bold text-cyan-200 tracking-wide">
                CO-OP GUEST · {hud.worldHostName ? `${hud.worldHostName}'s` : hud.worldId} World · BOSSES LOCKED
              </span>
            </div>
          )}

          {hud.bossCooldownSeconds > 0 && (
            <div
              data-testid="boss-cooldown-badge"
              className="bg-[#181024]/95 border-2 border-violet-400 px-3 py-1 text-center shadow-[0_3px_12px_rgba(167,139,250,0.35)]"
            >
              <span className="font-pixel-mono text-[10px] font-bold text-violet-200 tracking-wide">
                NO BOSSES: {hud.bossCooldownSeconds}s · 5-Boss Breather Cooldown Active
              </span>
            </div>
          )}

          {hud.starPlatinumActive && (
            <div
              data-testid="star-platinum-active-badge"
              className="bg-[#1c0f2b]/95 border border-purple-300 px-2.5 py-0.5 text-center"
            >
              <span className="font-pixel-mono text-[10px] font-bold text-purple-200 tracking-wider">
                ★ {STANDS[hud.equippedStand].name.toUpperCase()} · {STAND_SKILL_TAGS[hud.equippedStand]}
              </span>
            </div>
          )}

          {hud.megaCutscene && (
            <div
              data-testid="mega-boss-cutscene"
              className="flex items-center gap-3 bg-[#1a0514]/96 border-2 border-yellow-300 px-4 py-2 shadow-[0_6px_24px_rgba(244,63,94,0.65)] max-w-[420px]"
            >
              <PixelBossPortrait
                bossIndex={hud.megaCutscene.archetype === 'gyro_zeppeli' ? TOTAL_BOSSES + 1 : 901}
                megaArchetype={
                  hud.megaCutscene.archetype === 'gyro_zeppeli' ? undefined : hud.megaCutscene.archetype
                }
                isGyroBoss={hud.megaCutscene.archetype === 'gyro_zeppeli'}
                expression="wryyy"
                size={44}
              />
              <div className="min-w-0">
                <div className="font-pixel-mono text-[10px] font-bold tracking-widest text-rose-300">
                  {hud.megaCutscene.archetype === 'gyro_zeppeli'
                    ? '✦ FINAL CITADEL BOSS · GYRO ZEPPELI'
                    : '⚠ DIMENSIONAL GLITCH BREACH · MEGA BOSS'}
                </div>
                <div className="font-display text-sm font-bold text-yellow-200 truncate">
                  {hud.megaCutscene.name}
                </div>
                <div className="font-pixel-mono text-[10px] text-cyan-200 truncate">
                  [{hud.megaCutscene.standName}] · {hud.megaCutscene.subtitle}
                </div>
              </div>
            </div>
          )}

          {/* Elf Kingdom Real-Time Ambush / Feast Celebration HUD */}
          {hud.realm === 'elf_kingdom' && hud.elfKingdomHud && (
            <div
              data-testid="elf-kingdom-hud"
              className="bg-[#081a14]/95 border-2 border-emerald-400 px-2.5 py-1.5 min-w-[210px] max-w-[300px] shadow-[0_6px_18px_rgba(16,185,129,0.35)]"
            >
              <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-pixel-mono">
                <span className="text-emerald-300 font-bold truncate">
                  {hud.elfKingdomHud.stage === 'celebration'
                    ? '♛ AETHELGARD FEAST CELEBRATION'
                    : hud.elfKingdomHud.stage === 'ambush_active'
                      ? `☠ ELDRITCH AMBUSH · WAVE ${hud.elfKingdomHud.wave}/2`
                      : '🌿 SILVER-BOUGH BANQUET HALL'}
                </span>
                {hud.elfKingdomHud.stage === 'ambush_active' && (
                  <span className="text-rose-300 font-bold shrink-0 tabular-nums">
                    Foes: {hud.elfKingdomHud.enemiesAlive}
                  </span>
                )}
              </div>
              {hud.elfKingdomHud.bossHp !== null && hud.elfKingdomHud.bossMaxHp !== null && (
                <div className="mt-1">
                  <div className="flex justify-between text-[8px] font-pixel-mono text-rose-200 tabular-nums">
                    <span className="truncate">{hud.elfKingdomHud.bossName ?? 'Feast-Devourer'}</span>
                    <span>{hud.elfKingdomHud.bossHp}/{hud.elfKingdomHud.bossMaxHp}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#290b15] border border-rose-400/60 mt-0.5">
                    <div
                      className="h-full bg-rose-500 transition-[width] duration-150"
                      style={{ width: `${Math.max(0, (hud.elfKingdomHud.bossHp / Math.max(1, hud.elfKingdomHud.bossMaxHp)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {hud.elfKingdomHud.swordsmanHp !== null && hud.elfKingdomHud.swordsmanMaxHp !== null && (
                <div className="mt-1 text-[8px] font-pixel-mono text-emerald-200 flex items-center justify-between tabular-nums">
                  <span>⚔ Sword Saint Kaelen (Ally)</span>
                  <span className="text-yellow-300">{hud.elfKingdomHud.swordsmanHp}/{hud.elfKingdomHud.swordsmanMaxHp}</span>
                </div>
              )}
            </div>
          )}

          {/* Raider Guild 108-Dungeon Floor / Stairs / Demonic Boss HUD */}
          {hud.realm === 'raider_dungeon' && hud.activeRaiderDungeon && (
            <div
              data-testid="raider-dungeon-hud"
              className="pointer-events-auto bg-[#13081a]/95 border-2 border-purple-400 px-2.5 py-1.5 min-w-[215px] max-w-[320px] shadow-[0_6px_18px_rgba(168,85,247,0.45)]"
            >
              <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-pixel-mono tabular-nums">
                <span className="text-amber-300 font-bold truncate">
                  {hud.activeRaiderDungeon.code} · F{hud.activeRaiderDungeon.currentFloor}/{hud.activeRaiderDungeon.totalFloors}
                </span>
                <span className="text-purple-200 shrink-0">
                  {hud.activeRaiderDungeon.designLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[8.5px] font-pixel-mono text-amber-100 mt-0.5 tabular-nums">
                <span>Foes left: {hud.activeRaiderDungeon.enemiesAlive}</span>
                {hud.activeRaiderDungeon.stairsUnlocked && hud.activeRaiderDungeon.currentFloor < hud.activeRaiderDungeon.totalFloors && (
                  <button
                    type="button"
                    tabIndex={-1}
                    data-testid="raider-ascend-stairs-btn"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onAscendRaiderStairs();
                    }}
                    className="px-1.5 py-0.5 bg-emerald-800 hover:bg-emerald-700 border border-emerald-300 text-white font-bold cursor-pointer"
                  >
                    STAIRS ▲ [F]
                  </button>
                )}
              </div>
              {hud.activeRaiderDungeon.bossActive && hud.activeRaiderDungeon.bossHp !== null && hud.activeRaiderDungeon.bossMaxHp !== null && (
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between text-[8.5px] font-pixel-mono text-rose-200 font-bold tabular-nums">
                    <span className="truncate">☠ {hud.activeRaiderDungeon.bossName}</span>
                    <span>{hud.activeRaiderDungeon.bossHp}/{hud.activeRaiderDungeon.bossMaxHp}</span>
                  </div>
                  <div className="w-full h-2 bg-[#2b0915] border border-rose-400/70">
                    <div
                      className="h-full bg-rose-500 transition-[width] duration-150"
                      style={{ width: `${Math.max(0, (hud.activeRaiderDungeon.bossHp / Math.max(1, hud.activeRaiderDungeon.bossMaxHp)) * 100)}%` }}
                    />
                  </div>
                  {hud.activeRaiderDungeon.bossBanner && (
                    <div className="px-1.5 py-0.5 bg-rose-950 border border-amber-300 text-center font-pixel-mono text-[8px] font-bold text-yellow-200">
                      {hud.activeRaiderDungeon.bossBanner}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1 pt-0.5">
                    {(
                      [
                        { id: 'orb_flame', label: 'Flame', tag: '25%' },
                        { id: 'orb_wind', label: 'Wind', tag: '+30%' },
                        { id: 'orb_electric', label: 'Elec', tag: 'STUN' },
                      ] as const
                    ).map((o) => {
                      const count = hud.inventory.find((it) => it.id === o.id)?.count ?? 0;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          tabIndex={-1}
                          disabled={count <= 0}
                          onClick={(e) => {
                            e.currentTarget.blur();
                            onUseOrb(o.id);
                          }}
                          className="flex items-center justify-between gap-1 px-1 py-0.5 bg-[#1a0b22] border border-amber-400/60 disabled:opacity-45 text-[7.5px] font-pixel-mono text-amber-100 cursor-pointer"
                        >
                          <span>{o.label}</span>
                          <span className="text-yellow-300">x{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4x SMALLER Quest Accept / Secret Discovery Toast */}
          {hud.secretCaption && (
            <div
              data-testid="secret-discovery-caption"
              className="relative bg-[#1b0b07]/94 border border-amber-300 px-1.5 py-0.5 text-center shadow-[0_2px_8px_rgba(251,146,60,0.35)] max-w-[148px] sm:max-w-[190px] pointer-events-none"
            >
              <div className="font-pixel-mono text-[8px] sm:text-[9px] font-bold tracking-wide text-amber-300 truncate leading-tight">
                ✦ {hud.secretCaption.title}
              </div>
              <div className="font-pixel-mono text-[7px] sm:text-[8px] text-amber-100 leading-tight line-clamp-2">
                {hud.secretCaption.detail}
              </div>
            </div>
          )}

        </div>

        {/* Top-Right: Compact Utility Icon Buttons & World / Save */}
        <div className="flex items-center gap-1 pointer-events-auto flex-wrap justify-end max-w-[46%]">
          <span className="hidden lg:inline-block font-pixel-mono text-[10px] text-amber-200/80 mr-1">
            {hud.worldRole === 'host' ? `World ${hud.worldId}` : 'Guest'} · {hud.onlineCount} Online
          </span>
          <button
            type="button"
            aria-label="Open Save and Load Menu"
            title="Save / Load Game"
            data-testid="open-saves-btn"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenSaves();
            }}
            className="px-1.5 h-7 sm:h-8 flex items-center justify-center bg-[#14251d] border border-emerald-400/65 hover:border-emerald-200 font-pixel-mono text-[8px] sm:text-[10px] font-bold text-emerald-200 cursor-pointer whitespace-nowrap"
          >
            SAVE
          </button>
          <button
            type="button"
            aria-label="Open Online Bastera Worlds"
            title="Online Co-op Worlds"
            data-testid="open-worlds-btn"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenWorlds();
            }}
            className="px-1.5 h-7 sm:h-8 flex items-center justify-center bg-[#101e30] border border-cyan-400/65 hover:border-cyan-200 font-pixel-mono text-[8px] sm:text-[10px] font-bold text-cyan-200 cursor-pointer whitespace-nowrap"
          >
            WRLD({hud.worldPlayerCount})
          </button>
          <button
            type="button"
            aria-label="Open How to Fight Tutorial"
            title="How to Fight & Controls Manual"
            data-testid="open-tutorial-btn"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenTutorial();
            }}
            className="px-1.5 h-7 sm:h-8 flex items-center justify-center bg-[#291518] border border-amber-300/80 hover:border-amber-100 font-pixel-mono text-[8px] sm:text-[10px] font-bold text-amber-100 cursor-pointer whitespace-nowrap shrink-0"
          >
            HELP
          </button>
          <button
            type="button"
            aria-label="Open Side Quests Journal"
            title="Outskirts Side Quests [Q]"
            data-testid="open-side-quests-btn"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenSideQuests();
            }}
            className="px-1.5 h-7 sm:h-8 flex items-center justify-center bg-[#2a0f18] border border-rose-400/70 hover:border-rose-200 font-pixel-mono text-[8px] sm:text-[10px] font-bold text-rose-200 cursor-pointer whitespace-nowrap shrink-0"
          >
            QUESTS
          </button>
          <button
            type="button"
            aria-label="Open Main Sanctuary Interface"
            title="Sanctuary: Customize, Stats & Items [C]"
            data-testid="open-sanctuary-btn"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenSanctuary();
            }}
            className="px-1.5 h-7 sm:h-8 flex items-center justify-center bg-[#23121b] border border-amber-400/65 hover:border-amber-200 font-pixel-mono text-[8px] sm:text-[10px] font-bold text-amber-200 cursor-pointer whitespace-nowrap shrink-0"
          >
            GEAR
          </button>
          <button
            type="button"
            aria-label="Open Inventory"
            title="Inventory [I]"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenInventory();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#180f14] border border-amber-500/40 hover:border-amber-300 text-amber-100 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 7h12l1 13H5L6 7z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Checkpoints and Boss Codex"
            title="Checkpoints & Codex [M]"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenMap();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#180f14] border border-amber-500/40 hover:border-amber-300 text-amber-100 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" />
              <path d="M9 4v14M15 6v14" />
            </svg>
          </button>
          {!isMobileLocked && (
            <button
              type="button"
              aria-label="Rotate Screen Perspective"
              title="Rotate Perspective [V]"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleRotate();
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#180f14] border border-amber-500/40 hover:border-amber-300 text-amber-100 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="7" y="3" width="10" height="18" rx="1" />
                <path d="M3 12a9 9 0 0 1 9-9" />
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label={hud.muted ? 'Unmute Audio' : 'Mute Audio'}
            title="Mute [U]"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#180f14] border border-amber-500/40 hover:border-amber-300 text-amber-100 cursor-pointer"
          >
            {hud.muted ? (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M22 9l-6 6M16 9l6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              </svg>
            )}
          </button>
          <button
            type="button"
            aria-label="Pause Game"
            title="Pause [Esc]"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onTogglePause();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#180f14] border border-amber-500/40 hover:border-amber-300 text-amber-100 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Upper-Center Independent Dialogue Bubble (NEVER overlaps bottom Slash / Ability buttons!) */}
      {hud.dialogue && (
        <div
          data-testid="hud-dialogue-slot"
          className="fixed top-9 sm:top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-center w-[225px] sm:w-[295px]"
        >
          <button
            type="button"
            data-testid="hud-dialogue-box"
            onClick={(e) => {
              e.currentTarget.blur();
              onAdvanceDialogue();
            }}
            aria-label="Advance Dialogue"
            className="pointer-events-auto flex items-start gap-1.5 w-full bg-black/95 border-2 border-white px-2 py-1 text-left shadow-[0_3px_0_rgba(0,0,0,0.85)] cursor-pointer"
          >
            {hud.dialogue.portraitKind === 'warrior' ? (
              <PixelWarriorPortrait
                weaponId={hud.equippedWeapon}
                customization={hud.customization}
                size={24}
              />
            ) : hud.dialogue.portraitKind === 'boss' && hud.activeBoss ? (
              <PixelBossPortrait bossIndex={hud.activeBoss.index} expression="smirk" size={24} />
            ) : (
              <div
                className="w-6 h-6 shrink-0 border border-white/60 flex items-center justify-center font-pixel-mono text-[9px] font-bold text-black mt-0.5"
                style={{ backgroundColor: hud.dialogue.portraitColor }}
              >
                {hud.dialogue.portraitKind === 'boss'
                  ? '★'
                  : hud.dialogue.portraitKind === 'throne'
                    ? '♛'
                    : hud.dialogue.portraitKind === 'secret'
                      ? '✦'
                      : '⚔'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 text-[8px] sm:text-[9px] font-pixel-mono text-amber-300 leading-none mb-0.5">
                <span className="truncate">* {hud.dialogue.speaker}</span>
                <span className="text-white/60 shrink-0">[Tap/F]</span>
              </div>
              <p className="font-pixel-mono text-[9px] sm:text-[10px] leading-tight text-white">
                * {currentLine}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Transient World / Loot / Multiplayer Announcement */}
      <div className="flex flex-col items-center gap-0.5 my-auto pointer-events-none">
        {hud.announcement && (
          <div className="px-2 py-0.5 bg-[#120a0e]/88 border border-amber-400/60 font-pixel-mono text-[9px] sm:text-xs text-amber-200 max-w-[260px] sm:max-w-md text-center truncate">
            {hud.announcement}
          </div>
        )}
        {hud.nearbyPrompt && !hud.dialogue && (
          <div className="px-2 py-0.5 bg-black/82 border border-white/60 font-pixel-mono text-[9px] sm:text-[11px] text-amber-200 max-w-[240px] sm:max-w-md text-center truncate">
            {hud.nearbyPrompt}
          </div>
        )}
      </div>

      {/* Bottom Row: Static Touch D-Pad + Combat Weapon/3-Skill Bar (Unobstructed by Dialogue!) */}
      <div className="flex items-end justify-between gap-2">
        {/* Mobile Touch Left/Right D-Pad when touch/rotated layout active */}
        {isTouchLayout ? (
          <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
            <button
              type="button"
              aria-label="Move Left"
              data-testid="touch-move-left"
              onPointerDown={() => onVirtualKey('left', true)}
              onPointerUp={() => onVirtualKey('left', false)}
              onPointerLeave={() => onVirtualKey('left', false)}
              className="w-10 h-10 bg-[#160e12]/90 border border-amber-400/60 text-amber-100 font-pixel-mono text-sm active:bg-amber-900/60"
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="Move Right"
              data-testid="touch-move-right"
              onPointerDown={() => onVirtualKey('right', true)}
              onPointerUp={() => onVirtualKey('right', false)}
              onPointerLeave={() => onVirtualKey('right', false)}
              className="w-10 h-10 bg-[#160e12]/90 border border-amber-400/60 text-amber-100 font-pixel-mono text-sm active:bg-amber-900/60"
            >
              ▶
            </button>
          </div>
        ) : (
          <div className="hidden sm:block text-[11px] font-pixel-mono text-amber-100/65">
            {hud.distanceMeters}m · CP {hud.checkpoints.filter((c) => c.reached).length}
          </div>
        )}

        {/* Bottom-Right: Weapon Style + 3-Slot Special Skill Loadout */}
        <div className="flex flex-col items-end gap-1 pointer-events-auto shrink-0">
          {isTouchLayout && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Interact"
                data-testid="touch-use-btn"
                onPointerDown={() => onVirtualKey('interact', true)}
                onPointerUp={() => onVirtualKey('interact', false)}
                className="px-2.5 h-8 bg-[#180f14]/92 border border-amber-400/60 text-[10px] font-pixel-mono font-bold text-amber-200 whitespace-nowrap"
              >
                Use
              </button>
              <button
                type="button"
                aria-label="Jump"
                data-testid="touch-jump-btn"
                onPointerDown={() => onVirtualKey('jump', true)}
                onPointerUp={() => onVirtualKey('jump', false)}
                onPointerLeave={() => onVirtualKey('jump', false)}
                className="px-2.5 h-8 bg-[#180f14]/92 border border-amber-400/60 text-[10px] font-pixel-mono font-bold text-amber-100 whitespace-nowrap"
              >
                Jump
              </button>
              <button
                type="button"
                aria-label="Sword Attack"
                data-testid="touch-slash-btn"
                onPointerDown={() => onVirtualKey('attack', true)}
                onPointerUp={() => onVirtualKey('attack', false)}
                className="px-3.5 h-8 bg-[#991b1b]/95 border border-amber-300 text-[11px] font-pixel-mono font-bold text-amber-50 whitespace-nowrap"
              >
                Slash
              </button>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onCycleWeapon();
              }}
              tabIndex={-1}
              title="Click to cycle unlocked Sword Style"
              className="px-1.5 py-1 bg-[#160e13]/95 border border-amber-500/45 hover:border-amber-300 text-left cursor-pointer flex items-center gap-1.5"
            >
              <PixelWeaponIcon weaponId={hud.equippedWeapon} size={22} />
              <div className="hidden sm:block">
                <div className="text-[9px] font-pixel-mono text-amber-300 leading-none">
                  [J] {weapon.styleName}
                  {(weapon.damageMultiplier ?? 1) > 1 ? ` · ${weapon.damageMultiplier}x` : ''}
                </div>
                <div className="text-[10px] font-semibold text-amber-50 whitespace-nowrap mt-0.5">
                  {weapon.name.split(' ').slice(-2).join(' ')}
                </div>
              </div>
            </button>

            <button
              type="button"
              data-testid="hud-dash-btn"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onDash();
              }}
              title="Quick Dash [Shift] (10 ST, 1.0s CD) · Double-Tap: White Aura Invincible +30% SPD"
              className={`relative min-w-[46px] sm:min-w-[60px] px-1 h-9 sm:h-11 flex flex-col items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                hud.whiteAuraSeconds > 0
                  ? 'bg-[#e2e8f0] border-white text-slate-950 shadow-[0_0_12px_rgba(255,255,255,0.75)]'
                  : hud.dashCooldown <= 0 && hud.stamina >= 10
                    ? 'bg-[#121c2a]/95 border-cyan-400/80 hover:border-cyan-200 text-cyan-100'
                    : 'bg-[#0c1118]/85 border-cyan-900/40 text-cyan-200/45'
              }`}
            >
              <span
                className={`text-[8px] sm:text-[9px] font-pixel-mono leading-none whitespace-nowrap ${
                  hud.whiteAuraSeconds > 0 ? 'text-slate-900 font-bold' : 'text-cyan-300'
                }`}
              >
                {hud.whiteAuraSeconds > 0 ? 'AURA' : 'SHFT'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-pixel-mono mt-0.5 tabular-nums whitespace-nowrap">
                {hud.whiteAuraSeconds > 0
                  ? `${hud.whiteAuraSeconds.toFixed(1)}s`
                  : hud.dashCooldown > 0
                    ? `${hud.dashCooldown.toFixed(1)}s`
                    : 'DASH'}
              </span>
            </button>

            {([0, 1, 2] as const).map((slotIdx) => {
              const skillId: SkillId = hud.skillSlots[slotIdx];
              const skill = SKILLS[skillId];
              const cd = hud.skillCooldowns[slotIdx];
              const ready = cd <= 0 && hud.stamina >= skill.staminaCost;
              const isOra = skillId === 'stand_rush';
              const standGuardLive = isOra && hud.standGuardSeconds > 0;
              const displayTag = isOra ? STAND_SKILL_TAGS[hud.equippedStand] : skill.shortTag;
              const tooltipName = isOra
                ? `${STANDS[hud.equippedStand].name} (${skill.staminaCost} Stam) · Double-Tap: 1.5s Defensive Stand Guard & Counter Barrage`
                : `${skill.name} (${skill.staminaCost} Stam)`;
              return (
                <button
                  key={slotIdx}
                  type="button"
                  data-testid={`hud-skill-${slotIdx}`}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onTriggerSkill(slotIdx);
                  }}
                  title={tooltipName}
                  className={`relative min-w-[48px] sm:min-w-[60px] px-1 h-9 sm:h-11 flex flex-col items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                    standGuardLive
                      ? 'bg-[#3b0d54] border-yellow-300 text-yellow-100 shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                      : isOra && hud.starPlatinumActive
                        ? 'bg-[#2a1242]/95 border-purple-300 text-purple-100 shadow-[0_0_10px_rgba(192,132,252,0.5)]'
                        : ready
                          ? isOra
                            ? 'bg-[#1f1030]/95 border-purple-400/85 hover:border-purple-200 text-purple-50'
                            : 'bg-[#1a1016]/95 border-amber-400/70 hover:border-amber-200 text-amber-50'
                          : 'bg-[#100a0e]/85 border-amber-900/40 text-amber-200/45'
                  }`}
                >
                  <span
                    className={`text-[8px] sm:text-[9px] font-pixel-mono leading-none whitespace-nowrap ${
                      standGuardLive
                        ? 'text-yellow-300 font-bold'
                        : isOra
                          ? 'text-purple-300'
                          : 'text-amber-300'
                    }`}
                  >
                    [{slotIdx + 1}]{standGuardLive ? 'GRD' : displayTag}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-pixel-mono mt-0.5 tabular-nums whitespace-nowrap">
                    {standGuardLive
                      ? `${hud.standGuardSeconds.toFixed(1)}s`
                      : cd > 0
                        ? `${cd.toFixed(1)}s`
                        : `${skill.staminaCost}ST`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
