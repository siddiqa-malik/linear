"use client";

import React from "react";
import {
  CustomersHero,
  FeaturedCustomersGrid,
  CustomerLogosWall,
  CustomersCTA,
} from "./components";

export default function CustomersPage() {
  return (
    <main className="w-full bg-[#080915] text-[#f3f4f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Hero Section with "Meet our customers" & Horizon Arc */}
      <CustomersHero />

      {/* 2. 3x3 Grid of Featured Customer Cards (Cash App, Vercel, Ramp, Retool, Loom, Descript, Arc, Alan, Watershed) */}
      <FeaturedCustomersGrid />

      {/* 3. Massive Logo Matrix of 45+ High-Growth Tech Teams */}
      <CustomerLogosWall />

      {/* 4. "You belong among the stars" Glowing Nebula CTA */}
      <CustomersCTA />
    </main>
  );
}
