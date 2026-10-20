"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GlowEffect } from "@/components/ui/GlowEffect";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36 bg-[#080915]">
      {/* 1. Primary Top Center Linear Aurora & Spotlight Beam */}


      {/* 2. Left Atmospheric Flanking Glow Orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 w-[520px] h-[520px] rounded-full blur-[110px] z-0 opacity-60"

      />

      {/* 3. Right Atmospheric Flanking Glow Orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-28 w-[520px] h-[520px] rounded-full blur-[110px] z-0 opacity-60"

      />

      <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#455EB5]/50 bg-[#455EB5]/15 px-3.5 py-1 text-xs font-medium text-[#c0caf5] backdrop-blur-md transition hover:border-[#455EB5]/80 hover:text-white cursor-pointer shadow-lg shadow-[#455EB5]/25">
          <span className="flex h-2 w-2 rounded-full bg-[#5e6ad2] shadow-[0_0_8px_#5e6ad2]" />
          <span className="text-white/90">Linear 2022 Release</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#8a8f98]" />
        </div>

        {/* Hero Title */}
        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
          Linear is a better way
          <br />
          to build products
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-base font-normal leading-relaxed text-[#a4aecd] sm:text-lg">
          Meet the new standard for modern software development.
          <br className="hidden sm:inline" />
          Streamline issues, sprints, and product roadmaps.
        </p
        >

        {/* Call to Action Button */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="linear-button-primary group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-xl shadow-[#455EB5]/50 hover:shadow-[#455EB5]/70 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get started</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Real Linear Hero Window Screen Image with Multi-Layer Glow */}
        <div className="relative isolate mt-16 md:mt-20">
          {/* Layer A: Massive 1200px Wide Ambient Backplate Halo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-14 rounded-3xl blur-[90px] z-0 opacity-80"

          />

          {/* Layer B: Centered High-Power Spotlight */}
          <GlowEffect
            color="#4547b5ff"
            variant="spotlight"
            size="7xl"
            blur="xl"
            opacity={0.75}
            className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          {/* Layer C: Luminous Floor Reflection Under Window */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] h-[160px] rounded-full blur-[65px] z-0 opacity-75"

          />

          {/* Window Shell Frame with Illuminated Borders and Deep Ambient Rim */}
          <div className="relative z-10 mx-auto max-w-5xl overflow-hidden ">
            <img
              src="/hero image.png"
              alt="Linear Workspace Window"
              className="w-full h-auto object-cover rounded-xl select-none"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
