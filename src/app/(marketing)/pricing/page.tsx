"use client";

import React from "react";
import {
  PricingHero,
  PricingCards,
  LinearEnterpriseCard,
  PricingComparisonTable,
  StripeClimateBanner,
} from "./components";

export default function PricingPage() {
  return (
    <div className="w-full bg-[#080915] text-[#f3f4f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Hero with public/pricing-hero-bg.png */}
      <PricingHero />

      {/* 2. Three Pricing Cards (Active Standard card with gradient #7877C6 top to #FFFFFF bottom on canvas blue) */}
      <PricingCards />

      {/* 3. Linear Enterprise Section with public/linearEnterprice-bg.png */}
      <LinearEnterpriseCard />

      {/* 4. Full Comparison Matrix with shaded Standard column */}
      <PricingComparisonTable />

      {/* 5. Stripe Climate 1% contribution banner */}
      <StripeClimateBanner />
    </div>
  );
}
