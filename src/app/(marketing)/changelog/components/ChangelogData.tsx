"use client";

import React from "react";
import { ChangelogPostData } from "./ChangelogPost";
import { Flag, GitPullRequest, Search, Terminal, Sparkles, Activity, Sun, Moon } from "lucide-react";

export const CHANGELOG_POSTS: ChangelogPostData[] = [
  // 1. Project Milestones (2023-09-28)
  {
    id: "milestones",
    date: "2023-09-28",
    title: "Project Milestones",
    badge: "New",
    description:
      "Break down projects into distinct phases with Project Milestones. Milestones let you set high-level goals and target dates within a project, making it easier to track progress toward major deliverables and celebrate team achievements.",
    features: [
      "Set target dates and descriptions for key project phases",
      "Visual indicator flags directly on roadmap timeline views",
      "Link issues directly to milestones to automatically track phase completion",
    ],
    fixes: [
      "Added keyboard shortcut 'M' to quickly assign milestones from issue views",
      "Milestone completion percentage now automatically calculates in project views",
      "Improved performance of roadmaps with 100+ active projects",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden">
        {/* Background Subtle Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5e6ad2]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Roadmap Gantt Mockup */}
        <div className="rounded-xl border border-white/10 bg-[#0e1122] p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-[#8a8f98]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Roadmap</span>
              <span>•</span>
              <span>Q3 — Q4 2023</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 text-[#818cf8] font-mono text-[11px]">
              <Flag className="h-3 w-3" />
              <span>Beta Launch: Oct 15</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {/* Timeline Bar 1 */}
            <div>
              <div className="flex justify-between text-[11px] text-[#8a8f98] mb-1">
                <span className="text-white/90 font-medium">Auth & Onboarding Redesign</span>
                <span className="font-mono text-emerald-400">100% completed</span>
              </div>
              <div className="h-4 w-full rounded bg-white/[0.04] p-0.5 relative">
                <div className="h-full w-[80%] rounded bg-gradient-to-r from-emerald-500 to-emerald-400" />
                {/* Milestone Flag pin */}
                <div className="absolute top-0 left-[80%] -translate-x-1/2 -top-1.5 h-6 w-0.5 bg-[#818cf8]">
                  <div className="h-2 w-2 rounded-full bg-[#818cf8] -translate-x-[3px] shadow-[0_0_8px_#818cf8]" />
                </div>
              </div>
            </div>

            {/* Timeline Bar 2 */}
            <div>
              <div className="flex justify-between text-[11px] text-[#8a8f98] mb-1">
                <span className="text-white/90 font-medium">Mobile Native Experience</span>
                <span className="font-mono text-[#818cf8]">75% completed</span>
              </div>
              <div className="h-4 w-full rounded bg-white/[0.04] p-0.5">
                <div className="ml-[20%] h-full w-[55%] rounded bg-gradient-to-r from-[#5e6ad2] to-[#818cf8] shadow-[0_0_10px_rgba(94,106,210,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 2. Customer Requests in Triage (2023-09-14)
  {
    id: "customer-triage",
    date: "2023-09-14",
    title: "Customer requests in Triage",
    badge: "Integration",
    description:
      "Collect customer feedback and support requests directly into your team’s Triage queue. Connect Zendesk, Intercom, and Front to convert customer conversations into actionable Linear issues without leaving your support workflow.",
    features: [
      "Bi-directional status sync with customer support desks",
      "Automatic customer notifications when an issue ships to production",
      "Dedicated Customer Requests tab in issue sidebar",
    ],
    fixes: [
      "Support attachments from customer tickets now embed directly in issues",
      "Fixed a race condition when merging duplicate customer requests",
      "Added webhook event triggers for customer issue status transitions",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Zendesk Ticket Card */}
          <div className="rounded-xl border border-white/10 bg-[#0e1122] p-4 shadow-lg">
            <div className="flex items-center justify-between text-[11px] text-[#8a8f98] mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Zendesk #4819</span>
              <span>Open</span>
            </div>
            <div className="text-xs font-semibold text-white mb-1">Cannot export invoice CSV on Safari</div>
            <p className="text-[11px] text-[#8a8f98] line-clamp-2">
              Customer from Stripe reported 403 Forbidden when clicking download in billing dashboard.
            </p>
          </div>

          {/* Linked Linear Issue Card */}
          <div className="rounded-xl border border-[#5e6ad2]/40 bg-[#12152a] p-4 shadow-lg relative">
            <div className="flex items-center justify-between text-[11px] text-[#8a8f98] mb-2">
              <span className="px-2 py-0.5 rounded bg-[#5e6ad2]/20 text-[#818cf8] font-mono">ENG-410</span>
              <span className="text-amber-400 font-medium">In Triage</span>
            </div>
            <div className="text-xs font-semibold text-white mb-2">Billing export authentication fix</div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06] text-[10px] text-[#8a8f98]">
              <span>Linked to 4 customer tickets</span>
              <span>•</span>
              <span className="text-emerald-400">Auto-notify on Done</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 3. Initiatives (2023-08-31)
  {
    id: "initiatives",
    date: "2023-08-31",
    title: "Initiatives",
    badge: "Enterprise",
    description:
      "Group related projects under company-wide strategic objectives. Initiatives give leaders a bird's-eye view of progress across multiple teams without losing touch with individual issues.",
    features: [
      "Aggregate progress from tens of cross-functional projects",
      "Designate executive sponsors and initiative leads",
      "Filter roadmap views by strategic company priorities",
    ],
    fixes: [
      "Initiative health status updates can now broadcast automatically to Slack",
      "Added initiative export to CSV and GraphQL query support",
      "Improved timeline rendering on high-DPI displays",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden">
        <div className="rounded-xl border border-white/10 bg-[#0e1122] p-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#818cf8] tracking-wider">INITIATIVE</span>
              <h4 className="text-sm font-semibold text-white mt-0.5">Q4 Enterprise Scale & Compliance</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              82% on track
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs text-[#8a8f98] block">Projects</span>
              <span className="text-sm font-bold text-white font-mono">6 Active</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs text-[#8a8f98] block">Issues</span>
              <span className="text-sm font-bold text-white font-mono">148 / 180</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs text-[#8a8f98] block">Teams</span>
              <span className="text-sm font-bold text-white font-mono">3 Teams</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 4. Sub-issues and issue linking (2023-08-17)
  {
    id: "sub-issues",
    date: "2023-08-17",
    title: "Sub-issues and issue linking",
    badge: "Core",
    description:
      "Break complex features down into sub-issues with full hierarchical tracking. Parent issues automatically reflect the completion percentage of their child tasks.",
    features: [
      "Drag and drop to reorder or reassign sub-issues",
      "Sub-issue creation shortcut with Shift + Enter",
      "Automatic status propagation when all sub-tasks are marked Done",
    ],
    fixes: [
      "GitHub PR links now correctly update sub-issue status when merged",
      "Sub-issue lists now support keyboard navigation with arrow keys",
      "Fixed issue view flicker when rapidly expanding nested trees",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden">
        <div className="rounded-xl border border-white/10 bg-[#0e1122] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-white pb-3 border-b border-white/[0.06]">
            <span>ENG-300: Redesign Navigation & Mobile Drawer</span>
            <span className="text-[#818cf8] font-mono">2 / 3 done</span>
          </div>

          <div className="mt-3 space-y-2 pl-4 border-l border-white/10">
            <div className="flex items-center justify-between text-xs p-2 rounded bg-white/[0.02]">
              <span className="text-white/80 line-through">✓ ENG-301: Gesture pan responder</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Done</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded bg-white/[0.02]">
              <span className="text-white/80 line-through">✓ ENG-302: Smooth slide animation</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Done</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded bg-[#5e6ad2]/15 border border-[#5e6ad2]/30">
              <span className="text-white font-medium">● ENG-303: Keyboard shortcut listener</span>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px]">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 5. Command Menu 2.0 (2023-08-03)
  {
    id: "command-menu",
    date: "2023-08-03",
    title: "Command Menu 2.0",
    badge: "Speed",
    description:
      "The command menu has been rebuilt from scratch to be faster, more contextual, and deeply extensible. Search across all issues, projects, cycles, and team members with instant fuzzy matching.",
    features: [
      "Sub-10ms fuzzy search across workspaces with 50,000+ issues",
      "Contextual actions that adapt based on the current view or selection",
      "Recent searches and pinned actions for rapid repetitive workflows",
    ],
    fixes: [
      "Added custom hotkey bindings in workspace settings",
      "Command menu now supports multi-issue bulk actions",
      "Reduced memory footprint of cached workspace indexes",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden flex items-center justify-center">
        {/* Ambient Purple Glow */}
        <div className="absolute w-72 h-44 rounded-full bg-[#5e6ad2]/25 blur-2xl pointer-events-none" />

        <div className="w-full max-w-md rounded-xl border border-white/15 bg-[#0e1122]/95 backdrop-blur-xl p-3 shadow-2xl relative z-10">
          <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-2.5 text-xs text-[#8a8f98]">
            <Search className="h-4 w-4 text-[#818cf8]" />
            <span className="text-white font-medium">Type a command or search...</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center justify-between rounded bg-[#5e6ad2]/20 px-3 py-2 text-white">
              <span>Create new issue</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">C</kbd>
            </div>
            <div className="flex items-center justify-between rounded px-3 py-2 text-[#8a8f98] hover:bg-white/[0.04]">
              <span>Switch to Active Cycle</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">G C</kbd>
            </div>
            <div className="flex items-center justify-between rounded px-3 py-2 text-[#8a8f98] hover:bg-white/[0.04]">
              <span>Triage Inbox</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">G T</kbd>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 6. GraphQL API v2 & Webhooks (2023-07-20)
  {
    id: "graphql-api",
    date: "2023-07-20",
    title: "GraphQL API v2 & Webhooks",
    badge: "Developers",
    description:
      "We have overhauled the Linear API with fine-grained OAuth scopes, enhanced GraphQL schemas, and real-time webhook payloads for all workspace mutations.",
    features: [
      "Granular OAuth permissions for third-party developer integrations",
      "Instant webhook retries with automatic exponential backoff",
      "Interactive GraphQL playground and auto-generated TypeScript types",
    ],
    fixes: [
      "Rate limit thresholds increased by 4x for Enterprise workspaces",
      "Added pagination cursors for large historical issue queries",
      "Fixed signature verification bug in webhook handler payloads",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden font-mono text-xs">
        <div className="rounded-xl border border-white/10 bg-[#080911] p-4 shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2 mb-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="text-[10px] text-[#62666d] ml-2">api.linear.app/graphql</span>
          </div>
          <div className="space-y-1 text-[#8a8f98]">
            <div>
              <span className="text-[#c084fc]">query</span> {"{"}
            </div>
            <div className="pl-4">
              <span className="text-[#60a5fa]">issues</span>(filter: {"{"} priority: <span className="text-[#a3e635]">High</span> {"}"}) {"{"}
            </div>
            <div className="pl-8 text-white/90">id title state {"{ name }"}</div>
            <div className="pl-4">{"}"}</div>
            <div>{"}"}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
            <span className="text-emerald-400">HTTP 200 OK</span>
            <span className="text-[#62666d]">14ms latency</span>
          </div>
        </div>
      </div>
    ),
  },

  // 7. Linear 2023 Release (2023-07-06)
  {
    id: "annual-release-2023",
    date: "2023-07-06",
    title: "Linear 2023 Release",
    badge: "Milestone",
    description:
      "Our largest update of the year introduces a completely redesigned interface, instant client-side search, revamped Cycles, and streamlined navigation designed for extreme speed.",
    features: [
      "New desktop and web design with elevated typography and ergonomics",
      "Zero-latency offline sync with optimistic updates",
      "Redesigned notifications inbox with priority triage",
    ],
    fixes: [
      "Global startup time reduced by 60%",
      "Fluid keyboard navigation across all list and board views",
      "New dark theme contrast tuning for OLED and HDR displays",
    ],
    renderGraphic: () => (
      <div className="p-8 md:p-12 bg-[#0b0d18] relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Celestial Multi-layer Aurora Halo */}
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-[#5e6ad2]/30 via-[#a855f7]/25 to-[#38bdf8]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-[#131528] border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(94,106,210,0.6)] mb-4">
            <Sparkles className="h-8 w-8 text-[#818cf8]" />
          </div>
          <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/90 uppercase tracking-widest mb-2">
            LINEAR 2023 RELEASE
          </div>
          <span className="text-xs text-[#8a8f98]">The new standard for modern software engineering</span>
        </div>
      </div>
    ),
  },

  // 8. Cycles improvements & Scope tracking (2023-06-22)
  {
    id: "cycles-scope",
    date: "2023-06-22",
    title: "Cycles improvements & Scope tracking",
    badge: "Update",
    description:
      "Keep teams focused on what matters now. The updated Cycles experience brings automatic scope creep detection, customizable cooldown periods, and granular velocity history.",
    features: [
      "Real-time scope changes tracked on the burndown curve",
      "Cooldown periods between cycles for refactoring and tech debt",
      "Automatic carry-over of unfinished issues without manual triaging",
    ],
    fixes: [
      "Added velocity variance comparison against trailing 5 cycles",
      "Cycles now display time-zone aware rollover countdowns",
      "Fixed chart axis scaling on ultra-wide monitors",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden">
        <div className="rounded-xl border border-white/10 bg-[#0e1122] p-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Cycle 28</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Active</span>
            </div>
            <span className="text-[#8a8f98] font-mono">Scope: 42 pts (+4 added)</span>
          </div>

          <div className="h-28 w-full mt-3 relative">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 280 80">
              <line x1="10" y1="20" x2="270" y2="70" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
              <path
                d="M 10 20 Q 90 25, 160 45 T 250 62"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
              />
              <circle cx="250" cy="62" r="4" fill="#38bdf8" />
            </svg>
          </div>
        </div>
      </div>
    ),
  },

  // 9. Light Mode & Custom Themes (2023-06-08)
  {
    id: "themes-light-mode",
    date: "2023-06-08",
    title: "Light Mode & Custom Themes",
    badge: "Design",
    description:
      "Introducing a meticulously crafted light mode alongside custom workspace themes. Engineered with strict contrast ratios, light mode feels as native and responsive as our signature dark theme.",
    features: [
      "Clean, high-contrast light theme optimized for well-lit environments",
      "Custom brand accent color selector for workspaces",
      "Automatic system theme synchronization",
    ],
    fixes: [
      "Fixed contrast on priority badge pills in light mode",
      "Smooth CSS transition when toggling between themes",
      "Reduced DOM repaints on theme change events",
    ],
    renderGraphic: () => (
      <div className="p-6 md:p-8 bg-[#0b0d18] relative overflow-hidden">
        <div className="grid grid-cols-2 gap-4">
          {/* Dark Preview */}
          <div className="rounded-xl border border-white/10 bg-[#080911] p-4 shadow-xl">
            <div className="flex items-center gap-1.5 text-xs text-[#8a8f98] mb-2">
              <Moon className="h-3.5 w-3.5 text-[#818cf8]" />
              <span className="text-white font-medium">Dark Mode</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 mb-2" />
            <div className="h-2 w-2/3 rounded-full bg-[#5e6ad2]" />
          </div>

          {/* Light Preview */}
          <div className="rounded-xl border border-slate-300 bg-[#f8fafc] p-4 shadow-xl text-slate-900">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold text-slate-900">Light Mode</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 mb-2" />
            <div className="h-2 w-2/3 rounded-full bg-indigo-600" />
          </div>
        </div>
      </div>
    ),
  },
];
