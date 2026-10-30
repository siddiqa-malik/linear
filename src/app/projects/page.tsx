"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/workspace/Sidebar";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { ProjectActionMenu } from "@/components/projects/ProjectActionMenu";
import { ProjectStatusIcon } from "@/components/common/ProjectStatusIcon";
import { ProjectPriorityIcon } from "@/components/common/ProjectPriorityIcon";
import { useUI } from "@/context/UIContext";
import { AuthGuard } from "@/components/common/AuthGuard";
import { api } from "@/lib/api";
import { Project } from "@/types/project";
import {
  Plus,
  Calendar,
  SlidersHorizontal,
  Star,
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

// Team Avatar matching Linear design
function TeamAvatar({
  team,
  className = "w-4 h-4 text-[9px]",
}: {
  team?: { name?: string; color?: string; icon?: string } | null;
  className?: string;
}) {
  if (!team) return null;
  const color = team.color || "#10b981";
  const name = (team.name || "").toLowerCase();

  if (team.icon === "Palette" || name.includes("design")) {
    return (
      <div
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
        title={team.name}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
          <circle cx="5" cy="5" r="1.5" />
          <circle cx="11" cy="5" r="1.5" />
          <circle cx="8" cy="11" r="1.5" />
        </svg>
      </div>
    );
  }

  if (team.icon === "Smile" || name.includes("web") || name.includes("dev")) {
    return (
      <div
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
        title={team.name}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5">
          <circle cx="8" cy="8" r="6" />
          <path d="M5.5 9.5C6.2 10.5 7.1 11 8 11C8.9 11 9.8 10.5 10.5 9.5" strokeLinecap="round" />
          <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-full flex items-center justify-center shrink-0 text-white font-bold shadow-sm`}
      style={{ backgroundColor: color }}
      title={team.name}
    >
      {team.name ? team.name.charAt(0).toUpperCase() : "T"}
    </div>
  );
}

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamFilter = searchParams?.get("team");

  const { setCreateProjectModalOpen } = useUI();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentTeam, setCurrentTeam] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "backlog" | "active" | "closed">("all");
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!teamFilter) {
      setCurrentTeam(null);
      return;
    }
    api.get(`/teams/${teamFilter}`)
      .then((res) => {
        const t = res?.team || res?.data || res;
        if (t && (t._id || t.name)) setCurrentTeam(t);
      })
      .catch(() => {});
  }, [teamFilter]);

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
                teamId: p.teamId || meta.teamId,
                teamName: p.teamName || meta.teamName,
                teamKey: p.teamKey || meta.teamKey,
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

  // Filter projects strictly:
  // When teamFilter is active: only show projects belonging to that team.
  // When teamFilter is NOT active (main /projects): show ALL projects.
  const filteredProjects = projects.filter((p) => {
    if (teamFilter) {
      const pTeamId = typeof p.teamId === "object" ? p.teamId?._id : p.teamId;
      const pTeamName = (p.teamName || "").toLowerCase().trim();
      const targetTeamName = (currentTeam?.name || "").toLowerCase().trim();

      let isMatch = false;

      // 1. Direct ID match
      if (pTeamId && pTeamId === teamFilter) {
        isMatch = true;
      }
      // 2. Direct Team Name match
      else if (pTeamName && targetTeamName && pTeamName === targetTeamName) {
        isMatch = true;
      }
      // 3. Fallback ID match
      else if (
        (pTeamId === "team-des" || pTeamId === "default-team") &&
        (targetTeamName.includes("design") || teamFilter.toLowerCase().includes("des"))
      ) {
        isMatch = true;
      }
      else if (
        (pTeamId === "team-dev" || pTeamId === "default-team-dev") &&
        (targetTeamName.includes("web") || targetTeamName.includes("dev") || teamFilter.toLowerCase().includes("dev"))
      ) {
        isMatch = true;
      }
      // 4. Legacy fallback if project has neither teamId nor teamName
      else if (!pTeamId && !pTeamName) {
        const pName = (p.name || "").toLowerCase();
        if (targetTeamName && pName.includes(targetTeamName)) isMatch = true;
        if (targetTeamName.includes("design") && pName.includes("1")) isMatch = true;
        if ((targetTeamName.includes("web") || targetTeamName.includes("dev")) && pName.includes("2")) isMatch = true;
      }

      if (!isMatch) return false;
    }

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
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[#0e0f15]">
        <Sidebar />

        {viewMode === "timeline" ? (
          <RoadmapTimeline
            projects={filteredProjects}
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
            breadcrumb={currentTeam ? `${currentTeam.name} › Projects` : "Projects"}
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
              {/* Left: Team Breadcrumb or Projects label, "All projects" tab pill, + New view */}
              <div className="flex items-center gap-2.5">
                {currentTeam ? (
                  <div className="flex items-center gap-2">
                    <TeamAvatar team={currentTeam} />
                    <Link
                      href={`/teams/${currentTeam._id}`}
                      className="text-[13px] font-medium text-[#8a8f98] hover:text-white transition"
                    >
                      {currentTeam.name}
                    </Link>
                    <span className="text-[#626674] text-xs font-mono">›</span>
                    <span className="text-[13px] font-medium text-white">Projects</span>
                  </div>
                ) : (
                  <span className="text-[13px] font-medium text-[#8a8f98]">Projects</span>
                )}

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
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
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
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      viewMode === "list" ? "bg-[#24273c] text-white shadow-sm" : "text-[#707383] hover:text-white"
                    }`}
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
                      onClick={() => router.push(`/projects/${p._id}`)}
                      className={`group relative flex items-center px-6 py-2.5 hover:bg-[#13141f] transition-colors select-none cursor-pointer ${
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
                          onClick={(e) => e.stopPropagation()}
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
                              isMenuOpen ? "text-white bg-white/[0.08]" : ""
                            }`}
                            title="More actions"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                              <circle cx="8" cy="3" r="1.5" />
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                            </svg>
                          </button>

                          {/* Linear 3-dots Context Menu */}
                          {isMenuOpen && (
                            <ProjectActionMenu
                              project={p}
                              isOpen={isMenuOpen}
                              onClose={() => setOpenMenuProjectId(null)}
                              onUpdated={fetchProjects}
                              onDeleted={fetchProjects}
                            />
                          )}
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
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {currentTeam ? `No projects in ${currentTeam.name}` : "No projects found"}
                  </h3>
                  <p className="text-[12.5px] text-[#8a8f98] max-w-sm mb-4">
                    {currentTeam
                      ? `Start organizing work, tracking roadmaps and milestones specifically for ${currentTeam.name}.`
                      : "No active or planned projects found."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setCreateProjectModalOpen(true)}
                    className="h-7 px-3.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create a new project</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </AuthGuard>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0e0f15]" />}>
      <ProjectsContent />
    </Suspense>
  );
}