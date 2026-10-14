"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function CareersHero() {
  const customerLogos = [
    { name: "Ramp", symbol: "RAMP" },
    { name: "Vercel", symbol: "▲ Vercel" },
    { name: "Cash App", symbol: "$ Cash App" },
    { name: "Retool", symbol: "Retool" },
    { name: "Loom", symbol: "loom" },
    { name: "Raycast", symbol: "Raycast" },
  ];

  const scrollToPositions = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("positions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative isolate overflow-hidden pt-24 sm:pt-28 pb-20 text-center">
      {/* Background Graphic Asset: careers-hero-bg.png (Immersive large portal graphic) */}
      <div className="pointer-events-none absolute top-2 sm:top-4 md:top-[-6px] lg:top-[-175px] left-1/2 -translate-x-1/2 w-[850px] sm:w-[1050px] md:w-[1250px] lg:w-[1380px] aspect-square -z-10 select-none flex justify-center">
        <img
          src="/careers-hero-bg.png"
          alt="Careers Hero Background"
          className="w-full h-full object-contain opacity-95"
          loading="eager"
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        {/* Careers Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#5e6ad2]/40 bg-[#5e6ad2]/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#818cf8] backdrop-blur-md mb-6 shadow-sm">
          <span>Careers</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] max-w-3xl mx-auto">
          We are bringing <br />magic back to<br /> software
        </h1>

        {/* Open Positions Pill Button */}
        <div className="mt-8">
          <a
            href="#positions"
            onClick={scrollToPositions}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-[13px] font-medium text-white bg-[#5e6ad2] hover:bg-[#6e7bf0] shadow-[0_2px_16px_rgba(94,106,210,0.4)] transition-all cursor-pointer"
          >
            <span>Open positions</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Spacer for portal graphic in center */}
        <div className="h-72 sm:h-96 md:h-[460px] lg:h-[500px]" />

        {/* Manifesto Copy */}
        <div className="max-w-2xl mx-auto text-left space-y-5 text-[15px] sm:text-[16px] leading-relaxed text-[#8a8f98] pt-12">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Software should be magical.
            <br />
            <span className="text-[#8a8f98]">We’ve lost our spark.</span>
          </h2>

          <p>
            For most of us, software has lost its sense of craft. What used to be a tool for creation has become bloated, slow, and uninspiring. Teams spend more time updating status trackers than shipping code.
          </p>

          <p>
            Linear exists because we believe software should feel magical again. We’re building tools that creators love to use, designed with unforgiving precision, speed, and taste.
          </p>

          <p className="text-white font-medium">
            Now we’re looking for exceptional people to join us on this mission.
          </p>

          <p>
            We are an intentional company of makers, designers, and engineers distributed worldwide. We value agency, high standards, and a deep commitment to craftsmanship.
          </p>

          <div className="pt-4 border-t border-white/[0.08]">
            <p className="text-sm font-medium text-white">
              Karri Saarinen, Tuomas Artman, Jori Lallo
            </p>
            <p className="text-xs text-[#8a8f98]">Founders of Linear</p>
          </div>
        </div>

        {/* Customer Logo Proof Bar */}
        <div className="mt-24 pt-12 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-mono text-[#5a5f6b] uppercase tracking-wider select-none">
          {customerLogos.map((c) => (
            <span key={c.name} className="hover:text-[#8a8f98] transition-colors">
              {c.symbol}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
