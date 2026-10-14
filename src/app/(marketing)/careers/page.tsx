"use client";

import React from "react";
import {
  CareersHero,
  ValuesSection,
  TeamLocationsSection,
  InvestorsSection,
  PerksSection,
  OpenPositionsSection,
} from "./components";

export default function CareersPage() {
  return (
    <main className="w-full min-h-screen bg-[#050506] text-[#f7f8f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Hero with careers-hero-bg.png portal graphic and manifesto */}
      <CareersHero />

      {/* 2. Values: Join a team of makers (6 cards) */}
      <ValuesSection />

      {/* 3. Designed in California... with Infinite Auto-scrolling Slider of img-1 to img-5 */}
      <TeamLocationsSection />

      {/* 4. Built for the best. Backed by the best. (Investors) */}
      <InvestorsSection />

      {/* 5. Perks & benefits (2-column checklist) */}
      <PerksSection />

      {/* 6. Open positions with career-footer-bg.png background graphic */}
      <OpenPositionsSection />
    </main>
  );
}
