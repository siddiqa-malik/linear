"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function IntegrationCTA() {
  return (
    <section className="relative py-28 md:py-44 text-center border-t border-white/[0.06] overflow-hidden bg-[#050506] flex items-center justify-center">
      {/* Large Glowing Disc Background Graphic Encompassing the Content */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0">
        <img
          src="/integration-callToAction-bg.png"
          alt="Build your own integration background"
          className="w-[780px] sm:w-[940px] md:w-[1100px] max-w-none h-auto object-contain select-none opacity-95 "
          loading="lazy"
        />
      </div>

      {/* Foreground Content Layered Directly Over the Center of the Graphic */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 pt-16 sm:pt-20 md:pt-24">
        {/* Big Bold Headline */}


        {/* Subtitle */}
        <p className="mx-auto mt-4 sm:mt-5 max-w-lg text-sm sm:text-base text-[#c7d2fe]/90 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
          Use our GraphQL API and webhooks to connect Linear to your internal tools,
          automate workflows, or build public apps for thousands of teams.
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/docs"
            onClick={(e) => {
              e.preventDefault();
              alert("Navigating to Linear GraphQL API documentation");
            }}
            className="linear-button-primary inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-medium text-white shadow-2xl shadow-[#5e6ad2]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Read API documentation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
