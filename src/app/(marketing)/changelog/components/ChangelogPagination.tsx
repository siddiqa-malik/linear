"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ChangelogPagination() {
  return (
    <div className="py-16 md:py-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-6 flex items-center justify-between">
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-xs font-medium text-[#62666d] cursor-not-allowed"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Newer posts</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f98]">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-semibold">1</span>
          <span className="px-3 py-1 rounded-full text-[#8a8f98] hover:text-white cursor-pointer">2</span>
          <span className="px-3 py-1 rounded-full text-[#8a8f98] hover:text-white cursor-pointer">3</span>
          <span className="px-2 text-[#62666d]">...</span>
          <span className="px-3 py-1 rounded-full text-[#8a8f98] hover:text-white cursor-pointer">8</span>
        </div>

        <button
          onClick={() => alert("Loaded older releases from archive")}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        >
          <span>Older posts</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
