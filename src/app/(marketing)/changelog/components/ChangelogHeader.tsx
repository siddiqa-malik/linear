"use client";

import React from "react";
import { Bell, Rss } from "lucide-react";

export function ChangelogHeader() {
  return (
    <div className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.04em] text-white">
              Changelog
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#8a8f98]">
              New updates and product improvements
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Subscribed to Linear changelog notifications!")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5 text-[#818cf8]" />
              <span>Subscribe to updates</span>
            </button>

            <a
              href="#rss"
              onClick={(e) => {
                e.preventDefault();
                alert("RSS Feed URL copied to clipboard!");
              }}
              className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-white/10 bg-white/[0.04] text-[#8a8f98] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              title="RSS Feed"
            >
              <Rss className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
