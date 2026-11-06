"use client";

import React from "react";
import { GitPullRequest, Layers, SlidersHorizontal } from "lucide-react";

/*
 * IssueTrackingSection Component
 *
 * Renders the "Issue tracking you'll enjoy using" feature showcase matching
 * the authentic Linear marketing page (media_1791442560395.png and media_1793953681911_d82a061f.jpg).
 *
 * Canvas & Section Architecture:
 * - Canvas Background: bg-[#080915] (consistent dark blue canvas matching HeroSection and page layout).
 * - Top Section:
 *    - Left-anchored title "Issue tracking / you'll enjoy using" with gradient text.
 *    - Overlapping centered floating modal dialog (/issue tracking.png) exported from Figma.
 * - Middle Pillars:
 *    - Central anchor statement: "Tasks, issues and bugs. Your team's work, in one place."
 *    - 3 concise feature columns: Parent & sub-issues, Automated workflows, and Filters & custom views.
 * - Bottom Bento Cards (2 columns, matching media_1793953681911_d82a061f.jpg):
 *    - Both cards feature generous rounded chassis (rounded-[28px] md:rounded-[36px]), overflow-hidden,
 *      and translucent slate glass styling (.linear-bento-card).
 *    - Card 1: "List and board" layout with /issue-card-image.png positioned so the main board window
 *      and secondary background window peek in with bottom/right clipped.
 *    - Card 2: "Make it yours" personalized filters with /issue-card-image-2.png positioned with
 *      modal filters and list items cleanly peeking into the card frame.
 */
export function IssueTrackingSection() {
  return (
    <section className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#080915] overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#5e6ad2]/[0.04] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* ============================================================ */}
        {/* 1. Section Heading & Floating Modal Composer                 */}
        {/* ============================================================ */}
        <div className="relative mx-auto max-w-4xl">
          {/* Section Heading: Overlaps the upper-left of the floating composer */}
          <div className="relative z-10 text-left pl-2 sm:pl-4 md:pl-6 -mb-6 sm:-mb-10 md:-mb-14 pointer-events-none">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl leading-[1.08]">
              Issue tracking
              <br />
              <span className="text-gradient">you’ll enjoy using</span>
            </h2>
          </div>

          {/* Floating Composer Modal Visual (/issue tracking.png) */}
          <div className="relative mx-auto flex justify-center">
            <img
              src="/issue tracking.png"
              alt="Issue tracking composer"
              className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
              loading="lazy"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Central Statement & 3 Feature Pillars                    */}
        {/* ============================================================ */}
        <div className="mx-auto mt-16 md:mt-24 max-w-2xl text-center">
          <p className="text-lg md:text-xl font-medium tracking-tight text-white/90">
            Tasks, issues and bugs. Your team’s work, in one place.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          {/* Pillar 1 */}
          <div className="text-left">
            <Layers className="h-5 w-5 text-[#8a8f98] mb-3" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Parent and sub-issues
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Decompose large initiatives into discrete, assignable chunks with automatic progress rollups.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="text-left">
            <GitPullRequest className="h-5 w-5 text-[#8a8f98] mb-3" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Automated workflows
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Automatically transition issues to In Progress when branches are opened, and to Done when PRs merge.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="text-left">
            <SlidersHorizontal className="h-5 w-5 text-[#8a8f98] mb-3" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Filters and custom views
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Create saved views for your team to track priorities, assignees, or upcoming deadlines.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. Bottom 2 Bento Cards (Exact replica of user screenshot)   */}
        {/* ============================================================ */}
        <div className="mt-14 md:mt-18 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: List and board */}
          <div className="linear-bento-card relative overflow-hidden rounded-[28px] md:rounded-[36px] p-8 md:p-10 min-h-[440px] sm:min-h-[480px] md:min-h-[500px] flex flex-col justify-start">
            {/* Card Text Header */}
            <div className="relative z-10 text-left">
              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-white">
                List and board
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] text-[#8a8f98] leading-relaxed max-w-[280px]">
                Switch between list and board layout to view work from any angle.
              </p>
            </div>

            {/* Visual: Board layout peeking in from right/bottom */}
            <img
              src="/issue-card-image.png"
              alt="List and board layout"
              className="pointer-events-none absolute left-[9%] md:left-[11%] top-[160px] sm:top-[170px] md:top-[180px] w-[150%] sm:w-[155%] md:w-[160%] max-w-none select-none drop-shadow-2xl"
              loading="lazy"
            />
          </div>

          {/* Card 2: Make it yours */}
          <div className="linear-bento-card relative overflow-hidden rounded-[28px] md:rounded-[36px] p-8 md:p-10 min-h-[440px] sm:min-h-[480px] md:min-h-[500px] flex flex-col justify-start">
            {/* Card Text Header */}
            <div className="relative z-10 text-left">
              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-white">
                Make it yours
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] text-[#8a8f98] leading-relaxed max-w-[320px]">
                Quickly apply filters and operators to refine your issue lists and create custom views.
              </p>
            </div>

            {/* Visual: Custom views modal and list peeking in from right/bottom */}
            <img
              src="/issue-card-image-2.png"
              alt="Make it yours custom views and filters"
              className="pointer-events-none absolute left-[7%] md:left-[8%] top-[165px] sm:top-[175px] md:top-[185px] w-[105%] sm:w-[108%] md:w-[110%] max-w-none select-none drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
