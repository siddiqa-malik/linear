"use client";

import React from "react";
import { GitPullRequest, Layers, MessageSquare, MessagesSquare, Share2, Users } from "lucide-react";

export function CollaborateSection() {
  return (
    <section className="relative py-24 md:py-32 border-t border-white/[0.06]">
      {/* Cyan Accent Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-24 w-96 h-96 rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#06b6d4] to-[#14b8a6]">
            Collaborate
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#8a8f98] leading-relaxed">
            Keep everyone in sync without slowing down. Discuss issues in context, share project updates effortlessly,
            and integrate with the tools your team already uses every day.
          </p>
        </div>

        {/* 6 Cards 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Discussions */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#06b6d4]/40 transition-all duration-300">
            {/* Visual Graphic: Comment Thread */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-3 flex flex-col justify-between shadow-inner">
              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-[#06b6d4]/30 border border-[#06b6d4]/60 flex items-center justify-center text-[10px] text-white font-bold">
                  S
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-[11px] text-[#e2e4e9]">
                  <div className="flex justify-between text-[10px] text-[#8a8f98] mb-1">
                    <span className="font-medium text-white">Sarah Chen</span>
                    <span>10m ago</span>
                  </div>
                  PR is ready for review with all auth tests passing.
                </div>
              </div>
              <div className="text-[10px] text-[#62666d] px-1">Markdown & inline attachments supported</div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <MessageSquare className="h-4 w-4 text-[#06b6d4]" />
                <h3>Discussions</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Contextual threads right inside issues, cycles, and product roadmaps.
              </p>
            </div>
          </div>

          {/* Card 2: Project updates */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#06b6d4]/40 transition-all duration-300">
            {/* Visual Graphic: Project Update Digest */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-3.5 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Weekly Pulse #4</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                  On Track
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-[#8a8f98]">
                <div className="text-white/90">✓ 14 tasks shipped to production</div>
                <div>⚡ Zero critical blockers reported</div>
              </div>
              <div className="text-[10px] text-[#62666d]">Automated email & Slack broadcasting</div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Share2 className="h-4 w-4 text-[#06b6d4]" />
                <h3>Project updates</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Weekly progress summaries generated with zero overhead for executives and stakeholders.
              </p>
            </div>
          </div>

          {/* Card 3: Initiatives */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#06b6d4]/40 transition-all duration-300">
            {/* Visual Graphic: Hierarchy Tree */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex flex-col items-center gap-2">
                <div className="px-3 py-1 rounded-md bg-[#06b6d4]/20 border border-[#06b6d4]/50 text-white font-semibold text-xs shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  Q4 Enterprise Launch
                </div>
                <div className="w-0.5 h-3 bg-white/20" />
                <div className="flex gap-2">
                  <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/80">
                    SSO Auth
                  </div>
                  <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/80">
                    Audit Logs
                  </div>
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Layers className="h-4 w-4 text-[#06b6d4]" />
                <h3>Initiatives</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Group multiple sub-projects into overarching company strategic milestones.
              </p>
            </div>
          </div>

          {/* Card 4: Git integrations */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#06b6d4]/40 transition-all duration-300">
            {/* Visual Graphic: Git Branch Diagram */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex flex-col justify-center p-4 gap-2 shadow-inner">
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/90">
                <GitPullRequest className="h-3.5 w-3.5 text-[#06b6d4]" />
                <span>linear/eng-284-auth</span>
              </div>
              <div className="text-[10px] text-[#8a8f98] pl-5">
                ↳ Connected to PR #142 (Merged)
              </div>
              <div className="flex items-center gap-1.5 pl-5 pt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">Issue automatically closed</span>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <GitPullRequest className="h-4 w-4 text-[#06b6d4]" />
                <h3>Git integrations</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Two-way sync with GitHub, GitLab, and Bitbucket that triggers automatic status shifts.
              </p>
            </div>
          </div>

          {/* Card 5: Slack & Discord */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#06b6d4]/40 transition-all duration-300">
            {/* Visual Graphic: Chat Toast Notification */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] p-3 flex flex-col justify-center gap-2 shadow-inner">
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5 text-[11px]">
                <div className="flex items-center justify-between text-[#8a8f98] text-[10px] mb-1">
                  <span className="text-[#06b6d4] font-medium">#engineering-prod</span>
                  <span>Linear Bot</span>
                </div>
                <div className="text-white/90">New issue created from Slack thread: ENG-489</div>
              </div>
              <div className="text-[10px] text-[#62666d]">Type /linear in Slack to capture tasks</div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <MessagesSquare className="h-4 w-4 text-[#06b6d4]" />
                <h3>Slack & Discord</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Turn messages into actionable Linear issues directly from your team’s chat channels.
              </p>
            </div>
          </div>

          {/* Card 6: Figma & Design */}
          <div className="linear-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 border border-white/[0.08] bg-[#0c0e18]/80 hover:border-[#06b6d4]/40 transition-all duration-300">
            {/* Visual Graphic: Design & Tool Icons */}
            <div className="h-44 w-full rounded-xl bg-[#080911] border border-white/[0.06] flex items-center justify-center p-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#12141f] border border-white/10 flex items-center justify-center text-xs font-bold text-[#22d3ee] shadow-md">
                  Figma
                </div>
                <div className="h-10 w-10 rounded-xl bg-[#12141f] border border-[#06b6d4]/40 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  Git
                </div>
                <div className="h-10 w-10 rounded-xl bg-[#12141f] border border-white/10 flex items-center justify-center text-xs font-bold text-[#8a8f98] shadow-md">
                  Notion
                </div>
              </div>
            </div>
            {/* Text info */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
                <Users className="h-4 w-4 text-[#06b6d4]" />
                <h3>Figma & Design</h3>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Embed live Figma prototypes and interactive canvas frames right inside specifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
