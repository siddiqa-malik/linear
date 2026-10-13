"use client";

import React from "react";
import { GitBranch, Inbox, Keyboard, Sparkles, Tag, Workflow } from "lucide-react";

export function ProgressSection() {
  return (
    <section className="relative py-24 md:py-32 border-t border-white/[0.06]">
      {/* Pink Accent Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-20 w-96 h-96 rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #f43f5e 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fb7185] via-[#f43f5e] to-[#ec4899]">
            Progress
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8a8f98] leading-relaxed">
            Linear turns project management into momentum. Track progress automatically,
            spot bottlenecks early, and keep your team aligned with real-time updates and seamless Git integrations.
          </p>
        </div>

        {/* 6 Cards 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Automated workflows */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f43f5e]/40 transition-all duration-300">
            {/* Visual Graphic: 3 Connected Circles */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-[10px] text-zinc-300">
                    1
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Todo</span>
                </div>
                <div className="w-8 h-0.5 bg-[#f43f5e]/40" />
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#f43f5e]/20 border border-[#f43f5e] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_#f43f5e]">
                    2
                  </div>
                  <span className="text-[10px] text-[#fb7185] mt-1 font-medium">In Progress</span>
                </div>
                <div className="w-8 h-0.5 bg-[#f43f5e]/40" />
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[10px] text-emerald-400">
                    ✓
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Done</span>
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Workflow className="h-4 w-4 text-[#f43f5e]" />
                <h3>Automated workflows</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Status updates that move automatically with Git branches and pull request approvals.
              </p>
            </div>
          </div>

          {/* Card 2: Active projects */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f43f5e]/40 transition-all duration-300">
            {/* Visual Graphic: Active Projects Card */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-between shadow-inner">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-medium">Linear Web V2</span>
                  <span className="text-[#fb7185] font-mono text-[11px]">84% complete</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.05]">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#f43f5e] to-[#fb7185] shadow-[0_0_8px_#f43f5e]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/80 font-medium">Native Desktop</span>
                  <span className="text-[#8a8f98] font-mono text-[11px]">45% complete</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.05]">
                  <div className="h-full w-[45%] rounded-full bg-white/20" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#62666d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f43f5e]" />
                <span>Target release: Next month</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <GitBranch className="h-4 w-4 text-[#f43f5e]" />
                <h3>Active projects</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Clear project ownership, automated progress tracking, and zero status meetings.
              </p>
            </div>
          </div>

          {/* Card 3: Notification inbox */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f43f5e]/40 transition-all duration-300">
            {/* Visual Graphic: Notification stack */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-3 flex flex-col justify-between shadow-inner">
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f43f5e]" />
                  <span className="text-white">Alex assigned ENG-42</span>
                </div>
                <span className="text-[#62666d] text-[10px]">2m</span>
              </div>
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="text-white/80">PR #89 approved</span>
                </div>
                <span className="text-[#62666d] text-[10px]">15m</span>
              </div>
              <div className="text-[10px] text-[#62666d] px-1">Inbox Zero achieved daily</div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Inbox className="h-4 w-4 text-[#f43f5e]" />
                <h3>Notification inbox</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Zero-noise updates filtered by high priority, mentions, and urgent blockers.
              </p>
            </div>
          </div>

          {/* Card 4: Triage and reviews */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f43f5e]/40 transition-all duration-300">
            {/* Visual Graphic: Triage Board */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-3 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-[#8a8f98]">
                <span>Triage Queue</span>
                <span className="px-1.5 py-0.5 rounded bg-[#f43f5e]/20 text-[#fb7185] font-mono">3 Pending</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] text-white">
                  Fix token expiry in Safari iOS
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Accept</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 text-[10px]">Decline</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[#8a8f98] text-[10px]">Snooze</span>
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Sparkles className="h-4 w-4 text-[#f43f5e]" />
                <h3>Triage and reviews</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Screen incoming bug reports and customer requests before assigning to sprints.
              </p>
            </div>
          </div>

          {/* Card 5: Labels */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f43f5e]/40 transition-all duration-300">
            {/* Visual Graphic: Labels Pills Palette */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex flex-wrap gap-2 justify-center max-w-[210px]">
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-mono">
                  ● Bug
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#f43f5e]/20 border border-[#f43f5e]/50 text-[#fb7185] text-[11px] font-mono">
                  ● Core
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono">
                  ● Security
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono">
                  ● Feature
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono">
                  ● Performance
                </span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Tag className="h-4 w-4 text-[#f43f5e]" />
                <h3>Labels</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Organize work with flexible, color-coded taxonomies and multi-select filtering.
              </p>
            </div>
          </div>

          {/* Card 6: Keyboard-first UX */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f43f5e]/40 transition-all duration-300">
            {/* Visual Graphic: Hotkey Strip */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <div className="flex items-center justify-between text-xs text-[#8a8f98]">
                  <span>New Issue</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#f43f5e]/20 border border-[#f43f5e]/40 text-white font-mono text-[10px]">C</kbd>
                </div>
                <div className="flex items-center justify-between text-xs text-[#8a8f98]">
                  <span>Change Status</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono text-[10px]">S</kbd>
                </div>
                <div className="flex items-center justify-between text-xs text-[#8a8f98]">
                  <span>Assign Lead</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono text-[10px]">A</kbd>
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Keyboard className="h-4 w-4 text-[#f43f5e]" />
                <h3>Keyboard-first UX</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Every single action is available via blistering fast keyboard shortcuts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
