"use client";

import React from "react";

export function CustomersHero() {
  return (
    <section className="relative isolate overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16 text-center">
      {/* Deep Space Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle, #4f46e5 0%, #2563eb 40%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#5e6ad2]/30 bg-[#5e6ad2]/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#818cf8] backdrop-blur-md mb-6">
          <span>THE LINEAR TEAM</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
          Meet our customers
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-base font-normal leading-relaxed text-[#8a8f98] sm:text-lg">
          Linear powers the world’s most high-impact product teams.
          <br className="hidden sm:inline" />
          From next-gen startups who reach for the stars to established greats who change the world.
        </p>
      </div>

      {/* Luminous Curved Horizon Line Arc */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6">
        <div className="relative h-1 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5e6ad2]/50 to-transparent blur-[1px]" />
        </div>
      </div>
    </section>
  );
}
