"use client";

import { Activity, Clock, Flame } from "lucide-react";

export function CyclesSection() {
  return (
    <section id="method" className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#08090a]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Build momentum
            <br />
            <span className="text-gradient">with Cycles</span>
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-[#8a8f98]">
            Cycles focus your team on what matters now. They run automatically on a regular schedule, without tedious sprint planning.
          </p>
        </div>

        {/* Linear Cycles Burndown Chart Graphic */}
        <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f15] p-6 md:p-8 shadow-2xl">
          {/* Header of Cycle Chart */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Cycle 32</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Active</span>
              </div>
              <span className="text-xs text-[#8a8f98]">Oct 1 — Oct 15 • 4 days remaining</span>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-[#62666d] block text-[11px]">Scope</span>
                <span className="font-semibold text-white">48 points</span>
              </div>
              <div>
                <span className="text-[#62666d] block text-[11px]">Completed</span>
                <span className="font-semibold text-[#5e6ad2]">84%</span>
              </div>
              <div>
                <span className="text-[#62666d] block text-[11px]">Velocity</span>
                <span className="font-semibold text-white">12.4 pts/day</span>
              </div>
            </div>
          </div>

          {/* SVG Burndown Chart Visual */}
          <div className="relative mt-6 h-64 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Ideal trajectory (dotted line) */}
              <line x1="20" y1="30" x2="580" y2="180" stroke="#8a8f98" strokeOpacity="0.3" strokeDasharray="6 6" strokeWidth="2" />

              {/* Actual Burndown Curved Gradient Line */}
              <defs>
                <linearGradient id="cycleLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5e6ad2" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="cycleFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(94,106,210,0.25)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Fill area beneath curve */}
              <path
                d="M 20 30 Q 150 45, 250 85 T 450 145 T 520 165 L 520 200 L 20 200 Z"
                fill="url(#cycleFillGrad)"
              />

              {/* Glowing Line */}
              <path
                d="M 20 30 Q 150 45, 250 85 T 450 145 T 520 165"
                fill="none"
                stroke="url(#cycleLineGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive glowing node at current position */}
              <circle cx="520" cy="165" r="5" fill="#38bdf8" className="shadow-[0_0_12px_#38bdf8]" />
              <circle cx="520" cy="165" r="10" fill="none" stroke="#38bdf8" strokeOpacity="0.4" className="animate-ping" />
            </svg>

            {/* Days indicator row */}
            <div className="mt-4 flex justify-between text-[11px] text-[#62666d]">
              <span>Day 1</span>
              <span>Day 4</span>
              <span>Day 7 (Midway)</span>
              <span>Day 11 (Today)</span>
              <span>Day 14</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Clock className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Automated scheduling</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Cycles roll over automatically on your schedule. Unfinished tasks carry over without interrupting team flow.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Activity className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Scope & velocity tracking</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Real-time velocity tracking detects scope creep early and accurately projects completion dates.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Flame className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Cooldown periods</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Give engineers dedicated time between major cycles for refactoring, tech debt, and experimenting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}