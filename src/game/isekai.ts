import { POTION_SHOP_IDS, WEAPONS } from './data';
import { GRAVITY, MOVE_SPEED, addInventoryResource, calculateAttackDamage, equipWeapon } from './rules';
import type {
  ActiveArenaDuel,
  ActiveTownRaid,
  AlliedNpc,
  ArenaChallengerDef,
  ArenaChallengerId,
  ArenaSkillDef,
  BiomeId,
  CarriageEscortState,
  DemonKingEntity,
  DemonKingFaceStyle,
  DemonKingSpecialAbility,
  DemonKingWeaponStyle,
  ElfCutsceneChoiceHud,
  ElfKingdomStage,
  EnemyArchetype,
  EnemyState,
  GuildMissionId,
  GuildRank,
  HeadgearStyle,
  InteractableProp,
  InventoryItem,
  IsekaiNpc,
  OutfitStyle,
  Platform,
  PlayerState,
  Projectile,
  PurpleFlameKind,
  PurpleFlameZone,
  RealmMode,
  SideQuestDef,
  SideQuestDialogueChoice,
  SideQuestId,
  SideQuestProgress,
  TownHouseDamage,
  TownRaiderId,
  WeaponId,
} from './types';
import { FLOOR_Y } from './worldGen';

export const RANK_ORDER: GuildRank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
export const MISSIONS_REQUIRED_PER_RANK = 5;
export const GUILD_FLOOR2_Y = FLOOR_Y - 82;

export const RANK_TITLES: Record<GuildRank, string> = {
  F: 'Porcelain Initiate',
  E: 'Bronze Scout',
  D: 'Iron Vanguard',
  C: 'Silver Vanguard',
  B: 'Mythril Protector',
  A: 'Crimson Champion',
  S: 'Crowned Royal Sovereign',
};

export interface GuildMissionDef {
  id: GuildMissionId;
  title: string;
  rankReq: GuildRank;
  promoteToRank: GuildRank;
  floorReq: 1 | 2;
  realm: RealmMode;
  regionLabel: string;
  summary: string;
  rewardGold: number;
  killsRequired: number;
  accentColor: string;
}

export const GUILD_MISSIONS: GuildMissionDef[] = [
  {
    id: 'f_goblin_warren',
    title: 'Goblin Warren Clearing',
    rankReq: 'F',
    promoteToRank: 'E',
    floorReq: 1,
    realm: 'goblin_dungeon',
    regionLabel: 'Graystone Cavern · Floor 1 Contract',
    summary: 'Clear raiding Normal Goblins & brute Hobgoblins inside the rocky cavern.',
    rewardGold: 85,
    killsRequired: 6,
    accentColor: '#94a3b8',
  },
  {
    id: 'e_hobgoblin_caves',
    title: 'Hobgoblin Quarry Purge',
    rankReq: 'E',
    promoteToRank: 'D',
    floorReq: 1,
    realm: 'goblin_dungeon',
    regionLabel: 'Graystone Cavern · Floor 1 Contract',
    summary: 'Hunt armored Hobgoblin packs and Normal Goblin skirmishers.',
    rewardGold: 130,
    killsRequired: 8,
    accentColor: '#64748b',
  },
  {
    id: 'd_deep_goblin_keep',
    title: 'Deep Rocky Goblin Stronghold',
    rankReq: 'D',
    promoteToRank: 'C',
    floorReq: 1,
    realm: 'goblin_dungeon',
    regionLabel: 'Graystone Abyss · Floor 1 Contract',
    summary: 'Crush the subterranean Goblin Dungeon warband to earn Silver C-Rank status.',
    rewardGold: 185,
    killsRequired: 10,
    accentColor: '#38bdf8',
  },
  {
    id: 'c_demon_vanguard',
    title: 'Demon Border Vanguard Breach',
    rankReq: 'C',
    promoteToRank: 'B',
    floorReq: 1,
    realm: 'demon_realm',
    regionLabel: 'Volcanic Frontier · Floor 1 Promotion',
    summary: 'Invade the crimson-purple Demon Border to earn B-Rank and unlock the Guild 2nd Floor!',
    rewardGold: 260,
    killsRequired: 8,
    accentColor: '#f43f5e',
  },
  {
    id: 'b_princess_carriage',
    title: 'Royal Princess Carriage Escort',
    rankReq: 'B',
    promoteToRank: 'A',
    floorReq: 2,
    realm: 'carriage_escort',
    regionLabel: 'Kingdom Royal Highway · 2nd Floor Command',
    summary: 'Protect Princess Aurelia from shifting bandit factions across the Kingdom Highway toward higher ranks.',
    rewardGold: 320,
    killsRequired: 8,
    accentColor: '#fbbf24',
  },
  {
    id: 'b_demon_invasion',
    title: 'Demon Realm Volcano Raid',
    rankReq: 'B',
    promoteToRank: 'B',
    floorReq: 2,
    realm: 'demon_realm',
    regionLabel: 'Crimson-Violet Caldera · 2nd Floor Command',
    summary: 'High-bounty raid against Long-Range Succubi, Demon Tanks & Lightning Strikers.',
    rewardGold: 360,
    killsRequired: 9,
    accentColor: '#fb7185',
  },
  {
    id: 'a_three_demon_kings',
    title: 'Three Demon Kings Expedition',
    rankReq: 'A',
    promoteToRank: 'S',
    floorReq: 2,
    realm: 'demon_king_arena',
    regionLabel: 'Obsidian Imperial Citadel · 2nd Floor Supreme',
    summary: 'Defeat all 3 Demon Kings & past Isekai foes in real-time combat to claim the Royal Crown!',
    rewardGold: 850,
    killsRequired: 3,
    accentColor: '#c084fc',
  },
  {
    id: 's_seventeen_demon_kings',
    title: '17 Demon Kings Manhwa Pantheon',
    rankReq: 'S',
    promoteToRank: 'S',
    floorReq: 2,
    realm: 'demon_king_arena',
    regionLabel: 'Sovereign Abyssal Spire · S-Rank Exclusive',
    summary: 'Challenge 17 S-Rank Fantasy Manhwa Demon Kings 1-by-1 with unique weapons, companions & dimensional domains!',
    rewardGold: 4800,
    killsRequired: 17,
    accentColor: '#f43f5e',
  },
];

export interface WardrobeCatalogItem {
  id: string;
  name: string;
  slot: 'outfit' | 'headgear' | 'cloak_dye' | 'crown';
  price: number;
  description: string;
  outfitStyle?: OutfitStyle;
  headgearStyle?: HeadgearStyle;
  cloakColor?: string;
  armorColor?: string;
  plumeColor?: string;
  visorColor?: string;
}

export const WARDROBE_CATALOG: WardrobeCatalogItem[] = [
  {
    id: 'outfit_knight_plate',
    name: 'Citadel Knight Plate',
    slot: 'outfit',
    price: 0,
    description: 'Your original steel dungeon armor from the Bastera Citadel.',
    outfitStyle: 'knight_plate',
    armorColor: '#94a3b8',
    cloakColor: '#be123c',
  },
  {
    id: 'outfit_adventurer_tunic',
    name: 'Axel Linen Tunic & Haori',
    slot: 'outfit',
    price: 180,
    description: 'Traditional airy emerald-trimmed fantasy adventurer tunic & leather vest.',
    outfitStyle: 'adventurer_tunic',
    armorColor: '#15803d',
    cloakColor: '#1e3a8a',
  },
  {
    id: 'outfit_guild_coat',
    name: 'Crimson Guild Trenchcoat',
    slot: 'outfit',
    price: 360,
    description: 'Belted Japanese-isekai guild commander coat with gold shoulder frogs.',
    outfitStyle: 'guild_coat',
    armorColor: '#7f1d1d',
    cloakColor: '#b45309',
  },
  {
    id: 'outfit_demon_slayer',
    name: 'Violet Demon-Bane Mantle',
    slot: 'outfit',
    price: 600,
    description: 'Obsidian & amethyst weave tailored for Demon Realm vanguard raids.',
    outfitStyle: 'demon_slayer',
    armorColor: '#312e81',
    cloakColor: '#7e22ce',
  },
  {
    id: 'outfit_royal_regalia',
    name: 'Sovereign Velvet Regalia',
    slot: 'outfit',
    price: 880,
    description: 'Ermine-trimmed white & gold imperial cape fit for crowned royalty.',
    outfitStyle: 'royal_regalia',
    armorColor: '#e2e8f0',
    cloakColor: '#9f1239',
  },
  {
    id: 'hat_helm',
    name: 'Steel Armet Helm',
    slot: 'headgear',
    price: 0,
    description: 'Classic visored knight helmet with flowing crest plume.',
    headgearStyle: 'helm',
  },
  {
    id: 'hat_beret',
    name: 'Crimson Guild Beret',
    slot: 'headgear',
    price: 140,
    description: 'Jaunty feather-pinned isekai town beret worn by veteran scouts.',
    headgearStyle: 'beret',
  },
  {
    id: 'hat_bandana',
    name: 'Shadow Shinobi Scarf',
    slot: 'headgear',
    price: 240,
    description: 'Wind-swept eastern traveler headband with flowing twin tails.',
    headgearStyle: 'bandana',
  },
  {
    id: 'hat_circlet',
    name: 'Mythril Star Circlet',
    slot: 'headgear',
    price: 440,
    description: 'Light sapphire diadem worn by high-ranking court champions.',
    headgearStyle: 'circlet',
  },
];

export const ISEKAI_ROOM_BOUNDS: Record<RealmMode, { minX: number; maxX: number }> = {
  citadel: { minX: -640, maxX: 80000 },
  isekai_town: { minX: 20, maxX: 3960 },
  isekai_guild: { minX: 24, maxX: 860 },
  isekai_wardrobe: { minX: 24, maxX: 460 },
  isekai_potion_shop: { minX: 24, maxX: 520 },
  isekai_weapons_shop: { minX: 24, maxX: 1220 },
  dungeon_exterior: { minX: 20, maxX: 1240 },
  goblin_dungeon: { minX: 20, maxX: 999999 },
  carriage_escort: { minX: 20, maxX: 1120 },
  demon_realm: { minX: 20, maxX: 999999 },
  demon_king_arena: { minX: 24, maxX: 1480 },
  dueling_arena: { minX: 24, maxX: 1240 },
  outskirts_forest: { minX: 20, maxX: 2400 },
  outskirts_caves: { minX: 20, maxX: 2200 },
  elf_kingdom: { minX: 20, maxX: 2860 },
  raider_guild: { minX: 20, maxX: 980 },
  raider_dungeon: { minX: 20, maxX: 1680 },
};

export const SIDE_QUESTS: SideQuestDef[] = [
  {
    id: 'sq_01_crimson_tithe',
    index: 1,
    title: 'The Perfectly Normal Tax Wagon',
    storyTheme: 'Dark Comedy · Bureaucratic Treason',
    chapterTitle: 'Act I · The Solaris Ledger',
    giverName: 'Warden Kaelen',
    giverRoleLabel: 'Sweating Gate Captain',
    giverRealm: 'isekai_town',
    giverX: 3630,
    coatColor: '#7f1d1d',
    hairColor: '#cbd5e1',
    shirtColor: '#1e293b',
    targetRealm: 'outskirts_forest',
    twistTriggerKills: 3,
    hookSummary:
      'Kaelen insists "hyper-polite unionized bandits" ambushed his royal tax sled outside East Gate—just don’t look inside the chocolate-foil coin sacks.',
    conspiracyClue:
      'Solaris Gate Entry #014: Warden Kaelen pawned the Royal Mint bullion and paid Butcher Vane in pork-fat promissory notes to butcher the crown auditors.',
    giverOpeningDialogue: [
      'Ahem! Halt, reincarnated hero! Thank the Goddess you wandered over—terrible, tragic ambush just past the gate! Absolutely nobody’s fault!',
      'Cut down 3 Forest Cutthroats in the Outskirts Forest and silence their giant axe-man Vane before those nosy—uh, before MORE lives are lost!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Warden Kaelen',
        speakerRole: 'Sweating Gate Captain',
        moodLabel: 'Nervously Jangling Fake Coins',
        lines: [
          'Ah, a fresh-faced Otherworlder! Just the heroic sucker—I mean, noble paladin—Solaris needs right now!',
          'Minutes ago, vicious highwaymen hijacked my Royal Tax Cart right past the East Gate! They took the tax ledgers, the bullion, my lunch sandwich, AND somehow knew the exact combination to our locked gatehouse!',
        ],
        choices: [
          {
            id: 'sq1_ask_combo',
            label: '“Wait. How did forest bandits know your gatehouse combination?”',
            tone: 'investigate',
            npcReply: [
              'T-telepathy! Probably a cursed Isekai Skill! Or maybe I wrote "1-2-3-4-KAELEN-RULES" on a sticky note outside the barrack!',
              'Here—take 25G for coffee and STOP asking questions worthy of an internal affairs audit!',
            ],
            revealClue: true,
            bonusGold: 25,
            nextNodeId: 'open_2',
          },
          {
            id: 'sq1_bite_coin',
            label: '*Bite one of the "royal gold" coins spilling out of his pouch*',
            tone: 'quirky',
            npcReply: [
              'HEY! Spit that out! That is 24-karat enchanted milk chocolate—for morale! Every heroic gate captain carries emergency emotional-support confectionery!',
              'Look, just go cleave 3 Cutthroats in the Outskirts Forest and make sure Butcher Vane forgets how to talk!',
            ],
            revealClue: true,
            nextNodeId: 'open_2',
          },
          {
            id: 'sq1_just_pay',
            label: '“Skip the sob story. Point me at the blood and tell me the payout.”',
            tone: 'ruthless',
            npcReply: [
              'Oh, bless your stone-cold mercenary soul! No tedious morals, just sharp steel!',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Warden Kaelen',
        speakerRole: 'Sweating Gate Captain',
        moodLabel: 'Desperate Handshake',
        lines: [
          'Go east through the Royal Gate into the Outskirts Forest. Butcher 3 Cutthroats until Butcher Vane crawls out of the ferns.',
          'Remember: if you find any charred tax manifests with my wax seal... burn them. For public hygiene.',
        ],
        choices: [
          {
            id: 'sq1_accept',
            label: 'Accept Contract — Track Down Butcher Vane',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Magnificent! Remember—dead bandits tell zero tales about missing treasury silver!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Warden Kaelen',
        speakerRole: 'Sweating Gate Captain',
        moodLabel: 'Chewing Nails',
        lines: [
          'Still alive! Lovely! Listen—did you happen to step on any glowing blue accounting scrolls out there in the bushes?',
        ],
        choices: [
          {
            id: 'sq1_mid_tease',
            label: '“Only a half-eaten ledger mentioning your gambling debts.”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Hahahaha! What a hilarious typographical error by those illiterate bandits! Please finish slaying Vane immediately!',
            ],
          },
          {
            id: 'sq1_mid_focus',
            label: '“Heading back out to finish the 3 kills.”',
            tone: 'accept',
            npcReply: ['Yes! Speed is of the essence, especially before the Royal Auditor notices the chocolate coins melting!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Warden Kaelen',
        speakerRole: 'Exposed Embezzler',
        moodLabel: 'Cornered & Perspiring Profusely',
        lines: [
          'Gah—you read page four of Vane’s bloodied manifest?! Look, in my defense, the Crown pays gate guards in expired Potion Coupons and vibes!',
          'Nobody in Solaris is clean, Knight. Ask Widow Marlowe down the street where her stitching thread comes from if you think I’m the worst monster here!',
        ],
        choices: [
          {
            id: 'sq1_extort',
            label: '“Empty your real pouch. Consider it an unofficial audit fee.” (+50G)',
            tone: 'extort',
            bonusGold: 50,
            markConfronted: true,
            npcReply: [
              'Take the coin! Take my spare boots! Just don’t mention my name when the Royal Ledger hits page ten!',
            ],
          },
          {
            id: 'sq1_mock',
            label: '“Enjoy living with chocolate coins while Vane’s blood dries on my boots.”',
            tone: 'quirky',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'You’re terrifying! What kind of hero grins like that over murdered accountants?!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: STAGED SLAUGHTER',
    twistRevelation:
      'The dying courier’s manifest proves Kaelen pawned the Royal Treasury for chocolate foil and hired Butcher Vane to murder the crown auditors before sunrise.',
    twistDialogue: [
      'A blood-soaked ledger tumbles out of the mud — stamped with Warden Kaelen’s seal and a receipt reading "3 Dead Clerks, Extra Axes"!',
      'Butcher Vane steps out from the ferns, wiping his cleaver: "Kaelen paid double for an Otherworlder’s kneecaps—nothing personal, kid!"',
    ],
    bossName: 'Butcher Vane the Tollkeeper',
    bossTitle: 'Hired Massacre Enforcer',
    bossArchetype: 'bandit_brute',
    bossSpawnX: 1480,
    bossHp: 340,
    bossDamage: 18,
    bossDefeatLine: 'Tell Kaelen... the Crown Ledger still has his bastard’s name on page four...',
    rewardGold: 260,
    rewardStatPoints: 3,
    rewardStarStones: 2,
  },
  {
    id: 'sq_02_butcher_well',
    index: 2,
    title: 'Bespoke Hoodies of the Dry Well',
    storyTheme: 'Creepy Isekai · Tailor Body-Horror',
    chapterTitle: 'Act I · The Solaris Ledger',
    giverName: 'Widow Marlowe',
    giverRoleLabel: 'Suspiciously Cheerful Seamstress',
    giverRealm: 'isekai_town',
    giverX: 1960,
    coatColor: '#312e81',
    hairColor: '#f8fafc',
    shirtColor: '#be185d',
    targetRealm: 'outskirts_forest',
    twistTriggerKills: 4,
    hookSummary:
      'Marlowe sobs over her missing teen apprentices while selling suspiciously warm, softly breathing crimson cloaks.',
    conspiracyClue:
      'Solaris Boutique Invoice: Marlowe’s twin brother Orlov traps F-Rank rookies at the Dry Well to harvest "self-mending" leather for noble winter coats.',
    giverOpeningDialogue: [
      'Oh, sweetie! Four of my lovely apprentices vanished near the Dry Well—all they left behind was a screaming thimble and thirty yards of arterial silk!',
      'Put down 4 forest prowlers and drag my poor darling Orlov’s attacker out of the hollow before my autumn fashion line misses deadline!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Widow Marlowe',
        speakerRole: 'Suspiciously Cheerful Seamstress',
        moodLabel: 'Polishing Red-Stained Shears',
        lines: [
          'Oh, thank the heavens! A sturdy warrior with such remarkably smooth, unblemished shoulder blades!',
          'My poor third apprentice went out past East Gate to pick dye-berries by the Dry Well and never came home. Just vanished! Again! That makes four this month!',
        ],
        choices: [
          {
            id: 'sq2_touch_cloak',
            label: '*Poke the twitching crimson cloak hanging beside her*',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Oh, don’t mind the pulsing, dear—that’s just enchanted fleece breathing in the breeze! Totally vegan! Stop poking its ribs!',
              'Wait—did you just hear it whisper "Mom"? Must be the wind!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq2_ask_size',
            label: '“Why do all your missing apprentices have ‘size medium’ stamped on their boots?”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 20,
            npcReply: [
              'Because consistency is the soul of haute couture, darling! Here, 20G for tea—go kill things in the woods and don’t audit my mannequin closet.',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq2_accept_cold',
            label: '“I’ll sweep the Dry Well. Keep those shears pointed away from me.”',
            tone: 'ruthless',
            npcReply: [
              'Smart boy. A knight who keeps his skin intact is always welcome in my fitting room!',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Widow Marlowe',
        speakerRole: 'Suspiciously Cheerful Seamstress',
        moodLabel: 'Wide Unblinking Smile',
        lines: [
          'Slay 4 beasts in the Outskirts Forest to lure out whoever lurks beside the Dry Well.',
          'If you meet a handsome maniac named Orlov holding bone needles... tell him Mother says he’s late for dinner.',
        ],
        choices: [
          {
            id: 'sq2_accept',
            label: 'Accept Contract — Investigate the Dry Well',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Wonderful! Watch your ankles around the well—the moss gets terribly slippery with... berry jam.',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Widow Marlowe',
        speakerRole: 'Suspiciously Cheerful Seamstress',
        moodLabel: 'Threading Heavy Twine',
        lines: [
          'Back so soon? And your lovely armor doesn’t have a single jagged tear in it! What a shame for my—I mean, what a relief!',
        ],
        choices: [
          {
            id: 'sq2_mid_press',
            label: '“Found a thimble stamped M. Marlowe inside a wolf’s ribcage.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Oh, I hand those out like business cards! Now hurry back out before Orlov spoils the fresh hide!',
            ],
          },
          {
            id: 'sq2_mid_go',
            label: '“I’ll finish clearing the forest.”',
            tone: 'accept',
            npcReply: ['Chop-chop, sweetie! Literally!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Widow Marlowe',
        speakerRole: 'Unhinged Flesh-Couturier',
        moodLabel: 'Drops the Grandma Voice Entirely',
        lines: [
          'So you slit little Orlov’s throat and read the shipping tags sewn inside his coat. Honestly? Good riddance—his French seams were crooked anyway.',
          'Do you have any idea what Solaris nobility pays for jackets that heal their own bullet holes? Every "F-Rank hero" who flunks out gets turned into winter wear!',
        ],
        choices: [
          {
            id: 'sq2_extort',
            label: '“Pay me 55G right now or I wear your shop sign around your neck.”',
            tone: 'extort',
            bonusGold: 55,
            markConfronted: true,
            npcReply: [
              'Fine! Fifty-five shiny gold pieces! Pleasure doing completely unethical business with you, Hero!',
            ],
          },
          {
            id: 'sq2_shame',
            label: '“You’re sick. Next time a rookie goes missing, I’m burning your cellar.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'Ooh, fiery! If you ever die in the dungeon, sweetie, I promise to make you into a limited-edition cape!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: THE SKIN-THREADER’S CONTRACT',
    twistRevelation:
      'Marlowe’s missing apprentices weren’t eaten by monsters—her twin brother Orlov skinned them beside the Dry Well to supply Solaris’s "self-healing" luxury cloak craze.',
    twistDialogue: [
      'A silver needle stamped "MARLOWE BOUTIQUE" skewers a forest corpse—the wool lining is STILL blinking!',
      'Flesh-Weaver Orlov bursts from the hollow waving bone shears: "Sister said a fresh size-large knight was walking right to my table!"',
    ],
    bossName: 'Flesh-Weaver Orlov',
    bossTitle: 'Hollow-Well Bone Skinner',
    bossArchetype: 'bandit_assassin',
    bossSpawnX: 1680,
    bossHp: 380,
    bossDamage: 21,
    bossDefeatLine: 'Sis swore no knight would ever check the teeth sewn inside the collar...',
    rewardGold: 310,
    rewardStatPoints: 3,
    rewardStarStones: 2,
  },
  {
    id: 'sq_03_glass_bride',
    index: 3,
    title: 'Do Not RSVP After Midnight',
    storyTheme: 'Gothic Dark Rom-Com · Sacrificial Trap',
    chapterTitle: 'Act II · Rot Beneath the Altar',
    giverName: 'Father Severin',
    giverRoleLabel: 'Excommunicated Wedding Priest',
    giverRealm: 'isekai_town',
    giverX: 2890,
    coatColor: '#18181b',
    hairColor: '#94a3b8',
    shirtColor: '#991b1b',
    targetRealm: 'outskirts_caves',
    twistTriggerKills: 3,
    hookSummary:
      'Severin swears cultists kidnapped a sweet noble bride into the Outskirts Caves—strangely ignoring why the wedding invitation mentions "groom-tasting."',
    conspiracyClue:
      'Unholy Prenup: Lady Isolde slaughtered her own wedding guests to ascend as a Blood-Vow Succubus; Severin sends clueless knights down as her midnight snacks.',
    giverOpeningDialogue: [
      'May the light forgive me—heretics abducted gentle Lady Isolde into the Outskirts Caves for an unholy midnight wedding!',
      'Cut down 3 cave horrors and save my poor bride—er, save the innocent bride—before the bells toll!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Father Severin',
        speakerRole: 'Excommunicated Wedding Priest',
        moodLabel: 'Clutching Crumpled Catering Bills',
        lines: [
          'Bless you, child! Lady Isolde—pure as snow, gentle as a lamb—was dragged into the Outskirts Caves by depraved cavern fiends!',
          'Please, wear your cleanest armor and descend immediately. She specifically requested a tall, high-HP knight with "iron-rich vitality" to carry her across the threshold!',
        ],
        choices: [
          {
            id: 'sq3_check_invite',
            label: '*Read the blood-splattered wedding invite tucked in his sleeve*',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Hey! Hands off the liturgy! "Bring one marinated hero—bone-in preferred" is clearly a mistranslation from Old Solaris!',
              'Stop reading the fine print and go slay 3 cave fiends!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq3_joke_divorce',
            label: '“Is this a rescue mission or am I being tricked into a demon marriage?”',
            tone: 'quirky',
            bonusGold: 30,
            npcReply: [
              'Haha! What a comical notion! Here is 30G for flowers—now march east through the forest and down into the Outskirts Caves before she eats the band!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq3_cold',
            label: '“Point me to the caves. If she bites, I bite back.”',
            tone: 'ruthless',
            npcReply: [
              'Oh, trust me—Isolde adores partners who put up a little struggle.',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Father Severin',
        speakerRole: 'Excommunicated Wedding Priest',
        moodLabel: 'Making Strange Hand Signs',
        lines: [
          'Enter the Outskirts Caves beyond the eastern forest, purge 3 subterranean horrors, and crash the altar ceremony.',
          'Just... ignore the organ music. And the severed fingers in the punch bowl.',
        ],
        choices: [
          {
            id: 'sq3_accept',
            label: 'Accept Contract — Crash the Cave Wedding',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Hallelujah! May you survive long enough to return my deposit on the silver chalice!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Father Severin',
        speakerRole: 'Excommunicated Wedding Priest',
        moodLabel: 'Sweating Through His Collar',
        lines: [
          'Have you spoken "I do" yet? Wait—I mean, have you broken the cultists’ circle in the caves yet?!',
        ],
        choices: [
          {
            id: 'sq3_mid_call_out',
            label: '“Nobody kidnapped her, Priest. Your altar boys are missing their ribs.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Fine! You caught on! Just go put that winged bridezilla down before she comes back to town demanding alimony!',
            ],
          },
          {
            id: 'sq3_mid_bye',
            label: '“Heading back into the caves.”',
            tone: 'accept',
            npcReply: ['Give my regards to the screaming veil!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Father Severin',
        speakerRole: 'Shameless Matchmaker of the Damned',
        moodLabel: 'Hands Raised in Innocent Shrug',
        lines: [
          'Okay, look—yes, I sent you down as a blood-sacrifice groom! Have you SEEN how hard it is to keep a demon bride fed on priest stipends?!',
          'At least you survived and annulled the marriage with a greatsword! Technically I deserve a finder’s fee for introducing you two!',
        ],
        choices: [
          {
            id: 'sq3_extort',
            label: '“Hand over the wedding dowry box before I baptize you in sewer water.” (+60G)',
            tone: 'extort',
            bonusGold: 60,
            markConfronted: true,
            npcReply: [
              'Take the 60G! Never invite me to your reception!',
            ],
          },
          {
            id: 'sq3_roast',
            label: '“Tell the Church I’m filing for annulment via decapitation.”',
            tone: 'quirky',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'Brutal! Truly, modern knights have zero respect for gothic romance!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: NO VICTIM LEFT ALIVE',
    twistRevelation:
      'Lady Isolde slaughtered her own wedding party to become a Blood-Vow Succubus—and Father Severin tricked you into walking down the aisle as dinner.',
    twistDialogue: [
      'A chewed bouquet and Severin’s signed receipt fall beside the cavern altar: "1 Oblivious Hero, Medium-Rare"!',
      'Isolde, Bride of Shattered Glass drops from the stalactites laughing: "Father Severin finally sent a groom with decent stats!"',
    ],
    bossName: 'Isolde, Bride of Shattered Glass',
    bossTitle: 'Ascended Blood-Vow Fiend',
    bossArchetype: 'demon_succubus',
    bossSpawnX: 1320,
    bossHp: 420,
    bossDamage: 22,
    bossDefeatLine: 'Till death... finally shreds the veil... tell Severin no refunds...',
    rewardGold: 360,
    rewardStatPoints: 4,
    rewardStarStones: 3,
  },
  {
    id: 'sq_04_plague_apothecary',
    index: 4,
    title: 'Dr. Gideon’s Totally Legal Energy Tonic',
    storyTheme: 'Isekai MLM Satire · Toxic Capitalism',
    chapterTitle: 'Act II · Rot Beneath the Altar',
    giverName: 'Sawbones Gideon',
    giverRoleLabel: 'Back-Alley Influencer Alchemist',
    giverRealm: 'isekai_town',
    giverX: 745,
    coatColor: '#064e3b',
    hairColor: '#d97706',
    shirtColor: '#f1f5f9',
    targetRealm: 'outskirts_forest',
    twistTriggerKills: 4,
    hookSummary:
      'Gideon blames forest monsters for poisoning town ale with "Black Cough Fizz"—suspiciously just in time for his 400G Miracle Cure launch.',
    conspiracyClue:
      'Q4 Guild Sales Quota: Gideon spiked Solaris’s cheap tavern barrels himself using cave spores carried by his unpaid intern Malrik.',
    giverOpeningDialogue: [
      'Hey hey, smash that heal button, Hero! A tragic, totally natural forest blight is making everyone cough black bile!',
      'Hunt 4 infected prowlers in the Outskirts Forest and stomp out Plague-Bearer Malrik before folks stop buying—uh, before Solaris perishes!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Sawbones Gideon',
        speakerRole: 'Back-Alley Influencer Alchemist',
        moodLabel: 'Shaking Neon-Green Beakers',
        lines: [
          'What is UP, armored legend! Today’s quest is sponsored by Gideon’s Ultra-Vitality Antidote—only 400G per sip, subscribe and save!',
          'Some hideous blight blew out of the Outskirts Forest this morning! Totally random! Completely unrelated to the glowing spore-barrels in my cellar!',
        ],
        choices: [
          {
            id: 'sq4_taste_vial',
            label: '“Wait... isn’t your ‘Miracle Cure’ literally tavern beer mixed with swamp moss?”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Whoa, watch the defamation suit! It’s artisanal fermented botanical slurry! Here’s 25G—stop sniffing the test tubes!',
            ],
            bonusGold: 25,
            nextNodeId: 'open_2',
          },
          {
            id: 'sq4_ask_intern',
            label: '“Who’s Malrik? Why does he wear your apothecary apron?”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'M-Malrik?! Just a disgruntled unpaid contractor who ran off into the woods with my proprietary spore censer! Pure coincidence!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq4_ignore_pitch',
            label: '“Keep your sales pitch. Give me the target count.”',
            tone: 'ruthless',
            npcReply: [
              'Four forest stalkers! And one slightly over-caffeinated intern!',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Sawbones Gideon',
        speakerRole: 'Back-Alley Influencer Alchemist',
        moodLabel: 'Waving Punch-Cards',
        lines: [
          'Slay 4 beasts in the Outskirts Forest and silence Plague-Bearer Malrik before he blabs to the Health Inspector.',
          'Also take this coupon: buy nine antidotes, get a free pine coffin!',
        ],
        choices: [
          {
            id: 'sq4_accept',
            label: 'Accept Contract — Shut Down the Blight Vector',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Heroic! Remember to smash any bottles labeled "Property of Dr. G."—it’s bad for branding!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Sawbones Gideon',
        speakerRole: 'Back-Alley Influencer Alchemist',
        moodLabel: 'Counting Antidote Orders',
        lines: [
          'Sales are UP 300% today! Er—I mean, oh no, the terrible tragedy! Did you wipe out Malrik yet?',
        ],
        choices: [
          {
            id: 'sq4_mid_call',
            label: '“The forest monsters are literally carrying your wholesale crates.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Supply-chain disruption! Clearly bandits hijacked my wellness delivery! Go kill Malrik already!',
            ],
          },
          {
            id: 'sq4_mid_leave',
            label: '“Back to the hunt.”',
            tone: 'accept',
            npcReply: ['Stay hydrated! Preferably with my 400G tonic!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Sawbones Gideon',
        speakerRole: 'Exposed Plague Profiteer',
        moodLabel: 'Packing His Suitcase Fast',
        lines: [
          'Okay, fine! Yes, I poisoned the town well so I could hit Diamond-Tier Guild Pharmacist before Q4 closed!',
          'Blame the Crown’s absurd potion taxes! At least Malrik finally got out of his unpaid internship—permanently!',
        ],
        choices: [
          {
            id: 'sq4_extort',
            label: '“Cut me in for 65G or I feed you a whole crate of your own spore-ale.”',
            tone: 'extort',
            bonusGold: 65,
            markConfronted: true,
            npcReply: [
              'Sixty-five gold! Wire transfer complete! Just don’t leave a one-star review at the Guild Hall!',
            ],
          },
          {
            id: 'sq4_punch',
            label: '“Here’s a free medical tip: fix your own jaw after I leave.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'Yikes! So aggressive! Definitely putting soothing balm on sale next week!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: PATIENT ZERO BY DESIGN',
    twistRevelation:
      'Gideon brewed the Black Cough outbreak himself to sell overpriced cures—and sent you to silence Malrik, his unpaid intern carrying the spore-censer.',
    twistDialogue: [
      'Every poison flask strapped to the fallen beasts carries Gideon’s smiling wax sticker: "Drink Twice Daily For Best Panic!"',
      'Plague-Bearer Malrik staggers out swinging a smoking censer: "He promised me college credit for this! NOBODY STOPS MY INTERNSHIP!"',
    ],
    bossName: 'Plague-Bearer Malrik',
    bossTitle: 'Unpaid Blight Intern',
    bossArchetype: 'bandit_pyromancer',
    bossSpawnX: 1840,
    bossHp: 450,
    bossDamage: 24,
    bossDefeatLine: 'Tell Gideon... I expect... overtime pay in hell...',
    rewardGold: 410,
    rewardStatPoints: 4,
    rewardStarStones: 3,
  },
  {
    id: 'sq_05_hollow_bell',
    index: 5,
    title: 'Friendly Fire & Feather-Brained Scouts',
    storyTheme: 'Eminence in Shadow Vibes · Traitor Captain',
    chapterTitle: 'Act II · Rot Beneath the Altar',
    giverName: 'Ranger Lyra',
    giverRoleLabel: 'Suspiciously Unscratched Scout Captain',
    giverRealm: 'outskirts_forest',
    giverX: 290,
    coatColor: '#14532d',
    hairColor: '#fbbf24',
    shirtColor: '#451a03',
    targetRealm: 'outskirts_forest',
    twistTriggerKills: 5,
    hookSummary:
      'Lyra clutches tomato-stained bandages claiming her entire scout squad fell into goblin snares—while wearing brand-new Demon-Steel boots.',
    conspiracyClue:
      'Smuggler Manifest: Lyra sold her squad’s patrol routes and Solaris Gate master keys to Hobgoblin War-Ringer Grakthar in exchange for rare raid loot.',
    giverOpeningDialogue: [
      'Oh, the carnage! Hobgoblins blew our own ambush whistle and butchered twelve brave scouts while I heroically tripped backwards out of harm’s way!',
      'Slay 5 forest raiders and silence War-Ringer Grakthar before he rings my poor captain’s skull like a dinner bell!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Ranger Lyra',
        speakerRole: 'Suspiciously Unscratched Scout Captain',
        moodLabel: 'Admiring Shiny New Boots',
        lines: [
          'Alas, woe, and unspeakable trauma! My whole platoon was wiped out by ironwire traps just east of here!',
          'I barely crawled back! Look at my bandages—so red! Ignore the faint aroma of marinara sauce, please, that’s forest sap.',
        ],
        choices: [
          {
            id: 'sq5_inspect_boots',
            label: '“Those are Demon-Forged Sabatons. Where does an F-Rank ranger afford those?”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 30,
            npcReply: [
              'F-found them in a bush! Totally legal loot drop! Look, take 30G and don’t ask why they have Hobgoblin size tags!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq5_sniff_bandage',
            label: '“...Is that oregano on your ‘mortal shoulder wound’?”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'IT’S MEDICINAL HERBS! Stop leaning in like a bloodhound! Go kill 5 raiders in these woods right now!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq5_nod',
            label: '“Tell me where Grakthar camps. Nothing else matters.”',
            tone: 'ruthless',
            npcReply: [
              'Deep east in the timberline! Just smash him hard enough that he stops screaming things about "the green-cloak trade deal."',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Ranger Lyra',
        speakerRole: 'Suspiciously Unscratched Scout Captain',
        moodLabel: 'Adjusting Gold Whistle',
        lines: [
          'Eliminate 5 forest enemies to draw out War-Ringer Grakthar near the eastern cavern trail.',
          'Do not listen to anything a hobgoblin yells in broken Common. They’re notorious gossips.',
        ],
        choices: [
          {
            id: 'sq5_accept',
            label: 'Accept Contract — Hunt War-Ringer Grakthar',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'May fortune smile upon you! I’ll stand bravely right here by the exit gate!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Ranger Lyra',
        speakerRole: 'Suspiciously Unscratched Scout Captain',
        moodLabel: 'Hiding Gold Whistle Behind Back',
        lines: [
          'Still hacking through the brush? Any luck silencing—I mean avenging—my beloved squadmates?',
        ],
        choices: [
          {
            id: 'sq5_mid_whistle',
            label: '“Found a half-chewed Hobgoblin receipt signed ‘Little Green Bird.’”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Could be ANY green-cloaked ranger with immaculate hair and a gold whistle! Kill Grakthar before he ruins my promotion!',
            ],
          },
          {
            id: 'sq5_mid_go',
            label: '“Almost done.”',
            tone: 'accept',
            npcReply: ['Hurry! Before the birds start singing my—their—dirge!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Ranger Lyra',
        speakerRole: 'Boot-Obsessed Squad Traitor',
        moodLabel: 'Dropping the Fake Limp',
        lines: [
          'Alright, yes! I tipped Grakthar off so my meddling squad couldn’t tattle on my smuggling! Have you seen the stats on these boots? +18% movement speed!',
          'Besides, those scouts kept humming marching songs out of tune. Honestly I did the forest’s acoustics a favor.',
        ],
        choices: [
          {
            id: 'sq5_extort',
            label: '“Pay the betrayal tax—70G, or your shinbones won’t fit those boots.”',
            tone: 'extort',
            bonusGold: 70,
            markConfronted: true,
            npcReply: [
              'Gah! Fine, take the gold! Not the ankles—the leather barely broke in!',
            ],
          },
          {
            id: 'sq5_roast',
            label: '“Sold twelve comrades for footwear. Even goblins think you’re trash.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'At least I’m fast trash! Don’t look at me like that, you spooky psycho!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: THE TRAITOR’S WHISTLE',
    twistRevelation:
      'Lyra faked her wounds and blew the snare whistle herself—purging her whistleblowing platoon so Grakthar would pay her in Demon-Steel raid gear.',
    twistDialogue: [
      'A goblin corpse clutches a gilded Solaris whistle engraved "CAPTAIN LYRA · NO REFUNDS ON DEAD SCOUTS"!',
      'War-Ringer Grakthar slams his spiked maul down: "Green-cloak girl sold soft knights for shiny boots! You next!"',
    ],
    bossName: 'War-Ringer Grakthar',
    bossTitle: 'Iron-Snare Hobgoblin Tyrant',
    bossArchetype: 'hobgoblin',
    bossSpawnX: 1980,
    bossHp: 490,
    bossDamage: 25,
    bossDefeatLine: 'Little ranger... cheated BOTH tribes... watch your back...',
    rewardGold: 460,
    rewardStatPoints: 4,
    rewardStarStones: 3,
  },
  {
    id: 'sq_06_twin_fang_oath',
    index: 6,
    title: 'Brother of the Year Award',
    storyTheme: 'Dark Tragedy × Petty Fraud',
    chapterTitle: 'Act III · Graves in the Basalt',
    giverName: 'Sellsword Thorne',
    giverRoleLabel: 'Dramatically Limping Deserter',
    giverRealm: 'outskirts_forest',
    giverX: 1080,
    coatColor: '#3f3f46',
    hairColor: '#dc2626',
    shirtColor: '#09090b',
    targetRealm: 'outskirts_caves',
    twistTriggerKills: 4,
    hookSummary:
      'Thorne begs you to execute his "cowardly twin" Garret inside the Outskirts Caves—suspiciously keeping one arm tucked tightly inside a huge coat.',
    conspiracyClue:
      'Military Fraud Dossier: Garret held the cavern choke point alone for 72 hours while Thorne bolted, faked a missing arm by tucking it in his shirt, and stole Garret’s medal.',
    giverOpeningDialogue: [
      'Ugh... my phantom limb aches whenever I think of my treacherous twin Garret stealing our swords and fleeing into the Outskirts Caves!',
      'Slice through 4 cave fiends and end that dishonorable rat Garret so my tragic backstory stays clean!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Sellsword Thorne',
        speakerRole: 'Dramatically Limping Deserter',
        moodLabel: 'Tucking Left Arm Inside Jacket',
        lines: [
          'Spare a thought for a broken hero, Knight! When monsters flooded the caves, my twin brother Garret abandoned me to lose my arm and fled like a dog!',
          'Every month I barely scrape by on Solaris’s royal disability pension, haunted by his betrayal...',
        ],
        choices: [
          {
            id: 'sq6_poke_coat',
            label: '*Notice his "empty" left sleeve twitching and holding a meat pie inside his coat*',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Gah! That’s—that’s a phantom muscle spasm! Stop staring at my chest pastry! Nobody ever checks under a war hero’s cape!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq6_ask_garrison',
            label: '“If Garret ran away into the deeper caves, how did you reach the exit before him?”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 35,
            npcReply: [
              'Pure heroic agility! Look, take 35G, enter the Outskirts Caves, and make sure Garret doesn’t talk to any Guild clerks!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq6_cold',
            label: '“I’ll hunt Garret down. Family drama pays well enough.”',
            tone: 'ruthless',
            npcReply: [
              'Spoken like a true professional! Just aim straight for his vocal cords first!',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Sellsword Thorne',
        speakerRole: 'Dramatically Limping Deserter',
        moodLabel: 'Swallowing Crust Nervously',
        lines: [
          'Cut down 4 cave abominations in the Outskirts Caves to flush Garret out of the crypt gallery.',
          'Bring peace to my—cough—tragic, one-armed existence.',
        ],
        choices: [
          {
            id: 'sq6_accept',
            label: 'Accept Contract — Enter the Caves for Garret',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Bless you! Tell him his brother sends... a really tight hug of steel!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Sellsword Thorne',
        speakerRole: 'Dramatically Limping Deserter',
        moodLabel: 'Quickly Hiding Both Hands',
        lines: [
          'You’re back! Did Garret put up much of a fight, or did he crumble like the coward I told the tavern he was?',
        ],
        choices: [
          {
            id: 'sq6_mid_expose',
            label: '“You used BOTH hands to clap when I walked up, Thorne.”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'SHHH!! Keep your voice down, the Guild pension officer walks by at noon! Go finish him in the caves!',
            ],
          },
          {
            id: 'sq6_mid_go',
            label: '“Going back underground now.”',
            tone: 'accept',
            npcReply: ['Yes, deep underground! Far away from witnesses!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Sellsword Thorne',
        speakerRole: 'Two-Armed Pension Fraud',
        moodLabel: 'Drops Coat Revealing Both Arms',
        lines: [
          'Okay, fine! Both my arms work great! Can you blame me? Garret wanted to "die honorably" holding the cave mouth while I realized living with free tavern meals is way better!',
          'He came back as an undead cursed specter anyway—honestly, freeing him from eternity in those damp caves was doing him a solid!',
        ],
        choices: [
          {
            id: 'sq6_extort',
            label: '“75G hush money—or I tell the tavern how Garret actually died.”',
            tone: 'extort',
            bonusGold: 75,
            markConfronted: true,
            npcReply: [
              'Take the pension check! May Garret’s ghost haunt someone with a smaller sword!',
            ],
          },
          {
            id: 'sq6_honor',
            label: '“Garret died a hero. You’re just a worm wearing his ribbon.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'A worm with two working thumbs and no funeral bill, pal! Stay out of my woods!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: THE SEVERED ARM’S DEBT',
    twistRevelation:
      'Garret held the cave mouth alone for three days so Thorne could live—Thorne framed him as a traitor, faked a missing arm for pension gold, and sent you to erase the ghost.',
    twistDialogue: [
      'A ring of shattered crypt shields marks Garret’s last stand—carved in stone: "HOLD THE LINE UNTIL THORNE REACHES SUNLIGHT."',
      'Garret the Betrayed materializes in spectral mail, blade trembling: "Did my brother show you his tucked-in sleeve before sending you to murder me?!"',
    ],
    bossName: 'Garret the Betrayed',
    bossTitle: 'Vengeful Garrison Specter',
    bossArchetype: 'cursed_armor',
    bossSpawnX: 1460,
    bossHp: 540,
    bossDamage: 27,
    bossDefeatLine: 'Tell Thorne... my watch... is finally over... coward...',
    rewardGold: 520,
    rewardStatPoints: 5,
    rewardStarStones: 4,
  },
  {
    id: 'sq_07_ash_archivist',
    index: 7,
    title: 'Terms & Conditions Apply (In Blood)',
    storyTheme: 'Overlord Horror · Fine-Print Soul Trap',
    chapterTitle: 'Act III · Graves in the Basalt',
    giverName: 'Archivist Vesper',
    giverRoleLabel: 'Charred Royal Librarian',
    giverRealm: 'outskirts_forest',
    giverX: 1790,
    coatColor: '#4c1d95',
    hairColor: '#e2e8f0',
    shirtColor: '#0f172a',
    targetRealm: 'outskirts_caves',
    twistTriggerKills: 5,
    hookSummary:
      'Vesper claims lunatic pyromaniacs stole Solaris’s beloved "Town Recipe Book"—which happens to groan softly when opened.',
    conspiracyClue:
      'The Solaris Waiver Secret: Every "F-Rank Adventurer Registration" signed in town secretly binds the signer’s skin & soul into Vesper’s Summoning Codex.',
    giverOpeningDialogue: [
      'Tragedy! Vandal-cultists torched my bookmobile and carried Solaris’s precious Municipal Recipe Book into the Outskirts Caves!',
      'Purge 5 cave fiends and execute High Censor Morvath before he burns—uh, ruins—all our favorite grandma soup recipes!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Archivist Vesper',
        speakerRole: 'Charred Royal Librarian',
        moodLabel: 'Polishing Soot-Blackened Monocle',
        lines: [
          'Ah, a literate—or at least sharp-sworded—adventurer! You signed the Solaris Guild F-Rank Waiver when you arrived, didn’t you?',
          'Wonderful! Well, tiny crisis: a violent madman named High Censor Morvath stole our harmless town registry and plans to burn every single page in the caves!',
        ],
        choices: [
          {
            id: 'sq7_ask_waiver',
            label: '“Wait... why was Section 12 of the F-Rank Waiver about ‘Post-Mortem Parchment Binding’?”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 40,
            npcReply: [
              'Oh, legal boilerplate! Nobody reads Terms & Conditions in an Isekai! Here is 40G—stop remembering fine print and go kill Morvath!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq7_ask_book_noise',
            label: '“Why did your spare notebook just whisper ‘Please moisturize me’?”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Humidity! Old sheepskin creaks horribly in forest air! Definitely sheepskin! Not taxpayers!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq7_accept_fast',
            label: '“Just tell me what Morvath looks like.”',
            tone: 'ruthless',
            npcReply: [
              'Tall robes, fire spells, screaming about "saving the rookies from the census." Clearly unhinged.',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Archivist Vesper',
        speakerRole: 'Charred Royal Librarian',
        moodLabel: 'Tapping Flesh-Bound Cover',
        lines: [
          'Destroy 5 monsters in the Outskirts Caves and retrieve the Solar Codex from High Censor Morvath.',
          'Do try not to spill any more blood on Page 42—that’s where your own name is inked.',
        ],
        choices: [
          {
            id: 'sq7_accept',
            label: 'Accept Contract — Recover the Stolen Codex',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Splendid! Remember, overdue library books carry a penalty of eternal torment!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Archivist Vesper',
        speakerRole: 'Charred Royal Librarian',
        moodLabel: 'Flipping Screaming Pages',
        lines: [
          'Have you rescued my priceless literary masterpiece from that arsonist lunatic yet?',
        ],
        choices: [
          {
            id: 'sq7_mid_burn',
            label: '“Morvath’s cultists say the book is made out of dead town clerks.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Slander! Mostly out-of-state bandits and three rude tax auditors! Finish the job before he turns the whole census to ash!',
            ],
          },
          {
            id: 'sq7_mid_go',
            label: '“Heading back down.”',
            tone: 'accept',
            npcReply: ['Mind the soot!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Archivist Vesper',
        speakerRole: 'Occult Bureaucracy Mastermind',
        moodLabel: 'Unblinking Cold Smirk',
        lines: [
          'Congratulations—you killed the one hero crazy enough to burn my summoning ledger! Honestly, Morvath was terrible for town property values anyway.',
          'Don’t worry about your own signature on Page 42. As long as you survive every Demon King, nobody comes knocking to peel your warranty!',
        ],
        choices: [
          {
            id: 'sq7_extort',
            label: '“Scratch my name off Page 42 and hand over 85G right now.”',
            tone: 'extort',
            bonusGold: 85,
            markConfronted: true,
            npcReply: [
              'Erased and paid in full! Pleasure striking you from the necrotic census, Hero!',
            ],
          },
          {
            id: 'sq7_threat',
            label: '“Next library fire in Solaris is going to start on your beard.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'Noted under "Violent Customer Feedback." Good day, Knight.',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: THE CODEX WRITTEN ON SKIN',
    twistRevelation:
      'The stolen grimoire is Vesper’s soul-harvesting Adventurer Waiver bound in human hide—and "heretic" Morvath stole it specifically to burn Solaris’s curse to ash!',
    twistDialogue: [
      'A half-burned page blows across the cavern stone—bound in human skin bearing your own F-Rank Adventurer signature!',
      'High Censor Morvath ignites his flames: "You fool! I was trying to BURN that monster’s census—now I have to cut through YOU first!"',
    ],
    bossName: 'High Censor Morvath',
    bossTitle: 'Renegade Ledger-Burner',
    bossArchetype: 'cultist_mage',
    bossSpawnX: 1620,
    bossHp: 580,
    bossDamage: 29,
    bossDefeatLine: 'Burn Vesper’s archive... before Page 42... calls your soul...',
    rewardGold: 590,
    rewardStatPoints: 5,
    rewardStarStones: 4,
  },
  {
    id: 'sq_08_chained_hound',
    index: 8,
    title: 'Hazard Pay & OSHA Violations',
    storyTheme: 'Made in Abyss Dread · Union Busting Horror',
    chapterTitle: 'Act III · Graves in the Basalt',
    giverName: 'Miner Balthus',
    giverRoleLabel: 'Soot-Faced Pit Foreman',
    giverRealm: 'outskirts_caves',
    giverX: 250,
    coatColor: '#78350f',
    hairColor: '#475569',
    shirtColor: '#f59e0b',
    targetRealm: 'outskirts_caves',
    twistTriggerKills: 5,
    hookSummary:
      'Balthus claims a tragic "natural rockfall" trapped twelve miners—while hurriedly stuffing blasting fuses and life-insurance claims into his hardhat.',
    conspiracyClue:
      'Basalt Shaft Ledger: Twelve miners discovered cursed weeping quartz beneath Solaris and tried to unionize; Balthus collapsed the shaft from outside and fed them to Obsidian Maw.',
    giverOpeningDialogue: [
      'Oh, sweet merciful stone! Twelve hard-working lads got sealed behind that collapse by an entirely unpredictable, non-negligent ceiling slip!',
      'Crush 5 cave beasts and slay the Obsidian Maw Ravager blocking the rescue shaft—and definitely ignore the sulfur smell on my boots!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Miner Balthus',
        speakerRole: 'Soot-Faced Pit Foreman',
        moodLabel: 'Hiding Blasting Plunger Behind Barrel',
        lines: [
          'Thank the mountain, a rescue knight! Twelve brave miners are trapped past this cavern bend—no food, no light, and giant rock gargoyles snapping at their toes!',
          'It was a 100% Act of God! Completely covered under Solaris Mining Act Clause 9—meaning zero liability for management!',
        ],
        choices: [
          {
            id: 'sq8_ask_soot',
            label: '“Why are blast caps and fresh detonator wire piled on THIS side of the rubble?”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 45,
            npcReply: [
              'S-standard emergency tunnel-clearing gear! Just pointed backwards by accident! Look, take 45G—stop inspecting OSHA violations in a dungeon!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq8_hear_voices',
            label: '“Wait... is that red crystal humming in a sad old man’s voice?”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Heh, yeah, the cursed quartz mimics dead relatives. Great resale value with noble collectors! Just don’t ask how it gets "charged."',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq8_ready',
            label: '“I’ll clear the beasts and smash the Obsidian Maw.”',
            tone: 'ruthless',
            npcReply: [
              'Now that’s the can-do hustle spirit Solaris appreciates!',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Miner Balthus',
        speakerRole: 'Soot-Faced Pit Foreman',
        moodLabel: 'Nervous Thumbs-Up',
        lines: [
          'Smash 5 monsters inside the Outskirts Caves and put down the Obsidian Maw Ravager in the lower gallery.',
          'If you find twelve union picket signs in the rubble... kick them into a lava crack.',
        ],
        choices: [
          {
            id: 'sq8_accept',
            label: 'Accept Contract — Clear the Collapsed Shaft',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Heroic! Remember—any survivors who demand back-pay count as hostile mimics!',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Miner Balthus',
        speakerRole: 'Soot-Faced Pit Foreman',
        moodLabel: 'Sweating Under Helmet',
        lines: [
          'Did the gargoyle finish—er, did you reach the trapped boys behind the obsidian vault yet?',
        ],
        choices: [
          {
            id: 'sq8_mid_call',
            label: '“There aren’t twelve survivors, Balthus. Those red crystals are bleeding.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Gah! Just smash the Obsidian Maw before those crystals scream loud enough to reach town!',
            ],
          },
          {
            id: 'sq8_mid_go',
            label: '“Going back in.”',
            tone: 'accept',
            npcReply: ['Watch your head! Ceilings around here get... surprisingly explosive!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Miner Balthus',
        speakerRole: 'Exposed Cave-In Killer',
        moodLabel: 'Clutching Insurance Papers',
        lines: [
          'They wanted weekends off AND hazard dental! Do you know what weekends cost when the Crown demands three tons of screaming blood-quartz a week?!',
          'At least you shattered the Maw so nobody can dig up the skeletons. Want a job as Assistant Pit Foreman? Great dental—just don’t strike!',
        ],
        choices: [
          {
            id: 'sq8_extort',
            label: '“90G severance pay for the dead crew—into MY pocket, right now.”',
            tone: 'extort',
            bonusGold: 90,
            markConfronted: true,
            npcReply: [
              'Take the ninety gold! Keep your pickaxe out of my teeth!',
            ],
          },
          {
            id: 'sq8_curse',
            label: '“Listen closely next time the red stone whispers, Foreman. They remember you.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'Shut up! Rocks don’t remember faces! Stop saying creepy things in the dark!',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: SEALED BY THE FOREMAN',
    twistRevelation:
      'There were never survivors to save—Balthus dynamited the exit from outside to bury twelve unionizing miners and harvest their sorrow inside cursed blood-quartz.',
    twistDialogue: [
      'Twelve charred union helmets sit behind OUTSIDE-facing blast caps—someone buried those miners alive for the red quartz!',
      'Obsidian Maw Ravager plunges from the vault screaming in twelve overlapping human voices!',
    ],
    bossName: 'Obsidian Maw Ravager',
    bossTitle: 'Cursed Vein Gargoyle Alpha',
    bossArchetype: 'gargoyle_charger',
    bossSpawnX: 1760,
    bossHp: 640,
    bossDamage: 31,
    bossDefeatLine: '*Shatters into twelve weeping crimson shards whispering Balthus’s name*',
    rewardGold: 660,
    rewardStatPoints: 5,
    rewardStarStones: 4,
  },
  {
    id: 'sq_09_velvet_gallows',
    index: 9,
    title: 'Internal Affairs (Axe Edition)',
    storyTheme: 'Dark Souls × Sinister Corporate HR',
    chapterTitle: 'Act IV · The Crown’s Dirty Hands',
    giverName: 'Inquisitor Mireille',
    giverRoleLabel: 'Velvet Judiciary Envoy',
    giverRealm: 'outskirts_caves',
    giverX: 760,
    coatColor: '#9f1239',
    hairColor: '#09090b',
    shirtColor: '#fef3c7',
    targetRealm: 'outskirts_caves',
    twistTriggerKills: 6,
    hookSummary:
      'Polite, smiling Mireille hires you to "quietly downsize" a rogue executioner who supposedly went mad—despite every warrant bearing her perfume.',
    conspiracyClue:
      'Judicial Cleanup Order: Cassian tortured Solaris’s Ledger whistleblowers under Mireille’s direct orders; now Mireille outsources you to silence Cassian before trial.',
    giverOpeningDialogue: [
      'Good evening, dear Hero. The Crown’s Judiciary needs a quiet, decisive contractor to resolve an unfortunate... HR misunderstanding down here.',
      'Eliminate 6 cave horrors and gently retire Lord Hangman Cassian before his wild accusations embarrass respectable nobles.',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Inquisitor Mireille',
        speakerRole: 'Velvet Judiciary Envoy',
        moodLabel: 'Sipping Tea Beside Gallows Hooks',
        lines: [
          'How refreshing—an Otherworlder who doesn’t faint at bloodstains! Our former Chief Executioner, Lord Hangman Cassian, appears to have gone terribly off-script.',
          'The Crown strictly forbids unauthorized torture chambers. Naturally, the fact that this chamber has Crown chandeliers and velvet upholstery is purely ironic.',
        ],
        choices: [
          {
            id: 'sq9_ask_perfume',
            label: '“Those execution logs on the table smell like your exact rosewater perfume.”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 50,
            npcReply: [
              'How observant—and perilous—of you! Take 50G for noticing scents, and remember that curiosity tends to shorten necks in Solaris.',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq9_ask_hr',
            label: '“So I’m basically an outsourced corporate hitman for the royal court?”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'We prefer "Independent Conflict Resolution Specialist," darling. Much sleeker on tax filings.',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq9_cold',
            label: '“Name the count and get out of my swing radius.”',
            tone: 'ruthless',
            npcReply: [
              'Crisp. Efficient. Six horrors, then Cassian himself.',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Inquisitor Mireille',
        speakerRole: 'Velvet Judiciary Envoy',
        moodLabel: 'Smiling Without Blinking',
        lines: [
          'Cut down 6 subterranean monsters and liquidate Lord Hangman Cassian in the deep gallery.',
          'Try not to read his desk diary. It’s frightfully dull—just names, dates, and my signature.',
        ],
        choices: [
          {
            id: 'sq9_accept',
            label: 'Accept Contract — Silence Lord Hangman Cassian',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Lovely. The Judiciary deeply values contractors who finish jobs and ask zero follow-up questions.',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Inquisitor Mireille',
        speakerRole: 'Velvet Judiciary Envoy',
        moodLabel: 'Filing Nails With Stiletto',
        lines: [
          'Still breathing, Hero? Tell me Cassian’s lightning hasn’t curled your helmet plume yet.',
        ],
        choices: [
          {
            id: 'sq9_mid_warrant',
            label: '“Found twenty arrest warrants signed ‘Mireille’ for people who tried to leave Solaris.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Every paradise needs border control, darling. Go finish silencing him before he shouts our prince’s name too!',
            ],
          },
          {
            id: 'sq9_mid_go',
            label: '“On my way.”',
            tone: 'accept',
            npcReply: ['Do mind the velvet ropes.'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Inquisitor Mireille',
        speakerRole: 'Royal Cleanup Architect',
        moodLabel: 'Cold Aristocratic Amusement',
        lines: [
          'Bravo! Truly, hiring the unsuspecting hero to purge our own executioner was my cleanest fiscal quarter yet.',
          'Cassian wept when he realized his beloved Lady Mireille tossed him in the shredder. You won’t be next, Hero... provided you stay useful to Prince Alistair.',
        ],
        choices: [
          {
            id: 'sq9_extort',
            label: '“Double my severance—100G, or I pin your signed warrants to the Guild Board.”',
            tone: 'extort',
            bonusGold: 100,
            markConfronted: true,
            npcReply: [
              'Oh, I adore greed—it’s so wonderfully predictable. Here is 100G. Now go ask Prince Alistair down the tunnel about his "father."',
            ],
          },
          {
            id: 'sq9_defy',
            label: '“Keep your silk gloves clean while you can. I’m coming for the throne next.”',
            tone: 'ruthless',
            bonusStatPoints: 1,
            markConfronted: true,
            npcReply: [
              'How theatrical! Go march down to Prince Alistair’s camp then—see what rots at the bottom of Solaris.',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: THE CROWN’S CLEANUP BLADE',
    twistRevelation:
      'Cassian murdered Solaris whistleblowers on Mireille’s direct orders—she hired you purely as a disposable hitman to erase her own executioner before testimony.',
    twistDialogue: [
      'A ledger of gallows warrants flutters free—every single death sentence bears Mireille’s gilded rose-dagger seal!',
      'Lord Hangman Cassian crackles with purple lightning: "So Mireille finally hired an outsider to chop off her own right hand?!"',
    ],
    bossName: 'Lord Hangman Cassian',
    bossTitle: 'Tempest Gallows Executioner',
    bossArchetype: 'demon_lightning',
    bossSpawnX: 1900,
    bossHp: 710,
    bossDamage: 33,
    bossDefeatLine: 'Watch your throat... knight... Mireille’s velvet strangles tightest...',
    rewardGold: 740,
    rewardStatPoints: 6,
    rewardStarStones: 5,
  },
  {
    id: 'sq_10_pale_regent',
    index: 10,
    title: 'Long Live the King (Terms Unclear)',
    storyTheme: 'Dark Isekai Finale · Patricide Conspiracy',
    chapterTitle: 'Act IV · The Crown’s Dirty Hands',
    giverName: 'Prince Alistair the Exiled',
    giverRoleLabel: 'Weeping Pretty-Boy Heir',
    giverRealm: 'outskirts_caves',
    giverX: 1210,
    coatColor: '#1e1b4b',
    hairColor: '#fef08a',
    shirtColor: '#be123c',
    targetRealm: 'outskirts_caves',
    twistTriggerKills: 6,
    hookSummary:
      'Exiled Prince Alistair gives a tearful anime monologue blaming an Abyssal Monster for poisoning his father—while hiding an empty violet poison vial.',
    conspiracyClue:
      'THE SOLARIS LEDGER FINALE: Prince Alistair poisoned the Old King, institutionalized corruption through Kaelen, Vesper, and Mireille, and framed the King’s mutated loyal champion Vane-Rex!',
    giverOpeningDialogue: [
      'O noble hero of another world! Behold my tragic hair and sorrowful prince cape—a monstrous Dread Usurper poisoned my saintly father and drove me down here!',
      'Slay 6 abyssal fiends and put down Dread Champion Vane-Rex so I may claim—uh, cleanse—my father’s devastated throne!',
    ],
    openingNodes: [
      {
        id: 'open_1',
        speaker: 'Prince Alistair the Exiled',
        speakerRole: 'Weeping Pretty-Boy Heir',
        moodLabel: 'Practicing Tragic Anime Sighs',
        lines: [
          'Hark, brave Champion! Do you hear the sorrowful wind in these dank tunnels? That is the weeping of old Solaris itself!',
          'A ruthless Abyssal Beast corrupted my father’s wine, devoured the Royal Guard, and forced poor innocent me to oversee... a few regrettable budget measures.',
        ],
        choices: [
          {
            id: 'sq10_ask_vial',
            label: '“Then why is an empty violet nightshade vial engraved ‘Alistair’s Special Spice’ at your boots?”',
            tone: 'investigate',
            revealClue: true,
            bonusGold: 60,
            npcReply: [
              'Gah—that’s—that’s lavender sleep-drops! For my tragic prince insomnia! Here, 60G—stop looking at my boots and look into my soulful eyes!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq10_connect_ledger',
            label: '“I read Kaelen, Vesper, and Mireille’s papers. ALL nine dirty jobs led straight to your seal.”',
            tone: 'quirky',
            revealClue: true,
            npcReply: [
              'Wh-what?! Nobody actually reads side quest lore in this genre! You’re supposed to smash the glowing boss bar and take the Star Stones!',
            ],
            nextNodeId: 'open_2',
          },
          {
            id: 'sq10_silent',
            label: '“Save the speech, Prince. I’ll see what waits at the bottom.”',
            tone: 'ruthless',
            npcReply: [
              'Yes! Go slay that roaring horror before it finishes spelling out my secret in blood on the cavern wall!',
            ],
            nextNodeId: 'open_2',
          },
        ],
      },
      {
        id: 'open_2',
        speaker: 'Prince Alistair the Exiled',
        speakerRole: 'Weeping Pretty-Boy Heir',
        moodLabel: 'Tightening Royal Cape',
        lines: [
          'Cut through 6 cave abominations and defeat Dread Champion Vane-Rex in the deepest vault.',
          'Everything terrible in Solaris—the taxes, the skin-cloaks, the waivers, the mine collapses—ends once that beast stops roaring.',
        ],
        choices: [
          {
            id: 'sq10_accept',
            label: 'Accept Final Contract — Face the Deepest Cavern',
            tone: 'accept',
            acceptQuest: true,
            npcReply: [
              'Long live Solaris! (And long live plausible deniability!)',
            ],
          },
        ],
      },
    ],
    midQuestNodes: [
      {
        id: 'mid_1',
        speaker: 'Prince Alistair the Exiled',
        speakerRole: 'Weeping Pretty-Boy Heir',
        moodLabel: 'Sweating Through Silver Hair',
        lines: [
          'You’re still reading clues down there, aren’t you? Just kill the Dread Champion before you hear him talk!',
        ],
        choices: [
          {
            id: 'sq10_mid_press',
            label: '“He’s wearing the Old King’s Royal Crest, Alistair. He was the King’s bodyguard.”',
            tone: 'investigate',
            revealClue: true,
            npcReply: [
              'Fine! Yes! I fed my father nightshade soup and Vane-Rex swallowed a demon core trying to stop me! Finish him anyway—nobody at the palace will believe an Otherworlder!',
            ],
          },
          {
            id: 'sq10_mid_go',
            label: '“Back to finish this.”',
            tone: 'accept',
            npcReply: ['May the darkest crown endure!'],
          },
        ],
      },
    ],
    twistConfrontationNodes: [
      {
        id: 'twist_1',
        speaker: 'Prince Alistair the Exiled',
        speakerRole: 'Unmasked Patricide Conspirator',
        moodLabel: 'Dropping the Pretty-Boy Act',
        lines: [
          'Hah... so Vane-Rex spilled his lungs out before he fell. Yes, I killed my father, and yes, the entire Solaris Ledger was my funding machine!',
          'Do you know how expensive it is to keep a bright sunny Isekai town running on top of a Demon Realm? Somebody has to supply the corpses, Hero!',
        ],
        choices: [
          {
            id: 'sq10_extort',
            label: '“Pay the Crown War-Chest—150G, and stay hiding in this rat hole forever.”',
            tone: 'extort',
            bonusGold: 150,
            markConfronted: true,
            npcReply: [
              'Take the royal bullion! With Vane-Rex gone and you holding the Ledger, Solaris belongs to whichever monster swings harder!',
            ],
          },
          {
            id: 'sq10_verdict',
            label: '“I cleared every dirty secret in Solaris. Your reign ends the day I return to Castle.”',
            tone: 'ruthless',
            bonusStatPoints: 2,
            markConfronted: true,
            npcReply: [
              'Chilling! Truly, I summoned the wrong kind of protagonist from another world...',
            ],
          },
        ],
      },
    ],
    twistTitle: 'PLOT TWIST: THE PATRICIDE PRINCE',
    twistRevelation:
      'Alistair poisoned the Old King himself and orchestrated the entire Solaris Ledger conspiracy—Vane-Rex was the King’s last loyal champion mutated while trying to protect the throne!',
    twistDialogue: [
      'A cracked royal signet and Alistair’s own nightshade vial rattle against the stone—the entire Solaris conspiracy leads to the Prince’s boot!',
      'Dread Champion Vane-Rex roars in grief: "ALISTAIR POISONED THE TRUE KING—SPARE NONE OF THAT LIAR’S TALES!!"',
    ],
    bossName: 'Dread Champion Vane-Rex',
    bossTitle: 'Mutated Loyal Shield of Old Solaris',
    bossArchetype: 'demon_tank',
    bossSpawnX: 2040,
    bossHp: 820,
    bossDamage: 36,
    bossDefeatLine: 'Tell Solaris... the smiling town... is built on a grave... strike the prince...',
    rewardGold: 980,
    rewardStatPoints: 8,
    rewardStarStones: 6,
  },
];

export function createInitialSideQuestProgress(): Partial<Record<SideQuestId, SideQuestProgress>> {
  const out: Partial<Record<SideQuestId, SideQuestProgress>> = {};
  for (const q of SIDE_QUESTS) {
    out[q.id] = {
      stage: 0,
      kills: 0,
      twistRevealed: false,
      bossSpawned: false,
      clueUncovered: false,
      chosenOptionIds: [],
      confronted: false,
    };
  }
  return out;
}

export function applySideQuestDialogueChoice(
  quest: SideQuestDef,
  prog: SideQuestProgress,
  choice: SideQuestDialogueChoice,
): {
  goldDelta: number;
  statPointsDelta: number;
  acceptedNow: boolean;
  clueNewlyUncovered: boolean;
} {
  const seen = prog.chosenOptionIds ?? [];
  const alreadyChosen = seen.includes(choice.id);
  if (!alreadyChosen) {
    prog.chosenOptionIds = [...seen, choice.id];
  }

  let goldDelta = 0;
  let statPointsDelta = 0;
  if (!alreadyChosen) {
    goldDelta = choice.bonusGold ?? 0;
    statPointsDelta = choice.bonusStatPoints ?? 0;
  }

  let clueNewlyUncovered = false;
  if (choice.revealClue && !prog.clueUncovered) {
    prog.clueUncovered = true;
    clueNewlyUncovered = true;
  }

  let acceptedNow = false;
  if (choice.acceptQuest && prog.stage === 0) {
    prog.stage = 1;
    acceptedNow = true;
  }

  if (choice.markConfronted) {
    prog.confronted = true;
  }

  return {
    goldDelta,
    statPointsDelta,
    acceptedNow,
    clueNewlyUncovered,
  };
}

export function isQuestTargetEnemyKill(
  quest: SideQuestDef,
  realm: RealmMode,
  enemy: EnemyState,
): boolean {
  if (enemy.sideQuestId) return false;
  return realm === quest.targetRealm;
}

export function createOutskirtsAmbientEnemies(
  realm: 'outskirts_forest' | 'outskirts_caves',
  playerLevel = 1,
): EnemyState[] {
  const levelMult = Math.max(1, 1 + (Math.max(1, playerLevel) - 1) * 0.14);
  if (realm === 'outskirts_forest') {
    const specs: { arch: EnemyArchetype; name: string; x: number; w: number; h: number; hp: number; dmg: number; yOff?: number }[] = [
      { arch: 'bandit_fighter', name: 'Forest Cutthroat', x: 460, w: 18, h: 26, hp: 78, dmg: 13 },
      { arch: 'goblin_normal', name: 'Briar Stalker Goblin', x: 690, w: 17, h: 22, hp: 56, dmg: 10 },
      { arch: 'bandit_archer', name: 'Canopy Crossbowman', x: 920, w: 18, h: 26, hp: 62, dmg: 13 },
      { arch: 'bandit_assassin', name: 'Thorn-Cloak Flanker', x: 1180, w: 18, h: 25, hp: 72, dmg: 16 },
      { arch: 'hobgoblin', name: 'Mire Hobgoblin Marauder', x: 1440, w: 22, h: 30, hp: 108, dmg: 16 },
      { arch: 'bandit_pyromancer', name: 'Ash-Bramble Pyromancer', x: 1700, w: 18, h: 27, hp: 76, dmg: 17 },
      { arch: 'bandit_brute', name: 'Timber-Gate Enforcer', x: 1960, w: 24, h: 32, hp: 132, dmg: 19 },
    ];
    return specs.map((s, i) =>
      makeEnemy(
        `out_for_${Date.now()}_${i}`,
        s.arch,
        s.name,
        s.x,
        FLOOR_Y - (s.yOff ?? s.h),
        Math.round(s.hp * levelMult),
        s.w,
        s.h,
        'forest',
        Math.round(22 * levelMult),
        Math.round(s.dmg * levelMult),
        false,
        1.02,
      ),
    );
  }
  const specs: { arch: EnemyArchetype; name: string; x: number; w: number; h: number; hp: number; dmg: number; yOff?: number }[] = [
    { arch: 'shadow_bat', name: 'Blood-Cavern Bat', x: 420, w: 16, h: 16, hp: 58, dmg: 12, yOff: 54 },
    { arch: 'gargoyle_charger', name: 'Basalt Cave Gargoyle', x: 680, w: 20, h: 26, hp: 114, dmg: 17 },
    { arch: 'cultist_mage', name: 'Subterranean Blood-Cantor', x: 960, w: 20, h: 26, hp: 96, dmg: 18 },
    { arch: 'cursed_armor', name: 'Entombed Crypt Knight', x: 1240, w: 22, h: 28, hp: 138, dmg: 20 },
    { arch: 'demon_lightning', name: 'Abyssal Cave Striker', x: 1510, w: 20, h: 28, hp: 124, dmg: 21 },
    { arch: 'demon_succubus', name: 'Deep Vault Succubus', x: 1780, w: 20, h: 28, hp: 110, dmg: 19, yOff: 66 },
    { arch: 'demon_tank', name: 'Cavern Obsidian Juggernaut', x: 2020, w: 24, h: 32, hp: 172, dmg: 24 },
  ];
  return specs.map((s, i) =>
    makeEnemy(
      `out_cav_${Date.now()}_${i}`,
      s.arch,
      s.name,
      s.x,
      FLOOR_Y - (s.yOff ?? s.h),
      Math.round(s.hp * levelMult),
      s.w,
      s.h,
      'volcano',
      Math.round(30 * levelMult),
      Math.round(s.dmg * levelMult),
      false,
      1.06,
      0.16,
    ),
  );
}

export function createSideQuestBossEnemy(
  quest: SideQuestDef,
  bossesDefeated = 0,
): EnemyState {
  const scale = 1 + Math.min(2.5, Math.max(0, bossesDefeated) * 0.12);
  const hp = Math.round(quest.bossHp * scale);
  const dmg = Math.round(quest.bossDamage * (1 + Math.min(1.5, Math.max(0, bossesDefeated) * 0.08)));
  const isFly = quest.bossArchetype === 'demon_succubus';
  const en = makeEnemy(
    `sq_boss_${quest.id}`,
    quest.bossArchetype,
    quest.bossName,
    quest.bossSpawnX,
    FLOOR_Y - (isFly ? 68 : 34),
    hp,
    24,
    34,
    quest.targetRealm === 'outskirts_caves' ? 'volcano' : 'forest',
    quest.rewardGold,
    dmg,
    true,
    1.36,
    quest.targetRealm === 'outskirts_caves' ? 0.24 : 0.1,
    quest.targetRealm === 'outskirts_caves' ? 'void_eclipse' : 'crimson_ash',
  );
  en.sideQuestId = quest.id;
  return en;
}

export const DUNGEON_SECTOR_WIDTH = 960;

export const ISEKAI_DAY_SECONDS = 180; // Turns night every 3 minutes (180s)
export const ISEKAI_NIGHT_SECONDS = 90; // 1.5 minutes of cozy lit night
export const ISEKAI_DAY_NIGHT_PERIOD = ISEKAI_DAY_SECONDS + ISEKAI_NIGHT_SECONDS;

export interface IsekaiDayNightState {
  nightFactor: number; // 0 = bright day, 1 = cozy midnight
  isNight: boolean;
  phaseLabel: 'Day' | 'Dusk' | 'Night' | 'Dawn';
  secondsToToggle: number;
}

export function getIsekaiDayNightState(clockSeconds: number): IsekaiDayNightState {
  const safe = Math.max(0, clockSeconds);
  const t = safe % ISEKAI_DAY_NIGHT_PERIOD;
  const duskStart = ISEKAI_DAY_SECONDS - 18;
  const dawnStart = ISEKAI_DAY_NIGHT_PERIOD - 18;

  if (t < duskStart) {
    return {
      nightFactor: 0,
      isNight: false,
      phaseLabel: 'Day',
      secondsToToggle: Math.ceil(ISEKAI_DAY_SECONDS - t),
    };
  }
  if (t < ISEKAI_DAY_SECONDS) {
    const f = (t - duskStart) / 18;
    return {
      nightFactor: Number(f.toFixed(3)),
      isNight: f >= 0.65,
      phaseLabel: 'Dusk',
      secondsToToggle: Math.max(1, Math.ceil(ISEKAI_DAY_SECONDS - t)),
    };
  }
  if (t < dawnStart) {
    return {
      nightFactor: 1,
      isNight: true,
      phaseLabel: 'Night',
      secondsToToggle: Math.max(1, Math.ceil(ISEKAI_DAY_NIGHT_PERIOD - t)),
    };
  }
  const f = 1 - (t - dawnStart) / 18;
  return {
    nightFactor: Number(Math.max(0, f).toFixed(3)),
    isNight: f > 0.35,
    phaseLabel: 'Dawn',
    secondsToToggle: Math.max(1, Math.ceil(ISEKAI_DAY_NIGHT_PERIOD - t)),
  };
}

export interface TownHouseSpec {
  x: number;
  w: number;
  h: number;
  roofColor: string;
  roofDark: string;
  wallColor: string;
  beamColor: string;
  hasChimney: boolean;
  hasLaundry: boolean;
}

function seededRand(seed: number): number {
  const x = Math.sin(seed * 91.345 + 17.13) * 43758.5453;
  return x - Math.floor(x);
}

const HOUSE_PALETTES: { roof: string; dark: string; wall: string; beam: string }[] = [
  { roof: '#dc2626', dark: '#991b1b', wall: '#fef9c3', beam: '#78350f' },
  { roof: '#d97706', dark: '#92400e', wall: '#ffedd5', beam: '#5c2810' },
  { roof: '#2563eb', dark: '#1e3a8a', wall: '#f8fafc', beam: '#475569' },
  { roof: '#059669', dark: '#065f46', wall: '#ecfdf5', beam: '#451a03' },
  { roof: '#9333ea', dark: '#581c87', wall: '#fdf4ff', beam: '#3b0764' },
  { roof: '#ea580c', dark: '#9a3412', wall: '#fef3c7', beam: '#431407' },
];

export const TOWN_RANDOM_HOUSES: TownHouseSpec[] = (() => {
  const list: TownHouseSpec[] = [];
  // West plaza homes woven around Guild / Fountain / Shops
  const westSlots = [44, 764, 1018];
  westSlots.forEach((x, idx) => {
    const pal = HOUSE_PALETTES[idx % HOUSE_PALETTES.length];
    list.push({
      x,
      w: idx === 0 ? 84 : 74,
      h: idx === 0 ? 92 : 84,
      roofColor: pal.roof,
      roofDark: pal.dark,
      wallColor: pal.wall,
      beamColor: pal.beam,
      hasChimney: idx % 2 === 0,
      hasLaundry: idx === 1,
    });
  });

  // Expanded East Solaris Town residential districts (3x town size!) skipping Royal Stand Shrine (1365..1690), Hot Spring zone (2510..2865), and Colosseum (3140+)
  let cursor = 1385;
  let i = 0;
  while (cursor < 3040) {
    if (cursor >= 1365 && cursor < 1690) {
      cursor = 1690;
      continue;
    }
    if (cursor > 2430 && cursor < 2875) {
      cursor = 2885;
      continue;
    }
    const r1 = seededRand(i * 3 + 1);
    const r2 = seededRand(i * 3 + 2);
    const r3 = seededRand(i * 3 + 3);
    const w = 74 + Math.floor(r1 * 32);
    const h = 76 + Math.floor(r2 * 28);
    const pal = HOUSE_PALETTES[Math.floor(r3 * HOUSE_PALETTES.length) % HOUSE_PALETTES.length];
    list.push({
      x: cursor,
      w,
      h,
      roofColor: pal.roof,
      roofDark: pal.dark,
      wallColor: pal.wall,
      beamColor: pal.beam,
      hasChimney: r1 > 0.35,
      hasLaundry: r2 > 0.55,
    });
    cursor += w + 26 + Math.floor(r3 * 36);
    i += 1;
  }
  return list;
})();

export type CaravanTarget =
  | 'isekai_town'
  | 'goblin_dungeon'
  | 'demon_realm'
  | 'carriage_escort'
  | 'demon_king_arena'
  | 'seventeen_demon_kings'
  | 'elf_kingdom'
  | 'raider_guild';

export interface CaravanParseResult {
  ok: boolean;
  target?: CaravanTarget;
  label?: string;
  message: string;
}

export function parseCaravanDestination(
  rawInput: string,
  currentRealm: RealmMode,
  guildRank: GuildRank,
  acceptedMissionId: GuildMissionId | null,
  elfKingdomInvited = false,
): CaravanParseResult {
  const q = rawInput.trim().toLowerCase();
  if (!q) {
    return {
      ok: false,
      message:
        'Type a destination first! (e.g., Goblin Dungeon, Elf Kingdom, Demon Realm, Princess Escort, Demon King Citadel, 17 Demon Kings, or Solaris Town)',
    };
  }

  if (
    q.includes('elf') ||
    q.includes('elven') ||
    q.includes('aethelgard') ||
    q.includes('sylvaria') ||
    q.includes('dinner') ||
    q.includes('banquet') ||
    q.includes('feast') ||
    q.includes('party')
  ) {
    if (!elfKingdomInvited) {
      return {
        ok: false,
        message:
          'Border Ward Sealed! Speak [F] with Royal Elf Herald Thalindor in Solaris Town Plaza first to receive Queen Sylvaria’s Moon-Crest Dinner Invitation.',
      };
    }
    return {
      ok: true,
      target: 'elf_kingdom',
      label: 'Aethelgard Elf Kingdom',
      message: 'Moon-Crest Seal verified! Riding the Silver-Bough Highway to the Elf Kingdom Dinner Party!',
    };
  }

  if (
    q.includes('raider') ||
    q.includes('bastion') ||
    q.includes('108')
  ) {
    return {
      ok: true,
      target: 'raider_guild',
      label: 'Dungeon Raider Guild Bastion',
      message: 'Riding directly to the Obsidian Dungeon Raider Guild Bastion!',
    };
  }

  if (
    q.includes('town') ||
    q.includes('solaris') ||
    q.includes('axel') ||
    q.includes('guild') ||
    q.includes('home') ||
    q.includes('back') ||
    q.includes('city') ||
    q.includes('village') ||
    q.includes('spring') ||
    q.includes('onsen')
  ) {
    return {
      ok: true,
      target: 'isekai_town',
      label: 'Solaris Isekai Town',
      message: 'Hop in! Riding the caravan back to Solaris Town Plaza!',
    };
  }

  if (
    q.includes('17') ||
    q.includes('seventeen') ||
    q.includes('pantheon') ||
    q.includes('manhwa') ||
    q.includes('spire') ||
    q === 's rank' ||
    q === 's-rank'
  ) {
    if (rankIndex(guildRank) < rankIndex('S')) {
      return {
        ok: false,
        message: `S-Rank Only! Defeat the 3 Demon Kings (A-Rank) to earn S-Rank Crown before challenging the 17 Manhwa Demon Kings.`,
      };
    }
    return {
      ok: true,
      target: 'seventeen_demon_kings',
      label: '17 Manhwa Demon Kings Outskirts',
      message: 'Bracing the armored caravan for the S-Rank 17 Demon Kings Pantheon Forest!',
    };
  }

  if (
    q.includes('king') ||
    q.includes('citadel') ||
    q.includes('arena') ||
    q === 'a rank' ||
    q === 'a-rank'
  ) {
    if (rankIndex(guildRank) < rankIndex('A')) {
      return {
        ok: false,
        message: `Too dangerous for ${guildRank}-Rank! Reach A-Rank at the Guild 2nd Floor before riding to the Three Demon Kings Citadel.`,
      };
    }
    if (acceptedMissionId === 's_seventeen_demon_kings' && rankIndex(guildRank) >= rankIndex('S')) {
      return {
        ok: true,
        target: 'seventeen_demon_kings',
        label: '17 Manhwa Demon Kings Outskirts',
        message: 'Following your S-Rank Pantheon Contract to the 17 Demon Kings Abyssal Forest!',
      };
    }
    return {
      ok: true,
      target: 'demon_king_arena',
      label: 'Three Demon Kings Abyssal Forest',
      message: 'Hold tight! Driving the armored caravan to the Three Demon Kings Abyssal Forest!',
    };
  }

  if (
    q.includes('princess') ||
    q.includes('carriage') ||
    q.includes('escort') ||
    q.includes('highway') ||
    q.includes('bandit')
  ) {
    if (rankIndex(guildRank) < rankIndex('B')) {
      return {
        ok: false,
        message: `Restricted Royal Highway! Earn B-Rank at the Guild before escorting Princess Aurelia.`,
      };
    }
    return {
      ok: true,
      target: 'carriage_escort',
      label: 'Kingdom Royal Highway',
      message: 'Caravan escort rolling out to the Kingdom Royal Highway!',
    };
  }

  if (
    q.includes('demon') ||
    q.includes('volcano') ||
    q.includes('caldera') ||
    q.includes('vanguard') ||
    q.includes('border') ||
    q.includes('hell')
  ) {
    if (rankIndex(guildRank) < rankIndex('C')) {
      return {
        ok: false,
        message: `The Demon Realm border is sealed to ${guildRank}-Rank! Earn C-Rank first (or type Goblin Dungeon).`,
      };
    }
    return {
      ok: true,
      target: 'demon_realm',
      label: 'Demon Realm Forest Outskirts',
      message: 'Caravan departing for the green forest outside the Demon Realm Caldera Hole!',
    };
  }

  if (
    q.includes('goblin') ||
    q.includes('warren') ||
    q.includes('hobgoblin') ||
    q.includes('cavern') ||
    q.includes('cave') ||
    q.includes('rocky') ||
    q.includes('hole') ||
    q.includes('dungeon') ||
    q.includes('forest')
  ) {
    // If they just typed "dungeon" and hold an accepted C/B/A/S dungeon contract, route to its matching exterior!
    if (q === 'dungeon' && acceptedMissionId) {
      if (acceptedMissionId === 's_seventeen_demon_kings' && rankIndex(guildRank) >= rankIndex('S')) {
        return {
          ok: true,
          target: 'seventeen_demon_kings',
          label: '17 Manhwa Demon Kings Outskirts',
          message: 'Following your S-Rank Pantheon Contract to the 17 Demon Kings Abyssal Forest!',
        };
      }
      const m = GUILD_MISSIONS.find((x) => x.id === acceptedMissionId);
      if (m && (m.realm === 'demon_realm' || m.realm === 'demon_king_arena')) {
        return {
          ok: true,
          target: m.realm,
          label: m.realm === 'demon_realm' ? 'Demon Realm Forest Outskirts' : 'Demon King Forest Outskirts',
          message: `Following your active Guild Contract to the forest outside ${m.title}!`,
        };
      }
    }
    return {
      ok: true,
      target: 'goblin_dungeon',
      label: 'Goblin Dungeon Forest Outskirts',
      message: 'Giddyup! Taking you to the green grassy forest outside the Rocky Goblin Dungeon Hole!',
    };
  }

  const hintBack = currentRealm === 'dungeon_exterior' || currentRealm === 'elf_kingdom' ? ' or Solaris Town' : '';
  return {
    ok: false,
    message: `Never heard of "${rawInput.trim()}" on the Kingdom roads. Try typing: Goblin Dungeon, Elf Kingdom, Demon Realm, Princess Escort, Demon King Citadel, 17 Demon Kings${hintBack}.`,
  };
}

export function applyHotSpringRest(player: PlayerState): { healedHp: number; boostSeconds: number } {
  const healedHp = Math.max(0, Math.round(player.maxHp - player.hp));
  player.hp = player.maxHp;
  player.stamina = player.maxStamina;
  const boostSeconds = 60;
  player.hotSpringTimer = boostSeconds;
  player.damageBoostMultiplier = Math.max(player.damageBoostMultiplier, 1.25);
  player.damageBoostTimer = Math.max(player.damageBoostTimer, boostSeconds);
  return { healedHp, boostSeconds };
}

export const ISEKAI_IDLE_TRANSPORT_SECONDS = 120; // 2 minutes standing still in Citadel

export function shouldIdleTriggerIsekai(
  realm: RealmMode,
  idleTimer: number,
  isPlaying: boolean,
  hasActiveBattleOrCutscene: boolean,
): boolean {
  return realm === 'citadel' && isPlaying && !hasActiveBattleOrCutscene && idleTimer >= ISEKAI_IDLE_TRANSPORT_SECONDS;
}

export function resetPlayerForIsekai(
  player: PlayerState,
  inventory: InventoryItem[],
): { rank: GuildRank } {
  player.level = 1;
  player.statPoints = 0;
  player.stats = {
    skillDmg: 0,
    attack: 0,
    hp: 0,
    speed: 0,
  };
  player.maxHp = 115;
  player.hp = 115;
  player.maxStamina = 100;
  player.stamina = 100;
  player.vx = 0;
  player.vy = 0;
  player.idleTimer = 0;
  player.attackPhase = 'none';
  player.attackTimer = 0;
  player.comboStep = 0;
  player.comboSubStep = 0;
  player.isSpinDashAttack = false;
  player.spinDashTimer = 0;
  player.damageBoostMultiplier = 1;
  player.damageBoostTimer = 0;
  player.dashCooldown = 0;
  player.skillCooldowns = [0, 0, 0];
  player.chronoFreezeTimer = 0;
  player.invulnTimer = 0;
  player.parryTimer = 0;
  player.whiteAuraTimer = 0;
  player.whiteAuraCooldown = 0;
  player.standGuardTimer = 0;
  player.standGuardCooldown = 0;

  const existing = inventory.find((it) => it.id === 'rank_badge_f');
  if (existing) {
    existing.count = Math.max(1, existing.count);
  } else {
    inventory.push({
      id: 'rank_badge_f',
      name: 'F-Rank Guild Badge',
      category: 'key',
      description: 'Porcelain tag proving your fresh registration at the Kingdom Adventurer Guild.',
      sarcasticQuote: 'From 100-boss slayer back to fetching goblin ears. Classic isekai paperwork.',
      count: 1,
      color: '#cbd5e1',
    });
  }
  addInventoryResource(inventory, 'crimson_vial', 1);

  return { rank: 'F' };
}

export function rankIndex(rank: GuildRank): number {
  return RANK_ORDER.indexOf(rank);
}

export function canAccessGuildFloor2(rank: GuildRank): boolean {
  return rankIndex(rank) >= rankIndex('B');
}

export function canStartGuildMission(currentRank: GuildRank, missionId: GuildMissionId): boolean {
  const mission = GUILD_MISSIONS.find((m) => m.id === missionId);
  if (!mission) return false;
  if (mission.floorReq === 2 && !canAccessGuildFloor2(currentRank)) return false;
  return rankIndex(currentRank) >= rankIndex(mission.rankReq);
}

export function getNextGuildRank(rank: GuildRank): GuildRank {
  const idx = rankIndex(rank);
  if (idx < 0 || idx >= RANK_ORDER.length - 1) return rank;
  return RANK_ORDER[idx + 1];
}

export function promoteGuildRankAfterMission(
  currentRank: GuildRank,
  missionId: GuildMissionId,
  inventory: InventoryItem[],
  bRankEscortsCompleted = 0,
  rankMissionsCompleted = 0,
): {
  nextRank: GuildRank;
  promoted: boolean;
  nextBRankEscorts: number;
  nextRankMissionsCompleted: number;
} {
  const mission = GUILD_MISSIONS.find((m) => m.id === missionId);
  if (!mission) {
    return {
      nextRank: currentRank,
      promoted: false,
      nextBRankEscorts: bRankEscortsCompleted,
      nextRankMissionsCompleted: rankMissionsCompleted,
    };
  }

  let nextBRankEscorts = bRankEscortsCompleted;
  if (missionId === 'b_princess_carriage') {
    nextBRankEscorts = bRankEscortsCompleted + 1;
  }

  if (currentRank === 'S') {
    return {
      nextRank: 'S',
      promoted: false,
      nextBRankEscorts,
      nextRankMissionsCompleted: MISSIONS_REQUIRED_PER_RANK,
    };
  }

  const incremented = rankMissionsCompleted + 1;
  if (incremented < MISSIONS_REQUIRED_PER_RANK) {
    return {
      nextRank: currentRank,
      promoted: false,
      nextBRankEscorts,
      nextRankMissionsCompleted: incremented,
    };
  }

  const nextRank = getNextGuildRank(currentRank);
  const badge = inventory.find((it) => it.id.startsWith('rank_badge_'));
  if (badge) {
    badge.id = `rank_badge_${nextRank.toLowerCase()}`;
    badge.name = `${nextRank}-Rank Guild Badge`;
    badge.description = `${RANK_TITLES[nextRank]} badge issued by the Royal Adventurer Guild.`;
    badge.color =
      nextRank === 'S'
        ? '#fbbf24'
        : nextRank === 'A'
          ? '#e11d48'
          : nextRank === 'B'
            ? '#38bdf8'
            : '#a7f3d0';
  }
  return {
    nextRank,
    promoted: nextRank !== currentRank,
    nextBRankEscorts,
    nextRankMissionsCompleted: 0,
  };
}

export function buyPotionShopItem(
  player: PlayerState,
  inventory: InventoryItem[],
  itemId: string,
): { ok: boolean; message: string } {
  if (!POTION_SHOP_IDS.includes(itemId as (typeof POTION_SHOP_IDS)[number])) {
    return { ok: false, message: 'Potion not carried in the Alchemist Apothecary.' };
  }
  const item = inventory.find((i) => i.id === itemId);
  if (!item) return { ok: false, message: 'Potion formula unavailable.' };
  const price = item.shopPrice ?? 120;
  if (player.gold < price) {
    return { ok: false, message: `Need ${price}G for ${item.name} (you have ${Math.round(player.gold)}G).` };
  }
  player.gold -= price;
  item.count += 1;
  return { ok: true, message: `Purchased ${item.name} (-${price}G)!` };
}

export function buyOrEquipWeaponShopItem(
  player: PlayerState,
  weaponId: WeaponId,
): { ok: boolean; message: string } {
  const def = WEAPONS[weaponId];
  if (!def) return { ok: false, message: 'Weapon not stocked on display.' };
  if (player.unlockedWeapons.includes(weaponId)) {
    equipWeapon(player, weaponId);
    return { ok: true, message: `Equipped ${def.name} (${def.specialLabel})!` };
  }
  const price = def.shopPrice ?? 600;
  if (player.gold < price) {
    return { ok: false, message: `Need ${price}G for ${def.name} (have ${Math.round(player.gold)}G).` };
  }
  player.gold -= price;
  player.unlockedWeapons.push(weaponId);
  equipWeapon(player, weaponId);
  return { ok: true, message: `Forged & Equipped ${def.name}! Special: ${def.specialLabel}` };
}

export function buyOrEquipWardrobeItem(
  player: PlayerState,
  unlockedIds: string[],
  itemId: string,
  crownUnlocked: boolean,
  elfCrownUnlocked = false,
): { ok: boolean; message: string } {
  if (itemId === 'toggle_crown') {
    if (!crownUnlocked) {
      return { ok: false, message: 'Defeat the 3 Demon Kings (A-Rank) to earn the Royal Crown!' };
    }
    const switchingStyle =
      player.customization.crownEquipped && player.customization.crownStyle === 'elf_emerald';
    if (switchingStyle) {
      player.customization.crownStyle = 'solaris_gold';
      player.customization.crownEquipped = true;
    } else {
      player.customization.crownStyle = 'solaris_gold';
      player.customization.crownEquipped = !player.customization.crownEquipped;
    }
    return {
      ok: true,
      message: player.customization.crownEquipped
        ? 'Solaris Sovereign Crown equipped!'
        : 'Solaris Sovereign Crown stored safely.',
    };
  }

  if (itemId === 'toggle_elf_crown') {
    if (!elfCrownUnlocked) {
      return {
        ok: false,
        message: 'Defend Queen Sylvaria’s Elf Kingdom Dinner Party from the Eldritch Ambush to claim the Elf Crown!',
      };
    }
    const switchingStyle =
      player.customization.crownEquipped && player.customization.crownStyle !== 'elf_emerald';
    if (switchingStyle) {
      player.customization.crownStyle = 'elf_emerald';
      player.customization.crownEquipped = true;
    } else {
      player.customization.crownStyle = 'elf_emerald';
      player.customization.crownEquipped = !player.customization.crownEquipped;
    }
    return {
      ok: true,
      message: player.customization.crownEquipped
        ? 'Elf Sovereign Emerald Crown equipped!'
        : 'Elf Sovereign Emerald Crown stored safely.',
    };
  }

  const item = WARDROBE_CATALOG.find((w) => w.id === itemId);
  if (!item) return { ok: false, message: 'Item not stocked in Wardrobe Shop.' };

  if (!unlockedIds.includes(item.id)) {
    if (player.gold < item.price) {
      return { ok: false, message: `Need ${item.price}G (have ${Math.round(player.gold)}G).` };
    }
    player.gold -= item.price;
    unlockedIds.push(item.id);
  }

  if (item.outfitStyle) player.customization.outfitStyle = item.outfitStyle;
  if (item.headgearStyle) player.customization.headgearStyle = item.headgearStyle;
  if (item.armorColor) player.customization.armorColor = item.armorColor;
  if (item.cloakColor) player.customization.cloakColor = item.cloakColor;

  return { ok: true, message: `Equipped ${item.name}!` };
}

export function createTownNpcs(isCrowned: boolean): IsekaiNpc[] {
  return [
    {
      id: 'npc_merchant_lena',
      name: 'Merchant Lena',
      role: 'merchant',
      x: 165,
      y: FLOOR_Y - 26,
      minX: 105,
      maxX: 280,
      speed: 22,
      facing: 1,
      walkCycle: 0,
      coatColor: '#b45309',
      hairColor: '#f59e0b',
      shirtColor: '#fef3c7',
      dialogue: [
        'Welcome to Solaris Town! Admire our gleaming white marble fountain & three-district grand avenue!',
        'Accept a Guild quest, then speak to Caravan Master Vance right outside the Guild Hall to ride out!',
      ],
      crownedDialogue: [
        'All hail Your Majesty! Every stall in the royal capital is cheering your victory!',
        'The Three Demon Kings are no more—the golden crown suits you wonderfully!',
      ],
    },
    {
      id: 'npc_guard_harold',
      name: 'Gate Captain Harold',
      role: 'guard',
      x: 470,
      y: FLOOR_Y - 26,
      minX: 380,
      maxX: 595,
      speed: 19,
      facing: -1,
      walkCycle: 1.4,
      coatColor: '#334155',
      hairColor: '#475569',
      shirtColor: '#cbd5e1',
      dialogue: [
        'Caravan Rider Vance waits right outside the Guild! Tell him where you want to ride!',
        'Head east past the Weapons Armory for the Solaris Hot Spring—restores full HP & grants a steam boost!',
      ],
      crownedDialogue: [
        'Salutes! Solaris Kingdom bows before our newly crowned Royal Champion!',
      ],
    },
    {
      id: 'npc_adventurer_kazuma',
      name: 'Scout Renji',
      role: 'adventurer',
      x: 760,
      y: FLOOR_Y - 26,
      minX: 675,
      maxX: 865,
      speed: 28,
      facing: 1,
      walkCycle: 2.2,
      coatColor: '#15803d',
      hairColor: '#1e1b4b',
      shirtColor: '#fde68a',
      dialogue: [
        'At nightfall every 5 minutes, all the lanterns & windows across Solaris glow warmly!',
        'Remember: you can go endlessly deep in any dungeon or climb the West Exit Rope whenever you want!',
      ],
      crownedDialogue: [
        'No way! You went from F-Rank rookie to Crowned Royalty?! Let me buy you a mug at the Guild!',
      ],
    },
    {
      id: 'npc_villager_mira',
      name: 'Artisan Mira',
      role: 'townfolk',
      x: 1055,
      y: FLOOR_Y - 26,
      minX: 940,
      maxX: 1170,
      speed: -24,
      facing: -1,
      walkCycle: 0.7,
      coatColor: '#be123c',
      hairColor: '#92400e',
      shirtColor: '#fff1f2',
      dialogue: [
        'That huge timber hall is the Grand Armory Weapons Shop—dozens of colorful blades on display!',
        'Keep heading east into the Residential Quarter to reach the steaming Solaris Hot Spring!',
      ],
      crownedDialogue: [
        'Hooray for our Royal Sovereign! Confetti is falling across all of Solaris Plaza!',
      ],
    },
    {
      id: 'npc_smith_apprentice',
      name: 'Courier Bell',
      role: 'townfolk',
      x: 1580,
      y: FLOOR_Y - 26,
      minX: 1410,
      maxX: 1860,
      speed: 26,
      facing: 1,
      walkCycle: 1.9,
      coatColor: '#0284c7',
      hairColor: '#fde047',
      shirtColor: '#f8fafc',
      dialogue: [
        'Solaris Town grew three times larger! So many cozy timber homes beneath the jungle canopy!',
      ],
      crownedDialogue: [
        'Your Majesty’s sword shines brighter than the noonday sun over Solaris!',
      ],
    },
    {
      id: 'npc_east_baker_leo',
      name: 'Baker Leo',
      role: 'merchant',
      x: 2120,
      y: FLOOR_Y - 26,
      minX: 1920,
      maxX: 2380,
      speed: -22,
      facing: -1,
      walkCycle: 0.5,
      coatColor: '#d97706',
      hairColor: '#451a03',
      shirtColor: '#fef9c3',
      dialogue: [
        'The Solaris Hot Spring is right up ahead to the east! Soaking heals your wounds and boosts attack!',
      ],
      crownedDialogue: [
        'Fresh honey-bread baked in honor of Your Royal Highness!',
      ],
    },
    {
      id: 'npc_onsen_hana',
      name: 'Onsen Hostess Hana',
      role: 'onsen_attendant',
      x: 2740,
      y: FLOOR_Y - 26,
      minX: 2560,
      maxX: 2840,
      speed: 18,
      facing: -1,
      walkCycle: 1.1,
      coatColor: '#db2777',
      hairColor: '#1e1b4b',
      shirtColor: '#fce7f3',
      dialogue: [
        'Welcome to the Solaris Mineral Hot Spring! Step into the steaming waters with [F] to recover 100% HP + ATK Boost!',
        'Soaking beneath the night stars and paper lanterns is peak isekai bliss!',
      ],
      crownedDialogue: [
        'Your Majesty! Our royal thermal spring is always steaming warm for you!',
      ],
    },
    {
      id: 'npc_east_ranger_kai',
      name: 'Ranger Kai',
      role: 'adventurer',
      x: 3320,
      y: FLOOR_Y - 26,
      minX: 3020,
      maxX: 3640,
      speed: 28,
      facing: 1,
      walkCycle: 2.0,
      coatColor: '#065f46',
      hairColor: '#e2e8f0',
      shirtColor: '#d1fae5',
      dialogue: [
        'Every 5 minutes evening falls and cozy lanterns light up the entire 3-mile town avenue!',
      ],
      crownedDialogue: [
        'The East Quarter cheers loudly for our S-Rank Sovereign!',
      ],
    },
    {
      id: 'npc_east_watch_aria',
      name: 'Watcher Lin',
      role: 'townfolk',
      x: 3840,
      y: FLOOR_Y - 26,
      minX: 3680,
      maxX: 4040,
      speed: -21,
      facing: -1,
      walkCycle: 0.9,
      coatColor: '#4338ca',
      hairColor: '#f472b6',
      shirtColor: '#e0e7ff',
      dialogue: [
        'Beyond these eastern cottages lies the lush emerald jungle framing Solaris Kingdom.',
      ],
      crownedDialogue: [
        'Even out on the eastern terrace, we heard of the Three Demon Kings falling!',
      ],
    },
  ];
}

export function createGuildNpcs(isCrowned: boolean): IsekaiNpc[] {
  return [
    {
      id: 'guild_drinker_1',
      name: 'Barkeep Goro',
      role: 'drinker',
      x: 102,
      y: FLOOR_Y - 24,
      minX: 102,
      maxX: 102,
      speed: 0,
      facing: 1,
      walkCycle: 0,
      coatColor: '#78350f',
      hairColor: '#e2e8f0',
      shirtColor: '#fef3c7',
      sitting: true,
      drinkingPhase: 0.2,
      dialogue: [
        '*Slams frosty oak tankard* Drink up! Nothing beats guild ale after farming rocky Goblin Dungeons!',
        'Once you earn B-Rank on Floor 1, climb the Grand Staircase to the 2nd Floor for Royal Escorts!',
      ],
      crownedDialogue: [
        '*Raises overflowing golden mug* Drinks on the house for the new Crowned Royalty!',
      ],
    },
    {
      id: 'guild_drinker_2',
      name: 'Veteran Borg',
      role: 'drinker',
      x: 162,
      y: FLOOR_Y - 24,
      minX: 162,
      maxX: 162,
      speed: 0,
      facing: -1,
      walkCycle: 0,
      coatColor: '#1e3a8a',
      hairColor: '#9a3412',
      shirtColor: '#94a3b8',
      sitting: true,
      drinkingPhase: 2.1,
      dialogue: [
        '*Gulps ale* Going deeper inside any dungeon drops into pitch-black abysses guarded by Giant Dungeon Bosses!',
        'Wait till you reach the 2nd Floor—you gotta defend 3 different princess convoys from bandits to hit A-Rank!',
      ],
      crownedDialogue: [
        'You actually beat all three Demon Kings?! *spits ale in amazement* Long live Royalty!',
      ],
    },
    {
      id: 'guild_drinker_3',
      name: 'Lancer Elise',
      role: 'drinker',
      x: 222,
      y: FLOOR_Y - 24,
      minX: 222,
      maxX: 222,
      speed: 0,
      facing: 1,
      walkCycle: 0,
      coatColor: '#7e22ce',
      hairColor: '#fde047',
      shirtColor: '#f8fafc',
      sitting: true,
      drinkingPhase: 3.9,
      dialogue: [
        '*Clinks mug* Three clicks on Slash does a crazy fast Up-Down / Left-Right / Right-Left triple combo!',
      ],
      crownedDialogue: [
        isCrowned ? 'Our S-Rank Crowned Sovereign graces the guild tavern! Cheers!' : 'Cheers!',
      ],
    },
    {
      id: 'guild_walker_scout',
      name: 'Courier Toma',
      role: 'adventurer',
      x: 280,
      y: FLOOR_Y - 26,
      minX: 252,
      maxX: 430,
      speed: 24,
      facing: 1,
      walkCycle: 0.4,
      coatColor: '#0f766e',
      hairColor: '#09090b',
      shirtColor: '#ccfbf1',
      dialogue: [
        'Floor 1 Reception handles F through C Rank promotions. Reach B-Rank to unlock the Grand Staircase on the right!',
      ],
      crownedDialogue: [
        'Every adventurer in the guild hall speaks of your legendary Demon King triumph!',
      ],
    },
    {
      id: 'guild_receptionist_luna',
      name: 'Receptionist Luna',
      role: 'receptionist',
      x: 365,
      y: FLOOR_Y - 26,
      minX: 365,
      maxX: 365,
      speed: 0,
      facing: -1,
      walkCycle: 0,
      coatColor: '#1e40af',
      hairColor: '#fbbf24',
      shirtColor: '#ffffff',
      dialogue: [
        'Welcome to Floor 1 Reception! Take F-D Goblin Dungeon quests or C-Rank Demon Border Vanguard here!',
      ],
      crownedDialogue: [
        'Your Royal Highness! The entire Kingdom celebrates your S-Rank Coronation!',
      ],
    },
    {
      id: 'guild_floor2_commander',
      name: 'Commander Aerin',
      role: 'receptionist',
      x: 760,
      y: GUILD_FLOOR2_Y - 26,
      minX: 760,
      maxX: 760,
      speed: 0,
      facing: -1,
      walkCycle: 0,
      coatColor: '#7c2d12',
      hairColor: '#f43f5e',
      shirtColor: '#fef3c7',
      dialogue: [
        'Welcome to the High-Rank 2nd Floor! Receive Princess Guarding (3×) & Demon King Expeditions here!',
      ],
      crownedDialogue: [
        'Your Majesty! The 2nd Floor Command Hall salutes our Crowned Sovereign!',
      ],
    },
  ];
}

export function createWardrobeNpcs(): IsekaiNpc[] {
  return [
    {
      id: 'wardrobe_tailor_sylvie',
      name: 'Tailor Sylvie',
      role: 'tailor',
      x: 340,
      y: FLOOR_Y - 26,
      minX: 310,
      maxX: 390,
      speed: 14,
      facing: -1,
      walkCycle: 0,
      coatColor: '#9f1239',
      hairColor: '#f472b6',
      shirtColor: '#fff1f2',
      dialogue: [
        'Ara, welcome to Atelier Sylvie! Browse Axel Adventurer Tunics, Crimson Guild Coats & Royal Regalia!',
      ],
      crownedDialogue: [
        'Your Royal Crown glistens magnificently against our finest Velvet Regalia!',
      ],
    },
    {
      id: 'wardrobe_patron_kuro',
      name: 'Noble Patron',
      role: 'townfolk',
      x: 170,
      y: FLOOR_Y - 26,
      minX: 115,
      maxX: 245,
      speed: 20,
      facing: 1,
      walkCycle: 0.9,
      coatColor: '#4338ca',
      hairColor: '#e2e8f0',
      shirtColor: '#fef08a',
      dialogue: [
        'The gilded mirror here shows every seam! A sharp Crimson Beret raises party morale by 200%.',
      ],
    },
  ];
}

export function createPotionShopNpcs(): IsekaiNpc[] {
  return [
    {
      id: 'potion_alchemist_nyx',
      name: 'Alchemist Nyx',
      role: 'alchemist',
      x: 395,
      y: FLOOR_Y - 26,
      minX: 365,
      maxX: 430,
      speed: 12,
      facing: -1,
      walkCycle: 0,
      coatColor: '#6d28d9',
      hairColor: '#34d399',
      shirtColor: '#ecfdf5',
      dialogue: [
        'Step carefully around the glowing vats! We brew ruby HP elixirs AND amethyst Fury Damage-Boost potions!',
      ],
      crownedDialogue: [
        'Royal Sovereign! May these glowing elixirs fuel a thousand more victories!',
      ],
    },
    {
      id: 'potion_patron_pip',
      name: 'Apprentice Pip',
      role: 'adventurer',
      x: 185,
      y: FLOOR_Y - 26,
      minX: 125,
      maxX: 280,
      speed: 18,
      facing: 1,
      walkCycle: 0.5,
      coatColor: '#0f766e',
      hairColor: '#fbbf24',
      shirtColor: '#e0f2fe',
      dialogue: [
        'Downing a Titan Overdrive Tonic gives +60% slash & skill damage for 45 seconds straight!',
      ],
    },
  ];
}

export function createWeaponsShopNpcs(): IsekaiNpc[] {
  return [
    {
      id: 'weapons_smith_borin',
      name: 'Master Smith Borin',
      role: 'blacksmith',
      x: 1035,
      y: FLOOR_Y - 26,
      minX: 990,
      maxX: 1110,
      speed: 14,
      facing: -1,
      walkCycle: 0,
      coatColor: '#7c2d12',
      hairColor: '#e2e8f0',
      shirtColor: '#fdba74',
      dialogue: [
        'Welcome to the Grand Solaris Armory! Look at all ten enchanted weapons gleaming along the wall racks!',
        'Every blade has its own color, custom reach, and Special Effect—Frost, Lightning, Lifesteal, Wind, or Inferno!',
      ],
      crownedDialogue: [
        'Forging blades for the Crowned Champion of Solaris—my hammer sings with pride!',
      ],
    },
    {
      id: 'weapons_patron_kain',
      name: 'Blade Collector Kain',
      role: 'adventurer',
      x: 340,
      y: FLOOR_Y - 26,
      minX: 190,
      maxX: 620,
      speed: 26,
      facing: 1,
      walkCycle: 0.3,
      coatColor: '#1e3a8a',
      hairColor: '#94a3b8',
      shirtColor: '#f8fafc',
      dialogue: [
        'Look at the size difference between the compact Viperfang Twinblade and the colossal Raijin Thunder Odachi!',
      ],
    },
    {
      id: 'weapons_patron_sera',
      name: 'Knight Sera',
      role: 'guard',
      x: 770,
      y: FLOOR_Y - 26,
      minX: 650,
      maxX: 920,
      speed: -22,
      facing: -1,
      walkCycle: 1.6,
      coatColor: '#9f1239',
      hairColor: '#fde047',
      shirtColor: '#fff1f2',
      dialogue: [
        'The Bloodmoon Heavy Scythe heals you with every swing—lifesaver in deeper darkened dungeons!',
      ],
    },
  ];
}

export function stepIsekaiNpcs(npcs: IsekaiNpc[], dt: number): void {
  for (const npc of npcs) {
    if (npc.sitting) {
      npc.drinkingPhase = (npc.drinkingPhase ?? 0) + dt * 2.2;
      continue;
    }
    if (npc.speed === 0 || npc.minX >= npc.maxX) continue;
    const step = npc.speed * dt;
    npc.x += step;
    npc.walkCycle += Math.abs(step) * 0.25;
    npc.facing = npc.speed >= 0 ? 1 : -1;
    if (npc.x >= npc.maxX) {
      npc.x = npc.maxX;
      npc.speed = -Math.abs(npc.speed);
      npc.facing = -1;
    } else if (npc.x <= npc.minX) {
      npc.x = npc.minX;
      npc.speed = Math.abs(npc.speed);
      npc.facing = 1;
    }
  }
}

export function createDungeonSectorPlatforms(realm: 'goblin_dungeon' | 'demon_realm', sectorIdx: number): Platform[] {
  const startX = sectorIdx * DUNGEON_SECTOR_WIDTH;
  const plats: Platform[] = [
    {
      id: `${realm}_floor_s${sectorIdx}`,
      x: startX,
      y: FLOOR_Y,
      w: DUNGEON_SECTOR_WIDTH + 60,
      h: 46,
      kind: 'floor',
    },
  ];
  for (let offset = 160; offset < DUNGEON_SECTOR_WIDTH - 120; offset += 320) {
    const cx = startX + offset;
    plats.push(
      {
        id: `${realm}_ledge_low_s${sectorIdx}_${offset}`,
        x: cx,
        y: FLOOR_Y - (realm === 'demon_realm' ? 48 : 44),
        w: 98,
        h: 12,
        kind: 'brick',
      },
      {
        id: `${realm}_ledge_high_s${sectorIdx}_${offset}`,
        x: cx + 150,
        y: FLOOR_Y - (realm === 'demon_realm' ? 82 : 78),
        w: 112,
        h: 12,
        kind: realm === 'demon_realm' ? 'bridge' : 'brick',
      },
    );
  }
  return plats;
}

export function buildIsekaiRoomPlatforms(realm: RealmMode): Platform[] {
  if (realm === 'goblin_dungeon' || realm === 'demon_realm') {
    return [
      ...createDungeonSectorPlatforms(realm, 0),
      ...createDungeonSectorPlatforms(realm, 1),
      ...createDungeonSectorPlatforms(realm, 2),
    ];
  }
  const bounds = ISEKAI_ROOM_BOUNDS[realm];
  const w = Math.min(8000, bounds.maxX + 60);
  const plats: Platform[] = [
    {
      id: `isekai_floor_${realm}`,
      x: 0,
      y: FLOOR_Y,
      w,
      h: 46,
      kind: 'floor',
    },
  ];
  if (realm === 'isekai_town') {
    plats.push(
      { id: 'town_balcony_1', x: 315, y: FLOOR_Y - 56, w: 96, h: 10, kind: 'bridge' },
      { id: 'town_balcony_2', x: 870, y: FLOOR_Y - 56, w: 96, h: 10, kind: 'bridge' },
      { id: 'town_balcony_3', x: 1620, y: FLOOR_Y - 52, w: 110, h: 10, kind: 'bridge' },
      { id: 'town_balcony_4', x: 2240, y: FLOOR_Y - 54, w: 104, h: 10, kind: 'bridge' },
      { id: 'town_balcony_5', x: 3160, y: FLOOR_Y - 52, w: 110, h: 10, kind: 'bridge' },
      { id: 'town_balcony_6', x: 3680, y: FLOOR_Y - 56, w: 108, h: 10, kind: 'bridge' },
    );
  } else if (realm === 'isekai_guild') {
    // 2nd Floor Mezzanine Gallery + Grand Staircase steps visible from Floor 1 Hall
    plats.push(
      { id: 'guild_stair_1', x: 424, y: FLOOR_Y - 26, w: 38, h: 8, kind: 'bridge' },
      { id: 'guild_stair_2', x: 454, y: FLOOR_Y - 54, w: 38, h: 8, kind: 'bridge' },
      { id: 'guild_floor2_deck', x: 486, y: GUILD_FLOOR2_Y, w: 382, h: 12, kind: 'bridge' },
    );
  } else if (realm === 'isekai_weapons_shop') {
    plats.push(
      { id: 'armory_catwalk_l', x: 380, y: FLOOR_Y - 54, w: 180, h: 10, kind: 'bridge' },
      { id: 'armory_catwalk_r', x: 650, y: FLOOR_Y - 54, w: 180, h: 10, kind: 'bridge' },
    );
  } else if (realm === 'dungeon_exterior') {
    plats.push(
      { id: 'ext_log_1', x: 340, y: FLOOR_Y - 40, w: 96, h: 10, kind: 'bridge' },
      { id: 'ext_rock_2', x: 630, y: FLOOR_Y - 58, w: 104, h: 12, kind: 'brick' },
      { id: 'ext_ledge_hole', x: 840, y: FLOOR_Y - 42, w: 86, h: 12, kind: 'brick' },
    );
  } else if (realm === 'demon_king_arena') {
    plats.push(
      { id: 'dk_dais_l', x: 140, y: FLOOR_Y - 48, w: 104, h: 10, kind: 'bridge' },
      { id: 'dk_dais_m', x: 560, y: FLOOR_Y - 68, w: 120, h: 10, kind: 'bridge' },
      { id: 'dk_dais_r', x: 960, y: FLOOR_Y - 48, w: 104, h: 10, kind: 'bridge' },
    );
  } else if (realm === 'dueling_arena') {
    plats.push(
      { id: 'arena_dais_l', x: 185, y: FLOOR_Y - 48, w: 120, h: 12, kind: 'bridge' },
      { id: 'arena_dais_m', x: 540, y: FLOOR_Y - 72, w: 160, h: 12, kind: 'bridge' },
      { id: 'arena_dais_r', x: 910, y: FLOOR_Y - 48, w: 120, h: 12, kind: 'bridge' },
    );
  } else if (realm === 'outskirts_forest') {
    plats.push(
      { id: 'for_bough_1', x: 380, y: FLOOR_Y - 46, w: 110, h: 10, kind: 'bridge' },
      { id: 'for_bough_2', x: 840, y: FLOOR_Y - 64, w: 120, h: 10, kind: 'bridge' },
      { id: 'for_bough_3', x: 1340, y: FLOOR_Y - 50, w: 116, h: 10, kind: 'bridge' },
      { id: 'for_bough_4', x: 1880, y: FLOOR_Y - 58, w: 110, h: 10, kind: 'bridge' },
    );
  } else if (realm === 'outskirts_caves') {
    plats.push(
      { id: 'cav_ledge_1', x: 350, y: FLOOR_Y - 48, w: 110, h: 12, kind: 'brick' },
      { id: 'cav_ledge_2', x: 820, y: FLOOR_Y - 68, w: 126, h: 12, kind: 'brick' },
      { id: 'cav_ledge_3', x: 1360, y: FLOOR_Y - 52, w: 120, h: 12, kind: 'brick' },
      { id: 'cav_ledge_4', x: 1820, y: FLOOR_Y - 62, w: 114, h: 12, kind: 'brick' },
    );
  } else if (realm === 'elf_kingdom') {
    plats.push(
      { id: 'elf_walk_1', x: 520, y: FLOOR_Y - 48, w: 130, h: 10, kind: 'bridge' },
      { id: 'elf_promenade_tier', x: 840, y: FLOOR_Y - 66, w: 180, h: 10, kind: 'bridge' },
      { id: 'elf_balcony_l', x: 1460, y: FLOOR_Y - 58, w: 165, h: 10, kind: 'bridge' },
      { id: 'elf_balcony_r', x: 1940, y: FLOOR_Y - 58, w: 165, h: 10, kind: 'bridge' },
      { id: 'elf_dais_step', x: 2380, y: FLOOR_Y - 26, w: 380, h: 26, kind: 'brick' },
    );
  }
  return plats;
}

export function buildIsekaiRoomInteractables(realm: RealmMode): InteractableProp[] {
  if (realm === 'isekai_town') {
    return [
      {
        id: 'prop_town_citadel_portal',
        x: 24,
        y: FLOOR_Y - 56,
        w: 34,
        h: 56,
        kind: 'citadel_portal',
        label: 'Dimensional Gate · Return to Bastera Citadel',
        speaker: 'Dimensional Return Gate',
        dialogue: ['Stepping back through the Azure-Gold Rift to Bastera Citadel...'],
        activated: false,
      },
      {
        id: 'prop_town_fountain',
        x: 215,
        y: FLOOR_Y - 44,
        w: 76,
        h: 44,
        kind: 'fountain',
        label: 'Solaris White Marble Fountain',
        speaker: 'Town Fountain',
        dialogue: [
          'Crystal-clear spring water arcs gracefully over cool white carved marble!',
          'You splash your face with fresh fountain spray (+15 Stamina restored)!',
        ],
        activated: false,
      },
      {
        id: 'door_adventure_guild',
        x: 342,
        y: FLOOR_Y - 52,
        w: 38,
        h: 52,
        kind: 'guild_door',
        label: 'Enter Adventure Guild Hall',
        speaker: 'Adventure Guild',
        dialogue: ['Stepping into the Two-Story Solaris Adventure Guild Hall...'],
        activated: false,
      },
      {
        id: 'prop_elf_herald',
        x: 414,
        y: FLOOR_Y - 44,
        w: 32,
        h: 44,
        kind: 'elf_herald',
        label: 'Royal Elf Herald Thalindor · Dinner Invitation [F]',
        speaker: 'Lord-Envoy Thalindor',
        dialogue: [
          'By decree of Queen Sylvaria of Aethelgard, you are cordially summoned to the Silver-Bough Royal Dinner Party!',
        ],
        activated: false,
      },
      {
        id: 'prop_caravan_rider',
        x: 482,
        y: FLOOR_Y - 48,
        w: 92,
        h: 48,
        kind: 'caravan_rider',
        label: 'Caravan Rider Vance · Travel Anywhere',
        speaker: 'Caravan Rider Vance',
        dialogue: ['Where are we riding today, adventurer?'],
        activated: false,
      },
      {
        id: 'door_potion_shop',
        x: 648,
        y: FLOOR_Y - 52,
        w: 36,
        h: 52,
        kind: 'potion_door',
        label: 'Enter Potion Shop',
        speaker: 'Alchemist Apothecary',
        dialogue: ['Stepping into the Glowing Potion Apothecary...'],
        activated: false,
      },
      {
        id: 'door_wardrobe_shop',
        x: 905,
        y: FLOOR_Y - 52,
        w: 36,
        h: 52,
        kind: 'wardrobe_door',
        label: 'Enter Wardrobe Shop',
        speaker: 'Atelier Sylvie',
        dialogue: ['Stepping into the Wardrobe Boutique...'],
        activated: false,
      },
      {
        id: 'door_weapons_shop',
        x: 1185,
        y: FLOOR_Y - 54,
        w: 44,
        h: 54,
        kind: 'weapons_door',
        label: 'Enter Grand Weapons Shop',
        speaker: 'Grand Solaris Armory',
        dialogue: ['Stepping inside the Grand Weapons Armory...'],
        activated: false,
      },
      {
        id: 'door_raider_guild',
        x: 1365,
        y: FLOOR_Y - 58,
        w: 44,
        h: 58,
        kind: 'raider_guild_door',
        label: 'Enter Dungeon Raider Guild Bastion (108 Dungeons & Ranks) [F]',
        speaker: 'Raider Guild Bastion',
        dialogue: ['Stepping inside the Obsidian Dungeon Raider Guild Bastion...'],
        activated: false,
      },
      {
        id: 'prop_stand_shrine',
        x: 1536,
        y: FLOOR_Y - 56,
        w: 48,
        h: 56,
        kind: 'stand_shrine',
        label: 'Enter Royal Stand Shrine · JJBA Stands [F]',
        speaker: 'Royal Stand Shrine',
        dialogue: ['Channel Star Stones from the Colosseum to awaken 10 JJBA Stands!'],
        activated: false,
      },
      {
        id: 'prop_hot_spring',
        x: 2630,
        y: FLOOR_Y - 46,
        w: 132,
        h: 46,
        kind: 'hot_spring',
        label: 'Soak in Solaris Hot Spring (Full HP + Boost)',
        speaker: 'Solaris Onsen',
        dialogue: ['Steaming mineral waters restore full vitality and power!'],
        activated: false,
      },
      {
        id: 'door_dueling_arena',
        x: 3285,
        y: FLOOR_Y - 92,
        w: 118,
        h: 92,
        kind: 'arena_door',
        label: 'Enter Solaris Grand Colosseum (Dueling Arena)',
        speaker: 'Colosseum Master',
        dialogue: ['Stepping inside the massive tiered Solaris Grand Colosseum!'],
        activated: false,
      },
      {
        id: 'prop_town_east_gate',
        x: 3760,
        y: FLOOR_Y - 92,
        w: 72,
        h: 92,
        kind: 'town_gate_out',
        label: 'Royal Town East Gate -> Outskirts Forest [F]',
        speaker: 'Solaris Gatehouse',
        dialogue: ['Passing through the Royal East Gate into the Outskirts Forest...'],
        activated: false,
      },
      ...SIDE_QUESTS.filter((q) => q.giverRealm === 'isekai_town').map((q) => ({
        id: `sq_npc_${q.id}`,
        x: q.giverX,
        y: FLOOR_Y - 34,
        w: 24,
        h: 34,
        kind: 'side_quest_npc' as const,
        label: `${q.giverName} (${q.giverRoleLabel}) · ${q.title} [F]`,
        speaker: q.giverName,
        dialogue: q.giverOpeningDialogue,
        activated: false,
        sideQuestId: q.id,
      })),
    ];
  }
  if (realm === 'outskirts_forest') {
    return [
      {
        id: 'prop_forest_return_town',
        x: 36,
        y: FLOOR_Y - 82,
        w: 58,
        h: 82,
        kind: 'outskirts_return_town',
        label: 'Royal Gate -> Return to Solaris Town [F]',
        speaker: 'Solaris Gatehouse',
        dialogue: ['Returning inside the fortified walls of Solaris Town...'],
        activated: false,
      },
      {
        id: 'prop_forest_cave_mouth',
        x: 2240,
        y: FLOOR_Y - 90,
        w: 112,
        h: 90,
        kind: 'outskirts_cave_entrance',
        label: 'Descend into Outskirts Blood-Vein Caves [F]',
        speaker: 'Cavern Descent',
        dialogue: ['Stepping down into the damp Outskirts Caves...'],
        activated: false,
      },
      ...SIDE_QUESTS.filter((q) => q.giverRealm === 'outskirts_forest').map((q) => ({
        id: `sq_npc_${q.id}`,
        x: q.giverX,
        y: FLOOR_Y - 34,
        w: 24,
        h: 34,
        kind: 'side_quest_npc' as const,
        label: `${q.giverName} (${q.giverRoleLabel}) · ${q.title} [F]`,
        speaker: q.giverName,
        dialogue: q.giverOpeningDialogue,
        activated: false,
        sideQuestId: q.id,
      })),
    ];
  }
  if (realm === 'outskirts_caves') {
    return [
      {
        id: 'prop_caves_exit_forest',
        x: 36,
        y: FLOOR_Y - 80,
        w: 44,
        h: 80,
        kind: 'outskirts_cave_exit',
        label: 'Climb Rope -> Outskirts Forest [F]',
        speaker: 'Cavern Ascent',
        dialogue: ['Climbing back out into the Outskirts Forest...'],
        activated: false,
      },
      ...SIDE_QUESTS.filter((q) => q.giverRealm === 'outskirts_caves').map((q) => ({
        id: `sq_npc_${q.id}`,
        x: q.giverX,
        y: FLOOR_Y - 34,
        w: 24,
        h: 34,
        kind: 'side_quest_npc' as const,
        label: `${q.giverName} (${q.giverRoleLabel}) · ${q.title} [F]`,
        speaker: q.giverName,
        dialogue: q.giverOpeningDialogue,
        activated: false,
        sideQuestId: q.id,
      })),
    ];
  }
  if (realm === 'dungeon_exterior') {
    return [
      {
        id: 'prop_exterior_caravan',
        x: 78,
        y: FLOOR_Y - 48,
        w: 92,
        h: 48,
        kind: 'caravan_rider',
        label: 'Caravan Rider Vance · Return / Travel',
        speaker: 'Caravan Rider Vance',
        dialogue: ['Ready to ride back to Solaris Town or elsewhere? Type your destination!'],
        activated: false,
      },
      {
        id: 'prop_dungeon_hole',
        x: 970,
        y: FLOOR_Y - 94,
        w: 132,
        h: 94,
        kind: 'dungeon_hole',
        label: 'Enter Massive Dark Rocky Dungeon Hole',
        speaker: 'Dungeon Abyss Mouth',
        dialogue: ['Descending into the endless dark rocky cavern...'],
        activated: false,
      },
    ];
  }
  if (realm === 'goblin_dungeon' || realm === 'demon_realm') {
    return [
      {
        id: `prop_exit_${realm}`,
        x: 34,
        y: FLOOR_Y - 72,
        w: 36,
        h: 72,
        kind: 'dungeon_exit_rope',
        label: 'Climb Outside to Forest & Caravan',
        speaker: 'Dungeon Exit Rope',
        dialogue: ['Climbing back out into the green grassy forest...'],
        activated: false,
      },
      {
        id: `prop_descend_${realm}`,
        x: 3630,
        y: FLOOR_Y - 78,
        w: 58,
        h: 78,
        kind: 'dungeon_descend_gate',
        label: 'Descend Endless Deeper Chamber',
        speaker: 'Abyssal Descent Gate',
        dialogue: ['Descending deeper into endless subterranean darkness...'],
        activated: false,
      },
    ];
  }
  if (realm === 'elf_kingdom') {
    return [
      {
        id: 'prop_elf_caravan_return',
        x: 56,
        y: FLOOR_Y - 48,
        w: 92,
        h: 48,
        kind: 'elf_caravan_return',
        label: 'Moon-Gate Caravan · Return to Solaris Town / Travel [F]',
        speaker: 'Caravan Rider Vance',
        dialogue: ['Ready to ride back down the Silver-Bough Highway to Solaris Town?'],
        activated: false,
      },
      {
        id: 'prop_elf_kaelen',
        x: 1165,
        y: FLOOR_Y - 38,
        w: 28,
        h: 38,
        kind: 'elf_swordsman_npc',
        label: 'Sword Saint Kaelen · Speak Before Dinner [F]',
        speaker: 'Sword Saint Kaelen',
        dialogue: [
          'So you are the foreign steel-knight the Herald sang poems about. Keep your blade loose beneath your cloak.',
          'The nobles clink star-wine glasses while something wet and toothed scratches beneath the banquet marble.',
        ],
        activated: false,
      },
      {
        id: 'prop_elf_banquet_table',
        x: 1650,
        y: FLOOR_Y - 44,
        w: 240,
        h: 44,
        kind: 'elf_banquet_table',
        label: 'Grand Royal Banquet Table · Begin Dinner Party / Toast [F]',
        speaker: 'Grand Banquet Pavilion',
        dialogue: ['Crystal chandeliers glitter over silver platters and star-wine decanters...'],
        activated: false,
      },
      {
        id: 'prop_elf_queen_dais',
        x: 2540,
        y: FLOOR_Y - 68,
        w: 58,
        h: 42,
        kind: 'elf_queen_dais',
        label: 'Queen Sylvaria · Sovereign Emerald Dais [F]',
        speaker: 'Queen Sylvaria',
        dialogue: [
          'Welcome to Aethelgard, Champion. Take your seat at the Grand Banquet Hall west of the dais whenever you are ready.',
        ],
        activated: false,
      },
    ];
  }
  if (realm === 'demon_king_arena') {
    return [
      {
        id: 'prop_exit_dk_arena',
        x: 34,
        y: FLOOR_Y - 72,
        w: 36,
        h: 72,
        kind: 'dungeon_exit_rope',
        label: 'Retreat Outside to Forest & Caravan',
        speaker: 'Abyssal Exit Rope',
        dialogue: ['Retreating outside to the grassy forest camp...'],
        activated: false,
      },
    ];
  }
  if (realm === 'isekai_guild') {
    return [
      {
        id: 'door_guild_exit',
        x: 34,
        y: FLOOR_Y - 52,
        w: 32,
        h: 52,
        kind: 'town_exit_door',
        label: 'Exit to Solaris Town',
        speaker: 'Town Door',
        dialogue: ['Returning to sunny Solaris Town...'],
        activated: false,
      },
      {
        id: 'prop_guild_bar',
        x: 92,
        y: FLOOR_Y - 30,
        w: 146,
        h: 30,
        kind: 'guild_bar',
        label: 'Guild Tavern Bar',
        speaker: 'Barkeep Goro',
        dialogue: ['Fresh oak-cask ale keeps every F-Rank adventurer swinging strong! Cheers!'],
        activated: false,
      },
      {
        id: 'prop_guild_reception',
        x: 332,
        y: FLOOR_Y - 36,
        w: 62,
        h: 36,
        kind: 'guild_reception',
        label: 'Floor 1 Reception Desk (F–C)',
        speaker: 'Receptionist Luna',
        dialogue: ['Opening Floor 1 Guild Contracts & Party Invites...'],
        activated: false,
      },
      {
        id: 'prop_guild_stairs',
        x: 432,
        y: FLOOR_Y - 78,
        w: 58,
        h: 78,
        kind: 'guild_stairs',
        label: '2nd Floor Grand Staircase (B+ Rank)',
        speaker: 'Guild Gatekeeper',
        dialogue: ['Ascending to the High-Rank 2nd Floor...'],
        activated: false,
      },
      {
        id: 'prop_guild_floor2_reception',
        x: 724,
        y: GUILD_FLOOR2_Y - 36,
        w: 64,
        h: 36,
        kind: 'guild_floor2_reception',
        label: '2nd Floor Command Desk (B–S)',
        speaker: 'Commander Aerin',
        dialogue: ['Opening High-Rank Escort & Demon King Expeditions...'],
        activated: false,
      },
    ];
  }
  if (realm === 'isekai_wardrobe') {
    return [
      {
        id: 'door_wardrobe_exit',
        x: 34,
        y: FLOOR_Y - 52,
        w: 32,
        h: 52,
        kind: 'town_exit_door',
        label: 'Exit to Solaris Town',
        speaker: 'Town Door',
        dialogue: ['Returning to sunny Solaris Town...'],
        activated: false,
      },
      {
        id: 'prop_wardrobe_counter',
        x: 320,
        y: FLOOR_Y - 36,
        w: 66,
        h: 36,
        kind: 'wardrobe_counter',
        label: 'Browse Wardrobe Outfits',
        speaker: 'Tailor Sylvie',
        dialogue: ['Opening Medieval Isekai Wardrobe Catalog...'],
        activated: false,
      },
    ];
  }
  if (realm === 'isekai_potion_shop') {
    return [
      {
        id: 'door_potion_exit',
        x: 34,
        y: FLOOR_Y - 52,
        w: 32,
        h: 52,
        kind: 'town_exit_door',
        label: 'Exit to Solaris Town',
        speaker: 'Town Door',
        dialogue: ['Returning to sunny Solaris Town...'],
        activated: false,
      },
      {
        id: 'prop_potion_counter',
        x: 372,
        y: FLOOR_Y - 36,
        w: 72,
        h: 36,
        kind: 'potion_counter',
        label: 'Buy HP & Damage-Boost Potions',
        speaker: 'Alchemist Nyx',
        dialogue: ['Opening Glowing Elixir Apothecary...'],
        activated: false,
      },
    ];
  }
  if (realm === 'isekai_weapons_shop') {
    return [
      {
        id: 'door_weapons_exit',
        x: 34,
        y: FLOOR_Y - 52,
        w: 32,
        h: 52,
        kind: 'town_exit_door',
        label: 'Exit to Solaris Town',
        speaker: 'Town Door',
        dialogue: ['Returning to sunny Solaris Town...'],
        activated: false,
      },
      {
        id: 'prop_weapons_counter',
        x: 1005,
        y: FLOOR_Y - 38,
        w: 84,
        h: 38,
        kind: 'weapons_counter',
        label: 'Browse & Forge Special Weapons',
        speaker: 'Master Smith Borin',
        dialogue: ['Opening Grand Armory Weapon Rack...'],
        activated: false,
      },
    ];
  }
  if (realm === 'dueling_arena') {
    return [
      {
        id: 'door_arena_exit',
        x: 32,
        y: FLOOR_Y - 54,
        w: 34,
        h: 54,
        kind: 'town_exit_door',
        label: 'Exit Colosseum to Solaris Town',
        speaker: 'Arena Gate',
        dialogue: ['Walking out of Solaris Grand Dueling Arena...'],
        activated: false,
      },
      {
        id: 'prop_arena_board',
        x: 155,
        y: FLOOR_Y - 52,
        w: 68,
        h: 52,
        kind: 'arena_board',
        label: 'Choose Jujutsu Kaisen Opponent (Matched Stats · OP AI)',
        speaker: 'Colosseum Matchmaker Herald',
        dialogue: ['Select a Jujutsu Kaisen sorcerer or curse user to duel at equal stats!'],
        activated: false,
      },
    ];
  }
  return [];
}

function makeEnemy(
  id: string,
  archetype: EnemyArchetype,
  name: string,
  x: number,
  y: number,
  hp: number,
  w: number,
  h: number,
  biome: BiomeId,
  rewardGold: number,
  attackDamage: number,
  isDungeonBoss = false,
  sizeScale = 1,
  darkness = 0,
  variantStyle?: EnemyState['variantStyle'],
): EnemyState {
  const finalHp = isDungeonBoss ? Math.round(hp * 2) : hp;
  const scaledW = Math.round(w * sizeScale);
  const scaledH = Math.round(h * sizeScale);
  const adjustedY = y - (scaledH - h);
  return {
    id,
    archetype,
    name,
    x,
    y: adjustedY,
    vx: 0,
    vy: 0,
    w: scaledW,
    h: scaledH,
    hp: finalHp,
    maxHp: finalHp,
    facing: -1,
    state: 'patrol',
    stateTimer: 0.45,
    patrolOriginX: x,
    hitFlash: 0,
    biome,
    rewardGold,
    koTimer: 0,
    attackDamage,
    isDungeonBoss,
    sizeScale: Number(sizeScale.toFixed(2)),
    darkness: Number(Math.min(0.92, Math.max(0, darkness)).toFixed(2)),
    variantStyle,
  };
}

export function getEndlessDistanceScaling(distanceOrSectorX: number, depth = 1): {
  sizeScale: number;
  strengthMult: number;
  darkness: number;
} {
  const sectorProgress = Math.max(0, distanceOrSectorX / DUNGEON_SECTOR_WIDTH);
  const depthProgress = Math.max(0, depth - 1);
  const sizeScale = Math.min(2.25, 1 + sectorProgress * 0.14 + depthProgress * 0.18);
  const strengthMult = (1 + sectorProgress * 0.36) * (1 + depthProgress * 0.45);
  const darkness = Math.min(0.88, sectorProgress * 0.15 + depthProgress * 0.18);
  return {
    sizeScale: Number(sizeScale.toFixed(2)),
    strengthMult: Number(strengthMult.toFixed(2)),
    darkness: Number(darkness.toFixed(2)),
  };
}

export function createDungeonSectorEnemies(
  realm: 'goblin_dungeon' | 'demon_realm',
  missionId: GuildMissionId,
  sectorIdx: number,
  depth = 1,
  bossesDefeated = 0,
): EnemyState[] {
  const startX = Math.max(220, sectorIdx * DUNGEON_SECTOR_WIDTH + 90);
  const endX = (sectorIdx + 1) * DUNGEON_SECTOR_WIDTH - 90;
  const span = Math.max(240, endX - startX);
  const count = realm === 'goblin_dungeon' ? 6 : 6;
  const list: EnemyState[] = [];
  const tier = missionId === 'f_goblin_warren' ? 1 : missionId === 'e_hobgoblin_caves' ? 2 : 3;

  for (let i = 0; i < count; i++) {
    const x = Math.round(startX + (i / Math.max(1, count - 1)) * span);
    const { sizeScale, strengthMult, darkness } = getEndlessDistanceScaling(x, depth);

    if (realm === 'goblin_dungeon') {
      const isHob = i % 2 === 1 || sectorIdx >= 2;
      if (isHob) {
        list.push(
          makeEnemy(
            `gob_s${sectorIdx}_d${depth}_${i}`,
            'hobgoblin',
            sectorIdx >= 2 || depth > 1 ? `Abyss Hobgoblin S${sectorIdx + 1}` : 'Rocky Cavern Hobgoblin',
            x,
            FLOOR_Y - 30,
            Math.round((74 + tier * 24) * strengthMult * 1.5),
            22,
            30,
            'castle',
            Math.round((16 + tier * 5) * strengthMult),
            Math.round((12 + tier * 3) * strengthMult),
            false,
            sizeScale,
            darkness,
          ),
        );
      } else {
        list.push(
          makeEnemy(
            `gob_s${sectorIdx}_d${depth}_${i}`,
            'goblin_normal',
            sectorIdx >= 2 || depth > 1 ? `Shadow Goblin S${sectorIdx + 1}` : 'Cavern Goblin',
            x,
            FLOOR_Y - 22,
            Math.round((38 + tier * 12) * strengthMult * 1.5),
            17,
            22,
            'castle',
            Math.round((10 + tier * 3) * strengthMult),
            Math.round((8 + tier * 2) * strengthMult),
            false,
            sizeScale,
            darkness,
          ),
        );
      }
    } else {
      const archetypes: { arch: EnemyArchetype; name: string; yOff: number; hp: number; w: number; h: number; dmg: number }[] = [
        { arch: 'demon_tank', name: 'Obsidian Demon Tank', yOff: 32, hp: 165, w: 24, h: 32, dmg: 22 },
        { arch: 'demon_lightning', name: 'Tempest Demon Striker', yOff: 28, hp: 110, w: 20, h: 28, dmg: 18 },
        { arch: 'demon_succubus', name: 'Crimson Abyss Succubus', yOff: 68, hp: 96, w: 20, h: 28, dmg: 16 },
      ];
      const s = archetypes[(i + sectorIdx) % archetypes.length];
      list.push(
        makeEnemy(
          `dem_s${sectorIdx}_d${depth}_${i}`,
          s.arch,
          sectorIdx >= 2 || depth > 1 ? `Abyssal ${s.name}` : s.name,
          x,
          FLOOR_Y - s.yOff,
          Math.round(s.hp * strengthMult * 1.5),
          s.w,
          s.h,
          'volcano',
          Math.round(34 * strengthMult),
          Math.round(s.dmg * strengthMult),
          false,
          sizeScale,
          darkness,
        ),
      );
    }
  }

  // Every 2nd endless sector (or Depth >= 2 sector 1+) spawns a huge Darkened Dungeon Warlord!
  if ((sectorIdx >= 1 && sectorIdx % 2 === 1) || (depth >= 2 && sectorIdx === 1)) {
    const bossX = startX + Math.round(span * 0.88);
    list.push(createDungeonDeepBoss(realm, Math.max(depth, sectorIdx + 1), bossX, bossesDefeated));
  }
  return list;
}

export function createGoblinDungeonWave(
  missionId: GuildMissionId,
  waveIdx = 0,
  depth = 1,
  bossesDefeated = 0,
): EnemyState[] {
  const tier = missionId === 'f_goblin_warren' ? 1 : missionId === 'e_hobgoblin_caves' ? 2 : 3;
  const count = (tier === 1 ? 16 : tier === 2 ? 19 : 22) + Math.min(8, (depth - 1) * 2);
  const list: EnemyState[] = [];
  for (let i = 0; i < count; i++) {
    const isHob = i % 3 === 1 || (tier >= 2 && i % 2 === 1);
    const x = 250 + Math.round((i / Math.max(1, count - 1)) * 2400) + ((waveIdx + i) % 2) * 18;
    const { sizeScale, strengthMult, darkness } = getEndlessDistanceScaling(x, depth);
    if (isHob) {
      list.push(
        makeEnemy(
          `gob_${tier}_${depth}_${waveIdx}_${i}`,
          'hobgoblin',
          depth > 1 || i > count * 0.65 ? `Abyssal Hobgoblin` : 'Rocky Cavern Hobgoblin',
          x,
          FLOOR_Y - 30,
          Math.round((72 + tier * 24) * strengthMult * 1.5),
          22,
          30,
          'castle',
          Math.round((16 + tier * 5) * strengthMult),
          Math.round((12 + tier * 3) * strengthMult),
          false,
          sizeScale,
          darkness,
        ),
      );
    } else {
      list.push(
        makeEnemy(
          `gob_${tier}_${depth}_${waveIdx}_${i}`,
          'goblin_normal',
          depth > 1 || i > count * 0.65 ? `Shadow Goblin` : 'Cavern Goblin',
          x,
          FLOOR_Y - 22,
          Math.round((36 + tier * 12) * strengthMult * 1.5),
          17,
          22,
          'castle',
          Math.round((9 + tier * 3) * strengthMult),
          Math.round((8 + tier * 2) * strengthMult),
          false,
          sizeScale,
          darkness,
        ),
      );
    }
  }
  if (depth >= 2) {
    list.push(createDungeonDeepBoss('goblin_dungeon', depth, 2550, bossesDefeated));
  }
  return list;
}

export function createDungeonDeepBoss(
  realm: RealmMode,
  depth: number,
  spawnX = 2550,
  bossesDefeated = 0,
): EnemyState {
  const { sizeScale, strengthMult, darkness } = getEndlessDistanceScaling(spawnX, depth);
  const defeatedMult = Math.pow(1.8, Math.max(0, bossesDefeated));
  const bossScale = Math.max(1.38, sizeScale * 1.18);
  const bossDark = Math.min(0.9, Math.max(0.32, darkness + 0.18));
  if (realm === 'demon_realm') {
    return makeEnemy(
      `deep_boss_dem_${depth}_${spawnX}`,
      'demon_tank',
      `Depth ${depth} Caldera Demon Overlord`,
      spawnX,
      FLOOR_Y - 32,
      Math.round(760 * strengthMult * defeatedMult),
      26,
      32,
      'volcano',
      Math.round(120 * strengthMult),
      Math.round(28 * strengthMult * defeatedMult),
      true,
      bossScale,
      bossDark,
    );
  }
  return makeEnemy(
    `deep_boss_gob_${depth}_${spawnX}`,
    'hobgoblin',
    `Depth ${depth} Granite Hobgoblin Warlord`,
    spawnX,
    FLOOR_Y - 30,
    Math.round(520 * strengthMult * defeatedMult),
    24,
    30,
    'castle',
    Math.round(85 * strengthMult),
    Math.round(22 * strengthMult * defeatedMult),
    true,
    bossScale,
    bossDark,
  );
}

export function createCarriageEscortInit(variant = 0): CarriageEscortState {
  return {
    x: 150,
    y: FLOOR_Y - 46,
    hp: 360,
    maxHp: 360,
    progress: 0,
    speed: 24,
    wheelPhase: 0,
    hitFlash: 0,
    wavesSpawned: 0,
    variant,
  };
}

const BANDIT_FACTIONS = [
  {
    fighterName: 'Crimson Brigand Fighter',
    archerName: 'Crimson Crossbow Raider',
    assassinName: 'Black-Cloak Cutthroat',
    pyroName: 'Cinder-Hood Pyromancer',
    bruteName: 'Iron-Buckler Highway Brute',
    fighterHp: 85,
    archerHp: 58,
    assassinHp: 64,
    pyroHp: 68,
    bruteHp: 138,
    fighterDmg: 15,
    archerDmg: 12,
    assassinDmg: 18,
    pyroDmg: 19,
    bruteDmg: 22,
  },
  {
    fighterName: 'Shadow-Cloak Marauder',
    archerName: 'Venom Longbow Sniper',
    assassinName: 'Nightblade Ambush Rogue',
    pyroName: 'Blaze-Sigil Warlock',
    bruteName: 'Juggernaut Shield Captain',
    fighterHp: 102,
    archerHp: 72,
    assassinHp: 78,
    pyroHp: 84,
    bruteHp: 168,
    fighterDmg: 18,
    archerDmg: 15,
    assassinDmg: 21,
    pyroDmg: 22,
    bruteDmg: 25,
  },
  {
    fighterName: 'Ironclad Vanguard Captain',
    archerName: 'Siege-Bolt Sharpshooter',
    assassinName: 'Mirage Fang Assassin',
    pyroName: 'Inferno Crimson Mage',
    bruteName: 'Colossal Brigand Enforcer',
    fighterHp: 124,
    archerHp: 84,
    assassinHp: 94,
    pyroHp: 98,
    bruteHp: 198,
    fighterDmg: 21,
    archerDmg: 17,
    assassinDmg: 24,
    pyroDmg: 25,
    bruteDmg: 29,
  },
];

export function createBanditWave(
  carriageX: number,
  waveIdx: number,
  escortVariant = 0,
): EnemyState[] {
  const faction = BANDIT_FACTIONS[Math.abs(escortVariant) % BANDIT_FACTIONS.length];
  const list: EnemyState[] = [];
  // Coordinated Pincer Bandit Ambush: Front Brute Tank, Flank Assassins, Ranged Crossbow Snipers & Fire-Bomb Pyromancer!
  const roster: { arch: EnemyArchetype; offset: number; name: string; hp: number; w: number; h: number; dmg: number }[] = [
    {
      arch: 'bandit_brute',
      offset: 175,
      name: faction.bruteName,
      hp: faction.bruteHp,
      w: 24,
      h: 32,
      dmg: faction.bruteDmg,
    },
    {
      arch: 'bandit_fighter',
      offset: 225,
      name: faction.fighterName,
      hp: faction.fighterHp,
      w: 18,
      h: 26,
      dmg: faction.fighterDmg,
    },
    {
      arch: 'bandit_assassin',
      offset: -145,
      name: faction.assassinName,
      hp: faction.assassinHp,
      w: 18,
      h: 25,
      dmg: faction.assassinDmg,
    },
    {
      arch: 'bandit_archer',
      offset: 285,
      name: faction.archerName,
      hp: faction.archerHp,
      w: 18,
      h: 26,
      dmg: faction.archerDmg,
    },
    {
      arch: 'bandit_pyromancer',
      offset: waveIdx >= 1 ? -190 : 340,
      name: faction.pyroName,
      hp: faction.pyroHp,
      w: 18,
      h: 27,
      dmg: faction.pyroDmg,
    },
  ];
  roster.forEach((spec, i) => {
    const sx = Math.max(36, Math.min(1080, carriageX + spec.offset));
    list.push(
      makeEnemy(
        `bandit_${escortVariant}_${waveIdx}_${i}`,
        spec.arch,
        spec.name,
        sx,
        FLOOR_Y - spec.h,
        Math.round(spec.hp * 1.5),
        spec.w,
        spec.h,
        'forest',
        26 + escortVariant * 8 + (spec.arch === 'bandit_brute' ? 14 : 0),
        spec.dmg,
      ),
    );
  });
  return list;
}

export function createDemonRealmWave(depth = 1, bossesDefeated = 0): EnemyState[] {
  const archetypes: { arch: EnemyArchetype; name: string; yOff: number; hp: number; w: number; h: number; dmg: number }[] = [
    { arch: 'demon_tank', name: 'Obsidian Demon Tank', yOff: 32, hp: 165, w: 24, h: 32, dmg: 22 },
    { arch: 'demon_lightning', name: 'Tempest Demon Striker', yOff: 28, hp: 110, w: 20, h: 28, dmg: 18 },
    { arch: 'demon_succubus', name: 'Crimson Abyss Succubus', yOff: 68, hp: 96, w: 20, h: 28, dmg: 16 },
  ];
  const count = 18 + Math.min(6, (depth - 1) * 2);
  const list: EnemyState[] = [];
  for (let i = 0; i < count; i++) {
    const s = archetypes[i % archetypes.length];
    const x = 250 + Math.round((i / Math.max(1, count - 1)) * 2400);
    const { sizeScale, strengthMult, darkness } = getEndlessDistanceScaling(x, depth);
    list.push(
      makeEnemy(
        `dem_${depth}_${i}`,
        s.arch,
        depth > 1 || i > count * 0.65 ? `Abyss ${s.name}` : s.name,
        x,
        FLOOR_Y - s.yOff,
        Math.round(s.hp * strengthMult * 1.5),
        s.w,
        s.h,
        'volcano',
        Math.round(34 * strengthMult),
        Math.round(s.dmg * strengthMult),
        false,
        sizeScale,
        darkness,
      ),
    );
  }
  if (depth >= 2) {
    list.push(createDungeonDeepBoss('demon_realm', depth, 2550, bossesDefeated));
  }
  return list;
}

export function createDemonKingAllies(): AlliedNpc[] {
  return [
    {
      id: 'ally_harold',
      name: 'Vanguard Captain Harold',
      role: 'knight',
      x: 112,
      y: FLOOR_Y - 26,
      vx: 0,
      facing: 1,
      hp: 420,
      maxHp: 420,
      attackCooldown: 0.4,
      walkCycle: 0,
      hitFlash: 0,
      armorColor: '#e2e8f0',
      cloakColor: '#1d4ed8',
      weaponColor: '#fbbf24',
    },
    {
      id: 'ally_elise',
      name: 'Tempest Lancer Elise',
      role: 'lancer',
      x: 68,
      y: FLOOR_Y - 26,
      vx: 0,
      facing: 1,
      hp: 340,
      maxHp: 340,
      attackCooldown: 0.6,
      walkCycle: 1.4,
      hitFlash: 0,
      armorColor: '#bae6fd',
      cloakColor: '#059669',
      weaponColor: '#38bdf8',
    },
    {
      id: 'ally_aria',
      name: 'Arch-Cleric Aria',
      role: 'mage',
      x: 42,
      y: FLOOR_Y - 26,
      vx: 0,
      facing: 1,
      hp: 300,
      maxHp: 300,
      attackCooldown: 0.9,
      healCooldown: 3.5,
      walkCycle: 2.2,
      hitFlash: 0,
      armorColor: '#fef3c7',
      cloakColor: '#db2777',
      weaponColor: '#fde047',
    },
  ];
}

/**
 * Stage-specific Manhwa-inspired companion legions (Stages 1-3 for A-Rank, 1-17 for S-Rank Pantheon).
 */
export function createDemonKingStageMinions(stage: number, isSeventeenMode = false): EnemyState[] {
  if (!isSeventeenMode) {
    if (stage === 1) {
      return [
        makeEnemy('dk1_m0', 'demon_tank', 'Crimson Ash Bone-Goliath', 240, FLOOR_Y - 32, Math.round(145 * 1.5), 24, 32, 'volcano', 36, 17, false, 1.12, 0.14, 'crimson_ash'),
        makeEnemy('dk1_m1', 'gargoyle_charger', 'Hellbound Obsidian Gargoyle', 330, FLOOR_Y - 26, Math.round(98 * 1.5), 20, 26, 'volcano', 28, 15, false, 1.08, 0.12, 'crimson_ash'),
        makeEnemy('dk1_m2', 'cultist_mage', 'Ashen Blood-Chant Warlock', 410, FLOOR_Y - 26, Math.round(86 * 1.5), 20, 26, 'volcano', 26, 14, false, 1.04, 0.12, 'crimson_ash'),
      ];
    }
    if (stage === 2) {
      return [
        makeEnemy('dk2_m0', 'demon_succubus', 'Abyssal Frost-Hex Seraph', 250, FLOOR_Y - 68, Math.round(128 * 1.5), 20, 28, 'volcano', 42, 18, false, 1.12, 0.22, 'frost_seraph'),
        makeEnemy('dk2_m1', 'cursed_armor', 'Frostbound Fallen Paladin', 350, FLOOR_Y - 28, Math.round(165 * 1.5), 22, 28, 'volcano', 45, 20, false, 1.18, 0.25, 'frost_seraph'),
        makeEnemy('dk2_m2', 'phantom_wisp', 'Glacial Soul-Banshee', 440, FLOOR_Y - 56, Math.round(96 * 1.5), 20, 26, 'volcano', 34, 16, false, 1.08, 0.2, 'frost_seraph'),
      ];
    }
    return [
      makeEnemy('dk3_m0', 'demon_lightning', 'Void-Eclipse Thunder Assassin', 240, FLOOR_Y - 28, Math.round(142 * 1.5), 20, 28, 'volcano', 50, 21, false, 1.16, 0.36, 'void_eclipse'),
      makeEnemy('dk3_m1', 'demon_tank', 'Eclipse Shadow-Monarch Sentinel', 340, FLOOR_Y - 32, Math.round(210 * 1.5), 24, 32, 'volcano', 60, 23, false, 1.26, 0.42, 'void_eclipse'),
      makeEnemy('dk3_m2', 'demon_succubus', 'Astral Void-Rift Enchantress', 435, FLOOR_Y - 68, Math.round(134 * 1.5), 20, 28, 'volcano', 48, 19, false, 1.14, 0.34, 'void_eclipse'),
    ];
  }

  const companionSpecs: { name: string; arch: EnemyArchetype; variant: 'crimson_ash' | 'frost_seraph' | 'void_eclipse'; fly?: boolean }[] = [
    { name: 'Marshal Igris & Shadow Beru', arch: 'cursed_armor', variant: 'void_eclipse' },
    { name: 'Fourth Wall Dokkaebi Bihyung', arch: 'phantom_wisp', variant: 'void_eclipse', fly: true },
    { name: 'Sylvie Aether Draconic Kin', arch: 'demon_succubus', variant: 'crimson_ash', fly: true },
    { name: 'Overgeared Mythril Golem God-Hand', arch: 'demon_tank', variant: 'crimson_ash' },
    { name: 'Red Bari Shinsu Eel Guardian', arch: 'phantom_wisp', variant: 'frost_seraph', fly: true },
    { name: 'Floor-Boss Goblin-Sword Wraith', arch: 'demon_lightning', variant: 'crimson_ash' },
    { name: 'Hades Undead Viper Chirpy', arch: 'gargoyle_charger', variant: 'void_eclipse' },
    { name: 'Thanatos Chains-of-Tartarus Sentinel', arch: 'cursed_armor', variant: 'void_eclipse' },
    { name: 'Blue Lapis Dragon Hatchling', arch: 'demon_succubus', variant: 'frost_seraph', fly: true },
    { name: 'Vermouth Lionheart Phantom Guard', arch: 'cursed_armor', variant: 'crimson_ash' },
    { name: 'Plum-Blossom Sword Disciple', arch: 'demon_lightning', variant: 'crimson_ash' },
    { name: 'Cheon Ma Nanomachine Drone', arch: 'phantom_wisp', variant: 'void_eclipse', fly: true },
    { name: 'Frankenstein Dark-Spear Vassal', arch: 'cultist_mage', variant: 'void_eclipse' },
    { name: 'Nastika Vritra Chaos Wyrm', arch: 'demon_tank', variant: 'crimson_ash' },
    { name: 'Lucky-Coin Golden Armor Clone', arch: 'cursed_armor', variant: 'crimson_ash' },
    { name: 'Fallen Sword-Hero Berserker', arch: 'gargoyle_charger', variant: 'crimson_ash' },
    { name: 'Nine-Circle Eclipse Familiar', arch: 'cultist_mage', variant: 'void_eclipse' },
  ];
  const spec = companionSpecs[(Math.max(1, stage) - 1) % companionSpecs.length];
  const scaleHp = Math.round((260 + stage * 36) * 0.5);
  const scaleAtk = 18 + Math.floor(stage * 1.4);
  return [
    makeEnemy(
      `dk17_${stage}_m0`,
      spec.arch,
      spec.name,
      255,
      spec.fly ? FLOOR_Y - 62 : FLOOR_Y - 28,
      scaleHp,
      22,
      28,
      'volcano',
      45 + stage * 4,
      scaleAtk,
      false,
      1.1 + stage * 0.015,
      0.18 + stage * 0.015,
      spec.variant,
    ),
    makeEnemy(
      `dk17_${stage}_m1`,
      stage % 2 === 0 ? 'demon_lightning' : 'cultist_mage',
      `${spec.name.split(' ')[0]} Retainer`,
      365,
      FLOOR_Y - 28,
      Math.round(scaleHp * 0.78),
      20,
      26,
      'volcano',
      35 + stage * 3,
      Math.max(16, scaleAtk - 3),
      false,
      1.04,
      0.16,
      spec.variant,
    ),
  ];
}

export function createThreeDemonKingsInit(
  _foughtIsekaiEnemies: EnemyArchetype[],
  bossesDefeated = 0,
): { demonKings: DemonKingEntity[]; minions: EnemyState[]; allies: AlliedNpc[] } {
  const defeatedMult = Math.pow(1.8, Math.max(0, bossesDefeated));
  const demonKings: DemonKingEntity[] = [
    {
      id: 'dk_1',
      index: 1,
      totalStages: 3,
      name: 'Demon King Malakor',
      title: 'Grand Duke of Crimson Ash',
      manhwaSource: 'A-Rank Citadel Prologue',
      sizeScale: 1.05,
      faceStyle: 'horned_emperor',
      weaponName: 'Ashen Calamity Claymore',
      weaponStyle: 'greatsword',
      weaponColor: '#f59e0b',
      armorColor: '#7f1d1d',
      capeColor: '#450a0a',
      companionName: 'Crimson Ash Bone-Goliath',
      skills: ['Abyssal Purple Flame Pillars', 'Crimson Caldera Eruption', 'Duke Ashen Cleave'],
      x: 410,
      y: FLOOR_Y - 46,
      vx: 0,
      vy: 0,
      w: 32,
      h: 46,
      hp: Math.round(760 * 2 * defeatedMult),
      maxHp: Math.round(760 * 2 * defeatedMult),
      facing: -1,
      hitFlash: 0,
      purpleFlameTimer: 1.5,
      castIndex: 0,
      activeSkillBanner: null,
      activeSkillTimer: 0,
      primaryColor: '#dc2626',
      hornColor: '#f59e0b',
      auraColor: '#fb7185',
      defeated: false,
      damageMult: defeatedMult,
    },
    {
      id: 'dk_2',
      index: 2,
      totalStages: 3,
      name: 'Demon King Vaelgor',
      title: 'Arch-Seraph of Abyssal Frost',
      manhwaSource: 'A-Rank Citadel Gatekeeper',
      sizeScale: 1.12,
      faceStyle: 'cracked_halo',
      weaponName: 'Permafrost Halberd',
      weaponStyle: 'halberd',
      weaponColor: '#7dd3fc',
      armorColor: '#1e3a8a',
      capeColor: '#172554',
      companionName: 'Abyssal Frost-Hex Seraph',
      skills: ['Hellfire Amethyst Meteor Rain', 'Absolute Glacier Prison', 'Fallen Seraph Dive'],
      x: 430,
      y: FLOOR_Y - 48,
      vx: 0,
      vy: 0,
      w: 32,
      h: 48,
      hp: Math.round(860 * 2 * defeatedMult),
      maxHp: Math.round(860 * 2 * defeatedMult),
      facing: -1,
      hitFlash: 0,
      purpleFlameTimer: 1.65,
      castIndex: 1,
      activeSkillBanner: null,
      activeSkillTimer: 0,
      primaryColor: '#1d4ed8',
      hornColor: '#7dd3fc',
      auraColor: '#38bdf8',
      defeated: false,
      damageMult: defeatedMult,
    },
    {
      id: 'dk_3',
      index: 3,
      totalStages: 3,
      name: 'Demon King Zarakiel',
      title: 'Supreme Sovereign of the Void Eclipse',
      manhwaSource: 'A-Rank Citadel Throne',
      sizeScale: 1.2,
      faceStyle: 'void_mask',
      weaponName: 'Eclipse Scythe',
      weaponStyle: 'scythe',
      weaponColor: '#c084fc',
      armorColor: '#0f172a',
      capeColor: '#3b0764',
      companionName: 'Eclipse Shadow-Monarch Sentinel',
      skills: ['Demonic Violet Flame Nova', 'Eclipse Void Judgment', 'Sovereign World Slash'],
      x: 445,
      y: FLOOR_Y - 52,
      vx: 0,
      vy: 0,
      w: 36,
      h: 52,
      hp: Math.round(980 * 2 * defeatedMult),
      maxHp: Math.round(980 * 2 * defeatedMult),
      facing: -1,
      hitFlash: 0,
      purpleFlameTimer: 1.8,
      castIndex: 2,
      activeSkillBanner: null,
      activeSkillTimer: 0,
      primaryColor: '#0f172a',
      hornColor: '#fbbf24',
      auraColor: '#c084fc',
      defeated: false,
      damageMult: defeatedMult,
    },
  ];

  const minions = createDemonKingStageMinions(1, false);
  const allies = createDemonKingAllies();

  return { demonKings, minions, allies };
}

interface ManhwaDemonKingBlueprint {
  name: string;
  title: string;
  manhwaSource: string;
  sizeScale: number;
  faceStyle: DemonKingFaceStyle;
  weaponName: string;
  weaponStyle: DemonKingWeaponStyle;
  weaponColor: string;
  primaryColor: string;
  armorColor: string;
  hornColor: string;
  auraColor: string;
  capeColor: string;
  companionName: string;
  skills: [string, string, string];
  specialAbility: DemonKingSpecialAbility;
  specialDesc: string;
  hpBase: number;
  shieldBase?: number;
}

export const SEVENTEEN_MANHWA_DEMON_KINGS: ManhwaDemonKingBlueprint[] = [
  {
    name: 'Ashborn, Demon King of White Flames',
    title: 'True Shadow Monarch of the Abyss',
    manhwaSource: 'Solo Leveling / Baran & Ashborn',
    sizeScale: 1.32,
    faceStyle: 'monarch_glow',
    weaponName: 'Kamish-Wrath Short Daggers & Baran Twin Blades',
    weaponStyle: 'dual_daggers',
    weaponColor: '#a855f7',
    primaryColor: '#312e81',
    armorColor: '#0f172a',
    hornColor: '#c084fc',
    auraColor: '#7c3aed',
    capeColor: '#1e1b4b',
    companionName: 'Marshal Igris & Shadow Beru',
    skills: ['Monarch Domain: Shadow Arise', 'White Flame Breath', 'Ruler Authority Crush'],
    specialAbility: 'shadow_arise',
    specialDesc: 'ARISE: Summons Shadow Soldiers mid-battle when cooldown expires!',
    hpBase: 520,
  },
  {
    name: 'Kim Dokja, Demon King of Salvation',
    title: 'Seventy-Third Demon King of the Scenarios',
    manhwaSource: 'Omniscient Reader’s Viewpoint',
    sizeScale: 1.0,
    faceStyle: 'void_mask',
    weaponName: 'Unbroken Faith Blade of Pure Starlight',
    weaponStyle: 'katana',
    weaponColor: '#e0f2fe',
    primaryColor: '#f8fafc',
    armorColor: '#1e293b',
    hornColor: '#60a5fa',
    auraColor: '#38bdf8',
    capeColor: '#f1f5f9',
    companionName: 'Dokkaebi Bihyung',
    skills: ['Electrification Way of the Wind', 'Fourth Wall: Probability Null', 'Star-Stream Salvation Cut'],
    specialAbility: 'spatial_cut',
    specialDesc: 'FOURTH WALL: Tears dimensional starlight blades behind the player!',
    hpBase: 550,
  },
  {
    name: 'Cadell, Obsidian Scythe Sovereign',
    title: 'Supreme Vritra-Blood Scythe',
    manhwaSource: 'The Beginning After The End',
    sizeScale: 1.18,
    faceStyle: 'horned_emperor',
    weaponName: 'Soulfire Obsidian Soul-Scythe',
    weaponStyle: 'scythe',
    weaponColor: '#4c1d95',
    primaryColor: '#18181b',
    armorColor: '#27272a',
    hornColor: '#f43f5e',
    auraColor: '#c026d3',
    capeColor: '#3f0f2e',
    companionName: 'Draconic Aether Kin',
    skills: ['Soulfire Hell-Black Incineration', 'Decay Mana Extinction', 'Phase-Shift Void Scythe'],
    specialAbility: 'soul_burn',
    specialDesc: 'SOULFIRE DECAY: Ignites lingering black-violet decay zones under feet!',
    hpBase: 590,
  },
  {
    name: 'Grid-Overgeared, Divine Forge Demon King',
    title: 'Mythic Blacksmith Sovereign of Belial',
    manhwaSource: 'Overgeared',
    sizeScale: 1.24,
    faceStyle: 'scarred_marshal',
    weaponName: 'Failure Greatsword & Belial Flame Staff',
    weaponStyle: 'greatsword',
    weaponColor: '#fbbf24',
    primaryColor: '#b45309',
    armorColor: '#451a03',
    hornColor: '#fde047',
    auraColor: '#f59e0b',
    capeColor: '#78350f',
    companionName: 'Mythril Overgeared God-Hands',
    skills: ['100,000 Army Massacre Sword', 'Linked Kill Wave Pinnacle', 'Belial Black-Gold Smelting'],
    specialAbility: 'estate_bastion',
    specialDesc: 'VALHALLA ARMOR: Regenerates a forged Mithril Barrier Shield mid-fight!',
    hpBase: 640,
    shieldBase: 140,
  },
  {
    name: 'White, Slayer of the Five Demon Blades',
    title: 'HoAQ Fallen Hoaquin Demon Sovereign',
    manhwaSource: 'Tower of God',
    sizeScale: 1.14,
    faceStyle: 'stitched_smile',
    weaponName: 'Albelda Soul-Consuming Arie Claymore',
    weaponStyle: 'greatsword',
    weaponColor: '#f8fafc',
    primaryColor: '#e2e8f0',
    armorColor: '#334155',
    hornColor: '#f43f5e',
    auraColor: '#fb7185',
    capeColor: '#f8fafc',
    companionName: 'Red Bari Shinsu Guardian',
    skills: ['Arie Swordsmanship: Fatal Floral Crown', 'Soul-Gorging Crescent Tempest', 'Infinite Spatial Shinsu Slash'],
    specialAbility: 'blood_drain',
    specialDesc: 'SOUL DEVOUR: Drains HP back whenever its spatial sword zones hit!',
    hpBase: 660,
  },
  {
    name: 'Baekchung, Regression Demon Emperor',
    title: 'Constellation of the Hundred-Life Blade',
    manhwaSource: 'SSS-Class Suicide Hunter',
    sizeScale: 1.06,
    faceStyle: 'blindfold_rune',
    weaponName: 'Heavenly Demon Plum-Steel Sword',
    weaponStyle: 'katana',
    weaponColor: '#fb7185',
    primaryColor: '#9f1239',
    armorColor: '#1f2937',
    hornColor: '#fda4af',
    auraColor: '#f43f5e',
    capeColor: '#4c0519',
    companionName: 'Floor-Boss Goblin-Sword Wraith',
    skills: ['Hundred Ghosts Walking at Night', 'Shattered Regression Halo', 'Death-Card Requiem Cleave'],
    specialAbility: 'chrono_rewind',
    specialDesc: 'REGRESSION CARD: Once below 28% HP, rewinds time once to recover +25% HP!',
    hpBase: 680,
  },
  {
    name: 'Cain, Tower Obelisk Demon King',
    title: 'One-Eyed Dragon Sovereign of Tartarus',
    manhwaSource: 'Second Life Ranker',
    sizeScale: 1.28,
    faceStyle: 'cyclops_crown',
    weaponName: 'Carshina’s Fang Draconic Twin Scythe-Blade',
    weaponStyle: 'scythe',
    weaponColor: '#dc2626',
    primaryColor: '#450a0a',
    armorColor: '#111827',
    hornColor: '#ef4444',
    auraColor: '#dc2626',
    capeColor: '#09090b',
    companionName: 'Hades Undead Viper Chirpy',
    skills: ['Draconic Fear Breath', 'Despair of the Black King', 'Fire-Soul Necro Tempest'],
    specialAbility: 'dragon_fear',
    specialDesc: 'DRACONIC FEAR: Emits crimson shockwaves that knock back & burst!',
    hpBase: 710,
  },
  {
    name: 'Chronos-Yuwon, Giant Slayer Demon King',
    title: 'Outer-God Hunter of the Top Floor',
    manhwaSource: 'Leveling With The Gods',
    sizeScale: 1.22,
    faceStyle: 'blindfold_rune',
    weaponName: 'Kyneē Astral-Frost Great Halberd',
    weaponStyle: 'halberd',
    weaponColor: '#38bdf8',
    primaryColor: '#0c4a6e',
    armorColor: '#1e293b',
    hornColor: '#7dd3fc',
    auraColor: '#0ea5e9',
    capeColor: '#082f49',
    companionName: 'Thanatos Chains Sentinel',
    skills: ['Clockwork Time-Stop Judgment', 'Hercules Giant-Crusher Smash', 'Outer-God Sea Inferno'],
    specialAbility: 'frost_domain',
    specialDesc: 'CLOCKWORK FROST: Freezes arena edges & drops glacial meteors!',
    hpBase: 740,
  },
  {
    name: 'Zephyr, Tartarus Demon Dragon King',
    title: 'Reincarnated Nemesis of the Evil Dragon',
    manhwaSource: 'Doom Breaker / Reincarnation of the Suicidal Battle God',
    sizeScale: 1.36,
    faceStyle: 'dragon_visage',
    weaponName: 'Gram-Draconic Blue-Flame Greatsword',
    weaponStyle: 'greatsword',
    weaponColor: '#3b82f6',
    primaryColor: '#1d4ed8',
    armorColor: '#172554',
    hornColor: '#fbbf24',
    auraColor: '#60a5fa',
    capeColor: '#1e3a8a',
    companionName: 'Blue Lapis Dragon Hatchling',
    skills: ['Blue-Dragon Aura Burst', 'Tartarus Judgment Descent', 'Battle-God Twin Divide'],
    specialAbility: 'berserk_fury',
    specialDesc: 'BATTLE GOD WRATH: Below 50% HP, gains +45% attack speed & blue flames!',
    hpBase: 780,
  },
  {
    name: 'Noir Giabella, Midnight Nightmare King',
    title: 'Sovereign of the Devildom Helmuth',
    manhwaSource: 'Damn Reincarnation',
    sizeScale: 1.26,
    faceStyle: 'monarch_glow',
    weaponName: 'Moonlight-Shattering Chains of Dreams',
    weaponStyle: 'chains',
    weaponColor: '#e879f9',
    primaryColor: '#4c1d95',
    armorColor: '#1e1b4b',
    hornColor: '#f0abfc',
    auraColor: '#d946ef',
    capeColor: '#2e1065',
    companionName: 'Vermouth Phantom Knight',
    skills: ['World of Midnight Nightmares', 'Crimson Moonlight Mirage', 'Chains of Helmuth Ruin'],
    specialAbility: 'mirror_parry',
    specialDesc: 'MIRAGE PARRY: Phases briefly with mirage clones and reflects chain spikes!',
    hpBase: 810,
  },
  {
    name: 'Cheonma-Chung, Fallen Plum Demon Sovereign',
    title: 'Demonic Corrupted Grandmaster of Mount Hua',
    manhwaSource: 'Return of the Mount Hua Sect',
    sizeScale: 1.04,
    faceStyle: 'stitched_smile',
    weaponName: 'Blood-Plum Blossom Sacred Sword',
    weaponStyle: 'katana',
    weaponColor: '#f43f5e',
    primaryColor: '#881337',
    armorColor: '#1c1917',
    hornColor: '#fda4af',
    auraColor: '#fb7185',
    capeColor: '#9f1239',
    companionName: 'Plum-Blossom Sword Disciple',
    skills: ['Twenty-Four Plum Blossom Frenzy', 'Equilibrium Dark-Flower Tempest', 'Abyssal Sword-Qi Rain'],
    specialAbility: 'spatial_cut',
    specialDesc: 'PLUM FRENZY: Launches multi-angle petal sword waves across the stage!',
    hpBase: 840,
  },
  {
    name: 'Yeo-Un, Sky-Demon Nanomachine Lord',
    title: 'Heavenly Demon of the Crimson Cyber-Murim',
    manhwaSource: 'Nano Machine',
    sizeScale: 1.16,
    faceStyle: 'scarred_marshal',
    weaponName: 'Heavenly Demon Sky-Flash Nano Blade',
    weaponStyle: 'katana',
    weaponColor: '#22d3ee',
    primaryColor: '#0f172a',
    armorColor: '#1e293b',
    hornColor: '#22d3ee',
    auraColor: '#06b6d4',
    capeColor: '#7f1d1d',
    companionName: 'Nano-Swarm Sentinel Drone',
    skills: ['Sky-Demon Sword Force 7th Form', 'Nano-Cloud Severing Severance', 'Blood-Moon Reverse Gravity'],
    specialAbility: 'nano_swarm',
    specialDesc: 'NANOMACHINES: Fires homing cyber-qi lasers and repairs armor shields!',
    hpBase: 880,
    shieldBase: 160,
  },
  {
    name: 'Raizel-Asher, True Blood Demon Noblesse',
    title: 'Eternal Crimson Sovereign of Lukedonia',
    manhwaSource: 'Noblesse',
    sizeScale: 1.12,
    faceStyle: 'monarch_glow',
    weaponName: 'Ragnarok Blood-Phoenix Wing Spears',
    weaponStyle: 'spears',
    weaponColor: '#ef4444',
    primaryColor: '#991b1b',
    armorColor: '#09090b',
    hornColor: '#fecaca',
    auraColor: '#dc2626',
    capeColor: '#7f1d1d',
    companionName: 'Frankenstein Dark-Spear Vassal',
    skills: ['Blood Field: Crimson Kneel', 'Blood-Phoenix Cataclysm', 'Dark Spear Abyssal Spiral'],
    specialAbility: 'blood_drain',
    specialDesc: 'BLOOD FIELD: Envelops the ground in crimson spikes that steal life!',
    hpBase: 920,
  },
  {
    name: 'Ananta-Kali, Primordial Chaos Demon King',
    title: 'Golden Serpent King of the End Times',
    manhwaSource: 'Kubera',
    sizeScale: 1.44,
    faceStyle: 'dragon_visage',
    weaponName: 'Chaos-Golden Sutra Hammer & Scales',
    weaponStyle: 'hammer',
    weaponColor: '#eab308',
    primaryColor: '#854d0e',
    armorColor: '#292524',
    hornColor: '#fde047',
    auraColor: '#facc15',
    capeColor: '#713f12',
    companionName: 'Nastika Chaos Wyrm',
    skills: ['Shedding of the Cosmic Serpent', 'Golden Sutra Gravity Crush', 'Name-Erasure Transcendental'],
    specialAbility: 'gravity_crush',
    specialDesc: 'GRAVITY SUTRA: Slams colossal golden pillars with massive shockwaves!',
    hpBase: 960,
  },
  {
    name: 'Ethan-Nightmare, Hardcore Gacha Demon King',
    title: 'Zero-Luck Nightmare Sovereign of Lucid',
    manhwaSource: 'Hardcore Leveling Warrior',
    sizeScale: 1.08,
    faceStyle: 'cyclops_crown',
    weaponName: 'Master-Sword Lamington & Golden Lucky-Coin',
    weaponStyle: 'cards',
    weaponColor: '#fde047',
    primaryColor: '#ca8a04',
    armorColor: '#18181b',
    hornColor: '#fef08a',
    auraColor: '#eab308',
    capeColor: '#7c2d12',
    companionName: 'Lucky-Coin Armor Clone',
    skills: ['Absolute Luck: Triple-7 Crit', 'Nightmare Coin Meteor Shower', 'Gambler Golden Moon Slash'],
    specialAbility: 'gacha_summon',
    specialDesc: 'GACHA JACKPOT: Casts randomized Golden Coin Meteors + lightning crits!',
    hpBase: 1000,
  },
  {
    name: 'Kim Minsu, Demon King of Destruction',
    title: 'Corrupted Fallen Sword-Hero of Mankind',
    manhwaSource: 'The Hero Has Returned',
    sizeScale: 1.38,
    faceStyle: 'cracked_halo',
    weaponName: 'Goddess-Cursed Black-Gold Greatsword',
    weaponStyle: 'greatsword',
    weaponColor: '#f97316',
    primaryColor: '#3f3f46',
    armorColor: '#18181b',
    hornColor: '#f97316',
    auraColor: '#ea580c',
    capeColor: '#451a03',
    companionName: 'Fallen Hero Berserker',
    skills: ['Goddess Blessing: Scorched Earth', 'Hero’s Corrupted World Judgment', 'Doomsday Pillar Cleave'],
    specialAbility: 'star_meteor',
    specialDesc: 'WORLD RUIN: Rains gigantic scorched-earth meteors from the dark sky!',
    hpBase: 1050,
  },
  {
    name: 'Diablo-Jamie, 66666-Year Eclipse Emperor',
    title: 'Final S-Rank Sovereign of 12 Gods & 17 Thrones',
    manhwaSource: 'The Dark Magician Transmigrates After 66666 Years',
    sizeScale: 1.48,
    faceStyle: 'horned_emperor',
    weaponName: 'Black-Magic Zenith Sovereign Staff',
    weaponStyle: 'staff',
    weaponColor: '#c084fc',
    primaryColor: '#1e1b4b',
    armorColor: '#09090b',
    hornColor: '#fbbf24',
    auraColor: '#a855f7',
    capeColor: '#3b0764',
    companionName: 'Nine-Circle Eclipse Familiar',
    skills: ['9th Circle: Apocalypse Void Collapse', '66666-Year Black Sun Nova', 'All-Gods Eclipse Annihilation'],
    specialAbility: 'eclipse_doom',
    specialDesc: '9TH CIRCLE ECLIPSE: Combines Eclipse Meteors, Shield & Void Pillars!',
    hpBase: 1180,
    shieldBase: 220,
  },
];

export function createSeventeenDemonKingsInit(
  bossesDefeated = 0,
): { demonKings: DemonKingEntity[]; minions: EnemyState[]; allies: AlliedNpc[] } {
  const defeatedMult = 1 + Math.max(0, bossesDefeated) * 0.25;
  const demonKings: DemonKingEntity[] = SEVENTEEN_MANHWA_DEMON_KINGS.map((bp, i) => {
    const stage = i + 1;
    const h = Math.round(44 * bp.sizeScale);
    const w = Math.round(30 * bp.sizeScale);
    const hp = Math.round(bp.hpBase * 4 * defeatedMult);
    const shield = bp.shieldBase ? Math.round(bp.shieldBase * defeatedMult) : 0;
    return {
      id: `dk17_${stage}`,
      index: stage,
      totalStages: 17,
      name: bp.name,
      title: bp.title,
      manhwaSource: bp.manhwaSource,
      sizeScale: bp.sizeScale,
      faceStyle: bp.faceStyle,
      weaponName: bp.weaponName,
      weaponStyle: bp.weaponStyle,
      weaponColor: bp.weaponColor,
      armorColor: bp.armorColor,
      capeColor: bp.capeColor,
      companionName: bp.companionName,
      skills: bp.skills,
      specialAbility: bp.specialAbility,
      specialDesc: bp.specialDesc,
      shieldHp: shield,
      rewindUsed: false,
      specialTimer: 4.5,
      x: 420 + (i % 3) * 14,
      y: FLOOR_Y - h,
      vx: 0,
      vy: 0,
      w,
      h,
      hp,
      maxHp: hp,
      facing: -1,
      hitFlash: 0,
      purpleFlameTimer: Math.max(1.15, 1.85 - i * 0.03),
      castIndex: i % 4,
      activeSkillBanner: null,
      activeSkillTimer: 0,
      primaryColor: bp.primaryColor,
      hornColor: bp.hornColor,
      auraColor: bp.auraColor,
      defeated: false,
      damageMult: (1.1 + i * 0.08) * defeatedMult,
    };
  });

  const minions = createDemonKingStageMinions(1, true);
  const allies = createDemonKingAllies();
  return { demonKings, minions, allies };
}

export const PURPLE_FLAME_SKILLS: {
  kind: PurpleFlameKind;
  name: string;
}[] = [
  { kind: 'violet_pillars', name: 'Abyssal Purple Flame Pillars' },
  { kind: 'purple_meteors', name: 'Hellfire Amethyst Meteor Rain' },
  { kind: 'abyssal_nova', name: 'Demonic Violet Flame Nova' },
  { kind: 'shadow_crescent', name: 'Cursed Purple Flame Crescent' },
];

export function createDemonKingPurpleFlameCast(
  king: DemonKingEntity,
  castSeq: number,
  playerX: number,
  floorY = FLOOR_Y,
): {
  skillName: string;
  zones: PurpleFlameZone[];
  projectiles: Projectile[];
} {
  const pick = PURPLE_FLAME_SKILLS[castSeq % PURPLE_FLAME_SKILLS.length];
  const skillName =
    king.skills && king.skills.length > 0
      ? king.skills[castSeq % king.skills.length]
      : pick.name;
  const dmgScale = king.damageMult ?? 1;
  const projColor = king.weaponColor || king.auraColor || '#c084fc';
  const zones: PurpleFlameZone[] = [];
  const projectiles: Projectile[] = [];

  if (pick.kind === 'violet_pillars') {
    [-40, 0, 40].forEach((offset, idx) => {
      zones.push({
        id: `pfz_${king.id}_${castSeq}_${idx}`,
        x: Math.max(30, Math.min(580, playerX + offset - 13)),
        y: floorY - 82,
        w: 26,
        h: 82,
        life: 1.05,
        maxLife: 1.05,
        damage: Math.round(14 * dmgScale),
        kind: 'violet_pillars',
        hasHit: false,
      });
    });
  } else if (pick.kind === 'purple_meteors') {
    [-52, 0, 52].forEach((offset, idx) => {
      projectiles.push({
        id: `pfm_${king.id}_${castSeq}_${idx}`,
        x: Math.max(32, Math.min(590, playerX + offset)),
        y: 16 - idx * 14,
        vx: king.facing * 26,
        vy: 152,
        radius: 8,
        damage: Math.round(15 * dmgScale),
        fromPlayer: false,
        color: projColor,
        life: 2.2,
        kind: 'purple_meteor',
      });
    });
  } else if (pick.kind === 'abyssal_nova') {
    [-1, 1].forEach((dir, idx) => {
      projectiles.push({
        id: `pfn_${king.id}_${castSeq}_${idx}`,
        x: king.x + king.w / 2,
        y: king.y + Math.round(king.h * 0.4),
        vx: dir * 165,
        vy: 0,
        radius: 9,
        damage: Math.round(16 * dmgScale),
        fromPlayer: false,
        color: projColor,
        life: 2.2,
        kind: 'purple_flame',
      });
    });
    zones.push({
      id: `pfz_nova_${king.id}_${castSeq}`,
      x: king.x - 22,
      y: floorY - 60,
      w: king.w + 44,
      h: 60,
      life: 0.9,
      maxLife: 0.9,
      damage: Math.round(14 * dmgScale),
      kind: 'abyssal_nova',
      hasHit: false,
    });
  } else {
    [-24, 0, 24].forEach((vyOff, idx) => {
      projectiles.push({
        id: `pfc_${king.id}_${castSeq}_${idx}`,
        x: king.x + (king.facing === 1 ? king.w : 0),
        y: king.y + Math.round(king.h * 0.42),
        vx: king.facing * 192,
        vy: vyOff,
        radius: 7,
        damage: Math.round(14 * dmgScale),
        fromPlayer: false,
        color: projColor,
        life: 2.2,
        kind: 'purple_flame',
      });
    });
  }

  return {
    skillName,
    zones,
    projectiles,
  };
}

export const JJK_DOMAINS: Record<
  ArenaChallengerId,
  {
    name: string;
    shout: string;
    zoneKind: PurpleFlameKind;
    primaryColor: string;
    secondaryColor: string;
  }
> = {
  satoru_gojo: {
    name: 'Infinite Void',
    shout: 'DOMAIN EXPANSION: INFINITE VOID!',
    zoneKind: 'jjk_domain_void',
    primaryColor: '#38bdf8',
    secondaryColor: '#f8fafc',
  },
  ryomen_sukuna: {
    name: 'Malevolent Shrine',
    shout: 'DOMAIN EXPANSION: MALEVOLENT SHRINE!',
    zoneKind: 'jjk_domain_shrine',
    primaryColor: '#dc2626',
    secondaryColor: '#fbbf24',
  },
  toji_fushiguro: {
    name: '0 Cursed Energy: Zenin Abyss',
    shout: 'DOMAIN RUPTURE: ZENIN ARSENAL ABYSS!',
    zoneKind: 'jjk_domain_chains',
    primaryColor: '#a855f7',
    secondaryColor: '#e2e8f0',
  },
  yuta_okkotsu: {
    name: 'Authentic Mutual Love',
    shout: 'DOMAIN EXPANSION: AUTHENTIC MUTUAL LOVE!',
    zoneKind: 'jjk_domain_swords',
    primaryColor: '#e879f9',
    secondaryColor: '#7dd3fc',
  },
  megumi_fushiguro: {
    name: 'Chimera Shadow Garden',
    shout: 'DOMAIN EXPANSION: CHIMERA SHADOW GARDEN!',
    zoneKind: 'jjk_domain_shadow',
    primaryColor: '#6366f1',
    secondaryColor: '#38bdf8',
  },
  kento_nanami: {
    name: '7:3 Overtime Ratio Grid',
    shout: 'DOMAIN EXPANSION: 7:3 OVERTIME RATIO GRID!',
    zoneKind: 'jjk_domain_ratio',
    primaryColor: '#facc15',
    secondaryColor: '#10b981',
  },
  yuji_itadori: {
    name: 'Hometown Railway Soul Domain',
    shout: 'DOMAIN EXPANSION: HOMETOWN RAILWAY SOUL!',
    zoneKind: 'jjk_domain_station',
    primaryColor: '#ef4444',
    secondaryColor: '#fb7185',
  },
  suguru_geto: {
    name: 'Womb Profusion: Spiral Pillar',
    shout: 'DOMAIN EXPANSION: WOMB PROFUSION!',
    zoneKind: 'jjk_domain_womb',
    primaryColor: '#7e22ce',
    secondaryColor: '#d946ef',
  },
  maki_zenin: {
    name: 'Split Soul Arsenal Storm',
    shout: 'HEAVENLY REALM: SPLIT SOUL ARSENAL STORM!',
    zoneKind: 'jjk_domain_arsenal',
    primaryColor: '#10b981',
    secondaryColor: '#f43f5e',
  },
  kinji_hakari: {
    name: 'Idle Death Gamble: 777 Fever',
    shout: 'DOMAIN EXPANSION: IDLE DEATH GAMBLE!',
    zoneKind: 'jjk_domain_gamble',
    primaryColor: '#22c55e',
    secondaryColor: '#fde047',
  },
  hajime_kashimo: {
    name: 'Mythical Beast Amber: Thunderfield',
    shout: 'MYTHICAL BEAST AMBER: THUNDERFIELD!',
    zoneKind: 'jjk_domain_amber',
    primaryColor: '#06b6d4',
    secondaryColor: '#e0f2fe',
  },
  mahito: {
    name: 'Self-Embodiment of Perfection',
    shout: 'DOMAIN EXPANSION: SELF-EMBODIMENT OF PERFECTION!',
    zoneKind: 'jjk_domain_perfection',
    primaryColor: '#2dd4bf',
    secondaryColor: '#a855f7',
  },
  jogo: {
    name: 'Coffin of the Iron Mountain',
    shout: 'DOMAIN EXPANSION: COFFIN OF THE IRON MOUNTAIN!',
    zoneKind: 'jjk_domain_coffin',
    primaryColor: '#f97316',
    secondaryColor: '#dc2626',
  },
  choso: {
    name: 'Crimson Blood Moon Horizon',
    shout: 'CRIMSON HORIZON: CONVERGENCE BLOOD MOON!',
    zoneKind: 'jjk_domain_blood',
    primaryColor: '#be123c',
    secondaryColor: '#fb7185',
  },
  hiromi_higuruma: {
    name: 'Deadly Sentencing: Confiscation Court',
    shout: 'DOMAIN EXPANSION: DEADLY SENTENCING!',
    zoneKind: 'jjk_domain_court',
    primaryColor: '#fbbf24',
    secondaryColor: '#fef3c7',
  },
  nobara_kugisaki: {
    name: 'Straw Doll Resonance Shrine',
    shout: 'RESONANCE REALM: HAIRPIN SHRINE!',
    zoneKind: 'jjk_domain_straw',
    primaryColor: '#f43f5e',
    secondaryColor: '#38bdf8',
  },
};

export const ARENA_CHALLENGERS: ArenaChallengerDef[] = [
  {
    id: 'satoru_gojo',
    name: 'Satoru Gojo',
    title: 'The Strongest Modern Sorcerer',
    worldOrigin: 'Jujutsu Kaisen · Limitless',
    weaponName: 'Limitless & Six Eyes',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#0f172a',
    secondaryColor: '#38bdf8',
    auraColor: '#38bdf8',
    hairColor: '#f8fafc',
    capeColor: '#1e293b',
    weaponColor: '#7dd3fc',
    description:
      'Blindfolded Special Grade master of Infinity. Pulls targets with Lapse Blue, blasts back with Reversal Red, and erases space with Hollow Purple.',
    skills: [
      {
        id: 'lapse_blue',
        name: 'Cursed Technique Lapse: Blue',
        damage: 24,
        kind: 'limitless_blue_red',
        color: '#38bdf8',
        shout: 'CURSED TECHNIQUE LAPSE: BLUE!',
      },
      {
        id: 'reversal_red',
        name: 'Cursed Technique Reversal: Red',
        damage: 28,
        kind: 'limitless_blue_red',
        color: '#ef4444',
        shout: 'CURSED TECHNIQUE REVERSAL: RED!',
      },
      {
        id: 'hollow_purple',
        name: 'Hollow Technique: Purple',
        damage: 34,
        kind: 'hollow_purple',
        color: '#a855f7',
        shout: 'HOLLOW TECHNIQUE: PURPLE!',
      },
    ],
  },
  {
    id: 'ryomen_sukuna',
    name: 'Ryomen Sukuna',
    title: 'King of Curses · Heian Era',
    worldOrigin: 'Jujutsu Kaisen · King of Curses',
    weaponName: 'Kamutoke Vajra & Shrine Cleave',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#f8fafc',
    secondaryColor: '#dc2626',
    auraColor: '#ef4444',
    hairColor: '#fda4af',
    capeColor: '#18181b',
    weaponColor: '#fbbf24',
    description:
      'Tattooed Heian Curse Sovereign in ivory kimono. Fires invisible Dismantle slashes, spiderweb Cleave rushes, and Divine Flame Fuga pillars.',
    skills: [
      {
        id: 'dismantle_slash',
        name: 'Dismantle: Invisible Slash',
        damage: 24,
        kind: 'shrine_cleave',
        color: '#f43f5e',
        shout: 'DISMANTLE!',
      },
      {
        id: 'cleave_web',
        name: 'Cleave: Spiderweb Barrage',
        damage: 28,
        kind: 'shrine_cleave',
        color: '#e11d48',
        shout: 'MALEVOLENT SHRINE — CLEAVE!',
      },
      {
        id: 'divine_fuga',
        name: 'Divine Flame: Fuga',
        damage: 34,
        kind: 'divine_flame_fuga',
        color: '#f97316',
        shout: 'OPEN — DIVINE FLAME: FUGA!',
      },
    ],
  },
  {
    id: 'toji_fushiguro',
    name: 'Toji Fushiguro',
    title: 'The Sorcerer Killer',
    worldOrigin: 'Jujutsu Kaisen · Sorcerer Killer',
    weaponName: 'Inverted Spear of Heaven & Split Soul Katana',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#18181b',
    secondaryColor: '#e2e8f0',
    auraColor: '#c084fc',
    hairColor: '#09090b',
    capeColor: '#581c87',
    weaponColor: '#cbd5e1',
    description:
      'Zero-cursed-energy Heavenly Restriction assassin with shoulder Inventory Curse. Chains flash-step blitzes and nullifies defenses with Inverted Spear.',
    skills: [
      {
        id: 'heavenly_blitz',
        name: 'Heavenly Restriction Blitz',
        damage: 25,
        kind: 'heavenly_blitz',
        color: '#cbd5e1',
        shout: 'HEAVENLY RESTRICTION BLITZ!',
      },
      {
        id: 'inverted_spear',
        name: 'Inverted Spear: Nullify',
        damage: 28,
        kind: 'inverted_spear',
        color: '#a855f7',
        shout: 'INVERTED SPEAR OF HEAVEN!',
      },
      {
        id: 'playful_cloud',
        name: 'Playful Cloud: Kinetic Crush',
        damage: 32,
        kind: 'heavenly_blitz',
        color: '#dc2626',
        shout: 'PLAYFUL CLOUD — CRUSH!',
      },
    ],
  },
  {
    id: 'yuta_okkotsu',
    name: 'Yuta Okkotsu',
    title: 'Special Grade Cursed Prodigy',
    worldOrigin: 'Jujutsu Kaisen · Special Grade',
    weaponName: 'Cursed Energy Katana & Rika',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#f8fafc',
    secondaryColor: '#0f172a',
    auraColor: '#c084fc',
    hairColor: '#1e1b4b',
    capeColor: '#7e22ce',
    weaponColor: '#93c5fd',
    description:
      'White-uniform Special Grade Swordsman accompanied by Rika Orimoto. Commands Cursed Speech freezes and Pure Love cursed beams.',
    skills: [
      {
        id: 'cursed_speech',
        name: "Cursed Speech: Don't Move!",
        damage: 23,
        kind: 'cursed_speech',
        color: '#fde047',
        shout: "CURSED SPEECH — DON'T MOVE!",
      },
      {
        id: 'rika_manifest',
        name: 'Rika Manifest: Claw Barrage',
        damage: 28,
        kind: 'rika_manifest',
        color: '#c084fc',
        shout: 'COME FORTH, RIKA!',
      },
      {
        id: 'pure_love_beam',
        name: 'Pure Love: Cursed Beam',
        damage: 33,
        kind: 'hollow_purple',
        color: '#e879f9',
        shout: 'THIS IS PURE LOVE!',
      },
    ],
  },
  {
    id: 'megumi_fushiguro',
    name: 'Megumi Fushiguro',
    title: 'Ten Shadows Tactician',
    worldOrigin: 'Jujutsu Kaisen · Ten Shadows',
    weaponName: 'Jet-Black Shadow Sword',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#1e293b',
    secondaryColor: '#0284c7',
    auraColor: '#38bdf8',
    hairColor: '#09090b',
    capeColor: '#0f172a',
    weaponColor: '#475569',
    description:
      'Zenin Ten Shadows heir summoning Divine Dog: Totality claws, Nue lightning dives, and Chimera Shadow Garden eruptions.',
    skills: [
      {
        id: 'divine_dog_totality',
        name: 'Ten Shadows: Divine Dog Totality',
        damage: 25,
        kind: 'ten_shadows_summon',
        color: '#e2e8f0',
        shout: 'TEN SHADOWS — DIVINE DOG: TOTALITY!',
      },
      {
        id: 'nue_lightning',
        name: 'Ten Shadows: Nue Lightning Dive',
        damage: 27,
        kind: 'ten_shadows_summon',
        color: '#facc15',
        shout: 'NUE — THUNDERSTRIKE!',
      },
      {
        id: 'chimera_garden',
        name: 'Chimera Shadow Garden',
        damage: 31,
        kind: 'divine_flame_fuga',
        color: '#312e81',
        shout: 'DOMAIN EXPANSION: CHIMERA SHADOW GARDEN!',
      },
    ],
  },
  {
    id: 'kento_nanami',
    name: 'Kento Nanami',
    title: 'Grade 1 Overtime Sorcerer',
    worldOrigin: 'Jujutsu Kaisen · Grade 1 Tactician',
    weaponName: 'Bandage-Wrapped Blunt Cleaver',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#d6d3d1',
    secondaryColor: '#ca8a04',
    auraColor: '#facc15',
    hairColor: '#fde047',
    capeColor: '#78716c',
    weaponColor: '#e7e5e4',
    description:
      'Stoic suited Grade 1 sorcerer striking forced 7:3 critical weakpoints with his wrapped blunt cleaver and Collapse shockwaves.',
    skills: [
      {
        id: 'ratio_7_3',
        name: 'Ratio Technique: 7:3 Weakpoint',
        damage: 26,
        kind: 'ratio_collapse',
        color: '#facc15',
        shout: 'RATIO TECHNIQUE — 7:3 CRITICAL!',
      },
      {
        id: 'collapse_ruin',
        name: 'Collapse: Structural Ruin',
        damage: 29,
        kind: 'ratio_collapse',
        color: '#fb923c',
        shout: 'EXTENDED TECHNIQUE: COLLAPSE!',
      },
      {
        id: 'overtime_surge',
        name: 'Overtime: Cursed Surge',
        damage: 32,
        kind: 'heavenly_blitz',
        color: '#fde047',
        shout: "I'M GOING INTO OVERTIME!",
      },
    ],
  },
  {
    id: 'yuji_itadori',
    name: 'Yuji Itadori',
    title: 'King of Black Flash',
    worldOrigin: 'Jujutsu Kaisen · Black Flash Vessel',
    weaponName: 'Divergent Black Flash Gauntlets',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#0f172a',
    secondaryColor: '#ef4444',
    auraColor: '#f43f5e',
    hairColor: '#fda4af',
    capeColor: '#dc2626',
    weaponColor: '#f43f5e',
    description:
      'Pink-haired Jujutsu High brawler in signature red-hooded uniform. Delivers double-impact Divergent Fists, Soul Dismantles, and crimson-black Black Flash shockwaves.',
    skills: [
      {
        id: 'divergent_fist',
        name: 'Divergent Fist: Double Impact',
        damage: 25,
        kind: 'black_flash_rush',
        color: '#38bdf8',
        shout: 'DIVERGENT FIST!',
      },
      {
        id: 'soul_dismantle',
        name: 'Awakened Shrine: Soul Dismantle',
        damage: 29,
        kind: 'black_flash_rush',
        color: '#fb7185',
        shout: 'SOUL DISMANTLE!',
      },
      {
        id: 'black_flash_chain',
        name: 'Black Flash: Sparks of Black',
        damage: 35,
        kind: 'black_flash_rush',
        color: '#ef4444',
        shout: 'KOKUSEN — BLACK FLASH!!',
      },
    ],
  },
  {
    id: 'suguru_geto',
    name: 'Suguru Geto',
    title: 'Special Grade Curse Manipulator',
    worldOrigin: 'Jujutsu Kaisen · Curse Manipulator',
    weaponName: 'Three-Section Playful Cloud & Curse Swarm',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#4c1d95',
    secondaryColor: '#d946ef',
    auraColor: '#a855f7',
    hairColor: '#09090b',
    capeColor: '#eab308',
    weaponColor: '#dc2626',
    description:
      'Monk-robed Special Grade curse user wielding Playful Cloud. Commands swarms of abyssal curses and condenses thousands into Maximum: Uzumaki.',
    skills: [
      {
        id: 'curse_swarm_release',
        name: 'Cursed Spirit Swarm: Centipede Tide',
        damage: 25,
        kind: 'cursed_uzumaki',
        color: '#a855f7',
        shout: 'CURSED SPIRIT MANIPULATION!',
      },
      {
        id: 'playful_cloud_whirl',
        name: 'Playful Cloud: Kesa Gale',
        damage: 28,
        kind: 'cursed_uzumaki',
        color: '#f43f5e',
        shout: 'PLAYFUL CLOUD — THREE-SECTION REND!',
      },
      {
        id: 'maximum_uzumaki',
        name: 'Maximum: Uzumaki Vortex',
        damage: 36,
        kind: 'cursed_uzumaki',
        color: '#e879f9',
        shout: 'GOKUBAN: UZUMAKI!!',
      },
    ],
  },
  {
    id: 'maki_zenin',
    name: 'Maki Zenin',
    title: 'Awakened Demon of Zero Cursed Energy',
    worldOrigin: 'Jujutsu Kaisen · Heavenly Restriction',
    weaponName: 'Split Soul Katana & Dragon-Bone',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#18181b',
    secondaryColor: '#10b981',
    auraColor: '#34d399',
    hairColor: '#059669',
    capeColor: '#be123c',
    weaponColor: '#6ee7b7',
    description:
      'Battle-scarred Heavenly Restriction fighter with sea-green hair. Slices souls cleanly with Split Soul Katana and blasts kinetic pressure via Dragon-Bone.',
    skills: [
      {
        id: 'air_step_rend',
        name: 'Air-Step Sonic Blitz',
        damage: 26,
        kind: 'split_soul_katana',
        color: '#34d399',
        shout: 'HEAVENLY BLITZ — SONIC STEP!',
      },
      {
        id: 'dragon_bone_release',
        name: 'Dragon-Bone: Kinetic Burst',
        damage: 30,
        kind: 'split_soul_katana',
        color: '#f97316',
        shout: 'DRAGON-BONE — OVERDRIVE!',
      },
      {
        id: 'split_soul_sever',
        name: 'Split Soul Katana: Soul Sever',
        damage: 35,
        kind: 'split_soul_katana',
        color: '#f43f5e',
        shout: 'SPLIT SOUL KATANA — SEVER!',
      },
    ],
  },
  {
    id: 'kinji_hakari',
    name: 'Kinji Hakari',
    title: 'Immortal Jackpot Fever Gambler',
    worldOrigin: 'Jujutsu Kaisen · Restless Gambler',
    weaponName: '777 Pachinko Shutter Doors & Rough Aura',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#f8fafc',
    secondaryColor: '#22c55e',
    auraColor: '#4ade80',
    hairColor: '#fef08a',
    capeColor: '#9333ea',
    weaponColor: '#fde047',
    description:
      'Flamboyant Jujutsu High gambler cloaked in jagged neon-emerald energy. Slams steel Pachinko shutter doors, shoots reserve balls, and hits Immortal 777 Jackpot.',
    skills: [
      {
        id: 'pachinko_shutter',
        name: 'Train Shutter Doors Crush',
        damage: 25,
        kind: 'jackpot_pachinko',
        color: '#22c55e',
        shout: 'SHUTTER DOOR CRUSH!',
      },
      {
        id: 'reserve_balls_barrage',
        name: 'Pachinko Steel Reserve Volley',
        damage: 28,
        kind: 'jackpot_pachinko',
        color: '#38bdf8',
        shout: 'PROBABILITY CHANGE — FEVER BALLS!',
      },
      {
        id: 'jackpot_777_fever',
        name: '777 Jackpot: Infinite Energy Fever',
        damage: 34,
        kind: 'jackpot_pachinko',
        color: '#fde047',
        shout: 'JACKPOT 777 — 4 MINUTES 11 SECONDS!',
      },
    ],
  },
  {
    id: 'hajime_kashimo',
    name: 'Hajime Kashimo',
    title: 'The God of Lightning',
    worldOrigin: 'Jujutsu Kaisen · God of Lightning',
    weaponName: 'Electric Nyoi Staff',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#f8fafc',
    secondaryColor: '#06b6d4',
    auraColor: '#22d3ee',
    hairColor: '#67e8f9',
    capeColor: '#0891b2',
    weaponColor: '#bae6fd',
    description:
      '400-year-old electric combatant in white robes with cyan lightning-scar eyes. Fires Sure-Hit electric bolts and vaporizes foes in Mythical Beast Amber.',
    skills: [
      {
        id: 'nyoi_discharge',
        name: 'Nyoi Staff: Return Lightning',
        damage: 26,
        kind: 'amber_lightning',
        color: '#22d3ee',
        shout: 'SURE-HIT RETURN LIGHTNING!',
      },
      {
        id: 'sound_wave_blast',
        name: 'EM Plasma Vaporization Wave',
        damage: 30,
        kind: 'amber_lightning',
        color: '#818cf8',
        shout: 'ELECTROMAGNETIC ANNIHILATION!',
      },
      {
        id: 'mythical_beast_amber',
        name: 'Mythical Beast Amber: Thunderstrike',
        damage: 36,
        kind: 'amber_lightning',
        color: '#e0f2fe',
        shout: 'MYTHICAL BEAST AMBER — TURN UP THE VOLUME!',
      },
    ],
  },
  {
    id: 'mahito',
    name: 'Mahito',
    title: 'Special Grade Patchwork Soul Curse',
    worldOrigin: 'Jujutsu Kaisen · Idle Transfiguration',
    weaponName: 'Transfigured Soul Blades & Polymorphic Isomers',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#1e293b',
    secondaryColor: '#2dd4bf',
    auraColor: '#5eead4',
    hairColor: '#94a3b8',
    capeColor: '#581c87',
    weaponColor: '#a855f7',
    description:
      'Stitched patchwork curse born of human malice. Shapes limbs into giant spiked blades, fires Body Repel soul waves, and triggers Idle Transfiguration.',
    skills: [
      {
        id: 'soul_multiplicity',
        name: 'Soul Multiplicity: Body Repel',
        damage: 26,
        kind: 'idle_transfiguration',
        color: '#2dd4bf',
        shout: 'SOUL MULTIPLICITY — BODY REPEL!',
      },
      {
        id: 'blade_arm_shatter',
        name: 'Distorted Killing: Soul Edge',
        damage: 30,
        kind: 'idle_transfiguration',
        color: '#a855f7',
        shout: 'INSTANT SPIRIT BODY — SOUL EDGE!',
      },
      {
        id: 'idle_transfig_touch',
        name: 'Idle Transfiguration: Soul Crush',
        damage: 35,
        kind: 'idle_transfiguration',
        color: '#f43f5e',
        shout: 'IDLE TRANSFIGURATION!',
      },
    ],
  },
  {
    id: 'jogo',
    name: 'Jogo',
    title: 'Volcanic Disaster Flame Curse',
    worldOrigin: 'Jujutsu Kaisen · Disaster Flame',
    weaponName: 'Volcanic Crater Fists & Ember Insects',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#1c1917',
    secondaryColor: '#f97316',
    auraColor: '#fb923c',
    hairColor: '#dc2626',
    capeColor: '#451a03',
    weaponColor: '#fde047',
    description:
      'Cyclops volcano-crowned Special Grade curse erupting magma geysers, sonic Ember Insects, and sky-crushing Maximum: Meteor.',
    skills: [
      {
        id: 'ember_insects',
        name: 'Ember Insects: Sonic Blast',
        damage: 25,
        kind: 'disaster_flames',
        color: '#fbbf24',
        shout: 'EMBER INSECTS — DETONATE!',
      },
      {
        id: 'disaster_magma_pillars',
        name: 'Disaster Flames: Volcano Geysers',
        damage: 30,
        kind: 'disaster_flames',
        color: '#f97316',
        shout: 'DISASTER FLAMES — ERUPTION!',
      },
      {
        id: 'maximum_meteor',
        name: 'Maximum: Meteor Cataclysm',
        damage: 37,
        kind: 'disaster_flames',
        color: '#dc2626',
        shout: 'GOKUBAN: IN — MAXIMUM METEOR!!',
      },
    ],
  },
  {
    id: 'choso',
    name: 'Choso',
    title: 'Eldest Death Painting Womb',
    worldOrigin: 'Jujutsu Kaisen · Death Painting',
    weaponName: 'Crimson Blood Orbs & Flowing Red Scale',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#312e81',
    secondaryColor: '#e11d48',
    auraColor: '#f43f5e',
    hairColor: '#09090b',
    capeColor: '#881337',
    weaponColor: '#fb7185',
    description:
      'Stoic Death Painting brother firing supersonic Piercing Blood lasers, bursting Supernova blood mines, and Wing King crimson blades.',
    skills: [
      {
        id: 'crimson_binding',
        name: 'Crimson Blood Slicer',
        damage: 25,
        kind: 'blood_manipulation',
        color: '#e11d48',
        shout: 'EXORCISM — CRIMSON SLICER!',
      },
      {
        id: 'supernova_burst',
        name: 'Supernova: Blood Starburst',
        damage: 29,
        kind: 'blood_manipulation',
        color: '#fb7185',
        shout: 'SUPERNOVA — BURST!',
      },
      {
        id: 'piercing_blood_laser',
        name: 'Convergence: Piercing Blood',
        damage: 35,
        kind: 'blood_manipulation',
        color: '#be123c',
        shout: 'BYAKUREN — PIERCING BLOOD!!',
      },
    ],
  },
  {
    id: 'hiromi_higuruma',
    name: 'Hiromi Higuruma',
    title: 'Genius Sorcerer Attorney',
    worldOrigin: 'Jujutsu Kaisen · Deadly Sentencing',
    weaponName: "Judgeman Gavel & Executioner's Sword",
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#1e293b',
    secondaryColor: '#fbbf24',
    auraColor: '#fde047',
    hairColor: '#0f172a',
    capeColor: '#475569',
    weaponColor: '#fef08a',
    description:
      'Sharp-suited prodigy lawyer assisted by Judgeman. Shifts his golden gavel into giant crushing hammers and manifests the gleaming Executioner Sword.',
    skills: [
      {
        id: 'gavel_crusher',
        name: 'Giant Gavel Verdict Slam',
        damage: 25,
        kind: 'deadly_sentencing',
        color: '#fbbf24',
        shout: 'OBJECTION — GAVEL VERDICT!',
      },
      {
        id: 'confiscation_seal',
        name: 'Judgeman Scale Confiscation',
        damage: 29,
        kind: 'deadly_sentencing',
        color: '#cbd5e1',
        shout: 'GUILTY — CONFISCATION!',
      },
      {
        id: 'executioners_sword',
        name: "Death Penalty: Executioner's Sword",
        damage: 36,
        kind: 'deadly_sentencing',
        color: '#fef08a',
        shout: "DEATH PENALTY — EXECUTIONER'S SWORD!!",
      },
    ],
  },
  {
    id: 'nobara_kugisaki',
    name: 'Nobara Kugisaki',
    title: 'Fierce Straw Doll Sorceress',
    worldOrigin: 'Jujutsu Kaisen · Straw Doll',
    weaponName: 'Cursed Steel Hammer, Nails & Straw Doll',
    maxHp: 115,
    attackDamage: 22,
    moveSpeed: 148,
    primaryColor: '#1e1b4b',
    secondaryColor: '#f43f5e',
    auraColor: '#fb7185',
    hairColor: '#ea580c',
    capeColor: '#be185d',
    weaponColor: '#38bdf8',
    description:
      'Auburn-haired Tokyo First-Year wielding hammer and nails. Launches cursed nail volleys, detonates Hairpin shockwaves, and pierces souls via Resonance.',
    skills: [
      {
        id: 'nail_volley',
        name: 'Hammer Volley: Cursed Nails',
        damage: 24,
        kind: 'straw_doll_resonance',
        color: '#38bdf8',
        shout: 'CURSED NAIL VOLLEY!',
      },
      {
        id: 'hairpin_detonation',
        name: 'Straw Doll: Hairpin Explosion',
        damage: 29,
        kind: 'straw_doll_resonance',
        color: '#f43f5e',
        shout: 'HAIRPIN — DETONATE!',
      },
      {
        id: 'resonance_soul_spike',
        name: 'Straw Doll Technique: Resonance',
        damage: 35,
        kind: 'straw_doll_resonance',
        color: '#e879f9',
        shout: 'STRAW DOLL — RESONANCE!!',
      },
    ],
  },
];

export function createArenaDuelInit(
  challengerId: ArenaChallengerId,
  player?: PlayerState,
): ActiveArenaDuel {
  const def = ARENA_CHALLENGERS.find((c) => c.id === challengerId) ?? ARENA_CHALLENGERS[0];
  const baseHp = player ? Math.max(115, Math.round(player.maxHp)) : def.maxHp;
  const matchedHp = baseHp * 3; // 3x Colosseum match HP for opponent & player!
  const matchedAtk = player
    ? Math.max(14, Math.round(calculateAttackDamage(player, 1, false)))
    : def.attackDamage;
  const hotSpringMult = player && (player.hotSpringTimer ?? 0) > 0 ? 1.1 : 1;
  const matchedSpeed = player
    ? Math.round((MOVE_SPEED + player.stats.speed * 6) * hotSpringMult)
    : def.moveSpeed;

  const syncedDef: ArenaChallengerDef = {
    ...def,
    maxHp: matchedHp,
    attackDamage: matchedAtk,
    moveSpeed: matchedSpeed,
    skills: [
      { ...def.skills[0], damage: Math.round(matchedAtk * 1.15) },
      { ...def.skills[1], damage: Math.round(matchedAtk * 1.3) },
      { ...def.skills[2], damage: Math.round(matchedAtk * 1.55) },
    ],
  };

  return {
    challengerId: def.id,
    def: syncedDef,
    x: 820,
    y: FLOOR_Y - 34,
    vx: 0,
    vy: 0,
    w: 24,
    h: 34,
    hp: matchedHp,
    maxHp: matchedHp,
    matchedAtk,
    matchedSpeed,
    facing: -1,
    onGround: true,
    state: 'approach',
    stateTimer: 0.35,
    attackCooldown: 0.45,
    skillCooldown: 1.4,
    skillIndex: 0,
    comboStep: 0,
    guardTimer: 0,
    dodgeCooldown: 0,
    invulnTimer: 0,
    hitFlash: 0,
    walkCycle: 0,
    aiActionTag: null,
    activeSkillBanner: null,
    activeSkillTimer: 0,
    stunTimer: 0,
    windVulnerable: false,
    domainActive: false,
    domainTimer: 0,
    domainCooldown: 4.2,
    domainName: JJK_DOMAINS[def.id].name,
    domainCastCount: 0,
    roundNumber: 1,
    playerRoundWins: 0,
    opponentRoundWins: 0,
    roundHistory: [],
    roundPhase: 'countdown',
    roundPhaseTimer: 3.3,
    fightBannerTimer: 0,
    lastRoundWinner: null,
  };
}

export function createArenaSkillAttack(
  duel: ActiveArenaDuel,
  skillIdx: number,
  playerX: number,
  floorY = FLOOR_Y,
): {
  skill: ArenaSkillDef;
  projectiles: Projectile[];
  zones: PurpleFlameZone[];
  dashVelocityX: number;
  jumpVelocityY: number;
  healAmount: number;
  teleportBehindPlayer: boolean;
} {
  const skill = duel.def.skills[Math.abs(skillIdx) % duel.def.skills.length];
  const projectiles: Projectile[] = [];
  const zones: PurpleFlameZone[] = [];
  let dashVelocityX = 0;
  let jumpVelocityY = 0;
  let healAmount = 0;
  let teleportBehindPlayer = false;
  const skillDmg = Math.max(10, Math.round(skill.damage));
  const clampZoneX = (cx: number, w: number) => Math.max(24, Math.min(1216 - w, Math.round(cx - w / 2)));
  const uid = `${duel.challengerId}_${skill.id}_${Date.now()}_${Math.floor(Math.random() * 999)}`;

  if (duel.challengerId === 'satoru_gojo') {
    if (skill.id === 'lapse_blue') {
      zones.push({
        id: `jjk_${uid}_z`,
        x: clampZoneX(playerX, 134),
        y: floorY - 110,
        w: 134,
        h: 110,
        life: 1.4,
        maxLife: 1.4,
        damage: Math.round(skillDmg * 0.85),
        kind: 'jjk_red_blue',
        hasHit: false,
        telegraphTime: 0.25,
      });
      projectiles.push({
        id: `jjk_${uid}_p`,
        x: duel.x + duel.w / 2 + duel.facing * 12,
        y: duel.y + 14,
        vx: duel.facing * 205,
        vy: 0,
        radius: 13,
        damage: skillDmg,
        fromPlayer: false,
        color: '#38bdf8',
        life: 2.0,
        kind: 'jjk_blue_pull',
        pullPlayerStrength: 165,
      });
    } else if (skill.id === 'reversal_red') {
      dashVelocityX = -duel.facing * 140;
      projectiles.push({
        id: `jjk_${uid}_p`,
        x: duel.x + duel.w / 2 + duel.facing * 14,
        y: duel.y + 14,
        vx: duel.facing * 320,
        vy: 0,
        radius: 14,
        damage: Math.round(skillDmg * 1.05),
        fromPlayer: false,
        color: '#ef4444',
        life: 1.85,
        kind: 'jjk_red_repulse',
      });
      zones.push({
        id: `jjk_${uid}_z`,
        x: clampZoneX(playerX + duel.facing * 32, 118),
        y: floorY - 104,
        w: 118,
        h: 104,
        life: 1.2,
        maxLife: 1.2,
        damage: Math.round(skillDmg * 0.85),
        kind: 'jjk_red_blue',
        hasHit: false,
        telegraphTime: 0.22,
      });
    } else {
      zones.push({
        id: `jjk_${uid}_z`,
        x: clampZoneX(playerX, 152),
        y: floorY - 128,
        w: 152,
        h: 128,
        life: 1.5,
        maxLife: 1.5,
        damage: Math.round(skillDmg * 0.95),
        kind: 'jjk_hollow_purple',
        hasHit: false,
        telegraphTime: 0.35,
      });
      projectiles.push({
        id: `jjk_${uid}_p`,
        x: duel.x + (duel.facing === 1 ? duel.w + 8 : -8),
        y: duel.y + 14,
        vx: duel.facing * 260,
        vy: 0,
        radius: 17,
        damage: skillDmg,
        fromPlayer: false,
        color: '#a855f7',
        life: 2.2,
        kind: 'jjk_hollow_sphere',
      });
    }
  } else if (duel.challengerId === 'ryomen_sukuna') {
    if (skill.id === 'divine_fuga') {
      [-76, 76].forEach((off, idx) => {
        zones.push({
          id: `jjk_${uid}_fuga_${idx}`,
          x: clampZoneX(playerX + off, 100),
          y: floorY - 130,
          w: 100,
          h: 130,
          life: 1.35,
          maxLife: 1.35,
          damage: Math.round(skillDmg * 0.9),
          kind: 'jjk_jogo_volcano',
          hasHit: false,
          telegraphTime: 0.3,
        });
      });
      projectiles.push({
        id: `jjk_${uid}_fuga_p`,
        x: duel.x + duel.w / 2,
        y: duel.y + 14,
        vx: duel.facing * 245,
        vy: 0,
        radius: 14,
        damage: skillDmg,
        fromPlayer: false,
        color: '#f97316',
        life: 1.85,
        kind: 'fireball',
      });
    } else if (skill.id === 'cleave_web') {
      dashVelocityX = duel.facing * 270;
      zones.push({
        id: `jjk_${uid}_wc`,
        x: clampZoneX(playerX, 146),
        y: floorY - 122,
        w: 146,
        h: 122,
        life: 1.35,
        maxLife: 1.35,
        damage: Math.round(skillDmg * 0.9),
        kind: 'jjk_world_cut',
        hasHit: false,
        telegraphTime: 0.25,
      });
      [-22, 0, 22].forEach((yOff, i) => {
        projectiles.push({
          id: `jjk_${uid}_sl_${i}`,
          x: duel.x + duel.w / 2,
          y: Math.min(floorY - 12, duel.y + 16 + yOff * 0.45),
          vx: duel.facing * (270 + i * 20),
          vy: yOff * 0.3,
          radius: 11,
          damage: Math.round(skillDmg * 0.8),
          fromPlayer: false,
          color: '#e11d48',
          life: 1.7,
          kind: 'slash_wave',
        });
      });
    } else {
      dashVelocityX = duel.facing * 220;
      zones.push({
        id: `jjk_${uid}_dis`,
        x: clampZoneX(playerX, 134),
        y: floorY - 112,
        w: 134,
        h: 112,
        life: 1.25,
        maxLife: 1.25,
        damage: Math.round(skillDmg * 0.88),
        kind: 'jjk_cleave_storm',
        hasHit: false,
        telegraphTime: 0.22,
      });
      projectiles.push({
        id: `jjk_${uid}_dis_p`,
        x: duel.x + duel.w / 2 + duel.facing * 8,
        y: duel.y + 15,
        vx: duel.facing * 305,
        vy: 0,
        radius: 11,
        damage: skillDmg,
        fromPlayer: false,
        color: '#f43f5e',
        life: 1.5,
        kind: 'slash_wave',
      });
    }
  } else if (duel.challengerId === 'toji_fushiguro') {
    dashVelocityX = duel.facing * 365;
    jumpVelocityY = -105;
    if (skill.id === 'inverted_spear') {
      teleportBehindPlayer = true;
    }
    zones.push({
      id: `jjk_${uid}_t`,
      x: clampZoneX(playerX, 120),
      y: floorY - 102,
      w: 120,
      h: 102,
      life: 1.15,
      maxLife: 1.15,
      damage: Math.round(skillDmg * 0.84),
      kind: 'jjk_tether_trap',
      hasHit: false,
      telegraphTime: 0.2,
    });
    projectiles.push({
      id: `jjk_${uid}_sp`,
      x: duel.x + duel.w / 2 + duel.facing * 12,
      y: duel.y + 15,
      vx: duel.facing * 290,
      vy: 0,
      radius: 12,
      damage: skillDmg,
      fromPlayer: false,
      color: skill.color,
      life: 1.35,
      kind: 'jjk_chain_spear',
    });
  } else if (duel.challengerId === 'yuta_okkotsu') {
    if (skill.id === 'cursed_speech') {
      zones.push({
        id: `jjk_${uid}_cs`,
        x: clampZoneX(playerX, 136),
        y: floorY - 108,
        w: 136,
        h: 108,
        life: 1.25,
        maxLife: 1.25,
        damage: Math.round(skillDmg * 0.82),
        kind: 'jjk_cursed_speech_wave',
        hasHit: false,
        telegraphTime: 0.22,
      });
      projectiles.push({
        id: `jjk_${uid}_csp`,
        x: duel.x + duel.w / 2 + duel.facing * 10,
        y: duel.y + 14,
        vx: duel.facing * 255,
        vy: 0,
        radius: 13,
        damage: Math.round(skillDmg * 0.88),
        fromPlayer: false,
        color: '#fde047',
        life: 1.5,
        kind: 'gravity_orb',
        slowSeconds: 1.35,
      });
    } else {
      dashVelocityX = duel.facing * 245;
      zones.push({
        id: `jjk_${uid}_rk`,
        x: clampZoneX(playerX, 140),
        y: floorY - 118,
        w: 140,
        h: 118,
        life: 1.35,
        maxLife: 1.35,
        damage: Math.round(skillDmg * 0.9),
        kind: 'jjk_rika_beam',
        hasHit: false,
        telegraphTime: 0.28,
      });
      projectiles.push({
        id: `jjk_${uid}_rkp`,
        x: duel.x + duel.w / 2 + duel.facing * 14,
        y: duel.y + 14,
        vx: duel.facing * 270,
        vy: 0,
        radius: 15,
        damage: skillDmg,
        fromPlayer: false,
        color: '#e879f9',
        life: 1.6,
        kind: 'jjk_rika_beam_orb',
        beamLength: 36,
      });
    }
  } else if (duel.challengerId === 'megumi_fushiguro') {
    dashVelocityX = duel.facing * 225;
    if (skill.id === 'nue_lightning') {
      zones.push({
        id: `jjk_${uid}_nue`,
        x: clampZoneX(playerX, 128),
        y: floorY - 116,
        w: 128,
        h: 116,
        life: 1.25,
        maxLife: 1.25,
        damage: Math.round(skillDmg * 0.85),
        kind: 'jjk_max_elephant',
        hasHit: false,
        telegraphTime: 0.26,
      });
      [-28, 28].forEach((ox, idx) => {
        projectiles.push({
          id: `jjk_${uid}_nb_${idx}`,
          x: Math.max(40, Math.min(1200, playerX + ox)),
          y: 16,
          vx: idx === 0 ? 35 : -35,
          vy: 195,
          radius: 11,
          damage: Math.round(skillDmg * 0.86),
          fromPlayer: false,
          color: '#facc15',
          life: 1.8,
          kind: 'jjk_nue_bolt',
          gravityScale: 0.45,
        });
      });
    } else {
      zones.push({
        id: `jjk_${uid}_sd`,
        x: clampZoneX(playerX, 134),
        y: floorY - 110,
        w: 134,
        h: 110,
        life: 1.35,
        maxLife: 1.35,
        damage: Math.round(skillDmg * 0.88),
        kind: 'jjk_domain_shadow',
        hasHit: false,
        telegraphTime: 0.24,
      });
      [-18, 18].forEach((vyOff, idx) => {
        projectiles.push({
          id: `jjk_${uid}_sdp_${idx}`,
          x: duel.x + duel.w / 2,
          y: duel.y + 13,
          vx: duel.facing * (235 + idx * 25),
          vy: vyOff * 0.4,
          radius: 11,
          damage: Math.round(skillDmg * 0.85),
          fromPlayer: false,
          color: '#38bdf8',
          life: 1.8,
          kind: 'rune',
          homingStrength: 95,
        });
      });
    }
  } else if (duel.challengerId === 'kento_nanami') {
    dashVelocityX = duel.facing * 275;
    zones.push({
      id: `jjk_${uid}_nn`,
      x: clampZoneX(playerX, 132),
      y: floorY - 108,
      w: 132,
      h: 108,
      life: 1.3,
      maxLife: 1.3,
      damage: Math.round(skillDmg * 0.9),
      kind: skill.id === 'collapse_ruin' ? 'jjk_collapse_rubble' : 'jjk_domain_ratio',
      hasHit: false,
      telegraphTime: 0.24,
    });
    projectiles.push({
      id: `jjk_${uid}_nnp`,
      x: duel.x + duel.w / 2 + duel.facing * 12,
      y: duel.y + 10,
      vx: duel.facing * 220,
      vy: -95,
      radius: 13,
      damage: skillDmg,
      fromPlayer: false,
      color: skill.color,
      life: 1.7,
      kind: skill.id === 'collapse_ruin' ? 'jjk_collapse_boulder' : 'slash_wave',
      gravityScale: skill.id === 'collapse_ruin' ? 0.55 : 0,
    });
  } else {
    const kindMap: Record<
      string,
      {
        zone: PurpleFlameKind;
        altZone?: PurpleFlameKind;
        proj: Projectile['kind'];
        w: number;
        h: number;
        r: number;
        dash: number;
        homing?: number;
        grav?: number;
        bounce?: boolean;
        drainStam?: number;
        beamLen?: number;
        healRatio?: number;
        tpBehind?: boolean;
      }
    > = {
      black_flash_rush: {
        zone: 'jjk_black_flash',
        altZone: 'jjk_divergent_burst',
        proj: 'jjk_black_flash_orb',
        w: 132,
        h: 116,
        r: 13,
        dash: 325,
        tpBehind: skill.id === 'black_flash_chain',
      },
      cursed_uzumaki: {
        zone: 'jjk_uzumaki_vortex',
        altZone: 'jjk_curse_swarm',
        proj: 'jjk_uzumaki',
        w: 150,
        h: 124,
        r: 15,
        dash: 185,
        homing: 120,
      },
      split_soul_katana: {
        zone: 'jjk_split_soul_slash',
        proj: 'jjk_split_slash',
        w: 136,
        h: 108,
        r: 12,
        dash: 355,
        tpBehind: skill.id === 'split_soul_sever',
      },
      jackpot_pachinko: {
        zone: 'jjk_jackpot_fever',
        altZone: 'jjk_shutter_doors',
        proj: 'jjk_pachinko_ball',
        w: 138,
        h: 114,
        r: 12,
        dash: 260,
        bounce: true,
        healRatio: skill.id === 'jackpot_777_fever' ? 0.14 : 0.05,
      },
      amber_lightning: {
        zone: 'jjk_kashimo_thunder',
        altZone: 'jjk_sky_lightning',
        proj: 'jjk_lightning_bolt',
        w: 136,
        h: 130,
        r: 12,
        dash: 300,
      },
      idle_transfiguration: {
        zone: 'jjk_idle_transfig',
        altZone: 'jjk_soul_spikes',
        proj: 'jjk_transfig_orb',
        w: 138,
        h: 118,
        r: 13,
        dash: 265,
        homing: 80,
      },
      disaster_flames: {
        zone: 'jjk_jogo_volcano',
        altZone: 'jjk_meteor_crater',
        proj: 'jjk_magma_meteor',
        w: 154,
        h: 128,
        r: 15,
        dash: 170,
        grav: 0.48,
      },
      blood_manipulation: {
        zone: 'jjk_piercing_blood',
        altZone: 'jjk_supernova_ring',
        proj: 'jjk_piercing_blood',
        w: 152,
        h: 102,
        r: 12,
        dash: 215,
        beamLen: 44,
      },
      deadly_sentencing: {
        zone: 'jjk_deadly_gavel',
        altZone: 'jjk_gavel_verdict',
        proj: 'jjk_exec_blade',
        w: 138,
        h: 120,
        r: 13,
        dash: 245,
        drainStam: 22,
      },
      straw_doll_resonance: {
        zone: 'jjk_straw_resonance',
        altZone: 'jjk_hairpin_mine',
        proj: 'jjk_cursed_nail',
        w: 128,
        h: 112,
        r: 11,
        dash: 200,
      },
    };
    const cfg = kindMap[skill.kind] ?? {
      zone: 'jjk_black_flash' as PurpleFlameKind,
      proj: 'jjk_black_flash_orb' as Projectile['kind'],
      w: 128,
      h: 110,
      r: 12,
      dash: 250,
    };
    dashVelocityX = duel.facing * cfg.dash;
    if (cfg.tpBehind) teleportBehindPlayer = true;
    if (cfg.healRatio) {
      healAmount = Math.max(12, Math.round(duel.maxHp * cfg.healRatio));
    }
    const useAlt = cfg.altZone && skillIdx % 2 === 0;
    zones.push({
      id: `jjk_nz_${uid}`,
      x: clampZoneX(playerX, cfg.w),
      y: floorY - cfg.h,
      w: cfg.w,
      h: cfg.h,
      life: 1.45,
      maxLife: 1.45,
      damage: Math.round(skillDmg * 0.9),
      kind: useAlt ? cfg.altZone! : cfg.zone,
      hasHit: false,
      telegraphTime: 0.25,
    });
    [-16, 0, 16].forEach((vyOff, idx) => {
      projectiles.push({
        id: `jjk_np_${uid}_${idx}`,
        x: duel.x + duel.w / 2 + duel.facing * 12,
        y: duel.y + 13,
        vx: duel.facing * (245 + idx * 18),
        vy: cfg.grav ? -110 + vyOff * 0.5 : vyOff * 0.6,
        radius: cfg.r,
        damage: Math.round(skillDmg * (idx === 1 ? 1 : 0.76)),
        fromPlayer: false,
        color: skill.color,
        life: 1.85,
        kind: cfg.proj,
        homingStrength: cfg.homing,
        gravityScale: cfg.grav,
        bounceFloor: cfg.bounce,
        drainStamina: cfg.drainStam,
        beamLength: cfg.beamLen,
      });
    });
  }

  return {
    skill,
    projectiles,
    zones,
    dashVelocityX,
    jumpVelocityY,
    healAmount,
    teleportBehindPlayer,
  };
}

export interface ArenaAiStepResult {
  meleeHitDamage: number;
  meleeKnockbackX: number;
  spawnedProjectiles: Projectile[];
  spawnedZones: PurpleFlameZone[];
  usedSkillName: string | null;
  hypeTrigger: boolean;
  healAmount: number;
  teleportBehindPlayer: boolean;
}

/**
 * Highly OP, reactive Jujutsu Kaisen Colosseum AI:
 * - Best-of-3 rounds with countdown freeze & full Domain Expansion for ALL 16 JJK fighters!
 * - Flash-step dodges incoming player attacks & projectiles with brief i-frames + counter-angle lunge.
 * - Activates Cursed Energy Guard when player closes in aggressively.
 * - Chains fast melee combos & 16 unique JJK Cursed Techniques!
 */
export function stepArenaDuelAi(
  duel: ActiveArenaDuel,
  player: PlayerState,
  playerProjectiles: Projectile[],
  platforms: Platform[],
  dt: number,
  bounds: { minX: number; maxX: number },
  floorY = FLOOR_Y,
): ArenaAiStepResult {
  const result: ArenaAiStepResult = {
    meleeHitDamage: 0,
    meleeKnockbackX: 0,
    spawnedProjectiles: [],
    spawnedZones: [],
    usedSkillName: null,
    hypeTrigger: false,
    healAmount: 0,
    teleportBehindPlayer: false,
  };

  if (duel.roundPhase !== 'fighting') {
    duel.vx = 0;
    applyArenaDuelGravityAndPlatforms(duel, platforms, dt, bounds, floorY);
    return result;
  }

  duel.hitFlash = Math.max(0, duel.hitFlash - dt);
  duel.invulnTimer = Math.max(0, duel.invulnTimer - dt);
  duel.guardTimer = Math.max(0, duel.guardTimer - dt);
  duel.dodgeCooldown = Math.max(0, duel.dodgeCooldown - dt);
  duel.attackCooldown = Math.max(0, duel.attackCooldown - dt);
  duel.skillCooldown = Math.max(0, duel.skillCooldown - dt);
  duel.domainCooldown = Math.max(0, duel.domainCooldown - dt);
  if (duel.activeSkillTimer > 0) {
    duel.activeSkillTimer = Math.max(0, duel.activeSkillTimer - dt);
    if (duel.activeSkillTimer === 0) duel.activeSkillBanner = null;
  }

  const domainDef = JJK_DOMAINS[duel.challengerId];

  // Domain Expansion: Active separate dimension lifecycle & continuous world-ending strikes!
  if (duel.domainActive) {
    const prevTimer = duel.domainTimer;
    duel.domainTimer = Math.max(0, duel.domainTimer - dt);
    if (Math.floor(prevTimer / 1.15) !== Math.floor(duel.domainTimer / 1.15) && duel.domainTimer > 0.25) {
      const domainW = 148;
      const zx = Math.max(bounds.minX + 16, Math.min(bounds.maxX - domainW - 16, Math.round(player.x + player.w / 2 - domainW / 2)));
      result.spawnedZones.push({
        id: `jjk_dom_tick_${duel.challengerId}_${Date.now()}_${Math.random()}`,
        x: zx,
        y: floorY - 126,
        w: domainW,
        h: 126,
        life: 1.1,
        maxLife: 1.1,
        damage: Math.max(12, Math.round(duel.matchedAtk * 1.18)),
        kind: domainDef.zoneKind,
        hasHit: false,
      });
    }
    if (duel.domainTimer <= 0) {
      duel.domainActive = false;
    }
  } else if (duel.domainCooldown <= 0 && duel.stunTimer <= 0) {
    duel.domainActive = true;
    duel.domainTimer = 6.8;
    duel.domainCooldown = 14.0;
    duel.domainCastCount += 1;
    duel.activeSkillBanner = domainDef.shout;
    duel.activeSkillTimer = 2.6;
    duel.aiActionTag = 'DOMAIN EXPANSION';
    result.usedSkillName = `DOMAIN EXPANSION: ${domainDef.name}`;
    result.hypeTrigger = true;
    // Initial twin world-ending Domain blasts across the arena floor!
    const offsets = [-120, 120];
    for (const off of offsets) {
      const domainW = 142;
      const zx = Math.max(
        bounds.minX + 16,
        Math.min(bounds.maxX - domainW - 16, Math.round(player.x + off - domainW / 2)),
      );
      result.spawnedZones.push({
        id: `jjk_dom_init_${duel.challengerId}_${off}_${Date.now()}`,
        x: zx,
        y: floorY - 130,
        w: domainW,
        h: 130,
        life: 1.35,
        maxLife: 1.35,
        damage: Math.max(14, Math.round(duel.matchedAtk * 1.35)),
        kind: domainDef.zoneKind,
        hasHit: false,
      });
    }
  }

  if (duel.stunTimer > 0) {
    duel.stunTimer = Math.max(0, duel.stunTimer - dt);
    duel.aiActionTag = 'STUNNED';
    duel.vx *= 0.85;
    applyArenaDuelGravityAndPlatforms(duel, platforms, dt, bounds, floorY);
    return result;
  }

  const centerDuel = duel.x + duel.w / 2;
  const centerPlayer = player.x + player.w / 2;
  const dx = centerPlayer - centerDuel;
  const dist = Math.abs(dx);
  const dy = player.y - duel.y;
  duel.facing = dx >= 0 ? 1 : -1;

  // 1. Reactive OP AI Defense: Flash-Step Dodge incoming player projectiles or close-range windups/active swings!
  const incomingProj = playerProjectiles.some(
    (p) =>
      p.fromPlayer &&
      Math.abs(p.x - centerDuel) < 76 &&
      Math.abs(p.y - (duel.y + duel.h / 2)) < 34 &&
      Math.sign(p.vx) === Math.sign(centerDuel - p.x),
  );
  const playerSwingingClose =
    (player.attackPhase === 'windup' || player.attackPhase === 'active') && dist < 56 && Math.abs(dy) < 36;

  if (
    duel.state !== 'windup' &&
    duel.state !== 'attack' &&
    duel.dodgeCooldown <= 0 &&
    (incomingProj || playerSwingingClose)
  ) {
    duel.state = 'dodge';
    duel.stateTimer = 0.22;
    duel.dodgeCooldown = 1.15;
    duel.invulnTimer = 0.28;
    duel.vx = duel.facing * Math.max(240, duel.matchedSpeed * 1.85);
    if (incomingProj && duel.onGround) {
      duel.vy = -210;
      duel.onGround = false;
    }
    duel.aiActionTag = 'FLASH STEP DODGE';
    result.hypeTrigger = true;
    applyArenaDuelGravityAndPlatforms(duel, platforms, dt, bounds, floorY);
    return result;
  }

  // 2. Cursed Energy Guard if dodge is on cooldown and player is rushing close
  if (
    duel.state === 'approach' &&
    duel.guardTimer <= 0 &&
    duel.dodgeCooldown > 0.25 &&
    playerSwingingClose
  ) {
    duel.state = 'guard';
    duel.stateTimer = 0.42;
    duel.guardTimer = 0.46;
    duel.vx = -duel.facing * 45;
    duel.aiActionTag = 'CURSED GUARD';
  }

  duel.stateTimer -= dt;

  if (duel.state === 'dodge') {
    if (duel.stateTimer <= 0) {
      duel.state = 'windup';
      duel.stateTimer = 0.14;
      duel.aiActionTag = 'COUNTER BLITZ';
    }
  } else if (duel.state === 'guard') {
    duel.vx *= 0.85;
    if (duel.stateTimer <= 0) {
      duel.state = 'approach';
      duel.aiActionTag = null;
    }
  } else if (duel.state === 'windup') {
    duel.vx *= 0.82;
    if (duel.stateTimer <= 0) {
      duel.state = 'attack';
      duel.stateTimer = 0.16;
      duel.comboStep = (duel.comboStep + 1) % 3;
      duel.vx = duel.facing * Math.max(165, duel.matchedSpeed * 1.15);
      duel.attackCooldown = 0.34;
      duel.aiActionTag = duel.comboStep === 2 ? 'HEAVY FINISHER' : 'COMBO STRIKE';
      if (dist <= 52 && Math.abs(dy) <= 38) {
        const mult = duel.comboStep === 2 ? 1.22 : 1.0;
        result.meleeHitDamage = Math.max(10, Math.round(duel.matchedAtk * mult));
        result.meleeKnockbackX = duel.facing * (duel.comboStep === 2 ? 185 : 120);
      }
    }
  } else if (duel.state === 'attack') {
    if (duel.stateTimer <= 0) {
      if (duel.comboStep < 2 && dist <= 58) {
        duel.state = 'windup';
        duel.stateTimer = 0.14;
      } else {
        duel.state = 'recover';
        duel.stateTimer = 0.24;
      }
    }
  } else if (duel.state === 'recover') {
    duel.vx *= 0.82;
    if (duel.stateTimer <= 0) {
      duel.state = 'approach';
      duel.aiActionTag = null;
    }
  } else {
    const chaseSpeed = Math.max(130, duel.matchedSpeed * 1.06);
    if (dist > 34) {
      duel.vx = duel.facing * chaseSpeed;
      duel.walkCycle += dt * 11;
      duel.aiActionTag = duel.domainActive ? 'DOMAIN SURGE' : null;
    } else {
      duel.vx *= 0.7;
    }

    if (duel.onGround && dy < -32 && dist < 170) {
      duel.vy = -315;
      duel.onGround = false;
      duel.aiActionTag = 'AERIAL INTERCEPT';
    }

    if (duel.skillCooldown <= 0 && dist <= 360) {
      duel.skillCooldown = duel.domainActive ? 1.55 : 2.0;
      duel.skillIndex = (duel.skillIndex + 1) % duel.def.skills.length;
      const cast = createArenaSkillAttack(duel, duel.skillIndex, player.x, floorY);
      duel.activeSkillBanner = cast.skill.shout;
      duel.activeSkillTimer = 1.55;
      duel.aiActionTag = cast.skill.name.toUpperCase();
      if (cast.teleportBehindPlayer) {
        duel.x = Math.max(
          bounds.minX + 20,
          Math.min(bounds.maxX - duel.w - 20, player.x - player.facing * 42),
        );
        duel.facing = player.facing;
        result.teleportBehindPlayer = true;
      }
      if (cast.healAmount > 0) {
        duel.hp = Math.min(duel.maxHp, duel.hp + cast.healAmount);
        result.healAmount = cast.healAmount;
      }
      if (cast.dashVelocityX !== 0) duel.vx = cast.dashVelocityX;
      if (cast.jumpVelocityY !== 0 && duel.onGround) {
        duel.vy = cast.jumpVelocityY;
        duel.onGround = false;
      }
      result.spawnedProjectiles.push(...cast.projectiles);
      result.spawnedZones.push(...cast.zones);
      result.usedSkillName = cast.skill.name;
      result.hypeTrigger = true;
      duel.state = 'recover';
      duel.stateTimer = 0.24;
    } else if (dist <= 46 && Math.abs(dy) <= 42 && duel.attackCooldown <= 0) {
      duel.state = 'windup';
      duel.stateTimer = 0.16;
      duel.aiActionTag = 'STRIKE WINDUP';
    }
  }

  applyArenaDuelGravityAndPlatforms(duel, platforms, dt, bounds, floorY);
  return result;
}

function applyArenaDuelGravityAndPlatforms(
  duel: ActiveArenaDuel,
  platforms: Platform[],
  dt: number,
  bounds: { minX: number; maxX: number },
  floorY: number,
): void {
  const prevBottom = duel.y + duel.h;
  duel.vy = Math.min(540, duel.vy + GRAVITY * dt);
  duel.x += duel.vx * dt;
  duel.y += duel.vy * dt;
  duel.x = Math.max(bounds.minX + 12, Math.min(bounds.maxX - duel.w - 12, duel.x));

  duel.onGround = false;
  if (duel.vy >= 0) {
    for (const p of platforms) {
      const horizontallyInside = duel.x + duel.w > p.x + 2 && duel.x < p.x + p.w - 2;
      if (horizontallyInside && prevBottom <= p.y + 8 && duel.y + duel.h >= p.y) {
        duel.y = p.y - duel.h;
        duel.vy = 0;
        duel.onGround = true;
        break;
      }
    }
  }
  if (!duel.onGround && duel.y + duel.h >= floorY) {
    duel.y = floorY - duel.h;
    duel.vy = 0;
    duel.onGround = true;
  }
}

export const TOWN_RAID_INTERVAL_SECONDS = 300; // Every 5 minutes
export const TOWN_RAID_REWARD_GOLD = 1000;

export function createTownHouseStates(): TownHouseDamage[] {
  return TOWN_RANDOM_HOUSES.map((h, index) => ({
    index,
    x: h.x,
    w: h.w,
    h: h.h,
    hp: 180,
    maxHp: 180,
    broken: false,
    hitFlash: 0,
  }));
}

export function promoteGuildRankDirect(
  currentRank: GuildRank,
  inventory: InventoryItem[],
): { nextRank: GuildRank; promoted: boolean } {
  if (currentRank === 'S') {
    return { nextRank: 'S', promoted: false };
  }
  const nextRank = getNextGuildRank(currentRank);
  const badge = inventory.find((it) => it.id.startsWith('rank_badge_'));
  if (badge) {
    badge.id = `rank_badge_${nextRank.toLowerCase()}`;
    badge.name = `${nextRank}-Rank Guild Badge`;
    badge.description = `${RANK_TITLES[nextRank]} badge issued by the Royal Adventurer Guild.`;
    badge.color =
      nextRank === 'S'
        ? '#fbbf24'
        : nextRank === 'A'
          ? '#e11d48'
          : nextRank === 'B'
            ? '#38bdf8'
            : '#a7f3d0';
  }
  return {
    nextRank,
    promoted: nextRank !== currentRank,
  };
}

export function createTownRaidBoss(
  raiderId: TownRaiderId,
  playerMaxHp: number,
  playerAttack: number,
  spawnX?: number,
): ActiveTownRaid {
  const isRimuru = raiderId === 'rimuru_tempest';
  const hp = Math.max(480, Math.round(playerMaxHp * 12));
  const atk = Math.max(8, Math.round(playerAttack));
  const w = 38;
  const h = 52;
  const x = spawnX ?? (isRimuru ? 1480 : 1060);
  return {
    raiderId,
    name: isRimuru ? 'Rimuru Tempest' : 'Goblin Slayer',
    title: isRimuru ? 'True Demon Lord Slime · Town Raider' : 'Silver-Rank Exterminator · Town Raider',
    x,
    y: FLOOR_Y - h,
    vx: 0,
    vy: 0,
    w,
    h,
    hp,
    maxHp: hp,
    attackDamage: atk,
    facing: -1,
    onGround: true,
    state: 'march',
    stateTimer: 0.4,
    aoeCooldown: 1.4,
    attackCooldown: 0.6,
    castIndex: 0,
    targetHouseIdx: null,
    hitFlash: 0,
    walkCycle: 0,
    activeSkillBanner: null,
    activeSkillTimer: 0,
    stunTimer: 0,
    windVulnerable: false,
    lastSkillThresholdPct: 100,
  };
}

export function stepTownRaidAi(
  raid: ActiveTownRaid,
  player: PlayerState,
  houses: TownHouseDamage[],
  dt: number,
  bounds: { minX: number; maxX: number },
  floorY: number,
): {
  spawnedZones: PurpleFlameZone[];
  spawnedProjectiles: Projectile[];
  meleeHitDamage: number;
  meleeKnockbackX: number;
  usedSkillName: string | null;
  damagedHouseIndices: number[];
  brokenHouseIndices: number[];
} {
  // Always keep raider attack synchronized with player's own damage!
  const playerBaseDmg = Math.max(8, Math.round(calculateAttackDamage(player, 1, false)));
  raid.attackDamage = playerBaseDmg;
  raid.hitFlash = Math.max(0, raid.hitFlash - dt);
  raid.aoeCooldown = Math.max(0, raid.aoeCooldown - dt);
  raid.attackCooldown = Math.max(0, raid.attackCooldown - dt);
  raid.activeSkillTimer = Math.max(0, raid.activeSkillTimer - dt);
  if (raid.activeSkillTimer <= 0) raid.activeSkillBanner = null;

  const result: {
    spawnedZones: PurpleFlameZone[];
    spawnedProjectiles: Projectile[];
    meleeHitDamage: number;
    meleeKnockbackX: number;
    usedSkillName: string | null;
    damagedHouseIndices: number[];
    brokenHouseIndices: number[];
  } = {
    spawnedZones: [],
    spawnedProjectiles: [],
    meleeHitDamage: 0,
    meleeKnockbackX: 0,
    usedSkillName: null,
    damagedHouseIndices: [],
    brokenHouseIndices: [],
  };

  if ((raid.stunTimer ?? 0) > 0) {
    raid.stunTimer = Math.max(0, (raid.stunTimer ?? 0) - dt);
    raid.vx *= 0.8;
    return result;
  }

  // Every time Town Raid boss HP drops by 12%, force an immediate AoE skill cast!
  raid.lastSkillThresholdPct ??= 100;
  const raidHpPct = (raid.hp / Math.max(1, raid.maxHp)) * 100;
  if (raid.hp > 0 && raidHpPct <= raid.lastSkillThresholdPct - 12) {
    while (raid.lastSkillThresholdPct - 12 >= raidHpPct && raid.lastSkillThresholdPct > 0) {
      raid.lastSkillThresholdPct -= 12;
    }
    raid.aoeCooldown = 0;
    raid.state = 'aoe_cast';
    raid.stateTimer = 0;
  }

  const raidCenter = raid.x + raid.w / 2;
  const playerCenter = player.x + player.w / 2;
  const distToPlayer = Math.abs(playerCenter - raidCenter);

  // Pick nearest unbroken house to smash if player isn't right next to raider
  let targetHouse: TownHouseDamage | null = null;
  let bestHouseDist = 999999;
  for (const h of houses) {
    if (h.broken) continue;
    const d = Math.abs(h.x + h.w / 2 - raidCenter);
    if (d < bestHouseDist) {
      bestHouseDist = d;
      targetHouse = h;
    }
  }
  raid.targetHouseIdx = targetHouse ? targetHouse.index : null;

  // Target selection: prioritize fighting player within 230px, otherwise rampage toward nearest intact town house!
  const engagePlayer = distToPlayer <= 230 || !targetHouse;
  const targetX = engagePlayer ? playerCenter : targetHouse!.x + targetHouse!.w / 2;
  const dx = targetX - raidCenter;
  const dist = Math.abs(dx);
  raid.facing = dx >= 0 ? 1 : -1;
  raid.stateTimer -= dt;

  const damageHousesInRange = (cx: number, halfSpan: number, dmgAmount: number) => {
    for (const h of houses) {
      if (h.broken) continue;
      const hx1 = h.x;
      const hx2 = h.x + h.w;
      if (hx2 >= cx - halfSpan && hx1 <= cx + halfSpan) {
        h.hp = Math.max(0, h.hp - dmgAmount);
        h.hitFlash = 0.35;
        result.damagedHouseIndices.push(h.index);
        if (h.hp <= 0) {
          h.broken = true;
          result.brokenHouseIndices.push(h.index);
        }
      }
    }
  };

  if (raid.aoeCooldown <= 0 && (dist <= 300 || targetHouse)) {
    raid.aoeCooldown = 2.65;
    raid.castIndex = (raid.castIndex + 1) % 3;
    const isRimuru = raid.raiderId === 'rimuru_tempest';
    const aoeDmg = Math.max(10, Math.round(raid.attackDamage * 1.15));
    const houseAoEDmg = 95;

    if (isRimuru) {
      if (raid.castIndex === 0) {
        result.usedSkillName = 'MEGIDDO · GOD\'S WRATH';
        for (const ox of [-90, 0, 90]) {
          const zx = Math.max(bounds.minX + 10, Math.min(bounds.maxX - 96, targetX + ox - 44));
          result.spawnedZones.push({
            id: `rim_meg_${Date.now()}_${Math.random()}`,
            x: zx,
            y: floorY - 110,
            w: 88,
            h: 110,
            life: 1.55,
            maxLife: 1.55,
            damage: aoeDmg,
            kind: 'rimuru_megiddo',
            hasHit: false,
          });
          damageHousesInRange(zx + 44, 52, houseAoEDmg);
        }
      } else if (raid.castIndex === 1) {
        result.usedSkillName = 'BLACK LIGHTNING · KUROI INAZUMA';
        for (const ox of [-56, 56]) {
          const zx = Math.max(bounds.minX + 10, Math.min(bounds.maxX - 110, raidCenter + ox - 50));
          result.spawnedZones.push({
            id: `rim_lit_${Date.now()}_${Math.random()}`,
            x: zx,
            y: floorY - 122,
            w: 100,
            h: 122,
            life: 1.4,
            maxLife: 1.4,
            damage: aoeDmg,
            kind: 'rimuru_black_lightning',
            hasHit: false,
          });
          damageHousesInRange(zx + 50, 62, houseAoEDmg);
        }
        result.spawnedProjectiles.push(
          {
            id: `rim_orb1_${Math.random()}`,
            x: raidCenter,
            y: raid.y + 20,
            vx: -230,
            vy: 0,
            radius: 7,
            damage: raid.attackDamage,
            fromPlayer: false,
            color: '#a855f7',
            life: 2.2,
            kind: 'succubus_orb',
          },
          {
            id: `rim_orb2_${Math.random()}`,
            x: raidCenter,
            y: raid.y + 20,
            vx: 230,
            vy: 0,
            radius: 7,
            damage: raid.attackDamage,
            fromPlayer: false,
            color: '#38bdf8',
            life: 2.2,
            kind: 'succubus_orb',
          },
        );
      } else {
        result.usedSkillName = 'BEELZEBUTH · GLUTTONY VORTEX';
        const zx = Math.max(bounds.minX + 10, Math.min(bounds.maxX - 140, targetX - 68));
        result.spawnedZones.push({
          id: `rim_gl_${Date.now()}_${Math.random()}`,
          x: zx,
          y: floorY - 96,
          w: 136,
          h: 96,
          life: 1.75,
          maxLife: 1.75,
          damage: aoeDmg,
          kind: 'rimuru_beelzebuth',
          hasHit: false,
        });
        damageHousesInRange(zx + 68, 80, houseAoEDmg + 25);
      }
    } else {
      // Goblin Slayer Signature Full-Power AoEs!
      if (raid.castIndex === 0) {
        result.usedSkillName = 'GATE SCROLL · DEEP-SEA TORRENT';
        const zx = Math.max(bounds.minX + 10, Math.min(bounds.maxX - 135, targetX - 64));
        result.spawnedZones.push({
          id: `gs_gate_${Date.now()}_${Math.random()}`,
          x: zx,
          y: floorY - 102,
          w: 128,
          h: 102,
          life: 1.5,
          maxLife: 1.5,
          damage: aoeDmg,
          kind: 'gs_gate_scroll',
          hasHit: false,
        });
        damageHousesInRange(zx + 64, 78, houseAoEDmg + 30);
      } else if (raid.castIndex === 1) {
        result.usedSkillName = 'SILVER BUCKLER · TREMOR SHOCK';
        const zx = Math.max(bounds.minX + 10, Math.min(bounds.maxX - 130, raidCenter - 62));
        result.spawnedZones.push({
          id: `gs_sh_${Date.now()}_${Math.random()}`,
          x: zx,
          y: floorY - 76,
          w: 124,
          h: 76,
          life: 1.35,
          maxLife: 1.35,
          damage: aoeDmg,
          kind: 'gs_shield_shock',
          hasHit: false,
        });
        damageHousesInRange(zx + 62, 74, houseAoEDmg);
      } else {
        result.usedSkillName = 'INCENDIARY FLOUR & TORCH BLAST';
        for (const ox of [-58, 58]) {
          const zx = Math.max(bounds.minX + 10, Math.min(bounds.maxX - 104, targetX + ox - 48));
          result.spawnedZones.push({
            id: `gs_oil_${Date.now()}_${Math.random()}`,
            x: zx,
            y: floorY - 90,
            w: 96,
            h: 90,
            life: 1.6,
            maxLife: 1.6,
            damage: aoeDmg,
            kind: 'gs_oil_bomb',
            hasHit: false,
          });
          damageHousesInRange(zx + 48, 56, houseAoEDmg);
        }
        result.spawnedProjectiles.push({
          id: `gs_knife_${Math.random()}`,
          x: raidCenter,
          y: raid.y + 22,
          vx: raid.facing * 245,
          vy: 0,
          radius: 5,
          damage: raid.attackDamage,
          fromPlayer: false,
          color: '#f97316',
          life: 1.8,
          kind: 'arrow',
        });
      }
    }
    raid.activeSkillBanner = result.usedSkillName;
    raid.activeSkillTimer = 1.65;
    raid.state = 'recover';
    raid.stateTimer = 0.35;
  } else if (raid.state === 'windup') {
    raid.vx *= 0.8;
    if (raid.stateTimer <= 0) {
      raid.state = 'attack';
      raid.stateTimer = 0.2;
      raid.vx = raid.facing * 155;
      raid.attackCooldown = 0.85;
      if (distToPlayer <= 66 && Math.abs(player.y + player.h - (raid.y + raid.h)) <= 48) {
        result.meleeHitDamage = raid.attackDamage;
        result.meleeKnockbackX = raid.facing * 175;
      }
      damageHousesInRange(raidCenter + raid.facing * 26, 48, 65);
    }
  } else if (raid.state === 'attack') {
    if (raid.stateTimer <= 0) {
      raid.state = 'recover';
      raid.stateTimer = 0.3;
    }
  } else if (raid.state === 'recover') {
    raid.vx *= 0.82;
    if (raid.stateTimer <= 0) {
      raid.state = 'march';
    }
  } else {
    const moveSpd = raid.raiderId === 'rimuru_tempest' ? 112 : 104;
    if (dist > 44) {
      raid.vx = raid.facing * moveSpd;
      raid.walkCycle += dt * 9;
    } else {
      raid.vx *= 0.7;
      if (raid.attackCooldown <= 0) {
        raid.state = 'windup';
        raid.stateTimer = 0.24;
      }
    }
  }

  raid.vy = Math.min(540, raid.vy + GRAVITY * dt);
  raid.x += raid.vx * dt;
  raid.y += raid.vy * dt;
  raid.x = Math.max(bounds.minX + 12, Math.min(bounds.maxX - raid.w - 12, raid.x));
  if (raid.y + raid.h >= floorY) {
    raid.y = floorY - raid.h;
    raid.vy = 0;
    raid.onGround = true;
  }
  return result;
}

/**
 * When no Town Raid is active, townsfolk NPCs gather around damaged/wrecked houses
 * and hammer together to rebuild them back to 100%, then resume their patrol routes.
 */
export function stepTownRebuildNpcs(
  npcs: IsekaiNpc[],
  houses: TownHouseDamage[],
  dt: number,
): { completedIndices: number[]; activeRebuilders: number } {
  const damaged = houses.filter((h) => h.broken || h.hp < h.maxHp);
  const completedIndices: number[] = [];

  for (const h of houses) {
    h.rebuilding = false;
  }

  if (damaged.length === 0) {
    for (const npc of npcs) {
      if (npc.rebuildingHouseIndex != null) {
        npc.rebuildingHouseIndex = null;
        npc.hammerPhase = 0;
        if (npc.homeMinX != null && npc.homeMaxX != null) {
          npc.minX = npc.homeMinX;
          npc.maxX = npc.homeMaxX;
        }
      }
    }
    return { completedIndices, activeRebuilders: 0 };
  }

  const eligibleNpcs = npcs.filter((n) => !n.sitting && !n.id.includes('onsen') && n.x < 2450);
  let activeRebuilders = 0;

  eligibleNpcs.forEach((npc, idx) => {
    if (npc.homeMinX == null) npc.homeMinX = npc.minX;
    if (npc.homeMaxX == null) npc.homeMaxX = npc.maxX;

    const targetHouse = damaged[idx % damaged.length];
    const workSpotX = targetHouse.x + Math.round(targetHouse.w * (0.28 + ((idx % 3) * 0.2)));
    npc.rebuildingHouseIndex = targetHouse.index;

    const dx = workSpotX - npc.x;
    if (Math.abs(dx) > 10) {
      npc.facing = dx > 0 ? 1 : -1;
      npc.x += npc.facing * Math.max(46, npc.speed * 1.45) * dt;
      npc.walkCycle += dt * 9;
      npc.hammerPhase = (npc.hammerPhase ?? 0) + dt * 4;
    } else {
      npc.x = workSpotX;
      npc.facing = ((idx % 2) === 0 ? 1 : -1) as 1 | -1;
      npc.hammerPhase = (npc.hammerPhase ?? 0) + dt * 11;
      targetHouse.rebuilding = true;
      activeRebuilders += 1;
      const beforeBroken = targetHouse.broken;
      targetHouse.hp = Math.min(targetHouse.maxHp, targetHouse.hp + 26 * dt);
      if (targetHouse.hp >= targetHouse.maxHp) {
        targetHouse.hp = targetHouse.maxHp;
        targetHouse.broken = false;
        targetHouse.rebuilding = false;
        if (beforeBroken && !completedIndices.includes(targetHouse.index)) {
          completedIndices.push(targetHouse.index);
        }
      }
    }
  });

  return { completedIndices, activeRebuilders };
}

export interface ElfCutsceneBeatDef {
  speaker: string;
  speakerTitle: string;
  portraitKind: 'queen' | 'swordsman' | 'herald' | 'boss' | 'warrior';
  moodLabel: string;
  lines: string[];
  choices?: (ElfCutsceneChoiceHud & {
    healFull?: boolean;
    bonusGold?: number;
    atkBoostMult?: number;
    atkBoostSec?: number;
  })[];
}

export function createElfKingdomNpcs(stage: ElfKingdomStage): IsekaiNpc[] {
  const isCelebration = stage === 'celebration';
  const npcs: IsekaiNpc[] = [
    {
      id: 'elf_sentinel_gate',
      name: 'Sentinel Vaelor',
      role: 'guard',
      x: 265,
      y: FLOOR_Y - 26,
      minX: 190,
      maxX: 390,
      speed: 20,
      facing: 1,
      walkCycle: 0.4,
      coatColor: '#065f46',
      hairColor: '#e2e8f0',
      shirtColor: '#d1fae5',
      dialogue: isCelebration
        ? [
            'To think a mortal guest cut down an abyssal flesh-sovereign beside Sword Saint Kaelen!',
            'The lanterns of Aethelgard will burn emerald in your honor all season, Crowned Champion!',
          ]
        : [
            'Halt—ah, you carry the Moon-Crest Seal! Welcome across the Silver-Bough Moon-Gate.',
            'Head east past the Silver Fountain Promenade to reach the Grand Banquet Hall.',
          ],
    },
    {
      id: 'elf_chronicler_lyra',
      name: 'Chronicler Lyra',
      role: 'adventurer',
      x: 730,
      y: FLOOR_Y - 26,
      minX: 640,
      maxX: 850,
      speed: 22,
      facing: -1,
      walkCycle: 1.2,
      coatColor: '#0f766e',
      hairColor: '#fef08a',
      shirtColor: '#f8fafc',
      dialogue: isCelebration
        ? [
            'Every quill in the Royal Archive is smoking! "The Banquet of Ichor & Starlight" is already our proudest ballad!',
          ]
        : [
            'I am recording every toast of Queen Sylvaria’s Royal Dinner Party tonight!',
            'Wait... did you hear wet scraping under the silver fountain too, or is the vintage star-wine playing tricks?',
          ],
    },
    {
      id: 'elf_sommelier_theren',
      name: 'Sommelier Theren',
      role: 'merchant',
      x: 1470,
      y: FLOOR_Y - 26,
      minX: 1380,
      maxX: 1585,
      speed: 18,
      facing: 1,
      walkCycle: 2.0,
      coatColor: '#7c2d12',
      hairColor: '#cbd5e1',
      shirtColor: '#fef3c7',
      dialogue: isCelebration
        ? [
            'Open every cellar cask! Starlight Ambrosia flows free tonight for the Crowned Savior of Aethelgard!',
          ]
        : [
            'Three-hundred-year Moon-Dew Vintage and roasted silver-pheasant await at the Grand Table just ahead!',
            'Though honestly... the cellar barrels have been shaking violently all evening.',
          ],
    },
    {
      id: 'elf_courtier_elara',
      name: 'Lady Elara',
      role: 'townfolk',
      x: 2050,
      y: FLOOR_Y - 26,
      minX: 1930,
      maxX: 2180,
      speed: -20,
      facing: -1,
      walkCycle: 0.9,
      coatColor: '#047857',
      hairColor: '#f5d0fe',
      shirtColor: '#ecfdf5',
      dialogue: isCelebration
        ? [
            'That emerald crown gleams so fiercely on you! Please stay and dance beneath the star-lanterns!',
          ]
        : [
            'How thrilling to dine with an otherworlder knight! Just... stay close to Sword Saint Kaelen if the floor trembles.',
          ],
    },
    {
      id: 'elf_steward_vaelen',
      name: 'Steward Vaelen',
      role: 'receptionist',
      x: 2450,
      y: FLOOR_Y - 26 - 26,
      minX: 2410,
      maxX: 2510,
      speed: 12,
      facing: -1,
      walkCycle: 0.2,
      coatColor: '#1e293b',
      hairColor: '#94a3b8',
      shirtColor: '#fbbf24',
      dialogue: isCelebration
        ? [
            'Long live Queen Sylvaria and our newly crowned Sovereign Guest of Aethelgard!',
          ]
        : [
            'Her Majesty awaits at the Sovereign Emerald Dais, while tonight’s Grand Feast is laid out at the Banquet Table.',
          ],
    },
  ];
  return npcs;
}

export function createElfSwordsmanAlly(): AlliedNpc {
  return {
    id: 'ally_kaelen_sword_saint',
    name: 'Sword Saint Kaelen',
    role: 'elf_swordsman',
    x: 1380,
    y: FLOOR_Y - 28,
    vx: 0,
    facing: 1,
    hp: 2400,
    maxHp: 2400,
    attackCooldown: 0.15,
    walkCycle: 0,
    hitFlash: 0,
    armorColor: '#ecfdf5',
    cloakColor: '#065f46',
    weaponColor: '#34d399',
    dashTimer: 0,
    slashBurstTimer: 0,
    callout: 'Step aside, flesh-filth. Starlight Tempests spare nothing.',
    calloutTimer: 2.2,
  };
}

export function createElfAmbushWave(wave: 1 | 2, playerLevel = 1): EnemyState[] {
  const lvlMult = Math.max(1, 1 + (Math.max(1, playerLevel) - 1) * 0.14);
  if (wave === 1) {
    const specs: { arch: EnemyArchetype; name: string; x: number; w: number; h: number; hp: number; dmg: number }[] = [
      { arch: 'eldritch_ichor_hound', name: 'Ichor-Hound Stalker', x: 1490, w: 22, h: 24, hp: 165, dmg: 18 },
      { arch: 'eldritch_tendril_fiend', name: 'Marrow-Tendril Maw', x: 1680, w: 24, h: 32, hp: 235, dmg: 22 },
      { arch: 'eldritch_ichor_hound', name: 'Bone-Spur Gorger', x: 1890, w: 22, h: 24, hp: 175, dmg: 19 },
      { arch: 'eldritch_tendril_fiend', name: 'Viscera-Choir Weaver', x: 2080, w: 24, h: 32, hp: 250, dmg: 24 },
      { arch: 'eldritch_ichor_hound', name: 'Crimson Bile-Reaver', x: 2240, w: 22, h: 24, hp: 185, dmg: 20 },
    ];
    return specs.map((s, idx) =>
      makeEnemy(
        `elf_w1_${Date.now()}_${idx}`,
        s.arch,
        s.name,
        s.x,
        FLOOR_Y - s.h,
        Math.round(s.hp * lvlMult),
        s.w,
        s.h,
        'volcano',
        Math.round(52 * lvlMult),
        Math.round(s.dmg * lvlMult),
        false,
        1.1,
        0.1,
      ),
    );
  }

  const wave2Specs: {
    arch: EnemyArchetype;
    name: string;
    x: number;
    w: number;
    h: number;
    hp: number;
    dmg: number;
    boss?: boolean;
    scale?: number;
  }[] = [
    { arch: 'eldritch_ichor_hound', name: 'Sanguine Rib-Hound', x: 1460, w: 22, h: 24, hp: 195, dmg: 21 },
    { arch: 'eldritch_tendril_fiend', name: 'Flesh-Hymn Cantor', x: 1640, w: 24, h: 32, hp: 265, dmg: 24 },
    {
      arch: 'eldritch_feast_boss',
      name: 'Malakor, the Feast-Devourer',
      x: 1920,
      w: 44,
      h: 54,
      hp: 1680,
      dmg: 30,
      boss: true,
      scale: 1.25,
    },
    { arch: 'eldritch_tendril_fiend', name: 'Abyssal Spine-Gorgon', x: 2150, w: 24, h: 32, hp: 270, dmg: 24 },
  ];
  return wave2Specs.map((s, idx) =>
    makeEnemy(
      `elf_w2_${Date.now()}_${idx}`,
      s.arch,
      s.name,
      s.x,
      FLOOR_Y - s.h,
      Math.round(s.hp * lvlMult),
      s.w,
      s.h,
      'volcano',
      s.boss ? Math.round(320 * lvlMult) : Math.round(64 * lvlMult),
      Math.round(s.dmg * lvlMult),
      Boolean(s.boss),
      s.scale ?? 1.12,
      s.boss ? 0.15 : 0.1,
    ),
  );
}

export function buildElfDinnerCutsceneBeats(): ElfCutsceneBeatDef[] {
  return [
    {
      speaker: 'Queen Sylvaria',
      speakerTitle: 'Sovereign of Aethelgard',
      portraitKind: 'queen',
      moodLabel: 'Candlelit Royal Welcome',
      lines: [
        'Raise your chalices, House Silver-Bough! Tonight our table honors the wandering knight whose blade echoed from Bastera Citadel to Solaris Plaza.',
        'Drink deep of three-century Star-Wine and feast until dawn—for inside these alabaster walls, no shadow dares intrude.',
      ],
    },
    {
      speaker: 'Sommelier Theren',
      speakerTitle: 'Keeper of the Royal Table',
      portraitKind: 'herald',
      moodLabel: 'Crystal Decanters Gleaming',
      lines: [
        'Your goblet awaits, Honored Guest! How do you answer Her Majesty’s royal toast before the first course is carved?',
      ],
      choices: [
        {
          id: 'elf_toast_courtesy',
          label: '“To eternal friendship between Solaris and Aethelgard!” (+25G Royal Gift)',
          reply: 'Queen Sylvaria smiles warmly and signals the Steward to press an Elven moon-gold coin pouch into your palm.',
          bonusTag: '+25G ROYAL GIFT',
          bonusGold: 25,
        },
        {
          id: 'elf_toast_feast',
          label: '“Skip the speech—this roasted silver-pheasant smells unreal!” (Full HP & Stamina)',
          reply: 'The Elven courtiers burst out laughing as you devour two platters in three seconds—vitality surging through your veins!',
          bonusTag: 'FULL HP + STAMINA',
          healFull: true,
        },
        {
          id: 'elf_toast_blade',
          label: '“I’ll toast once we check what’s rattling beneath the marble floor.” (+20% ATK Boost)',
          reply: 'Sword Saint Kaelen smirks approvingly as you keep one gauntlet on your hilt, battle instincts razor-sharp!',
          bonusTag: '+20% ATK (60s)',
          atkBoostMult: 1.2,
          atkBoostSec: 60,
        },
      ],
    },
    {
      speaker: 'Sword Saint Kaelen',
      speakerTitle: 'First Blade of the Elf Kingdom',
      portraitKind: 'swordsman',
      moodLabel: 'Hand Tightening on Emerald Hilt',
      lines: [
        'Everyone put your forks down. Look at the star-wine in the crystal goblets—the ripples aren’t coming from the musicians.',
        'Something wet, starved, and ancient just chewed through the World-Root seal beneath the banquet hall.',
      ],
    },
    {
      speaker: 'Malakor, the Feast-Devourer',
      speakerTitle: 'Voice Beneath the Shattered Marble',
      portraitKind: 'boss',
      moodLabel: 'CHANDELIERS SHATTER · ICHOR ERUPTS',
      lines: [
        'SCREEEEECH—SUCH FRAGRANT ELVEN MARROW AND IRON-RICH HERO BLOOD!!',
        'Black-crimson ichor geysers split the banquet floor! Jagged bone spurs and writhing flesh-tendrils burst among the overturned tables!',
      ],
    },
    {
      speaker: 'Sword Saint Kaelen',
      speakerTitle: 'Blademaster Ally · Real-Time Combat',
      portraitKind: 'swordsman',
      moodLabel: 'Emerald Aura Ignited',
      lines: [
        'Protect the Queen and guests! Stay on your toes, Hero—we carve these eldritch horrors back into the abyss together!',
      ],
    },
  ];
}

export function buildElfCoronationCutsceneBeats(): ElfCutsceneBeatDef[] {
  return [
    {
      speaker: 'Sword Saint Kaelen',
      speakerTitle: 'First Blade of the Elf Kingdom',
      portraitKind: 'swordsman',
      moodLabel: 'Sheathing Emerald-Silver Katana',
      lines: [
        'Hmph... not bad at all, Outsider. Most knights freeze when an eldritch choir opens its ribs in front of them.',
        'The abyssal fissure is cauterized. You earned a place beside Aethelgard’s finest.',
      ],
    },
    {
      speaker: 'Queen Sylvaria',
      speakerTitle: 'Sovereign of Aethelgard',
      portraitKind: 'queen',
      moodLabel: 'Royal Emerald Coronation',
      lines: [
        'Kneel, Savior of the Silver-Bough Feast. Though our dinner was torn open by nightmares, your steel kept every courtier breathing.',
        'Accept the Living Emerald Crown of Aethelgard—forged from mithril and World-Root crystal!',
      ],
    },
    {
      speaker: 'Royal Herald Thalindor',
      speakerTitle: 'Aethelgard Royal Feast Master',
      portraitKind: 'herald',
      moodLabel: 'STAR-LANTERNS LIT · ROYAL FEAST BEGINS',
      lines: [
        'All hail our Crowned Champion! Relight the chandeliers, sweep the marble clean, and let the Eternal Royal Feast of Aethelgard begin!',
      ],
    },
  ];
}


