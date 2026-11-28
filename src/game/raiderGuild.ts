import type {
  DemonicBossMutation,
  DungeonDesignId,
  EnemyArchetype,
  EnemyState,
  InteractableProp,
  IsekaiNpc,
  Platform,
  Projectile,
  PurpleFlameKind,
  RaiderDemonicBossEntity,
  RaiderDungeonDef,
  RaiderRankId,
} from './types';
import { FLOOR_Y } from './worldGen';

export interface RaiderRankDef {
  id: RaiderRankId;
  order: number;
  title: string;
  color: string;
  borderColor: string;
  minPoints: number;
  atkBonusPct: number;
  goldBonusPct: number;
  description: string;
}

export const RAIDER_RANKS: RaiderRankDef[] = [
  {
    id: 'Bronze',
    order: 0,
    title: 'Bronze Delver',
    color: '#d97706',
    borderColor: '#f59e0b',
    minPoints: 0,
    atkBonusPct: 0,
    goldBonusPct: 0,
    description: 'Initiate Raider cleared for Bronze D-001 to D-015 Crypt & Forge runs.',
  },
  {
    id: 'Silver',
    order: 1,
    title: 'Silver Crypt-Breaker',
    color: '#cbd5e1',
    borderColor: '#f1f5f9',
    minPoints: 120,
    atkBonusPct: 6,
    goldBonusPct: 10,
    description: 'Proven multi-floor clearer granted access to Silver D-016 to D-030 vaults.',
  },
  {
    id: 'Gold',
    order: 2,
    title: 'Gold Vanguard',
    color: '#fbbf24',
    borderColor: '#fef08a',
    minPoints: 300,
    atkBonusPct: 12,
    goldBonusPct: 20,
    description: 'Seasoned demon slayer authorized for Glacial Spires & Abbey raids (D-031–D-048).',
  },
  {
    id: 'Platinum',
    order: 3,
    title: 'Platinum Tactician',
    color: '#38bdf8',
    borderColor: '#bae6fd',
    minPoints: 580,
    atkBonusPct: 18,
    goldBonusPct: 30,
    description: 'Elite floor commander trusted inside Blighted Hives & Brass Babel (D-049–D-066).',
  },
  {
    id: 'Mythril',
    order: 4,
    title: 'Mythril Calamity-Hunter',
    color: '#34d399',
    borderColor: '#a7f3d0',
    minPoints: 960,
    atkBonusPct: 25,
    goldBonusPct: 45,
    description: 'Master delver hunting Astral Void & Babel Demon Overlords (D-067–D-081).',
  },
  {
    id: 'Orichalcum',
    order: 5,
    title: 'Orichalcum Marshal',
    color: '#f472b6',
    borderColor: '#fbcfe8',
    minPoints: 1450,
    atkBonusPct: 34,
    goldBonusPct: 60,
    description: 'Fearless warlord breaching Flesh Labyrinths & high abyss vaults (D-082–D-093).',
  },
  {
    id: 'Adamantite',
    order: 6,
    title: 'Adamantite Dread-Slayer',
    color: '#a855f7',
    borderColor: '#e9d5ff',
    minPoints: 2100,
    atkBonusPct: 45,
    goldBonusPct: 80,
    description: 'Mythic vanguard authorized to storm Pandemonium Citadels (D-094–D-102).',
  },
  {
    id: 'Monarch',
    order: 7,
    title: 'Apex Demon-Bane Monarch',
    color: '#ef4444',
    borderColor: '#fde047',
    minPoints: 2900,
    atkBonusPct: 60,
    goldBonusPct: 100,
    description: 'Supreme Raider Sovereign commanding all 108 Abyssal Dungeons (D-103–D-108).',
  },
];

export const RAIDER_RANK_ORDER: RaiderRankId[] = RAIDER_RANKS.map((r) => r.id);

export function getRaiderRankDef(rank: RaiderRankId): RaiderRankDef {
  return RAIDER_RANKS.find((r) => r.id === rank) ?? RAIDER_RANKS[0];
}

export function getRaiderRankForPoints(points: number): RaiderRankId {
  let current: RaiderRankId = 'Bronze';
  for (const r of RAIDER_RANKS) {
    if (points >= r.minPoints) {
      current = r.id;
    }
  }
  return current;
}

export function getNextRaiderRankInfo(points: number): {
  current: RaiderRankDef;
  next: RaiderRankDef | null;
  pointsToNext: number;
} {
  const currentId = getRaiderRankForPoints(points);
  const idx = RAIDER_RANKS.findIndex((r) => r.id === currentId);
  const current = RAIDER_RANKS[Math.max(0, idx)];
  const next = idx >= 0 && idx < RAIDER_RANKS.length - 1 ? RAIDER_RANKS[idx + 1] : null;
  return {
    current,
    next,
    pointsToNext: next ? Math.max(0, next.minPoints - points) : 0,
  };
}

export function isRaiderDungeonUnlocked(dungeon: RaiderDungeonDef, playerRank: RaiderRankId): boolean {
  return RAIDER_RANK_ORDER.indexOf(playerRank) >= RAIDER_RANK_ORDER.indexOf(dungeon.requiredRank);
}

export interface DungeonDesignTheme {
  id: DungeonDesignId;
  label: string;
  skyTop: string;
  skyBottom: string;
  wallColor: string;
  pillarColor: string;
  floorBase: string;
  floorTrim: string;
  stairColor: string;
  accentColor: string;
  monsterPool: EnemyArchetype[];
  mutation: DemonicBossMutation;
  bossPrimary: string;
  bossSecondary: string;
  bossAura: string;
  hornStyle: 'twisted_ram' | 'crown_spikes' | 'halo_bones' | 'curved_oni';
  weaponStyle: 'hell_cleaver' | 'twin_scythes' | 'chain_greatsword' | 'abyss_trident';
}

export const DUNGEON_DESIGNS: Record<DungeonDesignId, DungeonDesignTheme> = {
  sunken_crypt: {
    id: 'sunken_crypt',
    label: 'Sunken Bone Catacombs',
    skyTop: '#070b14',
    skyBottom: '#131d2c',
    wallColor: '#1e293b',
    pillarColor: '#334155',
    floorBase: '#1e293b',
    floorTrim: '#38bdf8',
    stairColor: '#94a3b8',
    accentColor: '#38bdf8',
    monsterPool: ['skeleton_guard', 'cursed_armor', 'shadow_bat', 'cultist_mage'],
    mutation: 'chained_executioner',
    bossPrimary: '#334155',
    bossSecondary: '#e2e8f0',
    bossAura: '#38bdf8',
    hornStyle: 'halo_bones',
    weaponStyle: 'hell_cleaver',
  },
  obsidian_forge: {
    id: 'obsidian_forge',
    label: 'Infernal Obsidian Forge',
    skyTop: '#160705',
    skyBottom: '#3b1109',
    wallColor: '#29120e',
    pillarColor: '#451a03',
    floorBase: '#271310',
    floorTrim: '#f97316',
    stairColor: '#b45309',
    accentColor: '#fb923c',
    monsterPool: ['raider_iron_golem', 'raider_abyssal_imp', 'bandit_pyromancer', 'demon_tank'],
    mutation: 'magma_horn_colossus',
    bossPrimary: '#7c2d12',
    bossSecondary: '#f97316',
    bossAura: '#fbbf24',
    hornStyle: 'curved_oni',
    weaponStyle: 'hell_cleaver',
  },
  crimson_abbey: {
    id: 'crimson_abbey',
    label: 'Blood-Stained Crimson Abbey',
    skyTop: '#14040a',
    skyBottom: '#38091a',
    wallColor: '#2a0a16',
    pillarColor: '#4c0519',
    floorBase: '#260813',
    floorTrim: '#e11d48',
    stairColor: '#9f1239',
    accentColor: '#fb7185',
    monsterPool: ['gargoyle_charger', 'cultist_mage', 'demon_succubus', 'raider_hell_executioner'],
    mutation: 'six_eyed_seraph_rot',
    bossPrimary: '#881337',
    bossSecondary: '#fda4af',
    bossAura: '#f43f5e',
    hornStyle: 'crown_spikes',
    weaponStyle: 'twin_scythes',
  },
  glacial_spire: {
    id: 'glacial_spire',
    label: 'Frostbound Astral Vault',
    skyTop: '#041224',
    skyBottom: '#0c2d48',
    wallColor: '#0f2942',
    pillarColor: '#1e4e6e',
    floorBase: '#0b2239',
    floorTrim: '#67e8f9',
    stairColor: '#7dd3fc',
    accentColor: '#22d3ee',
    monsterPool: ['raider_frost_wraith', 'cursed_armor', 'gargoyle_charger', 'phantom_wisp'],
    mutation: 'frost_abyss_archfiend',
    bossPrimary: '#0e7490',
    bossSecondary: '#cffafe',
    bossAura: '#38bdf8',
    hornStyle: 'crown_spikes',
    weaponStyle: 'abyss_trident',
  },
  blighted_hive: {
    id: 'blighted_hive',
    label: 'Venomous Chitin Hive',
    skyTop: '#06150a',
    skyBottom: '#132e18',
    wallColor: '#122616',
    pillarColor: '#1e3f20',
    floorBase: '#112214',
    floorTrim: '#4ade80',
    stairColor: '#15803d',
    accentColor: '#84cc16',
    monsterPool: ['raider_spore_stalker', 'hobgoblin', 'shadow_bat', 'eldritch_ichor_hound'],
    mutation: 'chitin_plague_lord',
    bossPrimary: '#14532d',
    bossSecondary: '#bef264',
    bossAura: '#22c55e',
    hornStyle: 'twisted_ram',
    weaponStyle: 'twin_scythes',
  },
  clockwork_babel: {
    id: 'clockwork_babel',
    label: 'Brass Clockwork Babel',
    skyTop: '#161108',
    skyBottom: '#332512',
    wallColor: '#291e0e',
    pillarColor: '#78350f',
    floorBase: '#23180b',
    floorTrim: '#fbbf24',
    stairColor: '#d97706',
    accentColor: '#fde047',
    monsterPool: ['raider_iron_golem', 'demon_lightning', 'raider_void_acolyte', 'cursed_armor'],
    mutation: 'clockwork_beelzebub',
    bossPrimary: '#92400e',
    bossSecondary: '#fef08a',
    bossAura: '#f59e0b',
    hornStyle: 'halo_bones',
    weaponStyle: 'chain_greatsword',
  },
  void_observatory: {
    id: 'void_observatory',
    label: 'Astral Void Observatory',
    skyTop: '#070312',
    skyBottom: '#1e0b36',
    wallColor: '#18092e',
    pillarColor: '#3b0764',
    floorBase: '#130624',
    floorTrim: '#c084fc',
    stairColor: '#7e22ce',
    accentColor: '#e879f9',
    monsterPool: ['raider_void_acolyte', 'demon_lightning', 'phantom_wisp', 'eldritch_tendril_fiend'],
    mutation: 'astral_void_overlord',
    bossPrimary: '#4c1d95',
    bossSecondary: '#e9d5ff',
    bossAura: '#c084fc',
    hornStyle: 'twisted_ram',
    weaponStyle: 'abyss_trident',
  },
  flesh_labyrinth: {
    id: 'flesh_labyrinth',
    label: 'Abyssal Flesh Labyrinth',
    skyTop: '#130306',
    skyBottom: '#33060f',
    wallColor: '#28070f',
    pillarColor: '#5c0a1a',
    floorBase: '#22060c',
    floorTrim: '#ef4444',
    stairColor: '#b91c1c',
    accentColor: '#f87171',
    monsterPool: ['eldritch_ichor_hound', 'eldritch_tendril_fiend', 'raider_hell_executioner', 'demon_tank'],
    mutation: 'flayed_rib_monarch',
    bossPrimary: '#7f1d1d',
    bossSecondary: '#fecaca',
    bossAura: '#ef4444',
    hornStyle: 'halo_bones',
    weaponStyle: 'chain_greatsword',
  },
  pandemonium_citadel: {
    id: 'pandemonium_citadel',
    label: 'Sovereign Pandemonium Sanctum',
    skyTop: '#090208',
    skyBottom: '#3b0719',
    wallColor: '#1f0614',
    pillarColor: '#581c87',
    floorBase: '#18040e',
    floorTrim: '#f59e0b',
    stairColor: '#dc2626',
    accentColor: '#fbbf24',
    monsterPool: ['raider_hell_executioner', 'raider_abyssal_imp', 'raider_void_acolyte', 'eldritch_tendril_fiend'],
    mutation: 'apocalypse_archdemon',
    bossPrimary: '#450a0a',
    bossSecondary: '#fde047',
    bossAura: '#ef4444',
    hornStyle: 'curved_oni',
    weaponStyle: 'hell_cleaver',
  },
};

const DESIGN_ROTATION: DungeonDesignId[] = [
  'sunken_crypt',
  'obsidian_forge',
  'crimson_abbey',
  'glacial_spire',
  'blighted_hive',
  'clockwork_babel',
  'void_observatory',
  'flesh_labyrinth',
  'pandemonium_citadel',
];

const ADJECTIVES_A = [
  'Shattered',
  'Weeping',
  'Cindered',
  'Hollow',
  'Gilded',
  'Sunken',
  'Vicious',
  'Ashen',
  'Forsaken',
  'Ravenous',
  'Severed',
  'Blistered',
];

const NOUNS_BY_DESIGN: Record<DungeonDesignId, string[]> = {
  sunken_crypt: ['Bone Vault', 'Marrow Gallery', 'Grave Stair', 'Ossuary', 'Lich Tomb', 'Skull Cistern', 'Coffin Hall', 'Reliquary', 'Crypt Keep', 'Wight Nave', 'Sepulchre', 'Catacomb'],
  obsidian_forge: ['Slag Foundry', 'Anvil Pit', 'Magma Kiln', 'Bellows Deep', 'Crucible', 'Brimstone Mill', 'Ash Furnace', 'Cinder Works', 'Hell-Smelter', 'Iron Maw', 'Pyre Shaft', 'Forge Core'],
  crimson_abbey: ['Blood Choir', 'Narthex', 'Cloister', 'Chapel Rot', 'Confessional', 'Vesper Hall', 'Bell Crypt', 'Altar Deep', 'Crimson Nave', 'Penance Wing', 'Sanguine Loft', 'Abbey'],
  glacial_spire: ['Frost Bastion', 'Glacier Hold', 'Rime Vault', 'Permafrost', 'Icicle Nave', 'Boreal Gate', 'Hail Spire', 'Snow-Crypt', 'Ice Labyrinth', 'Shiver Hall', 'Aurora Ward', 'Zenith Ice'],
  blighted_hive: ['Spore Nest', 'Chitin Warren', 'Venom Comb', 'Mire Brood', 'Acid Tunnel', 'Blight Nursery', 'Larva Pit', 'Toxin Maw', 'Hive Spindle', 'Pustule Core', 'Plague Atrium', 'Miasma Nest'],
  clockwork_babel: ['Gearworks', 'Pendulum Deep', 'Brass Spire', 'Cog Labyrinth', 'Steam Piston', 'Mainspring', 'Chrono Shaft', 'Automaton Bay', 'Turbine Hall', 'Escapement', 'Dynamo Vault', 'Babel Tower'],
  void_observatory: ['Star Rift', 'Eclipse Dome', 'Nebula Hall', 'Null Spire', 'Astral Lens', 'Comet Vault', 'Parallax Well', 'Dark Zenith', 'Horizon Gate', 'Abyssal Chart', 'Orrery Keep', 'Void Sanctum'],
  flesh_labyrinth: ['Sinew Maze', 'Rib Corridor', 'Ichor Cistern', 'Tendon Pit', 'Viscera Vault', 'Pulse Chamber', 'Marrow Well', 'Flesh Choir', 'Scab Crypt', 'Nerve Conduit', 'Heart Deep', 'Gore Atrium'],
  pandemonium_citadel: ['Hellgate', 'Sulfur Throne', 'Demon Keep', 'Ruin Bastion', 'Inferno Wing', 'Brimstone Gate', 'Dread Spire', 'Wrath Hall', 'Archfiend Court', 'Doom Vault', 'Abyss Crown', 'Pandemonium'],
};

const DEMON_FIRST_NAMES = [
  'Azazel', 'Malphas', 'Baelgor', 'Vorgath', 'Xaphan', 'Kaelith', 'Morgul', 'Zagan', 'Naberius', 'Drakmor', 'Vepar', 'Baalor',
  'Samael', 'Orobas', 'Gremory', 'Amdusias', 'Dantalion', 'Barbatos', 'Belial', 'Paimon', 'Asmodai', 'Furfur', 'Raum', 'Bifrons',
  'Valefor', 'Marbas', 'Astaroth', 'Beleth', 'Leraje', 'Eligos', 'Zepar', 'Botis', 'Bathin', 'Sallos', 'Purson', 'Morax',
];

const DEMON_EPITHETS = [
  'the Rib-Splitter',
  'Archfiend of Screaming Brass',
  'the Seven-Horned Butcher',
  'Sovereign of Boiling Ichor',
  'the Crazed Maw-King',
  'Warden of Broken Stairs',
  'the Flayed Seraph',
  'Lord of Molten Chains',
  'the Eye-Crowned Ravager',
  'Harbinger of Red Dawn',
  'the Marrow-Grinder',
  'Emperor of Pitiless Fire',
];

function rankForDungeonId(id: number): RaiderRankId {
  if (id <= 15) return 'Bronze';
  if (id <= 30) return 'Silver';
  if (id <= 48) return 'Gold';
  if (id <= 66) return 'Platinum';
  if (id <= 81) return 'Mythril';
  if (id <= 93) return 'Orichalcum';
  if (id <= 102) return 'Adamantite';
  return 'Monarch';
}

export const TOTAL_RAIDER_DUNGEONS = 108;

export const RAIDER_DUNGEONS: RaiderDungeonDef[] = Array.from({ length: TOTAL_RAIDER_DUNGEONS }, (_, idx) => {
  const id = idx + 1;
  const code = `D-${String(id).padStart(3, '0')}`;
  const design = DESIGN_ROTATION[idx % DESIGN_ROTATION.length];
  const theme = DUNGEON_DESIGNS[design];
  const tierCopy = Math.floor(idx / DESIGN_ROTATION.length); // 0..11
  const adj = ADJECTIVES_A[(tierCopy + (idx % 5)) % ADJECTIVES_A.length];
  const nounList = NOUNS_BY_DESIGN[design];
  const noun = nounList[tierCopy % nounList.length];
  const requiredRank = rankForDungeonId(id);
  const rankIdx = RAIDER_RANK_ORDER.indexOf(requiredRank);
  const floors = id >= 82 ? 5 : id >= 31 ? 4 : 3;
  const recommendedLevel = 1 + Math.floor(id * 0.45);
  const firstName = DEMON_FIRST_NAMES[(idx * 7 + tierCopy) % DEMON_FIRST_NAMES.length];
  const epithet = DEMON_EPITHETS[(idx * 5 + tierCopy * 3) % DEMON_EPITHETS.length];

  return {
    id,
    code,
    name: `${adj} ${noun}`,
    design,
    designLabel: theme.label,
    requiredRank,
    floors,
    recommendedLevel,
    monsterPool: theme.monsterPool,
    bossName: `${firstName}, ${epithet}`,
    bossTitle: `Floor ${floors} Demon Overlord · ${theme.label}`,
    bossMutation: theme.mutation,
    bossPrimaryColor: theme.bossPrimary,
    bossSecondaryColor: theme.bossSecondary,
    bossAuraColor: theme.bossAura,
    bossHornStyle: theme.hornStyle,
    bossWeaponStyle: theme.weaponStyle,
    rewardGold: 110 + id * 28 + rankIdx * 45,
    rewardRaiderPoints: 35 + Math.floor(id * 2.2) + rankIdx * 18,
    rewardStarStones: id % 5 === 0 || rankIdx >= 4 ? 2 : 1,
  };
});

export function getRaiderDungeonById(id: number): RaiderDungeonDef {
  return RAIDER_DUNGEONS.find((d) => d.id === id) ?? RAIDER_DUNGEONS[0];
}

export function buildRaiderGuildPlatforms(): Platform[] {
  return [
    { id: 'raider_guild_floor', x: 0, y: FLOOR_Y, w: 1020, h: 46, kind: 'floor' },
    { id: 'raider_guild_catwalk_l', x: 240, y: FLOOR_Y - 56, w: 180, h: 10, kind: 'bridge' },
    { id: 'raider_guild_catwalk_r', x: 560, y: FLOOR_Y - 56, w: 190, h: 10, kind: 'bridge' },
  ];
}

export function buildRaiderGuildInteractables(): InteractableProp[] {
  return [
    {
      id: 'door_raider_guild_exit',
      x: 34,
      y: FLOOR_Y - 54,
      w: 36,
      h: 54,
      kind: 'town_exit_door',
      label: 'Exit to Solaris Town [F]',
      speaker: 'Raider Bastion Gate',
      dialogue: ['Stepping back out onto Solaris Town Avenue...'],
      activated: false,
    },
    {
      id: 'prop_raider_guild_desk',
      x: 430,
      y: FLOOR_Y - 46,
      w: 140,
      h: 46,
      kind: 'raider_guild_desk',
      label: 'Dungeon Raider Dispatch · 108 Unique Dungeons & Ranks [F]',
      speaker: 'Raider Guildmaster Vexor',
      dialogue: ['Pick any unlocked Dungeon D-001 to D-108, climb its stairs, and crush the Demon Overlord!'],
      activated: false,
    },
  ];
}

export function createRaiderGuildNpcs(rank: RaiderRankId): IsekaiNpc[] {
  return [
    {
      id: 'raider_npc_vexor',
      name: 'Guildmaster Vexor',
      role: 'blacksmith',
      x: 495,
      y: FLOOR_Y - 26,
      minX: 450,
      maxX: 545,
      speed: 14,
      facing: -1,
      walkCycle: 0.2,
      coatColor: '#7f1d1d',
      hairColor: '#e2e8f0',
      shirtColor: '#fbbf24',
      dialogue: [
        `Welcome to the Dungeon Raider Bastion, ${rank}-Rank Raider!`,
        'We chart 108 cursed dungeons across 9 distinct abyssal architectures—each guarded by multi-floor stairs and a crazed Demonic Overlord at the summit!',
      ],
    },
    {
      id: 'raider_npc_nyx',
      name: 'Scout Nyx',
      role: 'adventurer',
      x: 245,
      y: FLOOR_Y - 26,
      minX: 140,
      maxX: 360,
      speed: 24,
      facing: 1,
      walkCycle: 1.1,
      coatColor: '#312e81',
      hairColor: '#f472b6',
      shirtColor: '#e0e7ff',
      dialogue: [
        'Pro tip from an Orichalcum survivor: clear every monster on a floor to break the arcane lock on the East Staircase!',
        'Climb the stairs up through every floor—and brace yourself for the huge Demon Boss waiting in the final sanctum.',
      ],
    },
    {
      id: 'raider_npc_korr',
      name: 'Registrar Korr',
      role: 'guard',
      x: 760,
      y: FLOOR_Y - 26,
      minX: 660,
      maxX: 890,
      speed: -18,
      facing: -1,
      walkCycle: 0.6,
      coatColor: '#334155',
      hairColor: '#94a3b8',
      shirtColor: '#fca5a5',
      dialogue: [
        `Your Raider Rank (${rank}) grants passive ATK & Gold bonuses plus unlocks deeper dungeons!`,
        'Reach Monarch Rank to storm D-103 through D-108 Pandemonium Sanctums.',
      ],
    },
  ];
}

/**
 * Builds structured platforms + ascending staircase flights per floor of a Raider Dungeon!
 */
export function buildRaiderDungeonFloorPlatforms(dungeon: RaiderDungeonDef, floor: number): Platform[] {
  const isBossFloor = floor >= dungeon.floors;
  const width = isBossFloor ? 1320 : 1720;
  const kind: Platform['kind'] =
    dungeon.design === 'clockwork_babel' || dungeon.design === 'obsidian_forge' ? 'bridge' : 'brick';

  const plats: Platform[] = [
    { id: `rd_floor_${dungeon.id}_${floor}`, x: 0, y: FLOOR_Y, w: width, h: 46, kind: 'floor' },
  ];

  if (isBossFloor) {
    // Grand Demonic Sanctum tiers for dodging meteors & slamming bosses
    plats.push(
      { id: 'rd_boss_step_l1', x: 165, y: FLOOR_Y - 28, w: 60, h: 10, kind },
      { id: 'rd_boss_plat_l', x: 220, y: FLOOR_Y - 56, w: 150, h: 12, kind },
      { id: 'rd_boss_plat_m', x: 540, y: FLOOR_Y - 76, w: 200, h: 12, kind },
      { id: 'rd_boss_plat_r', x: 910, y: FLOOR_Y - 56, w: 150, h: 12, kind },
      { id: 'rd_boss_step_r1', x: 1055, y: FLOOR_Y - 28, w: 60, h: 10, kind },
    );
    return plats;
  }

  // Regular floors (1 .. N-1) feature varied climbing stairs & multi-level galleries!
  const variant = (dungeon.id + floor) % 3;
  if (variant === 0) {
    // Ascending West -> Mid Catwalk -> East Staircase Gallery
    plats.push(
      { id: 'rd_stair_w1', x: 230, y: FLOOR_Y - 24, w: 48, h: 10, kind },
      { id: 'rd_stair_w2', x: 274, y: FLOOR_Y - 48, w: 48, h: 10, kind },
      { id: 'rd_gal_1', x: 320, y: FLOOR_Y - 70, w: 220, h: 12, kind },
      { id: 'rd_gal_mid', x: 690, y: FLOOR_Y - 52, w: 210, h: 12, kind },
      { id: 'rd_stair_e1', x: 1030, y: FLOOR_Y - 26, w: 50, h: 10, kind },
      { id: 'rd_stair_e2', x: 1080, y: FLOOR_Y - 52, w: 50, h: 10, kind },
      { id: 'rd_gal_2', x: 1130, y: FLOOR_Y - 74, w: 230, h: 12, kind },
    );
  } else if (variant === 1) {
    // Twin Split Upper Crypts with center drop bridge
    plats.push(
      { id: 'rd_stair_l1', x: 260, y: FLOOR_Y - 26, w: 46, h: 10, kind },
      { id: 'rd_plat_l', x: 306, y: FLOOR_Y - 52, w: 190, h: 12, kind },
      { id: 'rd_stair_c1', x: 640, y: FLOOR_Y - 30, w: 54, h: 10, kind },
      { id: 'rd_stair_c2', x: 690, y: FLOOR_Y - 60, w: 54, h: 10, kind },
      { id: 'rd_plat_c', x: 744, y: FLOOR_Y - 84, w: 190, h: 12, kind },
      { id: 'rd_plat_r', x: 1080, y: FLOOR_Y - 54, w: 220, h: 12, kind },
      { id: 'rd_stair_r1', x: 1300, y: FLOOR_Y - 28, w: 50, h: 10, kind },
    );
  } else {
    // Zig-zag stepped viaduct leading up toward the eastern Grand Stairway
    plats.push(
      { id: 'rd_step_1', x: 290, y: FLOOR_Y - 28, w: 96, h: 10, kind },
      { id: 'rd_step_2', x: 430, y: FLOOR_Y - 56, w: 140, h: 12, kind },
      { id: 'rd_step_3', x: 670, y: FLOOR_Y - 82, w: 170, h: 12, kind },
      { id: 'rd_step_4', x: 950, y: FLOOR_Y - 54, w: 180, h: 12, kind },
      { id: 'rd_step_5', x: 1240, y: FLOOR_Y - 30, w: 120, h: 10, kind },
    );
  }

  return plats;
}

export function buildRaiderDungeonFloorInteractables(
  dungeon: RaiderDungeonDef,
  floor: number,
): InteractableProp[] {
  const isBossFloor = floor >= dungeon.floors;
  const props: InteractableProp[] = [
    {
      id: `rd_exit_${dungeon.id}_${floor}`,
      x: 30,
      y: FLOOR_Y - 70,
      w: 38,
      h: 70,
      kind: 'raider_dungeon_exit',
      label: 'Retreat Portal -> Raider Guild Hall [F]',
      speaker: 'Raider Return Portal',
      dialogue: ['Returning safely to the Dungeon Raider Guild Hall...'],
      activated: false,
    },
  ];

  if (!isBossFloor) {
    props.push({
      id: `rd_stairs_${dungeon.id}_${floor}`,
      x: 1525,
      y: FLOOR_Y - 84,
      w: 84,
      h: 84,
      kind: 'raider_floor_stairs',
      label: `Grand Staircase -> Ascend to Floor ${floor + 1}/${dungeon.floors} [F]`,
      speaker: `Floor ${floor} Grand Stairway`,
      dialogue: [`Ascending stone stairs to Floor ${floor + 1}...`],
      activated: false,
    });
  }
  return props;
}

const ARCH_LABELS: Record<EnemyArchetype, string> = {
  skeleton_guard: 'Crypt Bone-Guard',
  shadow_bat: 'Dusk Shrieker',
  cultist_mage: 'Hex Cantor',
  gargoyle_charger: 'Winged Stoneclaw',
  cursed_armor: 'Dread-Mail Knight',
  phantom_wisp: 'Astral Wisp',
  goblin_normal: 'Cavern Stalker',
  hobgoblin: 'Hive Brute',
  bandit_fighter: 'Corrupted Marauder',
  bandit_archer: 'Vault Arbalest',
  bandit_assassin: 'Shadow Flanker',
  bandit_pyromancer: 'Cinder Warlock',
  bandit_brute: 'Ironclad Crusher',
  demon_succubus: 'Crimson Temptress',
  demon_tank: 'Abyssal Juggernaut',
  demon_lightning: 'Volt-Demon Striker',
  eldritch_ichor_hound: 'Ichor Hound',
  eldritch_tendril_fiend: 'Marrow-Tendril Horror',
  eldritch_feast_boss: 'Feast Sovereign',
  raider_abyssal_imp: 'Abyssal Hell-Imp',
  raider_iron_golem: 'Clockwork Forge Golem',
  raider_frost_wraith: 'Glacial Frost Wraith',
  raider_spore_stalker: 'Chitin Spore Stalker',
  raider_void_acolyte: 'Void Rift Acolyte',
  raider_hell_executioner: 'Hellfire Executioner',
};

export function createRaiderFloorEnemies(
  dungeon: RaiderDungeonDef,
  floor: number,
  playerLevel = 1,
): EnemyState[] {
  const isBossFloor = floor >= dungeon.floors;
  const count = isBossFloor ? 2 : 4 + Math.min(3, Math.floor((floor + dungeon.id / 25)));
  const difficultyScale =
    (1 + dungeon.id * 0.045 + (floor - 1) * 0.16) *
    (1 + Math.max(0, playerLevel - 1) * 0.07);

  const enemies: EnemyState[] = [];
  for (let i = 0; i < count; i++) {
    const arch = dungeon.monsterPool[(i + floor + dungeon.id) % dungeon.monsterPool.length];
    const isFlying =
      arch === 'shadow_bat' ||
      arch === 'demon_succubus' ||
      arch === 'raider_abyssal_imp' ||
      arch === 'raider_frost_wraith' ||
      arch === 'phantom_wisp';
    const isHeavy =
      arch === 'demon_tank' ||
      arch === 'cursed_armor' ||
      arch === 'raider_iron_golem' ||
      arch === 'raider_hell_executioner';

    const w = isHeavy ? 26 : isFlying ? 19 : 21;
    const h = isHeavy ? 34 : isFlying ? 22 : 28;
    const baseHp = isHeavy ? 145 : isFlying ? 78 : 102;
    const baseDmg = isHeavy ? 18 : isFlying ? 14 : 15;
    const spawnX = isBossFloor ? 480 + i * 260 : 340 + i * Math.floor(1100 / Math.max(1, count));
    const spawnY = FLOOR_Y - (isFlying ? 60 + (i % 2) * 14 : h);

    enemies.push({
      id: `rd_en_${dungeon.id}_f${floor}_${i}_${Date.now()}`,
      archetype: arch,
      name: ARCH_LABELS[arch] ?? 'Dungeon Fiend',
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      w,
      h,
      hp: Math.round(baseHp * difficultyScale),
      maxHp: Math.round(baseHp * difficultyScale),
      facing: -1,
      state: 'patrol',
      stateTimer: 0.3 + (i % 3) * 0.2,
      patrolOriginX: spawnX,
      hitFlash: 0,
      biome:
        dungeon.design === 'blighted_hive'
          ? 'forest'
          : dungeon.design === 'obsidian_forge' || dungeon.design === 'flesh_labyrinth' || dungeon.design === 'pandemonium_citadel'
            ? 'volcano'
            : 'castle',
      rewardGold: Math.round((22 + dungeon.id * 1.6) * (isHeavy ? 1.35 : 1)),
      koTimer: 0.32,
      attackDamage: Math.round(baseDmg * (1 + dungeon.id * 0.025 + (floor - 1) * 0.1)),
      isDungeonBoss: false,
      sizeScale: isHeavy ? 1.18 : 1.04,
      darkness: dungeon.id >= 60 ? 0.12 : 0,
    });
  }
  return enemies;
}

export function createRaiderDemonicBoss(
  dungeon: RaiderDungeonDef,
  playerLevel = 1,
): RaiderDemonicBossEntity {
  const rankIdx = RAIDER_RANK_ORDER.indexOf(dungeon.requiredRank);
  const scale = (1 + dungeon.id * 0.055 + rankIdx * 0.18) * (1 + Math.max(0, playerLevel - 1) * 0.06);
  const maxHp = Math.round(780 * scale * 2);
  const attackDamage = Math.round(22 * (1 + dungeon.id * 0.02 + rankIdx * 0.12));

  return {
    dungeonId: dungeon.id,
    name: dungeon.bossName,
    title: dungeon.bossTitle,
    mutation: dungeon.bossMutation,
    primaryColor: dungeon.bossPrimaryColor,
    secondaryColor: dungeon.bossSecondaryColor,
    auraColor: dungeon.bossAuraColor,
    hornStyle: dungeon.bossHornStyle,
    weaponStyle: dungeon.bossWeaponStyle,
    x: 960,
    y: FLOOR_Y - 72,
    vx: 0,
    vy: 0,
    w: 52,
    h: 72,
    hp: maxHp,
    maxHp,
    attackDamage,
    facing: -1,
    state: 'march',
    stateTimer: 0.4,
    attackCooldown: 0.85,
    skillCooldown: 2.2,
    castIndex: 0,
    hitFlash: 0,
    walkCycle: 0,
    berserk: false,
    activeSkillBanner: null,
    activeSkillTimer: 0,
    stunTimer: 0,
    lastSkillThresholdPct: 100,
  };
}

export interface RaiderBossStepOutput {
  hitPlayerDamage: number;
  hitPlayerKnockbackX: number;
  spawnProjectiles: Projectile[];
  spawnZones: {
    x: number;
    y: number;
    w: number;
    h: number;
    life: number;
    damage: number;
    kind: PurpleFlameKind;
  }[];
  screenShake: number;
}

export function stepRaiderDemonicBoss(
  boss: RaiderDemonicBossEntity,
  playerX: number,
  playerY: number,
  dt: number,
  simTime: number,
): RaiderBossStepOutput {
  const out: RaiderBossStepOutput = {
    hitPlayerDamage: 0,
    hitPlayerKnockbackX: 0,
    spawnProjectiles: [],
    spawnZones: [],
    screenShake: 0,
  };

  if (boss.hp <= 0) return out;

  boss.hitFlash = Math.max(0, boss.hitFlash - dt);
  if (boss.activeSkillTimer > 0) {
    boss.activeSkillTimer = Math.max(0, boss.activeSkillTimer - dt);
    if (boss.activeSkillTimer <= 0) boss.activeSkillBanner = null;
  }

  if (!boss.berserk && boss.hp <= boss.maxHp * 0.5) {
    boss.berserk = true;
    boss.activeSkillBanner = `${boss.name}: DEMONIC BERSERK AWAKENING!!`;
    boss.activeSkillTimer = 2.4;
    out.screenShake = 0.65;
  }

  if (boss.stunTimer > 0) {
    boss.stunTimer = Math.max(0, boss.stunTimer - dt);
    return out;
  }

  // Automatic skill trigger every time HP drops by 12%
  boss.lastSkillThresholdPct ??= 100;
  const bossHpPct = (boss.hp / Math.max(1, boss.maxHp)) * 100;
  if (bossHpPct <= boss.lastSkillThresholdPct - 12) {
    while (boss.lastSkillThresholdPct - 12 >= bossHpPct && boss.lastSkillThresholdPct > 0) {
      boss.lastSkillThresholdPct -= 12;
    }
    const skillNames = [
      'HELLFIRE METEOR APOCALYPSE!',
      'ABYSSAL SHOCKWAVE SLAM!',
      'DEMONIC FRENZY REND!',
      'CURSED SIGIL BARRAGE!',
    ];
    boss.state = 'skill_cast';
    boss.stateTimer = 0;
    boss.activeSkillBanner = `${boss.name}: ${skillNames[boss.castIndex % skillNames.length]}`;
    boss.activeSkillTimer = 2.0;
  }

  const speedMult = boss.berserk ? 1.35 : 1;
  boss.stateTimer -= dt * speedMult;
  boss.attackCooldown = Math.max(0, boss.attackCooldown - dt * speedMult);
  boss.skillCooldown = Math.max(0, boss.skillCooldown - dt * speedMult);

  const cx = boss.x + boss.w / 2;
  const dx = playerX + 8 - cx;
  const dist = Math.abs(dx);
  boss.facing = dx >= 0 ? 1 : -1;

  if (boss.state === 'march') {
    if (dist > 56) {
      boss.vx = boss.facing * (boss.berserk ? 118 : 88);
      boss.walkCycle += dt * 9;
    } else {
      boss.vx *= 0.72;
      if (boss.attackCooldown <= 0) {
        boss.state = 'windup';
        boss.stateTimer = 0.32;
      }
    }
    if (boss.skillCooldown <= 0 && dist < 460) {
      boss.state = 'skill_cast';
      boss.stateTimer = 0.52;
      boss.vx = 0;
      const skillNames = [
        'HELLFIRE METEOR APOCALYPSE!',
        'ABYSSAL SHOCKWAVE SLAM!',
        'DEMONIC FRENZY REND!',
        'CURSED SIGIL BARRAGE!',
      ];
      boss.activeSkillBanner = `${boss.name}: ${skillNames[boss.castIndex % skillNames.length]}`;
      boss.activeSkillTimer = 2.0;
    }
  } else if (boss.state === 'windup') {
    boss.vx *= 0.8;
    if (boss.stateTimer <= 0) {
      boss.state = 'attack';
      boss.stateTimer = 0.24;
      boss.attackCooldown = boss.berserk ? 0.82 : 1.15;
      boss.vx = boss.facing * 165;
      if (dist < 76 && Math.abs(playerY - boss.y) < 62) {
        out.hitPlayerDamage = boss.attackDamage;
        out.hitPlayerKnockbackX = boss.facing * 175;
        out.screenShake = 0.35;
      }
    }
  } else if (boss.state === 'attack') {
    boss.vx *= 0.86;
    if (boss.stateTimer <= 0) {
      boss.state = 'recover';
      boss.stateTimer = 0.42;
    }
  } else if (boss.state === 'skill_cast') {
    if (boss.stateTimer <= 0) {
      const mode = boss.castIndex % 4;
      boss.castIndex += 1;
      boss.skillCooldown = boss.berserk ? 2.4 : 3.3;

      if (mode === 0) {
        // Hellfire Meteor Rain across the sanctum floor
        for (let m = -1; m <= 1; m++) {
          const mx = Math.max(90, Math.min(1210, playerX + m * 105));
          out.spawnZones.push({
            x: mx - 24,
            y: FLOOR_Y - 64,
            w: 48,
            h: 64,
            life: 1.45,
            damage: Math.round(boss.attackDamage * 0.95),
            kind: 'raider_hellfire_meteor',
          });
        }
        out.screenShake = 0.45;
        boss.state = 'recover';
        boss.stateTimer = 0.55;
      } else if (mode === 1) {
        // Abyssal Shockwave Slam (twin ground waves + floor slam zone)
        out.spawnZones.push({
          x: Math.max(80, cx - 58),
          y: FLOOR_Y - 42,
          w: 116,
          h: 42,
          life: 1.2,
          damage: Math.round(boss.attackDamage * 1.1),
          kind: 'raider_abyssal_wave',
        });
        for (const dir of [-1, 1] as const) {
          out.spawnProjectiles.push({
            id: `rd_wave_${simTime}_${dir}`,
            x: cx + dir * 20,
            y: FLOOR_Y - 14,
            vx: dir * 215,
            vy: 0,
            radius: 10,
            damage: Math.round(boss.attackDamage * 0.85),
            fromPlayer: false,
            color: boss.auraColor,
            life: 2.0,
            kind: 'slash_wave',
          });
        }
        out.screenShake = 0.55;
        boss.state = 'recover';
        boss.stateTimer = 0.52;
      } else if (mode === 2) {
        // Demonic Frenzy Charge!
        boss.state = 'frenzy_charge';
        boss.stateTimer = 0.42;
        boss.vx = boss.facing * (boss.berserk ? 340 : 280);
        out.screenShake = 0.4;
      } else {
        // Cursed Sigil Barrage (radial orbs + floor sigil)
        const baseAngles = [-0.28, -0.08, 0.12];
        for (let a = 0; a < baseAngles.length; a++) {
          const ang = baseAngles[a];
          const spd = 195 + a * 18;
          out.spawnProjectiles.push({
            id: `rd_orb_${simTime}_${a}`,
            x: cx + boss.facing * 18,
            y: boss.y + 26,
            vx: boss.facing * Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            radius: 7,
            damage: Math.round(boss.attackDamage * 0.8),
            fromPlayer: false,
            color: boss.secondaryColor,
            life: 2.2,
            kind: 'purple_flame',
          });
        }
        out.spawnZones.push({
          x: Math.max(80, playerX - 22),
          y: FLOOR_Y - 46,
          w: 52,
          h: 46,
          life: 1.5,
          damage: Math.round(boss.attackDamage * 0.9),
          kind: 'raider_cursed_sigil',
        });
        boss.state = 'recover';
        boss.stateTimer = 0.5;
      }
    }
  } else if (boss.state === 'frenzy_charge') {
    if (dist < 62 && Math.abs(playerY - boss.y) < 58 && boss.attackCooldown <= 0) {
      boss.attackCooldown = 0.45;
      out.hitPlayerDamage = Math.round(boss.attackDamage * 1.15);
      out.hitPlayerKnockbackX = boss.facing * 220;
      out.screenShake = 0.5;
    }
    if (boss.stateTimer <= 0) {
      boss.vx *= 0.4;
      boss.state = 'recover';
      boss.stateTimer = 0.48;
    }
  } else {
    boss.vx *= 0.78;
    if (boss.stateTimer <= 0) {
      boss.state = 'march';
    }
  }

  boss.x = Math.max(96, Math.min(1260 - boss.w, boss.x + boss.vx * dt));
  boss.y = FLOOR_Y - boss.h;
  return out;
}
