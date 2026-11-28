import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOSSES_PER_BIOME,
  BOSS_DEFEATED_SCALING_BASE,
  ORB_DROP_CHANCE,
  POTION_SHOP_IDS,
  STANDS,
  STAND_ORDER,
  STAND_SKILL_TAGS,
  TOTAL_BOSSES,
  TOTAL_HIDDEN_PASSAGES,
  WEAPONS,
  WEAPON_SHOP_ORDER,
  calculateCitadelBossHalfAtk,
  createGyroZeppeliBossDef,
  getBiomeForBossIndex,
  getBossDef,
  getBossDefeatedMultiplier,
  getBossDifficultyMultiplier,
  getStarStoneRewardForJjkEnemy,
  pickJoJoSkillDialogue,
} from './data';
import { CHUNK_WIDTH, FLOOR_Y, generateChunk, getBiomeForChunk } from './worldGen';
import {
  STAND_GUARD_COOLDOWN,
  STAND_GUARD_DURATION,
  WHITE_AURA_COOLDOWN,
  WHITE_AURA_DURATION,
  WHITE_AURA_SPEED_MULTIPLIER,
  activateStandGuard,
  activateWhiteAuraDash,
  addInventoryResource,
  allocateStatPoint,
  applyDamageToBoss,
  assignSkillToSlot,
  buyOrEquipStand,
  calculateAttackDamage,
  computeWeaponHitbox,
  craftWeapon,
  createInitialInventory,
  createInitialPlayer,
  equipWeapon,
  getMonsterLevelMultiplier,
  grantKillStatPoints,
  recordBossFightProgress,
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
  createBossBattleState,
  resolveBattleOrb,
  resolveBattlePotion,
  resolvePlayerBattleSkill,
  resolvePlayerBattleSword,
  startBattleEscape,
  startBattleRun,
  triggerBossCounterTurn,
} from './battle';
import {
  MEGA_BOSS_SPAWN_CHANCE,
  createMegaBossDef,
  createMegaBossInstance,
  shouldTriggerMegaBossGlitch,
} from './megaBoss';
import {
  canPlayerEngageBoss,
  createSavePayload,
  normalizeLoadedSave,
  toSaveSummary,
} from './saveSystem';
import {
  ARENA_CHALLENGERS,
  GUILD_MISSIONS,
  ISEKAI_IDLE_TRANSPORT_SECONDS,
  ISEKAI_ROOM_BOUNDS,
  JJK_DOMAINS,
  MISSIONS_REQUIRED_PER_RANK,
  PURPLE_FLAME_SKILLS,
  SEVENTEEN_MANHWA_DEMON_KINGS,
  SIDE_QUESTS,
  TOWN_RAID_INTERVAL_SECONDS,
  TOWN_RAID_REWARD_GOLD,
  WARDROBE_CATALOG,
  applyHotSpringRest,
  applySideQuestDialogueChoice,
  buildIsekaiRoomInteractables,
  buildIsekaiRoomPlatforms,
  buyOrEquipWardrobeItem,
  buyOrEquipWeaponShopItem,
  buyPotionShopItem,
  canAccessGuildFloor2,
  canStartGuildMission,
  createArenaDuelInit,
  createBanditWave,
  createDemonKingPurpleFlameCast,
  createDemonKingStageMinions,
  createDemonRealmWave,
  createDungeonSectorEnemies,
  createGoblinDungeonWave,
  createGuildNpcs,
  createInitialSideQuestProgress,
  createOutskirtsAmbientEnemies,
  createSeventeenDemonKingsInit,
  createSideQuestBossEnemy,
  createThreeDemonKingsInit,
  createTownHouseStates,
  createTownNpcs,
  createTownRaidBoss,
  getIsekaiDayNightState,
  isQuestTargetEnemyKill,
  parseCaravanDestination,
  promoteGuildRankAfterMission,
  promoteGuildRankDirect,
  resetPlayerForIsekai,
  shouldIdleTriggerIsekai,
  stepArenaDuelAi,
  stepIsekaiNpcs,
  stepTownRaidAi,
  stepTownRebuildNpcs,
} from './isekai';

test('world generates 15 unique bosses across 3 biomes (1-5 castle, 6-10 volcano, 11-15 forest)', () => {
  const names = new Set<string>();
  const voiceLines = new Set<string>();
  const climates = new Set<string>();
  const attackPatterns = new Set<string>();

  assert.equal(TOTAL_BOSSES, 15);
  assert.equal(BOSSES_PER_BIOME, 5);

  for (let i = 1; i <= TOTAL_BOSSES; i++) {
    const boss = getBossDef(i);
    names.add(`${boss.index}:${boss.name}:${boss.standName}`);
    voiceLines.add(boss.voiceLine);
    climates.add(boss.climate);
    attackPatterns.add(boss.attackPattern);
    if (i <= BOSSES_PER_BIOME) {
      assert.equal(boss.biome, 'castle');
      assert.equal(getBiomeForBossIndex(i), 'castle');
    } else if (i <= BOSSES_PER_BIOME * 2) {
      assert.equal(boss.biome, 'volcano');
      assert.equal(getBiomeForBossIndex(i), 'volcano');
    } else {
      assert.equal(boss.biome, 'forest');
      assert.equal(getBiomeForBossIndex(i), 'forest');
    }
    assert.ok(boss.music.bpm >= 120);
    assert.ok(boss.voiceLine.length > 10);
    assert.ok(boss.battleShout.length > 4);
    assert.ok(boss.scaleFactor >= 1.4);
  }
  assert.equal(names.size, TOTAL_BOSSES);
  assert.equal(voiceLines.size, TOTAL_BOSSES);
  assert.ok(climates.size >= 10);
  assert.equal(attackPatterns.size, 8);
  assert.equal(getBiomeForChunk(1), 'castle');
  assert.equal(getBiomeForChunk(6), 'volcano');
  assert.equal(getBiomeForChunk(11), 'forest');
});

test('endless dungeon contains 16 hidden passages with puzzle mechanics starting in chunk 0', () => {
  let passageCount = 0;
  const puzzleTypes = new Set<string>();
  for (let c = 0; c <= TOTAL_BOSSES; c++) {
    const chunk = generateChunk(c);
    if (chunk.hiddenPassage) {
      passageCount += 1;
      puzzleTypes.add(chunk.hiddenPassage.puzzleType);
    }
  }
  assert.equal(passageCount, TOTAL_HIDDEN_PASSAGES);
  assert.equal(puzzleTypes.size, 4);

  const chunk0 = generateChunk(0);
  assert.ok(chunk0.hiddenPassage !== null);
  assert.ok(chunk0.interactables.some((p) => p.kind === 'throne'));
  assert.ok(chunk0.interactables.some((p) => p.kind === 'checkpoint'));
  assert.ok(chunk0.candles.length >= 4);
  assert.equal(chunk0.startX, 0);
  assert.equal(chunk0.endX, CHUNK_WIDTH);
});

test('systematic weapon styles and 3-slot special skill system behave distinctly', () => {
  const player = createInitialPlayer();
  const inv = createInitialInventory();

  assert.equal(player.skillSlots.length, 3);
  assert.equal(player.equippedWeapon, 'claymore');
  const claymoreDmg = calculateAttackDamage(player);

  assert.equal(equipWeapon(player, 'rapier'), true);
  const rapierDmg = calculateAttackDamage(player);
  assert.notEqual(claymoreDmg, rapierDmg);
  assert.ok(WEAPONS.rapier.windup < WEAPONS.claymore.windup);

  // Crafting locked weapon fails without enough resources, succeeds when sufficient
  const failCraft = craftWeapon(player, inv, 'crescent');
  assert.equal(failCraft.ok, false);
  const ember = inv.find((i) => i.id === 'royal_ember')!;
  ember.count = 5;
  const okCraft = craftWeapon(player, inv, 'crescent');
  assert.equal(okCraft.ok, true);
  assert.equal(player.equippedWeapon, 'crescent');

  // Skill slot swap and trigger
  assignSkillToSlot(player, 2, 'chrono_freeze');
  assert.equal(player.skillSlots[2], 'chrono_freeze');
  const cast = triggerSkillSlot(player, 2);
  assert.equal(cast.ok, true);
  assert.equal(cast.skillId, 'chrono_freeze');
  assert.ok(player.skillCooldowns[2] > 0);
  // Cannot immediately recast on cooldown
  assert.equal(triggerSkillSlot(player, 2).ok, false);

  // Attack phase starts cleanly
  assert.equal(startWeaponAttack(player), true);
  assert.equal(player.attackPhase, 'windup');
});

test('platform physics, potion healing, and boss defeat logic work deterministically', () => {
  const player = createInitialPlayer();
  const inv = createInitialInventory();
  const chunk0 = generateChunk(0);

  // Drop player onto floor
  for (let i = 0; i < 40; i++) {
    stepPlayerPhysics(
      player,
      { left: false, right: false, jumpJustPressed: false, jumpHeld: false },
      chunk0.platforms,
      0.016,
    );
  }
  assert.equal(player.onGround, true);

  // Jump takeoff
  const jumpRes = stepPlayerPhysics(
    player,
    { left: false, right: true, jumpJustPressed: true, jumpHeld: true },
    chunk0.platforms,
    0.016,
  );
  assert.equal(jumpRes.jumped, true);
  assert.ok(player.vy < 0);

  // Healing potion
  player.hp = 50;
  const heal = useInventoryItem(player, inv, 'crimson_vial');
  assert.equal(heal.ok, true);
  assert.equal(player.hp, 95);

  // Boss defeat
  const chunk1 = generateChunk(1);
  assert.ok(chunk1.boss !== null);
  const boss = chunk1.boss!;
  const res = applyDamageToBoss(boss, boss.maxHp + 10, 40);
  assert.equal(res.defeatedNow, true);
  assert.equal(boss.defeated, true);
  assert.equal(boss.state, 'ko');
});

test('pokemon-style boss battle supports sword/skill slash attacks, boss counter-slashes, potions, run, and escape', () => {
  const player = createInitialPlayer();
  const inv = createInitialInventory();
  const chunk1 = generateChunk(1);
  const boss = chunk1.boss!;
  const battle = createBossBattleState(boss);

  assert.equal(battle.phase, 'intro');
  battle.phase = 'menu';

  // Player Sword Slash triggers slash animation on boss
  const swordHit = resolvePlayerBattleSword(battle, player);
  assert.equal(swordHit.ok, true);
  assert.ok(swordHit.damage > 0);
  assert.equal(battle.phase, 'player_anim');
  assert.equal(battle.slashFx?.target, 'boss');

  // Boss counter-attack slashes player with pattern-matched style
  const counter = triggerBossCounterTurn(battle, player);
  assert.equal(counter.skippedByFreeze, false);
  assert.ok(counter.damageTaken > 0);
  assert.equal(battle.phase, 'enemy_anim');
  assert.equal(battle.slashFx?.target, 'player');
  assert.ok(
    [
      'stand_claw',
      'knife_volley',
      'seismic',
      'void_crush',
      'lightning',
      'fire',
    ].includes(battle.slashFx?.style ?? ''),
  );

  // Potion heals player inside battle menu
  battle.phase = 'menu';
  const hpBefore = player.hp;
  const pot = resolveBattlePotion(battle, player, inv, 'crimson_vial');
  assert.equal(pot.ok, true);
  assert.ok(player.hp > hpBefore);
  assert.equal(battle.phase, 'potion_anim');

  // Chrono Freeze skill skips boss turn
  battle.phase = 'menu';
  assignSkillToSlot(player, 0, 'chrono_freeze');
  const freezeRes = resolvePlayerBattleSkill(battle, player, 0);
  assert.equal(freezeRes.ok, true);
  assert.equal(battle.bossFrozenTurns, 1);
  const frozenCounter = triggerBossCounterTurn(battle, player);
  assert.equal(frozenCounter.skippedByFreeze, true);
  assert.equal(frozenCounter.damageTaken, 0);

  // Run and Escape state transitions
  battle.phase = 'menu';
  assert.equal(startBattleRun(battle), true);
  assert.equal(battle.phase, 'run_anim');
  assert.equal(battle.pendingOutcome, 'run');

  battle.phase = 'menu';
  assert.equal(startBattleEscape(battle), true);
  assert.equal(battle.phase, 'escape_anim');
  assert.equal(battle.pendingOutcome, 'escape');
});

test('Solo Leveling stat points grant +1 per monster and +10 per boss and scale skillDmg, attack, hp, and speed', () => {
  const player = createInitialPlayer();
  assert.equal(player.statPoints, 0);

  // +1 per monster kill, +10 per boss kill
  assert.equal(grantKillStatPoints(player, 'monster'), 1);
  assert.equal(player.statPoints, 1);
  assert.equal(player.monstersSlain, 1);

  assert.equal(grantKillStatPoints(player, 'boss'), 10);
  assert.equal(player.statPoints, 11);

  const baseSword = calculateAttackDamage(player, 1, false);
  const baseSkill = calculateAttackDamage(player, 1.5, true);
  const baseMaxHp = player.maxHp;
  const baseMaxStamina = player.maxStamina;

  // Allocate into attack, skillDmg, hp, speed
  assert.deepEqual(allocateStatPoint(player, 'attack', 3), { ok: true, applied: 3 });
  assert.deepEqual(allocateStatPoint(player, 'skillDmg', 4), { ok: true, applied: 4 });
  assert.deepEqual(allocateStatPoint(player, 'hp', 2), { ok: true, applied: 2 });
  assert.deepEqual(allocateStatPoint(player, 'speed', 2), { ok: true, applied: 2 });

  assert.equal(player.statPoints, 0);
  assert.equal(allocateStatPoint(player, 'attack', 1).ok, false);

  assert.ok(calculateAttackDamage(player, 1, false) > baseSword);
  assert.ok(calculateAttackDamage(player, 1.5, true) > baseSkill);
  assert.equal(player.maxHp, baseMaxHp + 30);
  assert.equal(player.maxStamina, baseMaxStamina + 8);
});

import { getBossFacialTraits } from './bossFaces';

test('all 15 bosses have unique deterministic facial trait designs', () => {
  const signatures = new Set<string>();
  for (let i = 1; i <= TOTAL_BOSSES; i++) {
    const traits = getBossFacialTraits(i);
    signatures.add(traits.signatureKey);
  }
  assert.equal(signatures.size, TOTAL_BOSSES);
});

test('extended jump arc reaches higher apex and blade dash glides significantly farther', () => {
  const chunk0 = generateChunk(0);

  // Measure full sustained jump apex height above floor
  const jumper = createInitialPlayer();
  for (let i = 0; i < 40; i++) {
    stepPlayerPhysics(
      jumper,
      { left: false, right: false, jumpJustPressed: false, jumpHeld: false },
      chunk0.platforms,
      0.016,
    );
  }
  const floorPlayerY = jumper.y;
  let minJumpY = floorPlayerY;
  stepPlayerPhysics(
    jumper,
    { left: false, right: false, jumpJustPressed: true, jumpHeld: true },
    chunk0.platforms,
    0.016,
  );
  for (let i = 0; i < 45; i++) {
    stepPlayerPhysics(
      jumper,
      { left: false, right: false, jumpJustPressed: false, jumpHeld: true },
      chunk0.platforms,
      0.016,
    );
    if (jumper.y < minJumpY) minJumpY = jumper.y;
  }
  const jumpApexHeight = floorPlayerY - minJumpY;
  assert.ok(jumpApexHeight >= 75, `Expected jump apex >= 75px, got ${jumpApexHeight}`);

  // Measure Phantom Lunge dash glide distance over 0.40s
  const dasher = createInitialPlayer();
  const startX = dasher.x;
  dasher.vx = 465;
  for (let i = 0; i < 25; i++) {
    stepPlayerPhysics(
      dasher,
      { left: false, right: false, jumpJustPressed: false, jumpHeld: false },
      chunk0.platforms,
      0.016,
    );
  }
  const dashDist = dasher.x - startX;
  assert.ok(dashDist >= 110, `Expected dash distance >= 110px, got ${dashDist}`);
});

test('dark hidden passage behind Checkpoint 1 grants OP Fire Sword with 2x damage and supports knight customization', () => {
  const darkChunk = generateChunk(-1);
  assert.equal(darkChunk.startX, -CHUNK_WIDTH);
  assert.equal(darkChunk.endX, 0);
  const fireChest = darkChunk.interactables.find((p) => p.id === 'chest_fire_sword_op');
  assert.ok(fireChest !== undefined);
  assert.equal(fireChest.rewardWeaponId, 'fire_sword');

  // Walking backwards past x = 0 enters chunk -1
  const walker = createInitialPlayer();
  for (let i = 0; i < 90; i++) {
    stepPlayerPhysics(
      walker,
      { left: true, right: false, jumpJustPressed: false, jumpHeld: false },
      [...darkChunk.platforms, ...generateChunk(0).platforms],
      0.016,
    );
  }
  assert.ok(walker.x < 0, `Expected walker.x < 0, got ${walker.x}`);

  // OP Fire Sword applies true 2x damageMultiplier
  assert.equal(WEAPONS.fire_sword.damageMultiplier, 2);
  const p = createInitialPlayer();
  p.unlockedWeapons.push('fire_sword');
  equipWeapon(p, 'fire_sword');
  const fireDmg = calculateAttackDamage(p, 1, false);
  assert.equal(fireDmg, WEAPONS.fire_sword.damage * 2);

  // Knight appearance customization updates cloak/armor/visor/plume colors
  updateWarriorCustomization(p, { cloakColor: '#1d4ed8', visorColor: '#38bdf8' });
  assert.equal(p.customization.cloakColor, '#1d4ed8');
  assert.equal(p.customization.visorColor, '#38bdf8');
});

test('mega boss triggers at exact 10% threshold, features DIO & Undead Knight with 4 vibrant skills and higher HP', () => {
  assert.equal(MEGA_BOSS_SPAWN_CHANCE, 0.1);
  assert.equal(shouldTriggerMegaBossGlitch(() => 0.0), true);
  assert.equal(shouldTriggerMegaBossGlitch(() => 0.099), true);
  assert.equal(shouldTriggerMegaBossGlitch(() => 0.1), false);
  assert.equal(shouldTriggerMegaBossGlitch(() => 0.95), false);

  const regular10 = getBossDef(10);
  const dio = createMegaBossDef('mega_dio', 10, 'castle');
  const knight = createMegaBossDef('mega_undead_knight', 10, 'volcano');

  assert.equal(dio.isMegaBoss, true);
  assert.equal(knight.isMegaBoss, true);
  assert.ok(dio.maxHp > regular10.maxHp);
  assert.ok(knight.maxHp > regular10.maxHp);
  assert.equal(dio.megaSkills?.length, 4);
  assert.equal(knight.megaSkills?.length, 4);

  const player = createInitialPlayer();
  player.maxHp = 500;
  player.hp = 500;
  const megaInst = createMegaBossInstance('mega_dio', 10, 'castle', 400, 224);
  const battle = createBossBattleState(megaInst);
  assert.equal(battle.boss.def.isMegaBoss, true);

  const seenSkills = new Set<string>();
  const seenStyles = new Set<string>();
  for (let turn = 0; turn < 4; turn++) {
    battle.turnCount = turn + 1;
    battle.phase = 'menu';
    const counter = triggerBossCounterTurn(battle, player);
    assert.equal(counter.skippedByFreeze, false);
    assert.ok(counter.damageTaken > 0);
    assert.ok(battle.activeSkillName);
    seenSkills.add(battle.activeSkillName!);
    seenStyles.add(battle.slashFx?.style ?? '');
  }
  assert.equal(seenSkills.size, 4);
  assert.equal(seenStyles.size, 4);
});

test('chunk 6 spawns breakable bridge over volcano pit and transitions cleanly to volcano floor', () => {
  const chunk6 = generateChunk(6);
  assert.equal(chunk6.biome, 'volcano');
  const slipBridge = chunk6.platforms.find((p) => p.id === 'bridge_6_slip');
  assert.ok(slipBridge !== undefined);
  assert.equal(slipBridge.breakable, true);
  assert.equal(slipBridge.kind, 'bridge');
  assert.ok(chunk6.platforms.some((p) => p.id === 'ledge_6_pit_escape'));
  assert.ok(chunk6.platforms.some((p) => p.id === 'ledge_6_forge_catwalk'));
});

test('save system roundtrips full player progress and guest co-op boss lock prevents boss engagement', () => {
  const player = createInitialPlayer();
  player.x = 1420;
  player.gold = 345;
  player.level = 6;
  player.bossesDefeated = 5;
  player.unlockedWeapons.push('fire_sword');
  player.equippedWeapon = 'fire_sword';
  allocateStatPoint(player, 'attack', 0);
  updateWarriorCustomization(player, { cloakColor: '#1e3a8a', visorColor: '#22d3ee' });

  const inv = createInitialInventory();
  const payload = createSavePayload({
    saveId: 'slot alpha',
    playerName: 'Arthur',
    biome: 'volcano',
    player,
    inventory: inv,
    defeatedBosses: new Set([1, 2, 3, 4, 5]),
    discoveredSecrets: new Set(['dark_sanctum_fire_sword', 'sec_1']),
    openedChests: new Set(['chest_fire_sword_op']),
    volcanoBridgeFallTriggered: true,
    darkSanctumDiscovered: true,
  });

  const summary = toSaveSummary(payload);
  assert.equal(summary.saveId, 'slot_alpha');
  assert.equal(summary.gold, 345);
  assert.equal(summary.bossesDefeated, 5);

  const parsed = normalizeLoadedSave(JSON.parse(JSON.stringify(payload)));
  assert.ok(parsed !== null);
  assert.equal(parsed.playerName, 'Arthur');
  assert.equal(parsed.biome, 'volcano');
  assert.equal(parsed.player.equippedWeapon, 'fire_sword');
  assert.equal(parsed.player.customization.visorColor, '#22d3ee');
  assert.equal(parsed.player.vx, 0);
  assert.deepEqual(parsed.defeatedBosses, [1, 2, 3, 4, 5]);
  assert.equal(parsed.volcanoBridgeFallTriggered, true);
  assert.equal(parsed.darkSanctumDiscovered, true);

  assert.equal(canPlayerEngageBoss('host'), true);
  assert.equal(canPlayerEngageBoss('guest'), false);
});

test('knight remains completely stationary after bossfight ends with idle inputs', () => {
  const chunk0 = generateChunk(0);
  const player = createInitialPlayer();
  player.vx = 0;
  player.vy = 0;
  const xBefore = player.x;
  for (let i = 0; i < 30; i++) {
    stepPlayerPhysics(
      player,
      { left: false, right: false, jumpJustPressed: false, jumpHeld: false },
      chunk0.platforms,
      0.016,
    );
  }
  assert.equal(player.vx, 0);
  assert.equal(player.x, xBefore);
});

test('dash bursts forward with cooldown, monsters scale x1.4 per level, and 5 boss fights trigger 60s cooldown', () => {
  const player = createInitialPlayer();
  player.facing = 1;
  const startStam = player.stamina;
  assert.equal(triggerPlayerDash(player), true);
  assert.ok(player.vx >= 430);
  assert.ok(player.dashCooldown > 0.9);
  assert.equal(player.stamina, startStam - 10);
  // Cannot immediately double-dash while on cooldown
  assert.equal(triggerPlayerDash(player), false);

  // Monsters x1.4 per level
  assert.equal(getMonsterLevelMultiplier(1), 1);
  assert.equal(getMonsterLevelMultiplier(2), 1.4);
  assert.equal(getMonsterLevelMultiplier(3), 1.8);

  // 5 boss fights trigger 60s boss cooldown
  let streak = 0;
  for (let fight = 1; fight <= 4; fight++) {
    const step = recordBossFightProgress(streak);
    assert.equal(step.triggeredCooldown, false);
    assert.equal(step.nextStreak, fight);
    streak = step.nextStreak;
  }
  const fifth = recordBossFightProgress(streak);
  assert.equal(fifth.triggeredCooldown, true);
  assert.equal(fifth.cooldownSeconds, 60);
  assert.equal(fifth.nextStreak, 0);
});

test('boss difficulty scales +40% every 5 bosses and Gyro Zeppeli spawns after 15 bosses with 6x player HP and exact player ATK', () => {
  assert.equal(getBossDifficultyMultiplier(1), 1);
  assert.equal(getBossDifficultyMultiplier(5), 1);
  assert.equal(getBossDifficultyMultiplier(6), 1.4);
  assert.equal(getBossDifficultyMultiplier(11), 1.8);
  assert.equal(getBossDifficultyMultiplier(15), 1.8);

  const player = createInitialPlayer();
  player.maxHp = 220;
  player.hp = 220;
  allocateStatPoint(player, 'attack', 0);
  const playerAtk = calculateAttackDamage(player, 1, false);
  const gyroDef = createGyroZeppeliBossDef(player.maxHp, playerAtk);

  assert.equal(gyroDef.index, TOTAL_BOSSES + 1);
  assert.equal(gyroDef.index, 16);
  assert.equal(gyroDef.name, 'Gyro Zeppeli');
  assert.equal(gyroDef.isGyroBoss, true);
  assert.equal(gyroDef.maxHp, player.maxHp * 6);
  assert.equal(gyroDef.gyroAttackDamage, playerAtk);
  assert.ok((gyroDef.emotes?.length ?? 0) >= 3);

  const gyroBoss = {
    def: gyroDef,
    x: 500,
    y: 180,
    vx: 0,
    vy: 0,
    w: 44,
    h: 64,
    hp: gyroDef.maxHp,
    maxHp: gyroDef.maxHp,
    facing: -1 as const,
    state: 'idle' as const,
    stateTimer: 0,
    hitFlash: 0,
    posePhase: 0,
    arenaMinX: 400,
    arenaMaxX: 600,
    defeated: false,
  };
  const battle = createBossBattleState(gyroBoss);
  battle.phase = 'menu';
  const counter = triggerBossCounterTurn(battle, player);
  assert.equal(counter.skippedByFreeze, false);
  assert.equal(counter.damageTaken, playerAtk);
  assert.equal(battle.slashFx?.style, 'gyro_green_ball');
  assert.ok(battle.gyroEmote && battle.gyroEmote.length > 0);
});

test('2-minute idle trigger and Isekai arrival reset stats while keeping combat, weapons, skills & F-Rank badge', () => {
  assert.equal(ISEKAI_IDLE_TRANSPORT_SECONDS, 120);
  assert.equal(shouldIdleTriggerIsekai('citadel', 119.9, true, false), false);
  assert.equal(shouldIdleTriggerIsekai('citadel', 120, true, false), true);
  assert.equal(shouldIdleTriggerIsekai('citadel', 150, true, true), false);
  assert.equal(shouldIdleTriggerIsekai('isekai_town', 150, true, false), false);

  const player = createInitialPlayer();
  player.level = 18;
  player.statPoints = 12;
  player.stats = { attack: 5, skillDmg: 4, hp: 6, speed: 3 };
  player.maxHp = 205;
  player.hp = 180;
  player.unlockedWeapons.push('fire_sword');
  equipWeapon(player, 'fire_sword');
  assignSkillToSlot(player, 1, 'chrono_freeze');
  const inv = createInitialInventory();

  const res = resetPlayerForIsekai(player, inv);
  assert.equal(res.rank, 'F');
  assert.equal(player.level, 1);
  assert.equal(player.statPoints, 0);
  assert.deepEqual(player.stats, { skillDmg: 0, attack: 0, hp: 0, speed: 0 });
  assert.equal(player.maxHp, 115);
  assert.equal(player.hp, 115);
  // Combat weapon and skills remain intact
  assert.equal(player.equippedWeapon, 'fire_sword');
  assert.equal(player.skillSlots[1], 'chrono_freeze');
  assert.ok(inv.some((it) => it.id === 'rank_badge_f' && it.count >= 1));
});

test('Isekai guild rank progression (F -> S), NPC forward/back patrolling, Wardrobe Shop & Demon King purple flames', () => {
  const inv = createInitialInventory();
  const player = createInitialPlayer();
  resetPlayerForIsekai(player, inv);
  player.gold = 600;

  assert.equal(canStartGuildMission('F', 'f_goblin_warren'), true);
  assert.equal(canStartGuildMission('F', 'b_princess_carriage'), false);
  assert.equal(canAccessGuildFloor2('F'), false);
  assert.equal(canAccessGuildFloor2('C'), false);
  assert.equal(canAccessGuildFloor2('B'), true);

  assert.equal(MISSIONS_REQUIRED_PER_RANK, 5);
  let rank: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' = 'F';
  let rankMissionsDone = 0;
  let escorts = 0;

  const sequence: Array<{ expectedRank: 'F' | 'E' | 'D' | 'C' | 'B' | 'A'; missionId: typeof GUILD_MISSIONS[number]['id']; nextRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' }> = [
    { expectedRank: 'F', missionId: 'f_goblin_warren', nextRank: 'E' },
    { expectedRank: 'E', missionId: 'e_hobgoblin_caves', nextRank: 'D' },
    { expectedRank: 'D', missionId: 'd_deep_goblin_keep', nextRank: 'C' },
    { expectedRank: 'C', missionId: 'c_demon_vanguard', nextRank: 'B' },
    { expectedRank: 'B', missionId: 'b_princess_carriage', nextRank: 'A' },
    { expectedRank: 'A', missionId: 'a_three_demon_kings', nextRank: 'S' },
  ];

  for (const step of sequence) {
    assert.equal(rank, step.expectedRank);
    assert.equal(canStartGuildMission(rank, step.missionId), true);
    for (let i = 1; i <= 4; i++) {
      const mid = promoteGuildRankAfterMission(rank, step.missionId, inv, escorts, rankMissionsDone);
      assert.equal(mid.promoted, false);
      assert.equal(mid.nextRank, rank);
      assert.equal(mid.nextRankMissionsCompleted, i);
      rankMissionsDone = mid.nextRankMissionsCompleted;
      escorts = mid.nextBRankEscorts;
    }
    const promo = promoteGuildRankAfterMission(rank, step.missionId, inv, escorts, rankMissionsDone);
    assert.equal(promo.promoted, true);
    assert.equal(promo.nextRank, step.nextRank);
    assert.equal(promo.nextRankMissionsCompleted, 0);
    rank = promo.nextRank;
    rankMissionsDone = promo.nextRankMissionsCompleted;
    escorts = promo.nextBRankEscorts;
  }
  assert.equal(rank, 'S');
  assert.equal(canAccessGuildFloor2('B'), true);
  assert.ok(inv.some((it) => it.id === 'rank_badge_s'));

  // NPCs walk forward and backward smoothly & tavern drinkers animate drinking
  const townNpcs = createTownNpcs(false);
  const guildNpcs = createGuildNpcs(false);
  const walker = townNpcs[0];
  walker.x = walker.maxX - 1;
  walker.speed = 30;
  stepIsekaiNpcs(townNpcs, 0.2);
  assert.ok(walker.speed < 0);
  assert.equal(walker.facing, -1);
  const drinker = guildNpcs.find((n) => n.sitting)!;
  const phaseBefore = drinker.drinkingPhase ?? 0;
  stepIsekaiNpcs(guildNpcs, 0.5);
  assert.ok((drinker.drinkingPhase ?? 0) > phaseBefore);

  // Wardrobe purchase & Royal Crown gating
  const unlocked = ['outfit_knight_plate', 'hat_helm'];
  assert.equal(buyOrEquipWardrobeItem(player, unlocked, 'toggle_crown', false).ok, false);
  const buyCoat = buyOrEquipWardrobeItem(player, unlocked, 'outfit_guild_coat', false);
  assert.equal(buyCoat.ok, true);
  assert.equal(player.customization.outfitStyle, 'guild_coat');
  assert.equal(buyOrEquipWardrobeItem(player, unlocked, 'toggle_crown', true).ok, true);
  assert.equal(player.customization.crownEquipped, true);

  // Mission enemy rosters & 1-by-1 Demon Kings with Allied Squad + purple flame cycle
  const gobs = createGoblinDungeonWave('f_goblin_warren', 0);
  assert.ok(gobs.some((e) => e.archetype === 'goblin_normal'));
  assert.ok(gobs.some((e) => e.archetype === 'hobgoblin'));
  const bandits = createBanditWave(160, 0);
  assert.ok(bandits.some((e) => e.archetype === 'bandit_fighter'));
  assert.ok(bandits.some((e) => e.archetype === 'bandit_archer'));
  const demons = createDemonRealmWave();
  assert.ok(demons.some((e) => e.archetype === 'demon_succubus'));
  assert.ok(demons.some((e) => e.archetype === 'demon_tank'));
  assert.ok(demons.some((e) => e.archetype === 'demon_lightning'));

  const { demonKings, minions, allies } = createThreeDemonKingsInit(['goblin_normal', 'bandit_archer', 'demon_succubus']);
  assert.equal(demonKings.length, 3);
  assert.equal(minions.length, 3);
  assert.equal(allies.length, 3);
  assert.notEqual(demonKings[0].name, demonKings[1].name);
  assert.notEqual(demonKings[1].name, demonKings[2].name);
  const seenPurpleSkills = new Set<string>();
  for (let i = 0; i < (demonKings[0].skills?.length ?? PURPLE_FLAME_SKILLS.length); i++) {
    const cast = createDemonKingPurpleFlameCast(demonKings[0], i, 180);
    seenPurpleSkills.add(cast.skillName);
    assert.ok(cast.zones.length + cast.projectiles.length >= 2);
  }
  assert.equal(seenPurpleSkills.size, demonKings[0].skills?.length ?? PURPLE_FLAME_SKILLS.length);
});

test('save system roundtrips Isekai realm, guild rank, crown, wardrobe & badge', () => {
  const player = createInitialPlayer();
  const inv = createInitialInventory();
  resetPlayerForIsekai(player, inv);
  promoteGuildRankAfterMission('F', 'f_goblin_warren', inv, 0, 4);

  const payload = createSavePayload({
    saveId: 'isekai_slot',
    playerName: 'KazumaKnight',
    biome: 'forest',
    player,
    inventory: inv,
    defeatedBosses: new Set([100, 101]),
    discoveredSecrets: new Set(),
    openedChests: new Set(),
    volcanoBridgeFallTriggered: false,
    darkSanctumDiscovered: false,
    realm: 'isekai_town',
    guildRank: 'E',
    unlockedWardrobe: ['outfit_knight_plate', 'hat_helm', 'outfit_adventurer_tunic'],
    foughtIsekaiEnemies: ['goblin_normal', 'hobgoblin'],
    crownUnlocked: true,
    gyroDefeated: true,
    isekaiCompleted: true,
  });

  const restored = normalizeLoadedSave(JSON.parse(JSON.stringify(payload)));
  assert.ok(restored !== null);
  assert.equal(restored.realm, 'isekai_town');
  assert.equal(restored.guildRank, 'E');
  assert.equal(restored.crownUnlocked, true);
  assert.equal(restored.gyroDefeated, true);
  assert.equal(restored.isekaiCompleted, true);
  assert.deepEqual(restored.foughtIsekaiEnemies, ['goblin_normal', 'hobgoblin']);
  assert.ok(restored.inventory.some((it) => it.id === 'rank_badge_e'));
});

test('elemental orbs drop at 8% chance, apply Flame 25% HP / Wind +30% DMG / Electrical 1-turn stun, and persist in saves', () => {
  assert.equal(ORB_DROP_CHANCE, 0.08);
  assert.equal(rollMonsterOrbDrop(() => 0.08), null);
  assert.equal(rollMonsterOrbDrop(() => 0.5), null);

  let step = 0;
  const seqFlame = () => [0.02, 0.1][step++];
  assert.equal(rollMonsterOrbDrop(seqFlame), 'orb_flame');
  step = 0;
  const seqWind = () => [0.05, 0.5][step++];
  assert.equal(rollMonsterOrbDrop(seqWind), 'orb_wind');
  step = 0;
  const seqElec = () => [0.07, 0.9][step++];
  assert.equal(rollMonsterOrbDrop(seqElec), 'orb_electric');

  const inv = createInitialInventory();
  addInventoryResource(inv, 'orb_flame', 1);
  addInventoryResource(inv, 'orb_wind', 1);
  addInventoryResource(inv, 'orb_electric', 1);

  const player = createInitialPlayer();
  const baseSword = calculateAttackDamage(player, 1.15, false);

  const chunk1 = generateChunk(1);
  const boss = chunk1.boss!;
  boss.maxHp = 400;
  boss.hp = 400;
  const battle = createBossBattleState(boss);

  // 1. Electrical Orb stuns boss for 1 turn
  battle.phase = 'menu';
  const elecRes = resolveBattleOrb(battle, inv, 'orb_electric');
  assert.equal(elecRes.ok, true);
  assert.equal(battle.bossFrozenTurns, 1);
  assert.equal(battle.bossStunReason, 'electric');
  const stunnedCounter = triggerBossCounterTurn(battle, player);
  assert.equal(stunnedCounter.skippedByFreeze, true);
  assert.equal(stunnedCounter.damageTaken, 0);

  // 2. Wind Orb increases boss damage taken by +30%
  battle.phase = 'menu';
  const windRes = resolveBattleOrb(battle, inv, 'orb_wind');
  assert.equal(windRes.ok, true);
  assert.equal(battle.windVulnerable, true);

  battle.phase = 'menu';
  const boostedSword = resolvePlayerBattleSword(battle, player);
  assert.equal(boostedSword.ok, true);
  assert.equal(boostedSword.damage, Math.round(baseSword * 1.3));

  // 3. Flame Orb deals 25% of boss total Max HP (100 out of 400)
  const hpBeforeFlame = boss.hp;
  battle.phase = 'menu';
  const flameRes = resolveBattleOrb(battle, inv, 'orb_flame');
  assert.equal(flameRes.ok, true);
  assert.equal(flameRes.damage, 100);
  assert.equal(boss.hp, hpBeforeFlame - 100);

  // Save/load preserves orb inventory counts
  addInventoryResource(inv, 'orb_flame', 2);
  addInventoryResource(inv, 'orb_wind', 3);
  const payload = createSavePayload({
    saveId: 'orb_slot',
    playerName: 'OrbKnight',
    biome: 'castle',
    player,
    inventory: inv,
    defeatedBosses: new Set(),
    discoveredSecrets: new Set(),
    openedChests: new Set(),
    volcanoBridgeFallTriggered: false,
    darkSanctumDiscovered: false,
  });
  const restored = normalizeLoadedSave(JSON.parse(JSON.stringify(payload)));
  assert.ok(restored !== null);
  assert.equal(restored.inventory.find((i) => i.id === 'orb_flame')?.count, 2);
  assert.equal(restored.inventory.find((i) => i.id === 'orb_wind')?.count, 3);
  assert.equal(restored.inventory.find((i) => i.id === 'orb_electric')?.count, 0);
});

test('deeper dungeons spawn stronger dungeon bosses, Potion Shop boosts ATK, Weapons Shop stocks unique blades, and sword combo choreography works', () => {
  // Deeper dungeon waves spawn strong Dungeon Bosses at Depth >= 2
  const gobsD1 = createGoblinDungeonWave('f_goblin_warren', 0, 1);
  assert.equal(gobsD1.some((e) => e.isDungeonBoss), false);
  const gobsD2 = createGoblinDungeonWave('f_goblin_warren', 0, 2);
  const gobBoss = gobsD2.find((e) => e.isDungeonBoss);
  assert.ok(gobBoss !== undefined);
  assert.ok(gobBoss.maxHp >= 400);

  const demD2 = createDemonRealmWave(2);
  assert.ok(demD2.some((e) => e.isDungeonBoss));

  // Potion Shop HP & Damage-Boost Potions
  const player = createInitialPlayer();
  const inv = createInitialInventory();
  player.gold = 300;
  const baseDmg = calculateAttackDamage(player, 1, false);
  const buyBoost = buyPotionShopItem(player, inv, 'fury_draught');
  assert.equal(buyBoost.ok, true);
  const drinkBoost = useInventoryItem(player, inv, 'fury_draught');
  assert.equal(drinkBoost.ok, true);
  assert.ok(player.damageBoostMultiplier > 1);
  const boostedDmg = calculateAttackDamage(player, 1, false);
  assert.ok(boostedDmg > baseDmg);
  assert.ok(POTION_SHOP_IDS.includes('titan_crimson_tonic'));

  // Weapons Shop: unique colors, sizes, specials, and paid unlock guard
  const armoryColors = new Set(WEAPON_SHOP_ORDER.map((id) => WEAPONS[id].color));
  assert.equal(armoryColors.size, WEAPON_SHOP_ORDER.length);
  const craftBlocked = craftWeapon(player, inv, 'venom_twinblade');
  assert.equal(craftBlocked.ok, false);
  player.gold = 1000;
  const buyWep = buyOrEquipWeaponShopItem(player, 'azure_glaive');
  assert.equal(buyWep.ok, true);
  assert.equal(player.equippedWeapon, 'azure_glaive');

  // Sword Combo Choreography: Click 1 -> Click 2 (Double Poke 1.48x range) -> Click 3 (Triple Slash) -> Spin Dash Poke (1.85x range)
  const wRange = WEAPONS[player.equippedWeapon].range;
  assert.equal(startWeaponAttack(player), true);
  assert.equal(player.comboStep, 1);
  const hb1 = computeWeaponHitbox(player);

  player.attackPhase = 'none';
  assert.equal(startWeaponAttack(player), true);
  assert.equal(player.comboStep, 2);
  const hb2 = computeWeaponHitbox(player);
  assert.equal(hb2.w, Math.round(wRange * 1.48));
  assert.ok(hb2.w > hb1.w);

  player.attackPhase = 'none';
  assert.equal(startWeaponAttack(player), true);
  assert.equal(player.comboStep, 3);

  assert.equal(triggerSpinPokeDash(player), true);
  assert.equal(player.isSpinDashAttack, true);
  const hbSpin = computeWeaponHitbox(player);
  assert.equal(hbSpin.w, Math.round(wRange * 1.85));
});

test('3x monster HP, 1.9x per-boss-defeated Citadel scaling, endless dungeon distance scaling, Caravan routing, Hot Spring, Day/Night & JJK OP Arena AI', () => {
  // 1. 1.9x per-boss-defeated Citadel boss multiplier (including Mega & Gyro) + 0.5x Player ATK
  assert.equal(BOSS_DEFEATED_SCALING_BASE, 1.9);
  assert.equal(getBossDefeatedMultiplier(0), 1);
  assert.ok(Math.abs(getBossDefeatedMultiplier(1) - 1.9) < 0.001);
  assert.ok(Math.abs(getBossDefeatedMultiplier(2) - 3.61) < 0.001);
  const b0 = getBossDef(5, 0);
  const b1 = getBossDef(5, 1);
  assert.equal(b1.maxHp, Math.round(b0.maxHp * 1.9));
  assert.ok(Math.abs((b1.defeatedScale ?? 1) - 1.9) < 0.001);
  const m0 = createMegaBossDef('mega_dio', 10, 'castle', 0);
  const m1 = createMegaBossDef('mega_dio', 10, 'castle', 1);
  assert.equal(m1.maxHp, Math.round(m0.maxHp * 1.9));
  const g0 = createGyroZeppeliBossDef(200, 40, 0);
  const g1 = createGyroZeppeliBossDef(200, 40, 1);
  assert.equal(g1.maxHp, Math.round(g0.maxHp * 1.9));
  assert.equal(calculateCitadelBossHalfAtk(40, 1), 20);
  assert.equal(calculateCitadelBossHalfAtk(4, 1), 3);
  assert.ok(pickJoJoSkillDialogue('Ram n Charge', 'Dio', 'The World', 0).length > 5);
  assert.ok(pickJoJoSkillDialogue('Stand Barrage', 'Dio', 'The World', 1).length > 5);
  assert.ok(pickJoJoSkillDialogue('Burst Crush!', 'Dio', 'The World', 2).length > 5);

  // 2. 3x monster HP & endless sector distance scaling
  const s0 = createDungeonSectorEnemies('goblin_dungeon', 'f_goblin_warren', 0, 1, 0);
  const s4 = createDungeonSectorEnemies('goblin_dungeon', 'f_goblin_warren', 4, 2, 0);
  assert.ok(s0.length >= 3);
  assert.ok(s4[0].maxHp > s0[0].maxHp * 1.5);
  assert.ok(s4[0].h >= s0[0].h);

  // 3. Caravan Rider typed destination parser (to dungeon exterior & back to town)
  assert.equal(parseCaravanDestination('Goblin Dungeon', 'isekai_town', 'F', null).target, 'goblin_dungeon');
  assert.equal(parseCaravanDestination('Demon Realm', 'isekai_town', 'F', null).ok, false);
  assert.equal(parseCaravanDestination('Demon Realm', 'isekai_town', 'C', null).target, 'demon_realm');
  assert.equal(parseCaravanDestination('Solaris Town', 'dungeon_exterior', 'F', null).target, 'isekai_town');
  assert.equal(parseCaravanDestination('Mars', 'isekai_town', 'F', null).ok, false);

  // 4. Hot Spring rest & Day/Night 5-minute cycle
  const p = createInitialPlayer();
  p.stats.hp = 4;
  p.stats.attack = 3;
  p.stats.speed = 2;
  p.maxHp = 115 + 4 * 15;
  p.hp = 40;
  const onsen = applyHotSpringRest(p);
  assert.equal(p.hp, p.maxHp);
  assert.ok(onsen.healedHp > 0);
  assert.ok((p.hotSpringTimer ?? 0) >= 60);
  assert.equal(getIsekaiDayNightState(10).isNight, false);
  assert.equal(getIsekaiDayNightState(195).isNight, true);

  // 5. Jujutsu Kaisen Colosseum challengers (16 total) with Best-of-3 rounds, 3x Match HP & OP reactive AI
  assert.equal(ARENA_CHALLENGERS.length, 16);
  const duel = createArenaDuelInit('satoru_gojo', p);
  assert.equal(duel.roundPhase, 'countdown');
  assert.equal(duel.roundNumber, 1);
  assert.equal(duel.playerRoundWins, 0);
  assert.equal(duel.opponentRoundWins, 0);
  duel.roundPhase = 'fighting';
  assert.equal(duel.maxHp, p.maxHp * 3);
  assert.equal(duel.hp, p.maxHp * 3);
  assert.equal(duel.matchedAtk, Math.round(calculateAttackDamage(p, 1, false)));

  const arenaPlatforms = buildIsekaiRoomPlatforms('dueling_arena');
  // Incoming projectile triggers OP Flash-Step Dodge with i-frames
  p.x = 760;
  p.y = FLOOR_Y - p.h;
  const dodgeStep = stepArenaDuelAi(
    duel,
    p,
    [
      {
        id: 'test_slash',
        x: duel.x - 36,
        y: duel.y + 12,
        vx: 200,
        vy: 0,
        radius: 8,
        damage: 20,
        fromPlayer: true,
        color: '#38bdf8',
        life: 0.5,
        kind: 'slash_wave',
      },
    ],
    arenaPlatforms,
    0.016,
    { minX: 0, maxX: 1240 },
    FLOOR_Y,
  );
  assert.equal(duel.state, 'dodge');
  assert.ok(duel.invulnTimer > 0);
  assert.equal(dodgeStep.hypeTrigger, true);

  // Domain Expansion triggers separate dimension AoE attack once cooldown reaches 0
  duel.domainCooldown = 0;
  duel.invulnTimer = 0;
  duel.dodgeCooldown = 1;
  const domStep = stepArenaDuelAi(duel, p, [], arenaPlatforms, 0.016, { minX: 0, maxX: 1240 }, FLOOR_Y);
  assert.equal(duel.domainActive, true);
  assert.equal(duel.domainName, JJK_DOMAINS.satoru_gojo.name);
  assert.ok(domStep.spawnedZones.length >= 2);
});

test('Town Raid (Rimuru Tempest / Goblin Slayer), NPC house rebuilding, 16 JJK Domains, 17 Manhwa Demon Kings & 5-class bandit ambush', () => {
  // 1. Town Raid 5-minute interval, 1000G reward, 6x HP / matched ATK, house breaking & NPC rebuilding
  assert.equal(TOWN_RAID_INTERVAL_SECONDS, 300);
  assert.equal(TOWN_RAID_REWARD_GOLD, 1000);

  const player = createInitialPlayer();
  player.maxHp = 180;
  player.hp = 180;
  const atk = Math.round(calculateAttackDamage(player, 1, false));
  const rimuru = createTownRaidBoss('rimuru_tempest', player.maxHp, atk);
  const gs = createTownRaidBoss('goblin_slayer', player.maxHp, atk);
  assert.equal(rimuru.maxHp, player.maxHp * 6);
  assert.equal(rimuru.attackDamage, atk);
  assert.equal(gs.maxHp, player.maxHp * 6);

  const houses = createTownHouseStates();
  assert.ok(houses.length >= 8);
  rimuru.x = houses[0].x + 12;
  rimuru.aoeCooldown = 0;
  const raidStep = stepTownRaidAi(rimuru, player, houses, 0.05, { minX: 20, maxX: 3680 }, FLOOR_Y);
  assert.ok(raidStep.spawnedZones.length >= 1);
  assert.ok(raidStep.damagedHouseIndices.length >= 1);

  // Break house 0 completely and verify townsfolk gather to rebuild it when raid is gone
  houses[0].hp = 0;
  houses[0].broken = true;
  const townNpcs = createTownNpcs(false);
  const worker = townNpcs[0];
  worker.x = houses[0].x + Math.round(houses[0].w * 0.28);
  for (let i = 0; i < 40; i++) {
    stepTownRebuildNpcs(townNpcs, houses, 0.25);
  }
  assert.equal(houses[0].broken, false);
  assert.equal(houses[0].hp, houses[0].maxHp);
  stepTownRebuildNpcs(townNpcs, houses, 0.1);
  assert.equal(worker.rebuildingHouseIndex, null);

  // Defeating Town Raider promotes rank directly
  const inv = createInitialInventory();
  resetPlayerForIsekai(player, inv);
  const directPromo = promoteGuildRankDirect('F', inv);
  assert.equal(directPromo.promoted, true);
  assert.equal(directPromo.nextRank, 'E');
  assert.ok(inv.some((it) => it.id === 'rank_badge_e'));

  // 2. All 16 JJK Challengers have dedicated Domain Expansions
  assert.equal(Object.keys(JJK_DOMAINS).length, 16);
  for (const ch of ARENA_CHALLENGERS) {
    assert.ok(JJK_DOMAINS[ch.id]?.name.length > 0);
  }

  // 3. Coordinated 5-class bandit ambush on lush forest Princess Escort
  const wave = createBanditWave(220, 1, 0);
  const archetypes = new Set(wave.map((e) => e.archetype));
  assert.ok(archetypes.has('bandit_brute'));
  assert.ok(archetypes.has('bandit_fighter'));
  assert.ok(archetypes.has('bandit_assassin'));
  assert.ok(archetypes.has('bandit_archer'));
  assert.ok(archetypes.has('bandit_pyromancer'));

  // 4. 17 Manhwa-inspired Demon Kings (S-Rank gated + Caravan routing + unique companions/abilities)
  assert.equal(SEVENTEEN_MANHWA_DEMON_KINGS.length, 17);
  assert.equal(canStartGuildMission('A', 's_seventeen_demon_kings'), false);
  assert.equal(canStartGuildMission('S', 's_seventeen_demon_kings'), true);
  assert.equal(parseCaravanDestination('17 Demon Kings', 'isekai_town', 'A', null).ok, false);
  assert.equal(parseCaravanDestination('17 Demon Kings', 'isekai_town', 'S', null).target, 'seventeen_demon_kings');

  const init17 = createSeventeenDemonKingsInit(0);
  assert.equal(init17.demonKings.length, 17);
  const uniqueNames = new Set(init17.demonKings.map((k) => k.name));
  const uniqueWeapons = new Set(init17.demonKings.map((k) => k.weaponName));
  assert.equal(uniqueNames.size, 17);
  assert.equal(uniqueWeapons.size, 17);
  assert.ok(createDemonKingStageMinions(17, true).length >= 2);

  // 5. Verify 4x pricing scaling across potions, wardrobe & armory
  assert.ok(WEAPONS.fire_sword.shopPrice! >= 1600);
  assert.ok(WARDROBE_CATALOG.find((w) => w.id === 'outfit_guild_coat')!.price >= 360);
  assert.ok(GUILD_MISSIONS.find((m) => m.id === 's_seventeen_demon_kings')!.rewardGold >= 4000);
});

test('10 JJBA pixel Stands, Royal Stand Shrine, JJK Star Stones, Dinostand shift, and Gyro Steel Ball mechanics', () => {
  assert.equal(STAND_ORDER.length, 10);
  for (const id of STAND_ORDER) {
    assert.ok(STANDS[id].name.length > 0);
    assert.ok(STAND_SKILL_TAGS[id].length > 0);
  }

  // Stand Shrine interactable sits cleanly in Royal Solaris Isekai Town
  const townProps = buildIsekaiRoomInteractables('isekai_town');
  const shrineProp = townProps.find((p) => p.kind === 'stand_shrine');
  assert.ok(shrineProp !== undefined);
  assert.ok(shrineProp.x >= 1465 && shrineProp.x <= 1655);

  // JJK Colosseum Star Stone rewards (+3 for Special Grade, +2 otherwise)
  assert.equal(getStarStoneRewardForJjkEnemy('satoru_gojo'), 3);
  assert.equal(getStarStoneRewardForJjkEnemy('ryomen_sukuna'), 3);
  assert.equal(getStarStoneRewardForJjkEnemy('yuji_itadori'), 2);

  // Purchasing and equipping Stands via Star Stones
  const player = createInitialPlayer();
  assert.equal(player.equippedStand, 'star_platinum');
  assert.equal(buyOrEquipStand(player, 'the_hand', STANDS.the_hand.costStarStones, STANDS.the_hand.name).ok, false);
  player.starStones = 10;
  const buyHand = buyOrEquipStand(player, 'the_hand', STANDS.the_hand.costStarStones, STANDS.the_hand.name);
  assert.equal(buyHand.ok, true);
  assert.equal(buyHand.purchased, true);
  assert.equal(player.equippedStand, 'the_hand');
  assert.equal(player.starStones, 10 - STANDS.the_hand.costStarStones);

  // Re-equipping unlocked Stand is free
  const equipStarter = buyOrEquipStand(player, 'star_platinum', 0, STANDS.star_platinum.name);
  assert.equal(equipStarter.ok, true);
  assert.equal(equipStarter.purchased, false);
  assert.equal(player.starStones, 10 - STANDS.the_hand.costStarStones);

  // Dinostand increases sword damage by 1.35x, widens hitbox, and accelerates swing windup
  const baseDmg = calculateAttackDamage(player, 1, false);
  const baseHitbox = computeWeaponHitbox(player);
  assert.equal(startWeaponAttack(player), true);
  const baseWindup = player.attackTimer;
  player.attackPhase = 'none';

  player.dinoFormTimer = 4.0;
  const dinoDmg = calculateAttackDamage(player, 1, false);
  const dinoHitbox = computeWeaponHitbox(player);
  assert.equal(dinoDmg, Math.round(baseDmg * 1.35));
  assert.ok(dinoHitbox.w > baseHitbox.w);
  assert.ok(dinoHitbox.h > baseHitbox.h);
  assert.equal(startWeaponAttack(player), true);
  assert.ok(player.attackTimer < baseWindup);
  player.attackPhase = 'none';
  player.dinoFormTimer = 0;

  // Gyro Steel Ball passive attack speed boost (0.55x windup)
  player.unlockedStands = [...(player.unlockedStands ?? ['star_platinum']), 'gyro_ball'];
  player.equippedStand = 'gyro_ball';
  assert.equal(startWeaponAttack(player), true);
  assert.ok(player.attackTimer < baseWindup * 0.65);
});

test('10 violent plot-twist side quests, Royal Town East Gate, Outskirts Forest & Caves, and save persistence', () => {
  assert.equal(SIDE_QUESTS.length, 10);
  const questIds = new Set(SIDE_QUESTS.map((q) => q.id));
  const npcNames = new Set(SIDE_QUESTS.map((q) => q.giverName));
  const bossNames = new Set(SIDE_QUESTS.map((q) => q.bossName));
  assert.equal(questIds.size, 10);
  assert.equal(npcNames.size, 10);
  assert.equal(bossNames.size, 10);

  for (const q of SIDE_QUESTS) {
    assert.ok(q.twistTitle.includes('PLOT TWIST'));
    assert.ok(q.twistRevelation.length > 20);
    assert.ok(q.twistTriggerKills >= 3);
    assert.ok(q.rewardGold > 0 && q.rewardStatPoints > 0 && q.rewardStarStones > 0);
  }

  // Royal Town East Gate connects to Outskirts Forest, which connects to Outskirts Caves
  const townInteractables = buildIsekaiRoomInteractables('isekai_town');
  assert.ok(townInteractables.some((p) => p.kind === 'town_gate_out'));
  assert.equal(
    townInteractables.filter((p) => p.kind === 'side_quest_npc').length,
    SIDE_QUESTS.filter((q) => q.giverRealm === 'isekai_town').length,
  );

  const forestInteractables = buildIsekaiRoomInteractables('outskirts_forest');
  assert.ok(forestInteractables.some((p) => p.kind === 'outskirts_return_town'));
  assert.ok(forestInteractables.some((p) => p.kind === 'outskirts_cave_entrance'));
  assert.equal(
    forestInteractables.filter((p) => p.kind === 'side_quest_npc').length,
    SIDE_QUESTS.filter((q) => q.giverRealm === 'outskirts_forest').length,
  );

  const caveInteractables = buildIsekaiRoomInteractables('outskirts_caves');
  assert.ok(caveInteractables.some((p) => p.kind === 'outskirts_cave_exit'));
  assert.equal(
    caveInteractables.filter((p) => p.kind === 'side_quest_npc').length,
    SIDE_QUESTS.filter((q) => q.giverRealm === 'outskirts_caves').length,
  );

  assert.ok(ISEKAI_ROOM_BOUNDS.outskirts_forest.maxX >= 2000);
  assert.ok(ISEKAI_ROOM_BOUNDS.outskirts_caves.maxX >= 2000);

  // Ambient monsters and Side Quest bosses spawn cleanly
  const forestPacks = createOutskirtsAmbientEnemies('outskirts_forest', 2);
  const cavePacks = createOutskirtsAmbientEnemies('outskirts_caves', 2);
  assert.ok(forestPacks.length >= 6);
  assert.ok(cavePacks.length >= 6);

  const sq1 = SIDE_QUESTS[0];
  assert.equal(isQuestTargetEnemyKill(sq1, 'outskirts_forest', forestPacks[0]), true);
  assert.equal(isQuestTargetEnemyKill(sq1, 'outskirts_caves', cavePacks[0]), false);

  const sqBoss = createSideQuestBossEnemy(sq1, 2);
  assert.equal(sqBoss.sideQuestId, sq1.id);
  assert.equal(sqBoss.isDungeonBoss, true);
  assert.equal(sqBoss.rewardGold, sq1.rewardGold);
  assert.equal(isQuestTargetEnemyKill(sq1, 'outskirts_forest', sqBoss), false);

  // Reworked full interactive dialogues, branching choices & Solaris Ledger clues
  for (const q of SIDE_QUESTS) {
    assert.ok(q.storyTheme.length > 5);
    assert.ok(q.chapterTitle.length > 5);
    assert.ok(q.conspiracyClue.length > 20);
    assert.ok(q.openingNodes.length >= 2);
    assert.ok((q.openingNodes[0].choices?.length ?? 0) >= 2);
    assert.ok(q.midQuestNodes.length >= 1);
    assert.ok(q.twistConfrontationNodes.length >= 1);
    assert.ok((q.twistConfrontationNodes[0].choices?.length ?? 0) >= 2);
  }

  // Dialogue choice state transitions + anti-exploit once-only gold/stat rewards
  const progress = createInitialSideQuestProgress();
  const sq1Prog = progress.sq_01_crimson_tithe!;
  const investigateChoice = sq1.openingNodes[0].choices!.find((c) => c.bonusGold && c.revealClue)!;
  const firstPick = applySideQuestDialogueChoice(sq1, sq1Prog, investigateChoice);
  assert.equal(firstPick.clueNewlyUncovered, true);
  assert.ok(firstPick.goldDelta > 0);
  assert.equal(sq1Prog.clueUncovered, true);
  const repeatPick = applySideQuestDialogueChoice(sq1, sq1Prog, investigateChoice);
  assert.equal(repeatPick.goldDelta, 0);
  assert.equal(repeatPick.clueNewlyUncovered, false);

  const acceptChoice = sq1.openingNodes[1].choices!.find((c) => c.acceptQuest)!;
  const acceptRes = applySideQuestDialogueChoice(sq1, sq1Prog, acceptChoice);
  assert.equal(acceptRes.acceptedNow, true);
  assert.equal(sq1Prog.stage, 1);

  sq1Prog.kills = 3;
  sq1Prog.twistRevealed = true;
  sq1Prog.bossSpawned = true;
  const confrontChoice = sq1.twistConfrontationNodes[0].choices![0];
  applySideQuestDialogueChoice(sq1, sq1Prog, confrontChoice);
  assert.equal(sq1Prog.confronted, true);

  // Side Quest state persists cleanly through saveSystem
  const player = createInitialPlayer();
  const inv = createInitialInventory();
  const payload = createSavePayload({
    saveId: 'sq_slot',
    playerName: 'Oathbreaker',
    biome: 'castle',
    player,
    inventory: inv,
    defeatedBosses: new Set([1, 2]),
    discoveredSecrets: new Set(),
    openedChests: new Set(),
    volcanoBridgeFallTriggered: false,
    darkSanctumDiscovered: false,
    realm: 'outskirts_forest',
    sideQuestProgress: progress,
    trackedSideQuestId: 'sq_01_crimson_tithe',
  });
  const loaded = normalizeLoadedSave(JSON.parse(JSON.stringify(payload)));
  assert.ok(loaded !== null);
  assert.equal(loaded.realm, 'outskirts_forest');
  assert.equal(loaded.trackedSideQuestId, 'sq_01_crimson_tithe');
  assert.equal(loaded.sideQuestProgress?.sq_01_crimson_tithe?.twistRevealed, true);
  assert.equal(loaded.sideQuestProgress?.sq_01_crimson_tithe?.clueUncovered, true);
  assert.equal(loaded.sideQuestProgress?.sq_01_crimson_tithe?.confronted, true);
  assert.ok((loaded.sideQuestProgress?.sq_01_crimson_tithe?.chosenOptionIds?.length ?? 0) >= 2);
});

test('Double-Tap Dash activates White Aura Overdrive (1.5s invincibility + 30% speed) and Double-Tap Stand activates Defensive Stand Guard (1.5s)', () => {
  const floor = [{ id: 'test_floor', x: -500, y: FLOOR_Y, w: 3000, h: 44, kind: 'floor' as const }];
  const moveRight = { left: false, right: true, jumpJustPressed: false, jumpHeld: false };
  const idleInput = { left: false, right: false, jumpJustPressed: false, jumpHeld: false };

  const player = createInitialPlayer();
  player.stamina = 100;

  // Baseline horizontal velocity check
  const baseline = createInitialPlayer();
  baseline.x = player.x;
  baseline.y = player.y;
  baseline.onGround = true;
  stepPlayerPhysics(baseline, moveRight, floor, 0.016);
  const normalVx = baseline.vx;

  // Activate White Aura Overdrive on double-tap dash
  const auraActivated = activateWhiteAuraDash(player);
  assert.equal(auraActivated, true);
  assert.equal(player.whiteAuraTimer, WHITE_AURA_DURATION);
  assert.equal(player.whiteAuraCooldown, WHITE_AURA_COOLDOWN);
  assert.ok(player.invulnTimer >= WHITE_AURA_DURATION);
  assert.ok(Math.abs(player.vx) > normalVx);

  // Cooldown prevents instant re-trigger
  assert.equal(activateWhiteAuraDash(player), false);

  // Physics applies 1.3x movement speed multiplier during White Aura
  player.vx = 0;
  player.onGround = true;
  stepPlayerPhysics(player, moveRight, floor, 0.016);
  assert.ok(
    Math.abs(player.vx - normalVx * WHITE_AURA_SPEED_MULTIPLIER) < 0.01,
    `Expected ${player.vx} to equal ${normalVx * WHITE_AURA_SPEED_MULTIPLIER}`,
  );
  assert.ok((player.whiteAuraTimer ?? 0) < WHITE_AURA_DURATION);

  // Activate Defensive Stand Guard on double-tap Stand
  const guardActivated = activateStandGuard(player);
  assert.equal(guardActivated, true);
  assert.equal(player.standGuardTimer, STAND_GUARD_DURATION);
  assert.equal(player.standGuardCooldown, STAND_GUARD_COOLDOWN);
  assert.equal(activateStandGuard(player), false);

  // Timers tick cleanly down to zero
  stepPlayerPhysics(player, idleInput, floor, 2.0);
  assert.equal(player.whiteAuraTimer, 0);
  assert.equal(player.standGuardTimer, 0);
});








