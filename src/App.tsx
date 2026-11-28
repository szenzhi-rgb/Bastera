import { useCallback, useEffect, useRef, useState } from 'react';
import { BossBattleOverlay } from './components/BossBattleOverlay';
import { CaravanRiderModal } from './components/CaravanRiderModal';
import { CastleIntroCutsceneModal } from './components/CastleIntroCutsceneModal';
import { CheckpointMapModal } from './components/CheckpointMapModal';
import { DuelingArenaModal } from './components/DuelingArenaModal';
import { ElfCutsceneModal } from './components/ElfCutsceneModal';
import { GameHud } from './components/GameHud';
import { GuildInviteToast } from './components/GuildInviteToast';
import { GuildModal } from './components/GuildModal';
import { InventoryModal } from './components/InventoryModal';
import { PotionShopModal } from './components/PotionShopModal';
import { RaiderGuildModal } from './components/RaiderGuildModal';
import { SanctuaryModal } from './components/SanctuaryModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { SideQuestModal } from './components/SideQuestModal';
import { SoloLevelingStatusModal } from './components/SoloLevelingStatusModal';
import { StandShrineModal } from './components/StandShrineModal';
import { StatusModals } from './components/StatusModals';
import { TitleScreen } from './components/TitleScreen';
import { TutorialModal } from './components/TutorialModal';
import { WardrobeModal } from './components/WardrobeModal';
import { WeaponShopModal } from './components/WeaponShopModal';
import { WorldsModal } from './components/WorldsModal';
import { TOTAL_BOSSES, TOTAL_HIDDEN_PASSAGES } from './game/data';
import { BasteraGameEngine } from './game/engine';
import { ISEKAI_IDLE_TRANSPORT_SECONDS, SIDE_QUESTS } from './game/isekai';
import {
  DEFAULT_WARRIOR_CUSTOMIZATION,
  createInitialInventory,
} from './game/rules';
import {
  BasteraSaveData,
  deleteLocalSave,
  listLocalSaves,
  loadLocalSave,
  normalizeLoadedSave,
} from './game/saveSystem';
import type {
  BasteraSaveSummary,
  HudSnapshot,
  SideQuestId,
  SkillId,
  StatKey,
  WarriorCustomization,
  WeaponId,
} from './game/types';

const INITIAL_HUD: HudSnapshot = {
  status: 'title',
  hp: 115,
  maxHp: 115,
  stamina: 100,
  maxStamina: 100,
  gold: 25,
  level: 1,
  statPoints: 0,
  stats: { skillDmg: 0, attack: 0, hp: 0, speed: 0 },
  monstersSlain: 0,
  customization: { ...DEFAULT_WARRIOR_CUSTOMIZATION },
  biome: 'castle',
  biomeLabel: 'Abandoned Royal Castle',
  distanceMeters: 0,
  bossesDefeated: 0,
  totalBosses: TOTAL_BOSSES,
  secretsFound: 0,
  totalSecrets: TOTAL_HIDDEN_PASSAGES,
  equippedWeapon: 'claymore',
  unlockedWeapons: ['claymore', 'rapier'],
  skillSlots: ['blade_dash', 'candlefire_wave', 'stand_rush'],
  skillCooldowns: [0, 0, 0],
  dashCooldown: 0,
  starPlatinumActive: false,
  starStones: 0,
  equippedStand: 'star_platinum',
  unlockedStands: ['star_platinum'],
  dinoFormSeconds: 0,
  chiliPepperSeconds: 0,
  whiteAuraSeconds: 0,
  whiteAuraCooldown: 0,
  standGuardSeconds: 0,
  standGuardCooldown: 0,
  bossCooldownSeconds: 0,
  bossFoughtStreak: 0,
  idleSecondsToIsekai: ISEKAI_IDLE_TRANSPORT_SECONDS,
  realm: 'citadel',
  guildRank: 'F',
  rankMissionsCompleted: 0,
  missionsRequiredPerRank: 5,
  bRankEscortsCompleted: 0,
  acceptedMissionId: null,
  dungeonTarget: 'goblin_dungeon',
  dungeonDepth: 1,
  dungeonChoicePending: null,
  endlessContractCleared: false,
  activeGuildFloor: 1,
  damageBoostMultiplier: 1,
  damageBoostSeconds: 0,
  hotSpringSeconds: 0,
  isNightTime: false,
  nightFactor: 0,
  secondsToNightToggle: 180,
  unlockedWardrobe: ['outfit_knight_plate', 'hat_helm'],
  crownUnlocked: false,
  elfCrownUnlocked: false,
  elfKingdomInvited: false,
  elfKingdomStage: 'uninvited',
  elfCutscene: null,
  elfKingdomHud: null,
  raiderRank: 'Bronze',
  raiderPoints: 0,
  clearedRaiderDungeons: [],
  activeRaiderDungeon: null,
  gyroDefeated: false,
  isekaiPortalOpen: false,
  isekaiMission: null,
  coronationCutscene: null,
  caravanRide: null,
  arenaWins: 0,
  townRaid: null,
  secondsToTownRaid: 300,
  townDamageStatus: null,
  arenaDuel: null,
  sideQuests: SIDE_QUESTS.map((q) => ({
    ...q,
    progress: { stage: 0, kills: 0, twistRevealed: false, bossSpawned: false },
  })),
  trackedSideQuestId: null,
  onlineAdventurers: [],
  pendingGuildInvites: [],
  inventory: createInitialInventory(),
  dialogue: null,
  activeBoss: null,
  bossBattle: null,
  megaCutscene: null,
  checkpoints: [],
  onlineCount: 1,
  worldId: 'LOCAL',
  worldRole: 'host',
  worldHostName: null,
  isWorldPublic: true,
  onlineWorlds: [],
  worldPlayerCount: 1,
  lastSavedAt: null,
  announcement: null,
  secretCaption: null,
  nearbyPrompt: null,
  muted: false,
};

function mergeSaveSummaries(
  remote: BasteraSaveSummary[],
  local: BasteraSaveSummary[],
): BasteraSaveSummary[] {
  const byId = new Map<string, BasteraSaveSummary>();
  for (const s of local) byId.set(s.saveId, s);
  for (const s of remote) {
    const prev = byId.get(s.saveId);
    if (!prev || s.savedAt >= prev.savedAt) {
      byId.set(s.saveId, s);
    }
  }
  return Array.from(byId.values()).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BasteraGameEngine | null>(null);

  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [showInventory, setShowInventory] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showWorldsModal, setShowWorldsModal] = useState(false);
  const [showGuildModal, setShowGuildModal] = useState(false);
  const [guildModalFloor, setGuildModalFloor] = useState<1 | 2>(1);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [showPotionShopModal, setShowPotionShopModal] = useState(false);
  const [showWeaponsShopModal, setShowWeaponsShopModal] = useState(false);
  const [showCaravanModal, setShowCaravanModal] = useState(false);
  const [showArenaModal, setShowArenaModal] = useState(false);
  const [showStandShrineModal, setShowStandShrineModal] = useState(false);
  const [showSideQuestModal, setShowSideQuestModal] = useState(false);
  const [showRaiderGuildModal, setShowRaiderGuildModal] = useState(false);
  const [showCastleCutscene, setShowCastleCutscene] = useState(false);
  const [pendingCastlePlayerName, setPendingCastlePlayerName] = useState<string | undefined>(undefined);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeSideQuestDialogueId, setActiveSideQuestDialogueId] = useState<SideQuestId | null>(null);
  const [saves, setSaves] = useState<BasteraSaveSummary[]>(() => listLocalSaves());
  const [savesLoading, setSavesLoading] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [rotatedPerspective, setRotatedPerspective] = useState(false);

  const tryLockMobileLandscape = useCallback(() => {
    try {
      const orientation = screen.orientation as { lock?: (mode: string) => Promise<void> } | undefined;
      void orientation?.lock?.('landscape')?.catch(() => {});
    } catch {
      // Orientation lock optional depending on browser
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setShowInventory(false);
    setShowMap(false);
    setShowStatus(false);
    setShowSanctuary(false);
    setShowSaveModal(false);
    setShowWorldsModal(false);
    setShowGuildModal(false);
    setShowWardrobeModal(false);
    setShowPotionShopModal(false);
    setShowWeaponsShopModal(false);
    setShowCaravanModal(false);
    setShowArenaModal(false);
    setShowStandShrineModal(false);
    setShowSideQuestModal(false);
    setShowRaiderGuildModal(false);
    setShowTutorial(false);
    setActiveSideQuestDialogueId(null);
  }, []);

  const refreshSaves = useCallback(async () => {
    setSavesLoading(true);
    const local = listLocalSaves();
    try {
      const resp = await fetch('/api/saves');
      if (resp.ok) {
        const data = (await resp.json()) as { saves?: BasteraSaveSummary[] };
        setSaves(mergeSaveSummaries(data.saves ?? [], local));
      } else {
        setSaves(local);
      }
    } catch {
      setSaves(local);
    } finally {
      setSavesLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSaves();
  }, [refreshSaves]);

  // Permanent PUBG / MLBB landscape lock on mobile:
  // - Portrait phone (H > W) => CSS rotate(90deg) with exact visualViewport bounds
  // - Phone OS rotated to landscape (W >= H) => CSS 0deg horizontal, never double-rotate!
  useEffect(() => {
    const checkViewport = () => {
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const root = document.documentElement;
      root.style.setProperty('--app-vw', `${vw}px`);
      root.style.setProperty('--app-vh', `${vh}px`);
      root.style.setProperty('--app-rot-w', `${vh}px`);
      root.style.setProperty('--app-rot-h', `${vw}px`);

      const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
      const hasTouch = (navigator.maxTouchPoints ?? 0) > 0;
      const smallViewport = Math.min(vw, vh) < 768;
      const mobile = smallViewport && (coarse || hasTouch || vw < 768);
      setIsMobileDevice(mobile);
      if (mobile) {
        setRotatedPerspective(vh > vw);
      } else {
        setRotatedPerspective(false);
      }
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    window.addEventListener('orientationchange', checkViewport);
    window.visualViewport?.addEventListener('resize', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
      window.visualViewport?.removeEventListener('resize', checkViewport);
    };
  }, []);

  // Initialize isolated 60fps canvas engine once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const autostart = new URLSearchParams(window.location.search).get('autostart') === '1';
    const engine = new BasteraGameEngine(
      canvas,
      (snapshot) => {
        setHud(snapshot);
      },
      autostart ? 'playing' : 'title',
      labelCanvasRef.current,
    );

    engineRef.current = engine;
    engine.setUiCallbacks({
      onOpenGuild: (floor) => {
        closeAllModals();
        setGuildModalFloor(floor);
        setShowGuildModal(true);
      },
      onOpenWardrobe: () => {
        closeAllModals();
        setShowWardrobeModal(true);
      },
      onOpenPotionShop: () => {
        closeAllModals();
        setShowPotionShopModal(true);
      },
      onOpenWeaponsShop: () => {
        closeAllModals();
        setShowWeaponsShopModal(true);
      },
      onOpenCaravanRider: () => {
        closeAllModals();
        setShowCaravanModal(true);
      },
      onOpenDuelingArena: () => {
        closeAllModals();
        setShowArenaModal(true);
      },
      onOpenStandShrine: () => {
        closeAllModals();
        setShowStandShrineModal(true);
      },
      onOpenSideQuestDialogue: (questId) => {
        closeAllModals();
        setActiveSideQuestDialogueId(questId);
        setShowSideQuestModal(true);
      },
      onOpenRaiderGuild: () => {
        closeAllModals();
        setShowRaiderGuildModal(true);
      },
    });
    if (autostart) {
      engine.startNewGame();
    }
    engine.startLoop();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [closeAllModals]);

  const handleLaunchCastleAfterCutscene = useCallback(
    (name?: string) => {
      const eng = engineRef.current;
      if (!eng) return;
      if (name) eng.setPlayerName(name);
      closeAllModals();
      setShowCastleCutscene(false);
      eng.startNewGame();
    },
    [closeAllModals],
  );

  const handleStartGame = useCallback(
    (name?: string) => {
      if (isMobileDevice) tryLockMobileLandscape();
      closeAllModals();
      setPendingCastlePlayerName(name);
      setShowCastleCutscene(true);
    },
    [closeAllModals, isMobileDevice, tryLockMobileLandscape],
  );

  const handleEnterIsekai = useCallback(
    (name?: string) => {
      if (isMobileDevice) tryLockMobileLandscape();
      const eng = engineRef.current;
      if (!eng) return;
      if (name) eng.setPlayerName(name);
      closeAllModals();
      setShowCastleCutscene(false);
      eng.startIsekaiGame(name);
    },
    [closeAllModals, isMobileDevice, tryLockMobileLandscape],
  );

  const handleSaveSlot = useCallback(
    async (saveId: string) => {
      const eng = engineRef.current;
      if (!eng) return;
      await eng.saveCurrentGame(saveId, false);
      await refreshSaves();
    },
    [refreshSaves],
  );

  const handleLoadSlot = useCallback(
    async (saveId: string) => {
      const eng = engineRef.current;
      if (!eng) return;
      let loaded: BasteraSaveData | null = loadLocalSave(saveId);
      if (!loaded) {
        try {
          const resp = await fetch(`/api/saves/${encodeURIComponent(saveId)}`);
          if (resp.ok) {
            const data = (await resp.json()) as { save?: unknown };
            loaded = normalizeLoadedSave(data.save);
          }
        } catch {
          // Offline fallback handled cleanly
        }
      }
      if (loaded && eng.loadFromSave(loaded)) {
        closeAllModals();
      }
    },
    [closeAllModals],
  );

  const handleDeleteSlot = useCallback(
    async (saveId: string) => {
      deleteLocalSave(saveId);
      try {
        await fetch(`/api/saves/${encodeURIComponent(saveId)}`, { method: 'DELETE' });
      } catch {
        // Offline delete already removed local copy
      }
      await refreshSaves();
    },
    [refreshSaves],
  );

  const openSaveModal = useCallback(() => {
    closeAllModals();
    setShowSaveModal(true);
    void refreshSaves();
  }, [closeAllModals, refreshSaves]);

  const openWorldsModal = useCallback(() => {
    closeAllModals();
    engineRef.current?.refreshOnlineWorlds();
    setShowWorldsModal(true);
  }, [closeAllModals]);

  // Global modal & shell keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (e.code === 'Enter' && hud.status === 'title' && !showSaveModal && !showWorldsModal) {
          e.preventDefault();
          target.blur();
          handleStartGame();
        }
        return;
      }

      if (
        hud.status === 'title' &&
        !showSaveModal &&
        !showWorldsModal &&
        !showTutorial &&
        (e.code === 'Enter' || e.code === 'Space')
      ) {
        e.preventDefault();
        handleStartGame();
        return;
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (showTutorial) {
          setShowTutorial(false);
          return;
        }
        if (showSaveModal) {
          setShowSaveModal(false);
          return;
        }
        if (showWorldsModal) {
          setShowWorldsModal(false);
          return;
        }
        if (showSanctuary) {
          setShowSanctuary(false);
          return;
        }
        if (showInventory) {
          setShowInventory(false);
          return;
        }
        if (showMap) {
          setShowMap(false);
          return;
        }
        if (showStatus) {
          setShowStatus(false);
          return;
        }
        if (showGuildModal) {
          setShowGuildModal(false);
          return;
        }
        if (showWardrobeModal) {
          setShowWardrobeModal(false);
          return;
        }
        if (showPotionShopModal) {
          setShowPotionShopModal(false);
          return;
        }
        if (showWeaponsShopModal) {
          setShowWeaponsShopModal(false);
          return;
        }
        if (showCaravanModal) {
          setShowCaravanModal(false);
          return;
        }
        if (showArenaModal) {
          setShowArenaModal(false);
          return;
        }
        if (showStandShrineModal) {
          setShowStandShrineModal(false);
          return;
        }
        if (showSideQuestModal) {
          setShowSideQuestModal(false);
          setActiveSideQuestDialogueId(null);
          return;
        }
        if (showRaiderGuildModal) {
          setShowRaiderGuildModal(false);
          return;
        }
        if (hud.status === 'playing') {
          engineRef.current?.setStatus('paused');
        } else if (hud.status === 'paused') {
          engineRef.current?.setStatus('playing');
        }
      } else if (e.code === 'KeyC' && hud.status === 'playing') {
        if (showSanctuary) {
          setShowSanctuary(false);
        } else {
          closeAllModals();
          setShowSanctuary(true);
        }
      } else if (e.code === 'KeyI' && hud.status === 'playing') {
        if (showInventory) {
          setShowInventory(false);
        } else {
          closeAllModals();
          setShowInventory(true);
        }
      } else if (e.code === 'KeyM' && hud.status === 'playing') {
        if (showMap) {
          setShowMap(false);
        } else {
          closeAllModals();
          setShowMap(true);
        }
      } else if (e.code === 'KeyK' && hud.status === 'playing') {
        if (showStatus) {
          setShowStatus(false);
        } else {
          closeAllModals();
          setShowStatus(true);
        }
      } else if (e.code === 'KeyQ' && hud.status === 'playing') {
        if (showSideQuestModal) {
          setShowSideQuestModal(false);
          setActiveSideQuestDialogueId(null);
        } else {
          closeAllModals();
          setShowSideQuestModal(true);
        }
      } else if (e.code === 'KeyU') {
        engineRef.current?.toggleMute();
      } else if (e.code === 'KeyV') {
        if (isMobileDevice) {
          tryLockMobileLandscape();
        } else {
          setRotatedPerspective((v) => !v);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    hud.status,
    showInventory,
    showMap,
    showStatus,
    showSanctuary,
    showSaveModal,
    showWorldsModal,
    showGuildModal,
    showWardrobeModal,
    showPotionShopModal,
    showWeaponsShopModal,
    showCaravanModal,
    showArenaModal,
    showStandShrineModal,
    showSideQuestModal,
    showRaiderGuildModal,
    showCastleCutscene,
    showTutorial,
    isMobileDevice,
    tryLockMobileLandscape,
    handleStartGame,
    closeAllModals,
  ]);

  useEffect(() => {
    engineRef.current?.setModalPaused(
      showInventory ||
        showMap ||
        showStatus ||
        showSanctuary ||
        showSaveModal ||
        showWorldsModal ||
        showGuildModal ||
        showWardrobeModal ||
        showPotionShopModal ||
        showWeaponsShopModal ||
        showCaravanModal ||
        showArenaModal ||
        showStandShrineModal ||
        showSideQuestModal ||
        showRaiderGuildModal ||
        showCastleCutscene ||
        showTutorial ||
        Boolean(hud.elfCutscene) ||
        Boolean(hud.dungeonChoicePending),
    );
  }, [
    showInventory,
    showMap,
    showStatus,
    showSanctuary,
    showSaveModal,
    showWorldsModal,
    showGuildModal,
    showWardrobeModal,
    showPotionShopModal,
    showWeaponsShopModal,
    showCaravanModal,
    showArenaModal,
    showStandShrineModal,
    showSideQuestModal,
    showRaiderGuildModal,
    showCastleCutscene,
    showTutorial,
    hud.elfCutscene,
    hud.dungeonChoicePending,
  ]);

  const handleCycleWeapon = useCallback(() => {
    const unlocked = hud.unlockedWeapons;
    if (unlocked.length <= 1) return;
    const idx = unlocked.indexOf(hud.equippedWeapon);
    const next = unlocked[(idx + 1) % unlocked.length];
    engineRef.current?.equipWeaponById(next);
  }, [hud.unlockedWeapons, hud.equippedWeapon]);

  const shellClass = rotatedPerspective
    ? 'rotated-mobile-shell bg-[#0b080a] overflow-hidden'
    : isMobileDevice
      ? 'mobile-landscape-shell bg-[#0b080a] overflow-hidden'
      : 'relative w-full h-full bg-[#0b080a] overflow-hidden';

  const showTouchControls = isMobileDevice || rotatedPerspective;

  return (
    <main className={shellClass} data-testid="bastera-shell">
      {/* Isolated Pixel-Art Canvas Viewport + High-Res Crisp Label Overlay Canvas */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#090608]">
        <canvas
          ref={canvasRef}
          data-testid="game-canvas"
          className="pixel-canvas w-full h-full object-contain"
        />
        <canvas
          ref={labelCanvasRef}
          data-testid="label-canvas"
          className="pointer-events-none absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* Title Screen */}
      {hud.status === 'title' && !showCastleCutscene && (
        <TitleScreen
          onlineCount={hud.onlineCount}
          savedCount={saves.length}
          onStart={(name) => handleStartGame(name)}
          onEnterIsekai={(name) => handleEnterIsekai(name)}
          onOpenTutorial={() => {
            closeAllModals();
            setShowTutorial(true);
          }}
          onOpenSaves={openSaveModal}
          onOpenWorlds={openWorldsModal}
          onToggleRotate={() => {
            if (isMobileDevice) {
              tryLockMobileLandscape();
            } else {
              setRotatedPerspective((v) => !v);
            }
          }}
          rotatedMobile={rotatedPerspective}
          isMobileLocked={isMobileDevice}
        />
      )}

      {/* Enter Castle 3-Slide Story Cutscene */}
      {showCastleCutscene && (
        <CastleIntroCutsceneModal
          playerName={pendingCastlePlayerName ?? 'BasteraKnight'}
          onComplete={() => handleLaunchCastleAfterCutscene(pendingCastlePlayerName)}
        />
      )}

      {/* Real-Time Citadel Boss Top Bar Overlay (1.9x Scaled HP + Sarcastic JoJo Skill Dialogue) */}
      {hud.status === 'playing' &&
        !hud.bossBattle &&
        hud.realm === 'citadel' &&
        hud.activeBoss &&
        hud.bossCooldownSeconds <= 0 && (
          <BossBattleOverlay hud={hud} activeBoss={hud.activeBoss} />
        )}

      {/* Legacy Turn-Based Boss Encounter Fallback (unused now that Citadel bosses fight in real time) */}
      {hud.status === 'playing' && hud.bossBattle && (
        <BossBattleOverlay
          hud={hud}
          battle={hud.bossBattle}
          onAttackWeapon={() => engineRef.current?.battleAttackWeapon()}
          onUseSkill={(slot) => engineRef.current?.battleUseSkill(slot)}
          onUsePotion={(itemId) => engineRef.current?.battleUsePotion(itemId)}
          onUseOrb={(orbId) => engineRef.current?.battleUseOrb(orbId)}
          onRetreat={() =>
            engineRef.current?.battleRetreatToSanctuary(() => {
              closeAllModals();
              setShowSanctuary(true);
            })
          }
          onEscape={() => engineRef.current?.battleEscape()}
          onOpenStatus={() => {
            closeAllModals();
            setShowStatus(true);
          }}
          onToggleMute={() => engineRef.current?.toggleMute()}
          onTogglePause={() => engineRef.current?.setStatus('paused')}
        />
      )}

      {hud.status === 'playing' && !hud.bossBattle && (
        <GameHud
          hud={hud}
          isTouchLayout={showTouchControls}
          isMobileLocked={isMobileDevice}
          onOpenInventory={() => {
            closeAllModals();
            setShowInventory(true);
          }}
          onOpenSanctuary={() => {
            closeAllModals();
            setShowSanctuary(true);
          }}
          onOpenMap={() => {
            closeAllModals();
            setShowMap(true);
          }}
          onOpenStatus={() => {
            closeAllModals();
            setShowStatus(true);
          }}
          onOpenSaves={openSaveModal}
          onOpenWorlds={openWorldsModal}
          onOpenGuild={() => {
            closeAllModals();
            setGuildModalFloor(hud.activeGuildFloor);
            setShowGuildModal(true);
          }}
          onOpenWardrobe={() => {
            closeAllModals();
            setShowWardrobeModal(true);
          }}
          onOpenPotionShop={() => {
            closeAllModals();
            setShowPotionShopModal(true);
          }}
          onOpenWeaponsShop={() => {
            closeAllModals();
            setShowWeaponsShopModal(true);
          }}
          onOpenCaravanRider={() => {
            closeAllModals();
            setShowCaravanModal(true);
          }}
          onOpenDuelingArena={() => {
            closeAllModals();
            setShowArenaModal(true);
          }}
          onOpenStandShrine={() => {
            closeAllModals();
            setShowStandShrineModal(true);
          }}
          onOpenSideQuests={() => {
            closeAllModals();
            setShowSideQuestModal(true);
          }}
          onOpenRaiderGuild={() => {
            closeAllModals();
            setShowRaiderGuildModal(true);
          }}
          onOpenTutorial={() => {
            closeAllModals();
            setShowTutorial(true);
          }}
          onAllocateStat={(key: StatKey) => engineRef.current?.allocatePlayerStat(key, 1)}
          onTogglePause={() => engineRef.current?.setStatus('paused')}
          onToggleMute={() => engineRef.current?.toggleMute()}
          onToggleRotate={() => {
            if (isMobileDevice) {
              tryLockMobileLandscape();
            } else {
              setRotatedPerspective((v) => !v);
            }
          }}
          onTriggerSkill={(slot) => engineRef.current?.triggerSkillButton(slot)}
          onUseOrb={(orbId) => engineRef.current?.battleUseOrb(orbId)}
          onAscendRaiderStairs={() => engineRef.current?.ascendRaiderDungeonStairs()}
          onStartElfBanquet={() => engineRef.current?.startElfDinnerPartyCutscene()}
          onDash={() => engineRef.current?.performDash()}
          onCycleWeapon={handleCycleWeapon}
          onAdvanceDialogue={() => engineRef.current?.advanceDialogue()}
          onVirtualKey={(action, pressed) => engineRef.current?.triggerVirtualKey(action, pressed)}
        />
      )}

      {/* Incoming Co-op Adventure Guild Invites */}
      {hud.status === 'playing' && (
        <GuildInviteToast
          invites={hud.pendingGuildInvites}
          onRespond={(id, accept) => engineRef.current?.respondToGuildInvite(id, accept)}
        />
      )}

      {/* Main Sanctuary Interface: Character Customization, Stat Points, Items & Arsenal */}
      {showSanctuary && hud.status === 'playing' && (
        <SanctuaryModal
          hud={hud}
          onClose={() => setShowSanctuary(false)}
          onAllocateStat={(key: StatKey, amount = 1) =>
            engineRef.current?.allocatePlayerStat(key, amount)
          }
          onUpdateCustomization={(patch: Partial<WarriorCustomization>) =>
            engineRef.current?.setWarriorCustomization(patch)
          }
          onEquipOrCraftWeapon={(wid: WeaponId) => engineRef.current?.craftOrEquipWeapon(wid)}
          onAssignSkill={(slot, sid: SkillId) => engineRef.current?.swapSkillSlot(slot, sid)}
          onUseItem={(itemId) => engineRef.current?.useItem(itemId)}
        />
      )}

      {/* Inventory & 3-Slot Skill Configurator */}
      {showInventory && hud.status === 'playing' && (
        <InventoryModal
          hud={hud}
          onClose={() => setShowInventory(false)}
          onEquipOrCraftWeapon={(wid: WeaponId) => engineRef.current?.craftOrEquipWeapon(wid)}
          onAssignSkill={(slot, sid: SkillId) => engineRef.current?.swapSkillSlot(slot, sid)}
          onUseItem={(itemId) => engineRef.current?.useItem(itemId)}
        />
      )}

      {/* Checkpoint Warp & 15 Boss Codex */}
      {showMap && hud.status === 'playing' && (
        <CheckpointMapModal
          hud={hud}
          onClose={() => setShowMap(false)}
          onWarpCheckpoint={(cpIndex) => {
            setShowMap(false);
            engineRef.current?.warpToCheckpoint(cpIndex);
          }}
        />
      )}

      {/* Solo Leveling System Status Window */}
      {showStatus && hud.status === 'playing' && (
        <SoloLevelingStatusModal
          hud={hud}
          onClose={() => setShowStatus(false)}
          onAllocateStat={(key: StatKey, amount = 1) =>
            engineRef.current?.allocatePlayerStat(key, amount)
          }
        />
      )}

      {/* Game Saving System Modal (Accessible from Title, HUD, and Pause) */}
      {showSaveModal && (
        <SaveLoadModal
          canSaveCurrent={hud.status === 'playing' || hud.status === 'paused'}
          saves={saves}
          loading={savesLoading}
          lastSavedAt={hud.lastSavedAt}
          onClose={() => setShowSaveModal(false)}
          onSaveSlot={handleSaveSlot}
          onLoadSlot={handleLoadSlot}
          onDeleteSlot={handleDeleteSlot}
          onRefresh={refreshSaves}
        />
      )}

      {/* Online Co-op Bastera Worlds Modal */}
      {showWorldsModal && (
        <WorldsModal
          worldId={hud.worldId}
          worldRole={hud.worldRole}
          worldHostName={hud.worldHostName}
          isWorldPublic={hud.isWorldPublic}
          worldPlayerCount={hud.worldPlayerCount}
          onlineWorlds={hud.onlineWorlds}
          onClose={() => setShowWorldsModal(false)}
          onJoinWorld={(targetId) => {
            engineRef.current?.joinWorld(targetId);
            if (hud.status === 'title') {
              engineRef.current?.startNewGame();
            }
            setShowWorldsModal(false);
          }}
          onLeaveWorld={() => engineRef.current?.leaveJoinedWorld()}
          onTogglePublic={(isPublic) => engineRef.current?.setWorldPublic(isPublic)}
          onRefreshWorlds={() => engineRef.current?.refreshOnlineWorlds()}
        />
      )}

      {/* Solaris Adventure Guild Reception Modal */}
      {showGuildModal && hud.status === 'playing' && (
        <GuildModal
          hud={hud}
          initialFloor={guildModalFloor}
          onClose={() => setShowGuildModal(false)}
          onAcceptMission={(missionId) => engineRef.current?.acceptGuildMission(missionId)}
          onInviteAdventurer={(targetPeerId, missionId) =>
            engineRef.current?.sendGuildInvite(targetPeerId, missionId)
          }
        />
      )}

      {/* Caravan Rider Vance Travel Modal */}
      {showCaravanModal && hud.status === 'playing' && (
        <CaravanRiderModal
          hud={hud}
          onClose={() => setShowCaravanModal(false)}
          onRideDestination={(raw) =>
            engineRef.current?.rideCaravanToDestination(raw) ?? {
              ok: false,
              message: 'Caravan unavailable.',
            }
          }
        />
      )}

      {/* Solaris Grand Colosseum Jujutsu Kaisen Challengers Modal */}
      {showArenaModal && hud.status === 'playing' && (
        <DuelingArenaModal
          hud={hud}
          onClose={() => setShowArenaModal(false)}
          onSelectChallenger={(id) => engineRef.current?.selectArenaChallenger(id)}
        />
      )}

      {/* Solaris Wardrobe Shop Modal */}
      {showWardrobeModal && hud.status === 'playing' && (
        <WardrobeModal
          hud={hud}
          onClose={() => setShowWardrobeModal(false)}
          onBuyOrEquip={(itemId) => engineRef.current?.buyOrEquipWardrobeItemById(itemId)}
        />
      )}

      {/* Solaris Alchemist Potion Shop Modal */}
      {showPotionShopModal && hud.status === 'playing' && (
        <PotionShopModal
          hud={hud}
          onClose={() => setShowPotionShopModal(false)}
          onBuyPotion={(itemId, drinkNow) => engineRef.current?.buyPotionItem(itemId, drinkNow)}
        />
      )}

      {/* Grand Solaris Weapons Armory Modal */}
      {showWeaponsShopModal && hud.status === 'playing' && (
        <WeaponShopModal
          hud={hud}
          onClose={() => setShowWeaponsShopModal(false)}
          onBuyOrEquipWeapon={(wid) => engineRef.current?.buyOrEquipShopWeapon(wid)}
        />
      )}

      {/* Royal Stand Shrine Modal (10 Pixel JJBA Stands & Star Stones) */}
      {showStandShrineModal && hud.status === 'playing' && (
        <StandShrineModal
          hud={hud}
          onClose={() => setShowStandShrineModal(false)}
          onSelectOrBuyStand={(standId) => engineRef.current?.buyOrEquipStandById(standId)}
        />
      )}

      {/* Outskirts Blood-Oath Side Quests & Interactive RPG Dialogue Modal */}
      {showSideQuestModal && hud.status === 'playing' && (
        <SideQuestModal
          hud={hud}
          initialDialogueQuestId={activeSideQuestDialogueId}
          onClose={() => {
            setShowSideQuestModal(false);
            setActiveSideQuestDialogueId(null);
          }}
          onAcceptOrTrackQuest={(questId) => engineRef.current?.acceptOrAdvanceSideQuest(questId)}
          onTrackQuest={(questId) => engineRef.current?.setTrackedSideQuest(questId)}
          onSelectDialogueChoice={(questId, nodeId, choiceId) =>
            engineRef.current?.selectSideQuestDialogueChoice(questId, nodeId, choiceId)
          }
        />
      )}

      {/* Dungeon Raider Guild Dispatch (108 Multi-Floor Dungeons & 8 Raider Ranks) */}
      {showRaiderGuildModal && hud.status === 'playing' && (
        <RaiderGuildModal
          hud={hud}
          onClose={() => setShowRaiderGuildModal(false)}
          onEnterDungeon={(dungeonId) =>
            engineRef.current?.enterRaiderDungeon(dungeonId) ?? {
              ok: false,
              message: 'Raider Guild unavailable.',
            }
          }
        />
      )}

      {/* Elf Kingdom Silver-Bough Royal Dinner Party & Emerald Coronation Cutscene */}
      {hud.status === 'playing' && hud.elfCutscene && (
        <ElfCutsceneModal
          cutscene={hud.elfCutscene}
          equippedWeapon={hud.equippedWeapon}
          customization={hud.customization}
          onSelectChoice={(choiceId) => engineRef.current?.selectElfCutsceneChoice(choiceId)}
          onAdvance={() => engineRef.current?.advanceElfCutscene()}
        />
      )}

      {/* Below-B Dungeon Completion Choice: Return to Guild vs Stay & Descend Deeper */}
      {hud.status === 'playing' && hud.dungeonChoicePending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/82"
          role="dialog"
          aria-modal="true"
          aria-label="Dungeon Clear Choice"
          data-testid="dungeon-choice-modal"
        >
          <div className="relative w-full max-w-[90%] sm:max-w-sm max-h-[86%] overflow-y-auto bg-[#160d12] border-2 border-amber-400 p-3 sm:p-4 text-amber-50 shadow-[0_12px_36px_rgba(0,0,0,0.94)] space-y-2.5">
            <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-300" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-300" />
            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-300" />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-300" />
            <div>
              <div className="font-pixel-mono text-[9px] tracking-widest text-emerald-300 uppercase">
                DUNGEON DEPTH {Math.max(1, hud.dungeonChoicePending.nextDepth - 1)} CLEARED
              </div>
              <h2 className="font-display text-sm sm:text-base font-bold text-amber-100 mt-0.5">
                {hud.dungeonChoicePending.missionTitle}
              </h2>
              <p className="font-pixel-mono text-[10px] sm:text-xs text-amber-100/80 mt-1 leading-snug">
                +{hud.dungeonChoicePending.rewardGold}G earned
                {hud.dungeonChoicePending.promotedRank
                  ? ` · Promoted to ${hud.dungeonChoicePending.promotedRank}-Rank!`
                  : ''}
                . Return safely to Solaris Adventure Guild, or descend deeper for a stronger Dungeon Boss!
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                data-testid="dungeon-choice-deeper-btn"
                onClick={(e) => {
                  e.currentTarget.blur();
                  engineRef.current?.chooseStayDeeperInDungeon();
                }}
                className="w-full py-1.5 px-2.5 bg-[#581c87] hover:bg-[#6b21a8] border border-purple-300 font-pixel-mono text-[10px] sm:text-xs font-bold text-purple-50 cursor-pointer"
              >
                Stay in Dungeon · Depth {hud.dungeonChoicePending.nextDepth} (Boss)
              </button>
              <button
                type="button"
                tabIndex={-1}
                data-testid="dungeon-choice-return-btn"
                onClick={(e) => {
                  e.currentTarget.blur();
                  engineRef.current?.chooseReturnToGuildFromDungeon();
                }}
                className="w-full py-1.5 px-2.5 bg-emerald-800 hover:bg-emerald-700 border border-emerald-300 font-pixel-mono text-[10px] sm:text-xs font-bold text-white cursor-pointer"
              >
                Return to Adventure Guild
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to Fight / Controls Tutorial Modal (Title & In-Game) */}
      {showTutorial && (
        <TutorialModal
          equippedWeapon={hud.equippedWeapon}
          equippedStand={hud.equippedStand}
          skillSlots={hud.skillSlots}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* Pause / Victory / Game Over Modals */}
      <StatusModals
        hud={hud}
        onResume={() => engineRef.current?.setStatus('playing')}
        onRestartCheckpoint={() => engineRef.current?.restartFromCheckpoint()}
        onNewGame={() => handleStartGame()}
        onTitle={() => engineRef.current?.setStatus('title')}
        onQuickSave={() => {
          void handleSaveSlot('autosave');
        }}
        onOpenSaves={openSaveModal}
      />
    </main>
  );
}
