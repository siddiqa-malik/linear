"use client";

import React from "react";
import { Search } from "lucide-react";

interface CategoryFilterBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function CategoryFilterBar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: CategoryFilterBarProps) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "engineering", label: "Engineering" },
    { id: "productivity", label: "Productivity" },
    { id: "customer-support", label: "Customer Support" },
    { id: "customer-ops", label: "Customer Operations" },
    { id: "analytics", label: "Analytics" },
    { id: "design-media", label: "Design & Media" },
    { id: "automation", label: "Automation" },
    { id: "community", label: "Community" },
  ];

  return (
    <div className="sticky top-16 z-40 w-full border-b border-white/[0.06] bg-[#050506]/95 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-6xl px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Horizontal Scrollable Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {tabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/15 border border-white/20 text-white shadow-sm"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#62666d]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search integrations..."
            className="w-full rounded-full border border-white/10 bg-[#0d0d12] pl-8.5 pr-4 py-1.5 text-xs text-white placeholder-[#62666d] outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
