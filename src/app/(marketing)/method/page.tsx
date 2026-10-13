"use client";

import React from "react";
import {
  KeyboardHero,
  PlanSection,
  ProgressSection,
  CollaborateSection,
  AnalyzeSection,
  LevelUpSection,
  SecureSection,
} from "./components";

export default function MethodPage() {
  return (
    <main className="w-full bg-[#080915] text-[#f3f4f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Keyboard Matrix Hero with "THE LINEAR METHOD" badge & headline */}
      <KeyboardHero />

      {/* 2. Plan (Neon Lime/Yellow) - 6 Cards */}
      <PlanSection />

      {/* 3. Progress (Neon Pink/Red) - 6 Cards */}
      <ProgressSection />

      {/* 4. Collaborate (Neon Teal/Cyan) - 6 Cards */}
      <CollaborateSection />

      {/* 5. Analyze (Neon Electric Blue) - 3 Cards */}
      <AnalyzeSection />

      {/* 6. Level up (Neon Amber/Orange) - 6 Cards */}
      <LevelUpSection />

      {/* 7. Secure (Neon Purple) - 3 Cards */}
      <SecureSection />
    </main>
  );
}
