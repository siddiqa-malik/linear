"use client";

import React from "react";
import { CheckCircle2, CircleDot, Compass, Layers, Milestone, Sliders } from "lucide-react";

export function PlanSection() {
  return (
    <section className="relative py-24 md:py-32 border-t border-white/[0.06]">
      {/* Lime Accent Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-20 w-96 h-96 rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#bef264] via-[#a3e635] to-[#84cc16]">
            Plan
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8a8f98] leading-relaxed">
            Linear focuses on continuous momentum rather than sprint goals and story points.
            Break down initiatives into focused, scoped projects that can ship in weeks, not quarters.
          </p>
        </div>

        {/* 6 Cards 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Issues */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#a3e635]/40 transition-all duration-300">
            {/* Visual Graphic */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-[#62666d]">
                <span className="flex items-center gap-1.5 text-white/90 font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#a3e635]" />
                  ENG-284
                </span>
                <span>Active</span>
              </div>
              <div className="text-xs font-medium text-white/95 line-clamp-2">
                Refactor authorization middleware for low-latency edge workers
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <span className="px-2 py-0.5 rounded bg-[#a3e635]/15 text-[#bef264] text-[10px] font-mono">
                  ● Core API
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#8a8f98] text-[10px]">
                  High
                </span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <CircleDot className="h-4 w-4 text-[#a3e635]" />
                <h3>Issues</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Break goals down into atomic, actionable units of work with keyboard-first flows.
              </p>
            </div>
          </div>

          {/* Card 2: The backlog */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#a3e635]/40 transition-all duration-300">
            {/* Visual Graphic: Circular Radar / Reticle */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="relative flex items-center justify-center h-28 w-28">
                <div className="absolute h-28 w-28 rounded-full border border-dashed border-white/10" />
                <div className="absolute h-20 w-20 rounded-full border border-[#a3e635]/30 group-hover:border-[#a3e635]/60 transition-colors" />
                <div className="absolute h-10 w-10 rounded-full border border-white/20" />
                <div className="h-3 w-3 rounded-full bg-[#bef264] shadow-[0_0_14px_#bef264]" />
              </div>
              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#8a8f98]/80">
                Auto-archive: 90 days
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Compass className="h-4 w-4 text-[#a3e635]" />
                <h3>The backlog</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Keep your backlog lean by auto-closing stale issues after 90 days of inactivity.
              </p>
            </div>
          </div>

          {/* Card 3: Cycles */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#a3e635]/40 transition-all duration-300">
            {/* Visual Graphic: Wave Trajectory */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-[#8a8f98]">
                <span>Cycle 14</span>
                <span className="text-[#bef264] font-mono font-medium">82% completed</span>
              </div>
              <div className="relative h-16 w-full flex items-center">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 60">
                  <path
                    d="M 10 45 Q 60 40, 110 25 T 190 15 T 230 10"
                    fill="none"
                    stroke="#a3e635"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(163,230,53,0.7)]"
                  />
                  <line x1="10" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <circle cx="190" cy="15" r="4" fill="#bef264" className="shadow-[0_0_10px_#bef264]" />
                </svg>
              </div>
              <div className="text-[10px] text-[#62666d]">Automated 2-week continuous cadence</div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Milestone className="h-4 w-4 text-[#a3e635]" />
                <h3>Cycles</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Automated sprint-free tracking of continuous progress and steady momentum.
              </p>
            </div>
          </div>

          {/* Card 4: Projects */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#a3e635]/40 transition-all duration-300">
            {/* Visual Graphic: Keyboard Keys Row */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex gap-1.5 sm:gap-2">
                {["P", "R", "O", "J", "E", "C", "T", "S"].map((letter, i) => (
                  <div
                    key={letter}
                    className={`flex h-8 w-7 sm:h-9 sm:w-8 items-center justify-center rounded-lg border text-xs font-semibold shadow-md transition-all ${
                      i === 0 || i === 3
                        ? "border-[#a3e635]/70 bg-[#a3e635]/20 text-[#bef264] shadow-[0_0_10px_rgba(163,230,53,0.4)]"
                        : "border-white/10 bg-[#12141e] text-white/70"
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Layers className="h-4 w-4 text-[#a3e635]" />
                <h3>Projects</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Cross-functional initiatives that align engineering, product, and design toward shared outcomes.
              </p>
            </div>
          </div>

          {/* Card 5: Roadmaps */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#a3e635]/40 transition-all duration-300">
            {/* Visual Graphic: Gantt timeline */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-center gap-3 shadow-inner">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#8a8f98]">
                  <span>Linear Sync 2.0</span>
                  <span className="text-white font-mono">Q1</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/[0.04] p-0.5">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#84cc16] to-[#bef264] shadow-[0_0_10px_rgba(190,242,100,0.5)]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#8a8f98]">
                  <span>Mobile Redesign</span>
                  <span className="text-white font-mono">Q2</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/[0.04] p-0.5">
                  <div className="ml-[30%] h-full w-[55%] rounded-full bg-white/20" />
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <CheckCircle2 className="h-4 w-4 text-[#a3e635]" />
                <h3>Roadmaps</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Bird’s-eye view of milestones, targets, and inter-team dependencies across multiple quarters.
              </p>
            </div>
          </div>

          {/* Card 6: Insights */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#a3e635]/40 transition-all duration-300">
            {/* Visual Graphic: Slider metrics */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-center gap-3.5 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8a8f98]">Throughput</span>
                <span className="font-mono text-white font-semibold">18 issues / wk</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8a8f98]">Scope variance</span>
                <span className="font-mono text-[#bef264] font-semibold">± 4% (Stable)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8a8f98]">Health Index</span>
                <span className="font-mono text-[#bef264] font-semibold">9.8 / 10</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Sliders className="h-4 w-4 text-[#a3e635]" />
                <h3>Insights</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Real-time visibility into project health, velocity forecasting, and scope changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
