"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export function LinearEnterpriseCard() {
  const enterpriseBadges = [
    "     ",
    "99.99% uptime and 24/7 support",
    "SCIM",
    "Dedicated Slack channel",
    "Enterprise-grade security",
    "Annual billing",
    "",

  ];

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 flex justify-center items-center overflow-visible">
      <div className="relative w-full max-w-[994px] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-center">
        {/* Full Graphic Asset Background - Visible in its entirety without any outer card clipping or borders */}
        <img
          src="/linearEnterprice-bg.png"
          alt="Linear Enterprise Background"
          className="absolute inset-0 w-full h-lg object-fill sm:object-contain pointer-events-none select-none drop-shadow-[0_10px_50px_rgba(120,119,198,0.2)]"
        />

        {/* Content positioned cleanly inside the central glass card area of the artwork */}
        <div className="relative z-10 w-full max-w-[780px] mr-auto pt-30 lg:mr-24 px-6 sm:px-12 py-10 flex flex-col justify-between gap-6">
          {/* Top Row: Heading & Contact Sales Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="text-white">Linear </span>
                <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
                  Enterprise
                </span>
              </h2>

              <p className="text-[13px] sm:text-[14px] text-[#8a8f98] leading-relaxed mt-2.5 max-w-sm sm:max-w-md">
                Built for enterprises who want to scale with confidence, Linear Enterprise offers advanced security, powerful admin controls, and more.
              </p>
            </div>

            {/* Contact Sales Button */}
            <div className="flex-shrink-0">
              <button className="px-5 py-2.5 rounded-full bg-[#5e6ad2] hover:bg-[#6e7bf0] text-white text-[13px] font-medium transition-all shadow-[0_4px_25px_rgba(94,106,210,0.5)] flex items-center gap-2 cursor-pointer">
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>Contact Sales</span>
              </button>
            </div>
          </div>

          {/* Bottom Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {enterpriseBadges.map((badge, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-white bg-white/[0.06] border border-white/[0.08] px-3 py-1 rounded-full backdrop-blur-md"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
