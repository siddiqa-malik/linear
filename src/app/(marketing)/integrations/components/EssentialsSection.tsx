"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export function EssentialsSection() {
  const essentials = [
    {
      id: "github",
      name: "GitHub",
      title: "Automate pull request workflows and link commits",
      desc: "Turn branch pushes into issue progress. Automatically link pull requests to issues, update status on merge, and reference tickets directly from commit messages.",
      buttonText: "Learn more",
      image: "/Essential-img.png",
      tag: "Code & CI/CD",
    },
    {
      id: "gitlab",
      name: "GitLab",
      title: "Bi-directional merge request sync and CI pipeline triggers",
      desc: "Link GitLab merge requests directly to Linear issues. State transitions happen automatically as code passes reviews and deploys to production environments.",
      buttonText: "Learn more",
      image: "/Essential-img.png",
      tag: "Code & CI/CD",
    },
    {
      id: "figma",
      name: "Figma",
      title: "Embed live design prototypes and components inside issues",
      desc: "Inspect live canvas frames, design tokens, and interactive components directly within Linear issue descriptions without leaving the app.",
      buttonText: "Learn more",
      image: "/Essential-img.png",
      tag: "Design",
    },
    {
      id: "slack",
      name: "Slack",
      title: "Real-time notification alerts and instant hotkey triage",
      desc: "Turn conversations into issues with one click. Get real-time updates when tasks are assigned, commented on, or completed.",
      buttonText: "Learn more",
      image: "/Essential-img.png",
      tag: "Communication",
    },
    {
      id: "zendesk",
      name: "Zendesk",
      title: "Two-way customer ticket sync and automated resolution",
      desc: "Connect support tickets directly to engineering backlog items so customer agents always have full visibility into shipping progress.",
      buttonText: "Learn more",
      image: "/Essential-img.png",
      tag: "Customer Support",
    },
    {
      id: "sentry",
      name: "Sentry",
      title: "Link crash stack traces and exception breadcrumbs to issues",
      desc: "Automatically triage production errors into Linear. Group duplicate crash reports and close Sentry issues when code merges.",
      buttonText: "Learn more",
      image: "/Essential-img.png",
      tag: "Monitoring",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = essentials[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? essentials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === essentials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-12 md:py-20 border-t border-white/[0.06] bg-[#050506]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Essentials
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[#8a8f98]">
              Must-have integrations for modern software teams
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0d0d10] text-[#8a8f98] hover:text-white hover:border-white/20 transition-all cursor-pointer"
              aria-label="Previous Essential"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0d0d10] text-[#8a8f98] hover:text-white hover:border-white/20 transition-all cursor-pointer"
              aria-label="Next Essential"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#09090c] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.95)]">
          {/* Main Screenshot Preview */}
          <div className="relative overflow-hidden bg-[#070709] border-b border-white/[0.06]">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-auto object-cover select-none"
              loading="eager"
            />
          </div>

          {/* Card Footer Bar */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0e]">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {current.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {current.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#c7d2fe] font-mono text-[10px]">
                    {current.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#8a8f98] mt-0.5">
                  {current.title}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Opening details for ${current.name} integration`)}
              className="linear-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-white shadow-lg cursor-pointer"
            >
              <span>{current.buttonText}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Tabs Bar Below Card */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {essentials.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeIndex === idx
                  ? "bg-white/15 text-white border border-white/20 shadow-sm"
                  : "bg-white/[0.03] text-[#8a8f98] hover:text-white hover:bg-white/[0.06] border border-transparent"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
