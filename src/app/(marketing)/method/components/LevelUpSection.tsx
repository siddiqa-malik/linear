"use client";

import React from "react";
import { Command, Eye, Laptop, Moon, Network, WifiOff } from "lucide-react";

export function LevelUpSection() {
  return (
    <section className="relative py-24 md:py-32 border-t border-white/[0.06]">
      {/* Amber Accent Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-24 w-96 h-96 rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#ea580c]">
            Level up
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8a8f98] leading-relaxed">
            Designed for craft and speed. Elevate your development workflows with opinionated
            features built from years of experience at top engineering organizations.
          </p>
        </div>

        {/* 6 Cards 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Desktop app */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f59e0b]/40 transition-all duration-300">
            {/* Visual Graphic: Floating Diamond Sparkle */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full bg-[#f59e0b]/20 blur-xl group-hover:bg-[#f59e0b]/35 transition-all" />
                <div className="h-12 w-12 rotate-45 rounded-lg border border-[#f59e0b]/60 bg-[#16130b] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  <div className="h-4 w-4 bg-[#fbbf24] rounded-sm -rotate-45" />
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Laptop className="h-4 w-4 text-[#f59e0b]" />
                <h3>Desktop app</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Native macOS, Windows, and Linux applications with instant start and system hotkeys.
              </p>
            </div>
          </div>

          {/* Card 2: Offline sync */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f59e0b]/40 transition-all duration-300">
            {/* Visual Graphic: Offline Indicator */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex flex-col items-center justify-center p-4 gap-2 shadow-inner">
              <div className="px-3 py-1.5 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 flex items-center gap-2 text-xs font-mono text-[#fbbf24] shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <WifiOff className="h-3.5 w-3.5 text-[#f59e0b]" />
                <span>Offline mode ready</span>
              </div>
              <span className="text-[10px] text-[#62666d]">Sub-50ms optimistic mutations</span>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <WifiOff className="h-4 w-4 text-[#f59e0b]" />
                <h3>Offline sync</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Continue working anywhere without network connection. Everything syncs cleanly on reconnect.
              </p>
            </div>
          </div>

          {/* Card 3: Command menu */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f59e0b]/40 transition-all duration-300">
            {/* Visual Graphic: Command Bar */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex flex-col justify-center p-4 gap-2.5 shadow-inner">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white">
                <span>Jump to project...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘P</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-xs text-white">
                <span>Quick command palette</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#f59e0b]/30 text-[10px] font-mono text-[#fbbf24]">⌘K</kbd>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Command className="h-4 w-4 text-[#f59e0b]" />
                <h3>Command menu</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Trigger any workspace action or navigate across views without taking fingers off keys.
              </p>
            </div>
          </div>

          {/* Card 4: Dark & light mode */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f59e0b]/40 transition-all duration-300">
            {/* Visual Graphic: Split Duotone Circle */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-4 shadow-inner">
              <div className="relative h-20 w-20 rounded-full border border-white/20 overflow-hidden flex shadow-lg">
                <div className="w-1/2 h-full bg-[#080915] flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white/40" />
                </div>
                <div className="w-1/2 h-full bg-[#f59e0b] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                  <div className="h-2 w-2 rounded-full bg-black/40" />
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Moon className="h-4 w-4 text-[#f59e0b]" />
                <h3>Dark & light mode</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Tailored themes with curated contrast ratios designed for sustained, fatigue-free focus.
              </p>
            </div>
          </div>

          {/* Card 5: Multi-team scale */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f59e0b]/40 transition-all duration-300">
            {/* Visual Graphic: Team Capacity Matrix */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-center gap-2 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8a8f98]">Core Infrastructure</span>
                <span className="text-white font-mono">18 devs</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8a8f98]">Product & Growth</span>
                <span className="text-[#fbbf24] font-mono">24 devs</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8a8f98]">Design Systems</span>
                <span className="text-white font-mono">8 devs</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Network className="h-4 w-4 text-[#f59e0b]" />
                <h3>Multi-team scale</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Connect tens of autonomous squads in one unified workspace with team-isolated scopes.
              </p>
            </div>
          </div>

          {/* Card 6: Custom views */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#f59e0b]/40 transition-all duration-300">
            {/* Visual Graphic: View Layout Filter Chips */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex flex-wrap gap-2 justify-center max-w-[210px]">
                <span className="px-2.5 py-1 rounded-md bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#fbbf24] text-[11px] font-mono">
                  ★ My Focus
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80 text-[11px]">
                  Needs Review
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80 text-[11px]">
                  High Priority
                </span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Eye className="h-4 w-4 text-[#f59e0b]" />
                <h3>Custom views</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Save and share customized filters, layouts, and groupings for any cross-functional purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
