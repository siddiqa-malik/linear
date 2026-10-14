"use client";

import React from "react";

export function InvestorsSection() {
  const leadInvestors = [
    {
      name: "Roelof Botha",
      role: "Partner at Sequoia",
      initials: "RB",
      color: "from-[#ec4899] to-[#8b5cf6]",
    },
    {
      name: "Stephanie Zhan",
      role: "Partner at Sequoia",
      initials: "SZ",
      color: "from-[#3b82f6] to-[#06b6d4]",
    },
  ];

  const angels = [
    { name: "Dylan Field", company: "Figma" },
    { name: "Patrick Collison", company: "Stripe" },
    { name: "Dick Costolo", company: "Twitter" },
    { name: "Tobi Lütke", company: "Shopify" },
    { name: "Mathilde Collin", company: "Front" },
    { name: "Paul Copplestone", company: "Supabase" },
    { name: "Guillermo Rauch", company: "Vercel" },
    { name: "Elad Gil", company: "Entrepreneur & Investor" },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
            Built for the best.
            <br />
            <span className="text-[#8a8f98]">Backed by the best.</span>
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] leading-relaxed">
            Linear is funded by Sequoia Capital and world-class founders and executives who share our belief in quality and craftsmanship.
          </p>
        </div>

        {/* Lead Partners Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
          {leadInvestors.map((lead) => (
            <div
              key={lead.name}
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#0c0d14]/70 border border-white/[0.06] shadow-sm hover:border-white/15 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${lead.color} flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white/10`}
              >
                {lead.initials}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {lead.name}
                </h4>
                <p className="text-xs text-[#8a8f98] mt-0.5">{lead.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Angels Grid */}
        <div className="mt-12 pt-10 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-6">
          {angels.map((angel) => (
            <div key={angel.name} className="space-y-1">
              <h5 className="text-[13px] font-medium text-white tracking-tight">
                {angel.name}
              </h5>
              <p className="text-[11px] text-[#8a8f98] font-mono">
                {angel.company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
