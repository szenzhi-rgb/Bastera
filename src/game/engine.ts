import { gameAudio } from './audio';
import {
  SKILLS,
  STANDS,
  TOTAL_BOSSES,
  TOTAL_HIDDEN_PASSAGES,
  WEAPONS,
  calculateCitadelBossHalfAtk,
  createGyroZeppeliBossDef,
  getBiomeDisplayName,
  getBossDef,
  getBossDefeatedMultiplier,
  getStarStoneRewardForJjkEnemy,
  pickJoJoSkillDialogue,
} from './data';
import {
  DUNGEON_SECTOR_WIDTH,
  GUILD_FLOOR2_Y,
  GUILD_MISSIONS,
  ISEKAI_IDLE_TRANSPORT_SECONDS,
  ISEKAI_ROOM_BOUNDS,
  MISSIONS_REQUIRED_PER_RANK,
  SIDE_QUESTS,
  TOWN_RAID_INTERVAL_SECONDS,
  TOWN_RAID_REWARD_GOLD,
  applyHotSpringRest,
  applySideQuestDialogueChoice,
  buildElfCoronationCutsceneBeats,
  buildElfDinnerCutsceneBeats,
  buildIsekaiRoomInteractables,
  buildIsekaiRoomPlatforms,
  buyOrEquipWardrobeItem,
  buyOrEquipWeaponShopItem,
  buyPotionShopItem,
  canAccessGuildFloor2,
  canStartGuildMission,
  createArenaDuelInit,
  createArenaSkillAttack,
  createBanditWave,
  createCarriageEscortInit,
  createDemonKingAllies,
  createDemonKingPurpleFlameCast,
  createDemonKingStageMinions,
  createDemonRealmWave,
  createDungeonSectorEnemies,
  createDungeonSectorPlatforms,
  createElfAmbushWave,
  createElfKingdomNpcs,
  createElfSwordsmanAlly,
  createGoblinDungeonWave,
  createGuildNpcs,
  createInitialSideQuestProgress,
  createOutskirtsAmbientEnemies,
  createPotionShopNpcs,
  createSeventeenDemonKingsInit,
  createSideQuestBossEnemy,
  createThreeDemonKingsInit,
  createTownHouseStates,
  createTownNpcs,
  createTownRaidBoss,
  createWardrobeNpcs,
  createWeaponsShopNpcs,
  getIsekaiDayNightState,
  isQuestTargetEnemyKill,
  parseCaravanDestination,
  promoteGuildRankAfterMission,
  promoteGuildRankDirect,
  rankIndex,
  resetPlayerForIsekai,
  shouldIdleTriggerIsekai,
  stepArenaDuelAi,
  stepIsekaiNpcs,
  stepTownRaidAi,
  stepTownRebuildNpcs,
  type CaravanTarget,
  type ElfCutsceneBeatDef,
} from './isekai';
import {
  LABEL_SCALE,
  drawAlliedNpcs,
  drawArenaChallenger,
  drawCaravanRideCutscene,
  drawCaravanRider,
  drawCarriageEscortBackdrop,
  drawCoronationCutscene,
  drawDemonKingArenaBackdrop,
  drawDemonKings,
  drawDemonRealmBackdrop,
  drawDuelingArenaBackdrop,
  drawDungeonDepthOverlay,
  drawDungeonExteriorBackdrop,
  drawElfKingdomBackdrop,
  drawGoblinDungeonBackdrop,
  drawIsekaiFloors,
  drawIsekaiGuildInterior,
  drawIsekaiNightLighting,
  drawIsekaiNpcs,
  drawIsekaiPotionShopInterior,
  drawIsekaiTownBackdrop,
  drawIsekaiWardrobeInterior,
  drawIsekaiWeaponsShopInterior,
  drawOutskirtsCavesBackdrop,
  drawOutskirtsForestBackdrop,
  drawPurpleFlameZones,
  drawRaiderDemonicBoss,
  drawRaiderDungeonBackdrop,
  drawRaiderGuildInterior,
  drawRoyalCarriage,
  drawTownRaidBoss,
} from './isekaiSprites';
import {
  DUNGEON_DESIGNS,
  buildRaiderDungeonFloorInteractables,
  buildRaiderDungeonFloorPlatforms,
  buildRaiderGuildInteractables,
  buildRaiderGuildPlatforms,
  createRaiderDemonicBoss,
  createRaiderFloorEnemies,
  createRaiderGuildNpcs,
  getRaiderDungeonById,
  getRaiderRankDef,
  getRaiderRankForPoints,
  isRaiderDungeonUnlocked,
  stepRaiderDemonicBoss,
} from './raiderGuild';
import {
  createMegaBossDef,
  createMegaBossInstance,
  pickMegaBossArchetype,
  shouldTriggerMegaBossGlitch,
} from './megaBoss';
import {
  PIXEL_H,
  PIXEL_W,
  RENDER_SCALE,
  drawBiomeBackdrop,
  drawCandles,
  drawChiliPepperEntity,
  drawDarkSanctumLighting,
  drawEnemy,
  drawGroundCracks,
  drawInteractables,
  drawJjbaStandSprite,
  drawJoJoBoss,
  drawMegaBossCutscene,
  drawPeer,
  drawPlatforms,
  drawPokemonBossStage,
  drawProjectiles,
  drawStandGuardBarrier,
  drawStarPlatinumGuardian,
  drawVolcanoPitChasm,
  drawWarrior,
} from './pixelSprites';
import {
  BossBattleState,
  createBossBattleState,
  resolveBattleOrb,
  resolveBattlePotion,
  resolvePlayerBattleSkill,
  resolvePlayerBattleSword,
  startBattleEscape,
  startBattleRun,
  toBossBattleSnapshot,
  triggerBossCounterTurn,
} from './battle';
import {
  FLAME_ORB_HP_RATIO,
  WIND_ORB_DAMAGE_BONUS,
  activateStandGuard,
  activateWhiteAuraDash,
  addInventoryResource,
  allocateStatPoint,
  applyDamageToBoss,
  applyDamageToEnemy,
  assignSkillToSlot,
  buyOrEquipStand,
  calculateAttackDamage,
  clampSecretsCount,
  computeWeaponHitbox,
  craftWeapon,
  createInitialInventory,
  createInitialPlayer,
  equipWeapon,
  getMonsterLevelMultiplier,
  grantKillStatPoints,
  recordBossFightProgress,
  rectsOverlap,
  rollMonsterOrbDrop,
  startWeaponAttack,
  stepPlayerPhysics,
  triggerPlayerDash,
  triggerSkillSlot,
  triggerSpinPokeDash,
  updateWarriorCustomization,
  useInventoryItem,
} from './rules';
import {
  BasteraSaveData,
  canPlayerEngageBoss,
  createSavePayload,
  normalizeLoadedSave,
  saveToLocalStorage,
} from './saveSystem';
import type {
  ActiveArenaDuel,
  ActiveBoss,
  ActiveTownRaid,
  AlliedNpc,
  ArenaChallengerId,
  BiomeId,
  CarriageEscortState,
  CoronationCutsceneHud,
  DemonKingEntity,
  DialogueState,
  DungeonChoicePending,
  ElfCutsceneHud,
  ElfKingdomHud,
  ElfKingdomStage,
  EnemyArchetype,
  EnemyState,
  GameStatus,
  GroundCrackDecal,
  GuildInvite,
  GuildMissionId,
  GuildRank,
  HudSnapshot,
  InteractableProp,
  InventoryItem,
  IsekaiMissionHud,
  IsekaiNpc,
  MegaBossArchetype,
  MegaCutsceneHud,
  MegaSkillAnimStyle,
  MultiplayerPeer,
  OnlineAdventurer,
  OrbId,
  OnlineWorldSummary,
  Platform,
  PlayerState,
  Projectile,
  PurpleFlameZone,
  RaiderDemonicBossEntity,
  RaiderDungeonHud,
  RaiderRankId,
  RealmMode,
  SideQuestId,
  SideQuestProgress,
  SkillId,
  StandId,
  StatKey,
  TownHouseDamage,
  TownRaiderId,
  WarriorCustomization,
  WeaponId,
  WorldRole,
} from './types';
import {
  CHUNK_WIDTH,
  FLOOR_Y,
  GeneratedChunk,
  generateChunk,
  getBiomeCheckpointList,
  getBiomeForChunk,
} from './worldGen';

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface FloatingNum {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
}

export class BasteraGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private labelCanvas: HTMLCanvasElement | null = null;
  private labelCtx: CanvasRenderingContext2D | null = null;
  private onHudUpdate: (snapshot: HudSnapshot) => void;

  private rafId: number | null = null;
  private lastTime = 0;
  private simTime = 0;
  private hitstopTimer = 0;
  private trauma = 0;

  private status: GameStatus = 'title';
  private player: PlayerState = createInitialPlayer();
  private inventory: InventoryItem[] = createInitialInventory();

  private chunks = new Map<number, GeneratedChunk>();
  private defeatedBosses = new Set<number>();
  private discoveredSecrets = new Set<string>();
  private openedChests = new Set<string>();

  private projectiles: Projectile[] = [];
  private dialogue: DialogueState | null = null;
  private announcement: string | null = null;
  private announcementTimer = 0;
  private secretCaption: { title: string; detail: string } | null = null;
  private secretCaptionTimer = 0;
  private darkSanctumDiscovered = false;

  private camX = 0;
  private titlePanX = 0;

  // Input state
  private heldKeys = new Set<string>();
  private justPressed = new Set<string>();
  private virtualInput = {
    left: false,
    right: false,
    jumpHeld: false,
  };

  // Zero-GC particle & floating text pools
  private particles: Particle[] = Array.from({ length: 220 }, () => ({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 1,
    size: 2,
    color: '#fbbf24',
  }));
  private particleCursor = 0;

  private floatingNums: FloatingNum[] = Array.from({ length: 36 }, () => ({
    active: false,
    x: 0,
    y: 0,
    vy: 0,
    text: '',
    color: '#ffffff',
    life: 0,
  }));
  private floatCursor = 0;

  private ambientMotes = Array.from({ length: 64 }, (_, i) => ({
    x: (i * 53) % PIXEL_W,
    y: (i * 37) % FLOOR_Y,
    vy: -(6 + (i % 5) * 3),
    phase: i * 0.7,
    size: i % 4 === 0 ? 2 : 1,
  }));

  private afterimages = Array.from({ length: 12 }, () => ({
    active: false,
    x: 0,
    y: 0,
    facing: 1 as 1 | -1,
    life: 0,
    color: '#fbbf24',
  }));
  private afterimageCursor = 0;
  private speedLineTimer = 0;

  // Multiplayer WebSocket
  private ws: WebSocket | null = null;
  private selfPeerId: string | null = null;
  private peers = new Map<string, MultiplayerPeer>();
  private onlineCount = 1;
  private netSyncTimer = 0;
  private playerName = 'BasteraKnight';

  private hudEmitTimer = 0;
  private lastHudSignature = '';
  private lastBossVoiceTriggered = -1;
  private modalPaused = false;
  private vignetteCanvas: HTMLCanvasElement | null = null;
  private bossBattle: BossBattleState | null = null;
  private bossEncounterCooldown = 0;
  private encounterFlashTimer = 0;
  private pendingSanctuaryCallback: (() => void) | null = null;
  private postBossInputLockTimer = 0;

  // Mega Boss / Gyro Zeppeli Cutscene + Chunk 41 bridge volcano pit fall + Burst Crush Ground Cracks
  private megaCutscene: {
    archetype: MegaBossArchetype | 'gyro_zeppeli';
    pendingBoss: ActiveBoss;
    timer: number;
    duration: number;
  } | null = null;
  private volcanoBridgeFallTriggered = false;
  private volcanoBridgeFallTimer = 0;
  private groundCracks: GroundCrackDecal[] = [];
  private bossGrabLockTimer = 0;

  // Isekai Fantasy World, Guild, Caravan, Endless Dungeons, Hot Spring, Arena & Demon King State
  private realm: RealmMode = 'citadel';
  private guildRank: GuildRank = 'F';
  private bRankEscortsCompleted = 0;
  private rankMissionsCompleted = 0;
  private acceptedMissionId: GuildMissionId | null = null;
  private dungeonTarget: 'goblin_dungeon' | 'demon_realm' | 'demon_king_arena' = 'goblin_dungeon';
  private dungeonTargetMission: GuildMissionId | null = null;
  private endlessContractClaimed = false;
  private dungeonGeneratedMaxSector = 2;
  private isekaiClockSeconds = 0;
  private dungeonDepth = 1;
  private dungeonChoicePending: DungeonChoicePending | null = null;
  private unlockedWardrobe: string[] = ['outfit_knight_plate', 'hat_helm'];
  private foughtIsekaiEnemies: EnemyArchetype[] = [];
  private crownUnlocked = false;
  private gyroDefeated = false;
  private isekaiCompleted = false;
  private isekaiPortalOpen = false;
  private activeMissionId: GuildMissionId | null = null;
  private isekaiNpcs: IsekaiNpc[] = [];
  private isekaiPlatforms: Platform[] = [];
  private isekaiInteractables: InteractableProp[] = [];
  private isekaiEnemies: EnemyState[] = [];
  private alliedNpcs: AlliedNpc[] = [];
  private activeDemonKingStage: number = 1;
  private arenaWins = 0;
  private arenaDuel: ActiveArenaDuel | null = null;
  private arenaPlayerPreDuelMaxHp: number | null = null;
  private arenaCrowdHypeTimer = 0;
  private arenaSlowTimer = 0;
  private bossCritCount = 0;
  private townHouses: TownHouseDamage[] = createTownHouseStates();
  private townRaid: ActiveTownRaid | null = null;
  private townRaidTimer: number = TOWN_RAID_INTERVAL_SECONDS;
  private townRaidRetreatTimer = 0;
  private pendingTownRaid = false;
  private nextTownRaiderIdx = 0;
  private isekaiKillsDone = 0;
  private isekaiKillsRequired = 0;
  private isekaiWaveIndex = 0;
  private carriageEscort: CarriageEscortState | null = null;
  private demonKings: DemonKingEntity[] = [];
  private purpleFlameZones: PurpleFlameZone[] = [];
  private activeCastBanner: string | null = null;
  private activeCastBannerTimer = 0;
  private coronationCutscene: {
    timer: number;
    duration: number;
  } | null = null;
  private caravanRide: {
    target: CaravanTarget;
    label: string;
    timer: number;
    duration: number;
  } | null = null;
  private onlineAdventurers: OnlineAdventurer[] = [];
  private pendingGuildInvites: GuildInvite[] = [];
  private sideQuestProgress: Partial<Record<SideQuestId, SideQuestProgress>> = createInitialSideQuestProgress();
  private trackedSideQuestId: SideQuestId | null = null;
  private outskirtsRespawnTimer = 0;

  // Elf Kingdom of Aethelgard & Dinner Party Ambush State
  private elfKingdomInvited = false;
  private elfKingdomStage: ElfKingdomStage = 'uninvited';
  private elfCrownUnlocked = false;
  private elfCutscene: {
    act: 'dinner' | 'coronation';
    beats: ElfCutsceneBeatDef[];
    beatIndex: number;
    chosenReply: string | null;
  } | null = null;
  private elfAmbushWave: 0 | 1 | 2 = 0;
  private elfAmbushBossName: string | null = null;

  // Dungeon Raider Guild (108 Unique Dungeons, 8 Ranks, Floors/Stairs, Demonic Overlords)
  private raiderRank: RaiderRankId = 'Bronze';
  private raiderPoints = 0;
  private clearedRaiderDungeons: number[] = [];
  private activeRaiderDungeonId: number | null = null;
  private activeRaiderFloor = 1;
  private raiderDemonicBoss: RaiderDemonicBossEntity | null = null;

  private lastSlashInputTime = -10;
  private lastDashInputTime = -10;
  private meleeHitIds = new Set<string>();
  private uiCallbacks: {
    onOpenGuild?: (floor: 1 | 2) => void;
    onOpenWardrobe?: () => void;
    onOpenPotionShop?: () => void;
    onOpenWeaponsShop?: () => void;
    onOpenCaravanRider?: () => void;
    onOpenDuelingArena?: () => void;
    onOpenStandShrine?: () => void;
    onOpenRaiderGuild?: () => void;
    onOpenSideQuestDialogue?: (questId: SideQuestId) => void;
  } = {};

  // Multiplayer Co-op World Rooms & Saving
  private worldId = 'LOCAL';
  private ownWorldId = 'LOCAL';
  private worldRole: WorldRole = 'host';
  private worldHostName: string | null = null;
  private isWorldPublic = true;
  private onlineWorlds: OnlineWorldSummary[] = [];
  private worldPlayerCount = 1;
  private hostDefeatedBosses = new Set<number>();
  private guestBossWarnCooldown = 0;
  private lastSavedAt: string | null = null;

  // Dash, JJBA Stand States (Star Platinum, Chili Pepper, Summon FX), 5-Boss 60s Cooldown & Frame Chunk Caches
  private starPlatinumTimer = 0;
  private starPlatinumTickTimer = 0;
  private chiliPepperTimer = 0;
  private chiliPepperZapTimer = 0;
  private lastDashTapTime = -10;
  private lastStandTapTime = -10;
  private standGuardTickTimer = 0;
  private standSummonFx: { standId: StandId; timer: number; facing: 1 | -1 } | null = null;
  private resolveBonusTimer = 0;
  private bossesFoughtStreak = 0;
  private bossCooldownSeconds = 0;
  private cachedActiveChunks: GeneratedChunk[] = [];
  private cachedActivePlatforms: Platform[] = [];
  private chunksDirty = true;

  constructor(
    canvas: HTMLCanvasElement,
    onHudUpdate: (snapshot: HudSnapshot) => void,
    initialStatus: GameStatus = 'title',
    labelCanvas?: HTMLCanvasElement | null,
  ) {
    this.canvas = canvas;
    this.canvas.width = PIXEL_W * RENDER_SCALE;
    this.canvas.height = PIXEL_H * RENDER_SCALE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    ctx.imageSmoothingEnabled = false;
    this.ctx = ctx;
    if (labelCanvas) {
      this.labelCanvas = labelCanvas;
      labelCanvas.width = PIXEL_W * LABEL_SCALE;
      labelCanvas.height = PIXEL_H * LABEL_SCALE;
      this.labelCtx = labelCanvas.getContext('2d');
    }
    this.onHudUpdate = onHudUpdate;

    this.ensureChunksAround(0);
    this.setStatus(initialStatus);
    this.attachInputListeners();
    this.connectMultiplayer();
    this.emitHud(true);
  }

  public setModalPaused(paused: boolean): void {
    this.modalPaused = paused;
    if (paused) this.clearAllInputs(false);
  }

  public setUiCallbacks(cbs: {
    onOpenGuild?: (floor: 1 | 2) => void;
    onOpenWardrobe?: () => void;
    onOpenPotionShop?: () => void;
    onOpenWeaponsShop?: () => void;
    onOpenCaravanRider?: () => void;
    onOpenDuelingArena?: () => void;
    onOpenStandShrine?: () => void;
    onOpenRaiderGuild?: () => void;
    onOpenSideQuestDialogue?: (questId: SideQuestId) => void;
  }): void {
    this.uiCallbacks = cbs;
  }

  private clearAllInputs(stopHorizontal = true): void {
    this.heldKeys.clear();
    this.justPressed.clear();
    this.virtualInput.left = false;
    this.virtualInput.right = false;
    this.virtualInput.jumpHeld = false;
    if (stopHorizontal) {
      this.player.vx = 0;
    }
  }

  public startLoop(): void {
    if (this.rafId !== null) return;
    this.lastTime = performance.now();
    const tick = (now: number) => {
  this.rafId = requestAnimationFrame(tick);
  const rawDt = (now - this.lastTime) / 1000;
  this.lastTime = now;
  const dt = Math.min(Math.max(rawDt, 0.001), 0.05);
  if (!this.modalPaused && (this.status === 'playing' || this.status === 'title')) {
    try {
      this.update(dt);
      this.render();
    } catch (err) {
      console.error('[Bastera loop error]', err);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    gameAudio.stopMusic();
    this.detachInputListeners();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public setStatus(next: GameStatus): void {
    this.status = next;
    const bodyState = next === 'victory' ? 'gameover' : next;
    document.body.dataset.state = bodyState;
    if (next === 'paused' || next === 'gameover' || next === 'victory' || next === 'title') {
      gameAudio.stopMusic();
      this.clearAllInputs(true);
    } else if (next === 'playing') {
      gameAudio.unlock();
      this.clearAllInputs(true);
      const activeBoss = this.realm === 'citadel' ? this.getActiveNearbyBoss() : null;
      gameAudio.startMusic(this.getCurrentBiome(), activeBoss?.def ?? null, this.realm);
    }
    this.emitHud(true);
  }

  public startNewGame(): void {
    this.player = createInitialPlayer();
    this.inventory = createInitialInventory();
    this.chunks.clear();
    this.defeatedBosses.clear();
    this.discoveredSecrets.clear();
    this.openedChests.clear();
    this.projectiles = [];
    this.bossBattle = null;
    this.bossEncounterCooldown = 0;
    this.encounterFlashTimer = 0;
    this.lastBossVoiceTriggered = -1;
    this.secretCaption = null;
    this.secretCaptionTimer = 0;
    this.darkSanctumDiscovered = false;
    this.pendingSanctuaryCallback = null;
    this.megaCutscene = null;
    this.volcanoBridgeFallTriggered = false;
    this.volcanoBridgeFallTimer = 0;
    this.postBossInputLockTimer = 0;
    this.starPlatinumTimer = 0;
    this.starPlatinumTickTimer = 0;
    this.chiliPepperTimer = 0;
    this.chiliPepperZapTimer = 0;
    this.lastDashTapTime = -10;
    this.lastStandTapTime = -10;
    this.standGuardTickTimer = 0;
    this.standSummonFx = null;
    this.resolveBonusTimer = 0;
    this.bossesFoughtStreak = 0;
    this.bossCooldownSeconds = 0;

    // Reset Isekai progression
    this.realm = 'citadel';
    this.guildRank = 'F';
    this.bRankEscortsCompleted = 0;
    this.rankMissionsCompleted = 0;
    this.acceptedMissionId = null;
    this.dungeonTarget = 'goblin_dungeon';
    this.dungeonTargetMission = null;
    this.endlessContractClaimed = false;
    this.dungeonGeneratedMaxSector = 2;
    this.isekaiClockSeconds = 0;
    this.dungeonDepth = 1;
    this.dungeonChoicePending = null;
    this.lastSlashInputTime = -10;
    this.lastDashInputTime = -10;
    this.meleeHitIds.clear();
    this.unlockedWardrobe = ['outfit_knight_plate', 'hat_helm'];
    this.foughtIsekaiEnemies = [];
    this.crownUnlocked = false;
    this.gyroDefeated = false;
    this.isekaiCompleted = false;
    this.isekaiPortalOpen = false;
    this.activeMissionId = null;
    this.isekaiNpcs = [];
    this.isekaiPlatforms = [];
    this.isekaiInteractables = [];
    this.isekaiEnemies = [];
    this.alliedNpcs = [];
    this.activeDemonKingStage = 1;
    this.arenaWins = 0;
    this.arenaDuel = null;
    this.arenaPlayerPreDuelMaxHp = null;
    this.arenaCrowdHypeTimer = 0;
    this.townHouses = createTownHouseStates();
    this.townRaid = null;
    this.townRaidTimer = TOWN_RAID_INTERVAL_SECONDS;
    this.townRaidRetreatTimer = 0;
    this.pendingTownRaid = false;
    this.nextTownRaiderIdx = 0;
    this.isekaiKillsDone = 0;
    this.isekaiKillsRequired = 0;
    this.isekaiWaveIndex = 0;
    this.carriageEscort = null;
    this.demonKings = [];
    this.purpleFlameZones = [];
    this.activeCastBanner = null;
    this.activeCastBannerTimer = 0;
    this.coronationCutscene = null;
    this.caravanRide = null;
    this.groundCracks = [];
    this.bossGrabLockTimer = 0;
    this.sideQuestProgress = createInitialSideQuestProgress();
    this.trackedSideQuestId = null;
    this.outskirtsRespawnTimer = 0;
    this.elfKingdomInvited = false;
    this.elfKingdomStage = 'uninvited';
    this.elfCrownUnlocked = false;
    this.elfCutscene = null;
    this.elfAmbushWave = 0;
    this.elfAmbushBossName = null;
    this.raiderRank = 'Bronze';
    this.raiderPoints = 0;
    this.clearedRaiderDungeons = [];
    this.activeRaiderDungeonId = null;
    this.activeRaiderFloor = 1;
    this.raiderDemonicBoss = null;

    this.chunksDirty = true;
    this.ensureChunksAround(0);
    this.camX = 0;

    this.setStatus('playing');
    this.syncHostWorldMeta();
    this.openDialogue(
      'Warrior',
      'warrior',
      '#fbbf24',
      [
        `Well, the royal dungeon locked the front door again. Time to climb toward Boss #${TOTAL_BOSSES} & Gyro Zeppeli!`,
        'Inspect thrones [F], smash cracked bricks [J], press [Shift] to Dash, and unleash Star Platinum ORA ORA [3]!',
      ],
    );
  }

  public getSavePayload(saveId = 'autosave'): BasteraSaveData {
    return createSavePayload({
      saveId,
      playerName: this.playerName,
      biome: this.getCurrentBiome(),
      player: this.player,
      inventory: this.inventory,
      defeatedBosses: this.defeatedBosses,
      discoveredSecrets: this.discoveredSecrets,
      openedChests: this.openedChests,
      volcanoBridgeFallTriggered: this.volcanoBridgeFallTriggered,
      darkSanctumDiscovered: this.darkSanctumDiscovered,
      bossFoughtStreak: this.bossesFoughtStreak,
      bossCooldownSeconds: Math.ceil(this.bossCooldownSeconds),
      realm: this.realm,
      guildRank: this.guildRank,
      bRankEscortsCompleted: this.bRankEscortsCompleted,
      rankMissionsCompleted: this.rankMissionsCompleted,
      acceptedMissionId: this.acceptedMissionId,
      isekaiClockSeconds: Math.floor(this.isekaiClockSeconds),
      townRaidTimer: Math.max(0, Math.ceil(this.townRaidTimer)),
      arenaWins: this.arenaWins,
      unlockedWardrobe: this.unlockedWardrobe,
      foughtIsekaiEnemies: this.foughtIsekaiEnemies,
      crownUnlocked: this.crownUnlocked,
      elfCrownUnlocked: this.elfCrownUnlocked,
      elfKingdomInvited: this.elfKingdomInvited,
      elfKingdomStage: this.elfKingdomStage,
      raiderRank: this.raiderRank,
      raiderPoints: this.raiderPoints,
      clearedRaiderDungeons: this.clearedRaiderDungeons,
      gyroDefeated: this.gyroDefeated,
      isekaiCompleted: this.isekaiCompleted,
      sideQuestProgress: this.sideQuestProgress,
      trackedSideQuestId: this.trackedSideQuestId,
    });
  }

  public async saveCurrentGame(saveId = 'autosave', silent = false): Promise<{ ok: boolean; savedAt: string }> {
    const payload = this.getSavePayload(saveId);
    saveToLocalStorage(payload);
    this.lastSavedAt = payload.savedAt;
    try {
      const resp = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok && !silent) {
        this.showAnnouncement('Saved locally (offline backup).');
      }
    } catch {
      // localStorage backup still persisted!
    }
    if (!silent) {
      gameAudio.playSecretFound();
      this.showAnnouncement(`Game saved (${payload.playerName} · Boss ${payload.player.bossesDefeated}/${TOTAL_BOSSES})!`);
    }
    this.emitHud(true);
    return { ok: true, savedAt: payload.savedAt };
  }

  public loadFromSave(rawSave: BasteraSaveData): boolean {
    const clean = normalizeLoadedSave(rawSave);
    if (!clean) return false;
    this.playerName = clean.playerName;
    this.player = clean.player;
    this.inventory = clean.inventory;
    this.defeatedBosses = new Set(clean.defeatedBosses);
    this.discoveredSecrets = new Set(clean.discoveredSecrets);
    this.openedChests = new Set(clean.openedChests);
    this.volcanoBridgeFallTriggered = clean.volcanoBridgeFallTriggered;
    this.darkSanctumDiscovered = clean.darkSanctumDiscovered;
    this.bossesFoughtStreak = clean.bossFoughtStreak ?? 0;
    this.bossCooldownSeconds = clean.bossCooldownSeconds ?? 0;
    this.realm = clean.realm ?? 'citadel';
    this.guildRank = clean.guildRank ?? 'F';
    this.bRankEscortsCompleted = clean.bRankEscortsCompleted ?? 0;
    this.rankMissionsCompleted = clean.rankMissionsCompleted ?? 0;
    this.acceptedMissionId = clean.acceptedMissionId ?? null;
    this.dungeonTargetMission = null;
    this.isekaiClockSeconds = clean.isekaiClockSeconds ?? 0;
    this.townRaidTimer = clean.townRaidTimer ?? TOWN_RAID_INTERVAL_SECONDS;
    this.townHouses = createTownHouseStates();
    this.townRaid = null;
    this.townRaidRetreatTimer = 0;
    this.pendingTownRaid = false;
    this.arenaWins = clean.arenaWins ?? 0;
    this.dungeonDepth = 1;
    this.dungeonChoicePending = null;
    this.unlockedWardrobe = clean.unlockedWardrobe ? [...clean.unlockedWardrobe] : ['outfit_knight_plate', 'hat_helm'];
    this.foughtIsekaiEnemies = clean.foughtIsekaiEnemies ? [...clean.foughtIsekaiEnemies] : [];
    this.crownUnlocked = Boolean(clean.crownUnlocked);
    this.elfCrownUnlocked = Boolean(clean.elfCrownUnlocked);
    this.elfKingdomInvited = Boolean(clean.elfKingdomInvited);
    this.elfKingdomStage =
      clean.elfKingdomStage ?? (this.elfCrownUnlocked ? 'celebration' : this.elfKingdomInvited ? 'invited' : 'uninvited');
    if (this.elfKingdomStage === 'ambush_active') {
      this.elfKingdomStage = 'banquet_ready';
    }
    this.elfCutscene = null;
    this.elfAmbushWave = 0;
    this.elfAmbushBossName = null;
    this.raiderPoints = clean.raiderPoints ?? 0;
    this.raiderRank = clean.raiderRank ?? getRaiderRankForPoints(this.raiderPoints);
    this.clearedRaiderDungeons = clean.clearedRaiderDungeons ? [...clean.clearedRaiderDungeons] : [];
    this.activeRaiderDungeonId = null;
    this.activeRaiderFloor = 1;
    this.raiderDemonicBoss = null;
    this.gyroDefeated = Boolean(clean.gyroDefeated);
    this.isekaiCompleted = Boolean(clean.isekaiCompleted);
    this.isekaiPortalOpen = this.gyroDefeated || this.realm !== 'citadel';
    this.sideQuestProgress = clean.sideQuestProgress ? { ...clean.sideQuestProgress } : createInitialSideQuestProgress();
    this.trackedSideQuestId = clean.trackedSideQuestId ?? null;
    this.outskirtsRespawnTimer = 0;
    this.starPlatinumTimer = 0;
    this.starPlatinumTickTimer = 0;
    this.lastDashTapTime = -10;
    this.lastStandTapTime = -10;
    this.standGuardTickTimer = 0;
    this.lastSavedAt = clean.savedAt;

    this.chunks.clear();
    this.chunksDirty = true;
    this.projectiles = [];
    this.bossBattle = null;
    this.megaCutscene = null;
    this.coronationCutscene = null;
    this.dialogue = null;
    this.caravanRide = null;
    this.arenaDuel = null;
    this.arenaPlayerPreDuelMaxHp = null;
    this.volcanoBridgeFallTimer = 0;
    this.postBossInputLockTimer = 0.25;
    this.bossEncounterCooldown = 1.5;

    if (this.realm !== 'citadel') {
      const targetHub: RealmMode =
        this.realm === 'isekai_guild' ||
        this.realm === 'isekai_wardrobe' ||
        this.realm === 'isekai_potion_shop' ||
        this.realm === 'isekai_weapons_shop' ||
        this.realm === 'dungeon_exterior' ||
        this.realm === 'dueling_arena' ||
        this.realm === 'outskirts_forest' ||
        this.realm === 'outskirts_caves' ||
        this.realm === 'elf_kingdom' ||
        this.realm === 'raider_guild'
          ? this.realm
          : 'isekai_town';
      this.enterIsekaiRoom(
        targetHub,
        targetHub === 'isekai_town' ||
        targetHub === 'dungeon_exterior' ||
        targetHub === 'dueling_arena' ||
        targetHub === 'outskirts_forest' ||
        targetHub === 'outskirts_caves' ||
        targetHub === 'elf_kingdom'
          ? clean.player.x
          : 96,
      );
    } else {
      this.isekaiEnemies = [];
      this.carriageEscort = null;
      this.demonKings = [];
      this.purpleFlameZones = [];
      this.activeMissionId = null;
      this.ensureChunksAround(this.player.x);
      this.camX = Math.max(-640, this.player.x - PIXEL_W * 0.34);
    }

    if (this.worldRole === 'guest') {
      this.leaveJoinedWorld();
    } else {
      this.syncHostWorldMeta();
    }
    this.setStatus('playing');
    gameAudio.playSecretFound();
    this.showAnnouncement(`Loaded ${clean.playerName}'s saved world!`);
    this.emitHud(true);
    return true;
  }

  public joinWorld(targetWorldId: string): void {
    const clean = targetWorldId.trim().toUpperCase();
    if (!clean) return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.showAnnouncement('Multiplayer server offline — cannot join world.');
      return;
    }
    this.ws.send(JSON.stringify({ type: 'world:join', worldId: clean }));
  }

  public leaveJoinedWorld(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.worldRole = 'host';
      this.worldHostName = null;
      this.worldId = this.ownWorldId;
      this.emitHud(true);
      return;
    }
    this.ws.send(JSON.stringify({ type: 'world:leave' }));
  }

  public setWorldPublic(isPublic: boolean): void {
    this.isWorldPublic = isPublic;
    this.syncHostWorldMeta();
    this.emitHud(true);
  }

  public refreshOnlineWorlds(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'world:list' }));
    }
  }

  private syncHostWorldMeta(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        type: 'world:host',
        hostName: this.playerName,
        isPublic: this.isWorldPublic,
        biome: this.getCurrentBiome(),
        bossesDefeated: this.defeatedBosses.size,
        defeatedBosses: Array.from(this.defeatedBosses),
      }),
    );
  }

  private restoreArenaPlayerHp(): void {
    if (this.arenaPlayerPreDuelMaxHp !== null) {
      this.player.maxHp = this.arenaPlayerPreDuelMaxHp;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp);
      this.arenaPlayerPreDuelMaxHp = null;
    }
  }

  public triggerTownRaid(forcedRaider?: TownRaiderId): void {
    if (this.townRaid) return;
    const raiderId: TownRaiderId =
      forcedRaider ?? (this.nextTownRaiderIdx % 2 === 0 ? 'rimuru_tempest' : 'goblin_slayer');
    this.nextTownRaiderIdx += 1;
    const spawnX = Math.max(160, Math.min(3400, this.player.x + 175));
    const playerAtk = Math.max(8, Math.round(calculateAttackDamage(this.player, 1, false)));
    this.townRaid = createTownRaidBoss(raiderId, this.player.maxHp, playerAtk, spawnX);
    this.townRaidRetreatTimer = 75;
    this.townRaidTimer = TOWN_RAID_INTERVAL_SECONDS;
    this.pendingTownRaid = false;
    this.purpleFlameZones = [];
    this.activeCastBanner = `${this.townRaid.name.toUpperCase()} INVADES SOLARIS TOWN!`;
    this.activeCastBannerTimer = 3.0;
    gameAudio.playBattleEncounterStinger();
    this.showSecretCaption(
      `⚠ TOWN RAID: ${this.townRaid.name.toUpperCase()}!`,
      `${this.townRaid.title} (${this.townRaid.maxHp} HP / ${this.townRaid.attackDamage} ATK) is smashing houses! Defeat them for +${TOWN_RAID_REWARD_GOLD}G & Rank Up!`,
    );
    this.emitHud(true);
  }

  public restartFromCheckpoint(): void {
    this.restoreArenaPlayerHp();
    this.bossBattle = null;
    this.megaCutscene = null;
    this.coronationCutscene = null;
    this.bossEncounterCooldown = 1.5;
    this.postBossInputLockTimer = 0.35;
    this.clearAllInputs(true);
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;
    this.player.vx = 0;
    this.player.vy = 0;
    this.projectiles = [];
    if (this.realm !== 'citadel') {
      this.enterIsekaiRoom('isekai_guild', 120);
      this.setStatus('playing');
      this.showAnnouncement('Returned safely to Solaris Adventure Guild!');
      return;
    }
    this.player.x = this.player.highestCheckpointX;
    this.player.y = FLOOR_Y - this.player.h - 4;
    this.ensureChunksAround(this.player.x);
    this.setStatus('playing');
  }

  public warpToCheckpoint(cpIndex: number): void {
    const cps = getBiomeCheckpointList(this.player.highestCheckpointIndex);
    const target = cps[cpIndex];
    if (!target || !target.reached) return;
    this.restoreArenaPlayerHp();
    this.realm = 'citadel';
    this.activeMissionId = null;
    this.isekaiEnemies = [];
    this.carriageEscort = null;
    this.demonKings = [];
    this.purpleFlameZones = [];
    this.coronationCutscene = null;
    this.bossBattle = null;
    this.megaCutscene = null;
    this.bossEncounterCooldown = 1.5;
    this.postBossInputLockTimer = 0.35;
    this.clearAllInputs(true);
    this.player.x = target.x;
    this.player.y = FLOOR_Y - this.player.h - 4;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.hp = this.player.maxHp;
    this.projectiles = [];
    this.ensureChunksAround(this.player.x);
    this.camX = Math.max(-640, this.player.x - PIXEL_W * 0.32);
    this.setStatus('playing');
    this.emitHud();
  }

  public buyOrEquipWardrobeItemById(itemId: string): { ok: boolean; message: string } {
    const res = buyOrEquipWardrobeItem(
      this.player,
      this.unlockedWardrobe,
      itemId,
      this.crownUnlocked,
      this.elfCrownUnlocked,
    );
    if (res.ok) {
      gameAudio.playSecretFound();
    }
    this.showAnnouncement(res.message);
    this.emitHud(true);
    return res;
  }

  public buyPotionItem(itemId: string, drinkNow = false): { ok: boolean; message: string } {
    const res = buyPotionShopItem(this.player, this.inventory, itemId);
    if (!res.ok) {
      this.showAnnouncement(res.message);
      this.emitHud(true);
      return res;
    }
    if (drinkNow) {
      const used = useInventoryItem(this.player, this.inventory, itemId);
      gameAudio.playSecretFound();
      const msg = used.ok ? `Purchased & Drank! ${used.message}` : res.message;
      this.showAnnouncement(msg);
      this.emitHud(true);
      return { ok: true, message: msg };
    }
    gameAudio.playSecretFound();
    this.showAnnouncement(res.message);
    this.emitHud(true);
    return res;
  }

  public buyOrEquipShopWeapon(weaponId: WeaponId): { ok: boolean; message: string } {
    const res = buyOrEquipWeaponShopItem(this.player, weaponId);
    if (res.ok) {
      gameAudio.playSecretFound();
    }
    this.showAnnouncement(res.message);
    this.emitHud(true);
    return res;
  }

  public buyOrEquipStandById(standId: StandId): { ok: boolean; message: string } {
    const def = STANDS[standId];
    const res = buyOrEquipStand(this.player, standId, def.costStarStones, def.name);
    if (res.ok) {
      gameAudio.playSecretFound();
    }
    this.showAnnouncement(res.message);
    this.emitHud(true);
    return res;
  }

  public acceptGuildMission(missionId: GuildMissionId): { ok: boolean; reason?: string } {
    const mission = GUILD_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return { ok: false, reason: 'Unknown guild mission.' };
    if (!canStartGuildMission(this.guildRank, missionId)) {
      const msg =
        mission.floorReq === 2 && !canAccessGuildFloor2(this.guildRank)
          ? `2nd Floor Locked! Reach B-Rank first (current: ${this.guildRank}-Rank).`
          : `Requires ${mission.rankReq}-Rank Badge (current: ${this.guildRank}-Rank).`;
      this.showAnnouncement(msg);
      return { ok: false, reason: msg };
    }
    this.acceptedMissionId = mission.id;
    gameAudio.playSecretFound();
    this.showAnnouncement(`Accepted [${mission.rankReq}]: ${mission.title}! Speak to Caravan Rider Vance outside the Guild!`);
    this.emitHud(true);
    return { ok: true };
  }

  public rideCaravanToDestination(rawInput: string): { ok: boolean; message: string } {
    const parsed = parseCaravanDestination(
      rawInput,
      this.realm,
      this.guildRank,
      this.acceptedMissionId,
      this.elfKingdomInvited,
    );
    if (!parsed.ok || !parsed.target) {
      this.showAnnouncement(parsed.message);
      return { ok: false, message: parsed.message };
    }

    const label =
      parsed.label ??
      (parsed.target === 'isekai_town'
        ? 'Solaris Town'
        : parsed.target === 'elf_kingdom'
          ? 'Aethelgard Elf Kingdom'
          : parsed.target === 'raider_guild'
            ? 'Dungeon Raider Guild Bastion'
            : parsed.target === 'carriage_escort'
              ? 'Kingdom Royal Highway'
              : parsed.target === 'seventeen_demon_kings'
                ? '17 Manhwa Demon Kings Outskirts'
                : parsed.target === 'demon_king_arena'
                  ? 'Three Demon Kings Forest'
                  : parsed.target === 'demon_realm'
                    ? 'Demon Realm Forest Outskirts'
                    : 'Goblin Dungeon Forest Outskirts');

    this.caravanRide = {
      target: parsed.target,
      label,
      timer: 1.65,
      duration: 1.65,
    };
    this.clearAllInputs(true);
    gameAudio.playJump();
    this.showAnnouncement(parsed.message);
    this.emitHud(true);
    return { ok: true, message: parsed.message };
  }

  private completeCaravanRide(ride: { target: CaravanTarget; label: string }): void {
    if (ride.target === 'isekai_town') {
      this.enterIsekaiRoom('isekai_town', 478);
      this.showAnnouncement('Caravan arrived safely back in Solaris Town!');
      this.emitHud(true);
      return;
    }

    if (ride.target === 'elf_kingdom') {
      if (this.elfKingdomStage === 'uninvited' || this.elfKingdomStage === 'invited') {
        this.elfKingdomStage = 'banquet_ready';
      }
      this.enterIsekaiRoom('elf_kingdom', 92);
      gameAudio.playSecretFound();
      this.showSecretCaption(
        'AETHELGARD ELF KINGDOM',
        this.elfKingdomStage === 'celebration'
          ? 'Welcome back to the Eternal Royal Feast! Star-lanterns shine in honor of the Crowned Savior!'
          : 'Walk east past Sword Saint Kaelen to the Grand Banquet Table [F] for Queen Sylvaria’s Royal Dinner Party!',
      );
      this.emitHud(true);
      return;
    }

    if (ride.target === 'raider_guild') {
      this.enterIsekaiRoom('raider_guild', 90);
      gameAudio.playSecretFound();
      this.showAnnouncement('Arrived at the Dungeon Raider Guild Bastion! Speak to Guildmaster Vexor [F].');
      this.emitHud(true);
      return;
    }

    if (ride.target === 'carriage_escort') {
      this.startGuildMission('b_princess_carriage', false);
      return;
    }

    // Drop the player right beside Caravan Rider Vance in the green forest outside the massive rocky dark hole!
    if (ride.target === 'seventeen_demon_kings') {
      this.dungeonTarget = 'demon_king_arena';
      this.dungeonTargetMission = 's_seventeen_demon_kings';
    } else {
      this.dungeonTarget = ride.target;
      this.dungeonTargetMission =
        ride.target === 'demon_king_arena' && this.acceptedMissionId === 's_seventeen_demon_kings'
          ? 's_seventeen_demon_kings'
          : null;
    }
    this.enterIsekaiRoom('dungeon_exterior', 135);
    this.showSecretCaption(
      ride.label.toUpperCase(),
      'Walk east into the massive rocky dark hole [F]! Caravan Vance waits here until you exit back out.',
    );
    this.emitHud(true);
  }

  public enterDungeonFromExterior(): void {
    if (
      this.dungeonTarget === 'demon_king_arena' &&
      (this.dungeonTargetMission === 's_seventeen_demon_kings' ||
        this.acceptedMissionId === 's_seventeen_demon_kings')
    ) {
      this.startGuildMission('s_seventeen_demon_kings', false);
      return;
    }

    const fallbackMission: GuildMissionId =
      this.dungeonTarget === 'demon_king_arena'
        ? 'a_three_demon_kings'
        : this.dungeonTarget === 'demon_realm'
          ? rankIndex(this.guildRank) >= rankIndex('B')
            ? 'b_demon_invasion'
            : 'c_demon_vanguard'
          : rankIndex(this.guildRank) >= rankIndex('D')
            ? 'd_deep_goblin_keep'
            : rankIndex(this.guildRank) >= rankIndex('E')
              ? 'e_hobgoblin_caves'
              : 'f_goblin_warren';

    const acceptedDef = this.acceptedMissionId
      ? GUILD_MISSIONS.find((m) => m.id === this.acceptedMissionId)
      : null;
    const chosenMission =
      acceptedDef && acceptedDef.realm === this.dungeonTarget
        ? acceptedDef.id
        : fallbackMission;

    this.startGuildMission(chosenMission, false);
  }

  public exitDungeonToExterior(): void {
    const prevRealm =
      this.realm === 'demon_realm' || this.realm === 'demon_king_arena' || this.realm === 'goblin_dungeon'
        ? this.realm
        : 'goblin_dungeon';
    this.dungeonTarget = prevRealm;
    this.enterIsekaiRoom('dungeon_exterior', 910);
    gameAudio.playJump();
    this.showAnnouncement('Climbed out into the grassy forest! Speak to Caravan Rider Vance to ride back to Solaris Town.');
    this.emitHud(true);
  }

  public descendEndlessDepth(): void {
    if (this.realm !== 'goblin_dungeon' && this.realm !== 'demon_realm') return;
    const r = this.realm;
    const mId = this.activeMissionId ?? (r === 'demon_realm' ? 'c_demon_vanguard' : 'f_goblin_warren');
    this.dungeonDepth += 1;
    this.dungeonGeneratedMaxSector = 2;
    this.meleeHitIds.clear();
    this.purpleFlameZones = [];
    this.projectiles = [];
    this.isekaiPlatforms = buildIsekaiRoomPlatforms(r);
    this.isekaiInteractables = buildIsekaiRoomInteractables(r);
    this.isekaiEnemies = [
      ...createDungeonSectorEnemies(r, mId, 0, this.dungeonDepth, this.player.bossesDefeated),
      ...createDungeonSectorEnemies(r, mId, 1, this.dungeonDepth, this.player.bossesDefeated),
      ...createDungeonSectorEnemies(r, mId, 2, this.dungeonDepth, this.player.bossesDefeated),
    ];
    this.player.x = 76;
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.stamina = this.player.maxStamina;
    this.camX = 0;
    gameAudio.playBattleEncounterStinger();
    this.showSecretCaption(
      `ENDLESS DEPTH ${this.dungeonDepth}`,
      `Darker, larger & stronger monsters guard Depth ${this.dungeonDepth}! Climb the West Rope anytime to exit.`,
    );
    this.emitHud(true);
  }

  public soakHotSpring(): void {
    const res = applyHotSpringRest(this.player);
    gameAudio.playSecretFound();
    this.spawnBurst(this.player.x + 8, this.player.y + 8, 22, '#2dd4bf');
    this.spawnFloatingText(this.player.x + 8, this.player.y - 12, 'ONSEN +25% ATK & FULL HP!', '#5eead4');
    this.showAnnouncement(
      `Solaris Hot Spring: Restored +${res.healedHp} HP & Full Stamina + ${res.boostSeconds}s +25% ATK Boost!`,
    );
    this.emitHud(true);
  }

  public selectArenaChallenger(challengerId: ArenaChallengerId): void {
    if (this.realm !== 'dueling_arena') {
      this.enterIsekaiRoom('dueling_arena', 190);
    }
    // Ensure previous duel's 3x boost is cleared, create matched 3x opponent from base HP, then triple player HP too
    this.restoreArenaPlayerHp();
    this.arenaDuel = createArenaDuelInit(challengerId, this.player);
    this.arenaPlayerPreDuelMaxHp = this.player.maxHp;
    this.player.maxHp = Math.round(this.arenaPlayerPreDuelMaxHp * 3);
    this.player.hp = this.player.maxHp;
    this.arenaCrowdHypeTimer = 2.0;
    this.arenaSlowTimer = 0;
    this.projectiles = [];
    this.purpleFlameZones = [];
    this.meleeHitIds.clear();
    this.player.x = 190;
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.facing = 1;
    this.player.stamina = this.player.maxStamina;
    this.camX = Math.max(0, this.player.x - PIXEL_W * 0.34);
    gameAudio.playBattleEncounterStinger();
    this.showSecretCaption(
      `COLOSSEUM BEST OF 3: ${this.arenaDuel.def.name.toUpperCase()}`,
      `Round 1 Countdown! 3x HP (${this.player.maxHp} HP) · Matched ATK ${this.arenaDuel.matchedAtk} · First to 2 Wins!`,
    );
    this.emitHud(true);
  }

  public chooseReturnToGuildFromDungeon(): void {
    this.dungeonChoicePending = null;
    this.exitDungeonToExterior();
  }

  public chooseStayDeeperInDungeon(): void {
    this.dungeonChoicePending = null;
    this.descendEndlessDepth();
  }

  public sendGuildInvite(targetPeerId: string, missionId: GuildMissionId): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.showAnnouncement('Adventurer Guild online relay is offline — accept quest & ride via Caravan Rider!');
      return;
    }
    this.ws.send(JSON.stringify({ type: 'guild:invite', targetPeerId, missionId }));
    const adv = this.onlineAdventurers.find((a) => a.id === targetPeerId);
    this.showAnnouncement(`Sent co-op Guild Quest invite to ${adv?.name ?? 'Adventurer'}!`);
  }

  public respondToGuildInvite(inviteId: string, accept: boolean): void {
    const inv = this.pendingGuildInvites.find((i) => i.inviteId === inviteId);
    this.pendingGuildInvites = this.pendingGuildInvites.filter((i) => i.inviteId !== inviteId);
    if (this.ws && this.ws.readyState === WebSocket.OPEN && inv) {
      this.ws.send(JSON.stringify({ type: 'guild:invite_response', inviteId, accept }));
    }
    if (accept && inv) {
      this.startGuildMission(inv.missionId, false);
    }
    this.emitHud(true);
  }

  public startIsekaiGame(playerName?: string): void {
    this.startNewGame();
    if (playerName && playerName.trim()) {
      this.setPlayerName(playerName);
    }
    this.enterIsekaiTown('title');
  }

  public enterIsekaiTown(reason: 'gyro' | 'idle' | 'title' = 'gyro'): void {
    this.bossBattle = null;
    this.megaCutscene = null;
    this.coronationCutscene = null;
    this.projectiles = [];
    this.groundCracks = [];
    this.bossGrabLockTimer = 0;
    this.dialogue = null;
    this.lastDashTapTime = -10;
    this.lastStandTapTime = -10;
    this.standGuardTickTimer = 0;
    resetPlayerForIsekai(this.player, this.inventory);
    this.guildRank = 'F';
    this.bRankEscortsCompleted = 0;
    this.rankMissionsCompleted = 0;
    this.acceptedMissionId = null;
    this.dungeonDepth = 1;
    this.dungeonChoicePending = null;
    this.isekaiPortalOpen = true;
    this.townHouses = createTownHouseStates();
    this.townRaid = null;
    this.townRaidTimer = TOWN_RAID_INTERVAL_SECONDS;
    this.townRaidRetreatTimer = 0;
    this.pendingTownRaid = false;
    this.enterIsekaiRoom('isekai_town', 310);
    gameAudio.playSecretFound();
    this.showSecretCaption(
      'SOLARIS ISEKAI TOWN',
      reason === 'title'
        ? 'Entered Solaris Isekai Town directly! F-Rank Adventurer Badge issued — visit the Guild or Caravan Rider Vance!'
        : reason === 'idle'
          ? 'You stood still for 2 minutes — a Dimensional Gate whisked you into Axel-Solaris Town! All stats reset; F-Rank Badge issued.'
          : 'After besting Gyro Zeppeli, the Dimensional Gate carried you to Axel-Solaris Town! All stats reset; F-Rank Badge issued.',
    );
    this.openDialogue('Guild Herald Aria', 'npc', '#38bdf8', [
      'Welcome, Reincarnated Knight, to Solaris Town! Here is your porcelain F-Rank Adventurer Badge.',
      'Accept contracts at the Guild Hall, then talk [F] to Caravan Rider Vance right outside to ride to any Dungeon Forest, visit the Hot Spring, or enter the Grand Colosseum!',
    ]);
    void this.saveCurrentGame('autosave', true);
    this.emitHud(true);
  }

  public enterIsekaiRoom(room: RealmMode, spawnX = 96): void {
    this.restoreArenaPlayerHp();
    if (room === 'citadel') {
      this.returnToCitadel();
      return;
    }
    this.realm = room;
    this.bossBattle = null;
    this.megaCutscene = null;
    this.activeMissionId = null;
    this.dungeonDepth = 1;
    this.dungeonChoicePending = null;
    this.endlessContractClaimed = false;
    this.dungeonGeneratedMaxSector = 2;
    this.caravanRide = null;
    this.isekaiEnemies = [];
    this.alliedNpcs = [];
    this.arenaDuel = null;
    this.carriageEscort = null;
    this.demonKings = [];
    this.purpleFlameZones = [];
    this.activeCastBanner = null;
    this.projectiles = [];
    this.elfCutscene = null;
    if (room !== 'raider_dungeon') {
      this.activeRaiderDungeonId = null;
      this.activeRaiderFloor = 1;
      this.raiderDemonicBoss = null;
    }
    if (room !== 'elf_kingdom') {
      this.elfAmbushWave = 0;
      this.elfAmbushBossName = null;
      if (this.elfKingdomStage === 'ambush_active') {
        this.elfKingdomStage = 'banquet_ready';
      }
    }

    this.isekaiPlatforms =
      room === 'raider_guild' ? buildRaiderGuildPlatforms() : buildIsekaiRoomPlatforms(room);
    this.isekaiInteractables =
      room === 'raider_guild' ? buildRaiderGuildInteractables() : buildIsekaiRoomInteractables(room);
    this.isekaiNpcs =
      room === 'isekai_town'
        ? createTownNpcs(this.crownUnlocked)
        : room === 'isekai_guild'
          ? createGuildNpcs(this.crownUnlocked)
          : room === 'isekai_wardrobe'
            ? createWardrobeNpcs()
            : room === 'isekai_potion_shop'
              ? createPotionShopNpcs()
              : room === 'isekai_weapons_shop'
                ? createWeaponsShopNpcs()
                : room === 'elf_kingdom'
                  ? createElfKingdomNpcs(this.elfKingdomStage)
                  : room === 'raider_guild'
                    ? createRaiderGuildNpcs(this.raiderRank)
                    : [];

    if (room === 'outskirts_forest' || room === 'outskirts_caves') {
      this.isekaiEnemies = createOutskirtsAmbientEnemies(room, this.player.level);
      this.outskirtsRespawnTimer = 0;
      this.spawnPendingSideQuestBossesInRealm();
    }

    const bounds = ISEKAI_ROOM_BOUNDS[room];
    this.player.x = Math.max(bounds.minX + 12, Math.min(bounds.maxX - 32, spawnX));
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;
    this.camX = Math.max(0, Math.min(Math.max(0, bounds.maxX - PIXEL_W), this.player.x - PIXEL_W * 0.34));
    this.syncHostWorldMeta();
    if (this.status === 'playing') {
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
    }
    this.emitHud(true);
  }

  public startElfDinnerPartyCutscene(): void {
    if (this.realm !== 'elf_kingdom') return;
    if (this.elfKingdomStage === 'ambush_active') {
      this.showAnnouncement('Eldritch horrors are attacking the banquet — fight beside Sword Saint Kaelen!');
      return;
    }
    if (this.elfKingdomStage === 'celebration') {
      this.openDialogue('Queen Sylvaria & Sword Saint Kaelen', 'throne', '#34d399', [
        'Raise your emerald goblet high, Sovereign Guest! The Silver-Bough Banquet Hall shines in eternal celebration!',
        'You may equip your Living Emerald Crown anytime in Atelier Sylvie’s Wardrobe Shop back in Solaris Town.',
      ]);
      return;
    }
    this.clearAllInputs(true);
    this.elfCutscene = {
      act: 'dinner',
      beats: buildElfDinnerCutsceneBeats(),
      beatIndex: 0,
      chosenReply: null,
    };
    gameAudio.playSecretFound();
    this.emitHud(true);
  }

  public selectElfCutsceneChoice(choiceId: string): void {
    if (!this.elfCutscene) return;
    const beat = this.elfCutscene.beats[this.elfCutscene.beatIndex];
    const choice = beat?.choices?.find((c) => c.id === choiceId);
    if (!choice) return;
    this.elfCutscene.chosenReply = choice.reply;
    if (choice.bonusGold) {
      this.player.gold += choice.bonusGold;
      this.spawnFloatingText(this.player.x + 8, this.player.y - 12, `+${choice.bonusGold}G`, '#fde047');
    }
    if (choice.healFull) {
      this.player.hp = this.player.maxHp;
      this.player.stamina = this.player.maxStamina;
      this.spawnFloatingText(this.player.x + 8, this.player.y - 12, 'FULL VITALITY!', '#6ee7b7');
    }
    if (choice.atkBoostMult && choice.atkBoostSec) {
      this.player.damageBoostMultiplier = Math.max(this.player.damageBoostMultiplier, choice.atkBoostMult);
      this.player.damageBoostTimer = Math.max(this.player.damageBoostTimer, choice.atkBoostSec);
      this.spawnFloatingText(this.player.x + 8, this.player.y - 12, '+20% ATK!', '#34d399');
    }
    gameAudio.playSecretFound();
    this.emitHud(true);
  }

  public advanceElfCutscene(): void {
    if (!this.elfCutscene) return;
    const cs = this.elfCutscene;
    const currentBeat = cs.beats[cs.beatIndex];
    if (currentBeat?.choices && currentBeat.choices.length > 0 && !cs.chosenReply) {
      return;
    }
    if (cs.beatIndex + 1 < cs.beats.length) {
      cs.beatIndex += 1;
      cs.chosenReply = null;
      const nextBeat = cs.beats[cs.beatIndex];
      if (nextBeat?.portraitKind === 'boss') {
        this.trauma = Math.min(1, this.trauma + 0.75);
        this.encounterFlashTimer = 0.25;
        gameAudio.playMegaGlitchCrash();
      } else {
        gameAudio.playDialogueBlip('npc', 74);
      }
      this.emitHud(true);
      return;
    }

    const finishedAct = cs.act;
    this.elfCutscene = null;
    if (finishedAct === 'dinner') {
      this.beginElfEldritchAmbush();
    } else {
      this.finishElfCoronationVictory();
    }
  }

  private beginElfEldritchAmbush(): void {
    this.elfKingdomStage = 'ambush_active';
    this.elfAmbushWave = 1;
    this.elfAmbushBossName = null;
    this.alliedNpcs = [createElfSwordsmanAlly()];
    this.isekaiEnemies = createElfAmbushWave(1, this.player.level);
    this.purpleFlameZones = [
      {
        id: `elf_ichor_start_1_${Date.now()}`,
        x: 1580,
        y: FLOOR_Y - 38,
        w: 64,
        h: 38,
        life: 3.4,
        maxLife: 3.4,
        damage: 14,
        kind: 'eldritch_ichor_pool',
        hasHit: false,
      },
      {
        id: `elf_bone_start_2_${Date.now()}`,
        x: 1860,
        y: FLOOR_Y - 46,
        w: 50,
        h: 46,
        life: 3.4,
        maxLife: 3.4,
        damage: 16,
        kind: 'eldritch_bone_spurs',
        hasHit: false,
      },
    ];
    this.player.x = 1440;
    this.player.y = FLOOR_Y - this.player.h;
    this.camX = Math.max(0, this.player.x - PIXEL_W * 0.34);
    this.trauma = 0.7;
    this.speedLineTimer = 0.75;
    gameAudio.playBattleEncounterStinger();
    this.showSecretCaption(
      'BANQUET UNDER ELDRITCH SIEGE!',
      'Wave 1/2: Fight alongside Sword Saint Kaelen against the Ichor-Hounds and Marrow-Tendril Horrors!',
    );
    this.emitHud(true);
  }

  private finishElfCoronationVictory(): void {
    this.elfKingdomStage = 'celebration';
    this.elfAmbushWave = 0;
    this.elfAmbushBossName = null;
    this.elfCrownUnlocked = true;
    this.player.customization.crownStyle = 'elf_emerald';
    this.player.customization.crownEquipped = true;
    this.player.gold += 650;
    this.player.statPoints += 8;
    this.player.starStones = (this.player.starStones ?? 0) + 3;
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;
    this.alliedNpcs = [];
    this.purpleFlameZones = [];
    this.isekaiNpcs = createElfKingdomNpcs('celebration');
    gameAudio.playSecretFound();
    this.spawnBurst(this.player.x + 8, this.player.y, 32, '#34d399');
    this.showSecretCaption(
      'ELF SOVEREIGN EMERALD CROWN UNLOCKED!',
      '+650G · +8 Stat Pts · +3 Star Stones! Aethelgard celebrates the Royal Feast in your honor forever!',
    );
    void this.saveCurrentGame('autosave', true);
    this.emitHud(true);
  }

  public enterRaiderDungeon(dungeonId: number): { ok: boolean; message: string } {
    const dungeon = getRaiderDungeonById(dungeonId);
    if (!isRaiderDungeonUnlocked(dungeon, this.raiderRank)) {
      const msg = `Requires ${dungeon.requiredRank} Raider Rank to enter ${dungeon.code} ${dungeon.name}!`;
      this.showAnnouncement(msg);
      return { ok: false, message: msg };
    }
    this.activeRaiderDungeonId = dungeon.id;
    this.activeRaiderFloor = 1;
    this.loadRaiderDungeonFloor(dungeon, 1);
    gameAudio.playBattleEncounterStinger();
    this.showSecretCaption(
      `${dungeon.code}: ${dungeon.name.toUpperCase()}`,
      `Floor 1/${dungeon.floors} · ${dungeon.designLabel} · Clear every monster to unlock the Ascending Stairs!`,
    );
    this.emitHud(true);
    return { ok: true, message: `Entered ${dungeon.code} ${dungeon.name}` };
  }

  private loadRaiderDungeonFloor(dungeon: import('./types').RaiderDungeonDef, floor: number): void {
    this.restoreArenaPlayerHp();
    this.realm = 'raider_dungeon';
    this.bossBattle = null;
    this.megaCutscene = null;
    this.activeMissionId = null;
    this.caravanRide = null;
    this.elfCutscene = null;
    this.isekaiNpcs = [];
    this.alliedNpcs = [];
    this.arenaDuel = null;
    this.carriageEscort = null;
    this.demonKings = [];
    this.purpleFlameZones = [];
    this.projectiles = [];
    this.activeCastBanner = null;
    this.activeRaiderFloor = floor;
    this.isekaiPlatforms = buildRaiderDungeonFloorPlatforms(dungeon, floor);
    this.isekaiInteractables = buildRaiderDungeonFloorInteractables(dungeon, floor);
    this.isekaiEnemies = createRaiderFloorEnemies(dungeon, floor, this.player.level);
    const isBossFloor = floor >= dungeon.floors;
    this.raiderDemonicBoss = isBossFloor ? createRaiderDemonicBoss(dungeon, this.player.level) : null;
    this.player.x = 84;
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.camX = 0;
    this.syncHostWorldMeta();
    if (this.status === 'playing') {
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
    }
  }

  public ascendRaiderDungeonStairs(): void {
    if (this.realm !== 'raider_dungeon' || !this.activeRaiderDungeonId) return;
    const dungeon = getRaiderDungeonById(this.activeRaiderDungeonId);
    const aliveEnemies = this.isekaiEnemies.filter((e) => e.state !== 'ko' && e.hp > 0).length;
    if (aliveEnemies > 0) {
      this.showAnnouncement(`Staircase sealed! Defeat the remaining ${aliveEnemies} monster(s) on Floor ${this.activeRaiderFloor}!`);
      return;
    }
    if (this.activeRaiderFloor >= dungeon.floors) return;
    const nextFloor = this.activeRaiderFloor + 1;
    this.loadRaiderDungeonFloor(dungeon, nextFloor);
    gameAudio.playJump();
    const isBossFloor = nextFloor >= dungeon.floors;
    if (isBossFloor && this.raiderDemonicBoss) {
      gameAudio.playMegaGlitchCrash();
      this.trauma = 0.65;
      this.speedLineTimer = 0.7;
      this.showSecretCaption(
        `FINAL FLOOR ${nextFloor}/${dungeon.floors} · DEMONIC OVERLORD!`,
        `${this.raiderDemonicBoss.name} awakens! Watch out for Berserk Awakening below 50% HP!`,
      );
    } else {
      this.showSecretCaption(
        `${dungeon.code} · FLOOR ${nextFloor}/${dungeon.floors}`,
        'Clear all floor monsters to unlock the next ascending staircase!',
      );
    }
    this.emitHud(true);
  }

  private completeRaiderDungeonVictory(): void {
    if (!this.activeRaiderDungeonId) return;
    const dungeon = getRaiderDungeonById(this.activeRaiderDungeonId);
    const bossName = this.raiderDemonicBoss?.name ?? dungeon.bossName;
    this.raiderDemonicBoss = null;
    this.isekaiEnemies = [];
    this.purpleFlameZones = [];
    this.projectiles = [];

    const rankDef = getRaiderRankDef(this.raiderRank);
    const goldEarned = Math.round(dungeon.rewardGold * (1 + rankDef.goldBonusPct / 100));
    const isFirstClear = !this.clearedRaiderDungeons.includes(dungeon.id);
    if (isFirstClear) {
      this.clearedRaiderDungeons.push(dungeon.id);
    }
    const rpEarned = isFirstClear ? dungeon.rewardRaiderPoints : Math.max(12, Math.round(dungeon.rewardRaiderPoints * 0.45));
    const prevRank = this.raiderRank;
    this.raiderPoints += rpEarned;
    this.raiderRank = getRaiderRankForPoints(this.raiderPoints);

    this.player.gold += goldEarned;
    this.player.statPoints += isFirstClear ? 6 : 3;
    this.player.starStones = (this.player.starStones ?? 0) + dungeon.rewardStarStones;
    grantKillStatPoints(this.player, 'boss');

    const promoted = prevRank !== this.raiderRank;
    this.enterIsekaiRoom('raider_guild', 460);
    gameAudio.playSecretFound();
    this.spawnBurst(this.player.x + 8, this.player.y, 32, '#ef4444');
    this.showSecretCaption(
      promoted
        ? `DUNGEON CLEARED · RANK UP TO ${this.raiderRank.toUpperCase()}!`
        : `${dungeon.code} CONQUERED!`,
      `Slain ${bossName}! +${goldEarned}G · +${rpEarned} Raider Pts · +${dungeon.rewardStarStones} Star Stones!`,
    );
    void this.saveCurrentGame('autosave', true);
    this.emitHud(true);
  }

  public setTrackedSideQuest(questId: SideQuestId | null): void {
    this.trackedSideQuestId = questId;
    this.emitHud(true);
  }

  public acceptOrAdvanceSideQuest(questId: SideQuestId): void {
    const quest = SIDE_QUESTS.find((q) => q.id === questId);
    if (!quest) return;
    const prog = this.sideQuestProgress[questId] ?? {
      stage: 0,
      kills: 0,
      twistRevealed: false,
      bossSpawned: false,
    };
    this.sideQuestProgress[questId] = prog;
    if (prog.stage === 0) {
      prog.stage = 1;
      gameAudio.playSecretFound();
      this.showAnnouncement(`Side Quest Accepted: ${quest.title}`);
    }
    this.trackedSideQuestId = questId;
    this.spawnPendingSideQuestBossesInRealm();
    this.emitHud(true);
  }

  public selectSideQuestDialogueChoice(
    questId: SideQuestId,
    nodeId: string,
    choiceId: string,
  ): void {
    const quest = SIDE_QUESTS.find((q) => q.id === questId);
    if (!quest) return;
    const allNodes = [
      ...quest.openingNodes,
      ...quest.midQuestNodes,
      ...quest.twistConfrontationNodes,
    ];
    const node = allNodes.find((n) => n.id === nodeId);
    const choice = node?.choices?.find((c) => c.id === choiceId);
    if (!choice) return;

    const prog = this.sideQuestProgress[questId] ?? {
      stage: 0,
      kills: 0,
      twistRevealed: false,
      bossSpawned: false,
      clueUncovered: false,
      chosenOptionIds: [],
      confronted: false,
    };
    this.sideQuestProgress[questId] = prog;

    const res = applySideQuestDialogueChoice(quest, prog, choice);
    if (res.goldDelta > 0) {
      this.player.gold += res.goldDelta;
      this.spawnFloatingText(this.player.x + 12, this.player.y - 12, `+${res.goldDelta}G`, '#fbbf24');
      gameAudio.playSecretFound();
    }
    if (res.statPointsDelta > 0) {
      this.player.statPoints += res.statPointsDelta;
      this.spawnFloatingText(this.player.x + 12, this.player.y - 24, `+${res.statPointsDelta} STAT`, '#38bdf8');
      gameAudio.playSecretFound();
    }
    if (res.acceptedNow) {
      this.trackedSideQuestId = quest.id;
      gameAudio.playSecretFound();
      this.showSecretCaption(
        `CONTRACT ACCEPTED: ${quest.title.toUpperCase()}`,
        `${quest.hookSummary}`,
      );
      this.spawnPendingSideQuestBossesInRealm();
    } else if (res.clueNewlyUncovered) {
      gameAudio.playSecretFound();
      this.showAnnouncement(`Ledger Clue Uncovered: ${quest.title}`);
    }

    this.emitHud(true);
    void this.saveCurrentGame('autosave', true);
  }

  private spawnPendingSideQuestBossesInRealm(): void {
    if (this.realm !== 'outskirts_forest' && this.realm !== 'outskirts_caves') return;
    for (const q of SIDE_QUESTS) {
      if (q.targetRealm !== this.realm) continue;
      const prog = this.sideQuestProgress[q.id];
      if (!prog || prog.stage !== 1 || !prog.twistRevealed) continue;
      if (!this.isekaiEnemies.some((e) => e.sideQuestId === q.id && e.state !== 'ko')) {
        this.isekaiEnemies.push(createSideQuestBossEnemy(q, this.player.bossesDefeated));
        prog.bossSpawned = true;
      }
    }
  }

  public startGuildMission(missionId: GuildMissionId, broadcastToParty = false): { ok: boolean; reason?: string } {
    this.restoreArenaPlayerHp();
    const mission = GUILD_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return { ok: false, reason: 'Unknown guild mission.' };
    if (!canStartGuildMission(this.guildRank, missionId)) {
      const msg =
        mission.floorReq === 2 && !canAccessGuildFloor2(this.guildRank)
          ? `2nd Floor Locked! Reach B-Rank first (current: ${this.guildRank}-Rank).`
          : `Requires ${mission.rankReq}-Rank Badge (current: ${this.guildRank}-Rank).`;
      this.showAnnouncement(msg);
      return { ok: false, reason: msg };
    }

    this.realm = mission.realm;
    this.activeMissionId = mission.id;
    this.acceptedMissionId = null;
    this.dungeonDepth = 1;
    this.dungeonChoicePending = null;
    this.endlessContractClaimed = false;
    this.dungeonGeneratedMaxSector = 2;
    this.meleeHitIds.clear();
    this.bossBattle = null;
    this.megaCutscene = null;
    this.coronationCutscene = null;
    this.dialogue = null;
    this.projectiles = [];
    this.purpleFlameZones = [];
    this.activeCastBanner = null;
    this.activeCastBannerTimer = 0;
    this.isekaiNpcs = [];
    this.alliedNpcs = [];
    this.arenaDuel = null;
    this.isekaiInteractables = buildIsekaiRoomInteractables(mission.realm);
    this.isekaiPlatforms = buildIsekaiRoomPlatforms(mission.realm);
    this.isekaiKillsDone = 0;
    this.isekaiKillsRequired = mission.killsRequired;
    this.isekaiWaveIndex = 0;

    if (mission.realm === 'goblin_dungeon' || mission.realm === 'demon_realm') {
      this.carriageEscort = null;
      this.demonKings = [];
      this.isekaiEnemies = [
        ...createDungeonSectorEnemies(mission.realm, mission.id, 0, this.dungeonDepth, this.player.bossesDefeated),
        ...createDungeonSectorEnemies(mission.realm, mission.id, 1, this.dungeonDepth, this.player.bossesDefeated),
        ...createDungeonSectorEnemies(mission.realm, mission.id, 2, this.dungeonDepth, this.player.bossesDefeated),
      ];
      this.isekaiKillsRequired = mission.killsRequired;
    } else if (mission.realm === 'carriage_escort') {
      const variant = this.bRankEscortsCompleted;
      this.carriageEscort = createCarriageEscortInit(variant);
      this.demonKings = [];
      this.isekaiEnemies = createBanditWave(this.carriageEscort.x, 0, variant);
      this.carriageEscort.wavesSpawned = 1;
    } else if (mission.realm === 'demon_king_arena') {
      this.carriageEscort = null;
      this.activeDemonKingStage = 1;
      const init =
        mission.id === 's_seventeen_demon_kings'
          ? createSeventeenDemonKingsInit(this.player.bossesDefeated)
          : createThreeDemonKingsInit(this.foughtIsekaiEnemies, this.player.bossesDefeated);
      this.demonKings = init.demonKings;
      this.isekaiEnemies = init.minions;
      this.alliedNpcs = init.allies;
      this.isekaiKillsRequired = this.demonKings.length;
    }

    this.player.x = 76;
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;
    this.camX = 0;

    if (broadcastToParty && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'guild:mission_start', missionId }));
    }

    gameAudio.playBattleEncounterStinger();
    const firstKing = this.demonKings[0];
    this.showAnnouncement(
      mission.realm === 'demon_king_arena'
        ? `STAGE 1/${this.demonKings.length}: ${firstKing?.name ?? 'Demon King'} descends! Harold, Elise & Aria join you!`
        : `ENTERED: [${mission.rankReq}-RANK] ${mission.title}! Explore endlessly or Exit via West Rope!`,
    );
    this.syncHostWorldMeta();
    this.emitHud(true);
    return { ok: true };
  }

  public returnToCitadel(): void {
    this.restoreArenaPlayerHp();
    this.realm = 'citadel';
    this.activeMissionId = null;
    this.isekaiNpcs = [];
    this.isekaiPlatforms = [];
    this.isekaiInteractables = [];
    this.isekaiEnemies = [];
    this.carriageEscort = null;
    this.demonKings = [];
    this.purpleFlameZones = [];
    this.activeCastBanner = null;
    this.coronationCutscene = null;
    this.projectiles = [];
    this.player.x = this.player.highestCheckpointX;
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.idleTimer = 0;
    this.chunks.clear();
    this.chunksDirty = true;
    this.ensureChunksAround(this.player.x);
    this.camX = Math.max(-640, this.player.x - PIXEL_W * 0.34);
    this.syncHostWorldMeta();
    if (this.status === 'playing') {
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
    }
    this.showAnnouncement('Returned to Bastera Endless Citadel!');
    this.emitHud(true);
  }

  public setPlayerName(name: string): void {
    const clean = name.trim().slice(0, 18);
    if (clean) {
      this.playerName = clean;
      this.syncHostWorldMeta();
    }
  }

  public triggerVirtualKey(
    action: 'left' | 'right' | 'jump' | 'dash' | 'attack' | 'interact' | 'skill0' | 'skill1' | 'skill2',
    pressed: boolean,
  ): void {
    if (action === 'left') this.virtualInput.left = pressed;
    else if (action === 'right') this.virtualInput.right = pressed;
    else if (action === 'jump') {
      if (pressed && !this.virtualInput.jumpHeld) this.justPressed.add('Space');
      this.virtualInput.jumpHeld = pressed;
    } else if (pressed) {
      if (action === 'dash') this.justPressed.add('ShiftLeft');
      if (action === 'attack') this.justPressed.add('KeyJ');
      if (action === 'interact') this.justPressed.add('KeyF');
      if (action === 'skill0') this.justPressed.add('Digit1');
      if (action === 'skill1') this.justPressed.add('Digit2');
      if (action === 'skill2') this.justPressed.add('Digit3');
    }
  }

  public performDash(): void {
    if (
      this.status !== 'playing' ||
      this.modalPaused ||
      this.bossBattle ||
      this.megaCutscene ||
      this.coronationCutscene ||
      this.caravanRide ||
      this.dungeonChoicePending ||
      this.volcanoBridgeFallTimer > 0
    ) {
      return;
    }
    this.player.idleTimer = 0;
    if (this.heldKeys.has('ArrowLeft') || this.heldKeys.has('KeyA') || this.virtualInput.left) {
      this.player.facing = -1;
    } else if (this.heldKeys.has('ArrowRight') || this.heldKeys.has('KeyD') || this.virtualInput.right) {
      this.player.facing = 1;
    }
    if (this.simTime - this.lastSlashInputTime <= 0.28) {
      this.executeSpinPokeDash();
      return;
    }
    if (this.simTime - this.lastDashTapTime <= 0.48 && activateWhiteAuraDash(this.player)) {
      this.lastDashTapTime = -10;
      this.lastDashInputTime = this.simTime;
      gameAudio.playSkill('blade_dash');
      gameAudio.playSecretFound();
      this.spawnAfterimage('#ffffff');
      this.spawnBurst(this.player.x + 8, this.player.y + 13, 24, '#ffffff');
      this.spawnFloatingText(
        this.player.x + 8,
        this.player.y - 16,
        'WHITE AURA! +30% SPD · INVINCIBLE',
        '#ffffff',
      );
      this.speedLineTimer = 0.55;
      this.emitHud(true);
      return;
    }
    this.lastDashTapTime = this.simTime;
    this.lastDashInputTime = this.simTime;
    if (triggerPlayerDash(this.player)) {
      gameAudio.playSkill('blade_dash');
      this.spawnAfterimage('#fbbf24');
      this.spawnBurst(this.player.x + 8, this.player.y + 14, 10, '#fbbf24');
      this.speedLineTimer = 0.28;
      this.emitHud();
    }
  }

  private executeSpinPokeDash(): void {
    if (this.dungeonChoicePending) return;
    if (triggerSpinPokeDash(this.player)) {
      this.lastSlashInputTime = -10;
      this.lastDashInputTime = -10;
      this.meleeHitIds.clear();
      gameAudio.playSkill('blade_dash');
      gameAudio.playSwordSlash(this.player.equippedWeapon, 2);
      this.spawnAfterimage('#34d399');
      this.spawnBurst(this.player.x + 8, this.player.y + 14, 18, '#6ee7b7');
      this.spawnFloatingText(this.player.x + 8, this.player.y - 12, 'WIND SPIN POKE!', '#34d399');
      this.speedLineTimer = 0.36;
      const chunks = this.realm === 'citadel' ? this.getActiveChunks() : [];
      this.resolveMeleeHits(chunks, 1.35);
      this.emitHud();
    }
  }

  public equipWeaponById(weaponId: WeaponId): void {
    if (equipWeapon(this.player, weaponId)) {
      const w = WEAPONS[weaponId];
      this.showAnnouncement(`Equipped ${w.name} (${w.styleName})`);
      this.emitHud();
    }
  }

  public craftOrEquipWeapon(weaponId: WeaponId): { ok: boolean; reason?: string } {
    const res = craftWeapon(this.player, this.inventory, weaponId);
    if (res.ok) {
      this.showAnnouncement(`Forged & equipped ${WEAPONS[weaponId].name}!`);
    } else if (res.reason) {
      this.showAnnouncement(res.reason);
    }
    this.emitHud();
    return res;
  }

  public swapSkillSlot(slotIndex: 0 | 1 | 2, skillId: SkillId): void {
    assignSkillToSlot(this.player, slotIndex, skillId);
    this.showAnnouncement(`Slot ${slotIndex + 1} -> ${SKILLS[skillId].name}`);
    this.emitHud();
  }

  public useItem(itemId: string): { ok: boolean; message: string } {
    const res = useInventoryItem(this.player, this.inventory, itemId);
    if (res.ok) {
      gameAudio.playSecretFound();
    }
    this.showAnnouncement(res.message);
    this.emitHud();
    return res;
  }

  public allocatePlayerStat(statKey: StatKey, amount = 1): boolean {
    const res = allocateStatPoint(this.player, statKey, amount);
    if (!res.ok) return false;
    gameAudio.playSecretFound();
    const labelMap: Record<StatKey, string> = {
      attack: 'ATK (STR)',
      skillDmg: 'SKILL DMG (INT)',
      hp: 'MAX HP (VIT)',
      speed: 'SPEED (AGI)',
    };
    this.showAnnouncement(`[SYSTEM] ${labelMap[statKey]} +${res.applied}!`);
    this.emitHud(true);
    return true;
  }

  public setWarriorCustomization(patch: Partial<WarriorCustomization>): void {
    updateWarriorCustomization(this.player, patch);
    this.emitHud(true);
  }

  public triggerSkillButton(slotIndex: 0 | 1 | 2): void {
    if (this.status !== 'playing') return;
    if (this.bossBattle) {
      this.battleUseSkill(slotIndex);
      return;
    }
    this.executeSkill(slotIndex);
  }

  public battleAttackWeapon(): void {
    if (!this.bossBattle || this.status !== 'playing') return;
    const res = resolvePlayerBattleSword(this.bossBattle, this.player);
    if (res.ok) {
      gameAudio.playSwordSlash(this.player.equippedWeapon, 1);
      gameAudio.playHit(false);
      this.trauma = Math.min(1, this.trauma + 0.35);
      this.emitHud(true);
    }
  }

  public battleUseSkill(slotIndex: 0 | 1 | 2): void {
    if (!this.bossBattle || this.status !== 'playing') return;
    const res = resolvePlayerBattleSkill(this.bossBattle, this.player, slotIndex);
    if (res.ok) {
      gameAudio.playSkill(res.skillId);
      gameAudio.playSlashClaw(true);
      this.trauma = Math.min(1, this.trauma + 0.45);
      this.emitHud(true);
    } else if (res.reason) {
      this.showAnnouncement(res.reason);
    }
  }

  public battleUsePotion(itemId: string): void {
    if (!this.bossBattle || this.status !== 'playing') return;
    const res = resolveBattlePotion(this.bossBattle, this.player, this.inventory, itemId);
    if (res.ok) {
      gameAudio.playSecretFound();
    } else {
      this.showAnnouncement(res.message);
    }
    this.emitHud(true);
  }

  public battleUseOrb(orbId: OrbId): void {
    if (this.status !== 'playing') return;
    if (this.bossBattle) {
      const res = resolveBattleOrb(this.bossBattle, this.inventory, orbId);
      if (res.ok) {
        gameAudio.playSkill(
          orbId === 'orb_flame'
            ? 'candlefire_wave'
            : orbId === 'orb_electric'
              ? 'chrono_freeze'
              : 'blade_dash',
        );
        this.trauma = Math.min(1, this.trauma + 0.45);
      } else {
        this.showAnnouncement(res.message);
      }
      this.emitHud(true);
      return;
    }

    // Real-time Demon King Arena, Dueling Arena, Town Raid & Raider Demonic Boss orb support
    if (
      (this.realm === 'demon_king_arena' && this.demonKings.length > 0) ||
      (this.realm === 'dueling_arena' && this.arenaDuel) ||
      (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) ||
      (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0)
    ) {
      const orbItem = this.inventory.find((i) => i.id === orbId);
      if (!orbItem || orbItem.count <= 0) {
        this.showAnnouncement('No orbs of that element left!');
        return;
      }

      if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
        const rb = this.raiderDemonicBoss;
        orbItem.count -= 1;
        if (orbId === 'orb_flame') {
          const dmg = Math.max(1, Math.round(rb.maxHp * FLAME_ORB_HP_RATIO));
          rb.hp = Math.max(0, rb.hp - dmg);
          rb.hitFlash = 0.25;
          this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 14, `-${dmg} (25% HP)`, '#f97316');
          this.spawnBurst(rb.x + rb.w / 2, rb.y + 22, 24, '#f97316');
          gameAudio.playSkill('candlefire_wave');
          if (rb.hp <= 0) this.completeRaiderDungeonVictory();
        } else if (orbId === 'orb_wind') {
          const dmg = Math.max(1, Math.round(rb.maxHp * 0.14));
          rb.hp = Math.max(0, rb.hp - dmg);
          rb.hitFlash = 0.2;
          this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 14, `WIND GALE -${dmg}`, '#2dd4bf');
          this.spawnBurst(rb.x + rb.w / 2, rb.y + 20, 16, '#2dd4bf');
          gameAudio.playSkill('blade_dash');
          if (rb.hp <= 0) this.completeRaiderDungeonVictory();
        } else {
          rb.stunTimer = 2.6;
          this.spawnBurst(rb.x + rb.w / 2, rb.y + 20, 14, '#facc15');
          gameAudio.playSkill('chrono_freeze');
          this.showAnnouncement(`Electrical Orb: ${rb.name} STUNNED!`);
        }
        this.trauma = Math.min(1, this.trauma + 0.35);
        this.emitHud(true);
        return;
      }

      if (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
        const raid = this.townRaid;
        orbItem.count -= 1;
        if (orbId === 'orb_flame') {
          const dmg = Math.max(1, Math.round(raid.maxHp * FLAME_ORB_HP_RATIO));
          raid.hp = Math.max(0, raid.hp - dmg);
          raid.hitFlash = 0.25;
          this.spawnFloatingText(raid.x + raid.w / 2, raid.y - 14, `-${dmg} (25% HP)`, '#f97316');
          this.spawnBurst(raid.x + raid.w / 2, raid.y + 18, 20, '#f97316');
          gameAudio.playSkill('candlefire_wave');
          if (raid.hp <= 0) this.onTownRaidDefeated();
        } else if (orbId === 'orb_wind') {
          raid.windVulnerable = true;
          this.spawnBurst(raid.x + raid.w / 2, raid.y + 16, 12, '#2dd4bf');
          gameAudio.playSkill('blade_dash');
          this.showAnnouncement(`Wind Orb: ${raid.name} now takes +30% EXTRA DMG!`);
        } else {
          raid.stunTimer = 2.6;
          this.spawnBurst(raid.x + raid.w / 2, raid.y + 16, 12, '#facc15');
          gameAudio.playSkill('chrono_freeze');
          this.showAnnouncement(`Electrical Orb: ${raid.name} STUNNED!`);
        }
        this.trauma = Math.min(1, this.trauma + 0.35);
        this.emitHud(true);
        return;
      }

      if (this.realm === 'dueling_arena' && this.arenaDuel) {
        if (this.isArenaRoundLocked()) {
          this.showAnnouncement('Wait for the Round Countdown to finish!');
          return;
        }
        const duel = this.arenaDuel;
        orbItem.count -= 1;
        if (orbId === 'orb_flame') {
          const dmg = Math.max(1, Math.round(duel.maxHp * FLAME_ORB_HP_RATIO));
          duel.hp = Math.max(0, duel.hp - dmg);
          duel.hitFlash = 0.25;
          this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 14, `-${dmg} (25% HP)`, '#f97316');
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 18, 20, '#f97316');
          gameAudio.playSkill('candlefire_wave');
          this.showAnnouncement(`Flame Orb scorched ${duel.def.name} for ${dmg} DMG!`);
          if (duel.hp <= 0) this.handleArenaRoundEnd('player');
        } else if (orbId === 'orb_wind') {
          duel.windVulnerable = true;
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 16, 12, '#2dd4bf');
          gameAudio.playSkill('blade_dash');
          this.showAnnouncement(`Wind Orb: ${duel.def.name} now takes +30% EXTRA DMG!`);
        } else {
          duel.stunTimer = 2.6;
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 16, 12, '#facc15');
          gameAudio.playSkill('chrono_freeze');
          this.showAnnouncement(`Electrical Orb: ${duel.def.name} STUNNED!`);
        }
        this.trauma = Math.min(1, this.trauma + 0.35);
        this.emitHud(true);
        return;
      }

      const aliveKings = this.demonKings.filter(
        (dk) => !dk.defeated && dk.hp > 0 && dk.index === this.activeDemonKingStage,
      );
      if (aliveKings.length === 0) return;

      orbItem.count -= 1;
      const targetKing = aliveKings[0];

      if (orbId === 'orb_flame') {
        const dmg = Math.max(1, Math.round(targetKing.maxHp * FLAME_ORB_HP_RATIO));
        this.damageDemonKing(targetKing, dmg, 0);
        this.spawnFloatingText(targetKing.x + targetKing.w / 2, targetKing.y - 14, `-${dmg} (25% HP)`, '#f97316');
        this.spawnBurst(targetKing.x + targetKing.w / 2, targetKing.y + 18, 20, '#f97316');
        this.showAnnouncement(`Flame Orb scorched ${targetKing.name} for ${dmg} DMG!`);
        gameAudio.playSkill('candlefire_wave');
      } else if (orbId === 'orb_wind') {
        targetKing.windVulnerable = true;
        this.spawnBurst(targetKing.x + targetKing.w / 2, targetKing.y + 16, 12, '#2dd4bf');
        this.showAnnouncement(`Wind Orb: ${targetKing.name} now takes +30% EXTRA DMG!`);
        gameAudio.playSkill('blade_dash');
      } else {
        targetKing.stunTimer = 2.6;
        this.spawnBurst(targetKing.x + targetKing.w / 2, targetKing.y + 16, 12, '#facc15');
        this.showAnnouncement(`Electrical Orb: ${targetKing.name} STUNNED!`);
        gameAudio.playSkill('chrono_freeze');
      }
      this.trauma = Math.min(1, this.trauma + 0.35);
      this.emitHud(true);
    }
  }

  public battleRun(): void {
    if (!this.bossBattle || this.status !== 'playing') return;
    if (startBattleRun(this.bossBattle)) {
      gameAudio.playJump();
      this.emitHud(true);
    }
  }

  public battleRetreatToSanctuary(onOpened?: () => void): void {
    if (!this.bossBattle || this.status !== 'playing') return;
    this.pendingSanctuaryCallback = onOpened ?? null;
    if (startBattleRun(this.bossBattle)) {
      gameAudio.playJump();
      this.emitHud(true);
    } else if (this.bossBattle.phase === 'run_anim') {
      // Already retreating — callback will trigger at end of run_anim
      this.emitHud(true);
    } else {
      const bossX = this.bossBattle.boss.x;
      this.bossBattle = null;
      this.bossEncounterCooldown = 4.0;
      this.postBossInputLockTimer = 0.45;
      this.clearAllInputs(true);
      this.player.x = Math.max(24, bossX - 210);
      this.player.y = FLOOR_Y - this.player.h - 4;
      this.camX = Math.max(-640, this.player.x - PIXEL_W * 0.34);
      this.completeBossEncounterProgress();
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
      this.emitHud(true);
      const cb = this.pendingSanctuaryCallback;
      this.pendingSanctuaryCallback = null;
      cb?.();
    }
  }

  public battleEscape(): void {
    if (!this.bossBattle || this.status !== 'playing') return;
    if (startBattleEscape(this.bossBattle)) {
      gameAudio.playSecretFound();
      this.emitHud(true);
    }
  }

  public advanceDialogue(): void {
    if (!this.dialogue) return;
    const currentLine = this.dialogue.lines[this.dialogue.lineIndex] || '';
    if (this.dialogue.charIndex < currentLine.length) {
      this.dialogue.charIndex = currentLine.length;
    } else if (this.dialogue.lineIndex < this.dialogue.lines.length - 1) {
      this.dialogue.lineIndex += 1;
      this.dialogue.charIndex = 0;
      this.dialogue.charTimer = 0;
    } else {
      this.dialogue = null;
    }
    this.emitHud();
  }

  public toggleMute(): void {
    const muted = gameAudio.toggleMute();
    if (!muted && this.status === 'playing') {
      const boss = this.realm === 'citadel' ? this.getActiveNearbyBoss() : null;
      gameAudio.startMusic(this.getCurrentBiome(), boss?.def ?? null, this.realm);
    }
    this.emitHud();
  }

  private openDialogue(
    speaker: string,
    portraitKind: DialogueState['portraitKind'],
    portraitColor: string,
    lines: string[],
  ): void {
    this.clearAllInputs(true);
    this.dialogue = {
      speaker,
      portraitKind,
      portraitColor,
      lines,
      lineIndex: 0,
      charIndex: 0,
      charTimer: 0,
      active: true,
    };
    this.emitHud();
  }

  private showAnnouncement(text: string): void {
    this.announcement = text;
    this.announcementTimer = 2.8;
    this.emitHud();
  }

  private showSecretCaption(title: string, detail: string): void {
    this.secretCaption = { title, detail };
    this.secretCaptionTimer = 4.6;
    this.emitHud(true);
  }

  private getCurrentChunkIndex(): number {
    return Math.floor(this.player.x / CHUNK_WIDTH);
  }

  private getCurrentBiome(): BiomeId {
    return getBiomeForChunk(this.getCurrentChunkIndex());
  }

  private getEffectiveDefeatedBosses(): Set<number> {
    return this.worldRole === 'guest' ? this.hostDefeatedBosses : this.defeatedBosses;
  }

  private ensureChunksAround(worldX: number): void {
    const center = Math.floor(worldX / CHUNK_WIDTH);
    const minC = Math.max(-1, center - 1);
    const maxC = center + 2;
    const defeatedSet = this.getEffectiveDefeatedBosses();
    const monsterMult = getMonsterLevelMultiplier(this.player.level);
    let changed = false;

    for (let c = minC; c <= maxC; c++) {
      if (!this.chunks.has(c)) {
        const chunk = generateChunk(c, this.player.bossesDefeated);
        if (chunk.boss && chunk.boss.def.isGyroBoss) {
          const gyroDef = createGyroZeppeliBossDef(
            this.player.maxHp,
            calculateAttackDamage(this.player, 1, false),
            this.player.bossesDefeated,
          );
          chunk.boss.def = gyroDef;
          chunk.boss.maxHp = gyroDef.maxHp;
          chunk.boss.hp = gyroDef.maxHp;
        }
        for (const en of chunk.enemies) {
          en.maxHp = Math.round(en.maxHp * monsterMult);
          en.hp = en.maxHp;
        }
        if (chunk.boss && defeatedSet.has(chunk.boss.def.index)) {
          chunk.boss.defeated = true;
          chunk.boss.hp = 0;
          chunk.boss.state = 'ko';
        }
        if (chunk.hiddenPassage && this.discoveredSecrets.has(chunk.hiddenPassage.id)) {
          chunk.hiddenPassage.discovered = true;
        }
        for (const prop of chunk.interactables) {
          if (prop.kind === 'chest' && this.openedChests.has(prop.id)) {
            prop.activated = true;
          }
        }
        if (
          this.isekaiPortalOpen &&
          c === Math.floor(this.player.x / CHUNK_WIDTH) &&
          !chunk.interactables.some((p) => p.kind === 'isekai_portal')
        ) {
          chunk.interactables.push({
            id: `isekai_portal_c${c}`,
            x: chunk.startX + 440,
            y: FLOOR_Y - 56,
            w: 34,
            h: 56,
            kind: 'isekai_portal',
            label: 'Dimensional Portal -> Isekai Solaris Town',
            dialogue: ['A swirling Dimensional Gate linking Bastera Citadel to Solaris Isekai Town!'],
            speaker: 'Dimensional Gate',
            activated: false,
          });
        }
        this.chunks.set(c, chunk);
        changed = true;
      }
    }
    for (const key of this.chunks.keys()) {
      if (key < minC - 1 || key > maxC + 1) {
        this.chunks.delete(key);
        changed = true;
      }
    }
    if (changed) {
      this.chunksDirty = true;
    }
  }

  private rebuildChunkCachesIfNeeded(): void {
    if (!this.chunksDirty) return;
    this.chunksDirty = false;
    this.cachedActiveChunks = Array.from(this.chunks.values());
    const plats: Platform[] = [];
    for (const ch of this.cachedActiveChunks) {
      for (const p of ch.platforms) {
        plats.push(p);
      }
    }
    this.cachedActivePlatforms = plats;
  }

  private getActiveChunks(): GeneratedChunk[] {
    this.rebuildChunkCachesIfNeeded();
    return this.cachedActiveChunks;
  }

  private getActivePlatforms(): Platform[] {
    this.rebuildChunkCachesIfNeeded();
    return this.cachedActivePlatforms;
  }

  private getActiveNearbyBoss(): ActiveBoss | null {
    for (const ch of this.chunks.values()) {
      if (ch.boss && !ch.boss.defeated) {
        if (Math.abs(this.player.x - ch.boss.x) < 280) {
          return ch.boss;
        }
      }
    }
    return null;
  }

  private completeBossEncounterProgress(): void {
    const res = recordBossFightProgress(this.bossesFoughtStreak);
    this.bossesFoughtStreak = res.nextStreak;
    if (res.triggeredCooldown) {
      this.bossCooldownSeconds = res.cooldownSeconds;
      this.showAnnouncement(
        `5 Bosses Fought! ${res.cooldownSeconds}s Boss Cooldown Active — No bosses for 1 minute!`,
      );
    }
  }

  private scaleLiveEnemiesOnLevelUp(prevLevel: number, nextLevel: number): void {
    if (nextLevel <= prevLevel) return;
    const prevMult = getMonsterLevelMultiplier(prevLevel);
    const nextMult = getMonsterLevelMultiplier(nextLevel);
    const ratio = nextMult / Math.max(0.1, prevMult);
    for (const ch of this.chunks.values()) {
      for (const en of ch.enemies) {
        if (en.state === 'ko') continue;
        en.maxHp = Math.max(en.maxHp + 1, Math.round(en.maxHp * ratio));
        en.hp = Math.min(en.maxHp, Math.max(en.hp + 1, Math.round(en.hp * ratio)));
      }
    }
  }

  private update(dt: number): void {
    this.simTime += dt;

    if (this.announcementTimer > 0) {
      this.announcementTimer = Math.max(0, this.announcementTimer - dt);
      if (this.announcementTimer === 0) {
        this.announcement = null;
        this.emitHud();
      }
    }

    if (this.secretCaptionTimer > 0) {
      this.secretCaptionTimer = Math.max(0, this.secretCaptionTimer - dt);
      if (this.secretCaptionTimer === 0) {
        this.secretCaption = null;
        this.emitHud();
      }
    }

    if (this.status === 'title') {
      this.titlePanX = (this.titlePanX + dt * 22) % 640;
      this.camX = this.titlePanX;
      this.updateAmbientMotes(dt);
      this.justPressed.clear();
      return;
    }

    if (this.status !== 'playing' || this.modalPaused) {
      this.justPressed.clear();
      return;
    }

    this.speedLineTimer = Math.max(0, this.speedLineTimer - dt);
    this.arenaSlowTimer = Math.max(0, this.arenaSlowTimer - dt);
    this.bossEncounterCooldown = Math.max(0, this.bossEncounterCooldown - dt);
    const prevBossCdCeil = Math.ceil(this.bossCooldownSeconds);
    this.bossCooldownSeconds = Math.max(0, this.bossCooldownSeconds - dt);
    if (prevBossCdCeil > 0 && Math.ceil(this.bossCooldownSeconds) === 0) {
      this.showAnnouncement('Boss Cooldown Expired — Bosses may challenge you again!');
    }
    this.encounterFlashTimer = Math.max(0, this.encounterFlashTimer - dt);
    this.guestBossWarnCooldown = Math.max(0, this.guestBossWarnCooldown - dt);
    this.updateAmbientMotes(dt);

    // Trauma shake decay in real dt
    this.trauma = Math.max(0, this.trauma - dt * 2.4);

    if (this.activeCastBannerTimer > 0) {
      this.activeCastBannerTimer = Math.max(0, this.activeCastBannerTimer - dt);
      if (this.activeCastBannerTimer === 0) {
        this.activeCastBanner = null;
      }
    }

    // Short animated Caravan Ride pause before dropping outside the dungeon hole or returning to town
    if (this.caravanRide) {
      this.clearAllInputs(true);
      this.caravanRide.timer = Math.max(0, this.caravanRide.timer - dt);
      if (this.caravanRide.timer <= 0) {
        const done = this.caravanRide;
        this.caravanRide = null;
        this.completeCaravanRide(done);
      } else {
        this.emitHud();
      }
      this.justPressed.clear();
      return;
    }

    // Royal S-Rank Coronation Cutscene overrides world movement until complete
    if (this.coronationCutscene) {
      this.clearAllInputs(true);
      this.coronationCutscene.timer = Math.max(0, this.coronationCutscene.timer - dt);
      if (this.coronationCutscene.timer <= 0) {
        this.coronationCutscene = null;
        this.crownUnlocked = true;
        this.player.customization.crownEquipped = true;
        this.guildRank = 'S';
        this.isekaiCompleted = true;
        this.enterIsekaiRoom('isekai_town', 310);
        gameAudio.playSecretFound();
        this.showSecretCaption(
          'CROWNED ROYALTY · S-RANK SOVEREIGN!',
          'You defeated all 3 Demon Kings and ascended to Royalty! All of Solaris Town celebrates your name!',
        );
        this.openDialogue('King Solaris & Princess Aurelia', 'throne', '#fbbf24', [
          'Kneel no longer, Hero! By the Golden Sovereign Crown, you are now S-Rank Royalty of our Kingdom!',
          'The townsfolk cheer across every cobblestone street! You may wear or store your Royal Crown anytime in the Wardrobe Shop!',
        ]);
        void this.saveCurrentGame('autosave', true);
      } else {
        this.emitHud();
      }
      this.justPressed.clear();
      return;
    }

    // Elf Kingdom Dinner Party / Coronation Visual-Novel Cutscene freezes movement until dismissed
    if (this.elfCutscene) {
      this.clearAllInputs(true);
      this.updateParticles(dt);
      this.emitHud();
      this.justPressed.clear();
      return;
    }

    // Mega Boss / Gyro Zeppeli Glitch-Crash Cutscene spawns real-time Citadel fight when finished (no Pokemon combat!)
    if (this.megaCutscene) {
      this.clearAllInputs(true);
      this.megaCutscene.timer = Math.max(0, this.megaCutscene.timer - dt);
      if (this.megaCutscene.timer <= 0) {
        const pending = this.megaCutscene.pendingBoss;
        this.megaCutscene = null;
        pending.state = 'idle';
        pending.stateTimer = 0.35;
        pending.ramCooldown = 3.3;
        pending.barrageCooldown = 4.8;
        pending.burstPunchCooldown = 1.0;
        pending.burstHitStreak = 0;
        pending.skillPhase = 'none';
        const chunkIdx = Math.max(1, Math.floor(pending.x / CHUNK_WIDTH));
        const targetChunk = this.chunks.get(chunkIdx) ?? this.chunks.get(this.getCurrentChunkIndex());
        if (targetChunk) {
          targetChunk.boss = pending;
          this.chunksDirty = true;
        }
        this.encounterFlashTimer = 0.28;
        this.speedLineTimer = 0.65;
        gameAudio.playBattleEncounterStinger();
        gameAudio.startMusic(this.getCurrentBiome(), pending.def, this.realm);
        this.showAnnouncement(`⚔ REAL-TIME BREACH: ${pending.def.name} attacks!`);
        this.emitHud(true);
      } else {
        this.emitHud();
      }
      this.justPressed.clear();
      return;
    }

    // Ensure no legacy turn-based Pokemon bossBattle ever blocks Citadel play
    if (this.bossBattle) {
      this.bossBattle = null;
    }

    // Freeze action while below-B dungeon cleared choice modal is open
    if (this.dungeonChoicePending) {
      this.clearAllInputs(true);
      this.updateParticles(dt);
      this.justPressed.clear();
      return;
    }

    // Chunk 6 Bridge Slip & Fall into Volcano Pit sequence (Citadel only)
    const bridgeEntryX = 6 * CHUNK_WIDTH + 54;
    if (
      this.realm === 'citadel' &&
      !this.volcanoBridgeFallTriggered &&
      this.player.x >= bridgeEntryX &&
      this.player.y >= FLOOR_Y - 64
    ) {
      this.volcanoBridgeFallTriggered = true;
      this.volcanoBridgeFallTimer = 1.75;
      this.clearAllInputs(true);
      this.player.vx = 24;
      this.player.vy = 110;
      const c6 = this.chunks.get(6);
      if (c6) {
        c6.platforms = c6.platforms.filter((p) => p.id !== 'bridge_6_slip');
        this.chunksDirty = true;
      }
      this.trauma = 0.65;
      this.spawnBurst(this.player.x + 8, this.player.y + 18, 20, '#fb923c');
      this.showAnnouncement('THE BRIDGE CRUMBLED! Slipping into the Volcano Pit!');
    }

    if (this.volcanoBridgeFallTimer > 0) {
      this.clearAllInputs(false);
      this.volcanoBridgeFallTimer = Math.max(0, this.volcanoBridgeFallTimer - dt);
      this.player.x += 24 * dt;
      this.player.y = Math.min(FLOOR_Y + 6, this.player.y + 72 * dt);
      if (Math.floor(this.simTime * 20) % 2 === 0) {
        this.spawnBurst(this.player.x + 8, this.player.y + 16, 4, '#f97316');
      }
      this.camX += (this.player.x - PIXEL_W * 0.34 - this.camX) * Math.min(1, 9 * dt);
      this.updateParticles(dt);
      if (this.volcanoBridgeFallTimer === 0) {
        this.player.x = 6 * CHUNK_WIDTH + 215;
        this.player.y = FLOOR_Y - this.player.h;
        this.clearAllInputs(true);
        this.player.hp = Math.max(1, this.player.hp - 10);
        this.trauma = 0.7;
        gameAudio.playHit(true);
        this.showSecretCaption(
          'VOLCANO HELL CITADEL',
          'You slipped off the bridge and plunged into the molten volcanic abyss! Survive 5 Volcanic Bosses!',
        );
        this.openDialogue(
          'Warrior',
          'warrior',
          '#fb923c',
          [
            'Of course the castle bridge dropped me straight into a boiling volcano pit. My armor boots are smoking!',
            'Brace yourself — 5 Volcanic Bosses rule these basalt halls!',
          ],
        );
      }
      this.justPressed.clear();
      return;
    }

    // Dialogue typewriter progression (no TTS/voice anywhere; subtle chip blips for non-boss)
    if (this.dialogue) {
      const line = this.dialogue.lines[this.dialogue.lineIndex] || '';
      if (this.dialogue.charIndex < line.length) {
        this.dialogue.charTimer += dt;
        while (this.dialogue.charTimer >= 0.022 && this.dialogue.charIndex < line.length) {
          this.dialogue.charTimer -= 0.022;
          const ch = line.charCodeAt(this.dialogue.charIndex);
          this.dialogue.charIndex += 1;
          if (this.dialogue.charIndex % 2 === 1 && this.dialogue.portraitKind !== 'boss') {
            gameAudio.playDialogueBlip(this.dialogue.portraitKind, ch);
          }
          this.emitHud();
        }
      }
    }

    // Sim-level hitstop freeze
    if (this.hitstopTimer > 0) {
      this.hitstopTimer = Math.max(0, this.hitstopTimer - dt);
      this.updateParticles(dt);
      this.justPressed.clear();
      return;
    }

    // Handle quick actions from keyboard
    if (this.justPressed.has('KeyF') || this.justPressed.has('KeyE')) {
      this.player.idleTimer = 0;
      if (this.dialogue) {
        this.advanceDialogue();
      } else {
        this.tryInteract();
      }
    }
    const arenaRoundLocked = this.isArenaRoundLocked();

    if (!arenaRoundLocked && (this.justPressed.has('KeyJ') || this.justPressed.has('KeyZ'))) {
      this.player.idleTimer = 0;
      if (this.simTime - this.lastDashInputTime <= 0.28) {
        this.executeSpinPokeDash();
      } else {
        this.lastSlashInputTime = this.simTime;
        if (startWeaponAttack(this.player)) {
          this.meleeHitIds.clear();
          gameAudio.playSwordSlash(this.player.equippedWeapon, this.player.comboStep);
        }
      }
    }
    if (!arenaRoundLocked && this.justPressed.has('Digit1')) {
      this.player.idleTimer = 0;
      this.executeSkill(0);
    }
    if (!arenaRoundLocked && this.justPressed.has('Digit2')) {
      this.player.idleTimer = 0;
      this.executeSkill(1);
    }
    if (!arenaRoundLocked && (this.justPressed.has('Digit3') || this.justPressed.has('KeyR'))) {
      this.player.idleTimer = 0;
      this.executeSkill(2);
    }
    if (!arenaRoundLocked && this.justPressed.has('KeyH')) {
      this.player.idleTimer = 0;
      this.useItem('crimson_vial');
    }

    // Bulletproof post-bossfight / Burst Crush grab lock window
    if (this.bossGrabLockTimer > 0) {
      this.bossGrabLockTimer = Math.max(0, this.bossGrabLockTimer - dt);
    }
    if (this.postBossInputLockTimer > 0) {
      this.postBossInputLockTimer = Math.max(0, this.postBossInputLockTimer - dt);
      this.clearAllInputs(true);
    } else if (
      !arenaRoundLocked &&
      this.bossGrabLockTimer <= 0 &&
      (this.justPressed.has('ShiftLeft') || this.justPressed.has('ShiftRight'))
    ) {
      this.performDash();
    }

    const inputLocked = this.postBossInputLockTimer > 0 || this.bossGrabLockTimer > 0 || arenaRoundLocked;
    const left =
      !inputLocked &&
      (this.heldKeys.has('ArrowLeft') || this.heldKeys.has('KeyA') || this.virtualInput.left);
    const right =
      !inputLocked &&
      (this.heldKeys.has('ArrowRight') || this.heldKeys.has('KeyD') || this.virtualInput.right);
    const jumpHeld =
      !inputLocked &&
      (this.heldKeys.has('Space') ||
        this.heldKeys.has('ArrowUp') ||
        this.heldKeys.has('KeyW') ||
        this.virtualInput.jumpHeld);
    const jumpJustPressed =
      !inputLocked &&
      (this.justPressed.has('Space') ||
        this.justPressed.has('ArrowUp') ||
        this.justPressed.has('KeyW'));

    const isIsekai = this.realm !== 'citadel';
    const activeChunks = isIsekai ? [] : this.getActiveChunks();
    const roomBounds = ISEKAI_ROOM_BOUNDS[this.realm];
    const allPlatforms = isIsekai
      ? this.realm === 'isekai_guild' && !canAccessGuildFloor2(this.guildRank)
        ? this.isekaiPlatforms.filter(
            (p) => !p.id.startsWith('guild_stair_') && p.id !== 'guild_floor2_deck',
          )
        : this.isekaiPlatforms
      : this.getActivePlatforms();

    const prevWalkCycle = this.player.walkCycle;
    const phys = stepPlayerPhysics(
      this.player,
      { left, right, jumpJustPressed, jumpHeld },
      allPlatforms,
      dt,
      roomBounds.minX,
    );
    if (this.arenaSlowTimer > 0) {
      this.player.vx *= 0.65;
    }
    if (isIsekai && this.player.x > roomBounds.maxX - this.player.w) {
      this.player.x = roomBounds.maxX - this.player.w;
      this.player.vx = 0;
    }
    if (
      this.player.onGround &&
      Math.abs(this.player.vx) > 14 &&
      Math.floor(prevWalkCycle / Math.PI) !== Math.floor(this.player.walkCycle / Math.PI)
    ) {
      const stepNum = Math.floor(this.player.walkCycle / Math.PI);
      gameAudio.playFootstep(this.getCurrentBiome(), stepNum);
      this.spawnBurst(this.player.x + 8, this.player.y + this.player.h, 2, isIsekai ? '#fef08a' : '#a3e635');
    }
    if (phys.jumped) {
      this.player.idleTimer = 0;
      gameAudio.playJump();
      this.spawnBurst(this.player.x + 8, this.player.y + this.player.h, 5, '#d97706');
    }
    if (phys.landed) {
      gameAudio.playFootstep(this.getCurrentBiome(), 0);
      this.spawnBurst(this.player.x + 8, this.player.y + this.player.h, 4, '#94a3b8');
    }

    // 2-minute Idle Portal transport check in Citadel!
    if (
      shouldIdleTriggerIsekai(
        this.realm,
        this.player.idleTimer,
        this.status === 'playing',
        Boolean(this.bossBattle || this.megaCutscene || this.coronationCutscene || this.elfCutscene || this.volcanoBridgeFallTimer > 0),
      )
    ) {
      this.enterIsekaiTown('idle');
      this.justPressed.clear();
      return;
    }

    // Update sword/Steel Ball attack phases & active JJBA Stands (Star Platinum, Chili Pepper, Dinostand, Summon FX)
    this.stepAttackPhase(dt, activeChunks);
    if (this.standSummonFx) {
      this.standSummonFx.timer = Math.max(0, this.standSummonFx.timer - dt);
      if (this.standSummonFx.timer <= 0) this.standSummonFx = null;
    }
    if (this.resolveBonusTimer > 0) {
      this.resolveBonusTimer = Math.max(0, this.resolveBonusTimer - dt);
    }
    if (this.starPlatinumTimer > 0) {
      this.starPlatinumTimer = Math.max(0, this.starPlatinumTimer - dt);
      this.starPlatinumTickTimer -= dt;
      if (this.starPlatinumTickTimer <= 0) {
        this.starPlatinumTickTimer = 0.18;
        this.resolveStarPlatinumTick(activeChunks);
      }
      if (this.starPlatinumTimer === 0) {
        this.emitHud();
      }
    }
    if (this.chiliPepperTimer > 0) {
      this.chiliPepperTimer = Math.max(0, this.chiliPepperTimer - dt);
      this.chiliPepperZapTimer -= dt;
      if (this.chiliPepperZapTimer <= 0) {
        this.chiliPepperZapTimer = 0.42;
        this.fireChiliPepperElectricBolt(activeChunks, false);
      }
      if (this.chiliPepperTimer === 0) {
        this.emitHud();
      }
    }
    if ((this.player.whiteAuraTimer ?? 0) > 0) {
      this.player.invulnTimer = Math.max(this.player.invulnTimer, this.player.whiteAuraTimer ?? 0);
      // Emit crisp upward leaking white aura wisps from pooled ring buffer (zero GC)
      for (let w = 0; w < 2; w++) {
        const p = this.particles[this.particleCursor];
        this.particleCursor = (this.particleCursor + 1) % this.particles.length;
        p.active = true;
        p.x = this.player.x + 2 + Math.random() * 12;
        p.y = this.player.y + 4 + Math.random() * 18;
        p.vx = (Math.random() - 0.5) * 26;
        p.vy = -48 - Math.random() * 44;
        p.maxLife = 0.24 + Math.random() * 0.16;
        p.life = p.maxLife;
        p.size = Math.random() > 0.45 ? 3 : 2;
        p.color = Math.random() > 0.3 ? '#ffffff' : '#e0f2fe';
      }
      if (Math.floor(this.simTime * 18) !== Math.floor((this.simTime - dt) * 18)) {
        this.spawnAfterimage('#ffffff');
      }
    }
    if ((this.player.standGuardTimer ?? 0) > 0) {
      this.standGuardTickTimer -= dt;
      if (this.standGuardTickTimer <= 0) {
        this.standGuardTickTimer = 0.16;
        this.resolveStandGuardTick(activeChunks);
      }
    }

    const frozen = this.player.chronoFreezeTimer > 0;

    if (isIsekai) {
      this.isekaiClockSeconds += dt;
      this.arenaCrowdHypeTimer = Math.max(0, this.arenaCrowdHypeTimer - dt);

      // Gentle Hot Spring passive soak when wading directly inside the steaming mineral pool!
      if (this.realm === 'isekai_town' && this.player.x >= 2630 && this.player.x <= 2762) {
        if (this.player.hp < this.player.maxHp) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 18 * dt);
        }
        this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 30 * dt);
        if ((this.player.hotSpringTimer ?? 0) <= 0) {
          this.soakHotSpring();
        }
      }

      // Walk straight into the Giant Rocky Dark Hole in the Dungeon Forest Exterior!
      if (this.realm === 'dungeon_exterior' && this.player.x >= 1018) {
        this.enterDungeonFromExterior();
        this.justPressed.clear();
        return;
      }

      // Stream endless sectors smoothly forward inside Goblin Dungeon & Demon Realm
      if (this.realm === 'goblin_dungeon' || this.realm === 'demon_realm') {
        const mId =
          this.activeMissionId ?? (this.realm === 'demon_realm' ? 'c_demon_vanguard' : 'f_goblin_warren');
        while (this.player.x > (this.dungeonGeneratedMaxSector - 1) * DUNGEON_SECTOR_WIDTH) {
          this.dungeonGeneratedMaxSector += 1;
          const sIdx = this.dungeonGeneratedMaxSector;
          this.isekaiPlatforms.push(...createDungeonSectorPlatforms(this.realm, sIdx));
          this.isekaiEnemies.push(
            ...createDungeonSectorEnemies(
              this.realm,
              mId,
              sIdx,
              this.dungeonDepth,
              this.player.bossesDefeated,
            ),
          );
          // Relocate the Abyssal Descent Gate every 3 sectors so players can also drop Depth anytime!
          const descendProp = this.isekaiInteractables.find((p) => p.kind === 'dungeon_descend_gate');
          if (descendProp && sIdx % 3 === 0) {
            descendProp.x = (sIdx + 1) * DUNGEON_SECTOR_WIDTH - 240;
          }
        }
      }

      const maxCam = Math.max(0, roomBounds.maxX - PIXEL_W);
      const targetCamX = Math.max(0, Math.min(maxCam, this.player.x - PIXEL_W * 0.34));
      this.camX += (targetCamX - this.camX) * Math.min(1, 9 * dt);

      // Every-20-minute Town Raid countdown & pending trigger when entering town
      if (!this.townRaid) {
        this.townRaidTimer = Math.max(0, this.townRaidTimer - dt);
        if (this.townRaidTimer <= 0) {
          this.townRaidTimer = TOWN_RAID_INTERVAL_SECONDS;
          if (this.realm === 'isekai_town') {
            this.triggerTownRaid();
          } else {
            this.pendingTownRaid = true;
          }
        }
      }
      if (this.realm === 'isekai_town' && this.pendingTownRaid && !this.townRaid) {
        this.pendingTownRaid = false;
        this.triggerTownRaid();
      }

      if (this.realm === 'isekai_town' && !this.townRaid) {
        const hasDamaged = this.townHouses.some((h) => h.broken || h.hp < h.maxHp);
        if (hasDamaged) {
          const rb = stepTownRebuildNpcs(this.isekaiNpcs, this.townHouses, dt);
          for (const doneIdx of rb.completedIndices) {
            const hSpec = this.townHouses[doneIdx];
            if (hSpec) {
              this.spawnBurst(hSpec.x + hSpec.w / 2, FLOOR_Y - 40, 16, '#22c55e');
              this.spawnFloatingText(hSpec.x + hSpec.w / 2, FLOOR_Y - 64, 'HOUSE REBUILT!', '#86efac');
            }
          }
          // Step remaining non-rebuilding NPCs (e.g. bar/onsen) normally
          stepIsekaiNpcs(
            this.isekaiNpcs.filter((n) => n.rebuildingHouseIndex == null),
            dt,
          );
        } else {
          stepTownRebuildNpcs(this.isekaiNpcs, this.townHouses, dt);
          stepIsekaiNpcs(this.isekaiNpcs, dt);
        }
      } else {
        stepIsekaiNpcs(this.isekaiNpcs, dt);
      }

      this.stepIsekaiCombat(dt, frozen);
      this.stepProjectiles(activeChunks, dt, frozen);
      this.updateParticles(dt);

      this.netSyncTimer += dt;
      if (this.netSyncTimer >= 0.085) {
        this.netSyncTimer = 0;
        this.sendMultiplayerState();
      }

      this.hudEmitTimer += dt;
      if (this.hudEmitTimer >= 0.1) {
        this.hudEmitTimer = 0;
        this.emitHud();
      }

      this.justPressed.clear();
      return;
    }

    // Check automatic triggers (floor pressure plates & checkpoints & Citadel Isekai Portal)
    this.checkPassiveTriggers(activeChunks);

    // Secret Dark Sanctum discovery behind Checkpoint 1
    if (this.player.x <= -32 && !this.darkSanctumDiscovered) {
      this.darkSanctumDiscovered = true;
      gameAudio.playSecretFound();
      this.spawnBurst(this.player.x + 8, this.player.y + 10, 18, '#fb923c');
      this.showSecretCaption(
        'SECRET DISCOVERED: DARK ABYSSAL SANCTUM',
        'You slipped behind Checkpoint 1 into the forgotten shadow vault!',
      );
    }

    // Stream chunks & update camera smoothly (allows panning into chunk -1 at x < 0)
    this.ensureChunksAround(this.player.x);
    const targetCamX = Math.max(-640, this.player.x - PIXEL_W * 0.34);
    this.camX += (targetCamX - this.camX) * Math.min(1, 9 * dt);

    // Update enemies, real-time JoJo Boss AI & ground-crack decals (no Pokemon turn-based combat!)
    this.stepEnemies(activeChunks, dt, frozen);
    if (this.bossCooldownSeconds <= 0) {
      this.stepBosses(activeChunks, dt, frozen);
    }
    for (let i = this.groundCracks.length - 1; i >= 0; i--) {
      this.groundCracks[i].life -= dt;
      if (this.groundCracks[i].life <= 0) {
        this.groundCracks.splice(i, 1);
      }
    }
    this.stepProjectiles(activeChunks, dt, frozen);
    this.updateParticles(dt);

    const nearbyBoss = this.getActiveNearbyBoss();
    if (nearbyBoss && !nearbyBoss.defeated && this.bossCooldownSeconds <= 0 && !canPlayerEngageBoss(this.worldRole)) {
      if (this.guestBossWarnCooldown <= 0 && Math.abs(this.player.x - nearbyBoss.x) < 165) {
        this.guestBossWarnCooldown = 3.5;
        this.showAnnouncement('Co-op Guest: Only the World Host can fight bosses!');
      }
    }

    gameAudio.startMusic(
      this.getCurrentBiome(),
      this.bossCooldownSeconds > 0 ? null : (nearbyBoss?.def ?? null),
      this.realm,
    );
    if (nearbyBoss && this.bossCooldownSeconds <= 0 && this.lastBossVoiceTriggered !== nearbyBoss.def.index) {
      this.lastBossVoiceTriggered = nearbyBoss.def.index;
      this.speedLineTimer = 0.55;
      if (!nearbyBoss.activeDialogue) {
        nearbyBoss.activeDialogue = `${nearbyBoss.def.name} [${nearbyBoss.def.standName}]: "${nearbyBoss.def.voiceLine}"`;
        nearbyBoss.activeDialogueTimer = 4.0;
      }
    }

    // Network multiplayer sync at ~12 Hz
    this.netSyncTimer += dt;
    if (this.netSyncTimer >= 0.085) {
      this.netSyncTimer = 0;
      this.sendMultiplayerState();
    }

    // Throttled HUD updates
    this.hudEmitTimer += dt;
    if (this.hudEmitTimer >= 0.1) {
      this.hudEmitTimer = 0;
      this.emitHud();
    }

    this.justPressed.clear();
  }

  private enterBossBattle(boss: ActiveBoss): void {
    this.dialogue = null;
    this.projectiles = [];
    this.clearAllInputs(true);
    this.player.attackPhase = 'none';
    this.player.walkCycle = 0;
    if (boss.def.isGyroBoss) {
      const exactPlayerAtk = calculateAttackDamage(this.player, 1, false);
      const updated = createGyroZeppeliBossDef(
        this.player.maxHp,
        exactPlayerAtk,
        this.player.bossesDefeated,
      );
      boss.def = updated;
      if (boss.hp === boss.maxHp || boss.maxHp < updated.maxHp) {
        boss.maxHp = updated.maxHp;
        boss.hp = updated.maxHp;
      }
    }
    this.encounterFlashTimer = 0.35;
    this.speedLineTimer = 0.65;
    this.bossBattle = createBossBattleState(boss);
    this.lastBossVoiceTriggered = boss.def.index;
    gameAudio.playBattleEncounterStinger();
    gameAudio.startMusic(this.getCurrentBiome(), boss.def, this.realm);
    this.emitHud(true);
  }

  private stepBossBattle(dt: number): void {
    const b = this.bossBattle;
    if (!b) return;

    this.clearAllInputs(true);

    b.phaseTimer = Math.max(0, b.phaseTimer - dt);
    const prog =
      b.phaseDuration > 0 ? Math.min(1, 1 - b.phaseTimer / b.phaseDuration) : 1;
    if (b.slashFx) {
      b.slashFx.progress = prog;
    }

    if (b.phaseTimer > 0) return;

    if (b.phase === 'intro') {
      b.phase = 'menu';
      b.slashFx = null;
      b.speaker = 'Battle';
      b.message = `What will Bastera Knight do against ${b.boss.def.name}?`;
      this.emitHud(true);
    } else if (b.phase === 'player_anim' || b.phase === 'potion_anim') {
      b.slashFx = null;
      if (b.pendingOutcome === 'victory') {
        b.phase = 'victory';
        b.phaseDuration = 1.45;
        b.phaseTimer = 1.45;
        b.speaker = b.boss.def.name;
        b.message = b.boss.def.defeatLine;
        this.trauma = 0.7;
        this.emitHud(true);
      } else {
        const turn = triggerBossCounterTurn(b, this.player);
        if (!turn.skippedByFreeze) {
          this.trauma = b.boss.def.isMegaBoss ? 0.8 : 0.55;
          const activeFx = (b as { slashFx: { style?: string } | null }).slashFx;
          if (b.boss.def.isMegaBoss && activeFx?.style) {
            gameAudio.playMegaSkillSfx(activeFx.style as MegaSkillAnimStyle);
          } else {
            gameAudio.playSlashClaw(true);
          }
          gameAudio.playHit(true);
        }
        this.emitHud(true);
      }
    } else if (b.phase === 'enemy_anim') {
      b.slashFx = null;
      if (b.pendingOutcome === 'defeat' || this.player.hp <= 0) {
        this.bossBattle = null;
        this.postBossInputLockTimer = 0.45;
        this.clearAllInputs(true);
        this.setStatus('gameover');
        return;
      }
      b.turnCount += 1;
      b.phase = 'menu';
      b.speaker = 'Battle';
      b.message = `Choose your action! (Fight, Potions, Retreat, or Escape)`;
      this.emitHud(true);
    } else if (b.phase === 'run_anim') {
      const bossX = b.boss.x;
      this.bossBattle = null;
      this.bossEncounterCooldown = 4.0;
      this.postBossInputLockTimer = 0.45;
      this.clearAllInputs(true);
      this.player.walkCycle = 0;
      this.player.x = Math.max(24, bossX - 210);
      this.player.y = FLOOR_Y - this.player.h - 4;
      this.camX = Math.max(-640, this.player.x - PIXEL_W * 0.34);
      this.completeBossEncounterProgress();
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
      if (this.bossCooldownSeconds <= 0) {
        this.showAnnouncement('Retreated safely to your Main Sanctuary Interface.');
      }
      this.emitHud(true);
      const cb = this.pendingSanctuaryCallback;
      this.pendingSanctuaryCallback = null;
      cb?.();
    } else if (b.phase === 'escape_anim') {
      this.bossBattle = null;
      this.postBossInputLockTimer = 0.45;
      this.clearAllInputs(true);
      this.player.walkCycle = 0;
      this.restartFromCheckpoint();
      this.completeBossEncounterProgress();
      if (this.bossCooldownSeconds <= 0) {
        this.showAnnouncement('Escaped safely back to last Checkpoint!');
      }
      this.emitHud(true);
    } else if (b.phase === 'victory') {
      const defeatedBoss = b.boss;
      this.bossBattle = null;
      this.postBossInputLockTimer = 0.45;
      this.clearAllInputs(true);
      this.player.attackPhase = 'none';
      this.player.walkCycle = 0;
      this.onBossDefeated(defeatedBoss);
      this.emitHud(true);
    }
  }

  private stepAttackPhase(dt: number, chunks: GeneratedChunk[]): void {
    if (this.player.attackPhase === 'none') return;
    this.player.attackTimer -= dt;
    const weapon = WEAPONS[this.player.equippedWeapon];

    if (this.player.attackPhase === 'windup' && this.player.attackTimer <= 0) {
      this.player.attackPhase = 'active';
      const activeDur =
        this.player.comboStep === 3
          ? 0.21
          : this.player.comboStep === 2
            ? 0.18
            : Math.max(0.15, weapon.active);
      this.player.attackTimer = activeDur;
      this.player.comboSubStep = 0;
      this.player.comboSubTimer = this.player.comboStep === 2 ? 0.09 : activeDur / 3;
      const isGyroStand =
        (this.player.equippedStand ?? 'star_platinum') === 'gyro_ball' &&
        (this.player.dinoFormTimer ?? 0) <= 0;

      if (isGyroStand) {
        // Gyro Steel Ball Stand replaces sword strike with a fast, large boomerang Steel Ball!
        this.meleeHitIds.clear();
        this.projectiles.push({
          id: `gb_${this.simTime}_${Math.random()}`,
          x: this.player.x + (this.player.facing === 1 ? 20 : -4),
          y: this.player.y + 12,
          vx: this.player.facing * 390,
          vy: 0,
          radius: 15,
          damage: this.getPlayerAttackDamage(1.05, false),
          fromPlayer: true,
          color: '#22c55e',
          life: 1.45,
          kind: 'gyro_ball',
          boomerangReturn: false,
          boomerangAge: 0,
          hitTargetIds: [],
        });
        this.spawnBurst(this.player.x + 8 + this.player.facing * 14, this.player.y + 12, 6, '#4ade80');
      } else {
        this.resolveMeleeHits(chunks, this.player.comboStep === 3 ? 0.82 : 1);

        // Weapons with ranged wave special fire crescent/beam projectiles!
        if (
          weapon.id === 'runeblade' ||
          weapon.id === 'katana' ||
          weapon.id === 'fire_sword' ||
          weapon.id === 'emerald_zephyr' ||
          weapon.id === 'solar_excalibur'
        ) {
          const isFireSword = weapon.id === 'fire_sword';
          this.projectiles.push({
            id: `sw_${this.simTime}`,
            x: this.player.x + (this.player.facing === 1 ? 20 : -4),
            y: this.player.y + 12,
            vx: this.player.facing * (isFireSword ? 265 : 250),
            vy: 0,
            radius: isFireSword || weapon.id === 'solar_excalibur' ? 10 : 8,
            damage: Math.round(this.getPlayerAttackDamage(isFireSword ? 0.85 : 0.72)),
            fromPlayer: true,
            color: isFireSword ? '#fb923c' : weapon.accentColor,
            life: isFireSword ? 0.65 : 0.58,
            kind: isFireSword ? 'fireball' : 'slash_wave',
          });
        }
      }

      if (this.chiliPepperTimer > 0) {
        this.fireChiliPepperElectricBolt(chunks, true);
      }
    } else if (this.player.attackPhase === 'active') {
      this.player.comboSubTimer -= dt;
      if (this.player.isSpinDashAttack) {
        if (this.player.comboSubTimer <= 0) {
          this.player.comboSubTimer = 0.085;
          this.player.comboSubStep = (this.player.comboSubStep + 1) % 3;
          this.meleeHitIds.clear();
          this.spawnBurst(
            this.player.x + 8 + this.player.facing * 20,
            this.player.y + 12,
            6,
            '#6ee7b7',
          );
          this.resolveMeleeHits(chunks, 0.72);
        }
      } else {
        const maxSub = this.player.comboStep === 2 ? 1 : 2;
        if (this.player.comboSubTimer <= 0 && this.player.comboSubStep < maxSub) {
          this.player.comboSubStep += 1;
          this.player.comboSubTimer = this.player.comboStep === 2 ? 0.085 : 0.068;
          if (this.player.comboStep === 2 || this.player.comboStep === 3) {
            this.meleeHitIds.clear();
            gameAudio.playSwordSlash(this.player.equippedWeapon, this.player.comboStep);
            this.resolveMeleeHits(chunks, this.player.comboStep === 3 ? 0.78 : 0.9);
          }
        }
      }

      if (this.player.attackTimer <= 0) {
        this.player.isSpinDashAttack = false;
        this.player.attackPhase = 'recovery';
        this.player.attackTimer =
          this.player.comboStep === 3 ? weapon.recovery * 0.7 : weapon.recovery;
      }
    } else if (this.player.attackPhase === 'recovery' && this.player.attackTimer <= 0) {
      this.player.attackPhase = 'none';
      this.player.comboSubStep = 0;
    }
  }

  private applyWeaponSpecialEffectOnEnemy(
    en: EnemyState,
    dmg: number,
    isIsekai: boolean,
  ): void {
    const fx = WEAPONS[this.player.equippedWeapon].specialEffect;
    if (fx === 'none') return;
    if (fx === 'burn') {
      en.statusBurnTimer = 2.6;
      this.spawnBurst(en.x + en.w / 2, en.y + 8, 6, '#fb923c');
    } else if (fx === 'frost') {
      en.statusFrostTimer = 2.8;
      this.spawnBurst(en.x + en.w / 2, en.y + 8, 6, '#38bdf8');
    } else if (fx === 'venom') {
      en.statusVenomTimer = 3.2;
      this.spawnBurst(en.x + en.w / 2, en.y + 8, 6, '#84cc16');
    } else if (fx === 'lifesteal') {
      const heal = Math.max(2, Math.round(dmg * 0.15));
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
      this.spawnFloatingText(this.player.x + 8, this.player.y - 10, `+${heal} HP`, '#fb7185');
    } else if (fx === 'void_pull') {
      en.vx = -this.player.facing * 95;
      this.spawnBurst(en.x + en.w / 2, en.y + 10, 6, '#a78bfa');
    } else if (fx === 'lightning') {
      const pool = isIsekai
        ? this.isekaiEnemies
        : this.getActiveChunks().flatMap((c) => c.enemies);
      const chain = pool.find(
        (o) => o.id !== en.id && o.state !== 'ko' && Math.abs(o.x - en.x) <= 110,
      );
      if (chain) {
        const arcDmg = Math.max(4, Math.round(dmg * 0.45));
        const res = applyDamageToEnemy(chain, arcDmg, this.player.facing * 40);
        this.spawnFloatingText(chain.x + chain.w / 2, chain.y - 10, `⚡${arcDmg}`, '#facc15');
        this.spawnBurst(chain.x + chain.w / 2, chain.y + 10, 8, '#facc15');
        if (res.killed) {
          if (isIsekai) this.onIsekaiEnemyKilled(chain);
          else this.onEnemyKilled(chain);
        }
      }
    } else if (fx === 'seismic') {
      this.trauma = Math.min(1, this.trauma + 0.15);
      this.spawnBurst(en.x + en.w / 2, en.y + en.h, 8, '#dc2626');
    }
  }

  private getPlayerAttackDamage(skillMult = 1, isSkill = false): number {
    const base = calculateAttackDamage(this.player, skillMult, isSkill);
    const rankBonus = 1 + getRaiderRankDef(this.raiderRank).atkBonusPct / 100;
    return Math.round(base * rankBonus);
  }

  private resolveMeleeHits(
    chunks: GeneratedChunk[],
    skillMult: number,
    isSkill = false,
  ): void {
    const hb = computeWeaponHitbox(this.player);
    const dmg = this.getPlayerAttackDamage(skillMult, isSkill);
    const weapon = WEAPONS[this.player.equippedWeapon];
    const kb = weapon.knockback * this.player.facing;
    let landedHit = false;

    for (const ch of chunks) {
      // Breakable cracked walls hiding secret passages!
      for (const prop of ch.interactables) {
        if (
          prop.kind === 'broken_brick' &&
          !prop.activated &&
          prop.secretId &&
          rectsOverlap(hb.x, hb.y, hb.w, hb.h, prop.x, prop.y, prop.w, prop.h)
        ) {
          this.activateInteractable(prop, ch);
          landedHit = true;
        }
      }

      for (const en of ch.enemies) {
        if (en.state === 'ko' || (!isSkill && this.meleeHitIds.has(en.id))) continue;
        if (rectsOverlap(hb.x, hb.y, hb.w, hb.h, en.x, en.y, en.w, en.h)) {
          if (!isSkill) this.meleeHitIds.add(en.id);
          const res = applyDamageToEnemy(en, dmg, kb);
          this.spawnFloatingText(en.x + en.w / 2, en.y - 4, `${dmg}`, '#fde047');
          this.spawnBurst(en.x + en.w / 2, en.y + 10, 10, weapon.accentColor);
          landedHit = true;
          if (!res.killed && !isSkill) {
            this.applyWeaponSpecialEffectOnEnemy(en, dmg, false);
          } else if (res.killed) {
            this.onEnemyKilled(en);
          }
        }
      }

      if (ch.boss && !ch.boss.defeated) {
        const b = ch.boss;
        const bKey = `boss_${b.def.index}`;
        if ((isSkill || !this.meleeHitIds.has(bKey)) && rectsOverlap(hb.x, hb.y, hb.w, hb.h, b.x, b.y, b.w, b.h)) {
          if (!canPlayerEngageBoss(this.worldRole)) {
            if (this.guestBossWarnCooldown <= 0) {
              this.guestBossWarnCooldown = 3.0;
              this.showAnnouncement('Co-op Guest: Only the World Host can fight bosses!');
            }
          } else {
            if (!isSkill) this.meleeHitIds.add(bKey);
            const isCrit =
              isSkill ||
              this.player.isSpinDashAttack ||
              this.player.comboStep === 3 ||
              (this.player.dinoFormTimer ?? 0) > 0 ||
              skillMult > 1;
            const res = applyDamageToBoss(b, dmg, kb);
            if (isCrit) {
              this.bossCritCount += 1;
            }
            this.spawnFloatingText(b.x + b.w / 2, b.y - 6, isCrit ? `CRIT! ${dmg}` : `${dmg}`, isCrit ? '#facc15' : '#fde047');
            this.spawnBurst(b.x + b.w / 2, b.y + 16, isCrit ? 18 : 14, b.def.auraColor);
            landedHit = true;
            if (weapon.specialEffect === 'lifesteal' && !isSkill) {
              const heal = Math.max(2, Math.round(dmg * 0.15));
              this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
            }
            if (res.defeatedNow) {
              this.onBossDefeated(b);
            }
          }
        }
      }
    }

    // Isekai real-time dungeon enemies & A-Rank Demon Kings
    for (const en of this.isekaiEnemies) {
      if (en.state === 'ko' || (!isSkill && this.meleeHitIds.has(en.id))) continue;
      if (rectsOverlap(hb.x, hb.y, hb.w, hb.h, en.x, en.y, en.w, en.h)) {
        if (!isSkill) this.meleeHitIds.add(en.id);
        const res = applyDamageToEnemy(en, dmg, kb);
        this.spawnFloatingText(en.x + en.w / 2, en.y - 4, `${dmg}`, '#fde047');
        this.spawnBurst(en.x + en.w / 2, en.y + 10, 10, weapon.accentColor);
        landedHit = true;
        if (!res.killed && !isSkill) {
          this.applyWeaponSpecialEffectOnEnemy(en, dmg, true);
        } else if (res.killed) {
          this.onIsekaiEnemyKilled(en);
        }
      }
    }

    for (const dk of this.demonKings) {
      if (
        dk.defeated ||
        dk.hp <= 0 ||
        dk.index !== this.activeDemonKingStage ||
        (!isSkill && this.meleeHitIds.has(dk.id))
      ) {
        continue;
      }
      if (rectsOverlap(hb.x, hb.y, hb.w, hb.h, dk.x, dk.y, dk.w, dk.h)) {
        if (!isSkill) this.meleeHitIds.add(dk.id);
        const dkDmg = dk.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
        this.damageDemonKing(dk, dkDmg, kb * 0.45);
        if (weapon.specialEffect === 'lifesteal' && !isSkill) {
          const heal = Math.max(2, Math.round(dkDmg * 0.15));
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
          this.spawnFloatingText(this.player.x + 8, this.player.y - 10, `+${heal} HP`, '#fb7185');
        }
        landedHit = true;
      }
    }

    if (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
      const raid = this.townRaid;
      const rKey = `raid_${raid.raiderId}`;
      if ((isSkill || !this.meleeHitIds.has(rKey)) && rectsOverlap(hb.x, hb.y, hb.w, hb.h, raid.x, raid.y, raid.w, raid.h)) {
        if (!isSkill) this.meleeHitIds.add(rKey);
        const rDmg = raid.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
        raid.hp = Math.max(0, raid.hp - rDmg);
        raid.hitFlash = 0.16;
        raid.vx = kb * 0.4;
        this.spawnFloatingText(raid.x + raid.w / 2, raid.y - 8, `${rDmg}`, '#fde047');
        this.spawnBurst(raid.x + raid.w / 2, raid.y + 18, 14, raid.raiderId === 'rimuru_tempest' ? '#38bdf8' : '#ef4444');
        if (weapon.specialEffect === 'lifesteal' && !isSkill) {
          const heal = Math.max(2, Math.round(rDmg * 0.15));
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
        }
        landedHit = true;
        if (raid.hp <= 0) {
          this.onTownRaidDefeated();
        }
      }
    }

    if (this.realm === 'dueling_arena' && this.arenaDuel && this.arenaDuel.hp > 0) {
      const duel = this.arenaDuel;
      const aKey = `arena_${duel.challengerId}`;
      if ((isSkill || !this.meleeHitIds.has(aKey)) && rectsOverlap(hb.x, hb.y, hb.w, hb.h, duel.x, duel.y, duel.w, duel.h)) {
        if (duel.invulnTimer > 0) {
          this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 14, 'DODGED!', '#cbd5e1');
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 14, 6, '#e2e8f0');
        } else {
          if (!isSkill) this.meleeHitIds.add(aKey);
          const rawDmg = duel.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
          const aDmg = duel.guardTimer > 0 ? Math.max(1, Math.round(rawDmg * 0.3)) : rawDmg;
          duel.hp = Math.max(0, duel.hp - aDmg);
          duel.hitFlash = 0.16;
          duel.vx = kb * (duel.guardTimer > 0 ? 0.2 : 0.55);
          this.arenaCrowdHypeTimer = 0.85;
          this.spawnFloatingText(
            duel.x + duel.w / 2,
            duel.y - 6,
            duel.guardTimer > 0 ? `GUARD ${aDmg}` : `${aDmg}`,
            duel.guardTimer > 0 ? '#38bdf8' : '#fde047',
          );
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 16, 14, duel.def.auraColor);
          if (weapon.specialEffect === 'lifesteal' && !isSkill) {
            const heal = Math.max(2, Math.round(aDmg * 0.15));
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
          }
          landedHit = true;
          if (duel.hp <= 0) {
            this.handleArenaRoundEnd('player');
          }
        }
      }
    }

    if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
      const rb = this.raiderDemonicBoss;
      const rbKey = `raider_boss_${rb.dungeonId}`;
      if ((isSkill || !this.meleeHitIds.has(rbKey)) && rectsOverlap(hb.x, hb.y, hb.w, hb.h, rb.x, rb.y, rb.w, rb.h)) {
        if (!isSkill) this.meleeHitIds.add(rbKey);
        rb.hp = Math.max(0, rb.hp - dmg);
        rb.hitFlash = 0.16;
        rb.vx = kb * 0.25;
        this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 10, `${dmg}`, '#fde047');
        this.spawnBurst(rb.x + rb.w / 2, rb.y + 22, 14, rb.auraColor);
        if (weapon.specialEffect === 'lifesteal' && !isSkill) {
          const heal = Math.max(2, Math.round(dmg * 0.15));
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
        }
        landedHit = true;
        if (rb.hp <= 0) {
          this.completeRaiderDungeonVictory();
        }
      }
    }

    if (landedHit) {
      this.hitstopTimer = 0.04;
      this.trauma = Math.min(1, this.trauma + 0.32);
      gameAudio.playHit(skillMult > 1);
      this.emitHud();
    }
  }

  private executeSkill(slotIndex: 0 | 1 | 2): void {
    const targetSkillId = this.player.skillSlots[slotIndex];
    if (targetSkillId === 'stand_rush') {
      if (this.simTime - this.lastStandTapTime <= 0.55 && activateStandGuard(this.player)) {
        this.lastStandTapTime = -10;
        this.standGuardTickTimer = 0.14;
        this.trauma = Math.min(1, this.trauma + 0.35);
        gameAudio.playSkill('stand_rush');
        gameAudio.playHit(false);
        this.spawnBurst(this.player.x + 8, this.player.y + 12, 24, '#f0abfc');
        this.spawnFloatingText(this.player.x + 8, this.player.y - 18, 'STAND GUARD COUNTER!', '#f0abfc');
        this.resolveStandGuardTick(this.realm === 'citadel' ? this.getActiveChunks() : []);
        this.emitHud(true);
        return;
      }
      this.lastStandTapTime = this.simTime;
    }

    const res = triggerSkillSlot(this.player, slotIndex);
    if (!res.ok) return;
    const skill = SKILLS[res.skillId];
    gameAudio.playSkill(res.skillId);
    this.spawnBurst(this.player.x + 8, this.player.y + 12, 14, skill.color);

    const chunks = this.realm === 'citadel' ? this.getActiveChunks() : [];

    if (res.skillId === 'blade_dash') {
      this.player.vx = this.player.facing * 465;
      this.player.invulnTimer = 0.48;
      this.spawnAfterimage('#fbbf24');
      this.speedLineTimer = 0.35;
      this.resolveMeleeHits(chunks, skill.damageMultiplier, true);
    } else if (res.skillId === 'parry_guard') {
      this.player.parryTimer = 0.5;
      this.player.invulnTimer = 0.25;
      this.spawnFloatingText(this.player.x + 8, this.player.y - 8, 'PARRY!', '#fbbf24');
    } else if (res.skillId === 'candlefire_wave') {
      this.spawnAfterimage('#f97316');
      this.projectiles.push({
        id: `cf_${this.simTime}`,
        x: this.player.x + (this.player.facing === 1 ? 18 : -4),
        y: this.player.y + 12,
        vx: this.player.facing * 260,
        vy: 0,
        radius: 9,
        damage: this.getPlayerAttackDamage(skill.damageMultiplier, true),
        fromPlayer: true,
        color: '#f97316',
        life: 1.1,
        kind: 'fireball',
      });
    } else if (res.skillId === 'chrono_freeze') {
      this.player.chronoFreezeTimer = 2.4;
      this.speedLineTimer = 0.45;
      this.trauma = Math.min(1, this.trauma + 0.45);
      this.spawnFloatingText(this.player.x + 8, this.player.y - 12, 'TOKI WO TOMARE!', '#34d399');
    } else if (res.skillId === 'stand_rush') {
      this.executeEquippedStandSkill(chunks);
    } else if (res.skillId === 'sunburst_cleave') {
      this.trauma = Math.min(1, this.trauma + 0.45);
      this.speedLineTimer = 0.35;
      this.spawnBurst(this.player.x + 8, this.player.y + 12, 24, '#fde047');
      this.resolveMeleeHits(chunks, skill.damageMultiplier, true);
    }
    this.emitHud();
  }

  private fireChiliPepperElectricBolt(chunks: GeneratedChunk[], synchronizedWithAttack: boolean): void {
    const px = this.player.x + 8;
    const py = this.player.y + 10;
    let dirX = this.player.facing;
    let dirY = 0;

    if (!synchronizedWithAttack) {
      // Aim autonomously at nearest active target within 340px
      let bestDist = 340;
      let tx: number | null = null;
      let ty: number | null = null;
      const checkCandidate = (cx: number, cy: number) => {
        const d = Math.hypot(cx - px, cy - py);
        if (d < bestDist) {
          bestDist = d;
          tx = cx;
          ty = cy;
        }
      };
      for (const ch of chunks) {
        for (const en of ch.enemies) if (en.state !== 'ko') checkCandidate(en.x + en.w / 2, en.y + en.h / 2);
        if (ch.boss && !ch.boss.defeated) checkCandidate(ch.boss.x + ch.boss.w / 2, ch.boss.y + ch.boss.h / 2);
      }
      for (const en of this.isekaiEnemies) if (en.state !== 'ko') checkCandidate(en.x + en.w / 2, en.y + en.h / 2);
      for (const dk of this.demonKings) {
        if (!dk.defeated && dk.hp > 0 && dk.index === this.activeDemonKingStage) {
          checkCandidate(dk.x + dk.w / 2, dk.y + dk.h / 2);
        }
      }
      if (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
        checkCandidate(this.townRaid.x + this.townRaid.w / 2, this.townRaid.y + this.townRaid.h / 2);
      }
      if (this.realm === 'dueling_arena' && this.arenaDuel && this.arenaDuel.hp > 0) {
        checkCandidate(this.arenaDuel.x + this.arenaDuel.w / 2, this.arenaDuel.y + this.arenaDuel.h / 2);
      }
      if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
        checkCandidate(
          this.raiderDemonicBoss.x + this.raiderDemonicBoss.w / 2,
          this.raiderDemonicBoss.y + this.raiderDemonicBoss.h / 2,
        );
      }
      if (tx === null || ty === null) return;
      const len = Math.max(1, Math.hypot(tx - px, ty - py));
      dirX = (tx - px) / len;
      dirY = (ty - py) / len;
    }

    const boltDmg = Math.max(6, Math.round(this.getPlayerAttackDamage(synchronizedWithAttack ? 0.55 : 0.42, true)));
    this.projectiles.push({
      id: `cp_${this.simTime}_${Math.random()}`,
      x: px + this.player.facing * 10,
      y: py,
      vx: dirX * 365,
      vy: dirY * 365,
      radius: 7,
      damage: boltDmg,
      fromPlayer: true,
      color: '#facc15',
      life: 0.9,
      kind: 'rune',
    });
    this.spawnBurst(px - this.player.facing * 12, py - 4, 5, '#22d3ee');
  }

  private findNearestStandTarget(
    chunks: GeneratedChunk[],
    maxRange = 420,
  ): {
    kind: 'enemy' | 'isekai_enemy' | 'boss' | 'duel' | 'raid' | 'demon_king' | 'raider_boss';
    x: number;
    y: number;
    w: number;
    h: number;
    ref: EnemyState | ActiveBoss | ActiveArenaDuel | ActiveTownRaid | DemonKingEntity | RaiderDemonicBossEntity;
  } | null {
    const px = this.player.x + this.player.w / 2;
    let bestDist = maxRange;
    let best: {
      kind: 'enemy' | 'isekai_enemy' | 'boss' | 'duel' | 'raid' | 'demon_king' | 'raider_boss';
      x: number;
      y: number;
      w: number;
      h: number;
      ref: EnemyState | ActiveBoss | ActiveArenaDuel | ActiveTownRaid | DemonKingEntity | RaiderDemonicBossEntity;
    } | null = null;

    const consider = (
      kind: 'enemy' | 'isekai_enemy' | 'boss' | 'duel' | 'raid' | 'demon_king' | 'raider_boss',
      x: number,
      y: number,
      w: number,
      h: number,
      ref: EnemyState | ActiveBoss | ActiveArenaDuel | ActiveTownRaid | DemonKingEntity | RaiderDemonicBossEntity,
    ) => {
      const dist = Math.hypot(x + w / 2 - px, y + h / 2 - (this.player.y + this.player.h / 2));
      if (dist <= bestDist) {
        bestDist = dist;
        best = { kind, x, y, w, h, ref };
      }
    };

    for (const ch of chunks) {
      for (const en of ch.enemies) if (en.state !== 'ko') consider('enemy', en.x, en.y, en.w, en.h, en);
      if (ch.boss && !ch.boss.defeated && canPlayerEngageBoss(this.worldRole)) {
        consider('boss', ch.boss.x, ch.boss.y, ch.boss.w, ch.boss.h, ch.boss);
      }
    }
    for (const en of this.isekaiEnemies) if (en.state !== 'ko') consider('isekai_enemy', en.x, en.y, en.w, en.h, en);
    for (const dk of this.demonKings) {
      if (!dk.defeated && dk.hp > 0 && dk.index === this.activeDemonKingStage) {
        consider('demon_king', dk.x, dk.y, dk.w, dk.h, dk);
      }
    }
    if (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
      consider('raid', this.townRaid.x, this.townRaid.y, this.townRaid.w, this.townRaid.h, this.townRaid);
    }
    if (this.realm === 'dueling_arena' && this.arenaDuel && this.arenaDuel.hp > 0) {
      consider('duel', this.arenaDuel.x, this.arenaDuel.y, this.arenaDuel.w, this.arenaDuel.h, this.arenaDuel);
    }
    if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
      consider(
        'raider_boss',
        this.raiderDemonicBoss.x,
        this.raiderDemonicBoss.y,
        this.raiderDemonicBoss.w,
        this.raiderDemonicBoss.h,
        this.raiderDemonicBoss,
      );
    }
    return best;
  }

  private applyDirectStandHit(
    target: {
      kind: 'enemy' | 'isekai_enemy' | 'boss' | 'duel' | 'raid' | 'demon_king' | 'raider_boss';
      ref: EnemyState | ActiveBoss | ActiveArenaDuel | ActiveTownRaid | DemonKingEntity | RaiderDemonicBossEntity;
    },
    dmg: number,
    kb: number,
    stunSeconds: number,
    label: string,
    color: string,
  ): void {
    if (target.kind === 'enemy' || target.kind === 'isekai_enemy') {
      const en = target.ref as EnemyState;
      if (stunSeconds > 0) en.stunTimer = Math.max(en.stunTimer ?? 0, stunSeconds);
      const res = applyDamageToEnemy(en, dmg, kb);
      this.spawnFloatingText(en.x + en.w / 2, en.y - 10, label, color);
      if (res.killed) {
        if (target.kind === 'isekai_enemy') this.onIsekaiEnemyKilled(en);
        else this.onEnemyKilled(en);
      }
    } else if (target.kind === 'boss') {
      const b = target.ref as ActiveBoss;
      if (stunSeconds > 0) b.stunTimer = Math.max(b.stunTimer ?? 0, stunSeconds);
      const res = applyDamageToBoss(b, dmg, kb * 0.4);
      this.bossCritCount += 1;
      this.spawnFloatingText(b.x + b.w / 2, b.y - 12, label, color);
      if (res.defeatedNow) this.onBossDefeated(b);
    } else if (target.kind === 'duel') {
      const duel = target.ref as ActiveArenaDuel;
      if (stunSeconds > 0) duel.stunTimer = Math.max(duel.stunTimer, stunSeconds);
      duel.hp = Math.max(0, duel.hp - dmg);
      duel.hitFlash = 0.2;
      duel.vx = kb * 0.4;
      this.arenaCrowdHypeTimer = 1.0;
      this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 12, label, color);
      if (duel.hp <= 0) this.handleArenaRoundEnd('player');
    } else if (target.kind === 'raid') {
      const raid = target.ref as ActiveTownRaid;
      if (stunSeconds > 0) raid.stunTimer = Math.max(raid.stunTimer ?? 0, stunSeconds);
      raid.hp = Math.max(0, raid.hp - dmg);
      raid.hitFlash = 0.2;
      raid.vx = kb * 0.35;
      this.spawnFloatingText(raid.x + raid.w / 2, raid.y - 12, label, color);
      if (raid.hp <= 0) this.onTownRaidDefeated();
    } else if (target.kind === 'demon_king') {
      const dk = target.ref as DemonKingEntity;
      if (stunSeconds > 0) dk.stunTimer = Math.max(dk.stunTimer ?? 0, stunSeconds);
      this.damageDemonKing(dk, dmg, kb * 0.3);
    } else if (target.kind === 'raider_boss') {
      const rb = target.ref as RaiderDemonicBossEntity;
      if (stunSeconds > 0) rb.stunTimer = Math.max(rb.stunTimer, stunSeconds);
      rb.hp = Math.max(0, rb.hp - dmg);
      rb.hitFlash = 0.2;
      rb.vx = kb * 0.28;
      this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 14, label, color);
      if (rb.hp <= 0) this.completeRaiderDungeonVictory();
    }
  }

  private executeEquippedStandSkill(chunks: GeneratedChunk[]): void {
    const standId = this.player.equippedStand ?? 'star_platinum';
    const def = STANDS[standId];
    this.trauma = Math.min(1, this.trauma + 0.45);
    this.speedLineTimer = 0.55;
    this.spawnAfterimage(def.primaryColor);
    this.spawnBurst(this.player.x + 8, this.player.y + 12, 20, def.accentColor);

    if (standId === 'star_platinum') {
      this.starPlatinumTimer = 3.0;
      this.starPlatinumTickTimer = 0;
      this.spawnFloatingText(this.player.x + 8, this.player.y - 14, 'STAR PLATINUM: ORA!', '#c4b5fd');
      this.resolveStarPlatinumTick(chunks);
      return;
    }

    this.standSummonFx = { standId, timer: 1.25, facing: this.player.facing };

    if (standId === 'the_hand') {
      const target = this.findNearestStandTarget(chunks, 420);
      const destX = Math.max(24, this.player.x + this.player.facing * 38);
      this.spawnBurst(this.player.x + this.player.facing * 32, this.player.y + 10, 22, '#38bdf8');
      if (target) {
        if ('arenaMinX' in target.ref) {
          const b = target.ref as ActiveBoss;
          b.x = Math.max(b.arenaMinX, Math.min(b.arenaMaxX, destX));
        } else {
          target.ref.x = destX;
        }
        const dmg = Math.max(12, Math.round(calculateAttackDamage(this.player, 1.85, true)));
        this.applyDirectStandHit(target, dmg, this.player.facing * 40, 2.0, `THE HAND! ${dmg} (2s STUN)`, '#38bdf8');
        this.spawnBurst(destX + 10, this.player.y + 8, 18, '#e0f2fe');
      } else {
        this.spawnFloatingText(this.player.x + 8, this.player.y - 14, 'GAON! SPACE SCRAPE!', '#38bdf8');
      }
    } else if (standId === 'scary_monsters') {
      this.player.dinoFormTimer = 4.0;
      this.spawnBurst(this.player.x + 8, this.player.y + 12, 24, '#22c55e');
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, 'DINOSTAND · 4.0s!', '#4ade80');
    } else if (standId === 'chili_pepper') {
      this.chiliPepperTimer = 4.0;
      this.chiliPepperZapTimer = 0.05;
      this.spawnBurst(this.player.x + 8, this.player.y + 10, 22, '#facc15');
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, 'CHILI PEPPER · 4.0s!', '#fef08a');
    } else if (standId === 'gyro_ball') {
      const dmg = Math.max(10, Math.round(calculateAttackDamage(this.player, 1.25, true)));
      for (const vy of [-55, 0, 55]) {
        this.projectiles.push({
          id: `gb_bb_${this.simTime}_${vy}`,
          x: this.player.x + (this.player.facing === 1 ? 20 : -4),
          y: this.player.y + 12,
          vx: this.player.facing * 410,
          vy,
          radius: 15,
          damage: dmg,
          fromPlayer: true,
          color: '#22c55e',
          life: 1.55,
          kind: 'gyro_ball',
          boomerangReturn: false,
          boomerangAge: 0,
          hitTargetIds: [],
        });
      }
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, 'BALL BREAKER!', '#4ade80');
    } else if (standId === 'crazy_diamond') {
      const heal = Math.max(18, Math.round(this.player.maxHp * 0.28));
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, `DORARARA! +${heal} HP`, '#f472b6');
      this.spawnBurst(this.player.x + this.player.facing * 32, this.player.y + 10, 22, '#f472b6');
      this.resolveMeleeHits(chunks, 1.65, true);
    } else if (standId === 'killer_queen') {
      const dmg = Math.max(16, Math.round(calculateAttackDamage(this.player, 2.4, true)));
      this.projectiles.push({
        id: `kq_${this.simTime}_${Math.random()}`,
        x: this.player.x + (this.player.facing === 1 ? 20 : -4),
        y: this.player.y + 12,
        vx: this.player.facing * 290,
        vy: 0,
        radius: 11,
        damage: dmg,
        fromPlayer: true,
        color: '#f472b6',
        life: 1.4,
        kind: 'fireball',
      });
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, 'KILLER QUEEN: DETONATE!', '#f9a8d4');
    } else if (standId === 'golden_experience') {
      const heal = Math.max(15, Math.round(this.player.maxHp * 0.22));
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
      this.resolveBonusTimer = 5.0;
      this.player.damageBoostMultiplier = Math.max(this.player.damageBoostMultiplier, 1.3);
      this.player.damageBoostTimer = Math.max(this.player.damageBoostTimer, 5.0);
      const dmg = Math.max(12, Math.round(calculateAttackDamage(this.player, 1.55, true)));
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          id: `ge_${this.simTime}_${dir}`,
          x: this.player.x + 8,
          y: this.player.y + 12,
          vx: dir * 270,
          vy: 0,
          radius: 10,
          damage: dmg,
          fromPlayer: true,
          color: '#facc15',
          life: 0.9,
          kind: 'slash_wave',
        });
      }
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, `GOLD EXPERIENCE! +${heal} HP`, '#fde047');
    } else if (standId === 'king_crimson') {
      this.player.invulnTimer = Math.max(this.player.invulnTimer, 0.85);
      const target = this.findNearestStandTarget(chunks, 360);
      if (target) {
        this.player.x = Math.max(24, target.x + (this.player.facing === 1 ? target.w + 8 : -24));
        const dmg = Math.max(20, Math.round(calculateAttackDamage(this.player, 3.2, true)));
        this.applyDirectStandHit(target, dmg, this.player.facing * 140, 0.9, `EPITAPH CHOP! ${dmg}`, '#f43f5e');
      } else {
        this.player.x += this.player.facing * 95;
        this.resolveMeleeHits(chunks, 2.4, true);
      }
      this.spawnBurst(this.player.x + 8, this.player.y + 12, 24, '#e11d48');
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, 'KING CRIMSON!', '#fb7185');
    } else if (standId === 'silver_chariot') {
      const dmg = Math.max(7, Math.round(calculateAttackDamage(this.player, 0.72, true)));
      for (const vy of [-70, -35, 0, 35, 70]) {
        this.projectiles.push({
          id: `sc_${this.simTime}_${vy}`,
          x: this.player.x + (this.player.facing === 1 ? 18 : -4),
          y: this.player.y + 12,
          vx: this.player.facing * 420,
          vy,
          radius: 6,
          damage: dmg,
          fromPlayer: true,
          color: '#e2e8f0',
          life: 0.75,
          kind: 'slash_wave',
        });
      }
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, 'HORA HORA HORA!', '#e2e8f0');
    }
  }

  private resolveStarPlatinumTick(chunks: GeneratedChunk[]): void {
    const zoneW = 124;
    const zoneH = 76;
    const zoneX =
      this.player.facing === 1 ? this.player.x - 4 : this.player.x - zoneW + this.player.w + 4;
    const zoneY = this.player.y - 24;
    const dmg = Math.max(6, Math.round(this.getPlayerAttackDamage(0.52, true)));
    const kb = 48 * this.player.facing;
    let landedHit = false;

    const punchX = this.player.x + 8 + this.player.facing * 44;
    const punchY = this.player.y + 4 + (Math.random() - 0.5) * 26;
    this.spawnBurst(punchX, punchY, 7, '#c084fc');

    for (const ch of chunks) {
      for (const prop of ch.interactables) {
        if (
          prop.kind === 'broken_brick' &&
          !prop.activated &&
          prop.secretId &&
          rectsOverlap(zoneX, zoneY, zoneW, zoneH, prop.x, prop.y, prop.w, prop.h)
        ) {
          this.activateInteractable(prop, ch);
          landedHit = true;
        }
      }

      for (const en of ch.enemies) {
        if (en.state === 'ko') continue;
        if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, en.x, en.y, en.w, en.h)) {
          const res = applyDamageToEnemy(en, dmg, kb);
          this.spawnFloatingText(en.x + en.w / 2, en.y - 6, `ORA! ${dmg}`, '#d8b4fe');
          this.spawnBurst(en.x + en.w / 2, en.y + 10, 6, '#fbbf24');
          landedHit = true;
          if (res.killed) {
            this.onEnemyKilled(en);
          }
        }
      }

      if (ch.boss && !ch.boss.defeated && this.bossCooldownSeconds <= 0 && canPlayerEngageBoss(this.worldRole)) {
        const b = ch.boss;
        if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, b.x, b.y, b.w, b.h)) {
          const res = applyDamageToBoss(b, dmg, kb * 0.5);
          this.spawnFloatingText(b.x + b.w / 2, b.y - 8, `ORA! ${dmg}`, '#d8b4fe');
          this.spawnBurst(b.x + b.w / 2, b.y + 16, 8, '#fbbf24');
          landedHit = true;
          if (res.defeatedNow) {
            this.onBossDefeated(b);
          }
        }
      }
    }

    for (const en of this.isekaiEnemies) {
      if (en.state === 'ko') continue;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, en.x, en.y, en.w, en.h)) {
        const res = applyDamageToEnemy(en, dmg, kb);
        this.spawnFloatingText(en.x + en.w / 2, en.y - 6, `ORA! ${dmg}`, '#d8b4fe');
        this.spawnBurst(en.x + en.w / 2, en.y + 10, 6, '#fbbf24');
        landedHit = true;
        if (res.killed) {
          this.onIsekaiEnemyKilled(en);
        }
      }
    }

    for (const dk of this.demonKings) {
      if (dk.defeated || dk.hp <= 0 || dk.index !== this.activeDemonKingStage) continue;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, dk.x, dk.y, dk.w, dk.h)) {
        const dkDmg = dk.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
        this.damageDemonKing(dk, dkDmg, kb * 0.35);
        landedHit = true;
      }
    }

    if (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
      const raid = this.townRaid;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, raid.x, raid.y, raid.w, raid.h)) {
        const rDmg = raid.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
        raid.hp = Math.max(0, raid.hp - rDmg);
        raid.hitFlash = 0.14;
        raid.vx = kb * 0.35;
        this.spawnFloatingText(raid.x + raid.w / 2, raid.y - 8, `ORA! ${rDmg}`, '#d8b4fe');
        this.spawnBurst(raid.x + raid.w / 2, raid.y + 18, 8, '#fbbf24');
        landedHit = true;
        if (raid.hp <= 0) {
          this.onTownRaidDefeated();
        }
      }
    }

    if (this.realm === 'dueling_arena' && this.arenaDuel && this.arenaDuel.hp > 0) {
      const duel = this.arenaDuel;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, duel.x, duel.y, duel.w, duel.h)) {
        if (duel.invulnTimer > 0) {
          this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 12, 'DODGED!', '#cbd5e1');
        } else {
          const rawDmg = duel.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
          const aDmg = duel.guardTimer > 0 ? Math.max(1, Math.round(rawDmg * 0.3)) : rawDmg;
          duel.hp = Math.max(0, duel.hp - aDmg);
          duel.hitFlash = 0.14;
          duel.vx = kb * (duel.guardTimer > 0 ? 0.18 : 0.4);
          this.arenaCrowdHypeTimer = 0.75;
          this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 8, `ORA! ${aDmg}`, '#d8b4fe');
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 16, 8, '#fbbf24');
          landedHit = true;
          if (duel.hp <= 0) {
            this.handleArenaRoundEnd('player');
          }
        }
      }
    }

    if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
      const rb = this.raiderDemonicBoss;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, rb.x, rb.y, rb.w, rb.h)) {
        rb.hp = Math.max(0, rb.hp - dmg);
        rb.hitFlash = 0.14;
        rb.vx = kb * 0.22;
        this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 8, `ORA! ${dmg}`, '#d8b4fe');
        this.spawnBurst(rb.x + rb.w / 2, rb.y + 20, 10, '#fbbf24');
        landedHit = true;
        if (rb.hp <= 0) this.completeRaiderDungeonVictory();
      }
    }

    if (landedHit) {
      this.trauma = Math.min(1, this.trauma + 0.16);
      gameAudio.playHit(true);
      this.emitHud();
    }
  }

  private resolveStandGuardTick(chunks: GeneratedChunk[]): void {
    const zoneW = 220;
    const zoneH = 104;
    const zoneX =
      this.player.facing === 1 ? this.player.x - 44 : this.player.x + this.player.w + 44 - zoneW;
    const zoneY = this.player.y - 36;
    const dmg = Math.max(12, Math.round(this.getPlayerAttackDamage(1.15, true)));
    let landedHit = false;

    const standId = this.player.equippedStand ?? 'star_platinum';
    const standDef = STANDS[standId];
    this.standSummonFx = { standId, timer: 0.38, facing: this.player.facing };
    this.spawnBurst(this.player.x + 8 + this.player.facing * 32, this.player.y + 8, 7, standDef.accentColor);
    this.projectiles.push({
      id: `sg_wave_${this.simTime}_${Math.random()}`,
      x: this.player.x + 8 + this.player.facing * 16,
      y: this.player.y + 10,
      vx: this.player.facing * 350,
      vy: 0,
      radius: 9,
      damage: dmg,
      fromPlayer: true,
      color: standDef.accentColor,
      life: 0.34,
      kind: 'slash_wave',
    });

    for (const ch of chunks) {
      for (const en of ch.enemies) {
        if (en.state === 'ko') continue;
        if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, en.x, en.y, en.w, en.h)) {
          const kb = Math.sign(en.x + en.w / 2 - (this.player.x + 8) || this.player.facing) * 65;
          const res = applyDamageToEnemy(en, dmg, kb);
          this.spawnFloatingText(en.x + en.w / 2, en.y - 8, `GUARD! ${dmg}`, '#f0abfc');
          this.spawnBurst(en.x + en.w / 2, en.y + 10, 6, '#f0abfc');
          landedHit = true;
          if (res.killed) this.onEnemyKilled(en);
        }
      }
      if (ch.boss && !ch.boss.defeated && this.bossCooldownSeconds <= 0 && canPlayerEngageBoss(this.worldRole)) {
        const b = ch.boss;
        if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, b.x, b.y, b.w, b.h)) {
          const kb = Math.sign(b.x + b.w / 2 - (this.player.x + 8) || this.player.facing) * 32;
          const res = applyDamageToBoss(b, dmg, kb);
          this.spawnFloatingText(b.x + b.w / 2, b.y - 10, `GUARD! ${dmg}`, '#f0abfc');
          this.spawnBurst(b.x + b.w / 2, b.y + 16, 8, '#fbbf24');
          landedHit = true;
          if (res.defeatedNow) this.onBossDefeated(b);
        }
      }
    }

    for (const en of this.isekaiEnemies) {
      if (en.state === 'ko') continue;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, en.x, en.y, en.w, en.h)) {
        const kb = Math.sign(en.x + en.w / 2 - (this.player.x + 8) || this.player.facing) * 65;
        const res = applyDamageToEnemy(en, dmg, kb);
        this.spawnFloatingText(en.x + en.w / 2, en.y - 8, `GUARD! ${dmg}`, '#f0abfc');
        this.spawnBurst(en.x + en.w / 2, en.y + 10, 6, '#f0abfc');
        landedHit = true;
        if (res.killed) this.onIsekaiEnemyKilled(en);
      }
    }

    for (const dk of this.demonKings) {
      if (dk.defeated || dk.hp <= 0 || dk.index !== this.activeDemonKingStage) continue;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, dk.x, dk.y, dk.w, dk.h)) {
        const kb = Math.sign(dk.x + dk.w / 2 - (this.player.x + 8) || this.player.facing) * 28;
        const dkDmg = dk.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
        this.damageDemonKing(dk, dkDmg, kb);
        landedHit = true;
      }
    }

    if (this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
      const raid = this.townRaid;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, raid.x, raid.y, raid.w, raid.h)) {
        const kb = Math.sign(raid.x + raid.w / 2 - (this.player.x + 8) || this.player.facing) * 28;
        const rDmg = raid.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
        raid.hp = Math.max(0, raid.hp - rDmg);
        raid.hitFlash = 0.14;
        raid.vx = kb;
        this.spawnFloatingText(raid.x + raid.w / 2, raid.y - 8, `GUARD! ${rDmg}`, '#f0abfc');
        this.spawnBurst(raid.x + raid.w / 2, raid.y + 18, 8, '#fbbf24');
        landedHit = true;
        if (raid.hp <= 0) this.onTownRaidDefeated();
      }
    }

    if (this.realm === 'dueling_arena' && this.arenaDuel && this.arenaDuel.hp > 0) {
      const duel = this.arenaDuel;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, duel.x, duel.y, duel.w, duel.h)) {
        if (duel.invulnTimer > 0) {
          this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 12, 'DODGED!', '#cbd5e1');
        } else {
          const rawDmg = duel.windVulnerable ? Math.round(dmg * (1 + WIND_ORB_DAMAGE_BONUS)) : dmg;
          const aDmg = duel.guardTimer > 0 ? Math.max(1, Math.round(rawDmg * 0.3)) : rawDmg;
          duel.hp = Math.max(0, duel.hp - aDmg);
          duel.hitFlash = 0.14;
          duel.vx = Math.sign(duel.x + duel.w / 2 - (this.player.x + 8) || this.player.facing) * 35;
          this.arenaCrowdHypeTimer = 0.75;
          this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 8, `GUARD! ${aDmg}`, '#f0abfc');
          this.spawnBurst(duel.x + duel.w / 2, duel.y + 16, 8, '#fbbf24');
          landedHit = true;
          if (duel.hp <= 0) this.handleArenaRoundEnd('player');
        }
      }
    }

    if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
      const rb = this.raiderDemonicBoss;
      if (rectsOverlap(zoneX, zoneY, zoneW, zoneH, rb.x, rb.y, rb.w, rb.h)) {
        rb.hp = Math.max(0, rb.hp - dmg);
        rb.hitFlash = 0.14;
        rb.vx = Math.sign(rb.x + rb.w / 2 - (this.player.x + 8) || this.player.facing) * 28;
        this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 8, `GUARD! ${dmg}`, '#f0abfc');
        this.spawnBurst(rb.x + rb.w / 2, rb.y + 20, 8, '#fbbf24');
        landedHit = true;
        if (rb.hp <= 0) this.completeRaiderDungeonVictory();
      }
    }

    if (landedHit) {
      this.trauma = Math.min(1, this.trauma + 0.15);
      gameAudio.playHit(true);
      this.emitHud();
    }
  }

  private tryInteract(): void {
    if (this.realm !== 'citadel') {
      for (const prop of this.isekaiInteractables) {
        if (
          rectsOverlap(
            this.player.x - 14,
            this.player.y - 8,
            this.player.w + 28,
            this.player.h + 16,
            prop.x,
            prop.y,
            prop.w,
            prop.h,
          )
        ) {
          this.activateIsekaiInteractable(prop);
          return;
        }
      }
      for (const npc of this.isekaiNpcs) {
        if (Math.abs(this.player.x - npc.x) < 34) {
          const lines = this.crownUnlocked && npc.crownedDialogue ? npc.crownedDialogue : npc.dialogue;
          this.openDialogue(npc.name, 'npc', npc.coatColor, lines);
          return;
        }
      }
      return;
    }

    const chunks = this.getActiveChunks();
    for (const ch of chunks) {
      for (const prop of ch.interactables) {
        if (
          rectsOverlap(
            this.player.x - 10,
            this.player.y - 6,
            this.player.w + 20,
            this.player.h + 12,
            prop.x,
            prop.y,
            prop.w,
            prop.h,
          )
        ) {
          this.activateInteractable(prop, ch);
          return;
        }
      }
    }
  }

  private activateIsekaiInteractable(prop: InteractableProp): void {
    if (prop.kind === 'guild_door') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('isekai_guild', 72);
    } else if (prop.kind === 'potion_door') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('isekai_potion_shop', 72);
    } else if (prop.kind === 'wardrobe_door') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('isekai_wardrobe', 72);
    } else if (prop.kind === 'weapons_door') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('isekai_weapons_shop', 72);
    } else if (prop.kind === 'arena_door') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('dueling_arena', 180);
    } else if (prop.kind === 'arena_board') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenDuelingArena?.();
    } else if (prop.kind === 'stand_shrine') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenStandShrine?.();
    } else if (prop.kind === 'caravan_rider') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenCaravanRider?.();
    } else if (prop.kind === 'dungeon_hole') {
      this.enterDungeonFromExterior();
    } else if (prop.kind === 'dungeon_exit_rope') {
      this.exitDungeonToExterior();
    } else if (prop.kind === 'dungeon_descend_gate') {
      this.descendEndlessDepth();
    } else if (prop.kind === 'hot_spring') {
      this.soakHotSpring();
    } else if (prop.kind === 'fountain') {
      this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 15);
      gameAudio.playSecretFound();
      this.spawnBurst(prop.x + prop.w / 2, prop.y + 14, 16, '#7dd3fc');
      this.openDialogue(prop.speaker, 'npc', '#38bdf8', prop.dialogue);
      this.emitHud();
    } else if (prop.kind === 'citadel_portal') {
      gameAudio.playSecretFound();
      this.returnToCitadel();
    } else if (prop.kind === 'raider_guild_door') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('raider_guild', 90);
    } else if (prop.kind === 'raider_guild_desk') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenRaiderGuild?.();
    } else if (prop.kind === 'raider_floor_stairs') {
      this.ascendRaiderDungeonStairs();
    } else if (prop.kind === 'raider_dungeon_exit') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('raider_guild', 460);
    } else if (prop.kind === 'elf_herald') {
      this.elfKingdomInvited = true;
      if (this.elfKingdomStage === 'uninvited') {
        this.elfKingdomStage = 'invited';
      }
      gameAudio.playSecretFound();
      this.showSecretCaption(
        'ROYAL ELF KINGDOM INVITATION!',
        'Aethelgard’s Silver-Bough Banquet unlocked! Ride via Caravan Rider Vance to attend!',
      );
      this.openDialogue(prop.speaker, 'npc', '#34d399', [
        ...prop.dialogue,
        'Speak [F] to Caravan Rider Vance right beside the plaza fountain to travel to the Elf Kingdom of Aethelgard!',
      ]);
      void this.saveCurrentGame('autosave', true);
      this.emitHud(true);
    } else if (prop.kind === 'elf_caravan_return') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenCaravanRider?.();
    } else if (prop.kind === 'elf_banquet_table') {
      this.startElfDinnerPartyCutscene();
    } else if (prop.kind === 'elf_queen_dais') {
      if (this.elfKingdomStage === 'celebration') {
        this.openDialogue('Queen Sylvaria', 'throne', '#34d399', [
          'The Emerald Crown gleams brightly upon your brow, Hero of Aethelgard.',
          'May peace, Star-Wine, and sharp steel forever unite Solaris and our Silver-Bough realm!',
        ]);
      } else if (this.elfKingdomStage === 'ambush_active') {
        this.openDialogue('Queen Sylvaria', 'throne', '#fb7185', [
          'Cut down those eldritch horrors beside Sword Saint Kaelen before they reach the high dais!',
        ]);
      } else {
        this.openDialogue('Queen Sylvaria', 'throne', '#34d399', [
          'Welcome to Aethelgard, honored Knight! Step just left to the Grand Banquet Table and press [F] to begin tonight’s Royal Feast!',
        ]);
      }
    } else if (prop.kind === 'elf_swordsman_npc') {
      if (this.elfKingdomStage === 'celebration') {
        this.openDialogue('Sword Saint Kaelen', 'npc', '#34d399', [
          'Next time a horror tears through our marble floor, I expect you to save half the slaughter for me, Sovereign Knight.',
        ]);
      } else {
        this.openDialogue('Sword Saint Kaelen', 'npc', '#34d399', prop.dialogue);
      }
    } else if (prop.kind === 'town_exit_door') {
      gameAudio.playSecretFound();
      const targetX =
        this.realm === 'isekai_wardrobe'
          ? 886
          : this.realm === 'isekai_potion_shop'
            ? 622
            : this.realm === 'isekai_weapons_shop'
              ? 1180
              : this.realm === 'dueling_arena'
                ? 3260
                : this.realm === 'raider_guild'
                  ? 1365
                  : 340;
      this.enterIsekaiRoom('isekai_town', targetX);
    } else if (prop.kind === 'guild_reception') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenGuild?.(1);
    } else if (prop.kind === 'guild_stairs') {
      if (!canAccessGuildFloor2(this.guildRank)) {
        this.openDialogue('Guild Gatekeeper', 'npc', '#f43f5e', [
          `2nd Floor Access Restricted! Your current rank is ${this.guildRank}-Rank.`,
          'Complete Floor 1 Goblin & Demon Border missions until you reach B-Rank to unlock the Grand Staircase!',
        ]);
        return;
      }
      gameAudio.playSecretFound();
      if (this.player.y + this.player.h <= GUILD_FLOOR2_Y + 10) {
        this.player.x = 445;
        this.player.y = FLOOR_Y - this.player.h;
        this.showAnnouncement('Descended to Adventure Guild 1st Floor');
      } else {
        this.player.x = 556;
        this.player.y = GUILD_FLOOR2_Y - this.player.h;
        this.showAnnouncement('Ascended to Adventure Guild 2nd Floor Command!');
      }
      this.player.vx = 0;
      this.player.vy = 0;
      this.emitHud(true);
    } else if (prop.kind === 'guild_floor2_reception') {
      if (!canAccessGuildFloor2(this.guildRank)) {
        this.showAnnouncement('Requires B-Rank or higher for 2nd Floor Command!');
        return;
      }
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenGuild?.(2);
    } else if (prop.kind === 'wardrobe_counter') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenWardrobe?.();
    } else if (prop.kind === 'potion_counter') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenPotionShop?.();
    } else if (prop.kind === 'weapons_counter') {
      gameAudio.playSecretFound();
      this.uiCallbacks.onOpenWeaponsShop?.();
    } else if (prop.kind === 'guild_bar') {
      this.player.hp = this.player.maxHp;
      this.player.stamina = this.player.maxStamina;
      this.openDialogue(prop.speaker, 'npc', '#d97706', prop.dialogue);
      this.emitHud();
    } else if (prop.kind === 'town_gate_out') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('outskirts_forest', 96);
      this.showAnnouncement('Stepped beyond the Royal East Gate into Solaris Outskirts Forest!');
    } else if (prop.kind === 'outskirts_return_town') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('isekai_town', 3700);
      this.showAnnouncement('Returned through the Royal East Gate into Solaris Town!');
    } else if (prop.kind === 'outskirts_cave_entrance') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('outskirts_caves', 100);
      this.showAnnouncement('Descended into the Outskirts Crimson Caves!');
    } else if (prop.kind === 'outskirts_cave_exit') {
      gameAudio.playSecretFound();
      this.enterIsekaiRoom('outskirts_forest', 2160);
      this.showAnnouncement('Climbed back out into the Outskirts Forest!');
    } else if (prop.kind === 'side_quest_npc') {
      const quest = SIDE_QUESTS.find((q) => q.id === prop.sideQuestId);
      if (!quest) {
        this.openDialogue(prop.speaker, 'npc', '#fbbf24', prop.dialogue);
        return;
      }
      const prog = this.sideQuestProgress[quest.id] ?? {
        stage: 0,
        kills: 0,
        twistRevealed: false,
        bossSpawned: false,
        clueUncovered: false,
        chosenOptionIds: [],
        confronted: false,
      };
      this.sideQuestProgress[quest.id] = prog;
      if (this.uiCallbacks.onOpenSideQuestDialogue) {
        this.trackedSideQuestId = quest.id;
        this.spawnPendingSideQuestBossesInRealm();
        this.emitHud(true);
        this.uiCallbacks.onOpenSideQuestDialogue(quest.id);
        return;
      }
      if (prog.stage === 0) {
        prog.stage = 1;
        this.trackedSideQuestId = quest.id;
        gameAudio.playSecretFound();
        this.showSecretCaption(
          `SIDE QUEST ACCEPTED: ${quest.title.toUpperCase()}`,
          `${quest.hookSummary} Press [Q] anytime to inspect clues & rewards.`,
        );
        this.openDialogue(quest.giverName, 'npc', quest.coatColor, [
          ...quest.giverOpeningDialogue,
          `[QUEST #${quest.index} ACCEPTED] Open Side Quests [Q] to track targets & rewards.`,
        ]);
        this.spawnPendingSideQuestBossesInRealm();
        this.emitHud(true);
      } else if (prog.stage === 1 && !prog.twistRevealed) {
        this.trackedSideQuestId = quest.id;
        const zoneLabel = quest.targetRealm === 'outskirts_caves' ? 'Outskirts Caves' : 'Outskirts Forest';
        this.openDialogue(quest.giverName, 'npc', quest.coatColor, [
          `Have you hunted ${quest.twistTriggerKills} enemies in the ${zoneLabel} yet? (${prog.kills}/${quest.twistTriggerKills})`,
          'Hurry before the trail turns cold—or someone uncovers the wrong ledger!',
        ]);
        this.emitHud(true);
      } else if (prog.stage === 1 && prog.twistRevealed) {
        this.trackedSideQuestId = quest.id;
        const zoneLabel = quest.targetRealm === 'outskirts_caves' ? 'Outskirts Caves' : 'Outskirts Forest';
        this.openDialogue(quest.giverName, 'npc', quest.coatColor, [
          `What?! You found out?! Forget the story—${quest.bossName} is waiting for you in the ${zoneLabel}!`,
          'Either you silence them, or they silence you first!',
        ]);
        this.spawnPendingSideQuestBossesInRealm();
        this.emitHud(true);
      } else {
        this.openDialogue(quest.giverName, 'npc', quest.coatColor, [
          `So ${quest.bossName} is dead and you read every bloodied truth: ${quest.twistTitle.replace('PLOT TWIST: ', '')}...`,
          'Keep your mouth shut inside Solaris walls, Knight—our sins paid your gold in full.',
        ]);
      }
    } else {
      this.openDialogue(prop.label, 'npc', '#fbbf24', prop.dialogue);
    }
  }

  private checkPassiveTriggers(chunks: GeneratedChunk[]): void {
    for (const ch of chunks) {
      for (const prop of ch.interactables) {
        if (prop.kind === 'isekai_portal') {
          if (
            rectsOverlap(
              this.player.x,
              this.player.y,
              this.player.w,
              this.player.h,
              prop.x + 6,
              prop.y,
              Math.max(12, prop.w - 12),
              prop.h,
            )
          ) {
            this.enterIsekaiTown('gyro');
            return;
          }
          continue;
        }
        if (prop.activated) continue;
        if (
          (prop.kind === 'pressure_plate' || prop.kind === 'checkpoint') &&
          rectsOverlap(
            this.player.x,
            this.player.y,
            this.player.w,
            this.player.h,
            prop.x,
            prop.y - 6,
            prop.w,
            prop.h + 10,
          )
        ) {
          this.activateInteractable(prop, ch);
        }
      }
    }
  }

  private activateInteractable(prop: InteractableProp, chunk: GeneratedChunk): void {
    if (prop.kind === 'isekai_portal') {
      this.enterIsekaiTown('gyro');
      return;
    }

    if (prop.kind === 'escape_gate') {
      this.setStatus('victory');
      return;
    }

    if (prop.kind === 'checkpoint') {
      if (!prop.activated) {
        prop.activated = true;
        this.player.hp = this.player.maxHp;
        this.player.stamina = this.player.maxStamina;
        if (typeof prop.checkpointIndex === 'number' && prop.checkpointIndex >= this.player.highestCheckpointIndex) {
          this.player.highestCheckpointIndex = prop.checkpointIndex;
          this.player.highestCheckpointX = prop.x;
        }
        gameAudio.playSecretFound();
        this.spawnBurst(prop.x + 10, prop.y + 4, 16, '#38bdf8');
        this.openDialogue(prop.speaker, 'system', '#38bdf8', prop.dialogue);
      } else {
        this.player.hp = this.player.maxHp;
        this.showAnnouncement('Checkpoint warmth restored HP!');
      }
      this.emitHud();
      return;
    }

    if (prop.kind === 'chest') {
      if (prop.activated) {
        this.openDialogue('Empty Chest', 'system', '#94a3b8', [
          'Already looted. Stop shaking an empty wooden box.',
        ]);
        return;
      }
      prop.activated = true;
      this.openedChests.add(prop.id);
      this.player.gold += 35;
      if (prop.rewardItemId) {
        addInventoryResource(this.inventory, prop.rewardItemId, 1);
      }
      if (prop.rewardWeaponId && !this.player.unlockedWeapons.includes(prop.rewardWeaponId)) {
        this.player.unlockedWeapons.push(prop.rewardWeaponId);
      }
      if (prop.rewardWeaponId === 'fire_sword') {
        equipWeapon(this.player, 'fire_sword');
        this.spawnBurst(prop.x + 12, prop.y + 8, 28, '#fb923c');
        this.showSecretCaption(
          'OP SECRET WEAPON UNLOCKED: FIRE SWORD!',
          'Blazing crimson-orange greatsword auto-equipped — deals 2x TOTAL DAMAGE!',
        );
      }
      gameAudio.playSecretFound();
      this.spawnBurst(prop.x + 10, prop.y + 8, 18, '#fbbf24');
      this.openDialogue(prop.speaker, 'secret', '#fbbf24', prop.dialogue);
      this.emitHud();
      return;
    }

    // Secret passage triggers (cracked wall, lever, pressure plate, tapestry)
    if (prop.secretId && !prop.activated) {
      prop.activated = true;
      if (chunk.hiddenPassage && !chunk.hiddenPassage.discovered) {
        chunk.hiddenPassage.discovered = true;
        this.discoveredSecrets.add(chunk.hiddenPassage.id);
        this.player.secretsFound = clampSecretsCount(this.discoveredSecrets.size);
        this.player.gold += 25;
        addInventoryResource(
          this.inventory,
          chunk.biome === 'castle' ? 'royal_ember' : chunk.biome === 'forest' ? 'ruin_shard' : 'magma_core',
          1,
        );
        gameAudio.playSecretFound();
        this.spawnBurst(prop.x + 12, prop.y + 12, 20, '#fbbf24');
        this.sendMilestone('secret', `Secret #${chunk.hiddenPassage.index}`);
        this.showSecretCaption(
          `SECRET #${chunk.hiddenPassage.index} DISCOVERED!`,
          chunk.hiddenPassage.discoveryText,
        );
        this.openDialogue(prop.speaker, 'secret', '#fbbf24', [
          ...prop.dialogue,
          chunk.hiddenPassage.rewardText,
        ]);
        this.emitHud();
        return;
      }
    }

    // Lore objects (Thrones, Broken Bricks, etc.)
    this.openDialogue(
      prop.label,
      prop.kind === 'throne' ? 'throne' : 'warrior',
      '#fbbf24',
      prop.dialogue,
    );
  }

  private tryRollOrbDrop(x: number, y: number): void {
    const orbId = rollMonsterOrbDrop();
    if (!orbId) return;
    addInventoryResource(this.inventory, orbId, 1);
    const orbItem = this.inventory.find((i) => i.id === orbId);
    const orbColor = orbItem?.color ?? '#38bdf8';
    const orbLabel = orbItem ? orbItem.name.toUpperCase() : 'ELEMENTAL ORB';
    this.spawnBurst(x, y, 14, orbColor);
    this.spawnFloatingText(x, y - 32, `+1 ${orbLabel}!`, orbColor);
    this.showAnnouncement(`Orb Drop! Found ${orbItem?.name ?? orbId} (Use in Bossfights)!`);
    gameAudio.playSecretFound();
  }

  private onEnemyKilled(enemy: EnemyState): void {
    this.player.gold += enemy.rewardGold;
    const prevLevel = this.player.level;
    const pts = grantKillStatPoints(this.player, 'monster');
    this.scaleLiveEnemiesOnLevelUp(prevLevel, this.player.level);
    const resId =
      enemy.biome === 'castle'
        ? 'royal_ember'
        : enemy.biome === 'forest'
          ? 'ruin_shard'
          : 'magma_core';
    if (Math.random() < 0.45) {
      addInventoryResource(this.inventory, resId, 1);
    }
    if (Math.random() < 0.2) {
      addInventoryResource(this.inventory, 'crimson_vial', 1);
    }
    this.tryRollOrbDrop(enemy.x + enemy.w / 2, enemy.y);
    this.spawnFloatingText(enemy.x + enemy.w / 2, enemy.y - 12, `+${enemy.rewardGold}G`, '#fbbf24');
    this.spawnFloatingText(enemy.x + enemy.w / 2, enemy.y - 22, `+${pts} STAT PT`, '#38bdf8');
    this.emitHud();
  }

  private onIsekaiEnemyKilled(enemy: EnemyState): void {
    if (!this.foughtIsekaiEnemies.includes(enemy.archetype)) {
      this.foughtIsekaiEnemies.push(enemy.archetype);
    }
    const rankGoldBonus = 1 + getRaiderRankDef(this.raiderRank).goldBonusPct / 100;
    const goldEarned = Math.round(enemy.rewardGold * rankGoldBonus);
    this.player.gold += goldEarned;
    grantKillStatPoints(this.player, 'monster');
    this.isekaiKillsDone += 1;
    this.tryRollOrbDrop(enemy.x + enemy.w / 2, enemy.y);
    this.spawnFloatingText(enemy.x + enemy.w / 2, enemy.y - 12, `+${goldEarned}G`, '#fbbf24');

    if (enemy.sideQuestId) {
      const quest = SIDE_QUESTS.find((q) => q.id === enemy.sideQuestId);
      if (quest) {
        const prog = this.sideQuestProgress[quest.id] ?? {
          stage: 1,
          kills: quest.twistTriggerKills,
          twistRevealed: true,
          bossSpawned: true,
        };
        prog.stage = 3;
        prog.twistRevealed = true;
        prog.bossSpawned = true;
        this.sideQuestProgress[quest.id] = prog;
        this.player.statPoints += quest.rewardStatPoints;
        this.player.starStones = (this.player.starStones ?? 0) + quest.rewardStarStones;
        gameAudio.playSecretFound();
        this.spawnBurst(enemy.x + enemy.w / 2, enemy.y + 14, 26, '#fbbf24');
        this.showSecretCaption(
          `SIDE QUEST COMPLETE: ${quest.title.toUpperCase()}`,
          `+${quest.rewardGold}G · +${quest.rewardStatPoints} Stat Pts · +${quest.rewardStarStones} ★ Star Stones!`,
        );
        this.openDialogue(quest.bossName, 'boss', '#f43f5e', [
          quest.bossDefeatLine,
          `[QUEST #${quest.index} CLEARED] +${quest.rewardGold}G, +${quest.rewardStatPoints} Stat Pts & +${quest.rewardStarStones} ★ Star Stones earned!`,
        ]);
        if (this.trackedSideQuestId === quest.id) {
          const nextActive = SIDE_QUESTS.find((q) => (this.sideQuestProgress[q.id]?.stage ?? 0) === 1);
          this.trackedSideQuestId = nextActive ? nextActive.id : null;
        }
        void this.saveCurrentGame('autosave', true);
      }
      this.emitHud(true);
      return;
    }

    for (const q of SIDE_QUESTS) {
      const prog = this.sideQuestProgress[q.id];
      if (!prog || prog.stage !== 1 || prog.twistRevealed) continue;
      if (!isQuestTargetEnemyKill(q, this.realm, enemy)) continue;
      prog.kills += 1;
      if (prog.kills >= q.twistTriggerKills) {
        prog.twistRevealed = true;
        prog.bossSpawned = true;
        this.isekaiEnemies.push(createSideQuestBossEnemy(q, this.player.bossesDefeated));
        this.trauma = Math.max(this.trauma, 0.65);
        gameAudio.playMegaGlitchCrash();
        this.showSecretCaption(q.twistTitle, q.twistRevelation);
        this.openDialogue(q.twistTitle, 'secret', '#f43f5e', q.twistDialogue);
      }
    }

    this.emitHud();
  }

  private damageDemonKing(dk: DemonKingEntity, rawAmount: number, knockbackX: number): void {
    let rem = rawAmount;
    if ((dk.shieldHp ?? 0) > 0) {
      const absorbed = Math.min(dk.shieldHp ?? 0, rem);
      dk.shieldHp = Math.max(0, (dk.shieldHp ?? 0) - absorbed);
      rem -= absorbed;
      this.spawnFloatingText(dk.x + dk.w / 2, dk.y - 16, `SHIELD -${absorbed}`, '#38bdf8');
    }
    if (rem > 0) {
      dk.hp = Math.max(0, dk.hp - rem);
      this.spawnFloatingText(dk.x + dk.w / 2, dk.y - 6, `${rem}`, dk.auraColor);
    }
    dk.hitFlash = 0.16;
    if (knockbackX !== 0) dk.vx = knockbackX;
    this.spawnBurst(dk.x + dk.w / 2, dk.y + 18, 12, dk.auraColor);

    // Chrono Regression Card: SSS-Class Suicide Hunter Demon King rewinds once below 28% HP
    if (dk.specialAbility === 'chrono_rewind' && !dk.rewindUsed && dk.hp > 0 && dk.hp <= dk.maxHp * 0.28) {
      dk.rewindUsed = true;
      const heal = Math.round(dk.maxHp * 0.25);
      dk.hp = Math.min(dk.maxHp, dk.hp + heal);
      this.activeCastBanner = `${dk.name}: REGRESSION CARD (+${heal} HP)!`;
      this.activeCastBannerTimer = 2.0;
      this.spawnFloatingText(dk.x + dk.w / 2, dk.y - 18, `REWIND +${heal}`, '#fda4af');
      this.spawnBurst(dk.x + dk.w / 2, dk.y + 16, 18, '#f43f5e');
    }

    // Cast 1 signature Demon King skill automatically every 12% HP drop
    dk.lastSkillThresholdPct ??= 100;
    const dkHpPct = (dk.hp / Math.max(1, dk.maxHp)) * 100;
    if (dk.hp > 0 && dkHpPct <= dk.lastSkillThresholdPct - 12) {
      while (dk.lastSkillThresholdPct - 12 >= dkHpPct && dk.lastSkillThresholdPct > 0) {
        dk.lastSkillThresholdPct -= 12;
      }
      dk.castIndex += 1;
      const cast = createDemonKingPurpleFlameCast(dk, dk.castIndex, this.player.x, FLOOR_Y);
      this.purpleFlameZones.push(...cast.zones);
      this.projectiles.push(...cast.projectiles);
      this.activeCastBanner = `${cast.skillBanner} (12% RAGE!)`;
      this.activeCastBannerTimer = 1.9;
      gameAudio.playSkill('candlefire_wave');
      this.spawnFloatingText(dk.x + dk.w / 2, dk.y - 24, `${cast.skillBanner}!`, '#e879f9');
    }

    if (dk.hp <= 0) {
      dk.defeated = true;
      this.onDemonKingDefeated(dk);
    }
  }

  private onDemonKingDefeated(dk: DemonKingEntity): void {
    const totalStages = Math.max(3, this.demonKings.length);
    this.player.gold += totalStages > 3 ? 320 : 250;
    grantKillStatPoints(this.player, 'boss');
    this.isekaiKillsDone += 1;
    this.spawnBurst(dk.x + dk.w / 2, dk.y + dk.h / 2, 26, dk.auraColor || '#e879f9');
    this.showAnnouncement(`${dk.name} Vanquished! (${dk.index}/${totalStages})`);

    if (dk.index === this.activeDemonKingStage && this.activeDemonKingStage < totalStages) {
      const nextStage = this.activeDemonKingStage + 1;
      this.activeDemonKingStage = nextStage;
      const wave = createDemonKingStageMinions(nextStage, totalStages > 3);
      this.isekaiEnemies.push(...wave);
      for (const ally of this.alliedNpcs) {
        if (ally.hp > 0) {
          ally.hp = Math.min(ally.maxHp, ally.hp + 95);
        }
      }
      const nextKing = this.demonKings.find((k) => k.index === nextStage);
      this.showSecretCaption(
        `DEMON KING STAGE ${nextStage}/${totalStages} ARRIVES!`,
        `${nextKing?.name ?? 'Next Demon Monarch'} (${nextKing?.weaponName ?? nextKing?.title ?? ''}) summons ${nextKing?.companionName ?? 'companions'}!`,
      );
    }
    this.emitHud(true);
  }

  private onTownRaidDefeated(): void {
    const raid = this.townRaid;
    if (!raid) return;
    this.townRaid = null;
    this.townRaidRetreatTimer = 0;
    this.townRaidTimer = TOWN_RAID_INTERVAL_SECONDS;
    this.purpleFlameZones = [];
    this.projectiles = [];
    this.player.gold += TOWN_RAID_REWARD_GOLD;
    const promo = promoteGuildRankDirect(this.guildRank, this.inventory);
    this.guildRank = promo.nextRank;
    if (promo.nextRank === 'S' && !this.crownUnlocked) {
      this.crownUnlocked = true;
      this.player.customization.crownEquipped = true;
    }
    this.player.statPoints += 8;
    gameAudio.playSecretFound();
    this.spawnBurst(raid.x + raid.w / 2, raid.y + 20, 32, '#fbbf24');
    this.showSecretCaption(
      `TOWN RAID REPELLED: ${raid.name.toUpperCase()}!`,
      `+${TOWN_RAID_REWARD_GOLD}G, +8 Stat Pts & Rank Promoted to ${promo.nextRank}-Rank! Townsfolk are now gathering to rebuild broken houses!`,
    );
    void this.saveCurrentGame('autosave', true);
    this.emitHud(true);
  }

  private isArenaRoundLocked(): boolean {
    return this.realm === 'dueling_arena' && this.arenaDuel !== null && this.arenaDuel.roundPhase !== 'fighting';
  }

  private resetArenaRoundPositions(): void {
    const duel = this.arenaDuel;
    if (!duel) return;
    this.player.x = 190;
    this.player.y = FLOOR_Y - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.facing = 1;
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;
    this.player.invulnTimer = 0.25;
    this.player.attackPhase = 'none';
    this.player.attackTimer = 0;

    duel.x = 820;
    duel.y = FLOOR_Y - duel.h;
    duel.vx = 0;
    duel.vy = 0;
    duel.facing = -1;
    duel.hp = duel.maxHp;
    duel.state = 'idle';
    duel.stateTimer = 0.35;
    duel.attackCooldown = 0.7;
    duel.skillCooldown = 1.4;
    duel.domainActive = false;
    duel.domainTimer = 0;
    duel.domainCooldown = 5.5;
    duel.activeSkillBanner = null;
    duel.activeSkillTimer = 0;
    duel.aiActionTag = null;
    duel.stunTimer = 0;
    duel.invulnTimer = 0;
    duel.guardTimer = 0;

    this.projectiles = [];
    this.purpleFlameZones = [];
    this.arenaSlowTimer = 0;
    this.meleeHitIds.clear();
    this.camX = Math.max(0, this.player.x - PIXEL_W * 0.34);
  }

  private handleArenaRoundEnd(winner: 'player' | 'opponent'): void {
    const duel = this.arenaDuel;
    if (!duel || duel.roundPhase === 'round_over') return;

    if (winner === 'player') {
      duel.playerRoundWins += 1;
    } else {
      duel.opponentRoundWins += 1;
      this.player.hp = Math.max(1, this.player.hp);
    }
    duel.roundHistory.push(winner);
    duel.lastRoundWinner = winner;
    duel.roundPhase = 'round_over';
    duel.roundPhaseTimer = 1.75;
    duel.fightBannerTimer = 0;
    duel.domainActive = false;
    duel.activeSkillBanner = null;
    duel.vx = 0;
    this.player.vx = 0;
    this.projectiles = [];
    this.purpleFlameZones = [];
    this.arenaSlowTimer = 0;
    this.arenaCrowdHypeTimer = 2.6;

    if (winner === 'player') {
      gameAudio.playSecretFound();
      this.spawnBurst(duel.x + duel.w / 2, duel.y + 18, 24, duel.def.auraColor);
      this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 16, `ROUND ${duel.roundNumber} WON!`, '#fde047');
    } else {
      gameAudio.playHit(true);
      this.spawnFloatingText(this.player.x + 8, this.player.y - 16, `ROUND ${duel.roundNumber} LOST!`, '#fb7185');
    }
    this.emitHud(true);
  }

  private finishArenaMatch(winner: 'player' | 'opponent'): void {
    const duel = this.arenaDuel;
    if (!duel) return;
    const finalScore = `${duel.playerRoundWins}-${duel.opponentRoundWins}`;
    this.arenaDuel = null;
    this.restoreArenaPlayerHp();
    this.projectiles = [];
    this.purpleFlameZones = [];
    this.arenaSlowTimer = 0;

    if (winner === 'player') {
      this.arenaWins += 1;
      this.arenaCrowdHypeTimer = 3.2;
      this.player.gold += 180;
      this.player.statPoints += 4;
      const starStonesEarned = getStarStoneRewardForJjkEnemy(duel.challengerId);
      this.player.starStones = (this.player.starStones ?? 0) + starStonesEarned;
      gameAudio.playSecretFound();
      this.spawnBurst(duel.x + duel.w / 2, duel.y + 18, 28, duel.def.auraColor);
      this.spawnFloatingText(
        duel.x + duel.w / 2,
        duel.y - 18,
        `+${starStonesEarned} ★ STAR STONES`,
        '#fde047',
      );
      this.showSecretCaption(
        `COLOSSEUM CHAMPION (${finalScore}): ${duel.def.name.toUpperCase()}!`,
        `Best-of-3 Victory! Earned +${starStonesEarned} ★ Star Stones, +180G & +4 Stat Pts! Visit the Royal Stand Shrine in Solaris Town!`,
      );
    } else {
      this.player.hp = Math.max(25, Math.round(this.player.maxHp * 0.5));
      this.player.stamina = this.player.maxStamina;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.invulnTimer = 1.2;
      this.showSecretCaption(
        `COLOSSEUM DEFEAT (${finalScore})!`,
        `${duel.def.name} won the Best-of-3 match! Revived inside the Colosseum — adjust tactics & challenge again!`,
      );
    }
    this.emitHud(true);
  }

  private rescaleCachedBosses(): void {
    const atk = calculateAttackDamage(this.player, 1, false);
    for (const ch of this.chunks.values()) {
      if (!ch.boss || ch.boss.defeated) continue;
      const ratio = ch.boss.hp / Math.max(1, ch.boss.maxHp);
      let nextDef = ch.boss.def;
      if (ch.boss.def.isGyroBoss) {
        nextDef = createGyroZeppeliBossDef(this.player.maxHp, atk, this.player.bossesDefeated);
      } else if (ch.boss.def.isMegaBoss && ch.boss.def.megaArchetype) {
        const floor = ch.boss.def.index >= 950 ? ch.boss.def.index - 950 : ch.boss.def.index - 900;
        nextDef = createMegaBossDef(ch.boss.def.megaArchetype, floor, ch.boss.def.biome, this.player.bossesDefeated);
      } else {
        nextDef = getBossDef(ch.boss.def.index, this.player.bossesDefeated);
      }
      ch.boss.def = nextDef;
      ch.boss.maxHp = nextDef.maxHp;
      ch.boss.hp = Math.max(1, Math.round(nextDef.maxHp * ratio));
    }
  }

  private onBossDefeated(boss: ActiveBoss): void {
    this.bossGrabLockTimer = 0;
    const isMega = Boolean(boss.def.isMegaBoss);
    const isGyro = Boolean(boss.def.isGyroBoss);

    if (isGyro) {
      this.gyroDefeated = true;
      this.isekaiPortalOpen = true;
      this.defeatedBosses.add(boss.def.index);
      this.player.bossesDefeated = Math.max(this.player.bossesDefeated, this.defeatedBosses.size);
      this.rescaleCachedBosses();
      this.player.gold += 900;
      this.player.statPoints += 30;
      this.hitstopTimer = 0.12;
      this.trauma = 0.95;
      this.clearAllInputs(true);
      this.postBossInputLockTimer = 0.45;
      gameAudio.playSecretFound();

      const ch = this.chunks.get(this.getCurrentChunkIndex());
      if (ch && !ch.interactables.some((p) => p.kind === 'isekai_portal')) {
        ch.interactables.push({
          id: `isekai_portal_gyro_${Math.round(this.simTime)}`,
          x: Math.max(ch.startX + 120, Math.min(ch.endX - 64, Math.round(this.player.x + 82))),
          y: FLOOR_Y - 56,
          w: 34,
          h: 56,
          kind: 'isekai_portal',
          label: 'Enter Isekai Dimensional Portal',
          dialogue: ['A glowing Azure-Gold Dimensional Portal! Step inside or press [F] to travel to the Isekai Town!'],
          speaker: 'Dimensional Portal',
          activated: false,
        });
      }

      this.showSecretCaption(
        'FINAL CITADEL BOSS DEFEATED: GYRO ZEPPELI!',
        'A Dimensional Portal tore open ahead! Step inside or press [F] to enter the Isekai Realm!',
      );
      this.openDialogue('Gyro Zeppeli', 'boss', '#22c55e', [
        'Nyo-ho...! Not bad at all! Lesson 5 complete—that golden spin opened a Dimensional Portal right beside you!',
        'Step into the swirling Isekai Gate ahead to awaken in the sunny Medieval Fantasy Town!',
      ]);
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
      void this.saveCurrentGame('autosave', true);
      this.emitHud(true);
      return;
    }

    if (isMega) {
      this.defeatedBosses.add(boss.def.index);
      this.player.bossesDefeated = Math.max(this.player.bossesDefeated, this.defeatedBosses.size);
      this.rescaleCachedBosses();
      this.player.gold += 450;
      const bonusPts = 25;
      this.player.statPoints += bonusPts;
      const prevLevel = this.player.level;
      this.player.level = 1 + Math.floor((this.player.monstersSlain + this.player.bossesDefeated * 5) / 10);
      this.scaleLiveEnemiesOnLevelUp(prevLevel, this.player.level);
      addInventoryResource(this.inventory, 'crimson_vial', 2);
      addInventoryResource(this.inventory, 'magma_core', 3);
      this.hitstopTimer = 0.1;
      this.trauma = 0.95;
      this.clearAllInputs(true);
      this.postBossInputLockTimer = 0.45;
      gameAudio.playSecretFound();
      this.showSecretCaption(
        `MEGA BOSS SLAIN: ${boss.def.name}`,
        `Dimensional rift sealed! +450G, +25 Stat Points & rare relics! Remaining Citadel bosses scaled 1.9x HP!`,
      );
      this.openDialogue(boss.def.name, 'boss', boss.def.primaryColor, [
        boss.def.defeatLine,
        `[SYSTEM] MEGA BOSS BOUNTY: +${bonusPts} Ability Stat Points, +450G & +2 Crimson Vials!`,
      ]);
      gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
      void this.saveCurrentGame('autosave', true);
      this.emitHud(true);
      return;
    }

    this.defeatedBosses.add(boss.def.index);
    this.player.bossesDefeated = Math.max(this.player.bossesDefeated, this.defeatedBosses.size);
    this.rescaleCachedBosses();
    this.player.gold += 100 + boss.def.index * 5;
    const prevLevel = this.player.level;
    const pts = grantKillStatPoints(this.player, 'boss');
    this.scaleLiveEnemiesOnLevelUp(prevLevel, this.player.level);
    addInventoryResource(this.inventory, 'crimson_vial', 1);
    const matId =
      boss.def.biome === 'castle'
        ? 'royal_ember'
        : boss.def.biome === 'forest'
          ? 'ruin_shard'
          : 'magma_core';
    addInventoryResource(this.inventory, matId, 2);

    this.hitstopTimer = 0.08;
    this.trauma = 0.85;
    this.clearAllInputs(true);
    this.postBossInputLockTimer = 0.45;
    gameAudio.playSecretFound();
    this.sendMilestone('boss', `${boss.def.name} (#${boss.def.index})`);
    this.syncHostWorldMeta();
    this.completeBossEncounterProgress();
    void this.saveCurrentGame('autosave', true);

    // After the 15th boss, Final Boss GYRO ZEPPELI crashes in with a dramatic cutscene!
    if (boss.def.index === TOTAL_BOSSES && !this.defeatedBosses.has(TOTAL_BOSSES + 1) && canPlayerEngageBoss(this.worldRole)) {
      const gyroDef = createGyroZeppeliBossDef(
        this.player.maxHp,
        calculateAttackDamage(this.player, 1, false),
        this.player.bossesDefeated,
      );
      const gyroBoss: ActiveBoss = {
        def: gyroDef,
        x: this.player.x + 150,
        y: FLOOR_Y - 52,
        vx: 0,
        vy: 0,
        w: 36,
        h: 52,
        hp: gyroDef.maxHp,
        maxHp: gyroDef.maxHp,
        facing: -1,
        state: 'intro',
        stateTimer: 1.0,
        hitFlash: 0,
        posePhase: 0,
        arenaMinX: this.player.x - 120,
        arenaMaxX: this.player.x + 280,
        defeated: false,
      };
      this.megaCutscene = {
        archetype: 'gyro_zeppeli',
        pendingBoss: gyroBoss,
        timer: 3.3,
        duration: 3.3,
      };
      this.trauma = 1.0;
      gameAudio.playMegaGlitchCrash();
      this.showAnnouncement(`!! ${TOTAL_BOSSES}TH BOSS CLEARED: FINAL BOSS GYRO ZEPPELI APPEARS !!`);
      this.emitHud(true);
      return;
    }

    // 10% chance a Dimensional Glitch-Crash spawns a colossal Mega Boss (suppressed during 60s 5-boss cooldown)
    if (this.bossCooldownSeconds <= 0 && canPlayerEngageBoss(this.worldRole) && shouldTriggerMegaBossGlitch()) {
      const arch = pickMegaBossArchetype();
      const pendingBoss = createMegaBossInstance(
        arch,
        boss.def.index,
        this.getCurrentBiome(),
        this.player.x + 150,
        FLOOR_Y,
        this.player.bossesDefeated,
      );
      this.megaCutscene = {
        archetype: arch,
        pendingBoss,
        timer: 3.1,
        duration: 3.1,
      };
      this.trauma = 1.0;
      gameAudio.playMegaGlitchCrash();
      this.showAnnouncement(`!! REALITY GLITCHED: ${pendingBoss.def.name} INBOUND !!`);
      this.emitHud(true);
      return;
    }

    if (this.bossCooldownSeconds <= 0) {
      this.showAnnouncement(`Defeated ${boss.def.name}! +${pts} Stat Points!`);
    }
    const lines = [
      boss.def.defeatLine,
      `[SYSTEM] +${pts} Ability Stat Points granted! Press [K] to open Status Window.`,
    ];
    if (boss.def.index === 5) {
      lines.push('5 Castle Bosses felled! Cross the ruined bridge ahead into the Volcano Hell Citadel!');
    } else if (boss.def.index === 10) {
      lines.push('10 Bosses felled! Ahead lies the Dark Enchanted Forest of Ancient Ruins!');
    } else if (boss.def.index === TOTAL_BOSSES) {
      lines.push(`All ${TOTAL_BOSSES} Citadel Bosses defeated! Defeat Gyro Zeppeli or step through the Escape Gate!`);
    }
    this.openDialogue(boss.def.name, 'boss', boss.def.primaryColor, lines);
    gameAudio.startMusic(this.getCurrentBiome(), null, this.realm);
    this.emitHud(true);
  }

  private stepEnemies(chunks: GeneratedChunk[], dt: number, frozen: boolean): void {
    const enemyDmgMult = getMonsterLevelMultiplier(this.player.level);
    for (const ch of chunks) {
      for (const en of ch.enemies) {
        en.hitFlash = Math.max(0, en.hitFlash - dt);
        if (en.state === 'ko') {
          en.koTimer -= dt;
          en.x += en.vx * dt;
          en.y += en.vy * dt;
          en.vy += 320 * dt;
          continue;
        }
        if (frozen) continue;
        if ((en.stunTimer ?? 0) > 0) {
          en.stunTimer = Math.max(0, (en.stunTimer ?? 0) - dt);
          en.vx *= 0.82;
          continue;
        }
        const speedMult = this.stepEnemyStatusEffects(en, dt, false);
        if (en.hp <= 0) continue;

        const dx = this.player.x - en.x;
        const dist = Math.abs(dx);
        en.stateTimer -= dt;

        if (en.archetype === 'skeleton_guard') {
          if (en.state === 'patrol') {
            en.facing = dx >= 0 ? 1 : -1;
            if (dist < 140 && dist > 26) {
              en.vx = en.facing * 48 * speedMult;
            } else if (dist <= 26) {
              en.vx = 0;
              en.state = 'windup';
              en.stateTimer = 0.42;
            } else {
              en.vx = Math.sin(this.simTime * 1.5 + en.patrolOriginX) * 24 * speedMult;
            }
          } else if (en.state === 'windup' && en.stateTimer <= 0) {
            en.state = 'attack';
            en.stateTimer = 0.2;
            if (dist < 32 && Math.abs(this.player.y - en.y) < 28) {
              this.damagePlayer(Math.round(12 * enemyDmgMult), en.facing * 120);
            }
          } else if (en.state === 'attack' && en.stateTimer <= 0) {
            en.state = 'recover';
            en.stateTimer = 0.65;
          } else if (en.state === 'recover' && en.stateTimer <= 0) {
            en.state = 'patrol';
          }
          en.x += en.vx * dt;
          en.vx *= 0.88;
        } else if (en.archetype === 'shadow_bat') {
          // Hover & swoop policy
          en.facing = dx >= 0 ? 1 : -1;
          const hoverY = FLOOR_Y - 62 + Math.sin(this.simTime * 3 + en.patrolOriginX) * 14;
          if (en.state === 'patrol') {
            en.x += Math.sin(this.simTime * 2 + en.patrolOriginX) * 35 * dt;
            en.y += (hoverY - en.y) * 4 * dt;
            if (dist < 130 && en.stateTimer <= 0) {
              en.state = 'windup';
              en.stateTimer = 0.35;
            }
          } else if (en.state === 'windup' && en.stateTimer <= 0) {
            en.state = 'attack';
            en.stateTimer = 0.55;
            en.vx = en.facing * 115;
            en.vy = 65;
          } else if (en.state === 'attack') {
            en.x += en.vx * dt;
            en.y += en.vy * dt;
            if (rectsOverlap(en.x, en.y, en.w, en.h, this.player.x, this.player.y, this.player.w, this.player.h)) {
              this.damagePlayer(Math.round(10 * enemyDmgMult), en.facing * 90);
              en.state = 'recover';
              en.stateTimer = 0.8;
            }
            if (en.stateTimer <= 0) {
              en.state = 'recover';
              en.stateTimer = 0.8;
            }
          } else if (en.state === 'recover') {
            en.y += (hoverY - en.y) * 5 * dt;
            if (en.stateTimer <= 0) en.state = 'patrol';
          }
        } else if (en.archetype === 'cultist_mage') {
          // Ranged kiter policy
          en.facing = dx >= 0 ? 1 : -1;
          if (en.state === 'patrol') {
            if (dist < 70) {
              en.x -= en.facing * 42 * dt;
            } else if (dist > 160 && dist < 240) {
              en.x += en.facing * 32 * dt;
            }
            if (dist < 220 && en.stateTimer <= 0) {
              en.state = 'windup';
              en.stateTimer = 0.55;
            }
          } else if (en.state === 'windup' && en.stateTimer <= 0) {
            en.state = 'attack';
            en.stateTimer = 0.25;
            this.projectiles.push({
              id: `mp_${this.simTime}_${en.id}`,
              x: en.x + en.w / 2,
              y: en.y + 10,
              vx: en.facing * 135,
              vy: 0,
              radius: 4,
              damage: Math.round(11 * enemyDmgMult),
              fromPlayer: false,
              color: '#38bdf8',
              life: 2.0,
              kind: 'rune',
            });
          } else if (en.state === 'attack' && en.stateTimer <= 0) {
            en.state = 'recover';
            en.stateTimer = 1.4;
          } else if (en.state === 'recover' && en.stateTimer <= 0) {
            en.state = 'patrol';
          }
        } else if (en.archetype === 'cursed_armor') {
          // Towering Living Armor shield-march & Zweihander cleave
          en.facing = dx >= 0 ? 1 : -1;
          if (en.state === 'patrol') {
            if (dist < 160 && dist > 30) {
              en.vx = en.facing * 44;
            } else if (dist <= 30) {
              en.vx = 0;
              en.state = 'windup';
              en.stateTimer = 0.52;
            } else {
              en.vx = Math.sin(this.simTime * 1.1 + en.patrolOriginX) * 18;
            }
          } else if (en.state === 'windup' && en.stateTimer <= 0) {
            en.state = 'attack';
            en.stateTimer = 0.28;
            en.vx = en.facing * 95;
            if (dist < 38 && Math.abs(this.player.y - en.y) < 32) {
              this.damagePlayer(Math.round(16 * enemyDmgMult), en.facing * 140);
            }
          } else if (en.state === 'attack' && en.stateTimer <= 0) {
            en.state = 'recover';
            en.stateTimer = 0.85;
          } else if (en.state === 'recover' && en.stateTimer <= 0) {
            en.state = 'patrol';
          }
          en.x += en.vx * dt;
          en.vx *= 0.85;
        } else if (en.archetype === 'phantom_wisp') {
          // Floating spirit wraith that drifts and casts arcane bolts
          en.facing = dx >= 0 ? 1 : -1;
          const floatY = FLOOR_Y - 56 + Math.sin(this.simTime * 2.6 + en.patrolOriginX) * 12;
          en.y += (floatY - en.y) * 4 * dt;
          if (en.state === 'patrol') {
            if (dist < 75) en.x -= en.facing * 34 * dt;
            else if (dist > 140 && dist < 240) en.x += en.facing * 28 * dt;
            if (dist < 210 && en.stateTimer <= 0) {
              en.state = 'windup';
              en.stateTimer = 0.45;
            }
          } else if (en.state === 'windup' && en.stateTimer <= 0) {
            en.state = 'attack';
            en.stateTimer = 0.25;
            this.projectiles.push({
              id: `pw_${this.simTime}_${en.id}`,
              x: en.x + en.w / 2,
              y: en.y + 8,
              vx: en.facing * 145,
              vy: Math.sin(this.simTime * 3) * 12,
              radius: 4,
              damage: Math.round(12 * enemyDmgMult),
              fromPlayer: false,
              color: '#38bdf8',
              life: 2.1,
              kind: 'rune',
            });
          } else if (en.state === 'attack' && en.stateTimer <= 0) {
            en.state = 'recover';
            en.stateTimer = 1.3;
          } else if (en.state === 'recover' && en.stateTimer <= 0) {
            en.state = 'patrol';
          }
        } else {
          // Gargoyle line-of-sight charger policy
          en.facing = dx >= 0 ? 1 : -1;
          if (en.state === 'patrol') {
            if (dist < 170 && en.stateTimer <= 0) {
              en.state = 'windup';
              en.stateTimer = 0.48;
            }
          } else if (en.state === 'windup' && en.stateTimer <= 0) {
            en.state = 'attack';
            en.stateTimer = 0.5;
            en.vx = en.facing * 165;
          } else if (en.state === 'attack') {
            en.x += en.vx * dt;
            if (rectsOverlap(en.x, en.y, en.w, en.h, this.player.x, this.player.y, this.player.w, this.player.h)) {
              this.damagePlayer(Math.round(15 * enemyDmgMult), en.facing * 150);
              en.state = 'recover';
              en.stateTimer = 0.9;
            }
            if (en.stateTimer <= 0) {
              en.state = 'recover';
              en.stateTimer = 0.9;
            }
          } else if (en.state === 'recover' && en.stateTimer <= 0) {
            en.state = 'patrol';
            en.stateTimer = 1.0;
          }
        }
      }
      ch.enemies = ch.enemies.filter((e) => !(e.state === 'ko' && e.koTimer <= 0));
    }
  }

  private stepBosses(chunks: GeneratedChunk[], dt: number, frozen: boolean): void {
    const playerAtk = calculateAttackDamage(this.player, 1, false);
    for (const ch of chunks) {
      const b = ch.boss;
      if (!b) continue;
      b.hitFlash = Math.max(0, b.hitFlash - dt);
      if (b.activeDialogueTimer && b.activeDialogueTimer > 0) {
        b.activeDialogueTimer = Math.max(0, b.activeDialogueTimer - dt);
        if (b.activeDialogueTimer === 0 && (!b.skillPhase || b.skillPhase === 'none')) {
          b.activeSkillName = null;
        }
      }
      if (b.state === 'ko') {
        b.stateTimer = Math.max(0, b.stateTimer - dt);
        b.skillPhase = 'none';
        continue;
      }
      if (b.defeated || frozen) continue;
      if ((b.stunTimer ?? 0) > 0) {
        b.stunTimer = Math.max(0, (b.stunTimer ?? 0) - dt);
        b.vx *= 0.82;
        continue;
      }

      const bossCenter = b.x + b.w / 2;
      const playerCenter = this.player.x + this.player.w / 2;
      const dx = playerCenter - bossCenter;
      const dist = Math.abs(dx);
      if (dist > 340) continue;

      // Initialize real-time skill timers cleanly on first encounter tick
      b.skillPhase ??= 'none';
      b.ramCooldown ??= 3.3;
      b.barrageCooldown ??= 5.2;
      b.burstPunchCooldown ??= 1.0;
      b.burstHitStreak ??= 0;
      b.lastSkillThresholdPct ??= 100;

      // Every 12% HP lost, every Citadel/Mega/Gyro boss automatically unleashes 1 skill!
      const bossHpPct = (b.hp / Math.max(1, b.maxHp)) * 100;
      if (b.hp > 0 && bossHpPct <= b.lastSkillThresholdPct - 12) {
        while (b.lastSkillThresholdPct - 12 >= bossHpPct && b.lastSkillThresholdPct > 0) {
          b.lastSkillThresholdPct -= 12;
        }
        const burstDmg = calculateCitadelBossHalfAtk(playerAtk, 0.85);
        const dirToPlayer = playerCenter >= bossCenter ? 1 : -1;
        b.facing = dirToPlayer;
        if (b.skillPhase === 'none') {
          if (Math.floor(b.lastSkillThresholdPct / 12) % 2 === 0) {
            b.skillPhase = 'barrage_unleash';
            b.state = 'attack';
            b.stateTimer = 0.85;
            b.barrageWaveTimer = 0;
            b.activeSkillName = 'Stand Barrage';
          } else {
            b.skillPhase = 'ram_windup';
            b.state = 'windup';
            b.stateTimer = 0.28;
            b.activeSkillName = 'Ram n Charge';
          }
        } else {
          // Even mid-animation, unleash an instant Stand Barrage spread!
          [-32, 0, 32].forEach((vyOff) => {
            this.projectiles.push({
              id: `sb_thresh_${b.def.index}_${this.simTime}_${vyOff}`,
              x: bossCenter + dirToPlayer * 20,
              y: b.y + Math.round(b.h * 0.45) + vyOff * 0.2,
              vx: dirToPlayer * 245,
              vy: vyOff,
              radius: 12,
              damage: burstDmg,
              fromPlayer: false,
              color: b.def.primaryColor || '#f97316',
              life: 1.4,
              kind: 'fireball',
            });
          });
          b.activeSkillName = 'Stand Barrage';
        }
        b.activeDialogue = pickJoJoSkillDialogue(
          b.activeSkillName === 'Ram n Charge' ? 'Ram n Charge' : 'Stand Barrage',
          b.def.name,
          b.def.standName,
          b.def.index + Math.round(b.lastSkillThresholdPct),
        );
        b.activeDialogueTimer = 3.2;
        gameAudio.playSkill('stand_rush');
        this.spawnFloatingText(bossCenter, b.y - 22, `12% HP SKILL: ${b.activeSkillName.toUpperCase()}!`, '#fde047');
        this.spawnBurst(bossCenter, b.y + Math.round(b.h * 0.5), 14, '#fde047');
      }

      b.x = Math.max(b.arenaMinX, Math.min(b.arenaMaxX, b.x + b.vx * dt));
      b.vx *= b.skillPhase === 'ram_charge' ? 0.96 : 0.86;
      b.posePhase += dt;

      if (b.skillPhase !== 'ram_charge' && b.skillPhase !== 'burst_grab' && b.skillPhase !== 'burst_slam') {
        b.facing = dx >= 0 ? 1 : -1;
      }

      if (b.state === 'intro') {
        b.stateTimer -= dt;
        if (b.stateTimer <= 0) {
          b.state = 'idle';
          b.stateTimer = 0.25;
        }
        continue;
      }

      // Tick cooldowns while not executing a dedicated skill animation
      if (b.skillPhase === 'none') {
        b.ramCooldown = Math.max(0, b.ramCooldown - dt);
        b.barrageCooldown = Math.max(0, b.barrageCooldown - dt);
        b.burstPunchCooldown = Math.max(0, b.burstPunchCooldown - dt);
      }

      // 1. RAM N CHARGE — Every 3.3s: crouches into ramming stance, charges & knocks player back
      if (b.skillPhase === 'ram_windup') {
        b.state = 'windup';
        b.vx = 0;
        b.stateTimer -= dt;
        if (b.stateTimer <= 0) {
          b.skillPhase = 'ram_charge';
          b.state = 'attack';
          b.stateTimer = 0.46;
          b.ramHitPlayer = false;
          b.vx = b.facing * 320;
          gameAudio.playSwordSlash(this.player.equippedWeapon, 3);
        }
        continue;
      }
      if (b.skillPhase === 'ram_charge') {
        b.state = 'attack';
        b.vx = b.facing * 305;
        b.stateTimer -= dt;
        if (Math.floor(this.simTime * 30) % 2 === 0) {
          this.spawnBurst(bossCenter - b.facing * 10, b.y + b.h - 10, 3, '#f97316');
        }
        if (
          !b.ramHitPlayer &&
          rectsOverlap(b.x - 8, b.y, b.w + 16, b.h, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          b.ramHitPlayer = true;
          const dmg = calculateCitadelBossHalfAtk(playerAtk, 1.15);
          this.damagePlayer(dmg, b.facing * 290);
          this.spawnFloatingText(playerCenter, this.player.y - 14, `RAMMED! -${dmg}`, '#fb923c');
        }
        if (b.stateTimer <= 0) {
          b.skillPhase = 'none';
          b.state = 'recover';
          b.stateTimer = 0.35;
          b.ramCooldown = 3.3;
        }
        continue;
      }

      // 2. STAND BARRAGE — Bends down & gains strength slowly, then unleashes larger & fiercer flaming Stand waves
      if (b.skillPhase === 'barrage_charge') {
        b.state = 'windup';
        b.vx = 0;
        b.stateTimer -= dt;
        b.barrageChargeProgress = Math.min(1, 1 - b.stateTimer / 1.35);
        if (Math.floor(this.simTime * 16) % 2 === 0) {
          this.spawnBurst(bossCenter + (Math.random() - 0.5) * 32, b.y + b.h - 6, 3, '#fde047');
        }
        if (b.stateTimer <= 0) {
          b.skillPhase = 'barrage_unleash';
          b.state = 'attack';
          b.stateTimer = 1.3;
          b.barrageWaveTimer = 0;
          gameAudio.playSkill('stand_rush');
        }
        continue;
      }
      if (b.skillPhase === 'barrage_unleash') {
        b.state = 'attack';
        b.vx = b.facing * 42;
        b.stateTimer -= dt;
        b.barrageWaveTimer = (b.barrageWaveTimer ?? 0) - dt;
        if (b.barrageWaveTimer <= 0) {
          b.barrageWaveTimer = 0.26;
          const dmg = calculateCitadelBossHalfAtk(playerAtk, 0.72);
          [-26, 0, 26].forEach((vyOff) => {
            this.projectiles.push({
              id: `sb_${b.def.index}_${this.simTime}_${vyOff}`,
              x: bossCenter + b.facing * 22,
              y: b.y + Math.round(b.h * 0.45) + vyOff * 0.25,
              vx: b.facing * 235,
              vy: vyOff,
              radius: 13,
              damage: dmg,
              fromPlayer: false,
              color: '#f97316',
              life: 1.4,
              kind: 'fireball',
            });
          });
          // Wide forward Stand melee arc check (larger than player's Ora Ora)
          const arcX = b.facing === 1 ? b.x + b.w - 4 : b.x - 94;
          if (rectsOverlap(arcX, b.y - 16, 98, b.h + 22, this.player.x, this.player.y, this.player.w, this.player.h)) {
            this.damagePlayer(dmg, b.facing * 155);
          }
          this.spawnBurst(bossCenter + b.facing * 36, b.y + 12, 8, '#f97316');
        }
        if (b.stateTimer <= 0) {
          b.skillPhase = 'none';
          b.state = 'recover';
          b.stateTimer = 0.45;
          b.barrageCooldown = 7.4;
          b.barrageChargeProgress = 0;
        }
        continue;
      }

      // 3. BURST CRUSH! — Grab & Ground-Breaking Slam on 3 consecutive punches!
      if (b.skillPhase === 'burst_grab') {
        b.state = 'attack';
        b.vx = 0;
        b.stateTimer -= dt;
        this.bossGrabLockTimer = Math.max(this.bossGrabLockTimer, 0.08);
        this.player.x = b.x + b.facing * 24;
        this.player.y = b.y - 14;
        this.player.vx = 0;
        this.player.vy = 0;
        if (b.stateTimer <= 0) {
          b.skillPhase = 'burst_slam';
          b.stateTimer = 0.34;
          this.bossGrabLockTimer = 0;
          this.player.y = FLOOR_Y - this.player.h;
          const slamDmg = calculateCitadelBossHalfAtk(playerAtk, 1.5);
          this.player.invulnTimer = 0; // Ground slam hits cleanly on release!
          this.damagePlayer(slamDmg, b.facing * 220);
          this.trauma = 0.95;
          this.hitstopTimer = 0.08;
          gameAudio.playHit(true);
          const impactX = Math.round(this.player.x + this.player.w / 2);
          this.groundCracks.push({
            id: `crack_${b.def.index}_${Math.round(this.simTime * 1000)}`,
            x: impactX,
            y: FLOOR_Y,
            width: 74,
            life: 8.5,
            maxLife: 8.5,
            seed: Math.floor(this.simTime * 37) + b.def.index,
          });
          this.spawnBurst(impactX, FLOOR_Y - 2, 24, '#f97316');
          this.spawnBurst(impactX, FLOOR_Y - 4, 16, '#94a3b8');
          this.spawnFloatingText(impactX, FLOOR_Y - 28, `BURST CRUSH SLAM! -${slamDmg}`, '#f43f5e');
          b.burstHitStreak = 0;
        }
        continue;
      }
      if (b.skillPhase === 'burst_slam') {
        b.state = 'recover';
        b.stateTimer -= dt;
        if (b.stateTimer <= 0) {
          b.skillPhase = 'none';
          b.state = 'idle';
          b.stateTimer = 0.3;
          b.burstPunchCooldown = 1.0;
        }
        continue;
      }

      // Trigger Ram n Charge strictly every 3.3 seconds when cooldown hits 0
      if (b.ramCooldown <= 0 && dist <= 320) {
        b.skillPhase = 'ram_windup';
        b.state = 'windup';
        b.stateTimer = 0.42;
        b.activeSkillName = 'Ram n Charge';
        b.activeDialogue = pickJoJoSkillDialogue('Ram n Charge', b.def.name, b.def.standName, b.def.index + Math.floor(this.simTime));
        b.activeDialogueTimer = 3.2;
        this.spawnFloatingText(bossCenter, b.y - 16, 'RAM STANCE!', '#fbbf24');
        continue;
      }

      // Trigger Stand Barrage when its cooldown hits 0
      if (b.barrageCooldown <= 0 && dist <= 290) {
        b.skillPhase = 'barrage_charge';
        b.state = 'windup';
        b.stateTimer = 1.35;
        b.barrageChargeProgress = 0;
        b.activeSkillName = 'Stand Barrage';
        b.activeDialogue = pickJoJoSkillDialogue('Stand Barrage', b.def.name, b.def.standName, b.def.index + Math.floor(this.simTime));
        b.activeDialogueTimer = 3.6;
        this.spawnFloatingText(bossCenter, b.y - 16, 'CHARGING STAND!', '#f97316');
        continue;
      }

      // Approach player smoothly and punch every 1.0s (Burst Crush! 3-punch combo -> grab & ground-breaking slam)
      if (dist > 34) {
        b.vx = b.facing * (b.def.isGyroBoss ? 118 : 96);
      }
      if (b.burstPunchCooldown <= 0 && dist <= 135) {
        b.burstPunchCooldown = 1.0;
        b.state = 'attack';
        b.stateTimer = 0.22;
        b.vx = b.facing * 150;
        const hitReach = dist <= 48 && Math.abs(this.player.y - b.y) <= 44;
        if (hitReach) {
          const punchDmg = calculateCitadelBossHalfAtk(playerAtk, 0.85);
          this.damagePlayer(punchDmg, b.facing * 105);
          b.burstHitStreak = (b.burstHitStreak ?? 0) + 1;
          b.activeSkillName = 'Burst Crush!';
          b.activeDialogue = pickJoJoSkillDialogue(
            'Burst Crush!',
            b.def.name,
            b.def.standName,
            b.burstHitStreak + b.def.index,
          );
          b.activeDialogueTimer = 3.0;
          this.spawnFloatingText(playerCenter, this.player.y - 18, `CRUSH HIT ${b.burstHitStreak}/3`, '#f43f5e');

          if (b.burstHitStreak >= 3) {
            b.skillPhase = 'burst_grab';
            b.stateTimer = 0.42;
            this.bossGrabLockTimer = 0.45;
            this.trauma = 0.65;
            this.spawnFloatingText(bossCenter, b.y - 22, 'BURST CRUSH GRAB!!', '#fde047');
          }
        } else if ((b.burstHitStreak ?? 0) > 0) {
          b.burstHitStreak = 0;
          this.spawnFloatingText(bossCenter, b.y - 14, 'STREAK BROKEN!', '#38bdf8');
        }
      } else if (b.state === 'attack' || b.state === 'recover') {
        b.stateTimer = Math.max(0, b.stateTimer - dt);
        if (b.stateTimer <= 0) {
          b.state = 'idle';
        }
      } else {
        b.state = 'idle';
      }
    }
  }

  private stepEnemyStatusEffects(en: EnemyState, dt: number, isIsekai: boolean): number {
    if (en.statusBurnTimer && en.statusBurnTimer > 0) {
      const prev = Math.floor(en.statusBurnTimer * 2);
      en.statusBurnTimer = Math.max(0, en.statusBurnTimer - dt);
      if (Math.floor(en.statusBurnTimer * 2) !== prev) {
        const tick = Math.max(3, Math.round(en.maxHp * 0.05));
        const res = applyDamageToEnemy(en, tick, 0);
        this.spawnFloatingText(en.x + en.w / 2, en.y - 10, `${tick}`, '#fb923c');
        this.spawnBurst(en.x + en.w / 2, en.y + 6, 4, '#fb923c');
        if (res.killed) {
          if (isIsekai) this.onIsekaiEnemyKilled(en);
          else this.onEnemyKilled(en);
        }
      }
    }
    if (en.statusVenomTimer && en.statusVenomTimer > 0 && en.state !== 'ko') {
      const prev = Math.floor(en.statusVenomTimer * 2);
      en.statusVenomTimer = Math.max(0, en.statusVenomTimer - dt);
      if (Math.floor(en.statusVenomTimer * 2) !== prev) {
        const tick = Math.max(2, Math.round(en.maxHp * 0.04));
        const res = applyDamageToEnemy(en, tick, 0);
        this.spawnFloatingText(en.x + en.w / 2, en.y - 12, `${tick}`, '#84cc16');
        if (res.killed) {
          if (isIsekai) this.onIsekaiEnemyKilled(en);
          else this.onEnemyKilled(en);
        }
      }
    }
    if (en.statusFrostTimer && en.statusFrostTimer > 0) {
      en.statusFrostTimer = Math.max(0, en.statusFrostTimer - dt);
      return 0.5;
    }
    return 1;
  }

  private claimEndlessDungeonContract(): void {
    const mission = this.activeMissionId
      ? GUILD_MISSIONS.find((m) => m.id === this.activeMissionId)
      : null;
    if (!mission || this.endlessContractClaimed) return;

    this.endlessContractClaimed = true;
    this.player.gold += mission.rewardGold;
    this.player.statPoints += 6;
    const promo = promoteGuildRankAfterMission(
      this.guildRank,
      mission.id,
      this.inventory,
      this.bRankEscortsCompleted,
      this.rankMissionsCompleted,
    );
    this.guildRank = promo.nextRank;
    this.bRankEscortsCompleted = promo.nextBRankEscorts;
    this.rankMissionsCompleted = promo.nextRankMissionsCompleted;
    addInventoryResource(this.inventory, 'crimson_vial', 1);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'guild:mission_complete', missionId: mission.id, newRank: this.guildRank }));
    }

    gameAudio.playSecretFound();
    this.showSecretCaption(
      promo.promoted
        ? `CONTRACT CLEARED · PROMOTED TO ${promo.nextRank}-RANK!`
        : `CONTRACT CLEARED · RANK PROGRESS (${this.rankMissionsCompleted}/${MISSIONS_REQUIRED_PER_RANK})`,
      `+${mission.rewardGold}G & +6 Stat Pts! Keep fighting deeper endlessly OR walk back out the West Exit Rope to Caravan Rider Vance!`,
    );
    void this.saveCurrentGame('autosave', true);
    this.emitHud(true);
  }

  private stepIsekaiCombat(dt: number, frozen: boolean): void {
    // 0a. Solaris Town Raid (Rimuru Tempest / Goblin Slayer) + House Destruction Zones
    if (this.realm === 'isekai_town') {
      for (const h of this.townHouses) {
        h.hitFlash = Math.max(0, h.hitFlash - dt);
      }
      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) {
          z.life -= dt;
        }
        if (
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 10, z.w - 4, z.h - 10, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -90);
        }
        if (!z.hitHouses) {
          z.hitHouses = true;
          for (const h of this.townHouses) {
            if (h.broken) continue;
            if (z.x + z.w >= h.x - 8 && z.x <= h.x + h.w + 8) {
              h.hp = Math.max(0, h.hp - Math.round(z.damage * 2.2));
              h.hitFlash = 0.22;
              if (h.hp <= 0) {
                h.broken = true;
                this.spawnBurst(h.x + h.w / 2, FLOOR_Y - 34, 24, '#f97316');
                this.showAnnouncement('A Solaris Town House collapsed from the raid AoE!');
              }
            }
          }
        }
        if (z.life <= 0) {
          this.purpleFlameZones.splice(i, 1);
        }
      }

      if (this.townRaid && this.townRaid.hp > 0 && !frozen) {
        this.townRaidRetreatTimer -= dt;
        const ai = stepTownRaidAi(
          this.townRaid,
          this.player,
          this.townHouses,
          dt,
          ISEKAI_ROOM_BOUNDS.isekai_town,
          FLOOR_Y,
        );
        if (ai.spawnedProjectiles.length > 0) this.projectiles.push(...ai.spawnedProjectiles);
        if (ai.spawnedZones.length > 0) this.purpleFlameZones.push(...ai.spawnedZones);
        if (ai.usedSkillName) {
          this.activeCastBanner = `${this.townRaid.name}: ${ai.usedSkillName}!`;
          this.activeCastBannerTimer = 1.7;
          gameAudio.playSkill('candlefire_wave');
        }
        if (ai.meleeHitDamage > 0) {
          this.damagePlayer(ai.meleeHitDamage, ai.meleeKnockbackX);
        }
        if (ai.brokenHouseIndices.length > 0) {
          for (const bi of ai.brokenHouseIndices) {
            const h = this.townHouses[bi];
            if (h) this.spawnBurst(h.x + h.w / 2, FLOOR_Y - 36, 20, '#ef4444');
          }
        }
        if (this.townRaidRetreatTimer <= 0 && this.townRaid) {
          const departedName = this.townRaid.name;
          this.townRaid = null;
          this.purpleFlameZones = [];
          this.showSecretCaption(
            `${departedName.toUpperCase()} DEPARTED!`,
            'Solaris Townsfolk emerge with hammers to rebuild every wrecked home back to normal!',
          );
          this.emitHud(true);
        }
      }
      return;
    }

    // 0b. Live Jujutsu Kaisen Colosseum Dueling AI (3-round Best-of-3 + countdown lock!)
    if (this.realm === 'dueling_arena') {
      if (this.arenaDuel) {
        const duel = this.arenaDuel;
        if (duel.roundPhase === 'countdown') {
          const prevCeil = Math.ceil(duel.roundPhaseTimer);
          duel.roundPhaseTimer = Math.max(0, duel.roundPhaseTimer - dt);
          const nextCeil = Math.ceil(duel.roundPhaseTimer);
          if (nextCeil !== prevCeil && nextCeil > 0) {
            gameAudio.playDialogueBlip('system', 68 + nextCeil * 4);
          }
          if (duel.roundPhaseTimer <= 0) {
            duel.roundPhase = 'fighting';
            duel.fightBannerTimer = 0.95;
            gameAudio.playBattleEncounterStinger();
            this.arenaCrowdHypeTimer = Math.max(this.arenaCrowdHypeTimer, 1.5);
          }
        } else if (duel.roundPhase === 'fighting') {
          if (duel.fightBannerTimer > 0) {
            duel.fightBannerTimer = Math.max(0, duel.fightBannerTimer - dt);
          }
        } else if (duel.roundPhase === 'round_over') {
          duel.roundPhaseTimer = Math.max(0, duel.roundPhaseTimer - dt);
          if (duel.roundPhaseTimer <= 0) {
            if (duel.playerRoundWins >= 2 || duel.opponentRoundWins >= 2 || duel.roundNumber >= 3) {
              const winner = duel.playerRoundWins >= duel.opponentRoundWins ? 'player' : 'opponent';
              this.finishArenaMatch(winner);
              return;
            }
            duel.roundNumber += 1;
            duel.roundPhase = 'countdown';
            duel.roundPhaseTimer = 3.3;
            duel.fightBannerTimer = 0;
            duel.lastRoundWinner = null;
            this.resetArenaRoundPositions();
          }
        }
      }

      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) {
          if ((z.telegraphTime ?? 0) > 0) {
            z.telegraphTime = Math.max(0, (z.telegraphTime ?? 0) - dt);
          } else {
            z.life -= dt;
          }
        }
        if (
          (z.telegraphTime ?? 0) <= 0 &&
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 10, z.w - 4, z.h - 10, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -90);
        }
        if (z.life <= 0) {
          this.purpleFlameZones.splice(i, 1);
        }
      }

      if (this.arenaDuel && this.arenaDuel.hp > 0 && !frozen) {
        const ai = stepArenaDuelAi(
          this.arenaDuel,
          this.player,
          this.projectiles.filter((p) => p.fromPlayer),
          this.isekaiPlatforms,
          dt,
          ISEKAI_ROOM_BOUNDS.dueling_arena,
          FLOOR_Y,
        );
        if (ai.hypeTrigger) {
          this.arenaCrowdHypeTimer = Math.max(this.arenaCrowdHypeTimer, 1.4);
        }
        if (ai.teleportBehindPlayer) {
          this.spawnBurst(this.arenaDuel.x + this.arenaDuel.w / 2, this.arenaDuel.y + 14, 14, '#a855f7');
        }
        if (ai.healAmount > 0) {
          this.spawnFloatingText(
            this.arenaDuel.x + this.arenaDuel.w / 2,
            this.arenaDuel.y - 16,
            `JACKPOT +${ai.healAmount} HP!`,
            '#4ade80',
          );
          this.spawnBurst(this.arenaDuel.x + this.arenaDuel.w / 2, this.arenaDuel.y + 16, 16, '#4ade80');
        }
        if (ai.spawnedProjectiles.length > 0) {
          this.projectiles.push(...ai.spawnedProjectiles);
        }
        if (ai.spawnedZones.length > 0) {
          this.purpleFlameZones.push(...ai.spawnedZones);
        }
        if (ai.usedSkillName) {
          this.activeCastBanner = `${this.arenaDuel.def.name}: ${ai.usedSkillName}!`;
          this.activeCastBannerTimer = 1.65;
          gameAudio.playSkill('candlefire_wave');
        }
        if (ai.meleeHitDamage > 0) {
          this.damagePlayer(ai.meleeHitDamage, ai.meleeKnockbackX);
        }
      }
      return;
    }

    const mission = this.activeMissionId
      ? GUILD_MISSIONS.find((m) => m.id === this.activeMissionId)
      : null;
    const isOutskirtsZone = this.realm === 'outskirts_forest' || this.realm === 'outskirts_caves';
    const isElfAmbush = this.realm === 'elf_kingdom' && this.elfKingdomStage === 'ambush_active';
    const isRaiderDungeon = this.realm === 'raider_dungeon';
    if (!mission && !isOutskirtsZone && !isElfAmbush && !isRaiderDungeon) return;

    // 1. Update Carriage Escort progress, burning oil zones & coordinated bandit waves (B-Rank Escorts)
    if (this.realm === 'carriage_escort' && this.carriageEscort) {
      const car = this.carriageEscort;
      const escortVariant = car.variant ?? this.bRankEscortsCompleted;
      car.hitFlash = Math.max(0, car.hitFlash - dt);
      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) z.life -= dt;
        if (
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 8, z.w - 4, z.h - 8, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -85);
        }
        if (z.life <= 0) this.purpleFlameZones.splice(i, 1);
      }
      const blockingBandits = this.isekaiEnemies.filter(
        (e) => e.state !== 'ko' && Math.abs(e.x - car.x) < 120,
      );
      if (!frozen && blockingBandits.length === 0) {
        car.x = Math.min(1040, car.x + car.speed * dt);
        car.wheelPhase += dt * 7;
        car.progress = Math.min(100, Math.round(((car.x - 150) / 890) * 100));
      }
      if (car.progress >= 30 && car.wavesSpawned < 2) {
        car.wavesSpawned = 2;
        this.isekaiEnemies.push(...createBanditWave(car.x, 1, escortVariant));
        this.showAnnouncement('Coordinated Bandit Ambush! Pyromancers & Assassins flank the Carriage!');
      } else if (car.progress >= 65 && car.wavesSpawned < 3) {
        car.wavesSpawned = 3;
        this.isekaiEnemies.push(...createBanditWave(car.x, 2, escortVariant));
        this.showAnnouncement('Final Highway Brigand Assault!');
      }
      if (car.hp <= 0) {
        this.showAnnouncement('Royal Carriage wrecked! Returning to Solaris Town...');
        this.enterIsekaiRoom('isekai_town', 478);
        return;
      }
    }

    if (isOutskirtsZone) {
      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) z.life -= dt;
        if (
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 8, z.w - 4, z.h - 8, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -85);
        }
        if (z.life <= 0) this.purpleFlameZones.splice(i, 1);
      }
      const aliveAmbient = this.isekaiEnemies.filter((e) => !e.sideQuestId && e.state !== 'ko').length;
      if (aliveAmbient === 0) {
        this.outskirtsRespawnTimer += dt;
        if (this.outskirtsRespawnTimer >= 4.0) {
          this.outskirtsRespawnTimer = 0;
          this.isekaiEnemies.push(...createOutskirtsAmbientEnemies(this.realm as 'outskirts_forest' | 'outskirts_caves', this.player.level));
          this.showAnnouncement('Fresh marauders prowled out into the Outskirts!');
        }
      } else {
        this.outskirtsRespawnTimer = 0;
      }
    }

    if (isElfAmbush) {
      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) z.life -= dt;
        if (
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 8, z.w - 4, z.h - 8, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -85);
        }
        if (z.life <= 0) this.purpleFlameZones.splice(i, 1);
      }

      // Autonomous OP Ally: Sword Saint Kaelen slices & fires Starlight Tempests in real time!
      for (const ally of this.alliedNpcs) {
        if (ally.hp <= 0) continue;
        ally.hitFlash = Math.max(0, ally.hitFlash - dt);
        ally.attackCooldown = Math.max(0, ally.attackCooldown - dt);
        ally.slashBurstTimer = Math.max(0, (ally.slashBurstTimer ?? 0) - dt);
        ally.dashTimer = Math.max(0, (ally.dashTimer ?? 0) - dt);
        if ((ally.calloutTimer ?? 0) > 0) {
          ally.calloutTimer = Math.max(0, (ally.calloutTimer ?? 0) - dt);
          if (ally.calloutTimer === 0) ally.callout = undefined;
        }
        if (frozen) continue;

        const liveTargets = this.isekaiEnemies.filter((e) => e.state !== 'ko' && e.hp > 0);
        const target = liveTargets.sort((a, b) => Math.abs(a.x - ally.x) - Math.abs(b.x - ally.x))[0];
        if (target) {
          const dx = target.x + target.w / 2 - (ally.x + 8);
          const dist = Math.abs(dx);
          ally.facing = dx >= 0 ? 1 : -1;
          if (dist > 34) {
            ally.vx = ally.facing * (dist > 140 ? 168 : 118);
            ally.walkCycle += dt * 11;
          } else {
            ally.vx *= 0.72;
          }
          ally.x = Math.max(1220, Math.min(2420, ally.x + ally.vx * dt));

          if (ally.attackCooldown <= 0) {
            if (dist < 62) {
              ally.attackCooldown = 0.62;
              ally.slashBurstTimer = 0.25;
              const kDmg = target.archetype === 'eldritch_feast_boss' ? 54 : 68;
              const res = applyDamageToEnemy(target, kDmg, ally.facing * 85);
              this.spawnFloatingText(target.x + target.w / 2, target.y - 10, `STARLIGHT ${kDmg}`, '#34d399');
              this.spawnBurst(target.x + target.w / 2, target.y + 14, 10, '#6ee7b7');
              if (res.killed) this.onIsekaiEnemyKilled(target);
              if (!ally.callout && Math.random() < 0.28) {
                ally.callout = 'Emerald Crescent — scatter!';
                ally.calloutTimer = 1.9;
              }
            } else if (dist < 280) {
              ally.attackCooldown = 0.95;
              ally.dashTimer = 0.2;
              this.projectiles.push({
                id: `kaelen_wave_${this.simTime}_${Math.random()}`,
                x: ally.x + 8 + ally.facing * 10,
                y: ally.y + 10,
                vx: ally.facing * 290,
                vy: 0,
                radius: 8,
                damage: 46,
                fromPlayer: true,
                color: '#34d399',
                life: 1.05,
                kind: 'slash_wave',
              });
              this.spawnBurst(ally.x + 8, ally.y + 12, 6, '#34d399');
            }
          }
        } else {
          const followDx = this.player.x - 42 * this.player.facing - ally.x;
          if (Math.abs(followDx) > 24) {
            ally.facing = followDx >= 0 ? 1 : -1;
            ally.vx = ally.facing * 92;
            ally.walkCycle += dt * 8;
            ally.x = Math.max(1220, Math.min(2420, ally.x + ally.vx * dt));
          }
        }
      }

      // Eldritch Feast Boss spawns pixel-gore ichor pools and bone spurs periodically
      const feastBoss = this.isekaiEnemies.find(
        (e) => e.archetype === 'eldritch_feast_boss' && e.state !== 'ko' && e.hp > 0,
      );
      if (feastBoss && !frozen && Math.random() < dt * 0.45 && this.purpleFlameZones.length < 4) {
        const isIchor = Math.random() < 0.55;
        this.purpleFlameZones.push({
          id: `elf_haz_${this.simTime}_${Math.random()}`,
          x: Math.max(1280, Math.min(2380, this.player.x - 24)),
          y: FLOOR_Y - (isIchor ? 38 : 48),
          w: isIchor ? 58 : 44,
          h: isIchor ? 38 : 48,
          life: 2.3,
          maxLife: 2.3,
          damage: isIchor ? 16 : 19,
          kind: isIchor ? 'eldritch_ichor_pool' : 'eldritch_bone_spurs',
          hasHit: false,
        });
      }
    }

    if (isRaiderDungeon) {
      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) z.life -= dt;
        if (
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 8, z.w - 4, z.h - 8, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -95);
        }
        if (z.life <= 0) this.purpleFlameZones.splice(i, 1);
      }

      if (this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0 && !frozen) {
        const step = stepRaiderDemonicBoss(
          this.raiderDemonicBoss,
          this.player.x + this.player.w / 2,
          this.player.y,
          dt,
          this.simTime,
        );
        if (step.spawnProjectiles.length > 0) {
          this.projectiles.push(...step.spawnProjectiles);
        }
        for (const z of step.spawnZones) {
          this.purpleFlameZones.push({
            id: `rdz_${this.simTime}_${Math.random()}`,
            x: z.x,
            y: z.y,
            w: z.w,
            h: z.h,
            life: z.life,
            maxLife: z.life,
            damage: z.damage,
            kind: z.kind,
            hasHit: false,
          });
        }
        if (step.screenShake > 0) {
          this.trauma = Math.min(1, this.trauma + step.screenShake);
        }
        if (step.hitPlayerDamage > 0) {
          this.damagePlayer(step.hitPlayerDamage, step.hitPlayerKnockbackX);
        }
        if (this.raiderDemonicBoss.activeSkillBanner) {
          this.activeCastBanner = this.raiderDemonicBoss.activeSkillBanner;
          this.activeCastBannerTimer = 1.6;
        }
      }
    }

    // 2. Step Isekai Enemies (Goblins, Hobgoblins, 5-Class Coordinated Bandits, Succubi, Demon Tanks, Lightning Fighters, Cave Horrors)
    for (const en of this.isekaiEnemies) {
      en.hitFlash = Math.max(0, en.hitFlash - dt);
      if (en.state === 'ko') {
        en.koTimer -= dt;
        en.x += en.vx * dt;
        en.y += en.vy * dt;
        en.vy += 320 * dt;
        continue;
      }
      if (frozen) continue;
      if ((en.stunTimer ?? 0) > 0) {
        en.stunTimer = Math.max(0, (en.stunTimer ?? 0) - dt);
        en.vx *= 0.82;
        continue;
      }
      const speedMult = this.stepEnemyStatusEffects(en, dt, true);
      if (en.hp <= 0) continue;

      const targetCar = this.realm === 'carriage_escort' && this.carriageEscort ? this.carriageEscort : null;
      const targetX =
        targetCar && Math.abs(targetCar.x + 28 - en.x) < Math.abs(this.player.x - en.x)
          ? targetCar.x + 28
          : this.player.x;
      const targetIsCarriage = targetCar && targetX === targetCar.x + 28;
      const dx = targetX - en.x;
      const dist = Math.abs(dx);
      const dmg = en.attackDamage ?? 11;
      en.stateTimer -= dt * speedMult;
      en.facing = dx >= 0 ? 1 : -1;

      if (en.isDungeonBoss && en.hp > 0) {
        en.lastSkillThresholdPct ??= 100;
        const bossHpPct = (en.hp / Math.max(1, en.maxHp)) * 100;
        if (bossHpPct <= en.lastSkillThresholdPct - 12) {
          while (en.lastSkillThresholdPct - 12 >= bossHpPct && en.lastSkillThresholdPct > 0) {
            en.lastSkillThresholdPct -= 12;
          }
          const isEldritch = en.archetype === 'eldritch_feast_boss';
          const skillDmg = Math.max(14, Math.round(dmg * 1.15));
          [-38, 0, 38].forEach((vyOff) => {
            this.projectiles.push({
              id: `ib_thresh_${en.id}_${this.simTime}_${vyOff}`,
              x: en.x + en.w / 2 + en.facing * 12,
              y: en.y + en.h * 0.45,
              vx: en.facing * 205,
              vy: vyOff,
              radius: isEldritch ? 8 : 7,
              damage: skillDmg,
              fromPlayer: false,
              color: isEldritch ? '#991b1b' : '#e879f9',
              life: 1.8,
              kind: isEldritch ? 'eldritch_ichor' : 'purple_flame',
            });
          });
          this.purpleFlameZones.push({
            id: `ibz_${en.id}_${this.simTime}`,
            x: Math.max(60, this.player.x - 24),
            y: FLOOR_Y - (isEldritch ? 48 : 42),
            w: 54,
            h: isEldritch ? 48 : 42,
            life: 2.0,
            maxLife: 2.0,
            damage: skillDmg,
            kind: isEldritch ? 'eldritch_bone_spire' : 'abyssal_nova',
            hasHit: false,
          });
          const skillTitle = isEldritch ? 'ABYSSAL GORE ERUPTION!' : 'CRIMSON OVERDRIVE!';
          this.activeCastBanner = `${en.name}: ${skillTitle}`;
          this.activeCastBannerTimer = 1.65;
          gameAudio.playSkill('candlefire_wave');
          this.spawnFloatingText(en.x + en.w / 2, en.y - 18, `12% SKILL: ${skillTitle}`, '#fde047');
        }
      }

      if (
        en.archetype === 'bandit_archer' ||
        en.archetype === 'demon_succubus' ||
        en.archetype === 'bandit_pyromancer' ||
        en.archetype === 'cultist_mage' ||
        en.archetype === 'raider_void_acolyte' ||
        en.archetype === 'raider_abyssal_imp'
      ) {
        const isSuccubus = en.archetype === 'demon_succubus' || en.archetype === 'raider_abyssal_imp';
        const isPyro =
          en.archetype === 'bandit_pyromancer' ||
          en.archetype === 'cultist_mage' ||
          en.archetype === 'raider_void_acolyte';
        if (isSuccubus) {
          const hoverY = FLOOR_Y - 68 + Math.sin(this.simTime * 3 + en.patrolOriginX) * 10;
          en.y += (hoverY - en.y) * 4 * dt;
        }
        if (en.state === 'patrol') {
          if (dist < 75) en.x -= en.facing * 42 * dt;
          else if (dist > 165) en.x += en.facing * 38 * dt;
          if (dist < 260 && en.stateTimer <= 0) {
            en.state = 'windup';
            en.stateTimer = 0.45;
          }
        } else if (en.state === 'windup' && en.stateTimer <= 0) {
          en.state = 'attack';
          en.stateTimer = 0.25;
          if (isPyro) {
            const isVoid = en.archetype === 'cultist_mage' || en.archetype === 'raider_void_acolyte';
            this.projectiles.push({
              id: `pyro_${this.simTime}_${en.id}`,
              x: en.x + en.w / 2,
              y: en.y + 8,
              vx: en.facing * 155,
              vy: -38,
              radius: 6,
              damage: dmg,
              fromPlayer: false,
              color: isVoid ? '#c084fc' : '#f97316',
              life: 1.9,
              kind: isVoid ? 'succubus_orb' : 'fireball',
            });
            this.purpleFlameZones.push({
              id: `bfz_${this.simTime}_${en.id}`,
              x: Math.max(40, targetX - 18),
              y: FLOOR_Y - 38,
              w: 36,
              h: 38,
              life: 1.25,
              maxLife: 1.25,
              damage: Math.max(8, Math.round(dmg * 0.8)),
              kind: isVoid ? 'abyssal_nova' : 'bandit_firebomb',
              hasHit: false,
            });
          } else {
            this.projectiles.push({
              id: `ispr_${this.simTime}_${en.id}`,
              x: en.x + en.w / 2,
              y: en.y + 10,
              vx: en.facing * (isSuccubus ? 165 : 185),
              vy: 0,
              radius: isSuccubus ? 5 : 4,
              damage: dmg,
              fromPlayer: false,
              color: isSuccubus ? '#ec4899' : '#fde047',
              life: 2.2,
              kind: isSuccubus ? 'succubus_orb' : 'arrow',
            });
          }
        } else if (en.state === 'attack' && en.stateTimer <= 0) {
          en.state = 'recover';
          en.stateTimer = isPyro ? 1.55 : isSuccubus ? 1.15 : 1.35;
        } else if (en.state === 'recover' && en.stateTimer <= 0) {
          en.state = 'patrol';
        }
      } else {
        if (en.archetype === 'shadow_bat' || en.archetype === 'raider_frost_wraith') {
          const hoverY = FLOOR_Y - 56 + Math.sin(this.simTime * 5 + en.patrolOriginX) * 14;
          en.y += (hoverY - en.y) * 5 * dt;
        }
        const spd =
          en.archetype === 'demon_lightning' ||
          en.archetype === 'shadow_bat' ||
          en.archetype === 'raider_frost_wraith' ||
          en.archetype === 'eldritch_ichor_hound'
            ? 88
            : en.archetype === 'bandit_assassin' ||
                en.archetype === 'gargoyle_charger' ||
                en.archetype === 'raider_spore_stalker'
              ? 94
              : en.archetype === 'demon_tank' ||
                  en.archetype === 'bandit_brute' ||
                  en.archetype === 'cursed_armor' ||
                  en.archetype === 'raider_iron_golem' ||
                  en.archetype === 'eldritch_feast_boss'
                ? 46
                : en.archetype === 'hobgoblin' || en.archetype === 'raider_hell_executioner' || en.archetype === 'eldritch_tendril_fiend'
                  ? 54
                  : 58;
        if (en.state === 'patrol') {
          if (dist > 26 && dist < 340) en.vx = en.facing * spd;
          else if (dist <= 26) {
            en.vx = 0;
            en.state = 'windup';
            en.stateTimer =
              en.archetype === 'demon_lightning' ||
              en.archetype === 'bandit_assassin' ||
              en.archetype === 'eldritch_ichor_hound'
                ? 0.24
                : 0.42;
          }
        } else if (en.state === 'windup' && en.stateTimer <= 0) {
          en.state = 'attack';
          en.stateTimer = 0.24;
          en.vx =
            en.facing *
            (en.archetype === 'demon_lightning' ||
            en.archetype === 'bandit_assassin' ||
            en.archetype === 'gargoyle_charger' ||
            en.archetype === 'eldritch_ichor_hound'
              ? 185
              : 74);
          if (targetIsCarriage && targetCar && dist < 40) {
            targetCar.hp = Math.max(0, targetCar.hp - dmg);
            targetCar.hitFlash = 0.2;
            this.spawnFloatingText(targetCar.x + 28, targetCar.y - 6, `-${dmg}`, '#f87171');
          } else if (Math.abs(this.player.x - en.x) < 42 && Math.abs(this.player.y - en.y) < 42) {
            this.damagePlayer(
              dmg,
              en.facing * (en.archetype === 'bandit_brute' || en.archetype === 'demon_tank' || en.archetype === 'eldritch_feast_boss' ? 180 : 120),
            );
          }
        } else if (en.state === 'attack' && en.stateTimer <= 0) {
          en.state = 'recover';
          en.stateTimer = en.archetype === 'demon_lightning' || en.archetype === 'bandit_assassin' ? 0.52 : 0.78;
        } else if (en.state === 'recover' && en.stateTimer <= 0) {
          en.state = 'patrol';
        }
        en.x += en.vx * dt;
        en.vx *= 0.86;
      }
      const rb = ISEKAI_ROOM_BOUNDS[this.realm];
      if (this.realm !== 'goblin_dungeon' && this.realm !== 'demon_realm' && this.realm !== 'raider_dungeon') {
        en.x = Math.max(rb.minX, Math.min(rb.maxX - en.w, en.x));
      } else if (this.realm === 'raider_dungeon') {
        const rd = this.activeRaiderDungeonId ? getRaiderDungeonById(this.activeRaiderDungeonId) : null;
        const maxFloorX = rd && this.activeRaiderFloor >= rd.floors ? 1260 : 1680;
        en.x = Math.max(40, Math.min(maxFloorX - en.w, en.x));
      } else {
        en.x = Math.max(120, en.x);
      }
    }
    this.isekaiEnemies = this.isekaiEnemies.filter((e) => !(e.state === 'ko' && e.koTimer <= 0));

    // Elf Kingdom Wave 1 -> Wave 2 -> Emerald Coronation Cutscene
    if (isElfAmbush) {
      const aliveCount = this.isekaiEnemies.filter((e) => e.state !== 'ko' && e.hp > 0).length;
      if (aliveCount === 0) {
        if (this.elfAmbushWave === 1) {
          this.elfAmbushWave = 2;
          this.elfAmbushBossName = 'Malakor, the Feast-Devourer';
          this.isekaiEnemies = createElfAmbushWave(2, this.player.level);
          const kaelen = this.alliedNpcs[0];
          if (kaelen) {
            kaelen.hp = Math.min(kaelen.maxHp, kaelen.hp + 450);
            kaelen.callout = 'Here comes their Feast-Devourer! Cut its marrow loose!';
            kaelen.calloutTimer = 2.8;
          }
          this.trauma = 0.7;
          gameAudio.playMegaGlitchCrash();
          this.showSecretCaption(
            'WAVE 2/2 · MALAKOR, THE FEAST-DEVOURER!',
            'The grotesque eldritch Alpha erupts from the ruined banquet table!',
          );
        } else {
          this.isekaiEnemies = [];
          this.purpleFlameZones = [];
          this.elfAmbushBossName = null;
          this.elfCutscene = {
            act: 'coronation',
            beats: buildElfCoronationCutsceneBeats(),
            beatIndex: 0,
            chosenReply: null,
          };
          gameAudio.playSecretFound();
          this.emitHud(true);
        }
      }
    }

    // Raider Guild Dungeon: unlock floor stairs once all floor monsters are slain
    if (isRaiderDungeon && this.activeRaiderDungeonId) {
      const aliveCount = this.isekaiEnemies.filter((e) => e.state !== 'ko' && e.hp > 0).length;
      const stairsProp = this.isekaiInteractables.find((p) => p.kind === 'raider_floor_stairs');
      if (stairsProp && !stairsProp.activated && aliveCount === 0) {
        stairsProp.activated = true;
        gameAudio.playSecretFound();
        this.spawnBurst(stairsProp.x + stairsProp.w / 2, stairsProp.y + 18, 18, '#fbbf24');
        this.showAnnouncement(`Floor ${this.activeRaiderFloor} Cleared! Ascending Staircase UNLOCKED!`);
        this.emitHud(true);
      }
    }

    if (!mission) return;

    // 3. Step 1-by-1 Demon Kings + Allied Vanguard Squad (Harold, Elise & Arch-Cleric Aria!)
    if (this.realm === 'demon_king_arena') {
      const activeKing = this.demonKings.find(
        (k) => !k.defeated && k.hp > 0 && k.index === this.activeDemonKingStage,
      );

      for (const ally of this.alliedNpcs) {
        if (ally.hp <= 0) continue;
        ally.hitFlash = Math.max(0, ally.hitFlash - dt);
        ally.attackCooldown = Math.max(0, ally.attackCooldown - dt);
        if (ally.healCooldown !== undefined) {
          ally.healCooldown = Math.max(0, ally.healCooldown - dt);
          if (ally.healCooldown <= 0 && !frozen) {
            ally.healCooldown = 4.6;
            if (this.player.hp < this.player.maxHp) {
              const pHeal = 18;
              this.player.hp = Math.min(this.player.maxHp, this.player.hp + pHeal);
              this.spawnFloatingText(this.player.x + 8, this.player.y - 12, `+${pHeal} HEAL`, '#6ee7b7');
            }
            for (const other of this.alliedNpcs) {
              if (other.hp > 0 && other.hp < other.maxHp) {
                other.hp = Math.min(other.maxHp, other.hp + 28);
              }
            }
            this.spawnBurst(ally.x + 8, ally.y + 8, 10, '#6ee7b7');
          }
        }
        if (frozen) continue;

        const targetEnemy = this.isekaiEnemies.find((e) => e.state !== 'ko');
        const tx = targetEnemy
          ? targetEnemy.x + targetEnemy.w / 2
          : activeKing
            ? activeKing.x + activeKing.w / 2
            : this.player.x + 40;
        const dx = tx - (ally.x + 8);
        const dist = Math.abs(dx);
        ally.facing = dx >= 0 ? 1 : -1;

        const desiredDist = ally.role === 'mage' ? 140 : 32;
        if (dist > desiredDist) {
          ally.vx = ally.facing * (ally.role === 'lancer' ? 78 : 66);
          ally.walkCycle += dt * 9;
        } else {
          ally.vx *= 0.78;
        }
        ally.x = Math.max(24, Math.min(1380, ally.x + ally.vx * dt));

        if (ally.attackCooldown <= 0) {
          if (ally.role === 'mage' && dist < 290 && (targetEnemy || activeKing)) {
            ally.attackCooldown = 1.6;
            this.projectiles.push({
              id: `ally_bolt_${ally.id}_${this.simTime}`,
              x: ally.x + 8,
              y: ally.y + 10,
              vx: ally.facing * 205,
              vy: 0,
              radius: 5,
              damage: 18,
              fromPlayer: true,
              color: '#fde047',
              life: 1.5,
              kind: 'rune',
            });
          } else if (ally.role !== 'mage' && dist < 44) {
            ally.attackCooldown = ally.role === 'lancer' ? 0.95 : 1.15;
            const allyDmg = ally.role === 'lancer' ? 24 : 28;
            if (targetEnemy) {
              const res = applyDamageToEnemy(targetEnemy, allyDmg, ally.facing * 65);
              this.spawnFloatingText(targetEnemy.x + 8, targetEnemy.y - 6, `${allyDmg}`, '#6ee7b7');
              if (res.killed) this.onIsekaiEnemyKilled(targetEnemy);
            } else if (activeKing && !activeKing.defeated) {
              activeKing.hp = Math.max(0, activeKing.hp - allyDmg);
              activeKing.hitFlash = 0.12;
              this.spawnFloatingText(activeKing.x + activeKing.w / 2, activeKing.y - 6, `${allyDmg}`, '#6ee7b7');
              if (activeKing.hp <= 0) {
                activeKing.defeated = true;
                this.onDemonKingDefeated(activeKing);
              }
            }
          }
        }
      }

      if (activeKing) {
        activeKing.hitFlash = Math.max(0, activeKing.hitFlash - dt);
        if (activeKing.activeSkillTimer > 0) {
          activeKing.activeSkillTimer = Math.max(0, activeKing.activeSkillTimer - dt);
          if (activeKing.activeSkillTimer === 0) activeKing.activeSkillBanner = null;
        }
        if ((activeKing.stunTimer ?? 0) > 0) {
          activeKing.stunTimer = Math.max(0, (activeKing.stunTimer ?? 0) - dt);
        }
        if (!activeKing.defeated && activeKing.hp > 0 && !frozen && (activeKing.stunTimer ?? 0) <= 0) {
          const dx = this.player.x - activeKing.x;
          const dist = Math.abs(dx);
          activeKing.facing = dx >= 0 ? 1 : -1;
          const isBerserk = activeKing.specialAbility === 'berserk_fury' && activeKing.hp <= activeKing.maxHp * 0.5;
          const speedMultKing = isBerserk ? 1.45 : 1;
          if (dist > 64) {
            activeKing.vx += activeKing.facing * 52 * speedMultKing * dt;
          }
          activeKing.x = Math.max(36, Math.min(1380, activeKing.x + activeKing.vx * dt));
          activeKing.vx *= 0.88;

          activeKing.purpleFlameTimer -= dt * speedMultKing;
          if (activeKing.purpleFlameTimer <= 0) {
            activeKing.purpleFlameTimer = isBerserk ? 1.4 : 2.0;
            activeKing.castIndex += 1;
            const cast = createDemonKingPurpleFlameCast(activeKing, activeKing.castIndex, this.player.x, FLOOR_Y);
            activeKing.activeSkillBanner = cast.skillName;
            activeKing.activeSkillTimer = 1.4;
            this.activeCastBanner = `${activeKing.name}: ${cast.skillName}!`;
            this.activeCastBannerTimer = 1.6;
            this.purpleFlameZones.push(...cast.zones);
            this.projectiles.push(...cast.projectiles);
            this.spawnBurst(activeKing.x + activeKing.w / 2, activeKing.y + 18, 12, activeKing.auraColor || '#c084fc');
            gameAudio.playSkill('candlefire_wave');
          }

          // Unique Manhwa Demon King Special Abilities!
          if (activeKing.specialAbility) {
            activeKing.specialTimer = (activeKing.specialTimer ?? 4.5) - dt;
            if (activeKing.specialTimer <= 0) {
              activeKing.specialTimer = 5.2;
              const ab = activeKing.specialAbility;
              const dmgS = Math.round(16 * (activeKing.damageMult ?? 1));
              if (ab === 'shadow_arise' && this.isekaiEnemies.length < 4) {
                const wave = createDemonKingStageMinions(activeKing.index, true).slice(0, 1);
                wave.forEach((w, idx) => {
                  w.id = `${w.id}_arise_${Math.round(this.simTime)}_${idx}`;
                  w.name = `Shadow Summon (${w.name})`;
                });
                this.isekaiEnemies.push(...wave);
                this.activeCastBanner = `${activeKing.name}: ARISE — SHADOW LEGION!`;
                this.activeCastBannerTimer = 1.8;
              } else if (ab === 'estate_bastion' || ab === 'nano_swarm' || ab === 'eclipse_doom') {
                activeKing.shieldHp = Math.min(260, (activeKing.shieldHp ?? 0) + 90);
                this.activeCastBanner = `${activeKing.name}: DIVINE SHIELD (+90)!`;
                this.activeCastBannerTimer = 1.6;
              } else if (ab === 'spatial_cut' || ab === 'gacha_summon' || ab === 'star_meteor' || ab === 'frost_domain') {
                [-70, 0, 70].forEach((off, idx) => {
                  this.projectiles.push({
                    id: `sp_${activeKing.id}_${this.simTime}_${idx}`,
                    x: Math.max(40, Math.min(1340, this.player.x + off)),
                    y: 12,
                    vx: 0,
                    vy: 175,
                    radius: 9,
                    damage: dmgS,
                    fromPlayer: false,
                    color: activeKing.weaponColor || activeKing.auraColor,
                    life: 2.0,
                    kind: 'purple_meteor',
                  });
                });
                this.activeCastBanner = `${activeKing.name}: SIGNATURE MANHWA BARRAGE!`;
                this.activeCastBannerTimer = 1.6;
              } else if (ab === 'blood_drain') {
                const siphon = 35;
                activeKing.hp = Math.min(activeKing.maxHp, activeKing.hp + siphon);
                this.spawnFloatingText(activeKing.x + activeKing.w / 2, activeKing.y - 12, `SIPHON +${siphon}`, '#ef4444');
              } else if (ab === 'dragon_fear' || ab === 'gravity_crush' || ab === 'soul_burn') {
                this.purpleFlameZones.push({
                  id: `spz_${activeKing.id}_${this.simTime}`,
                  x: Math.max(30, this.player.x - 28),
                  y: FLOOR_Y - 78,
                  w: 56,
                  h: 78,
                  life: 1.2,
                  maxLife: 1.2,
                  damage: dmgS,
                  kind: 'abyssal_nova',
                  hasHit: false,
                });
              }
            }
          }
        }
      }

      for (let i = this.purpleFlameZones.length - 1; i >= 0; i--) {
        const z = this.purpleFlameZones[i];
        if (!frozen) {
          z.life -= dt;
        }
        if (
          !z.hasHit &&
          rectsOverlap(z.x + 2, z.y + 10, z.w - 4, z.h - 10, this.player.x, this.player.y, this.player.w, this.player.h)
        ) {
          z.hasHit = true;
          this.damagePlayer(z.damage, this.player.facing * -90);
        }
        if (z.life <= 0) {
          this.purpleFlameZones.splice(i, 1);
        }
      }
    }

    // 4. Contract / Mission Completion Check!
    // Endless Dungeons reward you IN-PLACE and NEVER teleport you away!
    if (
      (this.realm === 'goblin_dungeon' || this.realm === 'demon_realm') &&
      !this.endlessContractClaimed &&
      this.isekaiKillsDone >= this.isekaiKillsRequired
    ) {
      this.claimEndlessDungeonContract();
      return;
    }

    let completed = false;
    if (this.realm === 'carriage_escort' && this.carriageEscort) {
      completed = this.carriageEscort.progress >= 100 && this.isekaiEnemies.length === 0;
    } else if (this.realm === 'demon_king_arena') {
      completed = this.demonKings.length > 0 && this.demonKings.every((dk) => dk.defeated || dk.hp <= 0);
    }

    if (completed) {
      this.onIsekaiMissionComplete(mission.id);
    }
  }

  private onIsekaiMissionComplete(missionId: GuildMissionId): void {
    const mission = GUILD_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;
    this.activeMissionId = null;
    this.isekaiEnemies = [];
    this.purpleFlameZones = [];
    this.projectiles = [];
    this.activeCastBanner = null;
    this.player.gold += mission.rewardGold;
    this.player.statPoints += mission.id === 's_seventeen_demon_kings' ? 30 : 6;
    const promo = promoteGuildRankAfterMission(
      this.guildRank,
      mission.id,
      this.inventory,
      this.bRankEscortsCompleted,
      this.rankMissionsCompleted,
    );
    this.guildRank = promo.nextRank;
    this.bRankEscortsCompleted = promo.nextBRankEscorts;
    this.rankMissionsCompleted = promo.nextRankMissionsCompleted;
    addInventoryResource(this.inventory, 'crimson_vial', 1);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'guild:mission_complete', missionId, newRank: this.guildRank }));
    }

    if (mission.id === 'a_three_demon_kings') {
      this.coronationCutscene = {
        timer: 4.5,
        duration: 4.5,
      };
      gameAudio.playSecretFound();
      this.emitHud(true);
      return;
    }

    this.enterIsekaiRoom('isekai_town', 478);
    gameAudio.playSecretFound();
    if (mission.id === 's_seventeen_demon_kings') {
      this.showSecretCaption(
        '17 MANHWA DEMON KINGS PANTHEON CONQUERED!',
        `Unbelievable! +${mission.rewardGold}G & +30 Stat Points awarded to Supreme S-Rank Sovereign!`,
      );
      this.openDialogue('Commander Aerin', 'throne', '#fbbf24', [
        'All 17 Demon Kings from across the Manhwa Pantheon have knelt before your blade!',
        `+${mission.rewardGold}G & +30 Stat Points bestowed! Solaris Town honors you forever!`,
      ]);
      void this.saveCurrentGame('autosave', true);
      this.emitHud(true);
      return;
    }
    const isEscortProgress = mission.id === 'b_princess_carriage' && !promo.promoted;
    this.showSecretCaption(
      promo.promoted
        ? `PROMOTED TO ${promo.nextRank}-RANK ADVENTURER!`
        : `CONTRACT CLEARED (${this.rankMissionsCompleted}/${MISSIONS_REQUIRED_PER_RANK})`,
      isEscortProgress
        ? `Princess Aurelia arrived safely! (${this.rankMissionsCompleted}/${MISSIONS_REQUIRED_PER_RANK} towards A-Rank!)`
        : `+${mission.rewardGold}G & +6 Stat Points earned! Speak to Receptionist Luna at the Guild!`,
    );
    this.openDialogue(mission.floorReq === 2 ? 'Commander Aerin' : 'Receptionist Luna', 'npc', '#38bdf8', [
      `Splendid work! "${mission.title}" is officially stamped COMPLETE!`,
      promo.promoted
        ? `Here is your gleaming ${promo.nextRank}-Rank Guild Badge! New expeditions are unlocked!`
        : `Progress: ${this.rankMissionsCompleted}/${MISSIONS_REQUIRED_PER_RANK} missions for your next rank! Reward +${mission.rewardGold}G delivered.`,
    ]);
    void this.saveCurrentGame('autosave', true);
    this.emitHud(true);
  }

  private stepProjectiles(chunks: GeneratedChunk[], dt: number, frozen: boolean): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      if (!pr.fromPlayer && frozen) continue;

      if (pr.kind === 'gyro_ball' && pr.fromPlayer && pr.boomerangAge !== undefined) {
        pr.boomerangAge += dt;
        if (!pr.boomerangReturn && pr.boomerangAge >= 0.34) {
          pr.boomerangReturn = true;
          pr.hitTargetIds = [];
        }
        if (pr.boomerangReturn) {
          const tx = this.player.x + 8;
          const ty = this.player.y + 12;
          const dx = tx - pr.x;
          const dy = ty - pr.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 18) {
            this.projectiles.splice(i, 1);
            continue;
          }
          const spd = 430;
          pr.vx = (dx / Math.max(1, dist)) * spd;
          pr.vy = (dy / Math.max(1, dist)) * spd;
        }
      }

      if (!pr.fromPlayer && pr.homingStrength) {
        const pCx = this.player.x + this.player.w / 2;
        const pCy = this.player.y + this.player.h / 2;
        const dx = pCx - pr.x;
        const dy = pCy - pr.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        pr.vx += (dx / dist) * pr.homingStrength * dt;
        pr.vy += (dy / dist) * pr.homingStrength * dt;
      }
      if (!pr.fromPlayer && pr.gravityScale) {
        pr.vy += 760 * pr.gravityScale * dt;
      }
      if (!pr.fromPlayer && pr.pullPlayerStrength) {
        const distP = Math.abs(pr.x - (this.player.x + this.player.w / 2));
        if (distP > 12 && distP < 240) {
          const pullDir = Math.sign(pr.x - (this.player.x + this.player.w / 2));
          this.player.x += pullDir * pr.pullPlayerStrength * dt;
        }
      }

      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      if (pr.bounceFloor && pr.y + pr.radius >= FLOOR_Y && pr.vy > 0) {
        pr.y = FLOOR_Y - pr.radius;
        pr.vy = -Math.abs(pr.vy) * 0.78;
      }
      pr.life -= dt;

      if (pr.life <= 0) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (pr.fromPlayer) {
        const isBoomerang = Boolean(pr.kind === 'gyro_ball' && pr.boomerangAge !== undefined);
        const kbMag = isBoomerang ? 260 : 90;
        const alreadyHit = pr.hitTargetIds;
        let hit = false;

        for (const ch of chunks) {
          for (const en of ch.enemies) {
            if (en.state === 'ko' || alreadyHit?.includes(en.id)) continue;
            if (rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, en.x, en.y, en.w, en.h)) {
              alreadyHit?.push(en.id);
              const res = applyDamageToEnemy(en, pr.damage, (Math.sign(pr.vx) || this.player.facing) * kbMag);
              this.spawnFloatingText(en.x + 8, en.y - 4, `${pr.damage}`, isBoomerang ? '#4ade80' : '#fb923c');
              this.spawnBurst(pr.x, pr.y, 8, pr.color);
              if (res.killed) this.onEnemyKilled(en);
              hit = true;
              if (!isBoomerang) break;
            }
          }
          if ((!hit || isBoomerang) && ch.boss && !ch.boss.defeated && canPlayerEngageBoss(this.worldRole)) {
            const b = ch.boss;
            const bKey = `boss_${b.def.index}`;
            if (!alreadyHit?.includes(bKey) && rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, b.x, b.y, b.w, b.h)) {
              alreadyHit?.push(bKey);
              const res = applyDamageToBoss(b, pr.damage, (Math.sign(pr.vx) || this.player.facing) * (isBoomerang ? 140 : 50));
              if (isBoomerang) {
                this.bossCritCount += 1;
              }
              this.spawnFloatingText(b.x + 12, b.y - 6, `${pr.damage}`, isBoomerang ? '#4ade80' : '#fb923c');
              this.spawnBurst(pr.x, pr.y, 10, pr.color);
              if (res.defeatedNow) this.onBossDefeated(b);
              hit = true;
            }
          }
        }
        if (!hit || isBoomerang) {
          for (const en of this.isekaiEnemies) {
            if (en.state === 'ko' || alreadyHit?.includes(en.id)) continue;
            if (rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, en.x, en.y, en.w, en.h)) {
              alreadyHit?.push(en.id);
              const res = applyDamageToEnemy(en, pr.damage, (Math.sign(pr.vx) || this.player.facing) * kbMag);
              this.spawnFloatingText(en.x + 8, en.y - 4, `${pr.damage}`, isBoomerang ? '#4ade80' : '#fb923c');
              this.spawnBurst(pr.x, pr.y, 8, pr.color);
              if (res.killed) this.onIsekaiEnemyKilled(en);
              hit = true;
              if (!isBoomerang) break;
            }
          }
        }
        if (!hit || isBoomerang) {
          for (const dk of this.demonKings) {
            if (dk.defeated || dk.hp <= 0 || dk.index !== this.activeDemonKingStage || alreadyHit?.includes(dk.id)) continue;
            if (rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, dk.x, dk.y, dk.w, dk.h)) {
              alreadyHit?.push(dk.id);
              const dkDmg = dk.windVulnerable ? Math.round(pr.damage * (1 + WIND_ORB_DAMAGE_BONUS)) : pr.damage;
              this.damageDemonKing(dk, dkDmg, isBoomerang ? (Math.sign(pr.vx) || 1) * 110 : 0);
              hit = true;
              if (!isBoomerang) break;
            }
          }
        }
        if ((!hit || isBoomerang) && this.realm === 'isekai_town' && this.townRaid && this.townRaid.hp > 0) {
          const raid = this.townRaid;
          const rKey = `raid_${raid.raiderId}`;
          if (!alreadyHit?.includes(rKey) && rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, raid.x, raid.y, raid.w, raid.h)) {
            alreadyHit?.push(rKey);
            const rDmg = raid.windVulnerable ? Math.round(pr.damage * (1 + WIND_ORB_DAMAGE_BONUS)) : pr.damage;
            raid.hp = Math.max(0, raid.hp - rDmg);
            raid.hitFlash = 0.14;
            if (isBoomerang) raid.vx = (Math.sign(pr.vx) || 1) * 140;
            this.spawnFloatingText(raid.x + raid.w / 2, raid.y - 6, `${rDmg}`, '#fde047');
            this.spawnBurst(pr.x, pr.y, 10, '#38bdf8');
            if (raid.hp <= 0) this.onTownRaidDefeated();
            hit = true;
          }
        }
        if ((!hit || isBoomerang) && this.realm === 'dueling_arena' && this.arenaDuel && this.arenaDuel.hp > 0) {
          const duel = this.arenaDuel;
          const aKey = `arena_${duel.challengerId}`;
          if (!alreadyHit?.includes(aKey) && rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, duel.x, duel.y, duel.w, duel.h)) {
            alreadyHit?.push(aKey);
            if (duel.invulnTimer > 0) {
              this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 12, 'DODGED!', '#cbd5e1');
            } else {
              const rawDmg = duel.windVulnerable ? Math.round(pr.damage * (1 + WIND_ORB_DAMAGE_BONUS)) : pr.damage;
              const aDmg = duel.guardTimer > 0 ? Math.max(1, Math.round(rawDmg * 0.3)) : rawDmg;
              duel.hp = Math.max(0, duel.hp - aDmg);
              duel.hitFlash = 0.14;
              if (isBoomerang) duel.vx = (Math.sign(pr.vx) || 1) * 150;
              this.arenaCrowdHypeTimer = 0.85;
              this.spawnFloatingText(duel.x + duel.w / 2, duel.y - 6, `${aDmg}`, '#fde047');
              this.spawnBurst(pr.x, pr.y, 10, duel.def.auraColor);
              if (duel.hp <= 0) {
                this.handleArenaRoundEnd('player');
              }
            }
            hit = true;
          }
        }
        if ((!hit || isBoomerang) && this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
          const rb = this.raiderDemonicBoss;
          const rbKey = `raider_boss_${rb.dungeonId}`;
          if (!alreadyHit?.includes(rbKey) && rectsOverlap(pr.x - pr.radius, pr.y - pr.radius, pr.radius * 2, pr.radius * 2, rb.x, rb.y, rb.w, rb.h)) {
            alreadyHit?.push(rbKey);
            rb.hp = Math.max(0, rb.hp - pr.damage);
            rb.hitFlash = 0.14;
            if (isBoomerang) rb.vx = (Math.sign(pr.vx) || 1) * 110;
            this.spawnFloatingText(rb.x + rb.w / 2, rb.y - 6, `${pr.damage}`, '#fde047');
            this.spawnBurst(pr.x, pr.y, 12, rb.auraColor);
            if (rb.hp <= 0) this.completeRaiderDungeonVictory();
            hit = true;
          }
        }
        if (hit) {
          gameAudio.playHit(isBoomerang);
          if (pr.id.startsWith('kq_')) {
            this.spawnBurst(pr.x, pr.y, 26, '#f472b6');
            this.spawnFloatingText(pr.x, pr.y - 14, 'PRIMARY BOMB!', '#f9a8d4');
            this.trauma = Math.min(1, this.trauma + 0.35);
          }
          if (!isBoomerang) {
            this.projectiles.splice(i, 1);
          }
        }
      } else {
        if (
          this.realm === 'carriage_escort' &&
          this.carriageEscort &&
          rectsOverlap(
            pr.x - pr.radius,
            pr.y - pr.radius,
            pr.radius * 2,
            pr.radius * 2,
            this.carriageEscort.x,
            this.carriageEscort.y,
            56,
            46,
          )
        ) {
          this.carriageEscort.hp = Math.max(0, this.carriageEscort.hp - pr.damage);
          this.carriageEscort.hitFlash = 0.2;
          this.spawnFloatingText(this.carriageEscort.x + 28, this.carriageEscort.y - 6, `-${pr.damage}`, '#f87171');
          this.projectiles.splice(i, 1);
          continue;
        }
        if (
          rectsOverlap(
            pr.x - pr.radius,
            pr.y - pr.radius,
            pr.radius * 2,
            pr.radius * 2,
            this.player.x,
            this.player.y,
            this.player.w,
            this.player.h,
          )
        ) {
          if ((this.player.whiteAuraTimer ?? 0) > 0) {
            continue;
          }
          // Parry or Stand Guard reflects enemy projectiles!
          if ((this.player.standGuardTimer ?? 0) > 0) {
            pr.fromPlayer = true;
            pr.vx = -pr.vx * 1.45;
            pr.damage = Math.round(pr.damage * 1.8);
            pr.color = '#f0abfc';
            gameAudio.playHit(true);
            this.spawnFloatingText(this.player.x + 8, this.player.y - 12, 'STAND DEFLECT!', '#f0abfc');
          } else if (this.player.parryTimer > 0) {
            pr.fromPlayer = true;
            pr.vx = -pr.vx * 1.4;
            pr.damage = Math.round(pr.damage * 2);
            pr.color = '#fbbf24';
            gameAudio.playHit(true);
            this.spawnFloatingText(this.player.x + 8, this.player.y - 10, 'DEFLECT!', '#fbbf24');
          } else {
            if (pr.drainStamina) {
              this.player.stamina = Math.max(0, this.player.stamina - pr.drainStamina);
            }
            if (pr.slowSeconds) {
              this.arenaSlowTimer = Math.max(this.arenaSlowTimer, pr.slowSeconds);
              this.spawnFloatingText(this.player.x + 8, this.player.y - 20, "DON'T MOVE!", '#fde047');
            }
            this.damagePlayer(pr.damage, Math.sign(pr.vx) * 100);
            this.projectiles.splice(i, 1);
          }
        }
      }
    }
  }

  private damagePlayer(amount: number, knockbackX: number): void {
    if ((this.player.whiteAuraTimer ?? 0) > 0) return;

    if ((this.player.standGuardTimer ?? 0) > 0) {
      gameAudio.playHit(false);
      this.spawnBurst(this.player.x + 8, this.player.y + 10, 10, '#f0abfc');
      this.spawnFloatingText(this.player.x + 8, this.player.y - 14, 'STAND GUARD!', '#f0abfc');
      this.resolveStandGuardTick(this.realm === 'citadel' ? this.getActiveChunks() : []);
      return;
    }

    if (this.player.invulnTimer > 0) return;

    if (this.player.parryTimer > 0) {
      this.player.parryTimer = 0;
      this.player.invulnTimer = 0.4;
      gameAudio.playHit(true);
      this.hitstopTimer = 0.05;
      this.spawnFloatingText(this.player.x + 8, this.player.y - 10, 'COUNTER!', '#fbbf24');
      this.resolveMeleeHits(this.getActiveChunks(), 1.8);
      return;
    }

    this.player.hp = Math.max(0, this.player.hp - amount);
    this.player.invulnTimer = 0.65;
    this.player.hitFlash = 0.14;
    this.player.vx = knockbackX;
    this.player.vy = -120;
    this.trauma = Math.min(1, this.trauma + 0.55);
    this.hitstopTimer = 0.04;
    gameAudio.playHit(true);
    this.spawnFloatingText(this.player.x + 8, this.player.y - 8, `-${amount}`, '#ef4444');
    this.spawnBurst(this.player.x + 8, this.player.y + 12, 12, '#ef4444');

    if (this.player.hp <= 0) {
      if (this.realm === 'dueling_arena' && this.arenaDuel) {
        this.handleArenaRoundEnd('opponent');
        return;
      }
      this.setStatus('gameover');
    } else {
      this.emitHud();
    }
  }

  private spawnBurst(x: number, y: number, count: number, color: string): void {
    for (let i = 0; i < count; i++) {
      const p = this.particles[this.particleCursor];
      this.particleCursor = (this.particleCursor + 1) % this.particles.length;
      const ang = Math.random() * Math.PI * 2;
      const spd = 25 + Math.random() * 95;
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(ang) * spd;
      p.vy = Math.sin(ang) * spd - 30;
      p.maxLife = 0.25 + Math.random() * 0.3;
      p.life = p.maxLife;
      p.size = Math.random() > 0.5 ? 3 : 2;
      p.color = color;
    }
  }

  private spawnFloatingText(x: number, y: number, text: string, color: string): void {
    const f = this.floatingNums[this.floatCursor];
    this.floatCursor = (this.floatCursor + 1) % this.floatingNums.length;
    f.active = true;
    f.x = x;
    f.y = y;
    f.vy = -34;
    f.text = text;
    f.color = color;
    f.life = 0.75;
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      if (!p.active) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 180 * dt;
      p.life -= dt;
      if (p.life <= 0) p.active = false;
    }
    for (const f of this.floatingNums) {
      if (!f.active) continue;
      f.y += f.vy * dt;
      f.life -= dt;
      if (f.life <= 0) f.active = false;
    }
    for (const a of this.afterimages) {
      if (!a.active) continue;
      a.life -= dt;
      if (a.life <= 0) a.active = false;
    }
    if (Math.abs(this.player.vx) > 195 && Math.floor(this.simTime * 30) % 2 === 0) {
      this.spawnAfterimage('#e2e8f0');
    }
  }

  private updateAmbientMotes(dt: number): void {
    for (const m of this.ambientMotes) {
      m.y += m.vy * dt;
      m.x += Math.sin(this.simTime * 1.8 + m.phase) * 8 * dt;
      if (m.y < 8) {
        m.y = FLOOR_Y - 4;
        m.x = (m.x + 73) % PIXEL_W;
      }
      if (m.x < 0) m.x += PIXEL_W;
      if (m.x >= PIXEL_W) m.x -= PIXEL_W;
    }
  }

  private spawnAfterimage(color: string): void {
    const a = this.afterimages[this.afterimageCursor];
    this.afterimageCursor = (this.afterimageCursor + 1) % this.afterimages.length;
    a.active = true;
    a.x = this.player.x;
    a.y = this.player.y;
    a.facing = this.player.facing;
    a.life = 0.24;
    a.color = color;
  }

  private render(): void {
    const ctx = this.ctx;
    if (this.labelCtx && this.labelCanvas) {
      this.labelCtx.clearRect(0, 0, this.labelCanvas.width, this.labelCanvas.height);
    }
    const shakeAmt = this.trauma * this.trauma * 6;
    const shakeX = shakeAmt > 0.1 ? (Math.random() - 0.5) * shakeAmt : 0;
    const shakeY = shakeAmt > 0.1 ? (Math.random() - 0.5) * shakeAmt : 0;
    const renderCamX = this.camX + shakeX;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.scale(RENDER_SCALE, RENDER_SCALE);
    ctx.translate(0, Math.round(shakeY * RENDER_SCALE) / RENDER_SCALE);

    // Short animated Caravan Ride transition pause
    if (this.caravanRide && this.status === 'playing') {
      const cr = this.caravanRide;
      const prog = Math.max(0, Math.min(1, 1 - cr.timer / Math.max(0.1, cr.duration)));
      drawCaravanRideCutscene(ctx, this.labelCtx, cr.label, prog, this.simTime);
      ctx.restore();
      return;
    }

    // Royal S-Rank Coronation Cutscene Layer
    if (this.coronationCutscene && this.status === 'playing') {
      const cc = this.coronationCutscene;
      const elapsed = cc.duration - cc.timer;
      const prog = Math.max(0, Math.min(1, elapsed / cc.duration));
      const phase: CoronationCutsceneHud['phase'] =
        prog < 0.35 ? 'approach' : prog < 0.72 ? 'crowning' : 'cheering';
      const subtitle =
        phase === 'approach'
          ? 'All 3 Demon Kings have fallen — Solaris Cathedral opens!'
          : phase === 'crowning'
            ? 'The Sovereign Crown descends upon the Hero of Solaris!'
            : 'Long live our new S-Rank Royalty! The whole town rejoices!';
      drawCoronationCutscene(
        ctx,
        { phase, progress: prog, subtitle },
        this.player.customization,
        this.simTime,
      );
      ctx.restore();
      return;
    }

    const biome = this.status === 'title' ? 'castle' : this.getCurrentBiome();

    if (this.bossBattle && this.status === 'playing') {
      ctx.translate(Math.round(shakeX * RENDER_SCALE) / RENDER_SCALE, 0);
      const b = this.bossBattle;
      const prog =
        b.phaseDuration > 0 ? Math.min(1, 1 - b.phaseTimer / b.phaseDuration) : 1;
      drawPokemonBossStage(
        ctx,
        b.boss.def.biome,
        b.boss,
        this.player,
        b.phase,
        prog,
        b.slashFx,
        b.guardActive,
        b.bossFrozenTurns,
        this.simTime,
        b.windVulnerable,
      );
      if (this.encounterFlashTimer > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.75, this.encounterFlashTimer * 2.2)})`;
        ctx.fillRect(0, 0, PIXEL_W, PIXEL_H);
      }
      ctx.restore();
      return;
    }

    const frozen = this.player.chronoFreezeTimer > 0;
    const isIsekai = this.status === 'playing' && this.realm !== 'citadel';
    const dayNight = getIsekaiDayNightState(this.isekaiClockSeconds);

    if (isIsekai) {
      if (this.realm === 'isekai_town') {
        drawIsekaiTownBackdrop(ctx, renderCamX, this.simTime, this.crownUnlocked, dayNight.nightFactor, this.labelCtx, this.townHouses);
      } else if (this.realm === 'isekai_guild') {
        drawIsekaiGuildInterior(ctx, renderCamX, this.simTime, this.guildRank, this.labelCtx);
      } else if (this.realm === 'isekai_wardrobe') {
        drawIsekaiWardrobeInterior(ctx, renderCamX);
      } else if (this.realm === 'isekai_potion_shop') {
        drawIsekaiPotionShopInterior(ctx, renderCamX, this.simTime);
      } else if (this.realm === 'isekai_weapons_shop') {
        drawIsekaiWeaponsShopInterior(ctx, renderCamX, this.simTime);
      } else if (this.realm === 'dungeon_exterior') {
        drawDungeonExteriorBackdrop(
          ctx,
          renderCamX,
          this.simTime,
          dayNight.nightFactor,
          this.dungeonTarget,
          this.labelCtx,
        );
      } else if (this.realm === 'goblin_dungeon') {
        drawGoblinDungeonBackdrop(ctx, renderCamX, this.simTime);
      } else if (this.realm === 'carriage_escort') {
        drawCarriageEscortBackdrop(ctx, renderCamX, this.simTime);
      } else if (this.realm === 'demon_realm') {
        drawDemonRealmBackdrop(ctx, renderCamX, this.simTime);
      } else if (this.realm === 'demon_king_arena') {
        drawDemonKingArenaBackdrop(ctx, renderCamX, this.simTime, this.activeDemonKingStage);
      } else if (this.realm === 'dueling_arena') {
        drawDuelingArenaBackdrop(ctx, renderCamX, this.simTime, this.arenaCrowdHypeTimer, this.labelCtx, this.arenaDuel);
      } else if (this.realm === 'outskirts_forest') {
        drawOutskirtsForestBackdrop(ctx, renderCamX, this.simTime, dayNight.nightFactor, this.labelCtx);
      } else if (this.realm === 'outskirts_caves') {
        drawOutskirtsCavesBackdrop(ctx, renderCamX, this.simTime, this.labelCtx);
      } else if (this.realm === 'elf_kingdom') {
        drawElfKingdomBackdrop(ctx, renderCamX, this.simTime, this.elfKingdomStage, this.labelCtx);
      } else if (this.realm === 'raider_guild') {
        drawRaiderGuildInterior(ctx, renderCamX, this.simTime, this.raiderRank, this.labelCtx);
      } else if (this.realm === 'raider_dungeon') {
        const activeRd = this.activeRaiderDungeonId ? getRaiderDungeonById(this.activeRaiderDungeonId) : null;
        drawRaiderDungeonBackdrop(
          ctx,
          renderCamX,
          this.simTime,
          activeRd?.design ?? 'sunken_crypt',
          this.activeRaiderFloor,
          activeRd?.floors ?? 3,
          this.labelCtx,
        );
      }

      const activeRdDesign =
        this.realm === 'raider_dungeon' && this.activeRaiderDungeonId
          ? getRaiderDungeonById(this.activeRaiderDungeonId).design
          : undefined;
      const platBiome: BiomeId =
        this.realm === 'demon_realm' ||
        this.realm === 'demon_king_arena' ||
        this.realm === 'outskirts_caves' ||
        this.realm === 'raider_dungeon'
          ? 'volcano'
          : this.realm === 'carriage_escort' ||
              this.realm === 'dungeon_exterior' ||
              this.realm === 'outskirts_forest' ||
              this.realm === 'elf_kingdom'
            ? 'forest'
            : 'castle';
      drawIsekaiFloors(ctx, this.realm, renderCamX, this.simTime, activeRdDesign);
      drawPlatforms(
        ctx,
        this.isekaiPlatforms.filter((p) => p.kind !== 'floor'),
        platBiome,
        renderCamX,
        this.simTime,
      );
      drawInteractables(ctx, this.isekaiInteractables, [], renderCamX, this.simTime);

      if (this.realm === 'isekai_town') {
        drawCaravanRider(ctx, 482, renderCamX, this.simTime, dayNight.nightFactor, 1, this.labelCtx);
      } else if (this.realm === 'dungeon_exterior') {
        drawCaravanRider(ctx, 78, renderCamX, this.simTime, dayNight.nightFactor, 1, this.labelCtx);
      } else if (this.realm === 'elf_kingdom') {
        drawCaravanRider(ctx, 78, renderCamX, this.simTime, 0, 1, this.labelCtx);
      }

      for (const peer of this.peers.values()) {
        drawPeer(ctx, peer, renderCamX, this.simTime);
      }

      if (this.isekaiNpcs.length > 0) {
        drawIsekaiNpcs(ctx, this.isekaiNpcs, renderCamX, this.simTime, this.crownUnlocked, this.labelCtx);
      }
      if (this.alliedNpcs.length > 0) {
        drawAlliedNpcs(ctx, this.alliedNpcs, renderCamX, this.simTime, this.labelCtx);
      }
      if (this.carriageEscort) {
        drawRoyalCarriage(ctx, this.carriageEscort, renderCamX, this.simTime);
      }
      for (const en of this.isekaiEnemies) {
        drawEnemy(ctx, en, renderCamX, this.simTime, frozen);
      }
      if (this.realm === 'raider_dungeon' && this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0) {
        drawRaiderDemonicBoss(ctx, this.raiderDemonicBoss, renderCamX, this.simTime, frozen, this.labelCtx);
        drawPurpleFlameZones(ctx, this.purpleFlameZones, renderCamX, this.simTime);
      }
      if (this.realm === 'elf_kingdom') {
        drawPurpleFlameZones(ctx, this.purpleFlameZones, renderCamX, this.simTime);
      }
      if (this.realm === 'isekai_town') {
        if (this.townRaid && this.townRaid.hp > 0) {
          drawTownRaidBoss(ctx, this.townRaid, renderCamX, this.simTime, frozen, this.labelCtx);
        }
        drawPurpleFlameZones(ctx, this.purpleFlameZones, renderCamX, this.simTime);
      }
      if (this.realm === 'carriage_escort' || this.realm === 'outskirts_forest' || this.realm === 'outskirts_caves') {
        drawPurpleFlameZones(ctx, this.purpleFlameZones, renderCamX, this.simTime);
      }
      if (this.demonKings.length > 0) {
        drawDemonKings(
          ctx,
          this.demonKings,
          renderCamX,
          this.simTime,
          frozen,
          this.activeDemonKingStage,
          this.labelCtx,
        );
        drawPurpleFlameZones(ctx, this.purpleFlameZones, renderCamX, this.simTime);
      }
      if (this.realm === 'dueling_arena') {
        if (this.arenaDuel && this.arenaDuel.hp > 0) {
          drawArenaChallenger(ctx, this.arenaDuel, renderCamX, this.simTime, frozen, this.labelCtx);
        }
        drawPurpleFlameZones(ctx, this.purpleFlameZones, renderCamX, this.simTime);
      }
    } else {
      drawBiomeBackdrop(ctx, biome, renderCamX, this.simTime);

      const chunks = this.getActiveChunks();

      for (const ch of chunks) {
        drawPlatforms(ctx, ch.platforms, ch.biome, renderCamX, this.simTime);
        if (ch.index === 6) {
          drawVolcanoPitChasm(ctx, ch.startX, 190, renderCamX, this.simTime);
        }
        drawCandles(ctx, ch.candles, renderCamX, this.simTime);
        drawInteractables(
          ctx,
          ch.interactables,
          ch.hiddenPassage ? [ch.hiddenPassage] : [],
          renderCamX,
          this.simTime,
        );
      }

      if (this.groundCracks.length > 0) {
        drawGroundCracks(ctx, this.groundCracks, renderCamX, this.simTime);
      }

      // Multiplayer peers in dungeon
      for (const peer of this.peers.values()) {
        drawPeer(ctx, peer, renderCamX, this.simTime);
      }

      // Enemies & JoJo Bosses
      for (const ch of chunks) {
        for (const en of ch.enemies) {
          drawEnemy(ctx, en, renderCamX, this.simTime, frozen);
        }
        if (ch.boss && (!ch.boss.defeated || ch.boss.state === 'ko')) {
          drawJoJoBoss(ctx, ch.boss, renderCamX, this.simTime, frozen);
        }
      }
    }

    // Ambient floating candle embers / forest fireflies / sunlit motes
    const moteColor = isIsekai
      ? this.realm === 'demon_realm' || this.realm === 'demon_king_arena'
        ? '#c084fc'
        : '#fef08a'
      : biome === 'castle'
        ? '#fbbf24'
        : biome === 'forest'
          ? '#6ee7b7'
          : '#fb923c';
    for (const m of this.ambientMotes) {
      const alpha = 0.28 + 0.35 * Math.abs(Math.sin(this.simTime * 2.5 + m.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = moteColor;
      ctx.fillRect(Math.round(m.x), Math.round(m.y), m.size, m.size);
    }
    ctx.globalAlpha = 1;

    // Afterimage ghost trail silhouettes
    for (const a of this.afterimages) {
      if (!a.active) continue;
      ctx.globalAlpha = Math.max(0, (a.life / 0.24) * 0.45);
      ctx.fillStyle = a.color;
      ctx.fillRect(Math.round(a.x - renderCamX + 2), Math.round(a.y), 12, 24);
    }
    ctx.globalAlpha = 1;

    // Warrior player (with Dinostand transformation & Gyro Steel Ball hand gear!)
    drawWarrior(
      ctx,
      this.player.x,
      this.player.y,
      this.player.facing,
      this.player.squashX,
      this.player.squashY,
      this.player.walkCycle,
      this.status === 'title' ? this.simTime : this.player.idleTimer,
      this.player.attackPhase,
      this.player.equippedWeapon,
      this.player.comboStep,
      this.player.parryTimer > 0,
      this.player.hitFlash,
      renderCamX,
      false,
      '#60a5fa',
      undefined,
      this.player.customization,
      this.player.comboSubStep,
      this.player.isSpinDashAttack,
      this.simTime,
      null,
      (this.player.dinoFormTimer ?? 0) > 0,
      this.player.equippedStand ?? 'star_platinum',
      (this.player.whiteAuraTimer ?? 0) > 0,
    );

    if ((this.player.standGuardTimer ?? 0) > 0) {
      drawStandGuardBarrier(
        ctx,
        this.player.equippedStand ?? 'star_platinum',
        this.player.x,
        this.player.y,
        this.player.facing,
        renderCamX,
        this.simTime,
        this.player.standGuardTimer ?? 0,
      );
    }

    if (this.starPlatinumTimer > 0) {
      drawStarPlatinumGuardian(
        ctx,
        this.player.x,
        this.player.y,
        this.player.facing,
        renderCamX,
        this.simTime,
        this.starPlatinumTimer,
      );
    }

    if (this.chiliPepperTimer > 0) {
      drawChiliPepperEntity(
        ctx,
        this.player.x,
        this.player.y,
        this.player.facing,
        renderCamX,
        this.simTime,
        this.chiliPepperTimer,
      );
    }

    if (this.standSummonFx) {
      drawJjbaStandSprite(
        ctx,
        this.standSummonFx.standId,
        this.player.x,
        this.player.y,
        this.standSummonFx.facing,
        renderCamX,
        this.simTime,
        this.standSummonFx.timer,
      );
    }

    drawProjectiles(ctx, this.projectiles, renderCamX);

    if (!isIsekai && renderCamX < 40) {
      drawDarkSanctumLighting(ctx, renderCamX, this.player.x, this.player.y, this.simTime);
    }

    if (isIsekai && dayNight.nightFactor > 0.04) {
      drawIsekaiNightLighting(
        ctx,
        renderCamX,
        this.simTime,
        dayNight.nightFactor,
        this.realm,
        this.player.x - renderCamX + 8,
        this.player.y + 12,
      );
    }

    if (this.realm === 'goblin_dungeon' || this.realm === 'demon_realm') {
      drawDungeonDepthOverlay(
        ctx,
        this.dungeonDepth,
        this.player.x - renderCamX + 8,
        this.player.y + 12,
        this.simTime,
        this.player.x,
        this.labelCtx,
      );
    }

    // Particles
    for (const p of this.particles) {
      if (!p.active) continue;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x - renderCamX), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;

    // Floating combat numbers & anime callouts
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    for (const f of this.floatingNums) {
      if (!f.active) continue;
      ctx.globalAlpha = Math.max(0, Math.min(1, f.life * 2));
      ctx.fillStyle = '#09090b';
      ctx.fillText(f.text, Math.round(f.x - renderCamX) + 1, Math.round(f.y) + 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, Math.round(f.x - renderCamX), Math.round(f.y));
    }
    ctx.globalAlpha = 1;

    // Anime impact speed-lines around screen edges during Boss Intros & Skills
    if (this.speedLineTimer > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
      ctx.lineWidth = 1;
      for (let s = 0; s < 16; s++) {
        const ang = (s / 16) * Math.PI * 2 + this.simTime * 4;
        const r1 = 150;
        const r2 = 240;
        ctx.beginPath();
        ctx.moveTo(PIXEL_W / 2 + Math.cos(ang) * r1, PIXEL_H / 2 + Math.sin(ang) * r1 * 0.6);
        ctx.lineTo(PIXEL_W / 2 + Math.cos(ang) * r2, PIXEL_H / 2 + Math.sin(ang) * r2 * 0.6);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Time-stop emerald tint overlay
    if (frozen) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
      ctx.fillRect(0, 0, PIXEL_W, PIXEL_H);
    }

    // Subtle candle-lit perimeter vignette only inside Citadel / Demon Dungeons (keep sunny Isekai town crisp & bright!)
    if (!isIsekai || this.realm === 'goblin_dungeon' || this.realm === 'demon_realm' || this.realm === 'demon_king_arena' || this.realm === 'raider_dungeon') {
      if (!this.vignetteCanvas) {
        const vc = document.createElement('canvas');
        const vw = PIXEL_W * RENDER_SCALE;
        const vh = PIXEL_H * RENDER_SCALE;
        vc.width = vw;
        vc.height = vh;
        const vctx = vc.getContext('2d');
        if (vctx) {
          const vig = vctx.createRadialGradient(
            vw * 0.5,
            vh * 0.5,
            vw * 0.28,
            vw * 0.5,
            vh * 0.5,
            vw * 0.68,
          );
          vig.addColorStop(0, 'rgba(0,0,0,0)');
          vig.addColorStop(1, 'rgba(6,4,6,0.52)');
          vctx.fillStyle = vig;
          vctx.fillRect(0, 0, vw, vh);
        }
        this.vignetteCanvas = vc;
      }
      ctx.drawImage(this.vignetteCanvas, 0, 0, PIXEL_W, PIXEL_H);
    }

    // Mega Boss / Gyro Zeppeli Glitch-Crash & Intro Cutscene Layer
    if (this.megaCutscene && this.status === 'playing') {
      const mc = this.megaCutscene;
      const elapsed = mc.duration - mc.timer;
      const phase: 'glitch' | 'reveal' = elapsed < 0.95 ? 'glitch' : 'reveal';
      const progress = phase === 'glitch' ? elapsed / 0.95 : (elapsed - 0.95) / Math.max(0.1, mc.duration - 0.95);
      const hudCutscene: MegaCutsceneHud = {
        archetype: mc.archetype,
        name: mc.pendingBoss.def.name,
        title: mc.pendingBoss.def.title,
        standName: mc.pendingBoss.def.standName,
        subtitle: mc.pendingBoss.def.voiceLine,
        phase,
        progress: Math.max(0, Math.min(1, progress)),
      };
      drawMegaBossCutscene(ctx, hudCutscene, mc.pendingBoss, this.simTime);
    }

    ctx.restore();
  }

  private getNearbyInteractableLabel(): string | null {
    if (this.realm !== 'citadel') {
      for (const prop of this.isekaiInteractables) {
        if (
          rectsOverlap(
            this.player.x - 14,
            this.player.y - 8,
            this.player.w + 28,
            this.player.h + 16,
            prop.x,
            prop.y,
            prop.w,
            prop.h,
          )
        ) {
          return `[F] ${prop.label}`;
        }
      }
      for (const npc of this.isekaiNpcs) {
        if (Math.abs(this.player.x - npc.x) < 34) {
          return `[F] Talk to ${npc.name}`;
        }
      }
      return null;
    }

    const chunks = this.getActiveChunks();
    for (const ch of chunks) {
      for (const prop of ch.interactables) {
        if (prop.kind === 'chest' && prop.activated) continue;
        if (
          rectsOverlap(
            this.player.x - 10,
            this.player.y - 6,
            this.player.w + 20,
            this.player.h + 12,
            prop.x,
            prop.y,
            prop.w,
            prop.h,
          )
        ) {
          return `[F] ${prop.label}`;
        }
      }
    }
    return null;
  }

  private buildIsekaiMissionHud(): IsekaiMissionHud | null {
    if (!this.activeMissionId) return null;
    const m = GUILD_MISSIONS.find((x) => x.id === this.activeMissionId);
    if (!m) return null;
    let objectiveText = m.summary;
    if (this.realm === 'goblin_dungeon') {
      objectiveText = `Clear Goblins & Hobgoblins (${this.isekaiEnemies.length} remaining)`;
    } else if (this.realm === 'carriage_escort' && this.carriageEscort) {
      objectiveText = `Escort Princess Carriage (${this.carriageEscort.progress}%) · ${this.isekaiEnemies.length} Bandits`;
    } else if (this.realm === 'demon_realm') {
      objectiveText = `Clear Demon Realm Vanguard (${this.isekaiEnemies.length} demons left)`;
    } else if (this.realm === 'demon_king_arena') {
      const aliveKings = this.demonKings.filter((k) => !k.defeated && k.hp > 0).length;
      const total = Math.max(3, this.demonKings.length);
      objectiveText = `Slay the ${total} Demon Kings (${aliveKings} remaining)`;
    }
    const activeDk =
      this.realm === 'demon_king_arena'
        ? this.demonKings.find((k) => k.index === this.activeDemonKingStage) ?? null
        : null;
    const totalStages = this.realm === 'demon_king_arena' ? Math.max(3, this.demonKings.length) : undefined;
    return {
      missionId: m.id,
      title: m.title,
      rank: m.rankReq,
      objectiveText,
      killsDone: this.isekaiKillsDone,
      killsRequired: Math.max(1, this.isekaiKillsRequired),
      carriageHp: this.carriageEscort ? Math.round(this.carriageEscort.hp) : undefined,
      carriageMaxHp: this.carriageEscort ? this.carriageEscort.maxHp : undefined,
      carriageProgress: this.carriageEscort ? this.carriageEscort.progress : undefined,
      demonKings:
        this.realm === 'demon_king_arena'
          ? this.demonKings.map((k) => ({
              id: k.id,
              name: k.name,
              hp: Math.round(k.hp),
              maxHp: k.maxHp,
              defeated: k.defeated,
              active: k.index === this.activeDemonKingStage,
              windVulnerable: Boolean(k.windVulnerable),
              stunned: (k.stunTimer ?? 0) > 0,
            }))
          : undefined,
      currentDemonKingStage: this.realm === 'demon_king_arena' ? this.activeDemonKingStage : undefined,
      totalDemonKingStages: totalStages,
      activeKingMeta: activeDk
        ? {
            stage: activeDk.index,
            totalStages: totalStages ?? 3,
            name: activeDk.name,
            title: activeDk.title,
            manhwaSource: activeDk.manhwaSource,
            weaponName: activeDk.weaponName,
            companionName: activeDk.companionName,
            skills: activeDk.skills,
            specialDesc: activeDk.specialDesc,
            shieldHp: activeDk.shieldHp ?? 0,
          }
        : null,
      alliedNpcs:
        this.realm === 'demon_king_arena'
          ? this.alliedNpcs.map((a) => ({
              id: a.id,
              name: a.name,
              hp: Math.round(a.hp),
              maxHp: a.maxHp,
            }))
          : undefined,
      activeCastBanner: this.activeCastBanner,
      completed: this.endlessContractClaimed,
    };
  }

  private emitHud(force = false): void {
    const biome = this.getCurrentBiome();
    const nearbyBoss = this.realm === 'citadel' ? this.getActiveNearbyBoss() : null;
    const nearbyPrompt = this.getNearbyInteractableLabel();
    const custSig = `${this.player.customization.cloakColor},${this.player.customization.armorColor},${this.player.customization.visorColor},${this.player.customization.plumeColor},${this.player.customization.outfitStyle ?? ''},${this.player.customization.headgearStyle ?? ''},${this.player.customization.crownEquipped ? '1' : '0'},${this.player.customization.crownStyle ?? ''}`;
    const secCapSig = this.secretCaption ? `${this.secretCaption.title}:${this.secretCaption.detail}` : 'none';
    const megaCutSig = this.megaCutscene
      ? `${this.megaCutscene.archetype}:${this.megaCutscene.timer.toFixed(1)}`
      : 'none';
    const corSig = this.coronationCutscene ? this.coronationCutscene.timer.toFixed(1) : 'none';
    const elfCutSig = this.elfCutscene
      ? `${this.elfCutscene.act}:${this.elfCutscene.beatIndex}:${this.elfCutscene.chosenReply ? 1 : 0}`
      : 'none';
    const elfAmbushEnemiesLeft =
      this.realm === 'elf_kingdom' && this.elfKingdomStage === 'ambush_active'
        ? this.isekaiEnemies.filter((e) => e.state !== 'ko' && e.hp > 0).length
        : 0;
    const elfFeastBoss =
      this.realm === 'elf_kingdom'
        ? this.isekaiEnemies.find((e) => e.archetype === 'eldritch_feast_boss' && e.state !== 'ko')
        : null;
    const kaelenAlly =
      this.realm === 'elf_kingdom' ? this.alliedNpcs.find((a) => a.role === 'elf_swordsman') : null;
    const raiderEnemiesLeft =
      this.realm === 'raider_dungeon'
        ? this.isekaiEnemies.filter((e) => e.state !== 'ko' && e.hp > 0).length
        : 0;
    const raiderSig = `${this.raiderRank}:${this.raiderPoints}:${this.clearedRaiderDungeons.length}:${this.activeRaiderDungeonId ?? 0}:${this.activeRaiderFloor}:${raiderEnemiesLeft}:${this.raiderDemonicBoss ? Math.round(this.raiderDemonicBoss.hp) : 0}:${this.raiderDemonicBoss?.berserk ? 1 : 0}:${this.raiderDemonicBoss?.activeSkillBanner ?? ''}`;
    const rideSig = this.caravanRide ? `${this.caravanRide.target}:${this.caravanRide.timer.toFixed(2)}` : 'none';
    const arenaSig = this.arenaDuel
      ? `${this.arenaDuel.challengerId}:${Math.round(this.arenaDuel.hp)}:${this.arenaDuel.roundNumber}:${this.arenaDuel.playerRoundWins}:${this.arenaDuel.opponentRoundWins}:${this.arenaDuel.roundPhase}:${Math.ceil(this.arenaDuel.roundPhaseTimer)}:${this.arenaDuel.fightBannerTimer > 0 ? 1 : 0}:${this.arenaDuel.activeSkillBanner ?? ''}:${this.arenaDuel.aiActionTag ?? ''}:${this.arenaDuel.domainActive ? Math.ceil(this.arenaDuel.domainTimer) : 0}`
      : 'none';
    const brokenHousesCount = this.townHouses.filter((h) => h.broken).length;
    const rebuildingHousesCount = this.townHouses.filter((h) => h.rebuilding).length;
    const raidSig = this.townRaid
      ? `${this.townRaid.raiderId}:${Math.round(this.townRaid.hp)}:${this.townRaid.activeSkillBanner ?? ''}:${brokenHousesCount}`
      : `${brokenHousesCount}:${rebuildingHousesCount}:${Math.floor(this.townRaidTimer)}`;
    const missionHud = this.buildIsekaiMissionHud();
    const missionSig = missionHud
      ? `${missionHud.missionId}:${missionHud.killsDone}:${missionHud.completed ? 1 : 0}:${missionHud.carriageProgress ?? 0}:${missionHud.carriageHp ?? 0}:${missionHud.activeCastBanner ?? ''}:${missionHud.activeKingMeta?.shieldHp ?? 0}:${missionHud.demonKings?.map((k) => `${k.hp}:${k.windVulnerable ? 1 : 0}:${k.stunned ? 1 : 0}`).join(',') ?? ''}:${missionHud.alliedNpcs?.map((a) => a.hp).join(',') ?? ''}`
      : 'none';
    const sideQuestSig = [
      this.trackedSideQuestId ?? 'none',
      ...SIDE_QUESTS.map((q) => {
        const p = this.sideQuestProgress[q.id];
        return `${q.id}:${p?.stage ?? 0}:${p?.kills ?? 0}:${p?.twistRevealed ? 1 : 0}`;
      }),
    ].join(',');
    const orbSig = this.inventory
      .filter((it) => it.category === 'orb')
      .map((it) => `${it.id}:${it.count}`)
      .join(',');
    const idleLeft = Math.max(0, Math.ceil(ISEKAI_IDLE_TRANSPORT_SECONDS - this.player.idleTimer));
    const dayNight = getIsekaiDayNightState(this.isekaiClockSeconds);

    const activeGuildFloor: 1 | 2 =
      this.realm === 'isekai_guild' && this.player.y + this.player.h <= GUILD_FLOOR2_Y + 10 ? 2 : 1;

    const sig = [
      this.status,
      this.realm,
      this.guildRank,
      this.rankMissionsCompleted,
      this.acceptedMissionId ?? 'none',
      this.dungeonTarget,
      this.endlessContractClaimed ? '1' : '0',
      this.bRankEscortsCompleted,
      this.dungeonDepth,
      this.dungeonChoicePending ? `${this.dungeonChoicePending.missionId}:${this.dungeonChoicePending.nextDepth}` : 'none',
      activeGuildFloor,
      this.player.damageBoostTimer > 0 ? `${this.player.damageBoostMultiplier.toFixed(2)}:${Math.ceil(this.player.damageBoostTimer)}` : '0',
      Math.ceil(this.player.hotSpringTimer ?? 0),
      dayNight.isNight ? '1' : '0',
      Math.floor(dayNight.secondsToToggle),
      orbSig,
      this.unlockedWardrobe.join(','),
      this.crownUnlocked ? '1' : '0',
      this.elfCrownUnlocked ? '1' : '0',
      this.elfKingdomInvited ? '1' : '0',
      this.elfKingdomStage,
      elfCutSig,
      `${this.elfAmbushWave}:${elfAmbushEnemiesLeft}:${elfFeastBoss ? Math.round(elfFeastBoss.hp) : 0}:${kaelenAlly ? Math.round(kaelenAlly.hp) : 0}:${kaelenAlly?.callout ?? ''}`,
      raiderSig,
      this.gyroDefeated ? '1' : '0',
      this.isekaiPortalOpen ? '1' : '0',
      idleLeft,
      missionSig,
      sideQuestSig,
      corSig,
      rideSig,
      this.arenaWins,
      arenaSig,
      raidSig,
      this.onlineAdventurers.length,
      this.pendingGuildInvites.length,
      Math.round(this.player.hp),
      Math.round(this.player.maxHp),
      Math.round(this.player.stamina),
      Math.round(this.player.maxStamina),
      Math.round(this.player.gold),
      this.player.level,
      this.player.statPoints,
      this.player.monstersSlain,
      this.player.stats.skillDmg,
      this.player.stats.attack,
      this.player.stats.hp,
      this.player.stats.speed,
      custSig,
      biome,
      Math.round((this.player.x - 68) / 16),
      this.player.bossesDefeated,
      this.player.secretsFound,
      this.player.equippedWeapon,
      this.player.skillSlots.join(','),
      this.player.skillCooldowns.map((c) => c.toFixed(1)).join(','),
      this.player.dashCooldown.toFixed(1),
      (this.player.whiteAuraTimer ?? 0).toFixed(1),
      (this.player.whiteAuraCooldown ?? 0).toFixed(1),
      (this.player.standGuardTimer ?? 0).toFixed(1),
      (this.player.standGuardCooldown ?? 0).toFixed(1),
      this.starPlatinumTimer > 0 ? '1' : '0',
      this.player.starStones ?? 0,
      this.player.equippedStand ?? 'star_platinum',
      (this.player.unlockedStands ?? ['star_platinum']).join(','),
      Math.ceil(this.player.dinoFormTimer ?? 0),
      Math.ceil(this.chiliPepperTimer),
      Math.ceil(this.bossCooldownSeconds),
      this.bossesFoughtStreak,
      this.dialogue ? `${this.dialogue.lineIndex}:${this.dialogue.charIndex}` : 'none',
      nearbyBoss
        ? `${nearbyBoss.def.index}:${Math.round(nearbyBoss.hp)}:${nearbyBoss.skillPhase ?? 'none'}:${nearbyBoss.activeSkillName ?? ''}:${nearbyBoss.burstHitStreak ?? 0}:${nearbyBoss.activeDialogue ?? ''}:${this.bossCritCount}`
        : 'none',
      this.bossBattle
        ? `${this.bossBattle.phase}:${Math.round(this.bossBattle.boss.hp)}:${this.bossBattle.message}`
        : 'none',
      megaCutSig,
      this.onlineCount,
      this.worldId,
      this.worldRole,
      this.worldPlayerCount,
      this.onlineWorlds.length,
      this.lastSavedAt ?? '',
      this.announcement ?? '',
      secCapSig,
      nearbyPrompt ?? '',
      gameAudio.isMuted() ? '1' : '0',
    ].join('|');

    if (!force && sig === this.lastHudSignature) return;
    this.lastHudSignature = sig;

    let megaCutsceneHud: MegaCutsceneHud | null = null;
    if (this.megaCutscene) {
      const mc = this.megaCutscene;
      const elapsed = mc.duration - mc.timer;
      const phase: 'glitch' | 'reveal' = elapsed < 0.95 ? 'glitch' : 'reveal';
      const progress = phase === 'glitch' ? elapsed / 0.95 : (elapsed - 0.95) / Math.max(0.1, mc.duration - 0.95);
      megaCutsceneHud = {
        archetype: mc.archetype,
        name: mc.pendingBoss.def.name,
        title: mc.pendingBoss.def.title,
        standName: mc.pendingBoss.def.standName,
        subtitle: mc.pendingBoss.def.voiceLine,
        phase,
        progress: Math.max(0, Math.min(1, progress)),
      };
    }

    let coronationHud: CoronationCutsceneHud | null = null;
    if (this.coronationCutscene) {
      const prog = Math.max(
        0,
        Math.min(1, (this.coronationCutscene.duration - this.coronationCutscene.timer) / this.coronationCutscene.duration),
      );
      const phase: CoronationCutsceneHud['phase'] =
        prog < 0.35 ? 'approach' : prog < 0.72 ? 'crowning' : 'cheering';
      coronationHud = {
        phase,
        progress: prog,
        subtitle:
          phase === 'approach'
            ? 'All 3 Demon Kings have fallen!'
            : phase === 'crowning'
              ? 'The Golden Sovereign Crown descends!'
              : 'All of Solaris Town celebrates your Royal S-Rank Coronation!',
      };
    }

    const activeRdHud =
      this.realm === 'raider_dungeon' && this.activeRaiderDungeonId
        ? getRaiderDungeonById(this.activeRaiderDungeonId)
        : null;
    const activeElfBeat = this.elfCutscene ? this.elfCutscene.beats[this.elfCutscene.beatIndex] : null;
    const totalDkStages = Math.max(3, this.demonKings.length);
    const realmLabelMap: Record<RealmMode, string> = {
      citadel: getBiomeDisplayName(biome),
      isekai_town: 'Solaris Isekai Town',
      isekai_guild: activeGuildFloor === 2 ? 'Adventure Guild · 2nd Floor Command' : 'Solaris Adventure Guild',
      isekai_wardrobe: 'Royal Boutique & Wardrobe',
      isekai_potion_shop: 'Glowing Potion Apothecary',
      isekai_weapons_shop: 'Grand Solaris Armory',
      dungeon_exterior: 'Dungeon Forest Outskirts',
      goblin_dungeon: `Endless Goblin Cavern (Depth ${this.dungeonDepth})`,
      carriage_escort: 'Kingdom Highway Escort',
      demon_realm: `Endless Demon Caldera (Depth ${this.dungeonDepth})`,
      demon_king_arena: `Demon Kings Citadel (Stage ${this.activeDemonKingStage}/${totalDkStages})`,
      dueling_arena: 'Solaris Grand Colosseum',
      outskirts_forest: 'Outskirts Blood-Trail Forest',
      outskirts_caves: 'Outskirts Crimson Caves',
      elf_kingdom:
        this.elfKingdomStage === 'celebration'
          ? 'Aethelgard · Eternal Royal Feast'
          : this.elfKingdomStage === 'ambush_active'
            ? 'Aethelgard · Eldritch Siege!'
            : 'Elf Kingdom of Aethelgard',
      raider_guild: `Dungeon Raider Guild (${this.raiderRank})`,
      raider_dungeon: activeRdHud
        ? `${activeRdHud.code} ${activeRdHud.name} · F${this.activeRaiderFloor}/${activeRdHud.floors}`
        : 'Raider Guild Dungeon',
    };

    const snapshot: HudSnapshot = {
      status: this.status,
      hp: Math.round(this.player.hp),
      maxHp: Math.round(this.player.maxHp),
      stamina: Math.round(this.player.stamina),
      maxStamina: Math.round(this.player.maxStamina),
      gold: Math.round(this.player.gold),
      level: this.player.level,
      statPoints: this.player.statPoints,
      stats: { ...this.player.stats },
      monstersSlain: this.player.monstersSlain,
      customization: { ...this.player.customization },
      biome,
      biomeLabel: realmLabelMap[this.realm],
      distanceMeters: Math.round((this.player.x - 68) / 16),
      bossesDefeated: this.player.bossesDefeated,
      totalBosses: TOTAL_BOSSES,
      secretsFound: this.player.secretsFound,
      totalSecrets: TOTAL_HIDDEN_PASSAGES,
      equippedWeapon: this.player.equippedWeapon,
      unlockedWeapons: [...this.player.unlockedWeapons],
      skillSlots: [...this.player.skillSlots],
      skillCooldowns: [...this.player.skillCooldowns],
      dashCooldown: Number(this.player.dashCooldown.toFixed(2)),
      whiteAuraSeconds: Number((this.player.whiteAuraTimer ?? 0).toFixed(2)),
      whiteAuraCooldown: Number((this.player.whiteAuraCooldown ?? 0).toFixed(2)),
      standGuardSeconds: Number((this.player.standGuardTimer ?? 0).toFixed(2)),
      standGuardCooldown: Number((this.player.standGuardCooldown ?? 0).toFixed(2)),
      starPlatinumActive: this.starPlatinumTimer > 0,
      starStones: this.player.starStones ?? 0,
      equippedStand: this.player.equippedStand ?? 'star_platinum',
      unlockedStands: [...(this.player.unlockedStands ?? ['star_platinum'])],
      dinoFormSeconds: Math.ceil(this.player.dinoFormTimer ?? 0),
      chiliPepperSeconds: Math.ceil(this.chiliPepperTimer),
      bossCooldownSeconds: Math.ceil(this.bossCooldownSeconds),
      bossFoughtStreak: this.bossesFoughtStreak,
      idleSecondsToIsekai: idleLeft,
      realm: this.realm,
      guildRank: this.guildRank,
      rankMissionsCompleted: this.rankMissionsCompleted,
      missionsRequiredPerRank: MISSIONS_REQUIRED_PER_RANK,
      bRankEscortsCompleted: this.bRankEscortsCompleted,
      acceptedMissionId: this.acceptedMissionId,
      dungeonTarget: this.dungeonTarget,
      dungeonDepth: this.dungeonDepth,
      dungeonChoicePending: this.dungeonChoicePending ? { ...this.dungeonChoicePending } : null,
      endlessContractCleared: this.endlessContractClaimed,
      activeGuildFloor,
      damageBoostMultiplier: this.player.damageBoostTimer > 0 ? this.player.damageBoostMultiplier : 1,
      damageBoostSeconds: Math.ceil(this.player.damageBoostTimer),
      hotSpringSeconds: Math.ceil(this.player.hotSpringTimer ?? 0),
      isNightTime: dayNight.isNight,
      nightFactor: dayNight.nightFactor,
      secondsToNightToggle: Math.ceil(dayNight.secondsToToggle),
      unlockedWardrobe: [...this.unlockedWardrobe],
      crownUnlocked: this.crownUnlocked,
      elfCrownUnlocked: this.elfCrownUnlocked,
      elfKingdomInvited: this.elfKingdomInvited,
      elfKingdomStage: this.elfKingdomStage,
      elfCutscene:
        this.elfCutscene && activeElfBeat
          ? {
              act: this.elfCutscene.act,
              beatIndex: this.elfCutscene.beatIndex,
              totalBeats: this.elfCutscene.beats.length,
              speaker: activeElfBeat.speaker,
              speakerTitle: activeElfBeat.speakerTitle,
              portraitKind: activeElfBeat.portraitKind,
              moodLabel: activeElfBeat.moodLabel,
              lines: activeElfBeat.lines,
              choices: activeElfBeat.choices?.map((c) => ({
                id: c.id,
                label: c.label,
                reply: c.reply,
                bonusTag: c.bonusTag,
              })),
              chosenReply: this.elfCutscene.chosenReply,
              canAdvance: !activeElfBeat.choices || Boolean(this.elfCutscene.chosenReply),
            }
          : null,
      elfKingdomHud:
        this.realm === 'elf_kingdom'
          ? {
              stage: this.elfKingdomStage,
              wave: this.elfAmbushWave,
              totalWaves: 2,
              enemiesRemaining: elfAmbushEnemiesLeft,
              bossName: elfFeastBoss ? elfFeastBoss.name : this.elfAmbushBossName,
              bossHp: elfFeastBoss ? Math.round(elfFeastBoss.hp) : 0,
              bossMaxHp: elfFeastBoss ? elfFeastBoss.maxHp : 0,
              allySwordsman: kaelenAlly
                ? {
                    name: kaelenAlly.name,
                    hp: Math.round(kaelenAlly.hp),
                    maxHp: kaelenAlly.maxHp,
                    callout: kaelenAlly.callout ?? null,
                  }
                : null,
            }
          : null,
      raiderRank: this.raiderRank,
      raiderPoints: this.raiderPoints,
      clearedRaiderDungeons: [...this.clearedRaiderDungeons],
      activeRaiderDungeon: activeRdHud
        ? {
            dungeonId: activeRdHud.id,
            code: activeRdHud.code,
            name: activeRdHud.name,
            design: activeRdHud.design,
            designLabel: activeRdHud.designLabel,
            requiredRank: activeRdHud.requiredRank,
            floor: this.activeRaiderFloor,
            totalFloors: activeRdHud.floors,
            floorCleared: raiderEnemiesLeft === 0,
            stairsUnlocked: raiderEnemiesLeft === 0 && this.activeRaiderFloor < activeRdHud.floors,
            enemiesRemaining: raiderEnemiesLeft,
            boss:
              this.raiderDemonicBoss && this.raiderDemonicBoss.hp > 0
                ? {
                    name: this.raiderDemonicBoss.name,
                    title: this.raiderDemonicBoss.title,
                    hp: Math.round(this.raiderDemonicBoss.hp),
                    maxHp: this.raiderDemonicBoss.maxHp,
                    berserk: this.raiderDemonicBoss.berserk,
                    activeSkillBanner: this.raiderDemonicBoss.activeSkillBanner,
                  }
                : null,
          }
        : null,
      gyroDefeated: this.gyroDefeated,
      isekaiPortalOpen: this.isekaiPortalOpen,
      isekaiMission: missionHud,
      coronationCutscene: coronationHud,
      caravanRide: this.caravanRide
        ? {
            destinationLabel: this.caravanRide.label,
            progress: Math.max(
              0,
              Math.min(1, 1 - this.caravanRide.timer / Math.max(0.1, this.caravanRide.duration)),
            ),
          }
        : null,
      arenaWins: this.arenaWins,
      townRaid: this.townRaid
        ? {
            raiderId: this.townRaid.raiderId,
            name: this.townRaid.name,
            title: this.townRaid.title,
            hp: Math.round(this.townRaid.hp),
            maxHp: this.townRaid.maxHp,
            attackDamage: this.townRaid.attackDamage,
            activeSkillBanner: this.townRaid.activeSkillBanner,
            housesBroken: brokenHousesCount,
            totalHouses: this.townHouses.length,
          }
        : null,
      secondsToTownRaid: Math.max(0, Math.ceil(this.townRaidTimer)),
      townDamageStatus:
        this.realm === 'isekai_town' && (brokenHousesCount > 0 || rebuildingHousesCount > 0)
          ? {
              broken: brokenHousesCount,
              rebuilding: rebuildingHousesCount,
              total: this.townHouses.length,
            }
          : null,
      arenaDuel: this.arenaDuel
        ? {
            challengerId: this.arenaDuel.challengerId,
            name: this.arenaDuel.def.name,
            title: this.arenaDuel.def.title,
            worldOrigin: this.arenaDuel.def.worldOrigin,
            weaponName: this.arenaDuel.def.weaponName,
            hp: Math.round(this.arenaDuel.hp),
            maxHp: this.arenaDuel.maxHp,
            matchedAtk: this.arenaDuel.matchedAtk,
            matchedSpeed: this.arenaDuel.matchedSpeed,
            activeSkillBanner: this.arenaDuel.activeSkillBanner,
            aiActionTag: this.arenaDuel.aiActionTag,
            winsCount: this.arenaWins,
            roundNumber: this.arenaDuel.roundNumber,
            playerRoundWins: this.arenaDuel.playerRoundWins,
            opponentRoundWins: this.arenaDuel.opponentRoundWins,
            roundHistory: [...this.arenaDuel.roundHistory],
            roundPhase: this.arenaDuel.roundPhase,
            countdownSeconds: Math.ceil(this.arenaDuel.roundPhaseTimer),
            fightBannerActive: this.arenaDuel.fightBannerTimer > 0,
            lastRoundWinner: this.arenaDuel.lastRoundWinner,
            activeDomain: this.arenaDuel.domainActive
              ? {
                  name: this.arenaDuel.domainName,
                  challengerId: this.arenaDuel.challengerId,
                  secondsLeft: Math.ceil(this.arenaDuel.domainTimer),
                }
              : null,
          }
        : null,
      onlineAdventurers: [...this.onlineAdventurers],
      pendingGuildInvites: [...this.pendingGuildInvites],
      sideQuests: SIDE_QUESTS.map((q) => ({
        ...q,
        progress: {
          ...(this.sideQuestProgress[q.id] ?? {
            stage: 0,
            kills: 0,
            twistRevealed: false,
            bossSpawned: false,
          }),
        },
      })),
      trackedSideQuestId: this.trackedSideQuestId,
      inventory: this.inventory.map((i) => ({ ...i })),
      dialogue: this.dialogue ? { ...this.dialogue } : null,
      activeBoss: nearbyBoss
        ? {
            index: nearbyBoss.def.index,
            name: nearbyBoss.def.name,
            title: nearbyBoss.def.title,
            standName: nearbyBoss.def.standName,
            climateLabel: nearbyBoss.def.climateLabel,
            hp: Math.round(nearbyBoss.hp),
            maxHp: Math.round(nearbyBoss.maxHp),
            defeatedScale:
              nearbyBoss.def.defeatedScale ?? getBossDefeatedMultiplier(this.player.bossesDefeated),
            bossesDefeated: this.player.bossesDefeated,
            bossAtk: calculateCitadelBossHalfAtk(calculateAttackDamage(this.player, 1, false), 1),
            voiceLine: nearbyBoss.def.voiceLine,
            skillName: nearbyBoss.activeSkillName ?? null,
            skillPhase: nearbyBoss.skillPhase ?? 'none',
            skillDialogue: nearbyBoss.activeDialogue ?? null,
            burstStreak: nearbyBoss.burstHitStreak ?? 0,
            critCount: this.bossCritCount,
            isMegaBoss: nearbyBoss.def.isMegaBoss,
            isGyroBoss: nearbyBoss.def.isGyroBoss,
            megaArchetype: nearbyBoss.def.megaArchetype,
          }
        : null,
      bossBattle: this.bossBattle ? toBossBattleSnapshot(this.bossBattle) : null,
      megaCutscene: megaCutsceneHud,
      checkpoints: getBiomeCheckpointList(this.player.highestCheckpointIndex),
      onlineCount: this.onlineCount,
      worldId: this.worldId,
      worldRole: this.worldRole,
      worldHostName: this.worldHostName,
      isWorldPublic: this.isWorldPublic,
      onlineWorlds: [...this.onlineWorlds],
      worldPlayerCount: this.worldPlayerCount,
      lastSavedAt: this.lastSavedAt,
      announcement: this.announcement,
      secretCaption: this.secretCaption ? { ...this.secretCaption } : null,
      nearbyPrompt,
      muted: gameAudio.isMuted(),
    };
    this.onHudUpdate(snapshot);
  }

  private connectMultiplayer(): void {
    if (typeof window === 'undefined') return;
    try {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${proto}//${window.location.host}/ws`);
      this.ws = ws;

      ws.onopen = () => {
        this.syncHostWorldMeta();
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(String(ev.data));
          if (msg.type === 'world:init') {
            this.selfPeerId = msg.selfId;
            this.ownWorldId = msg.ownWorldId || msg.worldId || 'LOCAL';
            this.worldId = msg.worldId || this.ownWorldId;
            this.worldRole = msg.role === 'guest' ? 'guest' : 'host';
            this.worldHostName = msg.hostName || null;
            this.peers.clear();
            for (const p of msg.peers || []) {
              if (p.id !== this.selfPeerId) this.peers.set(p.id, p);
            }
            if (Array.isArray(msg.worlds)) this.onlineWorlds = msg.worlds;
            if (Array.isArray(msg.adventurers)) {
              this.onlineAdventurers = msg.adventurers.filter((a: OnlineAdventurer) => a.id !== this.selfPeerId);
            }
            this.onlineCount = msg.stats?.onlineCount ?? 1;
            this.worldPlayerCount = msg.stats?.worldPlayerCount ?? this.peers.size + 1;
            this.emitHud(true);
          } else if (msg.type === 'world:joined') {
            this.worldId = msg.worldId || this.ownWorldId;
            this.worldRole = msg.role === 'guest' ? 'guest' : 'host';
            this.worldHostName = this.worldRole === 'guest' ? msg.hostName || 'Host' : null;
            this.peers.clear();
            for (const p of msg.peers || []) {
              if (p.id !== this.selfPeerId) this.peers.set(p.id, p);
            }
            this.hostDefeatedBosses = new Set(Array.isArray(msg.defeatedBosses) ? msg.defeatedBosses : []);
            this.worldPlayerCount = msg.worldPlayerCount ?? this.peers.size + 1;
            this.onlineCount = msg.onlineCount ?? this.onlineCount;
            this.bossBattle = null;
            this.megaCutscene = null;
            this.chunks.clear();
            this.chunksDirty = true;
            this.ensureChunksAround(this.player.x);
            if (this.worldRole === 'guest') {
              this.showAnnouncement(
                `Joined ${this.worldHostName}'s Bastera world! Co-op Guest: bosses are locked to Host.`,
              );
            } else {
              this.showAnnouncement('Returned to your own Bastera world.');
            }
            this.emitHud(true);
          } else if (msg.type === 'worlds:list') {
            if (Array.isArray(msg.worlds)) this.onlineWorlds = msg.worlds;
            if (Array.isArray(msg.adventurers)) {
              this.onlineAdventurers = msg.adventurers.filter((a: OnlineAdventurer) => a.id !== this.selfPeerId);
            }
            if (Number.isFinite(msg.onlineCount)) this.onlineCount = msg.onlineCount;
            this.emitHud();
          } else if (msg.type === 'guild:invite_received' && msg.invite) {
            this.pendingGuildInvites = [
              ...this.pendingGuildInvites.filter((i) => i.inviteId !== msg.invite.inviteId),
              msg.invite,
            ];
            this.showAnnouncement(
              `Guild Invite from ${msg.invite.fromName}: ${msg.invite.missionTitle}!`,
            );
            this.emitHud(true);
          } else if (msg.type === 'guild:party_start' && msg.missionId) {
            this.startGuildMission(msg.missionId, false);
          } else if (msg.type === 'world:boss_state' && this.worldRole === 'guest') {
            this.hostDefeatedBosses = new Set(Array.isArray(msg.defeatedBosses) ? msg.defeatedBosses : []);
            this.chunks.clear();
            this.chunksDirty = true;
            this.ensureChunksAround(this.player.x);
            this.emitHud();
          } else if (msg.type === 'world:error' && typeof msg.message === 'string') {
            this.showAnnouncement(msg.message);
          } else if (msg.type === 'peer:join' && msg.peer) {
            if (msg.peer.id !== this.selfPeerId) {
              this.peers.set(msg.peer.id, msg.peer);
              this.showAnnouncement(`${msg.peer.name} joined your Bastera world!`);
            }
            this.worldPlayerCount = msg.worldPlayerCount ?? this.peers.size + 1;
            this.onlineCount = msg.onlineCount ?? this.onlineCount;
            this.emitHud();
          } else if (msg.type === 'peer:update' && msg.peer) {
            if (msg.peer.id !== this.selfPeerId) {
              this.peers.set(msg.peer.id, msg.peer);
            }
          } else if (msg.type === 'peer:leave') {
            this.peers.delete(msg.id);
            this.worldPlayerCount = msg.worldPlayerCount ?? this.peers.size + 1;
            this.onlineCount = msg.onlineCount ?? Math.max(1, this.peers.size + 1);
            this.emitHud();
          } else if (msg.type === 'world:announcement') {
            this.showAnnouncement(`${msg.fromName}: ${msg.label}`);
          }
        } catch {
          // ignore malformed ws message
        }
      };

      ws.onclose = () => {
        this.ws = null;
      };
    } catch {
      // Offline fallback works seamlessly
    }
  }

  private sendMultiplayerState(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const anim =
      this.player.attackPhase !== 'none'
        ? 'attack'
        : !this.player.onGround
          ? 'jump'
          : Math.abs(this.player.vx) > 8
            ? 'run'
            : 'idle';
    this.ws.send(
      JSON.stringify({
        type: 'player:state',
        name: this.playerName,
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
        vx: Math.round(this.player.vx),
        vy: Math.round(this.player.vy),
        facing: this.player.facing,
        anim,
        weaponId: this.player.equippedWeapon,
        biome: this.getCurrentBiome(),
        bossesDefeated: this.player.bossesDefeated,
        realm: this.realm,
        guildRank: this.guildRank,
        customization: this.player.customization,
      }),
    );
  }

  private sendMilestone(kind: 'boss' | 'secret', label: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type: 'world:milestone', kind, label }));
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      if (this.status === 'playing' || this.status === 'title') {
        e.preventDefault();
      }
    }
    if (
      this.status !== 'playing' ||
      this.modalPaused ||
      this.bossBattle ||
      this.megaCutscene ||
      this.coronationCutscene ||
      this.elfCutscene ||
      this.caravanRide ||
      this.volcanoBridgeFallTimer > 0
    ) {
      return;
    }
    if (this.postBossInputLockTimer > 0 && ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
      return;
    }
    if (e.repeat && !this.heldKeys.has(e.code)) {
      return;
    }
    if (!e.repeat) {
      this.justPressed.add(e.code);
    }
    this.heldKeys.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.heldKeys.delete(e.code);
  };

  private handleBlur = () => {
    this.clearAllInputs(true);
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.clearAllInputs(true);
    }
  };

  private attachInputListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private detachInputListeners(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}
