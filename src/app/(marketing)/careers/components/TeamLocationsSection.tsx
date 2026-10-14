"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TeamLocationsSection() {
  const [isPaused, setIsPaused] = useState(false);

  const teamImages = [
    { src: "/img-1.png", alt: "Linear team retreat at the coast" },
    { src: "/img-2.png", alt: "Team dinner and celebration" },
    { src: "/img-3.png", alt: "Collaborative design session" },
    { src: "/img-4.png", alt: "Linear team gathering outdoors" },
    { src: "/img-5.png", alt: "Workstations and team collaboration" },
  ];

  // Duplicate for seamless infinite loop
  const displayImages = [...teamImages, ...teamImages, ...teamImages];

  return (
    <section className="py-24 md:py-32 border-t border-white/[0.06] overflow-hidden relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Typographic Headline matching screenshot */}
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.1]">
            <span className="text-white/40 block">Designed in</span>
            <span className="text-white/60 block">California. And</span>
            <span className="text-white/70 block">Buenos Aires.</span>
            <span className="text-white/80 block">And New York.</span>
            <span className="text-white block">And Paris.</span>
          </h2>

          <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#8a8f98] max-w-xl">
            We are a remote-first team spread across the Americas and Europe. We work together asynchronously, meet in person for annual team retreats, and collaborate with high autonomy.
          </p>

          <div className="mt-4">
            <Link
              href="/customers"
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#818cf8] hover:text-[#9fa8ff] transition-colors"
            >
              <span>Learn more about our culture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Infinite Image Slider */}
      <div
        className="mt-16 relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050506] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050506] to-transparent z-10" />

        {/* Marquee Track */}
        <div
          className="flex gap-5 w-max"
          style={{
            animation: "linear-marquee 35s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {displayImages.map((img, idx) => (
            <div
              key={`${img.src}-${idx}`}
              className="relative w-[300px] sm:w-[380px] md:w-[440px] aspect-[16/10] flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d14] shadow-xl group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation Keyframes for Continuous Auto-Scroll */}
      <style jsx global>{`
        @keyframes linear-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
      `}</style>
    </section>
  );
}
