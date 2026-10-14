"use client";

import React from "react";
import Link from "next/link";
import { TwitterIcon } from "@/components/icons/SocialIcons";

export function BlogHeader() {
  return (
    <div className="pt-28 md:pt-32 pb-8 max-w-5xl mx-auto px-6">
      <div className="flex items-center justify-between">
        {/* Breadcrumb title */}
        <div className="flex items-center gap-2 text-xs sm:text-[13px]">
          <Link
            href="/blog"
            className="text-white/90 font-medium hover:text-white transition-colors"
          >
            Linear Blog
          </Link>
          <span className="text-[#4b505c]">/</span>
          <span className="text-[#8a8f98]">Updates from the Linear team</span>
        </div>

        {/* Twitter Icon link */}
        <a
          href="https://twitter.com/linear"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8a8f98] hover:text-white transition-colors p-1"
          aria-label="Linear on Twitter"
        >
          <TwitterIcon className="w-4 h-4 fill-current" />
        </a>
      </div>
    </div>
  );
}
