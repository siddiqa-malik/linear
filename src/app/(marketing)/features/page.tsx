"use client";

import React from "react";
import {
  HeroSection,
  SocialProof,
  BentoSection,
  IssueTrackingSection,
  CyclesSection,
  RoadmapsSection,
  WorkflowsSection,
  CallToActionSection,
} from "./components";

export default function FeaturesPage() {
  return (
    <main className="w-full bg-[#080915] text-[#f3f4f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Hero Section with Glow & Linear App Mockup */}
      <HeroSection />

      {/* 2. Customer Social Proof Wall with Stars Horizon */}
      <SocialProof />

      {/* 3. "Unlike any tool you've used before" 4-Card Bento Grid */}
      <BentoSection />

      {/* 4. "Issue tracking you'll enjoy using" with Composer & Workflow Cards */}
      <IssueTrackingSection />

      {/* 5. "Build momentum with Cycles" with Neon Burndown Chart */}
      <CyclesSection />

      {/* 6. "Set direction with Roadmaps" with Gantt Timeline Visual */}
      <RoadmapsSection />

      {/* 7. "Linear workflows. Exponential results." */}
      <WorkflowsSection />

      {/* 8. "Built for the future. Available today." Call To Action */}
      <CallToActionSection />
    </main>
  );
}
