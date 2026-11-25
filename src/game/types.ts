export type BiomeId = 'castle' | 'forest' | 'volcano';

export type WeaponId =
  | 'claymore'
  | 'rapier'
  | 'crescent'
  | 'runeblade'
  | 'katana'
  | 'fire_sword'
  | 'azure_glaive'
  | 'thunder_odachi'
  | 'crimson_reaper'
  | 'emerald_zephyr'
  | 'solar_excalibur'
  | 'venom_twinblade';

export type WeaponSpecialEffect =
  | 'none'
  | 'burn'
  | 'wind_wave'
  | 'seismic'
  | 'void_pull'
  | 'frost'
  | 'lightning'
  | 'lifesteal'
  | 'holy_beam'
  | 'venom';

export type SkillId =
  | 'blade_dash'
  | 'parry_guard'
  | 'candlefire_wave'
  | 'chrono_freeze'
  | 'stand_rush'
  | 'sunburst_cleave';

export type GameStatus = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export type EnemyArchetype =
  | 'skeleton_guard'
  | 'shadow_bat'
  | 'cultist_mage'
  | 'gargoyle_charger'
  | 'cursed_armor'
  | 'phantom_wisp'
  | 'goblin_normal'
  | 'hobgoblin'
  | 'bandit_fighter'
  | 'bandit_archer'
  | 'bandit_assassin'
  | 'bandit_pyromancer'
  | 'bandit_brute'
  | 'demon_succubus'
  | 'demon_tank'
  | 'demon_lightning';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  styleName: string;
  description: string;
  sarcasticNote: string;
  damage: number;
  damageMultiplier?: number;
  range: number;
  arcHeight: number;
  windup: number;
  active: number;
  recovery: number;
  comboHits: number;
  knockback: number;
  color: string;
  accentColor: string;
  visualLength: number;
  visualWidth: number;
  specialEffect: WeaponSpecialEffect;
  specialLabel: string;
  unlockedByDefault: boolean;
  craftCost?: { resourceId: string; amount: number };
  shopPrice?: number;
}

export interface SkillDef {
  id: SkillId;
  name: string;
  shortTag: string;
  description: string;
  cooldown: number;
  staminaCost: number;
  damageMultiplier: number;
  color: string;
}

export type StandId =
  | 'star_platinum'
  | 'the_hand'
  | 'scary_monsters'
  | 'chili_pepper'
  | 'gyro_ball'
  | 'crazy_diamond'
  | 'killer_queen'
  | 'golden_experience'
  | 'king_crimson'
  | 'silver_chariot';

export interface StandDef {
  id: StandId;
  name: string;
  jjbaUser: string;
  roleTag: string;
  costStarStones: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  abilityName: string;
  description: string;
}

export type OrbId = 'orb_flame' | 'orb_wind' | 'orb_electric';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'potion' | 'relic' | 'resource' | 'key' | 'orb';
  description: string;
  sarcasticQuote: string;
  count: number;
  color: string;
  healAmount?: number;
  attackBoostMult?: number;
  boostDuration?: number;
  shopPrice?: number;
  attackBonus?: number;
  maxHpBonus?: number;
}

export interface BossMusicConfig {
  bpm: number;
  rootHz: number;
  scale: number[];
  leadWave: 'square' | 'sawtooth' | 'triangle';
  bassPattern: number[];
  motifSeed: number;
}

export type BossClimateId =
  | 'blood_moon_ash'
  | 'crimson_thunder'
  | 'blizzard_frost'
  | 'arcane_eclipse'
  | 'acid_spore_mist'
  | 'emerald_monsoon'
  | 'magma_emberstorm'
  | 'void_time_fracture'
  | 'solar_mirage'
  | 'obsidian_sandstorm'
  | 'phantom_fog'
  | 'starlight_aurora';

export type StatKey = 'skillDmg' | 'attack' | 'hp' | 'speed';

export interface PlayerStats {
  skillDmg: number;
  attack: number;
  hp: number;
  speed: number;
}

export type RealmMode =
  | 'citadel'
  | 'isekai_town'
  | 'isekai_guild'
  | 'isekai_wardrobe'
  | 'isekai_potion_shop'
  | 'isekai_weapons_shop'
  | 'dungeon_exterior'
  | 'goblin_dungeon'
  | 'carriage_escort'
  | 'demon_realm'
  | 'demon_king_arena'
  | 'dueling_arena'
  | 'outskirts_forest'
  | 'outskirts_caves';

export type SideQuestId =
  | 'sq_01_crimson_tithe'
  | 'sq_02_butcher_well'
  | 'sq_03_glass_bride'
  | 'sq_04_plague_apothecary'
  | 'sq_05_hollow_bell'
  | 'sq_06_twin_fang_oath'
  | 'sq_07_ash_archivist'
  | 'sq_08_chained_hound'
  | 'sq_09_velvet_gallows'
  | 'sq_10_pale_regent';

export type SideQuestStage = 0 | 1 | 2 | 3;

export interface SideQuestDef {
  id: SideQuestId;
  index: number;
  title: string;
  giverName: string;
  giverRoleLabel: string;
  giverRealm: 'isekai_town' | 'outskirts_forest' | 'outskirts_caves';
  giverX: number;
  coatColor: string;
  hairColor: string;
  shirtColor: string;
  targetRealm: 'outskirts_forest' | 'outskirts_caves';
  twistTriggerKills: number;
  hookSummary: string;
  giverOpeningDialogue: string[];
  twistTitle: string;
  twistRevelation: string;
  twistDialogue: string[];
  bossName: string;
  bossTitle: string;
  bossArchetype: EnemyArchetype;
  bossSpawnX: number;
  bossHp: number;
  bossDamage: number;
  bossDefeatLine: string;
  rewardGold: number;
  rewardStatPoints: number;
  rewardStarStones: number;
}

export interface SideQuestProgress {
  stage: SideQuestStage;
  kills: number;
  twistRevealed: boolean;
  bossSpawned: boolean;
}

export type GuildRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type GuildMissionId =
  | 'f_goblin_warren'
  | 'e_hobgoblin_caves'
  | 'd_deep_goblin_keep'
  | 'c_demon_vanguard'
  | 'b_princess_carriage'
  | 'b_demon_invasion'
  | 'a_three_demon_kings'
  | 's_seventeen_demon_kings';

export type OutfitStyle =
  | 'knight_plate'
  | 'adventurer_tunic'
  | 'guild_coat'
  | 'demon_slayer'
  | 'royal_regalia';

export type HeadgearStyle = 'helm' | 'beret' | 'bandana' | 'circlet';

export interface WarriorCustomization {
  cloakColor: string;
  armorColor: string;
  visorColor: string;
  plumeColor: string;
  outfitStyle?: OutfitStyle;
  headgearStyle?: HeadgearStyle;
  crownEquipped?: boolean;
}

export type MegaBossArchetype = 'mega_dio' | 'mega_undead_knight';

export type MegaSkillAnimStyle =
  | 'mega_cross_swords'
  | 'mega_prism_knives'
  | 'mega_clock_shatter'
  | 'mega_rainbow_barrage'
  | 'mega_guillotine'
  | 'mega_sword_vortex'
  | 'mega_soulfire_pillars'
  | 'mega_cross_execution'
  | 'gyro_green_ball';

export interface MegaBossSkillDef {
  id: string;
  name: string;
  animStyle: MegaSkillAnimStyle;
  palette: [string, string, string];
  damageMult: number;
  shout: string;
}

export interface BossDef {
  index: number; // 1 .. 120+
  name: string;
  title: string;
  standName: string;
  biome: BiomeId;
  climate: BossClimateId;
  climateLabel: string;
  climateSkyTop: string;
  climateSkyBottom: string;
  climateParticleColor: string;
  maxHp: number;
  baseMaxHp?: number;
  difficultyMultiplier?: number;
  defeatedScale?: number;
  primaryColor: string;
  secondaryColor: string;
  auraColor: string;
  skinColor: string;
  isMegaBoss?: boolean;
  isGyroBoss?: boolean;
  gyroAttackDamage?: number;
  emotes?: string[];
  megaArchetype?: MegaBossArchetype;
  megaSkills?: MegaBossSkillDef[];
  hatStyle:
    | 'crown'
    | 'pompadour'
    | 'tophat'
    | 'visor'
    | 'hood'
    | 'horns'
    | 'halo_spikes'
    | 'samurai_crest'
    | 'gyro_hat';
  coatStyle: 'cape' | 'trench' | 'armor' | 'vest' | 'robes' | 'spiked_mantle';
  standShape: 'brawler' | 'reaper' | 'knight' | 'clockwork' | 'serpent' | 'sovereign';
  emblem: 'star' | 'clock' | 'skull' | 'diamond' | 'eye' | 'flame';
  scaleFactor: number;
  voiceLine: string;
  battleShout: string;
  defeatLine: string;
  attackPattern:
    | 'time_knives'
    | 'stand_barrage'
    | 'pillar_slam'
    | 'gravity_orb'
    | 'blood_scythe'
    | 'lightning_overdrive'
    | 'magma_eruption'
    | 'chrono_shear'
    | 'gyro_spin';
  attackName: string;
  music: BossMusicConfig;
}

export interface Platform {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'floor' | 'brick' | 'carpet_ledge' | 'secret_bridge' | 'bridge';
  breakable?: boolean;
}

export interface CandleProp {
  id: string;
  x: number;
  y: number;
  kind: 'wall_sconce' | 'candelabra' | 'brazier' | 'rune_lantern';
  phase: number;
}

export interface InteractableProp {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind:
    | 'throne'
    | 'broken_brick'
    | 'lever'
    | 'pressure_plate'
    | 'chest'
    | 'checkpoint'
    | 'tapestry'
    | 'escape_gate'
    | 'isekai_portal'
    | 'guild_door'
    | 'wardrobe_door'
    | 'potion_door'
    | 'weapons_door'
    | 'town_exit_door'
    | 'guild_reception'
    | 'guild_floor2_reception'
    | 'guild_stairs'
    | 'guild_bar'
    | 'wardrobe_counter'
    | 'potion_counter'
    | 'weapons_counter'
    | 'caravan_rider'
    | 'hot_spring'
    | 'fountain'
    | 'dungeon_hole'
    | 'dungeon_exit_rope'
    | 'dungeon_descend_gate'
    | 'citadel_portal'
    | 'arena_door'
    | 'arena_board'
    | 'stand_shrine'
    | 'mission_gate'
    | 'town_gate_out'
    | 'outskirts_return_town'
    | 'outskirts_cave_entrance'
    | 'outskirts_cave_exit'
    | 'side_quest_npc';
  label: string;
  dialogue: string[];
  speaker: string;
  activated: boolean;
  secretId?: string;
  rewardItemId?: string;
  rewardWeaponId?: WeaponId;
  checkpointIndex?: number;
  sideQuestId?: SideQuestId;
}

export interface HiddenPassage {
  id: string;
  index: number; // 1 .. 108+
  x: number;
  y: number;
  w: number;
  h: number;
  biome: BiomeId;
  puzzleType: 'cracked_wall' | 'royal_lever' | 'torch_plate' | 'illusory_tapestry';
  discovered: boolean;
  hintText: string;
  discoveryText: string;
  rewardText: string;
}

export interface EnemyState {
  id: string;
  archetype: EnemyArchetype;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  state: 'patrol' | 'windup' | 'attack' | 'recover' | 'ko';
  stateTimer: number;
  patrolOriginX: number;
  hitFlash: number;
  biome: BiomeId;
  rewardGold: number;
  koTimer: number;
  attackDamage?: number;
  isDungeonBoss?: boolean;
  sizeScale?: number;
  darkness?: number;
  variantStyle?: 'crimson_ash' | 'frost_seraph' | 'void_eclipse';
  statusBurnTimer?: number;
  statusFrostTimer?: number;
  statusVenomTimer?: number;
  stunTimer?: number;
  sideQuestId?: SideQuestId;
}

export type CitadelBossSkillName = 'Ram n Charge' | 'Stand Barrage' | 'Burst Crush!';

export type CitadelBossSkillPhase =
  | 'none'
  | 'ram_windup'
  | 'ram_charge'
  | 'barrage_charge'
  | 'barrage_unleash'
  | 'burst_punch'
  | 'burst_grab'
  | 'burst_slam';

export interface GroundCrackDecal {
  id: string;
  x: number;
  y: number;
  width: number;
  life: number;
  maxLife: number;
  seed: number;
}

export interface ActiveBoss {
  def: BossDef;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  state: 'intro' | 'idle' | 'windup' | 'attack' | 'recover' | 'ko';
  stateTimer: number;
  hitFlash: number;
  posePhase: number;
  arenaMinX: number;
  arenaMaxX: number;
  defeated: boolean;
  skillPhase?: CitadelBossSkillPhase;
  ramCooldown?: number;
  barrageCooldown?: number;
  burstPunchCooldown?: number;
  burstHitStreak?: number;
  barrageChargeProgress?: number;
  barrageWaveTimer?: number;
  activeSkillName?: CitadelBossSkillName | null;
  activeDialogue?: string | null;
  activeDialogueTimer?: number;
  ramHitPlayer?: boolean;
  stunTimer?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  fromPlayer: boolean;
  color: string;
  life: number;
  kind:
    | 'knife'
    | 'rune'
    | 'fireball'
    | 'slash_wave'
    | 'gravity_orb'
    | 'gyro_ball'
    | 'arrow'
    | 'succubus_orb'
    | 'purple_flame'
    | 'purple_meteor'
    | 'jjk_black_flash_orb'
    | 'jjk_uzumaki'
    | 'jjk_split_slash'
    | 'jjk_pachinko_ball'
    | 'jjk_lightning_bolt'
    | 'jjk_transfig_orb'
    | 'jjk_magma_meteor'
    | 'jjk_piercing_blood'
    | 'jjk_exec_blade'
    | 'jjk_cursed_nail'
    | 'jjk_blue_pull'
    | 'jjk_red_repulse'
    | 'jjk_hollow_sphere'
    | 'jjk_chain_spear'
    | 'jjk_rika_beam_orb'
    | 'jjk_nue_bolt'
    | 'jjk_collapse_boulder';
  spinPhase?: number;
  targetsCarriage?: boolean;
  boomerangReturn?: boolean;
  boomerangAge?: number;
  hitTargetIds?: string[];
  homingStrength?: number;
  gravityScale?: number;
  bounceFloor?: boolean;
  pullPlayerStrength?: number;
  beamLength?: number;
  drainStamina?: number;
  slowSeconds?: number;
}

export interface DialogueState {
  speaker: string;
  portraitKind: 'warrior' | 'throne' | 'candle' | 'secret' | 'boss' | 'system' | 'npc' | 'princess';
  portraitColor: string;
  lines: string[];
  lineIndex: number;
  charIndex: number;
  charTimer: number;
  active: boolean;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  facing: 1 | -1;
  onGround: boolean;
  coyoteTimer: number;
  jumpBufferTimer: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  gold: number;
  equippedWeapon: WeaponId;
  unlockedWeapons: WeaponId[];
  skillSlots: [SkillId, SkillId, SkillId];
  skillCooldowns: [number, number, number];
  dashCooldown: number;
  attackPhase: 'none' | 'windup' | 'active' | 'recovery';
  attackTimer: number;
  comboStep: number;
  comboSubStep: number;
  comboSubTimer: number;
  comboWindowTimer: number;
  isSpinDashAttack: boolean;
  spinDashTimer: number;
  damageBoostMultiplier: number;
  damageBoostTimer: number;
  hotSpringTimer?: number;
  invulnTimer: number;
  parryTimer: number;
  chronoFreezeTimer: number;
  hitFlash: number;
  squashX: number;
  squashY: number;
  walkCycle: number;
  idleTimer: number;
  bossesDefeated: number;
  monstersSlain: number;
  secretsFound: number;
  level: number;
  statPoints: number;
  stats: PlayerStats;
  customization: WarriorCustomization;
  highestCheckpointX: number;
  highestCheckpointIndex: number;
  starStones?: number;
  equippedStand?: StandId;
  unlockedStands?: StandId[];
  dinoFormTimer?: number;
}

export type WorldRole = 'host' | 'guest';

export interface OnlineWorldSummary {
  worldId: string;
  hostPeerId: string;
  hostName: string;
  biome: BiomeId;
  bossesDefeated: number;
  playerCount: number;
  isPublic: boolean;
}

export interface OnlineAdventurer {
  id: string;
  name: string;
  realm: RealmMode;
  guildRank: GuildRank;
  worldId: string;
}

export interface GuildInvite {
  inviteId: string;
  fromPeerId: string;
  fromName: string;
  fromRank: GuildRank;
  missionId: GuildMissionId;
  missionTitle: string;
  worldId: string;
}

export interface BasteraSaveSummary {
  saveId: string;
  playerName: string;
  savedAt: string;
  biome: BiomeId;
  level: number;
  bossesDefeated: number;
  distanceMeters: number;
  gold: number;
  equippedWeapon: WeaponId;
  guildRank?: GuildRank;
  realm?: RealmMode;
}

export interface MultiplayerPeer {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  anim: 'idle' | 'run' | 'jump' | 'attack' | 'skill';
  weaponId: string;
  biome: string;
  realm?: RealmMode;
  guildRank?: GuildRank;
  bossesDefeated: number;
  color: string;
  customization?: WarriorCustomization;
  worldId?: string;
  role?: WorldRole;
}

export type BossBattlePhase =
  | 'intro'
  | 'menu'
  | 'player_anim'
  | 'potion_anim'
  | 'enemy_anim'
  | 'run_anim'
  | 'escape_anim'
  | 'victory'
  | 'defeat';

export interface BossBattleSlashFx {
  target: 'boss' | 'player';
  style:
    | 'sword'
    | 'cross'
    | 'barrage'
    | 'fire'
    | 'solar'
    | 'stand_claw'
    | 'knife_volley'
    | 'seismic'
    | 'void_crush'
    | 'lightning'
    | 'ora_barrage'
    | 'orb_flame'
    | 'orb_wind'
    | 'orb_electric'
    | MegaSkillAnimStyle;
  color: string;
  accentColor: string;
  palette?: [string, string, string];
  skillName?: string;
  progress: number; // 0..1
}

export interface BossBattleSnapshot {
  bossIndex: number;
  bossName: string;
  bossTitle: string;
  standName: string;
  biome: BiomeId;
  climateLabel: string;
  attackName: string;
  bossHp: number;
  bossMaxHp: number;
  phase: BossBattlePhase;
  message: string;
  speaker: string;
  lastPlayerDamage: number | null;
  lastBossDamage: number | null;
  guardActive: boolean;
  bossFrozenTurns: number;
  bossStunReason?: 'freeze' | 'electric' | null;
  windVulnerable?: boolean;
  primaryColor: string;
  secondaryColor: string;
  auraColor: string;
  isMegaBoss?: boolean;
  isGyroBoss?: boolean;
  gyroEmote?: string | null;
  megaArchetype?: MegaBossArchetype;
  activeSkillName?: string | null;
  activeSkillPalette?: [string, string, string] | null;
}

export interface MegaCutsceneHud {
  archetype: MegaBossArchetype | 'gyro_zeppeli';
  name: string;
  title: string;
  standName: string;
  subtitle: string;
  phase: 'glitch' | 'reveal';
  progress: number;
}

export interface IsekaiNpc {
  id: string;
  name: string;
  role:
    | 'townfolk'
    | 'merchant'
    | 'guard'
    | 'adventurer'
    | 'drinker'
    | 'receptionist'
    | 'tailor'
    | 'alchemist'
    | 'blacksmith'
    | 'onsen_attendant'
    | 'caravan_master';
  x: number;
  y: number;
  minX: number;
  maxX: number;
  speed: number;
  facing: 1 | -1;
  walkCycle: number;
  coatColor: string;
  hairColor: string;
  shirtColor: string;
  sitting?: boolean;
  drinkingPhase?: number;
  rebuildingHouseIndex?: number | null;
  hammerPhase?: number;
  homeMinX?: number;
  homeMaxX?: number;
  dialogue: string[];
  crownedDialogue?: string[];
}

export interface AlliedNpc {
  id: string;
  name: string;
  role: 'knight' | 'lancer' | 'mage';
  x: number;
  y: number;
  vx: number;
  facing: 1 | -1;
  hp: number;
  maxHp: number;
  attackCooldown: number;
  healCooldown?: number;
  walkCycle: number;
  hitFlash: number;
  armorColor: string;
  cloakColor: string;
  weaponColor: string;
}

export type DemonKingFaceStyle =
  | 'monarch_glow'
  | 'cyclops_crown'
  | 'stitched_smile'
  | 'blindfold_rune'
  | 'dragon_visage'
  | 'cracked_halo'
  | 'scarred_marshal'
  | 'void_mask'
  | 'horned_emperor';

export type DemonKingWeaponStyle =
  | 'katana'
  | 'greatsword'
  | 'scythe'
  | 'halberd'
  | 'dual_daggers'
  | 'hammer'
  | 'staff'
  | 'chains'
  | 'spears'
  | 'cards';

export type DemonKingSpecialAbility =
  | 'shadow_arise'
  | 'spatial_cut'
  | 'frost_domain'
  | 'chrono_rewind'
  | 'plague_swarm'
  | 'gacha_summon'
  | 'estate_bastion'
  | 'dragon_fear'
  | 'lightning_overdrive'
  | 'blood_drain'
  | 'gravity_crush'
  | 'soul_burn'
  | 'mirror_parry'
  | 'nano_swarm'
  | 'berserk_fury'
  | 'star_meteor'
  | 'eclipse_doom';

export interface DemonKingEntity {
  id: string;
  index: number;
  totalStages?: number;
  name: string;
  title: string;
  manhwaSource?: string;
  sizeScale?: number;
  faceStyle?: DemonKingFaceStyle;
  weaponName?: string;
  weaponStyle?: DemonKingWeaponStyle;
  weaponColor?: string;
  armorColor?: string;
  capeColor?: string;
  companionName?: string;
  skills?: [string, string, string];
  specialAbility?: DemonKingSpecialAbility;
  specialDesc?: string;
  shieldHp?: number;
  rewindUsed?: boolean;
  specialTimer?: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  hitFlash: number;
  purpleFlameTimer: number;
  castIndex: number;
  activeSkillBanner: string | null;
  activeSkillTimer: number;
  primaryColor: string;
  hornColor: string;
  auraColor: string;
  defeated: boolean;
  stunTimer?: number;
  windVulnerable?: boolean;
  damageMult?: number;
}

export type PurpleFlameKind =
  | 'violet_pillars'
  | 'purple_meteors'
  | 'abyssal_nova'
  | 'shadow_crescent'
  | 'rimuru_megiddo'
  | 'rimuru_black_lightning'
  | 'rimuru_beelzebuth'
  | 'gs_gate_scroll'
  | 'gs_shield_shock'
  | 'gs_oil_bomb'
  | 'bandit_firebomb'
  | 'jjk_domain_void'
  | 'jjk_domain_shrine'
  | 'jjk_domain_chains'
  | 'jjk_domain_swords'
  | 'jjk_domain_shadow'
  | 'jjk_domain_ratio'
  | 'jjk_domain_station'
  | 'jjk_domain_womb'
  | 'jjk_domain_arsenal'
  | 'jjk_domain_gamble'
  | 'jjk_domain_amber'
  | 'jjk_domain_perfection'
  | 'jjk_domain_coffin'
  | 'jjk_domain_blood'
  | 'jjk_domain_court'
  | 'jjk_domain_straw'
  | 'jjk_hollow_purple'
  | 'jjk_red_blue'
  | 'jjk_cleave_storm'
  | 'jjk_rika_beam'
  | 'jjk_black_flash'
  | 'jjk_uzumaki_vortex'
  | 'jjk_split_soul_slash'
  | 'jjk_jackpot_fever'
  | 'jjk_kashimo_thunder'
  | 'jjk_idle_transfig'
  | 'jjk_jogo_volcano'
  | 'jjk_piercing_blood'
  | 'jjk_deadly_gavel'
  | 'jjk_straw_resonance'
  | 'jjk_world_cut'
  | 'jjk_tether_trap'
  | 'jjk_cursed_speech_wave'
  | 'jjk_max_elephant'
  | 'jjk_collapse_rubble'
  | 'jjk_divergent_burst'
  | 'jjk_curse_swarm'
  | 'jjk_shutter_doors'
  | 'jjk_sky_lightning'
  | 'jjk_soul_spikes'
  | 'jjk_meteor_crater'
  | 'jjk_supernova_ring'
  | 'jjk_gavel_verdict'
  | 'jjk_hairpin_mine';

export interface PurpleFlameZone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  life: number;
  maxLife: number;
  damage: number;
  kind: PurpleFlameKind;
  hasHit: boolean;
  hitHouses?: boolean;
  telegraphTime?: number;
}

export type TownRaiderId = 'rimuru_tempest' | 'goblin_slayer';

export interface TownHouseDamage {
  index: number;
  x: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  broken: boolean;
  rebuilding?: boolean;
  hitFlash: number;
}

export interface ActiveTownRaid {
  raiderId: TownRaiderId;
  name: string;
  title: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  attackDamage: number;
  facing: 1 | -1;
  onGround: boolean;
  state: 'march' | 'windup' | 'attack' | 'aoe_cast' | 'recover';
  stateTimer: number;
  aoeCooldown: number;
  attackCooldown: number;
  castIndex: number;
  targetHouseIdx: number | null;
  hitFlash: number;
  walkCycle: number;
  activeSkillBanner: string | null;
  activeSkillTimer: number;
  stunTimer?: number;
  windVulnerable?: boolean;
}

export interface CarriageEscortState {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  progress: number; // 0 .. 100
  speed: number;
  wheelPhase: number;
  hitFlash: number;
  wavesSpawned: number;
  variant?: number;
}

export interface IsekaiMissionHud {
  missionId: GuildMissionId;
  title: string;
  rank: GuildRank;
  objectiveText: string;
  killsDone: number;
  killsRequired: number;
  carriageHp?: number;
  carriageMaxHp?: number;
  carriageProgress?: number;
  demonKings?: {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    defeated: boolean;
    active?: boolean;
    windVulnerable?: boolean;
    stunned?: boolean;
  }[];
  currentDemonKingStage?: number;
  totalDemonKingStages?: number;
  activeKingMeta?: {
    stage: number;
    totalStages: number;
    name: string;
    title: string;
    manhwaSource?: string;
    weaponName?: string;
    companionName?: string;
    skills?: [string, string, string];
    specialDesc?: string;
    shieldHp?: number;
  } | null;
  alliedNpcs?: { id: string; name: string; hp: number; maxHp: number }[];
  activeCastBanner?: string | null;
  completed: boolean;
}

export interface CoronationCutsceneHud {
  phase: 'approach' | 'crowning' | 'cheering';
  progress: number;
  subtitle: string;
}

export type ArenaChallengerId =
  | 'satoru_gojo'
  | 'ryomen_sukuna'
  | 'toji_fushiguro'
  | 'yuta_okkotsu'
  | 'megumi_fushiguro'
  | 'kento_nanami'
  | 'yuji_itadori'
  | 'suguru_geto'
  | 'maki_zenin'
  | 'kinji_hakari'
  | 'hajime_kashimo'
  | 'mahito'
  | 'jogo'
  | 'choso'
  | 'hiromi_higuruma'
  | 'nobara_kugisaki';

export type ArenaWorldOrigin =
  | 'Jujutsu Kaisen · Limitless'
  | 'Jujutsu Kaisen · King of Curses'
  | 'Jujutsu Kaisen · Sorcerer Killer'
  | 'Jujutsu Kaisen · Special Grade'
  | 'Jujutsu Kaisen · Ten Shadows'
  | 'Jujutsu Kaisen · Grade 1 Tactician'
  | 'Jujutsu Kaisen · Black Flash Vessel'
  | 'Jujutsu Kaisen · Curse Manipulator'
  | 'Jujutsu Kaisen · Heavenly Restriction'
  | 'Jujutsu Kaisen · Restless Gambler'
  | 'Jujutsu Kaisen · God of Lightning'
  | 'Jujutsu Kaisen · Idle Transfiguration'
  | 'Jujutsu Kaisen · Disaster Flame'
  | 'Jujutsu Kaisen · Death Painting'
  | 'Jujutsu Kaisen · Deadly Sentencing'
  | 'Jujutsu Kaisen · Straw Doll';

export interface ArenaSkillDef {
  id: string;
  name: string;
  damage: number;
  kind:
    | 'limitless_blue_red'
    | 'hollow_purple'
    | 'shrine_cleave'
    | 'divine_flame_fuga'
    | 'heavenly_blitz'
    | 'inverted_spear'
    | 'rika_manifest'
    | 'cursed_speech'
    | 'ten_shadows_summon'
    | 'ratio_collapse'
    | 'black_flash_rush'
    | 'cursed_uzumaki'
    | 'split_soul_katana'
    | 'jackpot_pachinko'
    | 'amber_lightning'
    | 'idle_transfiguration'
    | 'disaster_flames'
    | 'blood_manipulation'
    | 'deadly_sentencing'
    | 'straw_doll_resonance';
  color: string;
  shout: string;
}

export interface ArenaChallengerDef {
  id: ArenaChallengerId;
  name: string;
  title: string;
  worldOrigin: ArenaWorldOrigin;
  weaponName: string;
  maxHp: number;
  attackDamage: number;
  moveSpeed: number;
  primaryColor: string;
  secondaryColor: string;
  auraColor: string;
  hairColor: string;
  capeColor: string;
  weaponColor: string;
  description: string;
  skills: [ArenaSkillDef, ArenaSkillDef, ArenaSkillDef];
}

export interface ActiveArenaDuel {
  challengerId: ArenaChallengerId;
  def: ArenaChallengerDef;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  matchedAtk: number;
  matchedSpeed: number;
  facing: 1 | -1;
  onGround: boolean;
  state: 'idle' | 'approach' | 'windup' | 'attack' | 'recover' | 'guard' | 'dodge';
  stateTimer: number;
  attackCooldown: number;
  skillCooldown: number;
  skillIndex: number;
  comboStep: number;
  guardTimer: number;
  dodgeCooldown: number;
  invulnTimer: number;
  hitFlash: number;
  walkCycle: number;
  aiActionTag: string | null;
  activeSkillBanner: string | null;
  activeSkillTimer: number;
  stunTimer: number;
  windVulnerable: boolean;
  domainActive: boolean;
  domainTimer: number;
  domainCooldown: number;
  domainName: string;
  domainCastCount: number;
  roundNumber: number;
  playerRoundWins: number;
  opponentRoundWins: number;
  roundHistory: ('player' | 'opponent')[];
  roundPhase: 'countdown' | 'fighting' | 'round_over';
  roundPhaseTimer: number;
  fightBannerTimer: number;
  lastRoundWinner: 'player' | 'opponent' | null;
}

export interface DungeonChoicePending {
  missionId: GuildMissionId;
  missionTitle: string;
  realm: 'goblin_dungeon' | 'demon_realm';
  nextDepth: number;
  promotedRank: GuildRank | null;
  rewardGold: number;
}

export interface HudSnapshot {
  status: GameStatus;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  gold: number;
  level: number;
  statPoints: number;
  stats: PlayerStats;
  customization: WarriorCustomization;
  monstersSlain: number;
  biome: BiomeId;
  biomeLabel: string;
  distanceMeters: number;
  bossesDefeated: number;
  totalBosses: number;
  secretsFound: number;
  totalSecrets: number;
  equippedWeapon: WeaponId;
  unlockedWeapons: WeaponId[];
  skillSlots: [SkillId, SkillId, SkillId];
  skillCooldowns: [number, number, number];
  dashCooldown: number;
  starPlatinumActive: boolean;
  starStones: number;
  equippedStand: StandId;
  unlockedStands: StandId[];
  dinoFormSeconds: number;
  chiliPepperSeconds: number;
  bossCooldownSeconds: number;
  bossFoughtStreak: number;
  idleSecondsToIsekai: number;
  realm: RealmMode;
  guildRank: GuildRank;
  rankMissionsCompleted: number;
  missionsRequiredPerRank: number;
  bRankEscortsCompleted: number;
  acceptedMissionId: GuildMissionId | null;
  dungeonTarget: 'goblin_dungeon' | 'demon_realm' | 'demon_king_arena';
  dungeonDepth: number;
  dungeonChoicePending: DungeonChoicePending | null;
  endlessContractCleared: boolean;
  activeGuildFloor: 1 | 2;
  damageBoostMultiplier: number;
  damageBoostSeconds: number;
  hotSpringSeconds: number;
  isNightTime: boolean;
  nightFactor: number;
  secondsToNightToggle: number;
  unlockedWardrobe: string[];
  crownUnlocked: boolean;
  gyroDefeated: boolean;
  isekaiPortalOpen: boolean;
  isekaiMission: IsekaiMissionHud | null;
  coronationCutscene: CoronationCutsceneHud | null;
  caravanRide: {
    destinationLabel: string;
    progress: number;
  } | null;
  arenaWins: number;
  townRaid: {
    raiderId: TownRaiderId;
    name: string;
    title: string;
    hp: number;
    maxHp: number;
    attackDamage: number;
    activeSkillBanner: string | null;
    housesBroken: number;
    totalHouses: number;
  } | null;
  secondsToTownRaid: number;
  townDamageStatus: {
    broken: number;
    rebuilding: number;
    total: number;
  } | null;
  arenaDuel: {
    challengerId: ArenaChallengerId;
    name: string;
    title: string;
    worldOrigin: ArenaWorldOrigin;
    weaponName: string;
    hp: number;
    maxHp: number;
    matchedAtk: number;
    matchedSpeed: number;
    activeSkillBanner: string | null;
    aiActionTag: string | null;
    winsCount: number;
    roundNumber: number;
    playerRoundWins: number;
    opponentRoundWins: number;
    roundHistory: ('player' | 'opponent')[];
    roundPhase: 'countdown' | 'fighting' | 'round_over';
    countdownSeconds: number;
    fightBannerActive: boolean;
    lastRoundWinner: 'player' | 'opponent' | null;
    activeDomain: {
      name: string;
      challengerId: ArenaChallengerId;
      secondsLeft: number;
    } | null;
  } | null;
  sideQuests: Array<SideQuestDef & { progress: SideQuestProgress }>;
  trackedSideQuestId: SideQuestId | null;
  onlineAdventurers: OnlineAdventurer[];
  pendingGuildInvites: GuildInvite[];
  inventory: InventoryItem[];
  dialogue: DialogueState | null;
  activeBoss: {
    index: number;
    name: string;
    title: string;
    standName: string;
    climateLabel: string;
    hp: number;
    maxHp: number;
    defeatedScale: number;
    bossesDefeated: number;
    bossAtk: number;
    voiceLine: string;
    skillName: CitadelBossSkillName | null;
    skillPhase: CitadelBossSkillPhase;
    skillDialogue: string | null;
    burstStreak: number;
    critCount?: number;
    isMegaBoss?: boolean;
    isGyroBoss?: boolean;
    megaArchetype?: MegaBossArchetype;
  } | null;
  bossBattle: BossBattleSnapshot | null;
  megaCutscene: MegaCutsceneHud | null;
  checkpoints: { index: number; x: number; biome: BiomeId; label: string; reached: boolean }[];
  onlineCount: number;
  worldId: string;
  worldRole: WorldRole;
  worldHostName: string | null;
  isWorldPublic: boolean;
  onlineWorlds: OnlineWorldSummary[];
  worldPlayerCount: number;
  lastSavedAt: string | null;
  announcement: string | null;
  secretCaption: { title: string; detail: string } | null;
  nearbyPrompt: string | null;
  muted: boolean;
}


