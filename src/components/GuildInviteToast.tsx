import React from 'react';
import type { GuildInvite } from '../game/types';

interface GuildInviteToastProps {
  invites: GuildInvite[];
  onRespond: (inviteId: string, accept: boolean) => void;
}

export const GuildInviteToast: React.FC<GuildInviteToastProps> = ({ invites, onRespond }) => {
  if (invites.length === 0) return null;
  const inv = invites[0];

  return (
    <div
      data-testid="guild-invite-toast"
      className="fixed top-12 left-1/2 -translate-x-1/2 z-40 w-[260px] max-w-[85%] bg-[#1a1009]/95 border-2 border-cyan-300 p-2 text-amber-50 shadow-[0_8px_24px_rgba(0,0,0,0.9)]"
    >
      <div className="font-pixel-mono text-[8.5px] font-bold text-cyan-300 uppercase tracking-wider">
        ✦ GUILD CO-OP INVITE
      </div>
      <div className="font-display text-xs font-bold text-amber-100 mt-0.5 truncate">
        {inv.fromName} · {inv.missionTitle}
      </div>
      <div className="font-pixel-mono text-[9px] text-amber-200/80">
        {inv.fromRank}-Rank Adventurer
      </div>
      <div className="mt-1.5 flex items-center justify-end gap-1.5">
        <button
          type="button"
          tabIndex={-1}
          onClick={() => onRespond(inv.inviteId, false)}
          className="px-2.5 py-1 bg-[#291712] hover:bg-[#3c2119] border border-amber-500/50 font-pixel-mono text-[10px] text-amber-200 cursor-pointer"
        >
          Decline
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => onRespond(inv.inviteId, true)}
          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 border border-emerald-300 font-pixel-mono text-[10px] font-bold text-white cursor-pointer"
        >
          Accept &amp; Depart ▶
        </button>
      </div>
    </div>
  );
};
