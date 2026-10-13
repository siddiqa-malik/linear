"use client";

import React from "react";
import { Check } from "lucide-react";

export interface ChangelogPostData {
  id: string;
  date: string;
  title: string;
  badge?: string;
  description: string;
  features?: string[];
  fixes?: string[];
  renderGraphic: () => React.ReactNode;
}

export function ChangelogPost({ post }: { post: ChangelogPostData }) {
  return (
    <article className="relative py-14 md:py-20 border-b border-white/[0.06] last:border-b-0">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Date & Timeline Metadata */}
          <div className="md:col-span-3">
            <div className="md:sticky md:top-24 flex items-center md:items-start gap-3">
              <span className="font-mono text-sm text-[#8a8f98] font-medium tracking-tight">
                {post.date}
              </span>
              {post.badge && (
                <span className="px-2 py-0.5 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 text-[#818cf8] font-mono text-[10px] font-semibold">
                  {post.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Visual Mockup & Content */}
          <div className="md:col-span-9 space-y-6">
            {/* Visual Graphic Screen Frame */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090b16] shadow-[0_16px_50px_-15px_rgba(0,0,0,0.8)]">
              {post.renderGraphic()}
            </div>

            {/* Post Title */}
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white pt-2">
              {post.title}
            </h2>

            {/* Post Description */}
            <p className="text-sm sm:text-base leading-relaxed text-[#a4aecd] font-normal">
              {post.description}
            </p>

            {/* Key Features Highlights */}
            {post.features && post.features.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {post.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#e2e4e9]">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#818cf8] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Fixes & Improvements Section */}
            {post.fixes && post.fixes.length > 0 && (
              <div className="pt-6 border-t border-white/[0.06] space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#8a8f98] font-semibold">
                  Fixes & improvements
                </h3>
                <ul className="space-y-2">
                  {post.fixes.map((fix, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#8a8f98] leading-relaxed">
                      <span className="text-[#62666d] select-none">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
