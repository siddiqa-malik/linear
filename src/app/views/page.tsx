"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/workspace/Sidebar";
import { AuthGuard } from "@/components/common/AuthGuard";
import {
  Layers,
  Star,
  Plus,
  SlidersHorizontal,
  CircleDot,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function ViewsPage() {
  const [filter, setFilter] = useState<"all" | "favorites" | "recent">("all");

  const views = [
    {
      id: "all-issues",
      title: "All active issues",
      description: "Issues currently in progress or waiting to be started",
      icon: CircleDot,
      color: "text-[#5e6ad2]",
      badge: "Active",
      href: "/issues/active",
    },
    {
      id: "my-issues",
      title: "My assigned issues",
      description: "All issues assigned to you across projects",
      icon: CheckCircle2,
      color: "text-[#0ca678]",
      badge: "Assigned",
      href: "/my-issues",
    },
    {
      id: "backlog",
      title: "Backlog ideas & tasks",
      description: "Upcoming tasks not yet scheduled for active sprints",
      icon: Clock,
      color: "text-[#e8590c]",
      badge: "Backlog",
      href: "/issues/backlog",
    },
    {
      id: "all-projects",
      title: "Projects overview",
      description: "High-level progress across all active workspace initiatives",
      icon: Layers,
      color: "text-[#7950f2]",
      badge: "Projects",
      href: "/projects",
    },
  ];

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#0f1017] text-[#e6e7ee] overflow-hidden select-none">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <div className="h-11 px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f1017]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[13px] font-medium text-white">
                <Layers className="w-4 h-4 text-[#8a8f98]" />
                <span>Views</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-[#161722] hover:bg-[#1f202e] border border-white/[0.08] text-xs text-[#8a8f98] hover:text-white transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Display</span>
              </button>
            </div>
          </div>

          {/* Main views list */}
          <main className="flex-1 p-8 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">Saved Views</h1>
                <p className="text-xs text-[#8a8f98] mt-1">
                  Access customized filter perspectives for your team and projects
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#161722] border border-white/[0.08] rounded-md p-0.5 text-xs text-[#8a8f98]">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`px-2.5 py-1 rounded transition ${
                      filter === "all" ? "bg-white/[0.1] text-white" : "hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("favorites")}
                    className={`px-2.5 py-1 rounded transition ${
                      filter === "favorites" ? "bg-white/[0.1] text-white" : "hover:text-white"
                    }`}
                  >
                    Favorites
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {views.map((v) => {
                const Icon = v.icon;
                return (
                  <Link
                    key={v.id}
                    href={v.href}
                    className="p-4 rounded-xl border border-white/[0.06] bg-[#12141c]/60 hover:bg-[#151722] hover:border-white/[0.12] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${v.color}`} />
                          <h2 className="text-[13px] font-medium text-white group-hover:text-[#858fe8] transition">
                            {v.title}
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] text-[#8a8f98]">
                          {v.badge}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8a8f98] leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-[#626674] group-hover:text-[#8a8f98]">
                      <span>Open view</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
