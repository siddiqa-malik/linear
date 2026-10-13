"use client";

import React, { useState } from "react";
import {
  IntegrationHero,
  EssentialsSection,
  CategoryFilterBar,
  IntegrationCategoryGrids,
  IntegrationCTA,
} from "./components";

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="w-full bg-[#080915] text-[#f3f4f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Hero Section with Top Halo Image Asset */}
      <IntegrationHero />

      {/* 2. Essentials Showcase Carousel using Essential-img.png */}
      <EssentialsSection />

      {/* 3. Sticky Horizontal Filter & Search Bar */}
      <CategoryFilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 4. Categorized Integration Grids (Engineering, Productivity, Support, etc.) */}
      <IntegrationCategoryGrids
        activeCategory={activeCategory}
        searchQuery={searchQuery}
      />

      {/* 5. Bottom "Build your own integration" CTA with integration-callToAction-bg.png */}
      <IntegrationCTA />
    </main>
  );
}
