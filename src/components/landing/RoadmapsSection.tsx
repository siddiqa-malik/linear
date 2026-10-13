"use client";

import { Calendar, Compass, Milestone, Users } from "lucide-react";

export function RoadmapsSection() {
  return (
    <section className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#08090b]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Set direction
            <br />
            <span className="text-gradient">with Roadmaps</span>
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-[#8a8f98]">
            Plan projects, track milestones, and communicate product direction across teams.
          </p>
        </div>

        {/* Roadmap Timeline Visual */}
        <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f15] p-6 shadow-2xl">
          {/* Quarter Timeline Header */}
          <div className="grid grid-cols-4 border-b border-white/[0.06] pb-3 text-xs text-[#8a8f98] font-medium">
            <span className="text-white">Q1 2026</span>
            <span>Q2 2026</span>
            <span className="text-white">Q3 2026 (Current)</span>
            <span>Q4 2026</span>
          </div>

          {/* Project Timeline Gantt Bars */}
          <div className="mt-6 space-y-4">
            {/* Project 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  TaskFlow API Backend & Auth
                </span>
                <span className="text-[11px] text-[#8a8f98]">95% complete</span>
              </div>
              <div className="relative h-6 w-full rounded-md bg-white/[0.03] p-1">
                <div className="h-full w-[70%] rounded bg-gradient-to-r from-emerald-500/80 to-emerald-400 text-[10px] text-black font-semibold flex items-center px-2">
                  Production Ready
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#5e6ad2]" />
                  Linear Frontend Clone (2021-2023)
                </span>
                <span className="text-[11px] text-[#8a8f98]">72% complete</span>
              </div>
              <div className="relative h-6 w-full rounded-md bg-white/[0.03] p-1">
                <div className="ml-[25%] h-full w-[55%] rounded bg-gradient-to-r from-[#5e6ad2] to-[#818cf8] text-[10px] text-white font-medium flex items-center px-2 shadow-[0_0_12px_rgba(94,106,210,0.5)]">
                  Active Sprint
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Real-time Notifications & WebSocket Stream
                </span>
                <span className="text-[11px] text-[#8a8f98]">35% complete</span>
              </div>
              <div className="relative h-6 w-full rounded-md bg-white/[0.03] p-1">
                <div className="ml-[50%] h-full w-[35%] rounded bg-amber-500/80 text-[10px] text-black font-semibold flex items-center px-2">
                  In Progress
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Milestone className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Project milestones</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Set high-level deadlines and automatically calculate ETA based on individual issue completion.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Compass className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Cross-team alignment</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Keep product, engineering, and design moving in lockstep without status updates or spreadsheets.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Calendar className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Automatic rollups</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Progress bars update dynamically as underlying tasks are marked completed by developers.
            </p>
          </div>
        </div>

        {/* 2 Bento Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="linear-card rounded-2xl p-6">
            <div className="text-xs font-semibold text-white mb-2">Target dates & Quarter milestones</div>
            <p className="text-xs text-[#8a8f98] leading-relaxed">
              Define target completion quarters and track progress drift with automatic risk alerts before deadlines slip.
            </p>
          </div>

          <div className="linear-card rounded-2xl p-6">
            <div className="text-xs font-semibold text-white mb-2">Initiatives & Project Leads</div>
            <p className="text-xs text-[#8a8f98] leading-relaxed">
              Group related projects into broader company strategic goals and designate ownership clearly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}