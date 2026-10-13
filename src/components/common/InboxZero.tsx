"use client";

import React from "react";
import { Inbox, Sparkles, CheckCircle2 } from "lucide-react";

export function InboxZero() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* 3D Wireframe Inbox Graphic */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#5e6ad2]/20 to-transparent border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-[#5e6ad2]/10 backdrop-blur-xl">
          <Inbox className="w-10 h-10 text-[#8a8f98]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      <h3 className="text-[17px] font-semibold text-white tracking-wide mb-1.5">
        Inbox – No unread notifications
      </h3>
      <p className="text-[13px] text-[#8a8f98] max-w-sm leading-relaxed mb-6">
        You are all caught up! New notifications and task assignments from your team will show up here.
      </p>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[12px] text-[#62666d]">
        <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
        <span>Inbox zero reached</span>
      </div>
    </div>
  );
}
