"use client";

import React from "react";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SocialProof } from "@/components/marketing/SocialProof";
import { BentoSection } from "@/components/marketing/BentoSection";
import { IssueTrackingSection } from "@/components/marketing/IssueTrackingSection";
import { CyclesSection } from "@/components/marketing/CyclesSection";
import { RoadmapsSection } from "@/components/marketing/RoadmapsSection";
import { WorkflowsSection } from "@/components/marketing/WorkflowsSection";
import { CallToActionSection } from "@/components/marketing/CallToActionSection";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section with Floating App Mockup */}
      <HeroSection />

      {/* Customer Social Proof Logos */}
      <SocialProof />

      {/* "Unlike any tool you've used before" 4-Card Bento Grid */}
      <BentoSection />

      {/* "Issue tracking you'll enjoy using" with Composer & Workflow Cards */}
      <IssueTrackingSection />

      {/* "Build momentum with Cycles" with SVG Burndown Chart */}
      <CyclesSection />

      {/* "Set direction with Roadmaps" with Gantt Timeline Visual */}
      <RoadmapsSection />

      {/* "Linear workflows. Exponential results." */}
      <WorkflowsSection />

      {/* "Built for the future. Available today." */}
      <CallToActionSection />
    </main>
  );
}
