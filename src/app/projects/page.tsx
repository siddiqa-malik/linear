"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/workspace/Sidebar";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { ProjectActionMenu } from "@/components/projects/ProjectActionMenu";
import { ProjectStatusIcon } from "@/components/common/ProjectStatusIcon";
import { ProjectPriorityIcon } from "@/components/common/ProjectPriorityIcon";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { Project } from "@/types/project";
import {
  Plus,
  Calendar,
  SlidersHorizontal,
  Star,
  MoreHorizontal,
  Link2,
  PanelRight,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "text-[#d97706]" },
  planned: { label: "Planned", color: "text-[#9ca3af]" },
  in_progress: { label: "In progress", color: "text-[#eab308]" },
  active: { label: "In progress", color: "text-[#eab308]" },
  completed: { label: "Completed", color: "text-[#818cf8]" },
  canceled: { label: "Canceled", color: "text-[#707383]" },
  archived: { label: "Canceled", color: "text-[#707383]" },
};

const PRIORITY_LABELS: Record<string, string> = {
  none: "No priority",
  no_priority: "No priority",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function ProjectsPage() {
  const { setCreateProjectModalOpen } = useUI();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | "backlog" | "active" | "closed">("all");
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      const list = res?.data || res || [];
      const arr: Project[] = Array.isArray(list) ? list : [];
      // Enrich with client-side cached metadata for instant accurate icons/fields
      const enriched = arr.map((p) => {
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem(`taskflow_proj_meta_${p._id}`);
            if (raw) {
              const meta = JSON.parse(raw);
              return {
                ...p,
                projectStatus: p.projectStatus || meta.projectStatus,
                priority: p.priority || meta.priority,
                lead: p.lead || meta.lead,
                startDate: p.startDate || meta.startDate,
                dueDate: p.dueDate || meta.dueDate,
              };
            }
          } catch {}
        }
        return p;
      });
      setProjects(enriched);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const handleCreated = () => fetchProjects();
    window.addEventListener("project-created", handleCreated);
    return () => window.removeEventListener("project-created", handleCreated);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    const st = p.projectStatus || p.status;
    if (filter === "backlog") return st === "backlog";
    if (filter === "active") return st === "active" || st === "in_progress" || st === "planned";
    if (filter === "closed") return st === "archived" || st === "completed" || st === "canceled";
    return true;
  });

  // Format short date (e.g. "Feb 17")
  const formatShortDate = (d?: string) => {
    if (!d) return null;
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  // Helper for 2-letter initials
  const getInitials = (str: string) => {
    if (!str) return "LD";
    const parts = str.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  // Get project lead info
  const getLeadInfo = (p: Project) => {
    if (p.lead) {
      if (typeof p.lead === "object") {
        const name = p.lead.name || p.lead.email || "Lead";
        const initials = p.lead.initials || getInitials(name);
        return { name, initials };
      }
      return { name: p.lead, initials: getInitials(p.lead) };
    }
    if (p.ownerId && typeof p.ownerId === "object") {
      const name = p.ownerId.name || p.ownerId.email || "Lead";
      return { name, initials: getInitials(name) };
    }
    return { name: "Unassigned", initials: "—" };
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0f15]">
      <Sidebar />

      {viewMode === "timeline" ? (
        <RoadmapTimeline
          projects={projects}
          filter={filter}
          setFilter={setFilter}
          title={
            filter === "active"
              ? "Active"
              : filter === "backlog"
              ? "Backlog"
              : filter === "closed"
              ? "Closed"
              : "All"
          }
          breadcrumb="Projects"
          showBreadcrumbPrefix={true}
          viewMode="timeline"
          setViewMode={(mode) => setViewMode(mode === "grid" ? "list" : "timeline")}
        />
      ) : (
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#0e0f15] text-[#c5c8d6]">
          {/* ============================================================== */}
          {/* TOP HEADER (Matching Linear Projects Header)                   */}
          {/* ============================================================== */}
          <div className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-[#24263a]/60 bg-[#12131d]/90 px-6 backdrop-blur-md select-none">
            {/* Left: Projects label, "All projects" tab pill, + New view */}
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-medium text-[#8a8f98]">Projects</span>

              {/* All Projects active pill tab */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1c1d2b] border border-[#2a2c3f] text-white text-[12px] font-medium shadow-sm transition-colors cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#8a8f98]"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <rect x="2" y="2" width="5" height="5" rx="1" />
                  <rect x="9" y="2" width="5" height="5" rx="1" />
                  <rect x="2" y="9" width="5" height="5" rx="1" />
                  <rect x="9" y="9" width="5" height="5" rx="1" />
                </svg>
                <span>All projects</span>
              </button>

              {/* + New view button */}
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1 rounded text-[12px] text-[#707383] hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New view</span>
              </button>
            </div>

            {/* Right: Link, + Create project, Sidebar layout icon */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Copy link"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCreateProjectModalOpen(true)}
                className="h-7 px-3 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create project</span>
              </button>

              <button
                type="button"
                className="p-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Layout toggle"
              >
                <PanelRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SUBHEADER ROW: Filter | View Mode Toggle, Display              */}
          {/* ============================================================== */}
          <div className="sticky top-12 z-10 flex h-10 shrink-0 items-center justify-between border-b border-[#24263a]/40 bg-[#10111a] px-6 text-[12px] select-none">
            {/* Filter button */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              {/* 3 descending lines filter icon */}
              <svg className="w-3.5 h-3.5 text-[#8a8f98]" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="12" height="1.5" rx="0.75" />
                <rect x="4" y="7" width="8" height="1.5" rx="0.75" />
                <rect x="6" y="11" width="4" height="1.5" rx="0.75" />
              </svg>
              <span>Filter</span>
            </button>

            {/* Right: View Mode Toggle & Display */}
            <div className="flex items-center gap-2.5">
              {/* View Toggle Icons (List vs Timeline Roadmap) */}
              <div className="flex items-center bg-[#161724] p-0.5 rounded border border-[#2a2c3f]">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="p-1 rounded transition-colors cursor-pointer bg-[#24273c] text-white shadow-sm"
                  title="List view"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="3" width="12" height="1.8" rx="0.5" />
                    <rect x="2" y="7" width="12" height="1.8" rx="0.5" />
                    <rect x="2" y="11" width="12" height="1.8" rx="0.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("timeline")}
                  className="p-1 rounded transition-colors cursor-pointer text-[#707383] hover:text-white"
                  title="Timeline Roadmap view"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="3" width="7" height="2" rx="0.5" />
                    <rect x="7" y="7" width="7" height="2" rx="0.5" />
                    <rect x="4" y="11" width="6" height="2" rx="0.5" />
                  </svg>
                </button>
              </div>

              {/* Display button */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#2a2c3f] bg-[#161724] hover:bg-[#1f2133] text-[#8a8f98] hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Display</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* TABLE COLUMN HEADERS                                           */}
          {/* ============================================================== */}
          <div className="flex items-center px-6 py-2 border-b border-[#24263a]/40 text-[11px] font-medium text-[#707383] select-none shrink-0 bg-[#0e0f15]">
            <div className="flex-1">Title</div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="w-14 text-center">Health</div>
              <div className="w-14 text-center">Priority</div>
              <div className="w-14 text-center">Lead</div>
              <div className="w-28 text-left">Target Date</div>
              <div className="w-28 text-left">Status</div>
              <div className="w-8"></div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PROJECT LIST ROWS                                              */}
          {/* ============================================================== */}
          <div className="flex-1 divide-y divide-[#24263a]/30">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[35vh] text-[#707383] text-xs">
                Loading projects...
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((p) => {
                const isMenuOpen = openMenuProjectId === p._id;
                const curStatusKey = p.projectStatus || p.status || "planned";
                const statusInfo = STATUS_CONFIG[curStatusKey] || STATUS_CONFIG.planned;
                const leadInfo = getLeadInfo(p);
                const curPriority = p.priority || "none";
                const targetDateStr = formatShortDate(p.dueDate);

                return (
                  <div
                    key={p._id}
                    className={`group relative flex items-center px-6 py-2.5 hover:bg-[#13141f] transition-colors select-none ${
                      isMenuOpen ? "bg-[#13141f] z-30" : "z-10"
                    }`}
                  >
                    {/* Left: 3D Isometric Cube Icon + Title + Star */}
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 pr-4">
                      {/* Isometric 3D Cube Icon */}
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#8a8f98] group-hover:text-white transition-colors">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
                          <path d="m3.27 6.96 8.73 4.91 8.73-4.91" />
                          <path d="M12 22.08V12" />
                        </svg>
                      </div>

                      {/* Project Name Link */}
                      <Link
                        href={`/projects/${p._id}`}
                        className="text-[13px] font-medium text-white hover:text-[#5e6ad2] transition-colors truncate"
                      >
                        {p.name}
                      </Link>

                      {/* Interactive Favorite Star */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p._id);
                        }}
                        className="text-[#55596e] hover:text-amber-400 p-0.5 rounded transition-colors cursor-pointer shrink-0"
                        title={favorites.includes(p._id) ? "Favorited" : "Add to favorites"}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            favorites.includes(p._id)
                              ? "fill-amber-400 text-amber-400"
                              : "hover:fill-amber-400/20"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Right Columns: Health, Priority, Lead, Target Date, Status, 3-Dots Action */}
                    <div className="flex items-center gap-6 shrink-0 text-xs">
                      {/* Health (Dashed circle ◌) */}
                      <div className="w-14 flex items-center justify-center text-[#707383]">
                        <svg
                          className="w-3.5 h-3.5 text-[#707383]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        >
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      </div>

                      {/* Priority */}
                      <div
                        className="w-14 flex items-center justify-center text-[#8a8f98] hover:text-white transition-colors"
                        title={PRIORITY_LABELS[curPriority] || "Priority"}
                      >
                        <ProjectPriorityIcon priority={curPriority} className="w-3.5 h-3.5" />
                      </div>

                      {/* Lead */}
                      <div
                        className="w-14 flex items-center justify-center"
                        title={leadInfo.name ? `Lead: ${leadInfo.name}` : "Unassigned"}
                      >
                        {leadInfo.initials === "—" ? (
                          <span className="text-[#55596e] text-xs">—</span>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-semibold tracking-wider shadow-sm">
                            {leadInfo.initials}
                          </div>
                        )}
                      </div>

                      {/* Target Date */}
                      <div className="w-28 flex items-center gap-1.5 text-[11px] truncate">
                        {targetDateStr ? (
                          <>
                            <Calendar className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                            <span className="text-[#f59e0b] truncate">{targetDateStr}</span>
                          </>
                        ) : (
                          <span className="text-[#55596e] pl-1">—</span>
                        )}
                      </div>

                      {/* Status */}
                      <div className={`w-28 flex items-center gap-1.5 text-[11px] ${statusInfo.color}`}>
                        <ProjectStatusIcon status={curStatusKey} className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{statusInfo.label}</span>
                      </div>

                      {/* 3-Dots Actions Menu Button */}
                      <div className="w-8 relative flex items-center justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuProjectId(isMenuOpen ? null : p._id);
                          }}
                          className={`p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer ${
                            isMenuOpen ? "bg-white/[0.08] text-white" : ""
                          }`}
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Action Menu */}
                        <ProjectActionMenu
                          project={p}
                          isOpen={isMenuOpen}
                          onClose={() => setOpenMenuProjectId(null)}
                          onUpdated={() => fetchProjects()}
                          onDeleted={() => {
                            setOpenMenuProjectId(null);
                            fetchProjects();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center min-h-[45vh] text-center px-4 select-none animate-in fade-in duration-200">
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
                <p className="text-[13px] text-[#707383] mb-1.5 font-normal">
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
            )}
          </div>
        </main>
      )}
    </div>
  );
}