"use client";

import React from "react";
import { Sprout } from "lucide-react";

export function StripeClimateBanner() {
  return (
    <div className="pt-8 pb-24 px-6 flex justify-center w-full">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d0f1c] border border-white/[0.08] text-[12px] sm:text-[13px] text-[#8a8f98] shadow-lg backdrop-blur-md flex-wrap justify-center text-center">
        <span className="text-[#10b981] flex items-center">
          🌱
        </span>
        <span>Linear contributes 1% of your subscription to remove CO2 from atmosphere through</span>
        <a
          href="https://stripe.com/climate"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#707dfb] hover:text-[#909bfb] underline underline-offset-2 transition-colors font-medium"
        >
          Stripe Climate.
        </a>
      </div>
    </div>
  );
}
