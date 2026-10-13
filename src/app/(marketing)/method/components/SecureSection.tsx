"use client";

import React from "react";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";

export function SecureSection() {
  return (
    <section className="relative py-24 md:py-32 border-t border-white/[0.06]">
      {/* Purple Accent Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-24 w-96 h-96 rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#8b5cf6]">
            Secure
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8a8f98] leading-relaxed">
            Enterprise-grade reliability, security, and governance. Keep your IP safe and control
            access with advanced administration and compliance features.
          </p>
        </div>

        {/* 3 Cards 1-Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: SAML & SSO */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#8b5cf6]/40 transition-all duration-300">
            {/* Visual Graphic: Shield with Padlock */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-24 w-24 rounded-full bg-[#8b5cf6]/20 blur-xl group-hover:bg-[#8b5cf6]/35 transition-all" />
                <div className="h-14 w-14 rounded-2xl bg-[#171329] border border-[#8b5cf6]/60 flex items-center justify-center shadow-[0_0_18px_rgba(139,92,246,0.5)]">
                  <Lock className="h-6 w-6 text-[#c084fc]" />
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <ShieldCheck className="h-4 w-4 text-[#8b5cf6]" />
                <h3>SAML & SSO</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Centralized authentication with Okta, Google Workspace, Azure Active Directory, and custom SAML 2.0.
              </p>
            </div>
          </div>

          {/* Card 2: Role-based access */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#8b5cf6]/40 transition-all duration-300">
            {/* Visual Graphic: Roles Badges */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex flex-col justify-center p-4 gap-2 shadow-inner">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs">
                <span className="text-white font-medium">Workspace Owner</span>
                <span className="px-2 py-0.5 rounded bg-[#8b5cf6]/20 text-[#c084fc] font-mono text-[10px]">Full Access</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs">
                <span className="text-white/80 font-medium">Team Member</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[10px]">Read & Write</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <KeyRound className="h-4 w-4 text-[#8b5cf6]" />
                <h3>Role-based access</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Granular member permissions, team-level access control, and comprehensive audit trail logs.
              </p>
            </div>
          </div>

          {/* Card 3: SOC 2 & Compliance */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#8b5cf6]/40 transition-all duration-300">
            {/* Visual Graphic: Certified Compliance Badge */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              <div className="flex flex-col items-center gap-1.5">
                <div className="px-4 py-1.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                  SOC 2 TYPE II CERTIFIED
                </div>
                <span className="text-[10px] text-[#8a8f98]">GDPR & HIPAA Compliant</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <ShieldCheck className="h-4 w-4 text-[#8b5cf6]" />
                <h3>SOC 2 & Compliance</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Enterprise security standards with end-to-end encryption in transit and at rest, plus 99.99% SLA uptime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
