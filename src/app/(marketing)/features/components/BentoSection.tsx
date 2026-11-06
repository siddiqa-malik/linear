"use client";

import React from "react";

/*
 * Linear Keyboard Shortcut Pills
 * Real-world shortcuts from Linear that scroll infinitely in the marquee track
 * beneath the mechanical keyboard image.
 */
const SHORTCUT_PILLS = [
  { key: "C", action: "New issue" },
  { key: "⌘ K", action: "Command menu" },
  { key: "G then I", action: "Go to inbox" },
  { key: "Space", action: "Quick peek" },
  { key: "X", action: "Select issue" },
  { key: "S", action: "Set status" },
  { key: "P", action: "Change priority" },
  { key: "A", action: "Assign user" },
  { key: "L", action: "Add label" },
  { key: "D", action: "Set due date" },
  { key: "E", action: "Edit title" },
  { key: "⌘ ↵", action: "Save & submit" },
  { key: "Tab", action: "Next field" },
  { key: "B", action: "Toggle sidebar" },
  { key: "1-4", action: "Priority levels" },
  { key: "O", action: "Open issue" },
];

/*
 * BentoSection Component (Features Page)
 *
 * Implements the Linear "Unlike any tool you've used before" 4-card Bento grid
 * matching the canonical design from media_1791442560395.png with centered text.
 */
export function BentoSection() {
  return (
    <section id="features" className="relative py-28 md:py-36 overflow-hidden select-none">
      {/* Background deep purple ambient lighting spotlights that shine through the translucent glass cards */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.22),rgba(40,30,80,0.12)_60%,transparent_80%)] blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[950px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(110,80,220,0.18),rgba(25,18,55,0.08)_65%,transparent_85%)] blur-3xl -z-10" />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Unlike any tool
            <br />
            <span className="text-gradient">you’ve used before</span>
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-[#8a8f98]">
            Designed to the last pixel and engineered with unforgiving precision,
            Linear speeds through your workflows with zero friction.
          </p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* ============================================================== */}
          {/* CARD 1: Built for purpose (Keyboard + Moving Shortcut Capsules) */}
          {/* ============================================================== */}
          <div className="linear-bento-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 sm:p-8 md:col-span-7 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(130,120,240,0.10),transparent_70%)] before:pointer-events-none">
            {/* Top: Keyboard visual sitting directly on card surface */}
            <div className="relative pt-2 pb-1 flex items-center justify-center">
              <img
                src="/keyboard.png"
                alt="Linear Keyboard Experience"
                className="w-full max-w-[480px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Middle: Continuous Moving Shortcut Key Capsules Marquee */}
            <div className="relative w-full overflow-hidden my-3 py-1.5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="animate-bento-marquee flex items-center gap-2">
                {/* First sequence of shortcut capsules */}
                {SHORTCUT_PILLS.map((s, idx) => (
                  <div
                    key={`p1-${idx}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md shadow-sm whitespace-nowrap text-xs text-[#a0a5b8]"
                  >
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10.5px] font-mono font-semibold border border-white/10 shadow-sm">
                      {s.key}
                    </kbd>
                    <span className="text-[11.5px] text-[#c4c8db] font-normal">
                      {s.action}
                    </span>
                  </div>
                ))}
                {/* Second duplicate sequence for infinite seamless loop */}
                {SHORTCUT_PILLS.map((s, idx) => (
                  <div
                    key={`p2-${idx}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md shadow-sm whitespace-nowrap text-xs text-[#a0a5b8]"
                  >
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[10.5px] font-mono font-semibold border border-white/10 shadow-sm">
                      {s.key}
                    </kbd>
                    <span className="text-[11.5px] text-[#c4c8db] font-normal">
                      {s.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Typography (Centered) */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Built for purpose
              </h3>
              <p className="mt-1.5 text-sm text-[#8a8f98] leading-relaxed max-w-lg mx-auto">
                Linear is shaped by the practices and principles that underpin how world-class software teams operate.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 2: Breathtakingly fast (Lightning, col-span-5)            */}
          {/* ============================================================== */}
          <div className="linear-bento-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 sm:p-8 md:col-span-5 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(130,120,240,0.10),transparent_70%)] before:pointer-events-none">
            {/* Clean enlarged lightning icon */}
            <div className="relative my-4 flex items-center justify-center min-h-[220px]">
              <img
                src="/fast-icon.png"
                alt="Breathtakingly Fast Performance"
                className="w-40 sm:w-48 h-auto max-h-56 object-contain select-none pointer-events-none"
              />
            </div>

            {/* Bottom: Typography (Centered) */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Breathtakingly fast
              </h3>
              <p className="mt-1.5 text-sm text-[#8a8f98] leading-relaxed max-w-sm mx-auto">
                Built for speed with 50ms interactions and real-time sync across all clients with zero spinners.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 3: Designed for modern software teams (Arc Ring, col-5)   */}
          {/* ============================================================== */}
          <div className="linear-bento-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 sm:p-8 md:col-span-5 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(130,120,240,0.10),transparent_70%)] before:pointer-events-none">
            {/* Clean enlarged geometric arc ring icon */}
            <div className="relative my-4 flex items-center justify-center min-h-[220px]">
              <img
                src="/teams-icon.png"
                alt="Designed for Modern Software Teams"
                className="w-44 sm:w-52 h-auto max-h-52 object-contain select-none pointer-events-none"
              />
            </div>

            {/* Bottom: Typography (Centered) */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Designed for modern software teams
              </h3>
              <p className="mt-1.5 text-sm text-[#8a8f98] leading-relaxed max-w-sm mx-auto">
                Comes with built-in best practices, opinionated workflows, and no unnecessary bloat.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 4: Meet your command line (Text First, Image After)       */}
          {/* ============================================================== */}
          <div className="linear-bento-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 sm:p-8 md:col-span-7 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(130,120,240,0.10),transparent_70%)] before:pointer-events-none">
            {/* Top: Typography (Centered) */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Meet your command line
              </h3>
              <p className="mt-1.5 text-sm text-[#8a8f98] leading-relaxed max-w-lg mx-auto">
                Complete any action in seconds with the global command menu. Search, triage, and update with simple keystrokes.
              </p>
            </div>

            {/* Bottom: Image after the text with enhanced grey saturation background container */}
            <div className="relative mt-auto pt-3 flex items-center justify-center min-h-[190px]">
              <div className="w-full max-w-[460px] rounded  shadow-2xl backdrop-blur-md">
                <img
                  src="/command-icon.png"
                  alt="Global Command Menu"
                  className="w-full h-auto object-contain select-none pointer-events-none ]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
