"use client";

import React from "react";

export function KeyboardHero() {
  // 5 rows of 10 keys with varied glowing neon icons and shapes matching the Linear Method matrix
  const row1 = [
    { color: "#a3e635", shape: "circle" },
    { color: "#38bdf8", shape: "square" },
    { color: "#f43f5e", shape: "triangle" },
    { color: "#fbbf24", shape: "diamond" },
    { color: "#a855f7", shape: "ring" },
    { color: "#34d399", shape: "cross" },
    { color: "#f472b6", shape: "circle" },
    { color: "#60a5fa", shape: "square" },
    { color: "#f59e0b", shape: "ring" },
    { color: "#818cf8", shape: "diamond" },
  ];

  const row2 = [
    { color: "#38bdf8", shape: "diamond" },
    { color: "#4ade80", shape: "ring" },
    { color: "#fb7185", shape: "circle" },
    { color: "#818cf8", shape: "square" },
    { color: "#facc15", shape: "triangle" },
    { color: "#c084fc", shape: "diamond" },
    { color: "#2dd4bf", shape: "ring" },
    { color: "#f87171", shape: "square" },
    { color: "#a78bfa", shape: "circle" },
    { color: "#fbbf24", shape: "cross" },
  ];

  const row3 = [
    { color: "#f43f5e", shape: "square" },
    { color: "#fbbf24", shape: "cross" },
    { color: "#22d3ee", shape: "circle" },
    { color: "#a855f7", shape: "ring" },
    { color: "#4ade80", shape: "diamond", isCenter: true },
    { color: "#f472b6", shape: "triangle", isCenter: true },
    { color: "#38bdf8", shape: "square" },
    { color: "#f59e0b", shape: "circle" },
    { color: "#34d399", shape: "diamond" },
    { color: "#ec4899", shape: "ring" },
  ];

  const row4 = [
    { color: "#818cf8", shape: "ring" },
    { color: "#ec4899", shape: "diamond" },
    { color: "#a3e635", shape: "square" },
    { color: "#38bdf8", shape: "circle" },
    { color: "#f43f5e", shape: "ring" },
    { color: "#fbbf24", shape: "square" },
    { color: "#4ade80", shape: "triangle" },
    { color: "#c084fc", shape: "circle" },
    { color: "#f472b6", shape: "diamond" },
    { color: "#22d3ee", shape: "cross" },
  ];

  const row5 = [
    { color: "#fbbf24", shape: "circle" },
    { color: "#a855f7", shape: "square" },
    { color: "#22d3ee", shape: "diamond" },
    { color: "#f472b6", shape: "ring" },
    { color: "#a3e635", shape: "cross" },
    { color: "#38bdf8", shape: "circle" },
    { color: "#f43f5e", shape: "diamond" },
    { color: "#4ade80", shape: "square" },
    { color: "#818cf8", shape: "ring" },
    { color: "#facc15", shape: "triangle" },
  ];

  const renderShape = (shape: string, color: string) => {
    switch (shape) {
      case "circle":
        return <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />;
      case "square":
        return <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />;
      case "diamond":
        return <div className="h-2.5 w-2.5 rotate-45 rounded-[1px]" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />;
      case "ring":
        return <div className="h-3 w-3 rounded-full border-2" style={{ borderColor: color, boxShadow: `0 0 8px ${color}` }} />;
      case "triangle":
        return (
          <div
            className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[9px]"
            style={{ borderBottomColor: color, filter: `drop-shadow(0 0 5px ${color})` }}
          />
        );
      case "cross":
        return (
          <div className="relative h-3 w-3 flex items-center justify-center">
            <div className="absolute h-3 w-1 rounded" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
            <div className="absolute h-1 w-3 rounded" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
          </div>
        );
      default:
        return <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
    }
  };

  return (
    <section className="relative isolate overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32 text-center">
      {/* Ambient Top Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[130px] -z-10 opacity-40"
        style={{
          background: "radial-gradient(circle, #5e6ad2 0%, rgba(94, 106, 210, 0.3) 50%, transparent 80%)",
        }}
      />

      {/* Floating Keyboard Matrix */}
      <div className="mx-auto max-w-4xl px-4 select-none">
        <div className="relative inline-flex flex-col gap-2.5 md:gap-3 p-4 md:p-6 rounded-3xl bg-[#090a12]/80 border border-white/[0.06] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
          {/* Centered Focus Key Halo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-60"
            style={{
              background: "radial-gradient(circle, #5e6ad2 0%, #a855f7 60%, transparent 80%)",
            }}
          />

          {[row1, row2, row3, row4, row5].map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-2 md:gap-3">
              {row.map((k, cIdx) => (
                <div
                  key={cIdx}
                  className={`relative flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl transition-all duration-300 ${
                    rIdx === 2 && (cIdx === 4 || cIdx === 5)
                      ? "bg-[#16182c] border border-[#5e6ad2]/70 shadow-[0_0_18px_rgba(94,106,210,0.6)] scale-105 z-10"
                      : "bg-[#0d0f1a] border border-white/[0.08] hover:border-white/20 hover:scale-105 shadow-md shadow-black/60"
                  }`}
                >
                  {renderShape(k.shape, k.color)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Typography */}
      <div className="mx-auto mt-16 max-w-3xl px-6 text-center">
        {/* Method Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#5e6ad2]/30 bg-[#5e6ad2]/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#818cf8] backdrop-blur-md mb-6 shadow-sm">
          <span>THE LINEAR METHOD</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          The new standard for modern
          <br />
          software development
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-base font-normal leading-relaxed text-[#8a8f98] sm:text-lg">
          Linear is a purpose-built tool for modern software teams to streamline issues,
          projects, and product roadmaps. Here’s how to build products with the Linear Method.
        </p>
      </div>
    </section>
  );
}
