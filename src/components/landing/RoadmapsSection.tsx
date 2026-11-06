"use client";

import React from "react";
import { Activity, Calendar, Compass, GitMerge, Milestone, SlidersHorizontal } from "lucide-react";

/*
 * RoadmapsSection Component
 *
 * Implements the "Set direction with Roadmaps" strategic planning showcase
 * matching the authentic Linear marketing page (media_1791442560395.png).
 *
 * Section Architecture:
 * 1. Top Section:
 *    - Left-anchored title "Set direction / with Roadmaps" with gradient text.
 *    - Overlapping centered floating Roadmap Timeline chart (/roadmap-bg.png)
 *      exported directly from Figma with interactive date markers and initiative bars.
 * 2. Middle Central Statement:
 *    - "Roadmaps give everyone clarity on where the company is headed and when projects will ship."
 * 3. 6 Feature Pillars (3 Columns x 2 Rows):
 *    - Multi-team roadmaps, Project milestones, Real-time progress updates,
 *      Cross-project dependencies, Custom views by initiative, Automated timeline sync.
 * 4. Bottom 2 Bento Cards:
 *    - Card 1: "Project updates" showcase using /roadmap-card-img-1.png (iOS application testflight update).
 *    - Card 2: "Multi-team roadmaps" showcase using /roadmap-card-img-2.png (Q4 Roadmap timeline).
 *    Both cards feature the translucent slate glass aesthetic (.linear-bento-card).
 */
export function RoadmapsSection() {
  return (
    <section className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#080915] overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#5e6ad2]/[0.04] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* ============================================================ */}
        {/* 1. Section Heading & Floating Roadmap Timeline Hero Visual   */}
        {/* ============================================================ */}
        <div className="relative mx-auto max-w-5xl">
          {/* Section Heading: Overlaps the upper-left of the floating roadmap timeline */}
          <div className="relative z-10 text-left pl-2 sm:pl-4 md:pl-6 -mb-6 sm:-mb-10 md:-mb-14 pointer-events-none">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl leading-[1.08]">
              Set direction
              <br />
              <span className="text-gradient">with Roadmaps</span>
            </h2>
          </div>

          {/* Floating Roadmap Timeline Visual (/roadmap-bg.png) */}
          <div className="relative mx-auto flex justify-center">
            <img
              src="/roadmap-bg.png"
              alt="Set direction with Roadmaps"
              className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
              loading="lazy"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Central Anchor Statement                                  */}
        {/* ============================================================ */}
        <div className="mx-auto mt-16 md:mt-24 max-w-2xl text-center">
          <p className="text-lg md:text-xl font-medium tracking-tight text-white/90">
            Roadmaps give everyone clarity on where the company is headed and when projects will ship.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 3. 6 Feature Pillars (3 Columns x 2 Rows)                    */}
        {/* ============================================================ */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Point 1 */}
          <div className="text-left">
            <Compass className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Multi-team roadmaps
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Coordinate complex initiatives across multiple teams, sub-teams, and departments with unified progress tracking.
            </p>
          </div>

          {/* Point 2 */}
          <div className="text-left">
            <Milestone className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Project milestones
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Break long-running initiatives into observable milestones with clear completion targets and delivery scopes.
            </p>
          </div>

          {/* Point 3 */}
          <div className="text-left">
            <Activity className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Real-time progress updates
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Keep stakeholders updated automatically with status reports tied directly to completed issues and tasks.
            </p>
          </div>

          {/* Point 4 */}
          <div className="text-left">
            <GitMerge className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Cross-project dependencies
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Visualize blockers and dependencies across teams to identify bottlenecks and keep key deliverables on track.
            </p>
          </div>

          {/* Point 5 */}
          <div className="text-left">
            <SlidersHorizontal className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Custom views by initiative
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Filter roadmaps by quarter, lead engineer, priority, or strategic pillar to present relevant views to leadership.
            </p>
          </div>

          {/* Point 6 */}
          <div className="text-left">
            <Calendar className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Automated timeline sync
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Timelines automatically adjust based on actual team velocity and completed cycle issues without manual spreadsheet upkeep.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. Bottom 2 Bento Cards                                      */}
        {/* ============================================================ */}
        <div className="mt-14 md:mt-18 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: Project updates */}
          <div className="linear-bento-card relative overflow-hidden rounded-[28px] md:rounded-[36px] p-8 md:p-10 min-h-[440px] sm:min-h-[480px] md:min-h-[500px] flex flex-col justify-between">
            {/* Card Text Header */}
            <div className="relative z-10 text-left">
              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-white">
                Project updates
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] text-[#8a8f98] leading-relaxed max-w-[320px]">
                Keep stakeholders informed with progress updates linked directly to projects and milestones.
              </p>
            </div>

            {/* Visual: Project update card */}
            <div className="relative mt-auto w-full overflow-hidden flex items-end justify-center pt-4">
              <img
                src="/roadmap-card-img-1.png"
                alt="Project updates"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 2: Multi-team roadmaps */}
          <div className="linear-bento-card relative overflow-hidden rounded-[28px] md:rounded-[36px] p-8 md:p-10 min-h-[440px] sm:min-h-[480px] md:min-h-[500px] flex flex-col justify-between">
            {/* Card Text Header */}
            <div className="relative z-10 text-left">
              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-white">
                Multi-team roadmaps
              </h3>
              <p className="mt-2.5 text-sm md:text-[15px] text-[#8a8f98] leading-relaxed max-w-[320px]">
                Group projects across teams and departments into high-level strategic initiatives.
              </p>
            </div>

            {/* Visual: Multi-team roadmaps timeline card */}
            <div className="relative mt-auto w-full overflow-hidden flex items-end justify-center pt-4">
              <img
                src="/roadmap-card-img-2.png"
                alt="Multi-team roadmaps"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
