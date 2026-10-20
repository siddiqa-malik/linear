"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { Project } from "@/types/project";
import { ChevronDown, Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import { ProjectStatusIcon } from "@/components/common/ProjectStatusIcon";

interface RoadmapTimelineProps {
  projects: Project[];
  filter: "all" | "backlog" | "active" | "closed";
  setFilter: (filter: "all" | "backlog" | "active" | "closed") => void;
  title?: string;
  breadcrumb?: string;
  showBreadcrumbPrefix?: boolean;
  viewMode?: "timeline" | "grid";
  setViewMode?: (mode: "timeline" | "grid") => void;
}

// Generate calendar timeline columns (weeks) around current date
function generateTimelineData() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // Span: 3 months before to 5 months ahead
  const startMonth = new Date(currentYear, currentMonth - 3, 1);
  const endMonth = new Date(currentYear, currentMonth + 5, 0);

  const months: Array<{ name: string; year: number; startIdx: number; count: number }> = [];
  const weeks: Array<{
    date: Date;
    dayNum: number;
    monthName: string;
    isCurrentWeek: boolean;
    isTodayWeek: boolean;
  }> = [];

  // Align start to the nearest Monday/Sunday
  const cursor = new Date(startMonth);
  cursor.setDate(cursor.getDate() - cursor.getDay()); // Start of week

  let weekIdx = 0;
  let lastMonth = -1;

  while (cursor <= endMonth) {
    const d = new Date(cursor);
    const m = d.getMonth();
    const monthName = d.toLocaleDateString("en-US", { month: "long" });

    // Track month blocks
    if (m !== lastMonth) {
      months.push({
        name: monthName,
        year: d.getFullYear(),
        startIdx: weekIdx,
        count: 1,
      });
      lastMonth = m;
    } else if (months.length > 0) {
      months[months.length - 1].count += 1;
    }

    // Check if today falls in this week (within 7 days)
    const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    const isTodayWeek = diffDays >= 0 && diffDays < 7;

    weeks.push({
      date: d,
      dayNum: d.getDate(),
      monthName,
      isCurrentWeek: isTodayWeek,
      isTodayWeek,
    });

    cursor.setDate(cursor.getDate() + 7);
    weekIdx++;
  }

  return { months, weeks, startDate: weeks[0]?.date || startMonth, today };
}

export function RoadmapTimeline({
  projects,
  filter,
  setFilter,
  title = "Active",
  breadcrumb = "Projects",
  showBreadcrumbPrefix = true,
  viewMode = "timeline",
  setViewMode,
}: RoadmapTimelineProps) {
  const { setCreateProjectModalOpen } = useUI();
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  const { months, weeks, startDate, today } = useMemo(() => generateTimelineData(), []);

  const WEEK_WIDTH = 48; // px per week column
  const totalTimelineWidth = weeks.length * WEEK_WIDTH;

  // Find exact index of the week containing Today
  const todayWeekIdx = useMemo(() => {
    return weeks.findIndex((w) => w.isTodayWeek);
  }, [weeks]);

  // Exact pixel center of the Today column cell in the header
  const todayLineX = useMemo(() => {
    if (todayWeekIdx === -1) return 0;
    return todayWeekIdx * WEEK_WIDTH + WEEK_WIDTH / 2;
  }, [todayWeekIdx, WEEK_WIDTH]);

  // Center on Today on initial render (positioning Today around 1/3 of the viewport)
  useEffect(() => {
    if (timelineScrollRef.current) {
      const containerWidth = timelineScrollRef.current.clientWidth;
      const targetScroll = Math.max(0, todayLineX - containerWidth / 3);
      timelineScrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [todayLineX]);

  const scrollToToday = () => {
    if (timelineScrollRef.current) {
      const containerWidth = timelineScrollRef.current.clientWidth;
      const targetScroll = Math.max(0, todayLineX - containerWidth / 3);
      timelineScrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  // Helper for 2-letter lead initials
  const getLeadInitials = (p: Project) => {
    if (p.lead) {
      if (typeof p.lead === "object") return p.lead.initials || "LD";
      return p.lead.slice(0, 2).toUpperCase();
    }
    if (p.ownerId && typeof p.ownerId === "object") {
      const name = p.ownerId.name || p.ownerId.email || "LD";
      const parts = name.trim().split(/\s+/);
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    }
    return "LD";
  };

  // Filter projects according to tab
  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    const st = p.projectStatus || p.status;
    if (filter === "backlog") return st === "backlog";
    if (filter === "active") return st === "active" || st === "in_progress" || st === "planned";
    if (filter === "closed") return st === "archived" || st === "completed" || st === "canceled";
    return true;
  });

  const hasProjects = filteredProjects.length > 0;

  // Calculate bar geometry for a project
  const getProjectBarGeometry = (project: Project) => {
    let pStart = project.startDate ? new Date(project.startDate) : new Date(project.createdAt || today);
    if (isNaN(pStart.getTime())) pStart = new Date(project.createdAt || today);

    let pEnd = project.dueDate ? new Date(project.dueDate) : null;

    // Check if start is strictly in the future compared to today's week
    const todayWeekDate = weeks[todayWeekIdx]?.date || today;
    const isFuture = pStart.getTime() > todayWeekDate.getTime() + 7 * 86400000;

    // Immediately to the right of the vertical line (not overlapping on top of line!)
    let left = todayLineX + 3;
    if (isFuture) {
      const diffWeeks = (pStart.getTime() - startDate.getTime()) / (7 * 86400000);
      left = Math.max(todayLineX + 3, diffWeeks * WEEK_WIDTH);
    }

    // Default bar width matching Linear screenshot (~6 weeks long = 320px)
    let width = 320;
    if (pEnd && !isNaN(pEnd.getTime())) {
      const durationDays = (pEnd.getTime() - pStart.getTime()) / 86400000;
      if (durationDays > 0) {
        width = Math.max(280, (durationDays / 7) * WEEK_WIDTH);
      }
    }

    return { left, width };
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0e0f15] text-[#e6e7ee] select-none">
      {/* 1. TOP HEADER (Projects › Active  |  Updates, + New project) */}
      <div className="flex h-12 items-center justify-between border-b border-[#24263a]/60 bg-[#12131d]/90 px-6 shrink-0 z-30">
        <div className="flex items-center gap-2 text-[13px]">
          {showBreadcrumbPrefix && (
            <>
              <span className="text-[#8a8f98] font-normal">{breadcrumb}</span>
              <span className="text-[#55596e]">›</span>
            </>
          )}
          <span className="font-medium text-white">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-7 px-2.5 rounded-md border border-[#2a2c3f] bg-[#161724] hover:bg-[#1f2133] text-[12px] text-[#8a8f98] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8a8f98]" />
            <span>Updates</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateProjectModalOpen(true)}
            className="h-7 px-2.5 rounded-md border border-[#2a2c3f] bg-[#1c1d2b] hover:bg-[#25283b] text-[12px] font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New project</span>
          </button>
        </div>
      </div>

      {/* 2. SUBHEADER (Tabs: All, Backlog, Active, Closed, + Filter | Today, Year ▾, View toggle, Display ▾) */}
      <div className="flex h-10 items-center justify-between px-6 border-b border-[#24263a]/40 bg-[#10111a] text-[12px] shrink-0 z-30">
        {/* Left Tabs */}
        <div className="flex items-center gap-1 text-[#8a8f98]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "all" ? "bg-[#1c1d2b] text-white" : "hover:text-white"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("backlog")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "backlog" ? "bg-[#1c1d2b] text-white" : "hover:text-white"
            }`}
          >
            Backlog
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "active"
                ? "bg-[#1c1d2b] border border-[#2a2c3f] text-white font-medium shadow-sm"
                : "hover:text-white"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilter("closed")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "closed" ? "bg-[#1c1d2b] text-white" : "hover:text-white"
            }`}
          >
            Closed
          </button>

          <button
            type="button"
            className="ml-2 flex items-center gap-1 px-2 py-1 rounded text-[#707383] hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Filter</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 text-[#8a8f98]">
          {/* Today Button */}
          <button
            type="button"
            onClick={scrollToToday}
            className="text-[#8a8f98] hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded"
          >
            Today
          </button>

          {/* Year Zoom Selector */}
          <button
            type="button"
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Year</span>
            <ChevronDown className="w-3 h-3 text-[#62666d]" />
          </button>

          {/* View Toggle Icons (List vs Timeline - Interactive toggle) */}
          <div className="flex items-center bg-[#161724] p-0.5 rounded border border-[#2a2c3f]">
            {/* List Icon */}
            <button
              type="button"
              onClick={() => setViewMode?.("grid")}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#24273c] text-white shadow-sm"
                  : "text-[#707383] hover:text-white"
              }`}
              title="List view"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="12" height="1.8" rx="0.5" />
                <rect x="2" y="7" width="12" height="1.8" rx="0.5" />
                <rect x="2" y="11" width="12" height="1.8" rx="0.5" />
              </svg>
            </button>

            {/* Timeline / Gantt Icon */}
            <button
              type="button"
              onClick={() => setViewMode?.("timeline")}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-[#24273c] text-white shadow-sm"
                  : "text-[#707383] hover:text-white"
              }`}
              title="Roadmap timeline view"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="7" height="2" rx="0.5" />
                <rect x="7" y="7" width="7" height="2" rx="0.5" />
                <rect x="4" y="11" width="6" height="2" rx="0.5" />
              </svg>
            </button>
          </div>

          {/* Display Dropdown */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.04] text-[#8a8f98] hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Display</span>
            <ChevronDown className="w-3 h-3 text-[#62666d]" />
          </button>
        </div>
      </div>

      {/* 3. SPLIT TIMELINE CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: Project Names Table Header & Rows (ONLY when projects exist) */}
        {hasProjects && (
          <div className="w-64 sm:w-72 border-r border-[#24263a]/60 bg-[#0e0f15] shrink-0 flex flex-col z-20 select-none">
            {/* Header Spacer matching calendar header height (68px) */}
            <div className="h-[68px] border-b border-[#24263a]/40 bg-[#0e0f15]" />

            {/* Left Project Rows */}
            <div className="flex-1 overflow-y-hidden">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="h-12 flex items-center justify-between px-4 border-b border-[#24263a]/30 hover:bg-[#161724]/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {/* 6-dot grip icon */}
                    <div className="w-3.5 h-3.5 text-[#4e5264] flex items-center justify-center shrink-0 cursor-grab">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="5" cy="3.5" r="1.2" />
                        <circle cx="11" cy="3.5" r="1.2" />
                        <circle cx="5" cy="8" r="1.2" />
                        <circle cx="11" cy="8" r="1.2" />
                        <circle cx="5" cy="12.5" r="1.2" />
                        <circle cx="11" cy="12.5" r="1.2" />
                      </svg>
                    </div>

                    <Link
                      href={`/projects/${project._id}`}
                      className="text-[13px] font-medium text-[#d1d5db] group-hover:text-white truncate transition-colors"
                    >
                      {project.name}
                    </Link>
                  </div>

                  {/* Right badges: Lead Avatar & Status Hexagon */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Lead Circle with Initials */}
                    <div className="w-4 h-4 rounded-full bg-[#7c3aed] flex items-center justify-center text-[8.5px] font-bold text-white shadow-sm">
                      {getLeadInitials(project)}
                    </div>

                    {/* Status Icon */}
                    <ProjectStatusIcon status={project.projectStatus || project.status || "active"} className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Interactive Gantt Calendar Grid */}
        <div
          ref={timelineScrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#0e0f15]"
        >
          <div style={{ width: `${totalTimelineWidth}px` }} className="relative min-h-full">
            {/* Calendar Header (Month Row + Week/Day Number Row = 68px) */}
            <div className="sticky top-0 z-10 bg-[#0e0f15] border-b border-[#24263a]/40">
              {/* Month Titles Row */}
              <div className="h-8 flex border-b border-[#24263a]/20 text-[11px] font-medium text-[#8a8f98]">
                {months.map((m, idx) => (
                  <div
                    key={`${m.name}-${m.year}-${idx}`}
                    style={{ width: `${m.count * WEEK_WIDTH}px` }}
                    className="flex items-center pl-3 border-r border-[#24263a]/20 truncate"
                  >
                    {m.name}
                  </div>
                ))}
              </div>

              {/* Day/Week Numbers Row with Today Badge */}
              <div className="h-9 flex text-[11px] text-[#707383]">
                {weeks.map((w, idx) => {
                  const isCurrentDay = w.isTodayWeek;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${WEEK_WIDTH}px` }}
                      className="flex items-center justify-center border-r border-[#24263a]/15 shrink-0 relative"
                    >
                      {isCurrentDay ? (
                        <div className="w-5 h-5 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center text-[10px] font-semibold shadow-sm z-10">
                          {today.getDate()}
                        </div>
                      ) : (
                        <span>{w.dayNum}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ONLY RENDER WHEN hasProjects: Vertical Line under Date + Grid lines + Project Bars */}
            {hasProjects && (
              <>
                {/* Vertical "Today" Indicator Line directly below the Today date badge */}
                <div
                  style={{ left: `${todayLineX}px` }}
                  className="absolute top-[68px] bottom-0 w-[1.5px] -translate-x-1/2 bg-[#5e6ad2] z-20 pointer-events-none"
                />

                {/* Vertical Grid Background Lines */}
                <div className="absolute top-[68px] bottom-0 left-0 right-0 flex pointer-events-none">
                  {weeks.map((_, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${WEEK_WIDTH}px` }}
                      className="border-r border-[#24263a]/15 h-full shrink-0"
                    />
                  ))}
                </div>

                {/* Project Gantt Bars Rows */}
                <div className="relative pt-0">
                  {filteredProjects.map((project) => {
                    const { left, width } = getProjectBarGeometry(project);
                    return (
                      <div
                        key={project._id}
                        className="h-12 border-b border-[#24263a]/20 flex items-center relative"
                      >
                        {/* Gantt Bar (matching screenshot layout) */}
                        <Link
                          href={`/projects/${project._id}`}
                          style={{ left: `${left}px`, width: `${width}px` }}
                          className="absolute h-8 rounded-lg border border-[#2e324c] bg-[#1c1d2b] hover:bg-[#23263b] shadow-lg shadow-black/30 flex items-center justify-between px-3 text-[12px] text-white transition-all duration-150 group z-10"
                        >
                          {/* Bar Left: 6-dot grip + Project Name */}
                          <div className="flex items-center gap-2 overflow-hidden mr-2">
                            <div className="w-3 h-3 text-[#55596e] group-hover:text-[#8a8f98] shrink-0">
                              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                <circle cx="5" cy="3.5" r="1.2" />
                                <circle cx="11" cy="3.5" r="1.2" />
                                <circle cx="5" cy="8" r="1.2" />
                                <circle cx="11" cy="8" r="1.2" />
                                <circle cx="5" cy="12.5" r="1.2" />
                                <circle cx="11" cy="12.5" r="1.2" />
                              </svg>
                            </div>
                            <span className="font-medium truncate">{project.name}</span>
                          </div>

                          {/* Bar Right: Milestone Diamond + User Research · 0% */}
                          <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-[#8a8f98]">
                            <svg
                              className="w-3 h-3 text-[#eab308]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 22 12 12 22 2 12 12 2" />
                            </svg>
                            <span className="font-normal truncate">User Research · 0%</span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* EMPTY STATE (Matching Screenshot 2 `media_1792404529177.png`): NO grid, NO vertical line, centered! */}
        {!hasProjects && (
          <div className="absolute inset-0 top-[68px] flex flex-col items-center justify-center text-center p-8 z-20 pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-center justify-center animate-in fade-in duration-200">
              <div className="w-16 h-14 mb-4 text-[#303348] flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[#24263a]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              </div>

              <p className="text-[13.5px] text-[#707383] mb-1.5 font-normal">
                No active or planned projects.
              </p>

              <button
                type="button"
                onClick={() => setCreateProjectModalOpen(true)}
                className="text-[13px] text-[#5e6ad2] hover:text-[#7884ea] transition-colors cursor-pointer font-normal"
              >
                Create a new project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
