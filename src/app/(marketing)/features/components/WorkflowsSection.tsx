"use client";

import { Cpu, ShieldCheck, Zap } from "lucide-react";

export function WorkflowsSection() {
  return (
    <section className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#08090a]">
      {/* Central Ambient Spotlight */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-96 w-96 rounded-full bg-[#5e6ad2]/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Central Illuminated Emblem */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#12131b] shadow-xl shadow-[#5e6ad2]/20">
          <Cpu className="h-8 w-8 text-[#6875e5] drop-shadow-[0_0_12px_rgba(94,106,210,0.8)]" />
        </div>

        {/* Section Heading */}
        <h2 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          Linear workflows.
          <br />
          <span className="text-gradient">Exponential results.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-[#8a8f98]">
          From early-stage startups to publicly traded tech companies, high-velocity teams build better products on Linear.
        </p>

        {/* 3 Value Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Zap className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Engineered for focus</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              An interface designed around ergonomics and speed, eliminating clutter so engineers stay in the zone.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Cpu className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Tailored for developers</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              First-class Git branch naming, PR linkages, Markdown support, keyboard navigation, and custom API webhooks.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <ShieldCheck className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Scales effortlessly</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Manage 10 engineers or 10,000 without performance degradation or complex configuration mazes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}