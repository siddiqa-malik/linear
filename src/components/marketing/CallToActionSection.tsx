"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function CallToActionSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] py-32 bg-[#08090a] text-center">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-t from-[#5e6ad2]/20 via-[#5e6ad2]/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6">
        {/* Floating Glowing Crystal Badge */}
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#12141d] shadow-2xl shadow-[#5e6ad2]/40">
          <Sparkles className="h-7 w-7 text-[#727ef5] drop-shadow-[0_0_12px_rgba(94,106,210,0.9)]" />
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-4xl font-semibold tracking-[-0.035em] text-white sm:text-6xl">
          Built for the future.
          <br />
          <span className="text-gradient">Available today.</span>
        </h2>

        {/* Dual CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="linear-button-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-xl shadow-[#5e6ad2]/30"
          >
            <span>Sign up for free</span>
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
    </section>
  );
}