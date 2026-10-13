"use client";

import React, { useState } from "react";
import Link from "next/link";


import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "For small teams and side projects.",
      features: [
        "Unlimited members",
        "Up to 250 active issues",
        "Integrations: GitHub, Slack, Figma",
        "Import from Jira & Asana",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Standard",
      price: annual ? "$8" : "$10",
      desc: "For growing product & engineering teams.",
      features: [
        "Everything in Free, plus:",
        "Unlimited active issues",
        "Automated Cycles & Roadmaps",
        "Admin roles & access controls",
        "Priority customer support",
      ],
      cta: "Start 14-Day Trial",
      popular: true,
    },
    {
      name: "Plus",
      price: annual ? "$14" : "$16",
      desc: "For scaling organizations with security needs.",
      features: [
        "Everything in Standard, plus:",
        "SAML Single Sign-On (SSO)",
        "Advanced velocity analytics & SLAs",
        "Custom export & compliance audit logs",
        "Dedicated success manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="w-full">
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Simple, predictable pricing
          </h1>
          <p className="text-[15px] text-[#8a8f98] leading-relaxed mb-6">
            Invest in speed and team alignment. Switch plans or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-[#12141a] border border-white/[0.08]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                !annual ? "bg-white/[0.1] text-white" : "text-[#8a8f98]"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors flex items-center gap-1.5 ${
                annual ? "linear-button-primary text-white" : "text-[#8a8f98]"
              }`}
            >
              <span>Annual billing</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">20% off</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-2xl bg-[#0d0e12] border transition-all ${
                p.popular
                  ? "border-[#5643CC] shadow-2xl shadow-[#5643CC]/25 ring-1 ring-[#673FD7]"
                  : "border-white/[0.08]"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full linear-button-primary text-white text-[11px] font-semibold tracking-wide uppercase font-mono shadow-md shadow-[#5643CC]/40">
                  Most Popular
                </div>
              )}

              <h3 className="text-[18px] font-semibold text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-[#8a8f98] mb-6">{p.desc}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-[12px] text-[#8a8f98]">/ user / month</span>
              </div>

              <Link href="/onboarding" className="block mb-8">
                <Button
                  className={`w-full text-[13px] py-2 ${
                    p.popular ? "linear-button-primary text-white" : "bg-white/[0.08] hover:bg-white/[0.12] text-white"
                  }`}
                >
                  {p.cta}
                </Button>
              </Link>

              <div className="space-y-3">
                {p.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-[12px] text-[#e2e4e9]">
                    <Check className="w-4 h-4 text-[#5e6ad2] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      
    </div>
  );
}
