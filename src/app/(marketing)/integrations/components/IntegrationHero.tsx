"use client";

import React from "react";

export function IntegrationHero() {
  return (
    <section className="relative isolate overflow-hidden pt-10 pb-16 md:pt-16 md:pb-28 text-center bg-[#050506]">
      {/* Hero Panoramic Graphic Asset - Scaled up to match screenshot */}
      <div className="mx-auto max-w-9xl px-4 mb-10 relative z-10 flex justify-center">
        <img
          src="/integration-hero-bg.png"
          alt="Linear Integrations Orbit Halo"
          className="w-full max-w-[850px] md:max-w-[1050px] lg:max-w-[1800px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_10px_50px_rgba(0,0,0,0.95)]"
          loading="eager"
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#818cf8] backdrop-blur-md mb-6 shadow-sm">
          <span>INTEGRATIONS</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          Dozens of apps.
          <br />
          Endless possibilities.
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-base font-normal leading-relaxed text-[#8a8f98] sm:text-lg">
          Connect Linear to your existing tools and automate workflows across engineering,
          customer support, and design.
        </p>
      </div>
    </section>
  );
}
