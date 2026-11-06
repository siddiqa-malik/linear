"use client";

import React from "react";
import { BarChart3, Clock, Flame, Repeat, TrendingUp, Zap } from "lucide-react";

/*
 * CyclesSection Component
 *
 * Implements the "Build momentum with Cycles" feature showcase matching
 * the canonical Linear design (media_1791442560395.png).
 *
 * Section Architecture:
 * 1. Top Section:
 *    - Left-anchored title "Build momentum / with Cycles" with gradient text.
 *    - Overlapping centered floating Cycles burndown & timeline chart (/cyclesection-hero.png)
 *      exported directly from Figma with natural glass shadows.
 * 2. Middle Anchor Statement:
 *    - "Cycles focus your team on what to work on next. They are not sprints, they are continuous rhythms."
 * 3. Feature Matrix:
 *    - 6 clean points arranged in a 3-column grid highlighting the key advantages
 *      of continuous cycles over traditional sprint planning ceremonies.
 */
export function CyclesSection() {
  return (
    <section id="method" className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#080915] overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#5e6ad2]/[0.04] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* ============================================================ */}
        {/* 1. Section Heading & Floating Cycles Hero Visual             */}
        {/* ============================================================ */}
        <div className="relative mx-auto max-w-5xl">
          {/* Section Heading: Overlaps the upper-left of the floating cycles graph */}
          <div className="relative z-10 text-left pl-2 sm:pl-4 md:pl-6 -mb-6 sm:-mb-10 md:-mb-14 pointer-events-none">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl leading-[1.08]">
              Build momentum
              <br />
              <span className="text-gradient">with Cycles</span>
            </h2>
          </div>

          {/* Floating Cycles Chart Hero Visual (/cyclesection-hero.png) */}
          <div className="relative mx-auto flex justify-center">
            <img
              src="/cyclesection-hero.png"
              alt="Build momentum with Cycles"
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
            Cycles focus your team on what to work on next. They are not sprints, they are continuous rhythms.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 3. 6 Feature Pillars (3 Columns x 2 Rows)                    */}
        {/* ============================================================ */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Point 1 */}
          <div className="text-left">
            <Clock className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Automatic scheduling
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Cycles run on a regular, automated cadence so your team always maintains momentum without tedious planning.
            </p>
          </div>

          {/* Point 2 */}
          <div className="text-left">
            <TrendingUp className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Scope creep visibility
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Real-time burndown analytics detect scope creep early and accurately forecast your team’s delivery progress.
            </p>
          </div>

          {/* Point 3 */}
          <div className="text-left">
            <Zap className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              No sprint ceremonies
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Focus on actual shipping instead of lengthy retrospectives, estimation poker, and status meetings.
            </p>
          </div>

          {/* Point 4 */}
          <div className="text-left">
            <Repeat className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Automatic rollovers
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Unfinished work automatically carries over into the next cycle without manual rescheduling or triage friction.
            </p>
          </div>

          {/* Point 5 */}
          <div className="text-left">
            <BarChart3 className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Predictable velocity
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Track team velocity trends over time to plan realistic scopes and celebrate continuous milestones.
            </p>
          </div>

          {/* Point 6 */}
          <div className="text-left">
            <Flame className="h-4 w-4 text-[#8a8f98] mb-2.5" />
            <h3 className="text-sm md:text-base font-semibold text-white">
              Cooldown periods
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8a8f98]">
              Schedule intentional pauses between cycles for bug squashing, technical debt, and exploratory projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
