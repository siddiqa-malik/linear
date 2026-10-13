"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CustomersCTA() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-6">
        {/* Large Luminous Nebula Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090b16] py-20 px-8 text-center shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)]">
          {/* Central Blue Nebula Orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[100px] opacity-70 select-none -z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, #4338ca 0%, #2563eb 40%, rgba(94, 106, 210, 0.2) 70%, transparent 85%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            {/* Bold Atmospheric Headline */}
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-white leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              You belong
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c7d2fe] to-[#93c5fd]">
                among the stars
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-base text-[#c7d2fe]/80 max-w-md mx-auto">
              Join thousands of engineering teams building the future with Linear.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="linear-button-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-xl shadow-[#4338ca]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Join our customers</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="linear-button-secondary rounded-full px-6 py-3 text-sm font-medium"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
