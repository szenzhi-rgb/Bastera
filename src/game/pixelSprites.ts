import { STANDS, WEAPONS } from './data';
import { SIDE_QUESTS } from './isekai';
import {
  drawBossPortrait,
  getBakedBiomeWall,
  getBakedFloorStrip,
  getBakedJoJoBossSprite,
  getBakedStandWorldSprite,
  getBakedStarPlatinumSprite,
  getBakedWarriorBattleSprite,
  getBakedWeaponWorldSprite,
  shadeColor,
} from './pixelArtAtlas';
import { drawCrispOverlayLabel } from './isekaiSprites';
import { DEFAULT_WARRIOR_CUSTOMIZATION } from './rules';
import type {
  ActiveBoss,
  BiomeId,
  BossBattlePhase,
  BossBattleSlashFx,
  CandleProp,
  EnemyState,
  GroundCrackDecal,
  HiddenPassage,
  InteractableProp,
  MegaCutsceneHud,
  MultiplayerPeer,
  Platform,
  PlayerState,
  Projectile,
  StandId,
  WarriorCustomization,
  WeaponId,
} from './types';
import { FLOOR_Y } from './worldGen';

export const PIXEL_W = 480;
export const PIXEL_H = 270;
export const RENDER_SCALE = 3;

function pRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function sRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawPixelSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  pRect(ctx, x - size, y, size * 2 + 1, 1, color);
  pRect(ctx, x, y - size, 1, size * 2 + 1, color);
}

const skyBackdropCache: Record<string, HTMLCanvasElement> = {};

function getSkyBackdrop(key: string, stops: [number, string][]): HTMLCanvasElement {
  if (skyBackdropCache[key]) return skyBackdropCache[key];
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = PIXEL_H;
  const gctx = c.getContext('2d');
  if (gctx) {
    const grad = gctx.createLinearGradient(0, 0, 0, PIXEL_H);
    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 4, PIXEL_H);
  }
  skyBackdropCache[key] = c;
  return c;
}

export function drawBiomeBackdrop(
  ctx: CanvasRenderingContext2D,
  biome: BiomeId,
  camX: number,
  time: number,
) {
  const wallStrip = getBakedBiomeWall(biome);
  const stripW = wallStrip.width; // 256
  const parallaxX = Math.floor(camX * 0.38);
  const offset = ((parallaxX % stripW) + stripW) % stripW;

  // Tile seamless Castlevania/Blasphemous-grade architectural wall strip
  for (let drawX = -offset; drawX < PIXEL_W; drawX += stripW) {
    ctx.drawImage(wallStrip, Math.round(drawX), 0);
  }

  // Animated dynamic props layered over baked masonry (chandeliers, pulsing runes, lava shimmer)
  const first = Math.floor(parallaxX / stripW);
  for (let i = first - 1; i <= first + 2; i++) {
    const wx = i * stripW - parallaxX;
    if (biome === 'castle') {
      // Swaying ornate gothic chandelier centered before the stained glass rose window
      const chandX = wx + 85;
      const sway = Math.round(Math.sin(time * 1.4 + i) * 1);
      pRect(ctx, chandX, 0, 2, 16, '#271e24');
      pRect(ctx, chandX - 15 + sway, 16, 32, 2, '#78350f');
      pRect(ctx, chandX - 11 + sway, 18, 24, 2, '#b45309');
      pRect(ctx, chandX - 3 + sway, 20, 8, 3, '#f59e0b');
      [-13, -5, 5, 13].forEach((ox, idx) => {
        const cx = chandX + ox + sway;
        pRect(ctx, cx, 11, 2, 5, '#fef3c7');
        const cf = Math.round(Math.sin(time * 9 + i + idx) * 0.8);
        pRect(ctx, cx - 1, 7 + cf, 4, 4, 'rgba(249, 115, 22, 0.35)');
        pRect(ctx, cx, 8 + cf, 2, 3, '#f97316');
        pRect(ctx, cx, 9 + cf, 1, 2, '#fef08a');
      });
    } else if (biome === 'forest') {
      // Swaying luminescent vines & pulsing ancient rune glyphs
      const vSway = Math.round(Math.sin(time * 2 + i) * 1.5);
      pRect(ctx, wx + 42 + vSway, 0, 2, 54, '#15803d');
      pRect(ctx, wx + 42 + vSway, 54, 2, 4, '#6ee7b7');
      pRect(ctx, wx + 206 - vSway, 0, 2, 62, '#166534');
      pRect(ctx, wx + 206 - vSway, 62, 2, 4, '#34d399');
      const pulse = 0.35 + 0.45 * Math.sin(time * 3 + i);
      ctx.fillStyle = `rgba(110, 231, 183, ${pulse})`;
      ctx.fillRect(Math.round(wx + 114), 132, 8, 24);
    } else {
      // Animated volcanic caldera shimmer + dual bubbling magma falls + rising caldera sparks + cage
      const shimmer = 0.35 + 0.4 * Math.sin(time * 6.5 + i);
      ctx.fillStyle = `rgba(254, 240, 138, ${shimmer})`;
      ctx.fillRect(Math.round(wx + 118), 66 + Math.round((time * 42) % 44), 14, 16);
      ctx.fillStyle = `rgba(249, 115, 22, ${shimmer * 0.85})`;
      ctx.fillRect(Math.round(wx + 115), 110 + Math.round((time * 54) % 64), 20, 18);
      // Crater heat mirage haze along horizon
      const craterGlow = 0.14 + 0.1 * Math.sin(time * 3.5 + i);
      ctx.fillStyle = `rgba(239, 68, 68, ${craterGlow})`;
      ctx.fillRect(Math.round(wx), 40, stripW, 38);
      const cSway = Math.round(Math.sin(time * 2.1 + i) * 1);
      for (let cy = 10; cy < 82; cy += 9) {
        pRect(ctx, wx + 208 + cSway, cy, 3, 5, '#64748b');
      }
      pRect(ctx, wx + 201 + cSway, 82, 16, 22, '#291515');
      pRect(ctx, wx + 204 + cSway, 85, 4, 16, '#120505');
      pRect(ctx, wx + 210 + cSway, 85, 4, 16, '#120505');
      pRect(ctx, wx + 207 + cSway, 90, 4, 6, '#fb923c');
    }
  }
}

export function drawPlatforms(
  ctx: CanvasRenderingContext2D,
  platforms: Platform[],
  biome: BiomeId,
  camX: number,
  time: number,
) {
  for (const plat of platforms) {
    const sx = Math.round(plat.x - camX);
    if (sx + plat.w < -16 || sx > PIXEL_W + 16) continue;

    if (plat.kind === 'floor') {
      const strip = getBakedFloorStrip(biome);
      const visLeft = Math.max(0, -sx);
      const visRight = Math.min(plat.w, PIXEL_W - sx);
      const visW = visRight - visLeft;
      if (visW > 0) {
        ctx.drawImage(
          strip,
          visLeft * 2,
          0,
          visW * 2,
          strip.height,
          sx + visLeft,
          plat.y - 2,
          visW,
          strip.height / 2,
        );
        if (biome === 'volcano') {
          const lavaGlow = 0.14 + 0.14 * Math.sin(time * 4.2);
          ctx.fillStyle = `rgba(254, 240, 138, ${lavaGlow})`;
          ctx.fillRect(Math.round(sx + visLeft), plat.y + 22, visW, 4);
        }
      }
    } else {
      // Elevated Brick / Carpet / Secret Bridge Ledge with crisp sub-pixel bevels & rivets
      const baseColor =
        plat.kind === 'secret_bridge'
          ? '#4b3621'
          : plat.kind === 'bridge'
            ? '#3e2723'
            : biome === 'castle'
              ? '#382a31'
              : biome === 'forest'
                ? '#243b33'
                : '#3b1915';
      const topHi =
        plat.kind === 'bridge'
          ? '#ca8a04'
          : biome === 'castle'
            ? '#7c6270'
            : biome === 'forest'
              ? '#34d399'
              : '#9a3412';
      pRect(ctx, sx, plat.y, plat.w, plat.h, '#090609');
      sRect(ctx, sx + 0.67, plat.y + 0.67, plat.w - 1.34, plat.h - 1.34, baseColor);
      sRect(ctx, sx + 1, plat.y + 0.67, plat.w - 2, 1.33, topHi);
      sRect(ctx, sx + 1, plat.y + plat.h - 1.33, plat.w - 2, 0.67, '#140b10');
      if (plat.kind === 'carpet_ledge') {
        sRect(ctx, sx + 2, plat.y - 0.33, plat.w - 4, 2.67, '#9f1239');
        sRect(ctx, sx + 2, plat.y - 0.33, plat.w - 4, 0.67, '#fbbf24');
        sRect(ctx, sx + 2, plat.y + 2, plat.w - 4, 0.67, '#b45309');
        for (let tx = 6; tx < plat.w - 8; tx += 12) {
          sRect(ctx, sx + tx, plat.y + 0.67, 3, 1, '#fde047');
        }
      } else if (plat.kind === 'secret_bridge') {
        sRect(ctx, sx, plat.y, plat.w, 1.67, '#f59e0b');
        sRect(ctx, sx + 2, plat.y + 0.33, plat.w - 4, 0.67, '#fef08a');
      } else if (plat.kind === 'bridge') {
        // Ornate chain links + brass rivets
        for (let cy = 0; cy < 16; cy += 3) {
          sRect(ctx, sx + 4 + (cy % 2) * 0.5, plat.y - 16 + cy, 1.67, 2.2, '#94a3b8');
          sRect(ctx, sx + plat.w - 6 + (cy % 2) * 0.5, plat.y - 16 + cy, 1.67, 2.2, '#94a3b8');
        }
        sRect(ctx, sx + 3, plat.y + 2, 3.67, 3.67, '#fbbf24');
        sRect(ctx, sx + 4, plat.y + 2.67, 1.33, 1.33, '#fef08a');
        sRect(ctx, sx + plat.w - 6.67, plat.y + 2, 3.67, 3.67, '#fbbf24');
        sRect(ctx, sx + plat.w - 5.67, plat.y + 2.67, 1.33, 1.33, '#fef08a');
      }
      for (let bx = 12; bx < plat.w - 6; bx += 16) {
        sRect(ctx, sx + bx, plat.y + 2.67, 1.33, plat.h - 3.67, '#120b0f');
        sRect(ctx, sx + bx + 1.33, plat.y + 2.67, 0.67, plat.h - 4.33, 'rgba(255,255,255,0.08)');
      }
    }
  }
}

const glowStampCache: Record<string, HTMLCanvasElement> = {};

function getGlowStamp(kind: 'amber' | 'emerald'): HTMLCanvasElement {
  if (glowStampCache[kind]) return glowStampCache[kind];
  const size = 112;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const gctx = c.getContext('2d');
  if (gctx) {
    const r = size / 2;
    const rg = gctx.createRadialGradient(r, r, 2, r, r, r);
    if (kind === 'emerald') {
      rg.addColorStop(0, 'rgba(52, 211, 153, 0.36)');
      rg.addColorStop(1, 'rgba(52, 211, 153, 0)');
    } else {
      rg.addColorStop(0, 'rgba(251, 191, 36, 0.38)');
      rg.addColorStop(0.45, 'rgba(234, 88, 12, 0.15)');
      rg.addColorStop(1, 'rgba(234, 88, 12, 0)');
    }
    gctx.fillStyle = rg;
    gctx.fillRect(0, 0, size, size);
  }
  glowStampCache[kind] = c;
  return c;
}

export function drawCandles(
  ctx: CanvasRenderingContext2D,
  candles: CandleProp[],
  camX: number,
  time: number,
) {
  for (const c of candles) {
    const sx = Math.round(c.x - camX);
    if (sx < -40 || sx > PIXEL_W + 40) continue;

    const flicker = Math.sin(time * 9 + c.phase) * 0.8 + Math.cos(time * 15 + c.phase) * 0.5;
    const flameY = c.kind === 'candelabra' ? c.y - 26 : c.kind === 'brazier' ? c.y - 16 : c.y - 12;

    const stamp = getGlowStamp(c.kind === 'rune_lantern' ? 'emerald' : 'amber');
    const radius = (c.kind === 'candelabra' ? 56 : c.kind === 'brazier' ? 60 : 44) + flicker * 2;
    ctx.drawImage(
      stamp,
      Math.round(sx - radius),
      Math.round(flameY - radius),
      Math.round(radius * 2),
      Math.round(radius * 2),
    );

    if (c.kind === 'candelabra') {
      pRect(ctx, sx - 5, c.y - 3, 10, 3, '#b45309');
      pRect(ctx, sx - 3, c.y - 5, 6, 2, '#d97706');
      pRect(ctx, sx - 1, c.y - 22, 2, 17, '#f59e0b');
      pRect(ctx, sx - 7, c.y - 18, 14, 2, '#fbbf24');
      [-6, 0, 6].forEach((ox, idx) => {
        const top = idx === 1 ? c.y - 26 : c.y - 23;
        pRect(ctx, sx + ox - 1, top, 2, 5, '#fef3c7');
        const fy = top - 3 + Math.round(flicker * 0.6);
        pRect(ctx, sx + ox - 1, fy, 2, 3, '#f97316');
        pRect(ctx, sx + ox, fy, 1, 2, '#fef08a');
      });
    } else if (c.kind === 'wall_sconce') {
      pRect(ctx, sx - 2, c.y - 4, 4, 5, '#78350f');
      pRect(ctx, sx - 1, c.y - 11, 2, 7, '#fef3c7');
      pRect(ctx, sx - 1, c.y - 14 + Math.round(flicker * 0.5), 2, 3, '#fb923c');
      pRect(ctx, sx, c.y - 13 + Math.round(flicker * 0.5), 1, 2, '#fef08a');
    } else if (c.kind === 'rune_lantern') {
      pRect(ctx, sx - 3, c.y - 14, 6, 10, '#1e293b');
      pRect(ctx, sx - 2, c.y - 12, 4, 6, '#34d399');
    } else {
      pRect(ctx, sx - 6, c.y - 10, 12, 10, '#3f2222');
      pRect(ctx, sx - 4, c.y - 15 + Math.round(flicker), 8, 5, '#f97316');
      pRect(ctx, sx - 2, c.y - 17 + Math.round(flicker), 4, 4, '#fde047');
    }
  }
}

export function drawInteractables(
  ctx: CanvasRenderingContext2D,
  props: InteractableProp[],
  passages: HiddenPassage[],
  camX: number,
  time: number,
) {
  for (const hp of passages) {
    const sx = Math.round(hp.x - camX);
    if (sx < -50 || sx > PIXEL_W + 50) continue;
    if (hp.discovered) {
      pRect(ctx, sx, hp.y, hp.w, hp.h, '#090609');
      pRect(ctx, sx + 2, hp.y + 2, hp.w - 4, hp.h - 2, '#171019');
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.fillRect(sx + 6, hp.y + 6, hp.w - 12, hp.h - 8);
    }
  }

  for (const p of props) {
    const sx = Math.round(p.x - camX);
    if (sx + p.w < -40 || sx > PIXEL_W + 40) continue;

    if (p.kind === 'throne') {
      sRect(ctx, sx - 3, p.y + 29, 34, 6, '#09060b');
      sRect(ctx, sx - 2, p.y + 30, 32, 4, '#451a03');
      sRect(ctx, sx + 2, p.y - 3, 24, p.h, '#09060b');
      sRect(ctx, sx + 3, p.y - 2, 22, p.h - 2, '#290f02');
      sRect(ctx, sx + 5, p.y, 18, p.h - 4, '#5c180c');
      sRect(ctx, sx + 7, p.y + 2, 14, p.h - 8, '#991b1b');
      sRect(ctx, sx + 8.5, p.y + 3, 3, p.h - 10, '#be123c');
      sRect(ctx, sx + 6, p.y - 5, 16, 4, '#f59e0b');
      sRect(ctx, sx + 6, p.y - 5, 16, 1.5, '#fef08a');
      sRect(ctx, sx + 8, p.y - 7.5, 3, 2.5, '#fef08a');
      sRect(ctx, sx + 13, p.y - 8.5, 2, 3.5, '#fef08a');
      sRect(ctx, sx + 17, p.y - 7.5, 3, 2.5, '#fef08a');
      sRect(ctx, sx, p.y + 18, 28, 12, '#7f1d1d');
      sRect(ctx, sx + 2, p.y + 18, 24, 2, '#fbbf24');
      sRect(ctx, sx, p.y + 15, 5, 16, '#d97706');
      sRect(ctx, sx + 23, p.y + 15, 5, 16, '#d97706');
      sRect(ctx, sx + 11, p.y + 6, 6, 8, '#fbbf24');
      sRect(ctx, sx + 12.5, p.y + 7.5, 3, 5, '#7f1d1d');
      sRect(ctx, sx + 13.5, p.y + 9, 1, 2, '#fde047');
    } else if (p.kind === 'broken_brick') {
      if (p.activated) continue;
      pRect(ctx, sx, p.y, p.w, p.h, '#241a20');
      pRect(ctx, sx + 1, p.y + 1, p.w - 2, p.h - 2, '#3d2d35');
      for (let by = 2; by < p.h - 5; by += 8) {
        pRect(ctx, sx + 2, p.y + by, Math.min(10, p.w - 4), 5, '#4d3a43');
        if (p.w > 22) {
          pRect(ctx, sx + 14, p.y + by + 1, p.w - 16, 5, '#46343d');
        }
      }
      const c1 = Math.min(8, p.h - 4);
      pRect(ctx, sx + Math.floor(p.w * 0.42), p.y + 2, 2, c1, '#120c10');
      if (p.h > 22) {
        pRect(ctx, sx + Math.floor(p.w * 0.48), p.y + 10, 2, 10, '#120c10');
        pRect(ctx, sx + Math.floor(p.w * 0.38), p.y + 20, 3, Math.min(10, p.h - 22), '#120c10');
      }
      if (p.secretId) {
        const pulse = 0.45 + 0.45 * Math.sin(time * 4.5);
        ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
        ctx.fillRect(sx + Math.floor(p.w * 0.42), p.y + 3, 2, c1);
        if (p.h > 22) {
          ctx.fillRect(sx + Math.floor(p.w * 0.48), p.y + 11, 2, 9);
        }
      }
    } else if (p.kind === 'lever') {
      pRect(ctx, sx + 2, p.y + 14, 14, 8, '#475569');
      const tilt = p.activated ? 5 : -5;
      pRect(ctx, sx + 8 + tilt, p.y + 2, 3, 14, '#cbd5e1');
      pRect(ctx, sx + 7 + tilt, p.y, 5, 4, p.activated ? '#34d399' : '#ef4444');
    } else if (p.kind === 'pressure_plate') {
      pRect(
        ctx,
        sx,
        p.y + (p.activated ? 3 : 0),
        p.w,
        p.h - (p.activated ? 3 : 0),
        p.activated ? '#34d399' : '#f59e0b',
      );
    } else if (p.kind === 'tapestry') {
      if (p.activated) continue;
      const sway = Math.round(Math.sin(time * 3) * 1.5);
      pRect(ctx, sx + sway, p.y, p.w, p.h, '#881337');
      pRect(ctx, sx + 4 + sway, p.y + 4, p.w - 8, p.h - 10, '#be123c');
      pRect(ctx, sx + 9 + sway, p.y + 8, 6, 12, '#fbbf24');
    } else if (p.kind === 'chest') {
      if (p.id === 'chest_fire_sword_op') {
        const auraR = 22 + Math.round(Math.sin(time * 7) * 3);
        ctx.save();
        ctx.fillStyle = p.activated ? 'rgba(249,115,22,0.12)' : 'rgba(220,38,38,0.28)';
        ctx.beginPath();
        ctx.arc(sx + 10, p.y + 8, auraR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        sRect(ctx, sx - 3, p.y + 2, p.w + 6, p.h, '#09060b');
        sRect(ctx, sx - 2, p.y + 3, p.w + 4, p.h - 2, '#450a0a');
        sRect(ctx, sx, p.y + (p.activated ? 0 : 4), p.w, 6, '#dc2626');
        sRect(ctx, sx + 2, p.y + (p.activated ? 1 : 5), p.w - 4, 2, '#fb923c');
        sRect(ctx, sx + 8, p.y + 8, 4, 4, '#fde047');
        sRect(ctx, sx + 9, p.y + 9, 2, 2, '#ffffff');
      } else {
        sRect(ctx, sx - 1, p.y + (p.activated ? -0.5 : 3), p.w + 2, p.h - (p.activated ? -1 : 2), '#09060b');
        sRect(ctx, sx, p.y + 4, p.w, p.h - 4, '#78350f');
        sRect(ctx, sx + 2, p.y + 5, p.w - 4, p.h - 6, '#92400e');
        sRect(ctx, sx, p.y + (p.activated ? 0 : 4), p.w, 6, p.activated ? '#92400e' : '#b45309');
        sRect(ctx, sx + 1, p.y + (p.activated ? 0.5 : 4.5), p.w - 2, 1.5, '#fde047');
        sRect(ctx, sx + 8, p.y + 8, 4, 4, '#fbbf24');
        sRect(ctx, sx + 9, p.y + 9, 2, 2, '#fef08a');
      }
    } else if (p.kind === 'checkpoint') {
      pRect(ctx, sx + 4, p.y + 10, 12, 20, '#334155');
      pRect(ctx, sx + 1, p.y + 8, 18, 4, '#64748b');
      if (p.activated) {
        const flick = Math.round(Math.sin(time * 10) * 1.5);
        pRect(ctx, sx + 6, p.y + flick, 8, 8, '#38bdf8');
        pRect(ctx, sx + 8, p.y + 2 + flick, 4, 5, '#e0f2fe');
      } else {
        pRect(ctx, sx + 6, p.y + 4, 8, 4, '#1e293b');
      }
    } else if (p.kind === 'escape_gate') {
      pRect(ctx, sx, p.y, p.w, p.h, '#f59e0b');
      pRect(ctx, sx + 4, p.y + 4, p.w - 8, p.h - 4, '#fef08a');
    } else if (p.kind === 'isekai_portal') {
      // Dimensional Golden Spin Isekai Portal swirling with emerald & azure energy!
      const pulse = Math.sin(time * 6) * 3;
      ctx.save();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
      ctx.beginPath();
      ctx.ellipse(sx + p.w / 2, p.y + p.h / 2, p.w / 2 + 8 + pulse, p.h / 2 + 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(sx + p.w / 2, p.y + p.h / 2, p.w / 2 + 2, p.h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx + p.w / 2, p.y + p.h / 2, p.w / 3, p.h / 2 - 6, time * 2, 0, Math.PI * 2);
      ctx.stroke();
      pRect(ctx, sx + p.w / 2 - 4, p.y + p.h / 2 - 6, 8, 12, '#fef08a');
      ctx.restore();
    } else if (
      p.kind === 'guild_door' ||
      p.kind === 'wardrobe_door' ||
      p.kind === 'potion_door' ||
      p.kind === 'weapons_door' ||
      p.kind === 'town_exit_door'
    ) {
      const frameCol =
        p.kind === 'guild_door'
          ? '#b45309'
          : p.kind === 'wardrobe_door'
            ? '#db2777'
            : p.kind === 'potion_door'
              ? '#10b981'
              : p.kind === 'weapons_door'
                ? '#f59e0b'
                : '#0ea5e9';
      pRect(ctx, sx - 2, p.y - 2, p.w + 4, p.h + 2, '#1c1008');
      pRect(ctx, sx, p.y, p.w, p.h, '#451a03');
      pRect(ctx, sx + 3, p.y + 3, p.w - 6, p.h - 3, '#78350f');
      pRect(ctx, sx + 4, p.y + 6, p.w - 8, 3, frameCol);
      pRect(ctx, sx + p.w - 8, p.y + Math.floor(p.h * 0.55), 3, 3, '#fde047');
    } else if (p.kind === 'guild_bar') {
      pRect(ctx, sx, p.y + 8, p.w, p.h - 8, '#3f1d0b');
      pRect(ctx, sx - 2, p.y + 6, p.w + 4, 4, '#92400e');
      pRect(ctx, sx + 10, p.y - 2, 12, 10, '#78350f');
      pRect(ctx, sx + 10, p.y + 2, 12, 2, '#94a3b8');
      pRect(ctx, sx + 34, p.y + 1, 6, 6, '#fbbf24');
    } else if (p.kind === 'guild_reception') {
      pRect(ctx, sx, p.y + 6, p.w, p.h - 6, '#451a03');
      pRect(ctx, sx - 2, p.y + 4, p.w + 4, 4, '#b45309');
      pRect(ctx, sx + 8, p.y - 1, 14, 5, '#fef3c7');
      pRect(ctx, sx + 26, p.y - 4, 8, 8, '#38bdf8');
    } else if (p.kind === 'guild_floor2_reception') {
      pRect(ctx, sx, p.y + 6, p.w, p.h - 6, '#581c87');
      pRect(ctx, sx - 2, p.y + 4, p.w + 4, 4, '#fbbf24');
      pRect(ctx, sx + 10, p.y - 2, 16, 6, '#fef08a');
      pRect(ctx, sx + 32, p.y - 5, 10, 9, '#f43f5e');
    } else if (p.kind === 'guild_stairs') {
      // Grand Carved Oak Staircase ascending rightwards up to 2nd Floor
      pRect(ctx, sx, p.y, p.w, p.h, '#2b1206');
      for (let st = 0; st < 7; st++) {
        const syStep = p.y + p.h - (st + 1) * 11;
        const sxStep = sx + st * 8;
        pRect(ctx, sxStep, syStep, p.w - st * 8 + 12, 11, st % 2 === 0 ? '#78350f' : '#92400e');
        pRect(ctx, sxStep, syStep, 10, 2, '#fbbf24');
      }
      pRect(ctx, sx + 4, p.y + 4, 4, p.h - 4, '#b45309');
      pRect(ctx, sx + p.w - 6, p.y - 14, 4, 18, '#fbbf24');
    } else if (p.kind === 'wardrobe_counter') {
      pRect(ctx, sx, p.y + 6, p.w, p.h - 6, '#500724');
      pRect(ctx, sx - 2, p.y + 4, p.w + 4, 4, '#ec4899');
      pRect(ctx, sx + 8, p.y - 4, 12, 8, '#f472b6');
      pRect(ctx, sx + 24, p.y - 2, 10, 6, '#fbbf24');
    } else if (p.kind === 'potion_counter') {
      // Alchemist Glowing Crystal Counter
      pRect(ctx, sx, p.y + 6, p.w, p.h - 6, '#1e1b4b');
      pRect(ctx, sx - 2, p.y + 4, p.w + 4, 4, '#a855f7');
      pRect(ctx, sx + 8, p.y - 5, 8, 9, '#ef4444');
      pRect(ctx, sx + 22, p.y - 6, 8, 10, '#06b6d4');
      pRect(ctx, sx + 36, p.y - 4, 8, 8, '#a855f7');
      pRect(ctx, sx + 50, p.y - 5, 8, 9, '#10b981');
    } else if (p.kind === 'weapons_counter') {
      // Blacksmith Forge Counter & Anvil
      pRect(ctx, sx, p.y + 6, p.w, p.h - 6, '#431407');
      pRect(ctx, sx - 2, p.y + 4, p.w + 4, 4, '#f59e0b');
      pRect(ctx, sx + 12, p.y - 6, 20, 10, '#334155');
      pRect(ctx, sx + 44, p.y - 3, 18, 7, '#fb923c');
    } else if (p.kind === 'dungeon_exit_rope') {
      // Hanging Escape Rope + Lantern
      pRect(ctx, sx + 14, p.y, 4, p.h - 10, '#d97706');
      pRect(ctx, sx + 12, p.y + p.h - 14, 8, 8, '#b45309');
      pRect(ctx, sx + 22, p.y + 8, 8, 10, '#fef08a');
    } else if (p.kind === 'dungeon_descend_gate') {
      // Glowing Abyssal Descent Stair-Gate
      pRect(ctx, sx, p.y, p.w, p.h, '#1e1b4b');
      pRect(ctx, sx + 4, p.y + 4, p.w - 8, p.h - 4, '#312e81');
      pRect(ctx, sx + 10, p.y + 12, p.w - 20, p.h - 12, '#09060b');
      pRect(ctx, sx + 14, p.y + 18, p.w - 28, 6, '#a855f7');
    } else if (p.kind === 'citadel_portal') {
      const pulse = Math.sin(time * 5) * 2;
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx + p.w / 2, p.y + p.h / 2, p.w / 2 + pulse, p.h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      pRect(ctx, sx + p.w / 2 - 4, p.y + p.h / 2 - 8, 8, 16, '#7dd3fc');
      ctx.restore();
    } else if (p.kind === 'arena_door') {
      pRect(ctx, sx, p.y, p.w, p.h, '#7f1d1d');
      pRect(ctx, sx + 6, p.y + 6, p.w - 12, p.h - 6, '#09060b');
      pRect(ctx, sx + 10, p.y + 10, p.w - 20, 4, '#fbbf24');
    } else if (p.kind === 'arena_board') {
      // Grand Arena Challenger Selection Pedestal
      pRect(ctx, sx + 4, p.y + 20, p.w - 8, p.h - 20, '#44403c');
      pRect(ctx, sx, p.y, p.w, 26, '#7f1d1d');
      pRect(ctx, sx + 3, p.y + 3, p.w - 6, 20, '#fef3c7');
      pRect(ctx, sx + 8, p.y + 7, p.w - 16, 3, '#b91c1c');
      pRect(ctx, sx + 8, p.y + 13, p.w - 20, 3, '#1e293b');
      pRect(ctx, sx + 8, p.y + 18, p.w - 14, 2, '#d97706');
    } else if (p.kind === 'stand_shrine') {
      // Royal Stand Shrine Altar Pedestal & Hovering Star-Stone Crest
      const bob = Math.sin(time * 4) * 2;
      sRect(ctx, sx + 5, p.y + 35, p.w - 10, p.h - 35, '#09060b');
      sRect(ctx, sx + 6, p.y + 36, p.w - 12, p.h - 36, '#334155');
      sRect(ctx, sx + 8, p.y + 37, p.w - 16, p.h - 38, '#475569');
      sRect(ctx, sx + 3, p.y + 31, p.w - 6, 6, '#09060b');
      sRect(ctx, sx + 4, p.y + 32, p.w - 8, 4, '#fbbf24');
      sRect(ctx, sx + 5, p.y + 32, p.w - 10, 1.5, '#fef08a');
      sRect(ctx, sx + 13, p.y + 21, p.w - 26, 11, '#09060b');
      sRect(ctx, sx + 14, p.y + 22, p.w - 28, 9, '#881337');
      sRect(ctx, sx + 16, p.y + 23, p.w - 32, 7, '#be123c');
      sRect(ctx, sx + p.w / 2 - 6, p.y + 5 + bob, 12, 16, '#09060b');
      sRect(ctx, sx + p.w / 2 - 5, p.y + 6 + bob, 10, 14, '#a855f7');
      sRect(ctx, sx + p.w / 2 - 3, p.y + 8 + bob, 6, 10, '#fde047');
      sRect(ctx, sx + p.w / 2 - 1.5, p.y + 10 + bob, 3, 6, '#ffffff');
    } else if (p.kind === 'town_gate_out') {
      // Grand Royal East Gatehouse Portcullis leading out to Solaris Forest
      sRect(ctx, sx - 1, p.y - 1, p.w + 2, p.h + 1, '#09060b');
      sRect(ctx, sx, p.y, p.w, p.h, '#475569');
      sRect(ctx, sx + 3, p.y + 3, p.w - 6, p.h - 3, '#64748b');
      sRect(ctx, sx + 4, p.y + 4, p.w - 8, 8, '#fbbf24');
      sRect(ctx, sx + 6, p.y + 5, p.w - 12, 2.5, '#fef08a');
      for (let c = 0; c < 4; c++) {
        sRect(ctx, sx + 3.5 + c * 18, p.y - 6.5, 11, 9, '#09060b');
        sRect(ctx, sx + 4 + c * 18, p.y - 6, 10, 8, '#64748b');
        sRect(ctx, sx + 5 + c * 18, p.y - 5, 8, 2, '#94a3b8');
      }
      sRect(ctx, sx + 14, p.y + 22, p.w - 28, p.h - 22, '#052e16');
      sRect(ctx, sx + 18, p.y + 26, p.w - 36, p.h - 26, '#020617');
      for (let bar = 0; bar < 5; bar++) {
        sRect(ctx, sx + 18 + bar * 8, p.y + 24, 3, 12, '#94a3b8');
        sRect(ctx, sx + 18.5 + bar * 8, p.y + 24, 1, 11, '#e2e8f0');
      }
      sRect(ctx, sx + 3.5, p.y + 17.5, 9, 29, '#09060b');
      sRect(ctx, sx + 4, p.y + 18, 8, 28, '#9f1239');
      sRect(ctx, sx + p.w - 12.5, p.y + 17.5, 9, 29, '#09060b');
      sRect(ctx, sx + p.w - 12, p.y + 18, 8, 28, '#9f1239');
      sRect(ctx, sx + 5, p.y + 20, 6, 4, '#fbbf24');
      sRect(ctx, sx + p.w - 11, p.y + 20, 6, 4, '#fbbf24');
    } else if (p.kind === 'outskirts_return_town') {
      sRect(ctx, sx - 1, p.y - 1, p.w + 2, p.h + 1, '#09060b');
      sRect(ctx, sx, p.y, p.w, p.h, '#64748b');
      sRect(ctx, sx + 4, p.y + 4, p.w - 8, 6, '#fbbf24');
      sRect(ctx, sx + 10, p.y + 18, p.w - 20, p.h - 18, '#fef3c7');
      sRect(ctx, sx + 14, p.y + 22, p.w - 28, p.h - 22, '#f59e0b');
      sRect(ctx, sx + 4, p.y + 16, 5, 22, '#9f1239');
      sRect(ctx, sx + 4.5, p.y + 17, 4, 2, '#fbbf24');
    } else if (p.kind === 'outskirts_cave_entrance') {
      sRect(ctx, sx - 1, p.y + 9, p.w + 2, p.h - 9, '#09060b');
      sRect(ctx, sx, p.y + 10, p.w, p.h - 10, '#334155');
      sRect(ctx, sx + 10, p.y, p.w - 20, 18, '#475569');
      sRect(ctx, sx + 20, p.y + 20, p.w - 40, p.h - 20, '#09040a');
      sRect(ctx, sx + 24, p.y + 24, p.w - 48, 8, '#7f1d1d');
      sRect(ctx, sx + 8, p.y + 14, 14, 6, '#16a34a');
      sRect(ctx, sx + 10, p.y + 14, 10, 2, '#4ade80');
      sRect(ctx, sx + p.w - 24, p.y + 18, 16, 6, '#15803d');
      sRect(ctx, sx + p.w - 22, p.y + 18, 12, 2, '#4ade80');
    } else if (p.kind === 'outskirts_cave_exit') {
      sRect(ctx, sx + 17, p.y, 6, p.h - 8, '#09060b');
      sRect(ctx, sx + 18, p.y, 4, p.h - 8, '#d97706');
      sRect(ctx, sx + 15, p.y + p.h - 12, 10, 8, '#b45309');
      sRect(ctx, sx + 25, p.y + 9, 10, 13, '#09060b');
      sRect(ctx, sx + 26, p.y + 10, 8, 11, '#fef08a');
      sRect(ctx, sx + 27.5, p.y + 12, 5, 7, '#ffffff');
    } else if (p.kind === 'side_quest_npc') {
      const quest = SIDE_QUESTS.find((q) => q.id === p.sideQuestId);
      const coat = quest?.coatColor ?? '#7f1d1d';
      const hair = quest?.hairColor ?? '#e2e8f0';
      const shirt = quest?.shirtColor ?? '#cbd5e1';
      const bob = Math.sin(time * 4.5 + p.x * 0.05) * 1.5;
      // High-res ink-outlined Side Quest NPC + Gold Quest Marker
      sRect(ctx, sx + 4, p.y + 19.5, 4.5, 6.5, '#09060b');
      sRect(ctx, sx + 9.5, p.y + 19.5, 4.5, 6.5, '#09060b');
      sRect(ctx, sx + 5, p.y + 20, 3, 6, '#1e293b');
      sRect(ctx, sx + 10, p.y + 20, 3, 6, '#1e293b');
      sRect(ctx, sx + 2, p.y + 9.5, 14, 12, '#09060b');
      sRect(ctx, sx + 3, p.y + 10, 12, 11, coat);
      sRect(ctx, sx + 6, p.y + 11, 6, 8, shirt);
      sRect(ctx, sx + 7, p.y + 12, 4, 1.5, '#fbbf24');
      sRect(ctx, sx + 4, p.y + 1, 10, 9.5, '#09060b');
      sRect(ctx, sx + 5, p.y + 2, 8, 8, '#fde68a');
      sRect(ctx, sx + 3.5, p.y + 0.5, 11, 3.8, hair);
      sRect(ctx, sx + 6.5, p.y + 4.8, 2, 2.4, '#0f172a');
      sRect(ctx, sx + 9.8, p.y + 4.8, 2, 2.4, '#0f172a');
      sRect(ctx, sx + 7.2, p.y + 5.2, 0.8, 0.8, '#ffffff');
      sRect(ctx, sx + 10.5, p.y + 5.2, 0.8, 0.8, '#ffffff');
      // Bobbing Golden Quest '!' Marker
      sRect(ctx, sx + 6.5, p.y - 14.5 + bob, 5, 8, '#09060b');
      sRect(ctx, sx + 7, p.y - 14 + bob, 4, 7, '#fbbf24');
      sRect(ctx, sx + 7.8, p.y - 13 + bob, 2, 5, '#fef08a');
      sRect(ctx, sx + 6.5, p.y - 5.5 + bob, 5, 4, '#09060b');
      sRect(ctx, sx + 7, p.y - 5 + bob, 4, 3, '#fde047');
    }
  }

  // Cryptic glowing threshold hint at x = 0..14 inviting the player backwards behind Checkpoint 1
  const gateScreenX = Math.round(-camX);
  if (gateScreenX > -32 && gateScreenX < PIXEL_W + 24) {
    const pulse = 0.38 + 0.25 * Math.sin(time * 3.8);
    ctx.save();
    ctx.fillStyle = `rgba(127, 29, 29, ${pulse})`;
    ctx.fillRect(gateScreenX - 6, FLOOR_Y - 56, 12, 56);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.72)';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('◀ ?', gateScreenX - 2, FLOOR_Y - 62);
    ctx.restore();
  }
}

export function drawWarrior(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 1 | -1,
  squashX: number,
  squashY: number,
  walkCycle: number,
  idleTimer: number,
  attackPhase: PlayerState['attackPhase'],
  weaponId: WeaponId,
  comboStep: number,
  parryActive: boolean,
  hitFlash: number,
  camX: number,
  isPeer = false,
  peerColor = '#60a5fa',
  peerName?: string,
  customization: WarriorCustomization = DEFAULT_WARRIOR_CUSTOMIZATION,
  comboSubStep = 0,
  isSpinDashAttack = false,
  simTime = 0,
  labelCtx?: CanvasRenderingContext2D | null,
  dinoFormActive = false,
  equippedStand: StandId = 'star_platinum',
) {
  const sx = Math.round(x - camX);
  const sy = Math.round(y);
  if (sx < -52 || sx > PIXEL_W + 52) return;

  // Ground contact shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.fillRect(sx + (dinoFormActive ? -3 : 1), sy + 25, dinoFormActive ? 22 : 14, 3);
  ctx.restore();

  ctx.save();
  ctx.translate(sx + 8, sy + 26);
  ctx.scale(facing * squashX, squashY);

  const breath = Math.round(Math.sin(idleTimer * 4) * 1);
  const stride = Math.round(Math.sin(walkCycle) * 2.5);
  const cloakWave1 = Math.round(Math.sin(idleTimer * 4.5 + walkCycle) * 1.6);
  const cloakWave2 = Math.round(Math.sin(idleTimer * 4.5 + walkCycle - 0.9) * 2.4);

  if (dinoFormActive && !isPeer) {
    // SCARY MONSTERS DINOSTAND FORM (Pixelated Emerald-Gold Velociraptor + Razor Claw Slashes!)
    const flash = hitFlash > 0;
    const hideDark = flash ? '#ffffff' : '#064e3b';
    const hideMain = flash ? '#ffffff' : '#15803d';
    const hideLight = flash ? '#ffffff' : '#4ade80';
    const belly = flash ? '#ffffff' : '#bef264';
    const crest = flash ? '#ffffff' : '#fbbf24';

    if (attackPhase === 'active') {
      ctx.rotate(0.16);
    }
    // Muscular raptor tail
    pRect(ctx, -20, -14 + breath, 14, 5, hideDark);
    pRect(ctx, -18, -13 + breath, 12, 3, hideMain);
    pRect(ctx, -23, -15 + breath, 5, 3, crest);
    // Digitigrade raptor legs + sickle talons
    pRect(ctx, -6 + stride, -9, 5, 9, hideDark);
    pRect(ctx, -5 + stride, -3, 7, 3, hideMain);
    pRect(ctx, 2 - stride, -9, 5, 9, hideMain);
    pRect(ctx, 3 - stride, -3, 7, 3, hideLight);
    pRect(ctx, 8 - stride, -5, 3, 3, '#fef08a');
    // Armored emerald torso & pale-lime belly plates
    pRect(ctx, -8, -21 + breath, 16, 13, hideDark);
    pRect(ctx, -7, -20 + breath, 14, 11, hideMain);
    pRect(ctx, 1, -18 + breath, 6, 8, belly);
    pRect(ctx, -6, -22 + breath, 4, 2, crest);
    pRect(ctx, -1, -23 + breath, 4, 2, crest);
    // Elongated Velociraptor skull, amber slit eye & serrated jaws
    pRect(ctx, -2, -31 + breath, 16, 11, hideDark);
    pRect(ctx, -1, -30 + breath, 14, 8, hideMain);
    pRect(ctx, 6, -29 + breath, 11, 5, hideLight);
    pRect(ctx, 0, -33 + breath, 10, 3, crest);
    pRect(ctx, 4, -28 + breath, 3, 2, '#fbbf24');
    pRect(ctx, 5, -28 + breath, 1, 2, '#09060b');
    pRect(ctx, 8, -24 + breath, 8, 2, '#f8fafc');
    // Clawed forelimb
    pRect(ctx, 5, -17 + breath, 7, 4, hideLight);
    pRect(ctx, 11, -17 + breath, 4, 2, '#fef08a');
    pRect(ctx, 11, -14 + breath, 4, 2, '#fef08a');

    if (attackPhase === 'active') {
      const reach = Math.round(WEAPONS[weaponId].range * 1.38);
      ctx.lineCap = 'round';
      for (let cl = -1; cl <= 1; cl++) {
        ctx.strokeStyle = cl === 0 ? '#fef08a' : '#22c55e';
        ctx.lineWidth = cl === 0 ? 5 : 4;
        ctx.beginPath();
        ctx.arc(8, -14 + cl * 5, reach * 0.72, -0.95, 0.95);
        ctx.stroke();
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(10, -14, reach * 0.74, -0.8, 0.8);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  const quirkCycle = idleTimer > 2.5 ? (idleTimer - 2.5) % 6 : 0;
  const isAnimePose = quirkCycle > 3.6 && quirkCycle < 5.0 && attackPhase === 'none';

  const baseArmor = isPeer ? '#94a3b8' : customization.armorColor;
  const baseCape = isPeer ? peerColor : customization.cloakColor;
  const armorHi = hitFlash > 0 ? '#ffffff' : shadeColor(baseArmor, 0.34);
  const armorMain = hitFlash > 0 ? '#ffffff' : baseArmor;
  const armorMid = hitFlash > 0 ? '#ffffff' : shadeColor(baseArmor, -0.32);
  const armorDark = hitFlash > 0 ? '#ffffff' : shadeColor(baseArmor, -0.56);
  const capeColor = hitFlash > 0 ? '#ffffff' : baseCape;
  const capeShadow = hitFlash > 0 ? '#ffffff' : shadeColor(baseCape, -0.45);
  const plumeColor = isPeer ? peerColor : customization.plumeColor;
  const plumeShade = shadeColor(plumeColor, -0.32);
  const visorGlow = isPeer ? '#38bdf8' : customization.visorColor;

  // Dynamic body lean & rotation during Spinning Poke Dash or Triple Slash!
  if (isSpinDashAttack) {
    ctx.translate(0, -13);
    ctx.rotate(simTime * 28);
    ctx.translate(0, 13);
  } else if (attackPhase === 'active') {
    const lean = comboStep === 2 ? 0.22 : comboStep === 3 ? 0.14 : 0.1;
    ctx.rotate(lean);
  }

  // Multi-segment billowing anime scarf/cape with crisp sub-pixel ink trim & gold hem
  sRect(ctx, -11.67 - cloakWave1, -21 + breath, 8.67, 12, '#090609');
  sRect(ctx, -11 - cloakWave1, -20.33 + breath, 7.33, 10.67, capeColor);
  sRect(ctx, -14.67 - cloakWave2, -13 + breath, 7, 9, '#090609');
  sRect(ctx, -14 - cloakWave2, -12.33 + breath, 6, 7.33, capeShadow);
  sRect(ctx, -13 - cloakWave2, -13 + breath, 4, 5, capeColor);
  sRect(ctx, -14 - cloakWave2, -6 + breath, 5.33, 1, '#f59e0b');

  // Crisp sub-pixel pixel silhouette outline
  sRect(ctx, -6.67, -29 + breath, 13.33, 23.67, '#090609');

  // Hip leather scabbard behind back
  sRect(ctx, -9, -12 + breath, 3, 9, '#78350f');
  sRect(ctx, -9, -12 + breath, 3, 1.67, '#fbbf24');

  // Articulated greaves, brass knee-cops & pointed steel-toe sabatons
  sRect(ctx, -5 + stride, -8.33, 4.33, 8.33, '#09060b');
  sRect(ctx, -4.67 + stride, -8, 3.67, 7.67, armorDark);
  sRect(ctx, -4 + stride, -7, 1.67, 4, armorMid);
  sRect(ctx, -5 + stride, -6, 3, 1.67, '#d97706');
  sRect(ctx, 0.67 - stride, -8.33, 4.67, 8.33, '#09060b');
  sRect(ctx, 1 - stride, -8, 4, 7.67, armorMain);
  sRect(ctx, 1.67 - stride, -7, 2.67, 2, armorHi);
  sRect(ctx, 1 - stride, -6, 3, 1.67, '#fbbf24');
  sRect(ctx, 1 - stride, -3, 6, 3, '#1e293b');
  sRect(ctx, 4 - stride, -2.33, 3, 1, armorHi);

  const outfitStyle = customization.outfitStyle ?? 'knight_plate';
  const headgearStyle = customization.headgearStyle ?? 'helm';

  // Sculpted knight cuirass / adventurer tunic / crimson guild coat / demon slayer / royal regalia
  sRect(ctx, -6, -19 + breath, 12, 12, armorMain);
  if (outfitStyle === 'adventurer_tunic') {
    sRect(ctx, -6, -19 + breath, 12, 13, '#15803d');
    sRect(ctx, -4, -18 + breath, 8, 10, '#166534');
    sRect(ctx, -1, -18 + breath, 2.67, 12, '#fef3c7');
  } else if (outfitStyle === 'guild_coat') {
    sRect(ctx, -6, -19 + breath, 12, 13, '#7f1d1d');
    sRect(ctx, -5, -18 + breath, 10, 11, '#991b1b');
    sRect(ctx, -2, -18 + breath, 4, 11, '#fef3c7');
    sRect(ctx, -1, -16 + breath, 2, 4, '#fbbf24');
  } else if (outfitStyle === 'demon_slayer') {
    sRect(ctx, -6, -19 + breath, 12, 13, '#3b0764');
    sRect(ctx, -5, -18 + breath, 5, 11, '#7e22ce');
    sRect(ctx, 0, -18 + breath, 5, 11, '#1e1b4b');
    sRect(ctx, -2, -14 + breath, 4, 3, '#f43f5e');
  } else if (outfitStyle === 'royal_regalia') {
    sRect(ctx, -6, -19 + breath, 12, 13, '#e2e8f0');
    sRect(ctx, -5, -18 + breath, 10, 11, '#f8fafc');
    sRect(ctx, -2, -18 + breath, 4, 11, '#9f1239');
    sRect(ctx, -2, -16 + breath, 4, 3, '#fbbf24');
  } else {
    sRect(ctx, -5, -18 + breath, 5, 6, armorHi);
    sRect(ctx, 0, -18 + breath, 5, 7, armorMid);
    sRect(ctx, -4.33, -17.33 + breath, 2, 4, '#ffffff');
  }
  sRect(ctx, -2, -16 + breath, 2, 2, '#fbbf24');
  sRect(ctx, -7, -20 + breath, 6, 5, '#d97706');
  sRect(ctx, -6, -20 + breath, 4, 1.67, '#fde047');
  sRect(ctx, -6, -10 + breath, 12, 2, '#b45309');
  sRect(ctx, -1, -10 + breath, 3, 2, '#fef08a');

  // Headgear
  if (headgearStyle === 'beret') {
    sRect(ctx, -6, -27 + breath, 11, 8, '#f3cba5');
    sRect(ctx, 1, -24 + breath, 2, 2, '#0f172a');
    sRect(ctx, -7, -32 + breath, 13, 5, capeColor);
    sRect(ctx, -5, -33 + breath, 8, 2, '#fde047');
  } else if (headgearStyle === 'bandana') {
    sRect(ctx, -6, -27 + breath, 11, 8, '#f3cba5');
    sRect(ctx, 1, -24 + breath, 2, 2, '#0f172a');
    sRect(ctx, -6, -29 + breath, 12, 3, '#dc2626');
    sRect(ctx, -10 - Math.round(cloakWave1 * 0.4), -29 + breath, 5, 2, '#ef4444');
  } else if (headgearStyle === 'circlet') {
    sRect(ctx, -6, -27 + breath, 11, 8, '#f3cba5');
    sRect(ctx, -6, -29 + breath, 11, 3, '#334155');
    sRect(ctx, 1, -24 + breath, 2, 2, visorGlow);
    sRect(ctx, -6, -28 + breath, 12, 2, '#fbbf24');
    sRect(ctx, 0, -29 + breath, 2, 2, '#38bdf8');
  } else {
    sRect(ctx, -6, -28 + breath, 12, 9, armorMain);
    sRect(ctx, -5, -28 + breath, 9, 1.67, armorHi);
    sRect(ctx, -6, -26 + breath, 12, 1, '#d97706');
    sRect(ctx, -1, -24 + breath, 7, 3, '#0f172a');
    sRect(ctx, 1, -23.33 + breath, 3, 1.67, isAnimePose ? '#fef08a' : visorGlow);
    sRect(ctx, 1.67, -23.33 + breath, 1, 0.67, '#ffffff');
    sRect(ctx, -5, -33 + breath, 8, 5, '#090609');
    sRect(ctx, -4, -32 + breath, 6, 4, plumeColor);
    sRect(ctx, -9 - Math.round(cloakWave1 * 0.5), -31 + breath, 6, 3, plumeShade);
  }

  if (customization.crownEquipped) {
    const cy = headgearStyle === 'helm' ? -36 : -34;
    sRect(ctx, -5, cy + breath, 10, 4, '#f59e0b');
    sRect(ctx, -5, cy - 3 + breath, 2, 3, '#fbbf24');
    sRect(ctx, -1, cy - 4 + breath, 3, 4, '#fef08a');
    sRect(ctx, 3, cy - 3 + breath, 2, 3, '#fbbf24');
    sRect(ctx, 0, cy + 1 + breath, 2, 2, '#e11d48');
  }

  // Distinct High-Res Baked Weapon Rendering & Full Choreography
  const weapon = WEAPONS[weaponId];
  const vLen = weapon.visualLength;
  const vWid = weapon.visualWidth;
  const wSprite = getBakedWeaponWorldSprite(weaponId);
  const drawW = Math.max(8, 7 + Math.round(vWid * 1.1));
  const drawH = Math.max(20, Math.round(vLen * 1.35));

  if (!isPeer && equippedStand === 'gyro_ball') {
    // GYRO STEEL BALL STAND: Replaces sword in hand with a high-res spinning Emerald-Gold Steel Ball!
    const spin = simTime * 18;
    const bx = attackPhase === 'active' ? 12 : attackPhase === 'windup' ? -9 : 7;
    const by = attackPhase === 'active' ? -15 : -14 + breath;
    sRect(ctx, bx - 6, by - 6, 12, 12, '#09060b');
    sRect(ctx, bx - 5.33, by - 5.33, 10.67, 10.67, '#064e3b');
    sRect(ctx, bx - 4.33, by - 4.33, 8.67, 8.67, '#16a34a');
    sRect(ctx, bx - 2.67, by - 2.67, 5.33, 5.33, '#4ade80');
    sRect(ctx, bx - 4, by - 0.67, 8, 1.33, '#fbbf24');
    sRect(ctx, bx - 0.67, by - 4, 1.33, 8, '#fde047');
    sRect(ctx, bx + Math.cos(spin) * 2.8 - 1, by + Math.sin(spin) * 2.8 - 1, 2.33, 2.33, '#ffffff');
  } else if (isSpinDashAttack) {
    // BURSTING SPINNING POKE DASH with swirling wind vortex ribbons & tornado cones!
    const spinOsc = Math.sin(simTime * 42);
    const windLen = Math.round(weapon.range * 1.85);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.2;
    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath();
      ctx.ellipse(12 + ring * 14, -14 + spinOsc * 2, 8 + ring * 3, 14 - ring * 2, simTime * 16 + ring, 0, Math.PI * 1.6);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(110, 231, 183, 0.35)';
    ctx.beginPath();
    ctx.moveTo(4, -24);
    ctx.lineTo(windLen + 10, -14);
    ctx.lineTo(4, -4);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.translate(8, -14);
    ctx.rotate(Math.PI / 2);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(wSprite, -drawW / 2, -drawH + 2, drawW, drawH);
    ctx.restore();
    sRect(ctx, 10, -14.5, windLen, 1.5, '#ffffff');
  } else if (attackPhase === 'active') {
    if (comboStep === 2) {
      const pokeLen = Math.round(weapon.range * 1.48);
      const yShift = comboSubStep === 0 ? -18 : -11;
      const yGhost = comboSubStep === 0 ? -11 : -18;
      ctx.fillStyle = weapon.accentColor;
      ctx.globalAlpha = 0.48;
      ctx.fillRect(6, yGhost, pokeLen - 6, 3);
      ctx.globalAlpha = 1;
      ctx.fillStyle = weapon.accentColor;
      ctx.fillRect(6, yShift - 2, pokeLen, vWid + 4);
      ctx.fillStyle = weapon.color;
      ctx.fillRect(8, yShift - 1, pokeLen - 2, vWid + 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, yShift, pokeLen - 4, 1.67);
      ctx.save();
      ctx.translate(12, yShift + 1);
      ctx.rotate(Math.PI / 2);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(wSprite, -drawW / 2, -drawH + 4, drawW, drawH);
      ctx.restore();
      ctx.strokeStyle = weapon.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(18, yShift + 1, 4, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (comboStep === 3) {
      const reach = weapon.range + 10;
      ctx.lineCap = 'round';
      if (comboSubStep === 0) {
        ctx.strokeStyle = weapon.accentColor;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(8, -14, reach * 0.72, -Math.PI * 0.65, Math.PI * 0.45);
        ctx.stroke();
        ctx.strokeStyle = weapon.color;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(8, -14, reach * 0.72, -Math.PI * 0.6, Math.PI * 0.4);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (comboSubStep === 1) {
        ctx.strokeStyle = weapon.accentColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-4, -22);
        ctx.quadraticCurveTo(reach * 0.55, -28, reach + 6, -13);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.quadraticCurveTo(reach * 0.55, -26, reach + 4, -13);
        ctx.stroke();
      } else {
        ctx.strokeStyle = weapon.accentColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(reach + 6, -24);
        ctx.quadraticCurveTo(reach * 0.45, -4, -6, -12);
        ctx.stroke();
        ctx.strokeStyle = weapon.color;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(reach + 4, -23);
        ctx.quadraticCurveTo(reach * 0.45, -6, -4, -13);
        ctx.stroke();
      }
    } else {
      const reach = weapon.range + 4;
      const startAng = comboSubStep === 0 ? -1.4 : comboSubStep === 1 ? -0.6 : 0.1;
      const endAng = startAng + 1.55;
      ctx.strokeStyle = weapon.accentColor;
      ctx.lineWidth = 7 + Math.min(3, vWid);
      ctx.beginPath();
      ctx.arc(6, -15, reach * 0.75, startAng, endAng);
      ctx.stroke();
      ctx.strokeStyle = weapon.color;
      ctx.lineWidth = 3.5 + Math.min(2, Math.floor(vWid / 2));
      ctx.beginPath();
      ctx.arc(6, -15, reach * 0.75, startAng + 0.12, endAng);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(6, -15, reach * 0.78, startAng + 0.2, endAng);
      ctx.stroke();
    }
  } else if (attackPhase === 'windup') {
    ctx.save();
    ctx.translate(-8, -11 + breath);
    ctx.rotate(-0.42);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(wSprite, -drawW / 2, -drawH + 4, drawW, drawH);
    ctx.restore();
  } else if (isAnimePose) {
    ctx.save();
    ctx.translate(6, -12 + breath);
    ctx.rotate(0.14);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(wSprite, -drawW / 2, -drawH + 4, drawW, drawH);
    ctx.restore();
    const sparkY = -25 + Math.round(((quirkCycle - 3.6) / 1.4) * 14);
    drawPixelSparkle(ctx, 6, sparkY, 2, '#fef08a');
  } else {
    // High-Res Baked Weapon Sprite resting proudly in Knight's hand
    ctx.save();
    ctx.translate(6, -11 + breath);
    ctx.rotate(0.22);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(wSprite, -drawW / 2, -drawH + 4, drawW, drawH);
    ctx.restore();

    if (weapon.specialEffect !== 'none' && Math.floor(idleTimer * 6) % 2 === 0) {
      const fxCol =
        weapon.specialEffect === 'burn'
          ? '#fb923c'
          : weapon.specialEffect === 'frost'
            ? '#7dd3fc'
            : weapon.specialEffect === 'lightning'
              ? '#fde047'
              : weapon.specialEffect === 'lifesteal'
                ? '#f43f5e'
                : weapon.specialEffect === 'venom'
                  ? '#bef264'
                  : weapon.specialEffect === 'holy_beam'
                    ? '#fef08a'
                    : weapon.accentColor;
      drawPixelSparkle(ctx, 7, -14 - Math.floor(vLen * 0.55) + breath, 2, fxCol);
    }
  }

  if (parryActive) {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(-10, -31, 20, 32);
  }

  ctx.restore();

  if (!isPeer && isAnimePose && Math.floor(idleTimer * 3) % 2 === 0) {
    drawPixelSparkle(ctx, sx + 14, sy - 6, 2, '#fde047');
  }

  if (isPeer && peerName) {
    if (labelCtx) {
      drawCrispOverlayLabel(labelCtx, sx + 8, sy - 11, peerName, {
        color: '#e0f2fe',
        bg: 'rgba(15, 23, 42, 0.88)',
        border: peerColor,
        fontSize: 18,
        padX: 8,
        padY: 3,
      });
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(peerName, sx + 8, sy - 7);
    }
  }
}

export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: EnemyState,
  camX: number,
  time: number,
  frozen: boolean,
  labelCtx?: CanvasRenderingContext2D | null,
) {
  const sx = Math.round(enemy.x - camX);
  const sy = Math.round(enemy.y);
  if (sx + enemy.w < -60 || sx > PIXEL_W + 60) return;

  const isBoss = Boolean(enemy.isDungeonBoss);
  const scaleFactor = enemy.sizeScale ?? (isBoss ? 1.4 : 1);
  const darkness = Math.max(0, Math.min(0.85, enemy.darkness ?? 0));

  // Ground contact shadow & Dungeon Boss pulsing halo
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.fillRect(sx + 2, sy + enemy.h - 2, Math.max(10, enemy.w - 4), 3);
  if (isBoss && enemy.state !== 'ko') {
    const auraR = 24 + Math.sin(time * 7) * 3;
    ctx.fillStyle = enemy.biome === 'volcano' ? 'rgba(239, 68, 68, 0.28)' : 'rgba(168, 85, 247, 0.28)';
    ctx.beginPath();
    ctx.arc(sx + enemy.w / 2, sy + enemy.h / 2, auraR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(sx + enemy.w / 2, sy + enemy.h);
  if (enemy.state === 'ko') {
    ctx.globalAlpha = Math.max(0, enemy.koTimer / 0.32);
    ctx.rotate(enemy.facing * 0.9);
  }
  ctx.scale(enemy.facing * scaleFactor, scaleFactor);

  const flash = enemy.hitFlash > 0;
  const windupPulse = enemy.state === 'windup' && Math.floor(time * 20) % 2 === 0;
  const idleBob = Math.round(Math.sin(time * 4 + enemy.patrolOriginX) * 1);
  const stride = Math.round(Math.sin(time * 9 + enemy.patrolOriginX) * (Math.abs(enemy.vx) > 8 ? 2 : 0));

  if (enemy.archetype === 'skeleton_guard') {
    const col = flash ? '#ffffff' : windupPulse ? '#fca5a5' : '#e2e8f0';
    const boneSh = flash ? '#ffffff' : '#94a3b8';
    const ink = '#09060b';
    sRect(ctx, -5.5, -28.5 + idleBob, 11, 10, ink);
    sRect(ctx, -6.5, -19.5 + idleBob, 13, 12, ink);
    sRect(ctx, -4.5, -29.5 + idleBob, 9, 3.5, '#475569');
    sRect(ctx, -3, -29 + idleBob, 6, 1.5, '#94a3b8');
    sRect(ctx, -6.5, -31.5 + idleBob, 2.5, 3.5, '#cbd5e1');
    sRect(ctx, 4, -31.5 + idleBob, 2.5, 3.5, '#cbd5e1');
    sRect(ctx, -4, -26 + idleBob, 8, 6, col);
    sRect(ctx, -3, -25.5 + idleBob, 5, 1.5, '#ffffff');
    sRect(ctx, 1, -24.2 + idleBob, 2.5, 2.2, '#ef4444'); // Glowing eye socket
    sRect(ctx, 1.5, -23.8 + idleBob, 1, 1, '#fef08a');
    sRect(ctx, 3, -22 + idleBob, 1.2, 1.2, ink); // Nasal cavity
    const jaw = Math.floor(time * 4 + enemy.patrolOriginX) % 4 === 0 ? 1 : 0;
    sRect(ctx, -3, -20 + idleBob + jaw, 6, 2, boneSh);
    sRect(ctx, -1, -20 + idleBob + jaw, 1, 2, ink);
    sRect(ctx, 1, -20 + idleBob + jaw, 1, 2, ink);
    // Ribcage slats + spine + tattered crimson cape
    sRect(ctx, -7.5, -19 + idleBob, 3.5, 12.5, '#7f1d1d');
    sRect(ctx, -6.5, -18 + idleBob, 1.5, 10, '#be123c');
    sRect(ctx, -4, -18 + idleBob, 8, 9, '#1e293b');
    sRect(ctx, -3, -17 + idleBob, 6, 2, col);
    sRect(ctx, -3, -14 + idleBob, 6, 2, col);
    sRect(ctx, -2, -11 + idleBob, 4, 2, boneSh);
    // Striding bone legs & sabatons
    sRect(ctx, -5.5 + stride, -8, 3.5, 8, ink);
    sRect(ctx, 1.5 - stride, -8, 3.5, 8, ink);
    sRect(ctx, -5 + stride, -8, 2.8, 7.5, boneSh);
    sRect(ctx, 2 - stride, -8, 2.8, 7.5, boneSh);
    sRect(ctx, -5 + stride, -3, 4.2, 3, '#334155');
    sRect(ctx, 2 - stride, -3, 4.2, 3, '#334155');
    // Kite Shield with cross emblem + Halberd/Spear
    sRect(ctx, 3.5, -20.5 + idleBob, 6, 12, ink);
    sRect(ctx, 4, -20 + idleBob, 5, 11, '#b45309');
    sRect(ctx, 5, -19 + idleBob, 3, 8, '#fbbf24');
    sRect(ctx, 6, -18 + idleBob, 1, 6, '#991b1b');
    sRect(ctx, 5, -9 + idleBob, 3, 3, '#92400e');
    if (enemy.state === 'windup' || enemy.state === 'attack') {
      sRect(ctx, 6, -16.5, 17.5, 3, ink);
      sRect(ctx, 6, -16, 17, 2, '#e2e8f0');
      sRect(ctx, 20, -19.5, 5, 8, ink);
      sRect(ctx, 20.5, -19, 4, 7, '#f87171');
    }
  } else if (enemy.archetype === 'shadow_bat') {
    const flap = Math.sin(time * 16) * 3;
    const col = flash ? '#ffffff' : windupPulse ? '#f87171' : '#7c3aed';
    sRect(ctx, -4.5, -11.5, 9, 9, '#09060b');
    sRect(ctx, -3.5, -10.5, 7, 7, col);
    sRect(ctx, -3, -14.5, 2.5, 4.5, '#a78bfa');
    sRect(ctx, 1, -14.5, 2.5, 4.5, '#a78bfa');
    sRect(ctx, -13, -13.5 + flap, 9, 3, '#09060b');
    sRect(ctx, -12, -13 + flap, 8, 2, '#a78bfa');
    sRect(ctx, -11, -11 + flap, 7, 3, '#4c1d95');
    sRect(ctx, -14, -9 + flap, 4, 3, '#2e1065');
    sRect(ctx, 4, -13.5 + flap, 9, 3, '#09060b');
    sRect(ctx, 4, -13 + flap, 8, 2, '#a78bfa');
    sRect(ctx, 4, -11 + flap, 7, 3, '#4c1d95');
    sRect(ctx, 10, -9 + flap, 4, 3, '#2e1065');
    sRect(ctx, 1, -8, 2.2, 2.2, '#fde047');
    sRect(ctx, 1.5, -7.6, 0.8, 0.8, '#ffffff');
    sRect(ctx, 0, -5, 1, 2, '#ffffff');
    sRect(ctx, 2, -5, 1, 2, '#ffffff');
  } else if (enemy.archetype === 'cultist_mage') {
    const col = flash ? '#ffffff' : windupPulse ? '#fde047' : '#881337';
    sRect(ctx, -8.5, -22 + idleBob, 17, 22.5, '#09060b');
    sRect(ctx, -7, -21 + idleBob, 14, 21, col);
    sRect(ctx, -4.5, -20 + idleBob, 4.5, 18, '#be123c');
    sRect(ctx, 0, -19 + idleBob, 2, 16, '#fbbf24');
    sRect(ctx, -6.5, -30.5 + idleBob, 13, 11, '#09060b');
    sRect(ctx, -6, -30 + idleBob, 12, 10, '#4c0519');
    sRect(ctx, -3, -34 + idleBob, 5, 5, '#4c0519');
    sRect(ctx, -2, -26 + idleBob, 6, 5, '#09060b');
    sRect(ctx, 1, -24 + idleBob, 2.2, 2.2, '#34d399');
    sRect(ctx, 1.5, -23.6 + idleBob, 0.8, 0.8, '#ffffff');
    sRect(ctx, 6.5, -26.5 + idleBob, 3, 27, '#09060b');
    sRect(ctx, 7, -26 + idleBob, 2, 26, '#d97706');
    sRect(ctx, 5.5, -31.5 + idleBob, 5, 6, '#09060b');
    sRect(ctx, 6, -31 + idleBob, 4, 5, enemy.state === 'windup' ? '#fef08a' : '#38bdf8');
    const orbX = Math.cos(time * 4) * 6;
    const orbY = Math.sin(time * 4) * 3 - 30 + idleBob;
    sRect(ctx, 7 + orbX, orbY, 2.2, 2.2, '#67e8f9');
  } else if (enemy.archetype === 'cursed_armor') {
    const armCol = flash ? '#ffffff' : windupPulse ? '#fde047' : '#64748b';
    const trimCol = flash ? '#ffffff' : '#f59e0b';
    sRect(ctx, -9.5, -31.5 + idleBob, 19, 26, '#09060b');
    sRect(ctx, -8, -22 + idleBob, 16, 14, armCol);
    sRect(ctx, -6, -21 + idleBob, 8, 9, '#94a3b8');
    sRect(ctx, -4, -20 + idleBob, 3, 3, '#cbd5e1');
    sRect(ctx, -3, -18 + idleBob, 4, 5, '#7e22ce');
    sRect(ctx, -11.5, -23.5 + idleBob, 6, 7, '#09060b');
    sRect(ctx, -11, -23 + idleBob, 5, 6, trimCol);
    sRect(ctx, 5.5, -23.5 + idleBob, 6, 7, '#09060b');
    sRect(ctx, 6, -23 + idleBob, 5, 6, trimCol);
    sRect(ctx, -6.5 + stride, -8, 6, 8, '#09060b');
    sRect(ctx, 1.5 - stride, -8, 6, 8, '#09060b');
    sRect(ctx, -6 + stride, -8, 5, 8, '#334155');
    sRect(ctx, 2 - stride, -8, 5, 8, '#475569');
    sRect(ctx, -6.5, -30.5 + idleBob, 13, 10, '#09060b');
    sRect(ctx, -6, -30 + idleBob, 12, 9, '#94a3b8');
    sRect(ctx, -8, -33 + idleBob, 2, 4, '#cbd5e1');
    sRect(ctx, 6, -33 + idleBob, 2, 4, '#cbd5e1');
    sRect(ctx, -2, -26 + idleBob, 7, 3, '#09060b');
    sRect(ctx, 1, -25 + idleBob, 3.2, 2, '#a855f7');
    sRect(ctx, 5.5, -21.5 + idleBob, 6, 15, '#09060b');
    sRect(ctx, 6, -21 + idleBob, 5, 14, '#1e293b');
    sRect(ctx, 7, -20 + idleBob, 3, 12, trimCol);
    if (enemy.state === 'windup' || enemy.state === 'attack') {
      sRect(ctx, 4.5, -28.5 + idleBob, 20, 5, '#09060b');
      sRect(ctx, 5, -28 + idleBob, 19, 4, '#e2e8f0');
      sRect(ctx, 8, -27 + idleBob, 14, 1.2, '#c084fc');
    } else {
      sRect(ctx, -10.5, -29.5 + idleBob, 4, 20, '#09060b');
      sRect(ctx, -10, -29 + idleBob, 3, 19, '#cbd5e1');
    }
  } else if (enemy.archetype === 'phantom_wisp') {
    const hover = Math.sin(time * 5 + enemy.patrolOriginX) * 3;
    const bodyCol = flash ? '#ffffff' : windupPulse ? '#fef08a' : '#38bdf8';
    const tailSway = Math.sin(time * 8 + enemy.patrolOriginX) * 2;
    sRect(ctx, -6.5, -22.5 + hover, 13, 15, '#09060b');
    sRect(ctx, -5, -21 + hover, 10, 12, bodyCol);
    sRect(ctx, -4 + tailSway, -9 + hover, 8, 5, '#0284c7');
    sRect(ctx, -2 + tailSway * 2, -4 + hover, 4, 4, '#bae6fd');
    sRect(ctx, -4.5, -27.5 + hover, 9, 8, '#09060b');
    sRect(ctx, -4, -27 + hover, 8, 7, '#f8fafc');
    sRect(ctx, -2, -25 + hover, 2, 2, '#09060b');
    sRect(ctx, 2, -25 + hover, 2, 2, '#09060b');
    sRect(ctx, 2, -25 + hover, 1, 1, '#fde047');
    sRect(ctx, -1, -32 + hover, 2, 5, '#f97316');
    sRect(ctx, -1, -34 + hover, 2, 3, '#fef08a');
  } else if (enemy.archetype === 'goblin_normal') {
    const skin = flash ? '#ffffff' : windupPulse ? '#fef08a' : '#65a30d';
    sRect(ctx, -5.5, -21.5 + idleBob, 11, 10, '#09060b');
    sRect(ctx, -4, -20 + idleBob, 8, 7, skin);
    sRect(ctx, -9, -18 + idleBob, 5, 3, '#84cc16');
    sRect(ctx, 4, -18 + idleBob, 5, 3, '#84cc16');
    sRect(ctx, 1, -17.5 + idleBob, 2.2, 2.2, '#ef4444');
    sRect(ctx, 1.8, -17 + idleBob, 0.8, 0.8, '#fde047');
    sRect(ctx, -5.5, -12.5 + idleBob, 11, 8, '#09060b');
    sRect(ctx, -5, -12 + idleBob, 10, 7, '#78350f');
    sRect(ctx, -4 + stride, -5, 3, 5, '#4d7c0f');
    sRect(ctx, 1 - stride, -5, 3, 5, '#4d7c0f');
    sRect(ctx, 3.5, -13.5 + idleBob, 9, 3, '#09060b');
    sRect(ctx, 4, -13 + idleBob, 8, 2, '#cbd5e1');
  } else if (enemy.archetype === 'hobgoblin') {
    const skin = flash ? '#ffffff' : windupPulse ? '#fb923c' : '#b45309';
    sRect(ctx, -8.5, -28.5 + idleBob, 17, 21, '#09060b');
    sRect(ctx, -7, -27 + idleBob, 14, 17, skin);
    sRect(ctx, -11, -24 + idleBob, 4, 4, '#d97706');
    sRect(ctx, 7, -24 + idleBob, 4, 4, '#d97706');
    sRect(ctx, 1, -24 + idleBob, 3, 2.2, '#fde047');
    sRect(ctx, 2, -21 + idleBob, 2, 2, '#ffffff');
    sRect(ctx, -7, -17 + idleBob, 14, 9, '#44403c');
    sRect(ctx, -5, -16 + idleBob, 10, 2, '#78716c');
    sRect(ctx, -6.5 + stride, -8, 6, 8, '#09060b');
    sRect(ctx, 1.5 - stride, -8, 6, 8, '#09060b');
    sRect(ctx, -6 + stride, -8, 5, 8, '#78350f');
    sRect(ctx, 2 - stride, -8, 5, 8, '#78350f');
    sRect(ctx, 5.5, -24.5 + idleBob, 6, 17, '#09060b');
    sRect(ctx, 6, -24 + idleBob, 5, 16, '#57534e');
    sRect(ctx, 5, -24 + idleBob, 7, 3, '#e2e8f0');
  } else if (enemy.archetype === 'bandit_fighter') {
    const coat = flash ? '#ffffff' : windupPulse ? '#fde047' : '#991b1b';
    sRect(ctx, -6.5, -26.5 + idleBob, 13, 20, '#09060b');
    sRect(ctx, -5, -25 + idleBob, 10, 7, '#e7b98f');
    sRect(ctx, -6, -26 + idleBob, 12, 3, '#dc2626');
    sRect(ctx, 1, -22 + idleBob, 3, 2, '#09060b');
    sRect(ctx, -5, -18 + idleBob, 10, 11, coat);
    sRect(ctx, -3, -17 + idleBob, 6, 2, '#fbbf24');
    sRect(ctx, -4 + stride, -7, 3, 7, '#1e293b');
    sRect(ctx, 2 - stride, -7, 3, 7, '#1e293b');
    sRect(ctx, 3.5, -18.5 + idleBob, 12, 4, '#09060b');
    sRect(ctx, 4, -18 + idleBob, 11, 3, '#e2e8f0');
  } else if (enemy.archetype === 'bandit_archer') {
    const cloak = flash ? '#ffffff' : windupPulse ? '#fde047' : '#14532d';
    sRect(ctx, -6.5, -26.5 + idleBob, 13, 20, '#09060b');
    sRect(ctx, -5, -26 + idleBob, 10, 8, cloak);
    sRect(ctx, 0, -23 + idleBob, 4, 4, '#e7b98f');
    sRect(ctx, 2, -22 + idleBob, 2, 1.2, '#09060b');
    sRect(ctx, -5, -18 + idleBob, 10, 11, '#3f6212');
    sRect(ctx, -4 + stride, -7, 3, 7, '#292524');
    sRect(ctx, 2 - stride, -7, 3, 7, '#292524');
    sRect(ctx, 5.5, -24.5 + idleBob, 3, 17, '#09060b');
    sRect(ctx, 6, -24 + idleBob, 2, 16, '#92400e');
    sRect(ctx, 5, -22 + idleBob, 1, 12, '#e2e8f0');
  } else if (enemy.archetype === 'bandit_assassin') {
    const cloak = flash ? '#ffffff' : windupPulse ? '#facc15' : '#18181b';
    sRect(ctx, -6.5, -25.5 + idleBob, 13, 19, '#09060b');
    sRect(ctx, -5, -25 + idleBob, 10, 8, cloak);
    sRect(ctx, -5, -21 + idleBob, 10, 3, '#be123c');
    sRect(ctx, 1, -23 + idleBob, 3, 2, '#facc15');
    sRect(ctx, -5, -17 + idleBob, 10, 10, '#27272a');
    sRect(ctx, -4 + stride, -7, 3, 7, '#09090b');
    sRect(ctx, 2 - stride, -7, 3, 7, '#09090b');
    sRect(ctx, 4.5, -16.5 + idleBob, 10, 3, '#09060b');
    sRect(ctx, 5, -16 + idleBob, 9, 2, '#a3e635');
    sRect(ctx, -11, -15 + idleBob, 7, 2, '#94a3b8');
  } else if (enemy.archetype === 'bandit_pyromancer') {
    const robe = flash ? '#ffffff' : windupPulse ? '#fef08a' : '#7f1d1d';
    sRect(ctx, -6.5, -27.5 + idleBob, 13, 21, '#09060b');
    sRect(ctx, -5, -27 + idleBob, 10, 8, '#991b1b');
    sRect(ctx, 0, -24 + idleBob, 4, 4, '#09060b');
    sRect(ctx, 2, -23 + idleBob, 2, 2, '#fb923c');
    sRect(ctx, -5, -19 + idleBob, 10, 12, robe);
    sRect(ctx, -5, -19 + idleBob, 2, 12, '#fbbf24');
    sRect(ctx, -4 + stride, -7, 3, 7, '#450a0a');
    sRect(ctx, 2 - stride, -7, 3, 7, '#450a0a');
    sRect(ctx, 6, -28 + idleBob, 2, 22, '#78350f');
    const fl = Math.sin(time * 16) * 2;
    sRect(ctx, 4, -33 + idleBob + fl, 6, 6, '#f97316');
    sRect(ctx, 5, -31 + idleBob + fl, 4, 4, '#fef08a');
  } else if (enemy.archetype === 'bandit_brute') {
    const armor = flash ? '#ffffff' : windupPulse ? '#f87171' : '#57534e';
    sRect(ctx, -11.5, -33.5 + idleBob, 23, 26, '#09060b');
    sRect(ctx, -10, -25 + idleBob, 20, 17, armor);
    sRect(ctx, -6, -33 + idleBob, 12, 8, '#44403c');
    sRect(ctx, -8, -35 + idleBob, 3, 4, '#cbd5e1');
    sRect(ctx, 5, -35 + idleBob, 3, 4, '#cbd5e1');
    sRect(ctx, -2, -29 + idleBob, 6, 2, '#ef4444');
    sRect(ctx, -9, -25 + idleBob, 6, 4, '#991b1b');
    sRect(ctx, 3, -25 + idleBob, 6, 4, '#991b1b');
    sRect(ctx, -8 + stride, -8, 6, 8, '#292524');
    sRect(ctx, 2 - stride, -8, 6, 8, '#292524');
    sRect(ctx, 6.5, -26.5 + idleBob, 9, 17, '#09060b');
    sRect(ctx, 7, -26 + idleBob, 8, 16, '#475569');
    sRect(ctx, 9, -24 + idleBob, 4, 12, '#cbd5e1');
    sRect(ctx, -12, -29 + idleBob, 3, 18, '#78350f');
    sRect(ctx, -16.5, -29.5 + idleBob, 7, 8, '#09060b');
    sRect(ctx, -16, -29 + idleBob, 6, 7, '#e2e8f0');
  } else if (enemy.archetype === 'demon_succubus') {
    const hover = Math.sin(time * 5 + enemy.patrolOriginX) * 3;
    const body = flash ? '#ffffff' : windupPulse ? '#f472b6' : '#be123c';
    const wing = Math.sin(time * 12) * 3;
    sRect(ctx, -13.5, -24.5 + hover + wing, 8, 11, '#09060b');
    sRect(ctx, -13, -24 + hover + wing, 7, 10, '#4c0519');
    sRect(ctx, 5.5, -24.5 + hover - wing, 8, 11, '#09060b');
    sRect(ctx, 6, -24 + hover - wing, 7, 10, '#4c0519');
    sRect(ctx, -4, -30 + hover, 2, 5, '#09060b');
    sRect(ctx, 2, -30 + hover, 2, 5, '#09060b');
    sRect(ctx, -5.5, -26.5 + hover, 11, 10, '#09060b');
    sRect(ctx, -5, -26 + hover, 10, 9, '#a855f7');
    sRect(ctx, -3, -24 + hover, 6, 6, '#f5d0fe');
    sRect(ctx, 1, -22 + hover, 2, 2, '#f43f5e');
    sRect(ctx, -4.5, -17.5 + hover, 9, 13, '#09060b');
    sRect(ctx, -4, -17 + hover, 8, 12, body);
    sRect(ctx, -3, -5 + hover, 2, 5, '#4c0519');
    sRect(ctx, 1, -5 + hover, 2, 5, '#4c0519');
    sRect(ctx, 6, -16 + hover, 4, 4, '#f43f5e');
    sRect(ctx, 7, -15 + hover, 2, 2, '#fbcfe8');
  } else if (enemy.archetype === 'demon_tank') {
    const armor = flash ? '#ffffff' : windupPulse ? '#ef4444' : '#312e81';
    sRect(ctx, -11.5, -34.5 + idleBob, 23, 27, '#09060b');
    sRect(ctx, -10, -26 + idleBob, 20, 18, armor);
    sRect(ctx, -6, -34 + idleBob, 12, 9, '#1e1b4b');
    sRect(ctx, -9, -39 + idleBob, 3, 7, '#cbd5e1');
    sRect(ctx, 6, -39 + idleBob, 3, 7, '#cbd5e1');
    sRect(ctx, -3, -30 + idleBob, 6, 3, '#ef4444');
    sRect(ctx, -3, -21 + idleBob, 6, 6, '#dc2626');
    sRect(ctx, -1, -19 + idleBob, 2, 2, '#fef08a');
    sRect(ctx, -8 + stride, -8, 6, 8, '#1e1b4b');
    sRect(ctx, 2 - stride, -8, 6, 8, '#1e1b4b');
    sRect(ctx, 6.5, -23.5 + idleBob, 8, 14, '#09060b');
    sRect(ctx, 7, -23 + idleBob, 7, 13, '#4c1d95');
  } else if (enemy.archetype === 'demon_lightning') {
    const body = flash ? '#ffffff' : windupPulse ? '#fef08a' : '#7e22ce';
    sRect(ctx, -6.5, -27.5 + idleBob, 13, 20, '#09060b');
    sRect(ctx, -5, -26 + idleBob, 10, 7, body);
    sRect(ctx, -7, -30 + idleBob, 3, 5, '#fde047');
    sRect(ctx, 4, -30 + idleBob, 3, 5, '#fde047');
    sRect(ctx, 0, -23 + idleBob, 4, 2, '#fef08a');
    sRect(ctx, -5, -19 + idleBob, 10, 12, '#4c1d95');
    sRect(ctx, -4 + stride, -7, 3, 7, '#1e1b4b');
    sRect(ctx, 1 - stride, -7, 3, 7, '#1e1b4b');
    const zap = Math.sin(time * 24) * 2;
    sRect(ctx, 5, -18 + idleBob + zap, 11, 2, '#fde047');
    sRect(ctx, 8, -16 + idleBob - zap, 7, 2, '#ffffff');
  } else {
    const col = flash ? '#ffffff' : windupPulse ? '#fb923c' : '#57534e';
    const wingLift = enemy.state === 'attack' || enemy.state === 'windup' ? -4 : 0;
    sRect(ctx, -9.5, -24.5 + idleBob, 19, 18, '#09060b');
    sRect(ctx, -8, -23 + idleBob, 16, 15, col);
    sRect(ctx, -5, -22 + idleBob, 10, 6, '#78716c');
    sRect(ctx, -1, -17 + idleBob, 3, 5, '#f97316');
    sRect(ctx, -0.5, -16 + idleBob, 1.5, 3, '#fef08a');
    sRect(ctx, -14.5, -31.5 + idleBob + wingLift, 8, 13, '#09060b');
    sRect(ctx, -14, -31 + idleBob + wingLift, 7, 12, '#44403c');
    sRect(ctx, -17, -33 + idleBob + wingLift, 4, 7, '#292524');
    sRect(ctx, -6, -30 + idleBob, 3, 7, '#a8a29e');
    sRect(ctx, 3, -30 + idleBob, 3, 7, '#a8a29e');
    sRect(ctx, 2, -21 + idleBob, 3, 2, '#ef4444');
    sRect(ctx, 3, -18 + idleBob, 1, 2, '#e2e8f0');
    sRect(ctx, -6, -7, 5, 7, '#292524');
    sRect(ctx, 2, -7, 5, 7, '#292524');
  }

  // Strong Dungeon Boss golden crown & horned war-crest
  if (isBoss) {
    sRect(ctx, -7.5, -36.5 + idleBob, 15, 5, '#09060b');
    sRect(ctx, -7, -36 + idleBob, 14, 4, '#fbbf24');
    sRect(ctx, -7, -40 + idleBob, 3, 4, '#fef08a');
    sRect(ctx, -2, -42 + idleBob, 4, 6, '#fbbf24');
    sRect(ctx, -1, -41 + idleBob, 2, 4, '#ffffff');
    sRect(ctx, 4, -40 + idleBob, 3, 4, '#fef08a');
  }

  // Weapon status visual indicators (Burn / Frost / Venom)
  if ((enemy.statusBurnTimer ?? 0) > 0) {
    const fl = Math.round(Math.sin(time * 22) * 2);
    pRect(ctx, -7, -14 + fl, 4, 5, '#f97316');
    pRect(ctx, 3, -18 - fl, 4, 5, '#fde047');
  }
  if ((enemy.statusFrostTimer ?? 0) > 0) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-11, -33, 22, 33);
    pRect(ctx, -9, -12, 3, 3, '#bae6fd');
    pRect(ctx, 6, -24, 3, 3, '#bae6fd');
  }
  if ((enemy.statusVenomTimer ?? 0) > 0) {
    const drip = Math.round((time * 18) % 6);
    pRect(ctx, -5, -20 + drip, 3, 3, '#84cc16');
    pRect(ctx, 4, -14 + ((drip + 3) % 6), 3, 3, '#a3e635');
  }

  // Endless Dungeon distance-darkening abyssal shroud & Demon King Stage bespoke variant aura!
  if (darkness > 0.08 && enemy.state !== 'ko') {
    ctx.fillStyle = `rgba(4, 2, 10, ${(darkness * 0.62).toFixed(2)})`;
    ctx.fillRect(-13, -38, 26, 38);
    if (darkness >= 0.35) {
      pRect(ctx, 1, -24 + idleBob, 2, 2, '#f43f5e');
    }
  }
  if (enemy.variantStyle && enemy.state !== 'ko') {
    const vCol =
      enemy.variantStyle === 'crimson_ash'
        ? '#f97316'
        : enemy.variantStyle === 'frost_seraph'
          ? '#38bdf8'
          : '#c084fc';
    ctx.strokeStyle = vCol;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-12, -34 + idleBob, 24, 34);
  }

  if (frozen) {
    ctx.strokeStyle = '#34d399';
    ctx.strokeRect(-10, -30, 20, 30);
  }
  ctx.restore();

  if (isBoss && enemy.state !== 'ko') {
    const barW = Math.max(46, enemy.w + 22);
    const bx = Math.round(sx + enemy.w / 2 - barW / 2);
    if (labelCtx) {
      drawCrispOverlayLabel(labelCtx, sx + enemy.w / 2, sy - 18, `★ ${enemy.name}`, {
        color: '#fde047',
        bg: 'rgba(15, 6, 12, 0.90)',
        border: '#f43f5e',
        fontSize: 19,
        padX: 10,
        padY: 4,
      });
    } else {
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(15, 6, 12, 0.85)';
      ctx.fillRect(bx - 6, sy - 20, barW + 12, 9);
      ctx.fillStyle = '#fde047';
      ctx.fillText(`★ ${enemy.name}`, sx + enemy.w / 2, sy - 13);
    }
    pRect(ctx, bx, sy - 9, barW, 4, '#09060b');
    pRect(ctx, bx + 1, sy - 8, Math.round(((barW - 2) * enemy.hp) / Math.max(1, enemy.maxHp)), 2, '#f43f5e');
  } else if (enemy.hp < enemy.maxHp && enemy.state !== 'ko') {
    pRect(ctx, sx, sy - 6, enemy.w, 3, '#0f172a');
    pRect(ctx, sx, sy - 6, (enemy.hp / enemy.maxHp) * enemy.w, 3, '#ef4444');
  }
}

export function drawJoJoBoss(
  ctx: CanvasRenderingContext2D,
  boss: ActiveBoss,
  camX: number,
  time: number,
  frozen: boolean,
  overrideScale?: number,
) {
  const sx = Math.round(boss.x - camX);
  const sy = Math.round(boss.y);
  if (sx < -140 || sx > PIXEL_W + 140) return;

  const def = boss.def;
  const poseKey: 'idle' | 'windup' | 'attack' | 'ko' =
    boss.state === 'attack'
      ? 'attack'
      : boss.state === 'windup'
        ? 'windup'
        : boss.state === 'ko'
          ? 'ko'
          : 'idle';
  const isBattle = Boolean(overrideScale && overrideScale > 1.7);
  const sprite = getBakedJoJoBossSprite(def, poseKey, isBattle);
  const floatBob = poseKey === 'ko' ? 0 : Math.round(Math.sin(time * 3.5 + boss.posePhase) * 2);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (boss.hitFlash > 0) {
    ctx.globalAlpha = 0.72;
  }

  // Colorful glowing prismatic flames erupting from behind the boss's back!
  if (poseKey !== 'ko') {
    const flameColors = [
      '#f43f5e',
      '#fb923c',
      '#fde047',
      '#34d399',
      '#38bdf8',
      '#a855f7',
      '#e879f9',
      def.auraColor,
    ];
    const backDir = isBattle ? 1 : boss.facing === 1 ? -1 : 1;
    const anchorX = isBattle ? sx + 32 : Math.round(sx + boss.w / 2 + backDir * (def.isGyroBoss ? 14 : 9));
    const anchorY = isBattle ? sy - 10 + floatBob : Math.round(sy + boss.h - 22 + floatBob);
    const scale = isBattle ? 1.65 : def.isGyroBoss ? 1.35 : 1;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // Soft prismatic radial aura behind the boss's back
    const aura = ctx.createRadialGradient(
      anchorX,
      anchorY - 6 * scale,
      2,
      anchorX,
      anchorY - 12 * scale,
      30 * scale,
    );
    aura.addColorStop(0, 'rgba(253, 224, 71, 0.42)');
    aura.addColorStop(0.42, 'rgba(232, 121, 249, 0.28)');
    aura.addColorStop(0.76, 'rgba(56, 189, 248, 0.16)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY - 10 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Animated billowing colorful flame tongues shooting out behind the back
    const count = isBattle ? 11 : 8;
    for (let f = 0; f < count; f++) {
      const col = flameColors[f % flameColors.length];
      const phase = time * (9 + (f % 3) * 2.2) + f * 1.15;
      const spread = (f - (count - 1) / 2) * 3.8 * scale;
      const height = (15 + Math.sin(phase) * 5 + (f % 3) * 4) * scale;
      const driftX = backDir * (5 + Math.cos(phase * 0.9) * 3.5) * scale + spread * 0.35;
      const fx = Math.round(anchorX + spread * 0.55 + Math.sin(phase * 0.7) * 2.2 * scale);
      const fy = Math.round(anchorY + Math.abs(spread) * 0.25);

      ctx.globalAlpha = boss.hitFlash > 0 ? 0.5 : 0.72;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(fx - 3.6 * scale, fy);
      ctx.quadraticCurveTo(
        fx + driftX * 0.45,
        fy - height * 0.62,
        fx + driftX,
        fy - height,
      );
      ctx.quadraticCurveTo(
        fx + driftX * 0.7 + 3.2 * scale,
        fy - height * 0.48,
        fx + 3.6 * scale,
        fy,
      );
      ctx.closePath();
      ctx.fill();

      // Hot luminous core inside each colorful back flame
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = f % 2 === 0 ? '#fef08a' : '#e0f2fe';
      ctx.fillRect(
        Math.round(fx + driftX * 0.32 - 1),
        Math.round(fy - height * 0.45),
        Math.max(2, Math.round(2 * scale)),
        Math.max(2, Math.round(3 * scale)),
      );
    }
    ctx.restore();
  }

  const skillPhase = boss.skillPhase ?? 'none';

  // Skill telegraph rings & charge halos behind boss
  if (poseKey !== 'ko' && skillPhase !== 'none') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (skillPhase === 'ram_windup' || skillPhase === 'ram_charge') {
      const rColor = skillPhase === 'ram_charge' ? 'rgba(249, 115, 22, 0.42)' : 'rgba(251, 191, 36, 0.35)';
      ctx.fillStyle = rColor;
      ctx.beginPath();
      ctx.ellipse(sx + boss.w / 2, sy + boss.h - 4, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      if (skillPhase === 'ram_charge') {
        for (let t = 1; t <= 4; t++) {
          ctx.fillStyle = `rgba(249, 115, 22, ${0.42 - t * 0.08})`;
          ctx.fillRect(Math.round(sx + boss.w / 2 - boss.facing * t * 11), Math.round(sy + 10), 10, boss.h - 14);
        }
      }
    } else if (skillPhase === 'barrage_charge') {
      const prog = Math.max(0.15, Math.min(1, boss.barrageChargeProgress ?? 0.5));
      const grad = ctx.createRadialGradient(sx + boss.w / 2, sy + boss.h - 14, 3, sx + boss.w / 2, sy + boss.h - 14, 26 + prog * 24);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
      grad.addColorStop(0.55, 'rgba(249, 115, 22, 0.34)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx + boss.w / 2, sy + boss.h - 14, 26 + prog * 24, 0, Math.PI * 2);
      ctx.fill();
    } else if (skillPhase === 'burst_grab' || skillPhase === 'burst_slam') {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx + boss.w / 2, sy + boss.h / 2, 26 + Math.sin(time * 24) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (isBattle) {
    // Native 116x116 1:1 CPS3 sprite (boots at y=110) aligned flush onto Pokemon Battle Dais
    ctx.drawImage(sprite, Math.round(sx - 34), Math.round(sy - 78 + floatBob));
    if (boss.hitFlash > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.45;
      ctx.drawImage(sprite, Math.round(sx - 34), Math.round(sy - 78 + floatBob));
    }
  } else {
    // Real-time Boss Sprite (supports Ramming Crouch, Stand Barrage Bend-Down, Giant Mega/Gyro scale)
    const corridorScale = def.isGyroBoss ? 1.45 : def.isMegaBoss ? 1.32 : 1;
    let poseSquashX = 1;
    let poseSquashY = 1;
    let poseOffsetY = 0;
    if (skillPhase === 'ram_windup') {
      poseSquashX = 1.16;
      poseSquashY = 0.78;
      poseOffsetY = 3;
    } else if (skillPhase === 'ram_charge') {
      poseSquashX = 1.24;
      poseSquashY = 0.86;
    } else if (skillPhase === 'barrage_charge') {
      poseSquashX = 1.12;
      poseSquashY = 0.72;
      poseOffsetY = 5;
    } else if (skillPhase === 'burst_slam') {
      poseSquashX = 1.18;
      poseSquashY = 0.85;
    }

    ctx.translate(Math.round(sx + boss.w / 2), Math.round(sy + boss.h + poseOffsetY));
    ctx.scale(-boss.facing * corridorScale * poseSquashX, corridorScale * poseSquashY);
    ctx.drawImage(sprite, -31, -61 + floatBob);
    if (boss.hitFlash > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.45;
      ctx.drawImage(sprite, -31, -61 + floatBob);
    }
  }
  ctx.restore();

  // Giant Flaming Stand Barrage Manifestation (Larger & fiercer than player's Ora Ora!)
  if (poseKey !== 'ko' && skillPhase === 'barrage_unleash') {
    const spFrame: 0 | 1 = Math.floor(time * 22) % 2 === 0 ? 0 : 1;
    const sp = getBakedStarPlatinumSprite(spFrame);
    const standScale = 1.55;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(sx + boss.w / 2 + boss.facing * 24), Math.round(sy - 16 + Math.sin(time * 20) * 3));
    ctx.scale(boss.facing * standScale, standScale);
    ctx.globalAlpha = 0.88;
    ctx.drawImage(sp, -14, -10, 64, 52);

    // Wide blazing multi-layered Stand fists & solar-crimson flames
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const t = (time * 11 + i * 0.19) % 1;
      const fx = Math.round(16 + t * 52);
      const fy = Math.round(-6 + ((i * 9) % 34));
      pRect(ctx, fx - 3, fy - 2, 16, 7, i % 2 === 0 ? '#f97316' : '#ef4444');
      pRect(ctx, fx + 2, fy - 1, 10, 5, '#fde047');
      pRect(ctx, fx + 7, fy, 5, 3, '#ffffff');
    }
    ctx.restore();
  }

  // Floating Anime Menacing Katakana SFX (ゴゴゴ / ドドド)
  ctx.save();
  ctx.fillStyle = def.auraColor;
  ctx.font = 'bold 9px monospace';
  const g1Y = sy - 38 + Math.sin(time * 5) * 3;
  const g2Y = sy - 20 + Math.cos(time * 4) * 3;
  const g3Y = sy - 54 + Math.sin(time * 3.5 + 1) * 2;
  ctx.fillText('ゴ', sx - 24, g1Y);
  ctx.fillText('ゴ', sx + 48, g2Y);
  ctx.fillText(poseKey === 'attack' || skillPhase !== 'none' ? 'ド' : 'ゴ', sx + 12, g3Y);

  if (frozen) {
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx - 18, sy - 42, 68, 82);
  }
  ctx.restore();
}

/**
 * Renders persistent shattered stone / glowing fissure ground-crack decals left behind by Burst Crush! slams.
 */
export function drawGroundCracks(
  ctx: CanvasRenderingContext2D,
  cracks: GroundCrackDecal[],
  camX: number,
  time: number,
) {
  for (const c of cracks) {
    const sx = Math.round(c.x - camX);
    if (sx + c.width < -20 || sx - c.width > PIXEL_W + 20) continue;
    const alpha = Math.max(0, Math.min(1, c.life / Math.min(1.6, c.maxLife)));
    const halfW = Math.round(c.width / 2);
    ctx.save();
    ctx.globalAlpha = alpha;
    // Crater shadow & broken stone lip
    pRect(ctx, sx - halfW, c.y - 2, c.width, 5, '#09060b');
    pRect(ctx, sx - halfW + 4, c.y - 4, 8, 3, '#57534e');
    pRect(ctx, sx + halfW - 12, c.y - 4, 8, 3, '#44403c');
    // Glowing crimson/amber fissure cracks branching downward into cobblestones
    const pulse = 0.65 + 0.35 * Math.sin(time * 6 + c.seed);
    ctx.fillStyle = `rgba(249, 115, 22, ${pulse.toFixed(2)})`;
    ctx.fillRect(sx - Math.round(halfW * 0.6), c.y, Math.round(c.width * 0.6), 2);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(sx - 6, c.y, 12, 1);
    for (let f = -2; f <= 2; f++) {
      const fx = sx + f * 10 + ((c.seed + f * 7) % 5);
      const len = 5 + Math.abs((c.seed + f * 3) % 7);
      pRect(ctx, fx, c.y + 1, 2, len, '#1c1917');
      pRect(ctx, fx, c.y + 1, 1, Math.max(2, len - 2), '#fb923c');
    }
    ctx.restore();
  }
}

export function drawProjectiles(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[],
  camX: number,
) {
  const nowSec = Date.now() * 0.006;
  for (const pr of projectiles) {
    const sx = Math.round(pr.x - camX);
    const sy = Math.round(pr.y);
    if (sx < -40 || sx > PIXEL_W + 40) continue;

    if (pr.kind === 'knife') {
      const dir = pr.vx >= 0 ? 1 : -1;
      sRect(ctx, sx - 6.5, sy - 2.5, 13, 5, '#09060b');
      sRect(ctx, sx - 6, sy - 1.5, 12, 3, '#e2e8f0');
      sRect(ctx, sx - 5, sy - 1, 8, 1, '#ffffff');
      sRect(ctx, sx - dir * 5.5, sy - 2, 3, 4, '#f59e0b');
    } else if (pr.kind === 'arrow') {
      const dir = pr.vx >= 0 ? 1 : -1;
      sRect(ctx, sx - 7.5, sy - 2.5, 15, 5, '#09060b');
      sRect(ctx, sx - 7, sy - 1, 14, 2, '#92400e');
      sRect(ctx, sx + dir * 5, sy - 2, 3.5, 4, '#e2e8f0');
      sRect(ctx, sx + dir * 6, sy - 1, 2, 2, '#ffffff');
      sRect(ctx, sx - dir * 7, sy - 2, 3, 4, '#ef4444');
    } else if (pr.kind === 'gyro_ball') {
      const spin = (Date.now() * 0.032) % (Math.PI * 2);
      const r = Math.max(8, pr.radius);
      const isLarge = r >= 12;
      ctx.save();
      ctx.fillStyle = isLarge ? 'rgba(74, 222, 128, 0.36)' : 'rgba(34, 197, 94, 0.35)';
      ctx.beginPath();
      ctx.arc(sx, sy, r + (isLarge ? 7 : 5), 0, Math.PI * 2);
      ctx.fill();
      if (isLarge) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, r + 2, spin, spin + Math.PI * 1.45);
        ctx.stroke();
        ctx.fillStyle = '#09060b';
        ctx.beginPath();
        ctx.arc(sx, sy, r - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.arc(sx, sy, r - 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(sx, sy, r - 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(sx - 2, sy - 2, Math.max(2, r - 6), 0, Math.PI * 2);
        ctx.fill();
        sRect(ctx, sx + Math.cos(spin) * (r * 0.45) - 2, sy + Math.sin(spin) * (r * 0.45) - 2, 4, 4, '#fef08a');
        sRect(ctx, sx + Math.cos(spin + Math.PI) * (r * 0.45) - 1.5, sy + Math.sin(spin + Math.PI) * (r * 0.45) - 1.5, 3, 3, '#a855f7');
      } else {
        sRect(ctx, sx - 6.5, sy - 6.5, 13, 13, '#09060b');
        sRect(ctx, sx - 5.5, sy - 5.5, 11, 11, '#15803d');
        sRect(ctx, sx - 4, sy - 4, 8, 8, '#22c55e');
        sRect(ctx, sx + Math.cos(spin) * 3 - 1.5, sy + Math.sin(spin) * 3 - 1.5, 3, 3, '#fef08a');
      }
      ctx.restore();
    } else if (pr.kind === 'succubus_orb') {
      sRect(ctx, sx - 4.5, sy - 4.5, 9, 9, '#09060b');
      sRect(ctx, sx - 4, sy - 4, 8, 8, '#f43f5e');
      sRect(ctx, sx - 2, sy - 2, 4, 4, '#fbcfe8');
    } else if (pr.kind === 'purple_flame' || pr.kind === 'purple_meteor') {
      const r = pr.kind === 'purple_meteor' ? 12 : Math.max(9, pr.radius);
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, r + 9);
      grad.addColorStop(0, '#fdf4ff');
      grad.addColorStop(0.35, pr.color || '#c084fc');
      grad.addColorStop(0.75, 'rgba(126, 34, 206, 0.55)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f0abfc';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 2, nowSec, nowSec + Math.PI * 1.3);
      ctx.stroke();
      ctx.restore();
    } else if (pr.kind === 'slash_wave' || pr.kind === 'jjk_split_slash') {
      const dir = pr.vx >= 0 ? 1 : -1;
      ctx.save();
      const g = ctx.createLinearGradient(sx - dir * 16, sy - 16, sx + dir * 12, sy + 16);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.55, pr.color);
      g.addColorStop(1, '#ffffff');
      ctx.strokeStyle = g;
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(sx - dir * 6, sy, Math.max(12, pr.radius + 4), dir === 1 ? -1.1 : Math.PI - 1.1, dir === 1 ? 1.1 : Math.PI + 1.1);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(sx - dir * 5, sy, Math.max(11, pr.radius + 3), dir === 1 ? -0.9 : Math.PI - 0.9, dir === 1 ? 0.9 : Math.PI + 0.9);
      ctx.stroke();
      ctx.restore();
    } else if (pr.kind === 'jjk_black_flash_orb') {
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, pr.radius + 8);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.42, '#ef4444');
      grad.addColorStop(0.75, 'rgba(244, 63, 94, 0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const a = nowSec * 1.4 + i * (Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(sx + Math.cos(a) * 5, sy + Math.sin(a) * 5);
        ctx.lineTo(sx + Math.cos(a + 0.35) * (pr.radius + 7), sy + Math.sin(a + 0.35) * (pr.radius + 7));
        ctx.stroke();
      }
      ctx.restore();
    } else if (pr.kind === 'jjk_uzumaki') {
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, pr.radius + 10);
      grad.addColorStop(0, '#09020f');
      grad.addColorStop(0.45, '#7e22ce');
      grad.addColorStop(0.78, '#e879f9');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f5d0fe';
      ctx.lineWidth = 1.6;
      for (let r = 5; r <= pr.radius + 4; r += 4) {
        ctx.beginPath();
        ctx.arc(sx, sy, r, nowSec + r, nowSec + r + Math.PI * 1.3);
        ctx.stroke();
      }
      ctx.restore();
    } else if (pr.kind === 'jjk_pachinko_ball') {
      ctx.save();
      const rainbow = ['#22c55e', '#fde047', '#ec4899', '#38bdf8'][Math.floor(nowSec * 3) % 4];
      const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, pr.radius + 6);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.45, rainbow);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (pr.kind === 'jjk_lightning_bolt') {
      ctx.save();
      const dir = pr.vx >= 0 ? 1 : -1;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sx - dir * 16, sy - 4);
      ctx.lineTo(sx - dir * 5, sy + 5);
      ctx.lineTo(sx + dir * 4, sy - 5);
      ctx.lineTo(sx + dir * 16, sy + 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    } else if (pr.kind === 'jjk_transfig_orb') {
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, pr.radius + 7);
      grad.addColorStop(0, '#f0fdfa');
      grad.addColorStop(0.45, '#2dd4bf');
      grad.addColorStop(0.8, '#a855f7');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sx - 6, sy - 3);
      ctx.lineTo(sx + 6, sy + 3);
      ctx.stroke();
      ctx.restore();
    } else if (pr.kind === 'jjk_magma_meteor') {
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, pr.radius + 8);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.45, '#f97316');
      grad.addColorStop(0.82, '#dc2626');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (pr.kind === 'jjk_piercing_blood') {
      const dir = pr.vx >= 0 ? 1 : -1;
      ctx.save();
      const g = ctx.createLinearGradient(sx - dir * 24, sy, sx + dir * 24, sy);
      g.addColorStop(0, 'rgba(190, 18, 60, 0)');
      g.addColorStop(0.4, '#e11d48');
      g.addColorStop(0.85, '#fb7185');
      g.addColorStop(1, '#ffffff');
      ctx.fillStyle = g;
      ctx.fillRect(sx - 24, sy - 4, 48, 8);
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(sx - 18, sy - 1.5, 36, 3);
      ctx.restore();
    } else if (pr.kind === 'jjk_exec_blade') {
      const dir = pr.vx >= 0 ? 1 : -1;
      ctx.save();
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(sx - dir * 16, sy - 4);
      ctx.lineTo(sx + dir * 18, sy);
      ctx.lineTo(sx - dir * 16, sy + 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - 8, sy - 1, 16, 2);
      ctx.restore();
    } else if (pr.kind === 'jjk_cursed_nail') {
      const dir = pr.vx >= 0 ? 1 : -1;
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, pr.radius + 6);
      grad.addColorStop(0, '#fbcfe8');
      grad.addColorStop(0.5, '#f43f5e');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(sx - 10, sy - 1.5, 20, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx + dir * 7, sy - 1, 4, 2);
      ctx.restore();
    } else if (pr.kind === 'jjk_blue_pull' || pr.kind === 'jjk_red_repulse' || pr.kind === 'jjk_hollow_sphere') {
      const isBlue = pr.kind === 'jjk_blue_pull';
      const isPurple = pr.kind === 'jjk_hollow_sphere';
      const cMain = isBlue ? '#38bdf8' : isPurple ? '#a855f7' : '#ef4444';
      const cAccent = isBlue ? '#0284c7' : isPurple ? '#e879f9' : '#fbbf24';
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, pr.radius + 10);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, cMain);
      grad.addColorStop(0.75, cAccent);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 4, nowSec * 1.4, nowSec * 1.4 + Math.PI * 1.35);
      ctx.stroke();
      ctx.restore();
    } else if (pr.kind === 'jjk_chain_spear') {
      const dir = pr.vx >= 0 ? 1 : -1;
      ctx.save();
      // Trailing chain links
      for (let c = 1; c <= 4; c++) {
        pRect(ctx, sx - dir * c * 7 - 2, sy - 2, 4, 4, c % 2 === 0 ? '#64748b' : '#cbd5e1');
      }
      // Inverted Spear blade
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(sx + dir * 16, sy);
      ctx.lineTo(sx - dir * 4, sy - 5);
      ctx.lineTo(sx - dir * 4, sy + 5);
      ctx.closePath();
      ctx.fill();
      pRect(ctx, sx - dir * 6, sy - 2, 5, 4, '#a855f7');
      ctx.restore();
    } else if (pr.kind === 'jjk_rika_beam_orb') {
      const dir = pr.vx >= 0 ? 1 : -1;
      const tailLen = Math.min(220, (pr.beamLength ?? 220) * 0.55);
      ctx.save();
      const grad = ctx.createLinearGradient(sx - dir * tailLen, sy, sx + dir * 18, sy);
      grad.addColorStop(0, 'rgba(192, 132, 252, 0)');
      grad.addColorStop(0.45, '#c084fc');
      grad.addColorStop(0.85, '#f0abfc');
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      const startX = dir === 1 ? sx - tailLen : sx;
      ctx.fillRect(startX, sy - 10, tailLen, 20);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (pr.kind === 'jjk_nue_bolt') {
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(sx - 12, sy - 8);
      ctx.lineTo(sx, sy + 2);
      ctx.lineTo(sx + 12, sy - 8);
      ctx.stroke();
      pRect(ctx, sx - 5, sy - 5, 10, 10, '#38bdf8');
      pRect(ctx, sx - 2, sy - 2, 4, 4, '#ffffff');
      ctx.restore();
    } else if (pr.kind === 'jjk_collapse_boulder') {
      ctx.save();
      const r = pr.radius;
      pRect(ctx, sx - r, sy - r, r * 2, r * 2, '#57534e');
      pRect(ctx, sx - r + 2, sy - r + 2, r * 2 - 4, r * 2 - 4, '#78716c');
      pRect(ctx, sx - r, sy - 2, r * 2, 3, pr.color || '#fb923c');
      ctx.restore();
    } else {
      ctx.save();
      const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, pr.radius + 5);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, pr.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, pr.radius + 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (pr.beamLength && pr.kind === 'jjk_piercing_blood') {
      const dir = pr.vx >= 0 ? 1 : -1;
      const tailLen = Math.min(240, pr.beamLength * 0.55);
      ctx.save();
      ctx.fillStyle = 'rgba(225, 29, 72, 0.55)';
      ctx.fillRect(dir === 1 ? sx - tailLen : sx, sy - 3, tailLen, 6);
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(dir === 1 ? sx - tailLen * 0.8 : sx, sy - 1, tailLen * 0.8, 2);
      ctx.restore();
    }
  }
}

export function drawPeer(
  ctx: CanvasRenderingContext2D,
  peer: MultiplayerPeer,
  camX: number,
  time: number,
  labelCtx?: CanvasRenderingContext2D | null,
) {
  drawWarrior(
    ctx,
    peer.x,
    peer.y,
    peer.facing,
    1,
    1,
    peer.anim === 'run' ? time * 12 : 0,
    time,
    peer.anim === 'attack' ? 'active' : 'none',
    (peer.weaponId as WeaponId) in WEAPONS ? (peer.weaponId as WeaponId) : 'claymore',
    1,
    false,
    0,
    camX,
    true,
    peer.color,
    peer.name,
    peer.customization,
    0,
    false,
    time,
    labelCtx,
  );
}

function drawBattleSlashFx(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fx: BossBattleSlashFx,
) {
  const p = Math.max(0, Math.min(1, fx.progress));
  const alpha = p < 0.7 ? 1 : Math.max(0, (1 - p) / 0.3);
  ctx.save();
  ctx.globalAlpha = alpha;

  const drawDiagSlash = (ox: number, oy: number, dir: 1 | -1, sweepProg: number, len = 54) => {
    const t = Math.max(0, Math.min(1, sweepProg));
    const x1 = cx + ox - dir * (len * 0.5);
    const y1 = cy + oy - len * 0.45;
    const x2 = x1 + dir * len * t;
    const y2 = y1 + len * 0.9 * t;

    ctx.strokeStyle = fx.color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();

    if (t > 0.1 && t < 0.95) {
      drawPixelSparkle(ctx, Math.round(x2), Math.round(y2), 4, fx.accentColor);
    }
  };

  const [pal0, pal1, pal2] = fx.palette ?? [fx.color, fx.accentColor, '#fde047'];

  const drawColoredSword = (sx: number, sy: number, angle: number, length: number, bladeColor: string, edgeColor: string) => {
    ctx.save();
    ctx.translate(Math.round(sx), Math.round(sy));
    ctx.rotate(angle);
    pRect(ctx, -3, -Math.round(length * 0.5), 6, length, bladeColor);
    pRect(ctx, -1, -Math.round(length * 0.48), 2, length - 2, '#ffffff');
    pRect(ctx, -7, Math.round(length * 0.25), 14, 3, edgeColor);
    pRect(ctx, -2, Math.round(length * 0.28), 4, 8, '#fbbf24');
    ctx.restore();
  };

  if (fx.style === 'mega_cross_swords') {
    const s = Math.min(1, p * 1.45);
    drawColoredSword(cx - 28 + s * 28, cy - 26 + s * 26, Math.PI * 0.25, 58, pal0, pal2);
    drawColoredSword(cx + 28 - s * 28, cy - 26 + s * 26, -Math.PI * 0.25, 58, pal1, pal2);
    drawDiagSlash(-6, 0, 1, Math.min(1, p * 1.8), 68);
    if (p > 0.2) drawDiagSlash(6, 0, -1, Math.min(1, (p - 0.2) * 1.8), 68);
  } else if (fx.style === 'mega_prism_knives') {
    const cols = [pal0, pal1, pal2, '#34d399', '#f472b6'];
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2 + p * 2.5;
      const dist = (1 - Math.min(1, p * 1.35)) * 46;
      drawColoredSword(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, ang + Math.PI / 2, 22, cols[i % cols.length], '#ffffff');
    }
    if (p > 0.45) drawPixelSparkle(ctx, cx, cy, Math.round((p - 0.45) * 32), pal1);
  } else if (fx.style === 'mega_clock_shatter') {
    const rad = 16 + Math.round(p * 32);
    ctx.strokeStyle = pal1;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = pal2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(p * 10) * rad, cy + Math.sin(p * 10) * rad);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + p * 1.5;
      pRect(ctx, cx + Math.cos(a) * rad * 0.8 - 2, cy + Math.sin(a) * rad * 0.8 - 2, 5, 5, pal0);
    }
  } else if (fx.style === 'mega_rainbow_barrage') {
    const cols = ['#f43f5e', '#fb923c', '#fde047', '#34d399', '#38bdf8', '#a855f7'];
    cols.forEach((c, idx) => {
      const start = idx * 0.09;
      if (p > start) {
        const t = Math.min(1, (p - start) * 2.3);
        const dir: 1 | -1 = idx % 2 === 0 ? 1 : -1;
        const ox = (idx - 2.5) * 9;
        const oy = ((idx % 3) - 1) * 10;
        ctx.strokeStyle = c;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx + ox - dir * 24, cy + oy - 22);
        ctx.lineTo(cx + ox - dir * 24 + dir * 48 * t, cy + oy - 22 + 44 * t);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  } else if (fx.style === 'mega_guillotine') {
    const drop = Math.min(1, p * 1.65);
    const bladeY = cy - 64 + drop * 68;
    drawColoredSword(cx, bladeY, 0, 74, pal0, pal1);
    if (drop >= 0.85) {
      const shock = Math.round((p - 0.5) * 110);
      pRect(ctx, cx - shock / 2, cy + 14, shock, 6, pal1);
      pRect(ctx, cx - shock / 3, cy + 12, (shock * 2) / 3, 3, pal2);
    }
  } else if (fx.style === 'mega_sword_vortex') {
    const ring = [pal0, pal1, pal2, '#f43f5e'];
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + p * 8;
      const rx = 24 + Math.sin(p * Math.PI) * 14;
      drawColoredSword(cx + Math.cos(ang) * rx, cy + Math.sin(ang) * rx * 0.65, ang, 24, ring[i % ring.length], '#ffffff');
    }
  } else if (fx.style === 'mega_soulfire_pillars') {
    [-26, 0, 26].forEach((ox, idx) => {
      const h = Math.round(Math.sin(Math.min(1, p * 1.35) * Math.PI) * 76);
      pRect(ctx, cx + ox - 8, cy + 28 - h, 16, h, idx % 2 === 0 ? pal0 : pal1);
      pRect(ctx, cx + ox - 4, cy + 28 - h, 8, h, pal2);
      pRect(ctx, cx + ox - 2, cy + 28 - Math.round(h * 0.8), 4, Math.round(h * 0.8), '#ffffff');
    });
  } else if (fx.style === 'mega_cross_execution') {
    const cList = [pal0, pal1, pal2];
    [-16, 0, 16].forEach((ox, idx) => {
      const t = Math.min(1, Math.max(0, (p - idx * 0.12) * 1.8));
      if (t > 0) {
        drawColoredSword(cx + ox, cy - 30 + t * 34, (idx - 1) * 0.55, 54, cList[idx], '#ffffff');
      }
    });
  } else if (fx.style === 'sword') {
    drawDiagSlash(0, 0, 1, Math.min(1, p * 1.6), 62);
  } else if (fx.style === 'cross') {
    drawDiagSlash(-4, -2, 1, Math.min(1, p * 1.9), 58);
    if (p > 0.22) {
      drawDiagSlash(4, 2, -1, Math.min(1, (p - 0.22) * 1.9), 58);
    }
  } else if (fx.style === 'barrage') {
    const offsets: [number, number, 1 | -1][] = [
      [-16, -14, 1],
      [12, -10, -1],
      [-8, 6, 1],
      [16, 12, -1],
      [0, -2, 1],
    ];
    offsets.forEach(([ox, oy, dir], i) => {
      const start = i * 0.12;
      if (p > start) {
        drawDiagSlash(ox, oy, dir, Math.min(1, (p - start) * 2.4), 42);
      }
    });
  } else if (fx.style === 'knife_volley') {
    [-16, -6, 4, 14].forEach((oy, idx) => {
      const start = idx * 0.1;
      if (p > start) {
        const t = Math.min(1, (p - start) * 2.2);
        const kx = cx + 38 - t * 68;
        pRect(ctx, kx, cy + oy, 14, 2, '#e2e8f0');
        pRect(ctx, kx + 10, cy + oy - 1, 4, 4, fx.color);
      }
    });
  } else if (fx.style === 'lightning') {
    drawDiagSlash(-6, -4, -1, Math.min(1, p * 2.2), 62);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 42);
    ctx.lineTo(cx + 8, cy - 12);
    ctx.lineTo(cx - 10, cy + 4);
    ctx.lineTo(cx + 12, cy + 28);
    ctx.stroke();
  } else if (fx.style === 'seismic') {
    const shockW = Math.round(p * 74);
    pRect(ctx, cx - shockW / 2, cy + 16, shockW, 6, fx.color);
    pRect(ctx, cx - shockW / 3, cy + 12, (shockW * 2) / 3, 4, '#ffffff');
    drawDiagSlash(0, 0, -1, Math.min(1, p * 1.8), 54);
  } else if (fx.style === 'void_crush') {
    const r = Math.max(4, Math.round((1 - p) * 32));
    ctx.strokeStyle = fx.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - r, cy - r, r * 2, r * 2);
    drawDiagSlash(0, 0, -1, Math.min(1, p * 1.7), 52);
  } else if (fx.style === 'fire' || fx.style === 'solar') {
    drawDiagSlash(0, 0, 1, Math.min(1, p * 1.7), 64);
    drawDiagSlash(0, -4, -1, Math.min(1, p * 1.5), 48);
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + p * 3;
      const r = 10 + p * 34;
      pRect(
        ctx,
        cx + Math.cos(ang) * r,
        cy + Math.sin(ang) * r,
        3,
        3,
        i % 2 === 0 ? fx.color : '#fef08a',
      );
    }
  } else if (fx.style === 'ora_barrage') {
    const frame: 0 | 1 = Math.floor(p * 26) % 2 === 0 ? 0 : 1;
    const sp = getBakedStarPlatinumSprite(frame);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sp, Math.round(cx - 56), Math.round(cy - 26 + Math.sin(p * 30) * 3), 64, 52);
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + p * 14;
      const rx = cx + Math.cos(ang) * 14;
      const ry = cy + Math.sin(ang) * 16;
      pRect(ctx, rx - 4, ry - 2, 9, 4, i % 2 === 0 ? '#a78bfa' : '#fbbf24');
      pRect(ctx, rx + 2, ry - 1, 3, 2, '#ffffff');
    }
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ORA ORA!', cx, cy - 26);
  } else if (fx.style === 'gyro_green_ball') {
    // Gyro Zeppeli throws a spinning green Steel Ball wreathed in blazing emerald flames!
    const t = Math.min(1, p * 1.25);
    const bx = Math.round(cx + 80 - t * 88);
    const by = Math.round(cy - 16 + Math.sin(p * Math.PI) * -12);
    const spin = p * 22;
    // Green flame trail
    for (let f = 0; f < 6; f++) {
      const fxPos = bx + 6 + f * 9;
      const fyPos = by + Math.round(Math.sin(p * 30 + f) * 5);
      pRect(ctx, fxPos, fyPos - 5, 8, 10, f % 2 === 0 ? '#15803d' : '#22c55e');
      pRect(ctx, fxPos + 2, fyPos - 2, 4, 4, '#86efac');
    }
    // Blazing green flame aura & spinning Steel Ball core
    ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(bx, by, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(bx, by, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(bx, by, 9, 0, Math.PI * 2);
    ctx.fill();
    // Golden Spin crosshair spheres on ball
    pRect(ctx, bx + Math.cos(spin) * 5 - 2, by + Math.sin(spin) * 5 - 2, 4, 4, '#fef08a');
    pRect(ctx, bx - Math.cos(spin) * 5 - 2, by - Math.sin(spin) * 5 - 2, 4, 4, '#bbf7d0');
    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NYO HO!!', bx, by - 22);
  } else if (fx.style === 'orb_flame') {
    const r = 10 + Math.round(p * 34);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + p * 5;
      const fxPos = cx + Math.cos(ang) * r * 0.72;
      const fyPos = cy + Math.sin(ang) * r * 0.72;
      pRect(ctx, fxPos - 4, fyPos - 4, 8, 8, i % 2 === 0 ? '#f97316' : '#fde047');
    }
    pRect(ctx, cx - 7, cy - 7, 14, 14, '#fef08a');
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('-25% MAX HP!', cx, cy - 28);
  } else if (fx.style === 'orb_wind') {
    for (let ring = 0; ring < 3; ring++) {
      const rx = 18 + ring * 10 + Math.round(Math.sin(p * Math.PI) * 12);
      ctx.strokeStyle = ring % 2 === 0 ? '#2dd4bf' : '#ccfbf1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + (ring - 1) * 10, rx, Math.round(rx * 0.35), p * 4 + ring, 0, Math.PI * 1.65);
      ctx.stroke();
    }
    ctx.fillStyle = '#5eead4';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('+30% DMG VULN!', cx, cy - 28);
  } else if (fx.style === 'orb_electric') {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    for (let b = -1; b <= 1; b++) {
      ctx.beginPath();
      ctx.moveTo(cx + b * 14, cy - 48);
      ctx.lineTo(cx + b * 8 - 8, cy - 16);
      ctx.lineTo(cx + b * 10 + 9, cy + 4);
      ctx.lineTo(cx + b * 6, cy + 28);
      ctx.stroke();
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 24, cy - 28, 48, 56);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('STUNNED 1T!', cx, cy - 32);
  } else {
    [-12, 0, 12].forEach((offset, idx) => {
      const start = idx * 0.1;
      if (p > start) {
        drawDiagSlash(offset, offset * 0.35, -1, Math.min(1, (p - start) * 2.0), 54);
      }
    });
  }

  ctx.restore();
}

export function drawPokemonBossStage(
  ctx: CanvasRenderingContext2D,
  biome: BiomeId,
  boss: ActiveBoss,
  player: PlayerState,
  phase: BossBattlePhase,
  phaseProgress: number,
  slashFx: BossBattleSlashFx | null,
  guardActive: boolean,
  frozenTurns: number,
  time: number,
  windVulnerable = false,
) {
  const def = boss.def;
  // 1. Unique Per-Boss Climate Sky (cached offscreen per boss index)
  const battleSky = getSkyBackdrop(`battle_boss_${def.index}`, [
    [0, def.climateSkyTop],
    [0.6, def.climateSkyBottom],
    [1, '#090609'],
  ]);
  ctx.drawImage(battleSky, 0, 0, PIXEL_W, PIXEL_H);

  // Layer baked Castlevania / Ruin / Volcano architecture subtly tinted into the climate sky
  ctx.save();
  ctx.globalAlpha = 0.42;
  const wallStrip = getBakedBiomeWall(biome);
  ctx.drawImage(wallStrip, 112, 0);
  ctx.drawImage(wallStrip, -144, 0);
  ctx.drawImage(wallStrip, 368, 0);
  ctx.restore();

  // Climate-specific celestial & atmospheric effects (cached offscreen circular pixel Blood Moon / Eclipse!)
  if (def.climate === 'blood_moon_ash' || def.climate === 'arcane_eclipse') {
    const stampKey = def.climate === 'blood_moon_ash' ? 'blood_moon_stamp' : 'eclipse_moon_stamp';
    if (!skyBackdropCache[stampKey]) {
      const mc = document.createElement('canvas');
      mc.width = 60;
      mc.height = 60;
      const mctx = mc.getContext('2d');
      if (mctx) {
        const isBlood = def.climate === 'blood_moon_ash';
        mctx.fillStyle = isBlood ? 'rgba(225, 29, 72, 0.22)' : 'rgba(139, 92, 246, 0.26)';
        mctx.beginPath();
        mctx.arc(30, 30, 29, 0, Math.PI * 2);
        mctx.fill();
        for (let my = -22; my <= 22; my++) {
          for (let mx = -22; mx <= 22; mx++) {
            const d2 = mx * mx + my * my;
            if (d2 <= 484) {
              if (isBlood) {
                const crater =
                  (mx + 6) * (mx + 6) + (my + 4) * (my + 4) < 36 ||
                  (mx - 8) * (mx - 8) + (my - 7) * (my - 7) < 25;
                mctx.fillStyle =
                  d2 > 400 ? '#881337' : crater ? '#be123c' : mx < -6 ? '#fb7185' : '#e11d48';
              } else {
                mctx.fillStyle = d2 > 360 ? '#a78bfa' : '#09060b';
              }
              mctx.fillRect(30 + mx, 30 + my, 1, 1);
            }
          }
        }
      }
      skyBackdropCache[stampKey] = mc;
    }
    ctx.drawImage(skyBackdropCache[stampKey], 191, 8);
  } else if (def.climate === 'starlight_aurora') {
    ctx.fillStyle = 'rgba(45, 212, 191, 0.18)';
    ctx.fillRect(0, 22 + Math.round(Math.sin(time * 2) * 5), PIXEL_W, 18);
    ctx.fillStyle = 'rgba(167, 139, 250, 0.16)';
    ctx.fillRect(0, 44 + Math.round(Math.cos(time * 1.8) * 5), PIXEL_W, 14);
  } else if (def.climate === 'crimson_thunder' && Math.floor(time * 7) % 13 === 0) {
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(260, 0);
    ctx.lineTo(246, 54);
    ctx.lineTo(262, 92);
    ctx.stroke();
  }

  // Diagonal anime speed-streaks tinted by boss aura
  ctx.save();
  ctx.strokeStyle = def.auraColor;
  ctx.globalAlpha = phase === 'enemy_anim' || phase === 'player_anim' ? 0.35 : 0.14;
  ctx.lineWidth = 2;
  for (let i = -2; i < 14; i++) {
    const sx = ((i * 62 - time * 110) % (PIXEL_W + 140)) - 40;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx - 68, 200);
    ctx.stroke();
  }
  ctx.restore();

  // Unique Climate Weather Particles
  const isFallingClimate =
    def.climate === 'blizzard_frost' ||
    def.climate === 'emerald_monsoon' ||
    def.climate === 'obsidian_sandstorm' ||
    def.climate === 'crimson_thunder';
  for (let i = 0; i < 28; i++) {
    const mx =
      (i * 41 +
        (def.climate === 'obsidian_sandstorm' ? time * 95 : Math.sin(time * 1.8 + i) * 18)) %
      PIXEL_W;
    const rawY = (time * (isFallingClimate ? 58 + (i % 4) * 14 : 18 + (i % 4) * 6) + i * 29) % PIXEL_H;
    const my = isFallingClimate ? rawY : PIXEL_H - rawY;
    ctx.fillStyle = def.climateParticleColor;
    ctx.globalAlpha = 0.72;
    if (def.climate === 'emerald_monsoon') {
      ctx.fillRect(Math.round(mx), Math.round(my), 1, 5);
    } else {
      ctx.fillRect(Math.round(mx), Math.round(my), i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
    }
  }
  ctx.globalAlpha = 1;

  // 2. Detailed Multi-Tiered Pokemon Battle Pedestals with Beveled Rim & Carpet/Rune Trim
  const bossSlideX = phase === 'intro' ? (1 - Math.min(1, phaseProgress * 1.4)) * 130 : 0;
  const bossDaisX = 342 + bossSlideX;
  const bossDaisY = 148;
  pRect(ctx, bossDaisX - 82, bossDaisY, 164, 20, '#0c0609');
  pRect(ctx, bossDaisX - 78, bossDaisY + 2, 156, 14, '#291a22');
  pRect(ctx, bossDaisX - 74, bossDaisY + 3, 148, 5, '#472f3b');
  pRect(ctx, bossDaisX - 70, bossDaisY + 2, 140, 2, def.auraColor);

  const playerSlideX = phase === 'intro' ? -(1 - Math.min(1, phaseProgress * 1.4)) * 120 : 0;
  const playerDaisX = 124 + playerSlideX;
  const playerDaisY = 194;
  pRect(ctx, playerDaisX - 68, playerDaisY, 136, 18, '#0c0609');
  pRect(ctx, playerDaisX - 64, playerDaisY + 2, 128, 12, '#6b1420');
  pRect(ctx, playerDaisX - 60, playerDaisY + 3, 120, 4, '#9f1239');
  pRect(ctx, playerDaisX - 58, playerDaisY + 2, 116, 2, '#fbbf24');

  // 3. Draw Crisp 1:1 Native Pixel JoJo Boss + Stand Spirit on Top-Right Dais
  const bossLunge =
    phase === 'enemy_anim' && slashFx
      ? Math.sin(Math.min(1, phaseProgress) * Math.PI) * -28
      : 0;
  const bossHitJitter =
    phase === 'player_anim' && slashFx && slashFx.progress > 0.2 && slashFx.progress < 0.75
      ? Math.round(Math.sin(time * 65) * 4)
      : 0;

  const bossStageScale = Number((def.scaleFactor * 1.55).toFixed(2));
  const pseudoBoss: ActiveBoss = {
    ...boss,
    x: bossDaisX + bossLunge + bossHitJitter - 12,
    y: bossDaisY - 32,
    facing: -1,
    state:
      phase === 'victory'
        ? 'ko'
        : phase === 'enemy_anim'
          ? 'attack'
          : 'idle',
    stateTimer: phase === 'victory' ? Math.max(0, 0.65 * (1 - phaseProgress)) : 0.5,
    hitFlash: phase === 'player_anim' && slashFx && slashFx.progress > 0.2 && slashFx.progress < 0.65 ? 0.1 : 0,
  };
  drawJoJoBoss(ctx, pseudoBoss, 0, time, frozenTurns > 0, bossStageScale);
  if (windVulnerable) {
    ctx.save();
    ctx.strokeStyle = '#2dd4bf';
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = 2;
    const spin = time * 4;
    ctx.beginPath();
    ctx.ellipse(bossDaisX, bossDaisY - 28, 34, 11, Math.sin(spin) * 0.15, 0, Math.PI * 1.7);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Draw Crisp 1:1 Native CPS3 Warrior Battle Sprite on Bottom-Left Dais
  const playerLunge =
    phase === 'player_anim' && slashFx
      ? Math.sin(Math.min(1, phaseProgress) * Math.PI) * 34
      : 0;
  const playerRunOff =
    phase === 'run_anim' || phase === 'escape_anim' ? -phaseProgress * 120 : 0;
  const playerHitJitter =
    phase === 'enemy_anim' && slashFx && slashFx.progress > 0.25 && slashFx.progress < 0.75
      ? Math.round(Math.sin(time * 60) * 4)
      : 0;
  const playerIsSlashing = phase === 'player_anim' && phaseProgress < 0.6;
  const playerHurtFlash =
    phase === 'enemy_anim' && slashFx && slashFx.progress > 0.2 && slashFx.progress < 0.65;
  const warriorSprite = getBakedWarriorBattleSprite(
    player.equippedWeapon,
    playerIsSlashing,
    player.customization,
  );
  const warriorBob = Math.round(Math.sin(time * 4) * 1.5);
  const wx = Math.round(playerDaisX + playerLunge + playerRunOff + playerHitJitter - 28);
  const wy = Math.round(playerDaisY - 63 + warriorBob);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(warriorSprite, wx, wy);
  if (playerHurtFlash) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.5;
    ctx.drawImage(warriorSprite, wx, wy);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  if (guardActive) {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(wx + 8, wy + 4, 42, 56);
  }
  ctx.restore();

  // 5. Anime Super Facial Cut-In Banner when Boss Unleashes Stand Attack!
  if (phase === 'enemy_anim' && phaseProgress < 0.48) {
    const slide = Math.min(1, phaseProgress * 6);
    const barY = 74;
    const barW = Math.round(292 * slide);
    pRect(ctx, 18, barY, barW, 44, '#09060b');
    pRect(ctx, 20, barY + 2, Math.max(0, barW - 4), 40, def.climateSkyBottom);
    pRect(ctx, 20, barY + 2, Math.max(0, barW - 4), 2, def.auraColor);
    pRect(ctx, 20, barY + 40, Math.max(0, barW - 4), 2, def.auraColor);
    if (barW >= 56) {
      ctx.save();
      ctx.translate(22, barY + 2);
      drawBossPortrait(ctx, def, 'wryyy', 40);
      ctx.restore();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(def.attackName.toUpperCase(), 68, barY + 18, 232);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.fillText(`"${def.battleShout}"`, 68, barY + 32, 232);
    }
  }

  // 6. Healing sparkles or Escape smoke puffs
  if (phase === 'potion_anim') {
    for (let i = 0; i < 10; i++) {
      const sy = playerDaisY - 6 - ((phaseProgress * 45 + i * 7) % 42);
      const sx = playerDaisX - 24 + ((i * 11) % 48);
      drawPixelSparkle(ctx, sx, sy, 2, i % 2 === 0 ? '#34d399' : '#fef08a');
    }
  } else if (phase === 'run_anim' || phase === 'escape_anim') {
    for (let i = 0; i < 8; i++) {
      const r = 6 + (i % 3) * 4;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.fillRect(
        Math.round(playerDaisX - 20 + i * 7),
        Math.round(playerDaisY - 12 - (i % 3) * 8 - phaseProgress * 10),
        r,
        r,
      );
    }
  }

  // 7. Slashing Fight Animation across active target!
  if (slashFx) {
    const targetX = slashFx.target === 'boss' ? bossDaisX : playerDaisX;
    const targetY = slashFx.target === 'boss' ? bossDaisY - 38 : playerDaisY - 26;
    drawBattleSlashFx(ctx, targetX, targetY, slashFx);
  }
}

/**
 * Atmospheric darkness & warm torchlight mask when stepping backwards into the Dark Hidden Sanctum (x < 0).
 */
export function drawDarkSanctumLighting(
  ctx: CanvasRenderingContext2D,
  camX: number,
  playerX: number,
  playerY: number,
  time: number,
) {
  if (camX >= 40) return;
  const darkStrength = Math.max(0, Math.min(0.84, ((40 - camX) / 140) * 0.84));
  const playerScreenX = Math.round(playerX - camX + 8);
  const playerScreenY = Math.round(playerY + 12);

  ctx.save();
  // Dark shadow veil across sanctum region
  const veilWidth = Math.max(0, Math.min(PIXEL_W, Math.round(0 - camX + 40)));
  if (veilWidth > 0) {
    ctx.fillStyle = `rgba(4, 2, 6, ${darkStrength})`;
    ctx.fillRect(0, 0, veilWidth, PIXEL_H);
  }
  // Flickering warm torchlight halos around player + sanctum braziers + Fire Sword altar
  const torches = [
    { x: playerScreenX, y: playerScreenY, r: 78 },
    { x: Math.round(-120 - camX), y: FLOOR_Y - 16, r: 54 },
    { x: Math.round(-320 - camX), y: FLOOR_Y - 16, r: 54 },
    { x: Math.round(-520 - camX), y: FLOOR_Y - 22, r: 68 },
  ];
  for (const t of torches) {
    if (t.x < -t.r || t.x > PIXEL_W + t.r) continue;
    const pulse = t.r + Math.sin(time * 7 + t.x) * 3;
    const g = ctx.createRadialGradient(t.x, t.y, 4, t.x, t.y, pulse);
    g.addColorStop(0, 'rgba(251, 146, 60, 0.24)');
    g.addColorStop(0.55, 'rgba(220, 38, 38, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(Math.round(t.x - pulse), Math.round(t.y - pulse), Math.round(pulse * 2), Math.round(pulse * 2));
  }
  ctx.restore();
}

/**
 * Molten Volcano Pit Chasm lava pool rendered under the Chunk 41 slipping bridge entry!
 */
export function drawVolcanoPitChasm(
  ctx: CanvasRenderingContext2D,
  pitStartX: number,
  pitWidth: number,
  camX: number,
  time: number,
) {
  const sx = Math.round(pitStartX - camX);
  if (sx + pitWidth < 0 || sx > PIXEL_W) return;

  pRect(ctx, sx, FLOOR_Y, pitWidth, PIXEL_H - FLOOR_Y, '#140303');
  pRect(ctx, sx, FLOOR_Y + 12, pitWidth, PIXEL_H - FLOOR_Y - 12, '#991b1b');
  pRect(ctx, sx, FLOOR_Y + 18, pitWidth, PIXEL_H - FLOOR_Y - 18, '#ea580c');
  for (let lx = 0; lx < pitWidth; lx += 16) {
    const wave = Math.round(Math.sin(time * 5 + lx * 0.25) * 2);
    pRect(ctx, sx + lx, FLOOR_Y + 14 + wave, 14, 4, '#fb923c');
    pRect(ctx, sx + lx + 3, FLOOR_Y + 15 + wave, 8, 2, '#fef08a');
  }
}

/**
 * Colossal Dimensional Glitch-Crash & Mega Boss Introduction Cutscene rendered directly onto the Pixel Canvas!
 */
export function drawMegaBossCutscene(
  ctx: CanvasRenderingContext2D,
  cutscene: MegaCutsceneHud,
  pendingBoss: ActiveBoss,
  time: number,
) {
  ctx.save();
  if (cutscene.phase === 'glitch') {
    // Reality chromatic tear & glitch bands
    ctx.fillStyle = 'rgba(12, 4, 24, 0.72)';
    ctx.fillRect(0, 0, PIXEL_W, PIXEL_H);
    const barColors = ['#22d3ee', '#f43f5e', '#fde047', '#8b5cf6'];
    for (let i = 0; i < 18; i++) {
      const y = ((i * 19 + Math.floor(time * 90) * 11) % PIXEL_H);
      const h = 3 + (i % 5) * 2;
      const offset = Math.round(Math.sin(time * 48 + i) * 34);
      ctx.fillStyle = barColors[i % barColors.length];
      ctx.globalAlpha = 0.65;
      ctx.fillRect(Math.max(0, offset), y, PIXEL_W - Math.abs(offset), h);
    }
    ctx.globalAlpha = 1;
    pRect(ctx, 74, 108, PIXEL_W - 148, 48, '#09060b');
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.strokeRect(74, 108, PIXEL_W - 148, 48);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('!! DIMENSIONAL GLITCH BREACH !!', PIXEL_W / 2, 130);
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('A COLOSSAL MEGA BOSS IS CRASHING INTO YOUR WORLD...', PIXEL_W / 2, 146);
  } else {
    // Dramatic Dark Dimensional Portal + Scaled Mega Boss Portrait & Full Sprite Reveal
    const p = Math.min(1, cutscene.progress * 1.4);
    ctx.fillStyle = 'rgba(7, 3, 15, 0.88)';
    ctx.fillRect(0, 0, PIXEL_W, PIXEL_H);

    const accent =
      cutscene.archetype === 'gyro_zeppeli'
        ? '#22c55e'
        : cutscene.archetype === 'mega_dio'
          ? '#facc15'
          : '#8b5cf6';
    const subAccent =
      cutscene.archetype === 'gyro_zeppeli'
        ? '#fef08a'
        : cutscene.archetype === 'mega_dio'
          ? '#22d3ee'
          : '#34d399';

    // Diagonal speed lines behind Mega Boss
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.42;
    for (let s = 0; s < 16; s++) {
      const sx = ((s * 44 - time * 140) % (PIXEL_W + 90)) - 30;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx - 60, PIXEL_H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Radiant vortex ring behind boss
    ctx.strokeStyle = subAccent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(PIXEL_W / 2, 118, 52 + Math.sin(time * 8) * 4, 0, Math.PI * 2);
    ctx.stroke();

    // Draw zoomed crisp Mega Boss Sprite centered dramatically
    const sprite = getBakedJoJoBossSprite(pendingBoss.def, 'attack', true);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    const scale = 1.2 + p * 0.25;
    const drawW = Math.round(sprite.width * scale);
    const drawH = Math.round(sprite.height * scale);
    ctx.drawImage(
      sprite,
      Math.round(PIXEL_W / 2 - drawW / 2),
      Math.round(124 - drawH / 2),
      drawW,
      drawH,
    );
    ctx.restore();

    // Dramatic lower nameplate banner
    pRect(ctx, 44, 186, PIXEL_W - 88, 62, '#09060b');
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 186, PIXEL_W - 88, 62);
    pRect(ctx, 48, 190, 48, 48, '#140c1e');
    ctx.save();
    ctx.translate(48, 190);
    drawBossPortrait(ctx, pendingBoss.def, 'wryyy', 48);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Enlarged Bastera-armored Pixel Star Platinum Guardian (~1.75x size) beside the Knight during ORA ORA barrage!
 */
export function drawStarPlatinumGuardian(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  facing: 1 | -1,
  camX: number,
  time: number,
  remainingSec: number,
) {
  const frame: 0 | 1 = Math.floor(time * 22) % 2 === 0 ? 0 : 1;
  const sp = getBakedStarPlatinumSprite(frame);
  const sx = Math.round(playerX - camX + 8);
  const sy = Math.round(playerY - 26 + Math.sin(time * 18) * 2.5);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = Math.min(0.96, remainingSec * 2.2);
  ctx.translate(sx, sy);
  ctx.scale(facing * 1.75, 1.75);
  ctx.drawImage(sp, -10, -8, 64, 52);

  // Enlarged floating ORA impact shockwaves in front of Star Platinum's fists
  for (let i = 0; i < 5; i++) {
    const t = (time * 10 + i * 0.2) % 1;
    const fx = Math.round(30 + t * 44);
    const fy = Math.round(3 + ((i * 9) % 28));
    sRect(ctx, fx - 0.5, fy - 0.5, 11, 5, '#09060b');
    sRect(ctx, fx, fy, 10, 4, i % 2 === 0 ? '#a78bfa' : '#fbbf24');
    sRect(ctx, fx + 6, fy + 1, 4, 2, '#ffffff');
  }
  ctx.restore();
}

/**
 * Red Hot Chili Pepper (4s Electrical JJBA Entity) crackling behind the Knight and firing lightning!
 */
export function drawChiliPepperEntity(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  facing: 1 | -1,
  camX: number,
  time: number,
  remainingSec: number,
) {
  const sx = Math.round(playerX - camX + 8 - facing * 18);
  const sy = Math.round(playerY - 14 + Math.sin(time * 14) * 2.5);
  const frame: 0 | 1 = Math.floor(time * 14) % 2 === 0 ? 0 : 1;
  const sprite = getBakedStandWorldSprite('chili_pepper', frame);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = Math.min(0.96, remainingSec * 2.5);
  ctx.translate(sx, sy);
  ctx.scale(facing, 1);

  // Crackling outer electrical aura
  ctx.strokeStyle = frame === 0 ? '#22d3ee' : '#fef08a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 4, 20 + Math.sin(time * 28) * 2.5, 0, Math.PI * 2);
  ctx.stroke();

  // High-resolution 96x96 baked Stand sprite rendered crisply into 44x44 logical space
  ctx.drawImage(sprite, -22, -18, 44, 44);

  // Animated lightning arcs jumping off fists
  const arcX = 10 + Math.round(Math.sin(time * 32) * 3);
  sRect(ctx, 12, 2, arcX, 2, '#38bdf8');
  sRect(ctx, 14, 3.5, arcX - 2, 1.5, '#ffffff');
  ctx.restore();
}

/**
 * High-Resolution Stand Summoning Manifestation for all 10 JJBA Stands when executing [3].
 */
export function drawJjbaStandSprite(
  ctx: CanvasRenderingContext2D,
  standId: StandId,
  x: number,
  y: number,
  facing: 1 | -1,
  camX: number,
  time: number,
  alpha: number,
) {
  const def = STANDS[standId];
  const sx = Math.round(x - camX + 8 - facing * 16);
  const sy = Math.round(y - 18 + Math.sin(time * 12) * 2.5);
  const frame: 0 | 1 = Math.floor(time * 12) % 2 === 0 ? 0 : 1;
  const sprite = getBakedStandWorldSprite(standId, frame);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = Math.max(0, Math.min(0.95, alpha));
  ctx.translate(sx, sy);

  // Glowing Stand manifestation halo
  ctx.fillStyle = def.primaryColor;
  ctx.globalAlpha = Math.max(0, Math.min(0.36, alpha * 0.45));
  ctx.beginPath();
  ctx.arc(0, 6, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = def.accentColor;
  ctx.lineWidth = 1.6;
  ctx.globalAlpha = Math.max(0, Math.min(0.75, alpha * 0.8));
  ctx.beginPath();
  ctx.arc(0, 6, 21 + Math.sin(time * 16) * 2, time * 2, time * 2 + Math.PI * 1.45);
  ctx.stroke();

  // Render facing Stand spirit cleanly from 96x96 HD baked atlas
  ctx.globalAlpha = Math.max(0, Math.min(0.98, alpha));
  ctx.save();
  ctx.scale(facing, 1);
  ctx.drawImage(sprite, -24, -18, 48, 48);
  ctx.restore();

  // Floating menacing katakana (ゴゴゴ)
  ctx.fillStyle = def.accentColor;
  ctx.font = 'bold 8px monospace';
  ctx.fillText('ゴ', -26, -12 + Math.sin(time * 8) * 2);
  ctx.fillText('ゴ', 20, -4 + Math.cos(time * 7) * 2);
  ctx.restore();
}



