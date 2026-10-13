"use client";

import React from "react";

export function FeaturedCustomersGrid() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cash App */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background S-Wave Abstract Curves */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <path
                d="M 60 40 Q 180 80, 160 140 T 260 240"
                stroke="#4338ca"
                strokeWidth="48"
                strokeLinecap="round"
                className="blur-sm"
              />
              <path
                d="M 60 40 Q 180 80, 160 140 T 260 240"
                stroke="#6366f1"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 120 20 Q 220 90, 180 180 T 290 260"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="h-7 w-7 rounded-lg bg-[#00D632] flex items-center justify-center text-black font-bold text-sm shadow-md">
                $
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Cash App
              </span>
            </div>
          </div>

          {/* Card 2: Vercel */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Delta Geometry */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <polygon
                points="160,30 290,250 30,250"
                stroke="#4f46e5"
                strokeWidth="24"
                strokeLinejoin="round"
                className="blur-sm"
              />
              <polygon
                points="160,30 290,250 30,250"
                stroke="#818cf8"
                strokeWidth="6"
                strokeLinejoin="round"
                opacity="0.7"
              />
              <polygon
                points="160,70 260,230 60,230"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinejoin="round"
                opacity="0.3"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <svg className="h-5 w-5 text-white fill-current" viewBox="0 0 24 24">
                <polygon points="12,3 22,21 2,21" />
              </svg>
              <span className="text-white font-semibold text-lg tracking-wider uppercase">
                Vercel
              </span>
            </div>
          </div>

          {/* Card 3: Ramp */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Curved Acceleration Streaks */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <path
                d="M 20 260 C 140 250, 240 180, 300 40"
                stroke="#4338ca"
                strokeWidth="42"
                strokeLinecap="round"
                className="blur-sm"
              />
              <path
                d="M 20 260 C 140 250, 240 180, 300 40"
                stroke="#6366f1"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 60 280 C 180 260, 260 190, 310 80"
                stroke="#2dd4bf"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-2xl tracking-tighter">
                ramp
              </span>
              <div className="h-4 w-4 bg-[#22c55e] rounded-sm rotate-45 transform origin-center" />
            </div>
          </div>

          {/* Card 4: Retool */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Modular Block Layers */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <rect
                x="30"
                y="50"
                width="160"
                height="100"
                rx="18"
                stroke="#4f46e5"
                strokeWidth="14"
                className="blur-sm"
              />
              <rect
                x="110"
                y="110"
                width="170"
                height="120"
                rx="20"
                stroke="#818cf8"
                strokeWidth="8"
                opacity="0.7"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="flex gap-1">
                <div className="h-4 w-2 bg-[#6366f1] rounded-sm" />
                <div className="h-4 w-2 bg-white rounded-sm" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Retool
              </span>
            </div>
          </div>

          {/* Card 5: Loom */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Orbital Spherical / Flower Arc Lines */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-35 group-hover:opacity-55 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <circle
                cx="160"
                cy="140"
                r="90"
                stroke="#4338ca"
                strokeWidth="20"
                className="blur-sm"
              />
              <circle
                cx="160"
                cy="140"
                r="90"
                stroke="#818cf8"
                strokeWidth="6"
                strokeDasharray="16 16"
                opacity="0.8"
              />
              <circle
                cx="160"
                cy="140"
                r="60"
                stroke="#c084fc"
                strokeWidth="3"
                opacity="0.5"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="relative h-6 w-6 flex items-center justify-center">
                <div className="absolute h-5 w-5 rounded-full border-2 border-[#625df5]" />
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                loom
              </span>
            </div>
          </div>

          {/* Card 6: Descript */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Soundwave Ribbon Curves */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-35 group-hover:opacity-55 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <path
                d="M 30 180 Q 160 120, 290 220"
                stroke="#4338ca"
                strokeWidth="36"
                strokeLinecap="round"
                className="blur-sm"
              />
              <path
                d="M 30 120 Q 160 60, 290 140"
                stroke="#6366f1"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="h-5 w-4 rounded-sm border-2 border-white flex flex-col justify-center items-center gap-0.5">
                <div className="w-2 h-0.5 bg-white" />
                <div className="w-2 h-0.5 bg-white" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                descript
              </span>
            </div>
          </div>

          {/* Card 7: Arc */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Architectural 'A' Curve */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-35 group-hover:opacity-55 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <path
                d="M 50 260 Q 160 20, 270 260"
                stroke="#4338ca"
                strokeWidth="38"
                strokeLinecap="round"
                className="blur-sm"
              />
              <path
                d="M 50 260 Q 160 20, 270 260"
                stroke="#818cf8"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="h-6 w-6 rounded-full border border-white/50 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-widest uppercase">
                ARC
              </span>
            </div>
          </div>

          {/* Card 8: Alan */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Mascot Avatar Arc */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-35 group-hover:opacity-55 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <circle
                cx="160"
                cy="190"
                r="110"
                stroke="#4338ca"
                strokeWidth="30"
                className="blur-sm"
              />
              <circle
                cx="160"
                cy="190"
                r="110"
                stroke="#6366f1"
                strokeWidth="8"
                opacity="0.7"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-white" />
                <div className="h-3 w-3 rounded-full bg-[#818cf8]" />
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                alan
              </span>
            </div>
          </div>

          {/* Card 9: Watershed */}
          <div className="group relative h-72 md:h-80 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] transition-all duration-300 hover:border-[#5e6ad2]/50 hover:shadow-[0_0_40px_rgba(94,106,210,0.25)] flex items-center justify-center">
            {/* Background Infinity Hourglass Overlap */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-35 group-hover:opacity-55 transition-opacity"
              viewBox="0 0 320 280"
              fill="none"
            >
              <line
                x1="40"
                y1="40"
                x2="280"
                y2="240"
                stroke="#4338ca"
                strokeWidth="32"
                strokeLinecap="round"
                className="blur-sm"
              />
              <line
                x1="280"
                y1="40"
                x2="40"
                y2="240"
                stroke="#6366f1"
                strokeWidth="32"
                strokeLinecap="round"
                className="blur-sm"
              />
              <line
                x1="40"
                y1="40"
                x2="280"
                y2="240"
                stroke="#818cf8"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.8"
              />
              <line
                x1="280"
                y1="40"
                x2="40"
                y2="240"
                stroke="#818cf8"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>

            {/* Center Logo & Wordmark */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                W
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Watershed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
