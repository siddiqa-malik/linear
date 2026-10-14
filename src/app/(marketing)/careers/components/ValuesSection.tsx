"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Zap,
  ShieldCheck,
  Users,
  Eye,
  ArrowRight,
} from "lucide-react";

export function ValuesSection() {
  const values = [
    {
      icon: Sparkles,
      title: "Design over process",
      description:
        "We solve problems by building great products, not through endless meetings and bureaucracy.",
    },
    {
      icon: Heart,
      title: "Taste is subjective, excellence is not",
      description:
        "We care obsessively about details, typography, latency, and craft in everything we ship.",
    },
    {
      icon: Zap,
      title: "Speed as a habit",
      description:
        "Momentum creates clarity. We make decisions quickly and bias towards continuous shipping.",
    },
    {
      icon: ShieldCheck,
      title: "Agency and trust",
      description:
        "We give individuals high context and full ownership to do their best work without micromanagement.",
    },
    {
      icon: Users,
      title: "Small by design",
      description:
        "We keep our team small and dense with talent. Every person makes a direct, tangible impact.",
    },
    {
      icon: Eye,
      title: "Pride in what we make",
      description:
        "We build tools that we use ourselves every single day, with pride in the standard we set.",
    },
  ];

  const investorLogos = [
    "SEQUOIA",
    "INDEX VENTURES",
    "DYLAN FIELD",
    "PATRICK COLLISON",
    "STRIPE",
  ];

  return (
    <section className="py-24 md:py-32 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
            Join a team of makers
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] leading-relaxed">
            We work in small, cross-functional teams with direct ownership over what we build. Here is what we value:
          </p>
          <div className="mt-4">
            <Link
              href="/method"
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#818cf8] hover:text-[#9fa8ff] transition-colors"
            >
              <span>Read Linear Method</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6 Values Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="group p-6 rounded-2xl bg-[#0c0d14]/70 border border-white/[0.06] hover:border-white/20 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 flex items-center justify-center text-[#818cf8] mb-5 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-[#8a8f98]">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Investor Logos Row */}
        <div className="mt-20 pt-10 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-mono text-[#5a5f6b] uppercase tracking-wider select-none">
          {investorLogos.map((inv) => (
            <span key={inv} className="hover:text-[#8a8f98] transition-colors">
              {inv}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
