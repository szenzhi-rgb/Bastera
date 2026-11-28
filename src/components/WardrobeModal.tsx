import React from 'react';
import { WARDROBE_CATALOG } from '../game/isekai';
import type { HudSnapshot } from '../game/types';
import { PixelWarriorPortrait } from './PixelPortrait';

interface WardrobeModalProps {
  hud: HudSnapshot;
  onClose: () => void;
  onBuyOrEquip: (itemId: string) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  hud,
  onClose,
  onBuyOrEquip,
}) => {
  const outfits = WARDROBE_CATALOG.filter((w) => w.slot === 'outfit');
  const headgear = WARDROBE_CATALOG.filter((w) => w.slot === 'headgear');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80"
      data-testid="wardrobe-shop-modal"
    >
      <div className="relative w-full max-w-[92%] sm:max-w-2xl max-h-[86%] flex flex-col bg-[#1b0f18] border-2 border-pink-300/85 text-amber-50 shadow-[0_10px_36px_rgba(0,0,0,0.92)] overflow-hidden">
        <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-pink-200" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-pink-200" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-pink-200" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-pink-200" />

        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-[#2d1626] border-b border-pink-300/40 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <PixelWarriorPortrait
              weaponId={hud.equippedWeapon}
              customization={hud.customization}
              size={42}
            />
            <div className="min-w-0">
              <h2 className="font-display text-sm sm:text-base font-bold text-pink-100 truncate">
                Atelier Sylvie&apos;s Wardrobe Shop
              </h2>
              <p className="font-pixel-mono text-[9px] sm:text-[10px] text-amber-200/85">
                Isekai Garb &amp; Regalia · Gold:{' '}
                <strong className="text-yellow-300">{hud.gold}G</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-2.5 py-1 bg-[#3d1f35] hover:bg-[#522947] border border-pink-300/75 font-pixel-mono text-[10px] sm:text-xs text-pink-100 cursor-pointer shrink-0"
          >
            Close [Esc]
          </button>
        </div>

        <div className="p-2.5 sm:p-4 overflow-y-auto space-y-2.5 sm:space-y-3">
          {/* Royal Crown & Elf Sovereign Crown Toggle Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 sm:p-2.5 bg-[#2a1b0b] border border-yellow-400/85 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-display text-xs font-bold text-yellow-200 truncate">
                  ♛ Solaris Crown {hud.crownUnlocked ? '(UNLOCKED)' : '(A-Rank)'}
                </div>
                <p className="font-pixel-mono text-[9px] text-amber-100/80 truncate">
                  {hud.crownUnlocked ? 'From 3 Demon Kings' : 'Defeat 3 Demon Kings'}
                </p>
              </div>
              <button
                type="button"
                tabIndex={-1}
                disabled={!hud.crownUnlocked}
                onClick={() => onBuyOrEquip('toggle_crown')}
                className="px-2 py-1 bg-yellow-700 hover:bg-yellow-600 disabled:opacity-40 border border-yellow-200 font-pixel-mono text-[9px] font-bold text-white cursor-pointer shrink-0 whitespace-nowrap"
              >
                {hud.customization.crownEquipped && hud.customization.crownStyle !== 'elf_emerald'
                  ? 'Unequip'
                  : 'Wear ♛'}
              </button>
            </div>

            <div className="p-2 sm:p-2.5 bg-[#0b231b] border border-emerald-400/85 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-display text-xs font-bold text-emerald-200 truncate">
                  🌿 Elf Crown {hud.elfCrownUnlocked ? '(UNLOCKED)' : '(Aethelgard)'}
                </div>
                <p className="font-pixel-mono text-[9px] text-emerald-100/80 truncate">
                  {hud.elfCrownUnlocked ? '+8% ATK/Speed Regalia' : 'Defend Elf Banquet'}
                </p>
              </div>
              <button
                type="button"
                tabIndex={-1}
                disabled={!hud.elfCrownUnlocked}
                data-testid="wardrobe-toggle-elf-crown-btn"
                onClick={() => onBuyOrEquip('toggle_elf_crown')}
                className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 border border-emerald-200 font-pixel-mono text-[9px] font-bold text-white cursor-pointer shrink-0 whitespace-nowrap"
              >
                {hud.customization.crownEquipped && hud.customization.crownStyle === 'elf_emerald'
                  ? 'Unequip'
                  : 'Wear 🌿'}
              </button>
            </div>
          </div>

          {/* Outfits */}
          <div>
            <h3 className="font-pixel-mono text-xs font-bold text-pink-200 uppercase tracking-wider mb-2">
              Adventurer Outfits &amp; Coats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {outfits.map((item) => {
                const owned = hud.unlockedWardrobe.includes(item.id);
                const equipped = hud.customization.outfitStyle === item.outfitStyle;
                const canAfford = hud.gold >= item.price;
                return (
                  <div
                    key={item.id}
                    className={`p-3 border ${
                      equipped
                        ? 'bg-[#331a2d] border-pink-300'
                        : 'bg-[#140b12] border-pink-500/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold text-amber-50">{item.name}</span>
                      <span className="font-pixel-mono text-[11px] text-yellow-300">
                        {owned ? 'OWNED' : `${item.price}G`}
                      </span>
                    </div>
                    <p className="font-pixel-mono text-[10px] text-amber-100/75 mt-1">{item.description}</p>
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        data-testid={`wardrobe-btn-${item.id}`}
                        tabIndex={-1}
                        disabled={!owned && !canAfford}
                        onClick={() => onBuyOrEquip(item.id)}
                        className={`px-3 py-1 border font-pixel-mono text-[10px] font-bold cursor-pointer disabled:opacity-40 ${
                          equipped
                            ? 'bg-emerald-800 border-emerald-300 text-white'
                            : owned
                              ? 'bg-[#2a1525] border-pink-300 text-pink-100 hover:bg-[#3f2037]'
                              : 'bg-amber-800 border-amber-300 text-white hover:bg-amber-700'
                        }`}
                      >
                        {equipped ? 'EQUIPPED' : owned ? 'Equip' : `Buy (${item.price}G)`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Headgear */}
          <div>
            <h3 className="font-pixel-mono text-xs font-bold text-pink-200 uppercase tracking-wider mb-2">
              Headgear &amp; Accessories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {headgear.map((item) => {
                const owned = hud.unlockedWardrobe.includes(item.id);
                const equipped = hud.customization.headgearStyle === item.headgearStyle;
                const canAfford = hud.gold >= item.price;
                return (
                  <div
                    key={item.id}
                    className={`p-3 border ${
                      equipped
                        ? 'bg-[#331a2d] border-pink-300'
                        : 'bg-[#140b12] border-pink-500/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold text-amber-50">{item.name}</span>
                      <span className="font-pixel-mono text-[11px] text-yellow-300">
                        {owned ? 'OWNED' : `${item.price}G`}
                      </span>
                    </div>
                    <p className="font-pixel-mono text-[10px] text-amber-100/75 mt-1">{item.description}</p>
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        data-testid={`wardrobe-btn-${item.id}`}
                        tabIndex={-1}
                        disabled={!owned && !canAfford}
                        onClick={() => onBuyOrEquip(item.id)}
                        className={`px-3 py-1 border font-pixel-mono text-[10px] font-bold cursor-pointer disabled:opacity-40 ${
                          equipped
                            ? 'bg-emerald-800 border-emerald-300 text-white'
                            : owned
                              ? 'bg-[#2a1525] border-pink-300 text-pink-100 hover:bg-[#3f2037]'
                              : 'bg-amber-800 border-amber-300 text-white hover:bg-amber-700'
                        }`}
                      >
                        {equipped ? 'EQUIPPED' : owned ? 'Equip' : `Buy (${item.price}G)`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
