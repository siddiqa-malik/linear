"use client";

import React from "react";
import { Check } from "lucide-react";

export function PerksSection() {
  const leftPerks = [
    "Competitive salary and meaningful equity",
    "Remote-first culture with flexible work hours",
    "Home office stipend ($2,000 to set up your workspace)",
    "Latest M-series MacBook Pro and top-tier hardware",
    "Unlimited paid time off (minimum 4 weeks recommended)",
    "Annual company retreats in world-class destinations",
  ];

  const rightPerks = [
    "Comprehensive health, dental, and vision insurance",
    "Generous parental leave (16 weeks paid)",
    "Wellness and fitness monthly stipend ($150/mo)",
    "Learning and conference budget ($2,000/yr)",
    "401(k) retirement plan with company contribution",
    "Co-working desk membership covered anywhere",
  ];

  return (
    <section className="py-24 md:py-32 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
          Perks & benefits
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          <ul className="space-y-4">
            {leftPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 flex items-center justify-center text-[#818cf8] flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm sm:text-[15px] text-[#c0c4d0] leading-relaxed">
                  {perk}
                </span>
              </li>
            ))}
          </ul>

          <ul className="space-y-4">
            {rightPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 flex items-center justify-center text-[#818cf8] flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm sm:text-[15px] text-[#c0c4d0] leading-relaxed">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
