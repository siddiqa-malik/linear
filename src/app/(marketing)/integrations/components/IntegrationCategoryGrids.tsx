"use client";

import React, { useState } from "react";
import { INTEGRATION_CATEGORIES, IntegrationCategory, IntegrationItem } from "./IntegrationData";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface IntegrationCategoryGridsProps {
  activeCategory: string;
  searchQuery: string;
}

export function IntegrationCategoryGrids({
  activeCategory,
  searchQuery,
}: IntegrationCategoryGridsProps) {
  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter categories and items based on search and active tab
  const filteredCategories = INTEGRATION_CATEGORIES.map((cat) => {
    let items = cat.items;

    // Apply text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (it) => it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
      );
    }

    return {
      ...cat,
      items,
    };
  }).filter((cat) => {
    // Apply category tab filter
    if (activeCategory !== "all" && cat.id !== activeCategory) {
      return false;
    }
    return cat.items.length > 0;
  });

  return (
    <div className="py-12 md:py-20 space-y-20 bg-[#050506]">
      <div className="mx-auto max-w-6xl px-6 space-y-20">
        {filteredCategories.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-white font-medium">No integrations found</p>
            <p className="text-sm text-[#8a8f98] mt-1">
              Try adjusting your search query or switching categories.
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isExpanded = expandedCategories[category.id] || searchQuery.trim().length > 0;
            const visibleItems = isExpanded ? category.items : category.items.slice(0, 6);
            const hasMore = category.items.length > 6;

            return (
              <section key={category.id} id={category.id} className="scroll-mt-32">
                {/* Category Header */}
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#8a8f98]">
                    {category.subtitle}
                  </p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {visibleItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => alert(`Opening ${item.name} integration details`)}
                      className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#09090c] p-5 hover:border-white/20 hover:bg-[#0f0f14] transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:shadow-black/60"
                    >
                      <div>
                        {/* Header: Logo Icon & Name */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-9 w-9 rounded-xl border border-white/10 flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105"
                              style={{
                                backgroundColor: item.color === "#ffffff" ? "#18181c" : `${item.color}15`,
                                borderColor: item.color === "#ffffff" ? "rgba(255,255,255,0.15)" : `${item.color}35`,
                                color: item.color,
                              }}
                            >
                              {item.name.charAt(0)}
                            </div>
                            <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                              {item.name}
                            </h3>
                          </div>

                          {item.isPopular && (
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-mono text-[9px] font-semibold border border-white/10">
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#8a8f98] leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      {/* Footer Hover Link */}
                      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#62666d] group-hover:text-white transition-colors">
                        <span>View integration</span>
                        <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show more toggle */}
                {hasMore && !searchQuery.trim() && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs font-medium text-[#8a8f98] hover:text-white hover:border-white/20 transition-all cursor-pointer"
                    >
                      <span>{isExpanded ? "Show less" : `Show ${category.items.length - 6} more`}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
