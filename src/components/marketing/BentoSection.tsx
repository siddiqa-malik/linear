"use client";

import { Command, Search, Sparkles } from "lucide-react";

export function BentoSection() {
  return (
    <section id="features" className="relative py-28 md:py-36">
      {/* Background radial spotlight */}
      <div className="pointer-events-none absolute inset-0 linear-ambient-spotlight -z-10" />

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
          {/* Card 1: Keyboard First (Wide, col-span-7) */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 md:col-span-7">
            <div>
              {/* Keyboard Visual */}
              <div className="relative mx-auto my-6 flex max-w-md flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#0c0d12] p-4 shadow-xl">
                <div className="flex justify-center gap-1.5">
                  {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((k) => (
                    <div
                      key={k}
                      className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-[#14151b] text-xs font-medium text-white/70 shadow-sm"
                    >
                      {k}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5">
                  {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((k) => (
                    <div
                      key={k}
                      className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-medium shadow-sm transition ${
                        k === "K"
                          ? "border-[#5e6ad2] bg-[#5e6ad2]/20 text-white font-bold shadow-[0_0_12px_rgba(94,106,210,0.5)]"
                          : "border-white/10 bg-[#14151b] text-white/70"
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5">
                  {["Z", "X", "C", "V", "B", "N", "M"].map((k) => (
                    <div
                      key={k}
                      className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-medium shadow-sm transition ${
                        k === "C"
                          ? "border-[#5e6ad2] bg-[#5e6ad2]/20 text-white font-bold shadow-[0_0_12px_rgba(94,106,210,0.5)]"
                          : "border-white/10 bg-[#14151b] text-white/70"
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>
                {/* Spacebar & Command */}
                <div className="flex justify-center gap-2 pt-1">
                  <div className="flex h-8 items-center rounded border border-[#5e6ad2] bg-[#5e6ad2]/20 px-3 text-xs font-bold text-white shadow-[0_0_12px_rgba(94,106,210,0.5)]">
                    ⌘ CMD
                  </div>
                  <div className="h-8 w-44 rounded border border-white/10 bg-[#14151b]" />
                  <div className="flex h-8 items-center rounded border border-white/10 bg-[#14151b] px-3 text-xs text-white/70">
                    ↵ Return
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Built for speed</h3>
              <p className="mt-1 text-sm text-[#8a8f98]">
                Keyboard shortcuts for every single action so you never leave the flow. Press <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 text-xs text-white">C</kbd> to create, <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 text-xs text-white">⌘K</kbd> to search.
              </p>
            </div>
          </div>

          {/* Card 2: Lightning Performance (col-span-5) */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 md:col-span-5">
            <div className="flex h-48 items-center justify-center">
              {/* Electric Neon Lightning Bolt */}
              <div className="relative flex items-center justify-center">
                <div className="absolute h-32 w-32 rounded-full bg-[#5e6ad2]/20 blur-xl transition group-hover:bg-[#5e6ad2]/35" />
                <svg
                  className="relative h-28 w-28 text-[#6875e5] drop-shadow-[0_0_18px_rgba(94,106,210,0.8)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Instant sync & offline-first</h3>
              <p className="mt-1 text-sm text-[#8a8f98]">
                Changes sync across all clients in real-time with zero loading spinners and sub-50ms latency.
              </p>
            </div>
          </div>

          {/* Card 3: Linear Method (col-span-5) */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 md:col-span-5">
            <div className="flex h-44 items-center justify-center">
              {/* Geometric Orbital Arc Rings */}
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="absolute h-32 w-32 rounded-full border border-dashed border-white/15" />
                <div className="absolute h-24 w-24 rounded-full border border-[#5e6ad2]/40" />
                <div className="absolute h-16 w-16 rounded-full border border-white/20" />
                <div className="h-4 w-4 rounded-full bg-[#5e6ad2] shadow-[0_0_14px_rgba(94,106,210,1)]" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">The Linear Method</h3>
              <p className="mt-1 text-sm text-[#8a8f98]">
                Opinionated workflows built from the real-world practices of top tech teams. Streamlined, low-ceremony.
              </p>
            </div>
          </div>

          {/* Card 4: Command Menu (col-span-7) */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 md:col-span-7">
            <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-[#0c0d12] p-3 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 text-xs text-[#8a8f98]">
                <Search className="h-3.5 w-3.5 text-[#62666d]" />
                <span className="text-white/80">Type a command or search...</span>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex items-center justify-between rounded bg-[#5e6ad2]/20 px-2.5 py-1.5 text-white">
                  <span>Create new issue</span>
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 text-[10px]">C</kbd>
                </div>
                <div className="flex items-center justify-between rounded px-2.5 py-1.5 text-[#8a8f98] hover:bg-white/[0.04] hover:text-white">
                  <span>Change task status to In Progress</span>
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 text-[10px]">S</kbd>
                </div>
                <div className="flex items-center justify-between rounded px-2.5 py-1.5 text-[#8a8f98] hover:bg-white/[0.04] hover:text-white">
                  <span>Assign to Alex Saddi</span>
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 text-[10px]">A</kbd>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Command line at your fingertips</h3>
              <p className="mt-1 text-sm text-[#8a8f98]">
                Search across projects, change statuses, assign members, and triage tasks in a split second.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}