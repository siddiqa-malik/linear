"use client";

import React from "react";

export function SocialProof() {
  const logosRow1 = [
    { name: "Ramp", style: "font-bold tracking-tight text-[17px] md:text-[19px]" },
    { name: "Loom", style: "font-medium tracking-tight text-[17px] md:text-[19px]" },
    { name: "Vercel", style: "font-semibold tracking-widest uppercase text-[14px] md:text-[16px]" },
    { name: "Descript", style: "font-medium tracking-tight text-[17px] md:text-[19px]" },
    { name: "Cash App", style: "font-semibold tracking-tight text-[17px] md:text-[19px]" },
  ];

  const logosRow2 = [
    { name: "Raycast", style: "font-bold tracking-tight text-[17px] md:text-[19px]" },
    { name: "Retool", style: "font-semibold tracking-normal text-[17px] md:text-[19px]" },
    { name: "Mercury", style: "font-medium tracking-wider text-[17px] md:text-[19px]" },
    { name: "OpenSea", style: "font-semibold tracking-tight text-[17px] md:text-[19px]" },
    { name: "Brex", style: "font-bold tracking-tight text-[17px] md:text-[19px]" },
    { name: "Arc", style: "font-medium tracking-widest uppercase text-[14px] md:text-[16px]" },
  ];

  return (
    <section className="relative isolate overflow-hidden pt-16 pb-28 md:pt-20 md:pb-40 text-center">
      {/* Background Graphic fixed behind content via z-0 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full min-w-[1100px] max-w-[1500px] z-0 select-none overflow-hidden"
      >
        <img
          src="/social-proof-bg.png"
          alt="Linear Social Proof Horizon Background"
          className="w-full h-auto object-cover select-none pointer-events-none"
          loading="eager"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <p className="text-[14px] md:text-[16px] tracking-normal text-white/90 mb-8 font-normal max-w-xl mx-auto leading-relaxed">
          Powering the world’s best product teams.
          <br />
          From next-gen startups to established enterprises.
        </p>

        {/* Customer Logo Wall - Positioned directly in front of starry glow & above horizon arc */}
        <div className="mx-auto max-w-4xl space-y-3.5 md:space-y-5">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-3">
            {logosRow1.map((logo) => (
              <span
                key={logo.name}
                className={`text-[#8a8f98]/80 hover:text-white transition-colors duration-200 cursor-pointer select-none ${logo.style}`}
              >
                {logo.name}
              </span>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-3">
            {logosRow2.map((logo) => (
              <span
                key={logo.name}
                className={`text-[#8a8f98]/80 hover:text-white transition-colors duration-200 cursor-pointer select-none ${logo.style}`}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
