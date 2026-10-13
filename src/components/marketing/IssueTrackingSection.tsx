"use client";

import { CheckCircle2, GitPullRequest, Layers, SlidersHorizontal, Tag, User } from "lucide-react";

export function IssueTrackingSection() {
  return (
    <section className="relative border-t border-white/[0.06] py-28 md:py-36 bg-[#08090b]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Issue tracking
            <br />
            <span className="text-gradient">you’ll enjoy using</span>
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-[#8a8f98]">
            Create issues in seconds, organize them with nested sub-issues, and automate state transitions with Git.
          </p>
        </div>

        {/* Floating Issue Composer Mockup */}
        <div className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0e0f15] p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-[#8a8f98]">
            <span className="font-medium text-white">New Issue</span>
            <span className="text-[11px] text-[#62666d]">Draft saved</span>
          </div>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              readOnly
              value="Implement role-based authorization for project members"
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <p className="text-xs text-[#8a8f98] leading-relaxed">
              Verify owner, admin, and member permissions before executing task mutations. Add integration tests.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#8a8f98]">
                <Tag className="h-3 w-3" /> Security
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-400">
                ● High Priority
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#8a8f98]">
                <User className="h-3 w-3" /> Alex Saddi
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-[#5e6ad2]/30 bg-[#5e6ad2]/10 px-2 py-0.5 text-[11px] text-[#7d88ff]">
                TaskFlow API
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="text-[11px] text-[#62666d]">Press ⌘+Enter to submit</span>
            <button className="linear-button-primary rounded-md px-3.5 py-1.5 text-xs font-medium text-white shadow-md">
              Create issue
            </button>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <Layers className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Parent and sub-issues</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Decompose large initiatives into discrete, assignable chunks with automatic progress rollups.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <GitPullRequest className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Git automation</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Automatically transition issues to In Progress when branches are opened, and to Done when PRs merge.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
            <SlidersHorizontal className="h-5 w-5 text-[#5e6ad2]" />
            <h3 className="mt-3 text-base font-semibold text-white">Custom views & filters</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a8f98]">
              Create custom saved views for specific priorities, assignees, or upcoming deadlines.
            </p>
          </div>
        </div>

        {/* 2 Bento Cards: Board vs List and Automated Workflows */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: Board vs List */}
          <div className="linear-card rounded-2xl p-6">
            <div className="flex items-center justify-between text-xs text-[#8a8f98] mb-4">
              <span className="font-semibold text-white">Board & List Flexibility</span>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px]">Toggle View</span>
            </div>
            {/* Visual Mini Columns */}
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="rounded border border-white/[0.06] bg-[#0c0d12] p-2">
                <div className="text-[#8a8f98] font-semibold mb-2">Todo (3)</div>
                <div className="rounded bg-white/[0.03] p-1.5 mb-1.5 text-white/90">Setup DB index</div>
                <div className="rounded bg-white/[0.03] p-1.5 text-white/90">Add tests</div>
              </div>
              <div className="rounded border border-white/[0.06] bg-[#0c0d12] p-2">
                <div className="text-amber-400 font-semibold mb-2">In Progress (2)</div>
                <div className="rounded bg-white/[0.03] p-1.5 mb-1.5 text-white/90">Auth API</div>
              </div>
              <div className="rounded border border-white/[0.06] bg-[#0c0d12] p-2">
                <div className="text-[#5e6ad2] font-semibold mb-2">Done (5)</div>
                <div className="rounded bg-white/[0.03] p-1.5 text-white/90">Task Model</div>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#8a8f98]">
              Switch instantly between Kanban board cards and dense, keyboard-driven list rows.
            </p>
          </div>

          {/* Card 2: Workflow States */}
          <div className="linear-card rounded-2xl p-6">
            <div className="flex items-center justify-between text-xs text-[#8a8f98] mb-4">
              <span className="font-semibold text-white">Automated Status Transitions</span>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px]">Linear Workflow</span>
            </div>
            {/* Pipeline visual */}
            <div className="flex items-center justify-between gap-1 text-[11px] py-3 border-y border-white/[0.06]">
              <span className="rounded bg-zinc-800 px-2 py-1 text-zinc-400">Backlog</span>
              <span className="text-[#62666d]">→</span>
              <span className="rounded bg-zinc-800 px-2 py-1 text-white">Todo</span>
              <span className="text-[#62666d]">→</span>
              <span className="rounded bg-amber-400/20 px-2 py-1 text-amber-400 font-medium">In Progress</span>
              <span className="text-[#62666d]">→</span>
              <span className="rounded bg-[#5e6ad2]/20 px-2 py-1 text-[#7d88ff] font-medium">Done</span>
            </div>
            <p className="mt-4 text-xs text-[#8a8f98]">
              Statuses advance naturally as work progresses, keeping your entire company in sync without status meetings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}