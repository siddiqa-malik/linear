"use client";

import React from "react";
import { BarChart3, Database, TrendingUp } from "lucide-react";

export function AnalyzeSection() {
  return (
    <section className="relative py-24 md:py-32 border-t border-white/[0.06]">
      {/* Blue Accent Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/3 top-24 w-96 h-96 rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#38bdf8]">
            Analyze
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8a8f98] leading-relaxed">
            Gain deep insight into your team's velocity and throughput. Identify trends,
            eliminate bottlenecks, and make data-driven decisions without endless spreadsheets.
          </p>
        </div>

        {/* 3 Cards 1-Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cycle analytics */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#3b82f6]/40 transition-all duration-300">
            {/* Visual Graphic: Bar Chart */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-end shadow-inner">
              <div className="flex items-end justify-between gap-1.5 h-28 pt-4">
                {[30, 45, 60, 35, 75, 55, 90, 80, 95].map((h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        idx >= 6
                          ? "bg-gradient-to-t from-[#2563eb] to-[#60a5fa] shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                          : "bg-white/10"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[#62666d] pt-2 border-t border-white/[0.04]">
                <span>Cycle 1</span>
                <span>Cycle 9 (Current)</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <BarChart3 className="h-4 w-4 text-[#3b82f6]" />
                <h3>Cycle analytics</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Monitor velocity variance, issue completion rates, and scope changes cycle over cycle.
              </p>
            </div>
          </div>

          {/* Card 2: Progress trends */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#3b82f6]/40 transition-all duration-300">
            {/* Visual Graphic: S-Curve Chart */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-4 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between text-[11px] text-[#8a8f98]">
                <span>Project S-Curve</span>
                <span className="text-[#60a5fa] font-mono">Ahead of schedule</span>
              </div>
              <div className="relative h-20 w-full">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 70">
                  <path
                    d="M 10 60 Q 90 55, 140 30 T 230 10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  />
                  <path
                    d="M 10 60 Q 120 40, 230 25"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                  <circle cx="230" cy="10" r="4.5" fill="#60a5fa" className="shadow-[0_0_10px_#60a5fa]" />
                </svg>
              </div>
              <div className="text-[10px] text-[#62666d]">Forecasted completion: Oct 28</div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <TrendingUp className="h-4 w-4 text-[#3b82f6]" />
                <h3>Progress trends</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Forecast project delivery dates using historical throughput and team capacity modeling.
              </p>
            </div>
          </div>

          {/* Card 3: Export & API */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#3b82f6]/40 transition-all duration-300">
            {/* Visual Graphic: Circular Technology Badges */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#121526] border border-white/10 flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-md">
                  <span className="text-[#60a5fa]">GraphQL</span>
                  <span className="text-[8px] text-[#8a8f98] font-mono">API</span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-[#121526] border border-[#3b82f6]/50 flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                  <span className="text-[#38bdf8]">Webhooks</span>
                  <span className="text-[8px] text-[#8a8f98] font-mono">Live</span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-[#121526] border border-white/10 flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-md">
                  <span className="text-white/90">CSV</span>
                  <span className="text-[8px] text-[#8a8f98] font-mono">Export</span>
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Database className="h-4 w-4 text-[#3b82f6]" />
                <h3>Export & API</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Sync data to your warehouse, build custom bots, or ingest into BI tools seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
