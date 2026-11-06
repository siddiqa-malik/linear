"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/workspace/Sidebar";
import { IssueListView } from "@/components/workspace/IssueListView";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { useUI } from "@/context/UIContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import {
  Star,
  Bell,
  Plus,
  SlidersHorizontal,
  Loader2,
  Box,
  PanelRight,
  Filter,
  Search,
} from "lucide-react";

/*
 * IssuesIcon SVG
 * Overlapping rounded rectangles matching Linear's standard Issues icon
 */
function IssuesHeaderIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4.5" width="8.5" height="8.5" rx="1.8" />
      <path d="M5.5 2.5h6a1.8 1.8 0 0 1 1.8 1.8v6" />
    </svg>
  );
}

// 3D Isometric Project Cube
function ProjectCubeIcon({ className = "w-3.5 h-3.5", color = "#10b981" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} style={{ color }}>
      <path d="M8 1.5L14 4.8V11.2L8 14.5L2 11.2V4.8L8 1.5Z" opacity="0.85" />
    </svg>
  );
}

// Team avatar badge
function TeamBadge({ team }: { team: any }) {
  const color = team?.color || "#10b981";
  const name = (team?.name || "").toLowerCase();

  if (team?.icon === "Palette" || name.includes("design")) {
    return (
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
          <circle cx="5" cy="5" r="1.5" />
          <circle cx="11" cy="5" r="1.5" />
          <circle cx="8" cy="11" r="1.5" />
        </svg>
      </div>
    );
  }

  if (team?.icon === "Smile" || name.includes("web") || name.includes("dev")) {
    return (
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
        style={{ backgroundColor: color }}
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
      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[9px] shadow-sm"
      style={{ backgroundColor: color }}
    >
      {team?.name ? team.name.charAt(0).toUpperCase() : "T"}
    </div>
  );
}

export interface UnifiedIssuesViewProps {
  // Scope level: "workspace" | "team" | "project"
  level: "workspace" | "team" | "project";
  teamId?: string;
  projectId?: string;
  teamData?: any;
  projectData?: any;
  hideSidebar?: boolean;
  hideTopHeader?: boolean;
  initialTab?: "all" | "active" | "backlog";
}

/*
 * In-memory global cache for instant page loads & tab transitions (Linear style Stale-While-Revalidate).
 * Stores issues list, projects, and teams mapped to the view level and scope key.
 */
interface IssuesCacheEntry {
  tasks: Task[];
  projects: any[];
  teams: any[];
  timestamp: number;
}
const issuesViewCache = new Map<string, IssuesCacheEntry>();

/*
 * UnifiedIssuesView Component
 *
 * Single, unified component handling all three levels of issues in TaskFlow:
 * 1. Workspace Level (/issues)
 * 2. Team Level (/teams/[teamId]/issues)
 * 3. Project Level (/projects/[projectId] -> Issues tab)
 *
 * Ensures 100% UI consistency, identical Linear subheaders, tabs (Active, Backlog, All),
 * and shared single source of truth across all views using clean ternary logic.
 */
export function UnifiedIssuesView({
  level,
  teamId,
  projectId,
  teamData: initialTeamData,
  projectData: initialProjectData,
  hideSidebar = false,
  hideTopHeader = false,
  initialTab,
}: UnifiedIssuesViewProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const { activeIssueId, setActiveIssueId, setCreateModalOpen } = useUI();

  // Cache key per view scope
  const cacheKey = `${level}:${projectId || teamId || currentWorkspace?._id || "workspace"}`;
  const cachedData = issuesViewCache.get(cacheKey);

  // State: Initialize with cached data for 0ms immediate render
  const [tasks, setTasks] = useState<Task[]>(() => cachedData?.tasks || []);
  const [projects, setProjects] = useState<any[]>(() => cachedData?.projects || []);
  const [teams, setTeams] = useState<any[]>(() => cachedData?.teams || []);
  const [team, setTeam] = useState<any>(initialTeamData || null);
  const [project, setProject] = useState<any>(initialProjectData || null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedData && (!tasks || tasks.length === 0));
  const [isStarred, setIsStarred] = useState(false);
  const [isGithubImportOpen, setIsGithubImportOpen] = useState(false);

  // Tabs: "active" | "backlog" | "all"
  const [tab, setTab] = useState<"active" | "backlog" | "all">(initialTab || "all");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("all");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all");

  // Refs to hold current values without triggering re-fetch cycles
  const projectsRef = useRef<any[]>([]);
  projectsRef.current = projects;
  const teamsRef = useRef<any[]>([]);
  teamsRef.current = teams;
  const cacheKeyRef = useRef<string>(cacheKey);
  cacheKeyRef.current = cacheKey;

  /*
   * High performance fetch:
   * 1. If we already have tasks in memory/cache, never show the full-screen loader (silent background sync).
   * 2. Renders issues immediately as soon as the issues endpoint resolves; does not wait for auxiliary metadata.
   */
  const fetchData = useCallback(
    async (isSilent = false) => {
      const hasExistingData = tasks.length > 0 || issuesViewCache.has(cacheKey);
      const shouldShowSpinner = !isSilent && !hasExistingData;

      if (shouldShowSpinner) {
        setIsLoading(true);
      }

      try {
        const wsParam = currentWorkspace?._id ? `?workspaceId=${currentWorkspace._id}` : "";

        if (level === "project" && projectId) {
          // Level 3: Project Level
          const [projRes, issuesRes] = await Promise.all([
            initialProjectData ? Promise.resolve(initialProjectData) : api.get(`/projects/${projectId}`).catch(() => null),
            api.get(`/issues?projectId=${projectId}`).catch(() => []),
          ]);

          const rawList = issuesRes?.data || issuesRes || [];
          const projectOnly = Array.isArray(rawList)
            ? rawList.filter((t: any) => {
                const pId = typeof t.projectId === "object" ? t.projectId?._id : t.projectId;
                return pId && pId.toString() === projectId.toString();
              })
            : [];

          setTasks(projectOnly);
          const pData = projRes?.data || projRes;
          if (pData) setProject(pData);

          issuesViewCache.set(cacheKey, {
            tasks: projectOnly,
            projects: pData ? [pData] : [],
            teams: [],
            timestamp: Date.now(),
          });
        } else if (level === "team" && teamId) {
          // Level 2: Team Level
          const [teamRes, projRes, issuesRes] = await Promise.all([
            initialTeamData ? Promise.resolve(initialTeamData) : api.get(`/teams/${teamId}`).catch(() => null),
            api.get("/projects").catch(() => []),
            api.get(`/issues?teamId=${teamId}`).catch(() => []),
          ]);

          const tData = teamRes?.team || teamRes?.data || teamRes;
          if (tData) setTeam(tData);

          const allProjs: any[] = projRes?.data || projRes || [];
          setProjects(allProjs);

          const teamOnly = issuesRes?.data || issuesRes || [];
          if (Array.isArray(teamOnly)) {
            setTasks(teamOnly);
          }

          issuesViewCache.set(cacheKey, {
            tasks: Array.isArray(teamOnly) ? teamOnly : [],
            projects: allProjs,
            teams: tData ? [tData] : [],
            timestamp: Date.now(),
          });
        } else {
          // Level 1: Workspace Level
          const [teamsRes, projRes, issuesRes] = await Promise.all([
            api.get(`/teams${wsParam}`).catch(() => []),
            api.get("/projects").catch(() => []),
            api.get(`/issues${wsParam}`).catch(() => []),
          ]);

          const teamList = teamsRes?.data || teamsRes || [];
          if (Array.isArray(teamList)) setTeams(teamList);

          const projList = projRes?.data || projRes || [];
          if (Array.isArray(projList)) setProjects(projList);

          const taskList = issuesRes?.data || issuesRes || [];
          if (Array.isArray(taskList)) setTasks(taskList);

          issuesViewCache.set(cacheKey, {
            tasks: Array.isArray(taskList) ? taskList : [],
            projects: Array.isArray(projList) ? projList : [],
            teams: Array.isArray(teamList) ? teamList : [],
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        console.error("Failed to load issues:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [level, teamId, projectId, currentWorkspace?._id, initialTeamData, initialProjectData, cacheKey]
  );

  useEffect(() => {
    fetchData();

    // Live sync on task creation
    const handleCreated = (e: any) => {
      const newTask = e?.detail;
      if (newTask && newTask._id) {
        const pId = typeof newTask.projectId === "object" ? newTask.projectId?._id : newTask.projectId;
        const taskTeamId = typeof newTask.teamId === "object" ? newTask.teamId?._id : newTask.teamId;

        // Check whether task is relevant to current level
        let isRelevant = false;
        if (level === "project") {
          isRelevant = Boolean(pId && pId.toString() === projectId?.toString());
        } else if (level === "team") {
          isRelevant =
            (taskTeamId && taskTeamId.toString() === teamId?.toString()) ||
            (pId && projectsRef.current.some((p) => p._id?.toString() === pId?.toString()));
        } else {
          isRelevant = true;
        }

        if (isRelevant) {
          setTasks((prev) => {
            const next = [newTask, ...prev.filter((t) => t._id !== newTask._id)];
            issuesViewCache.set(cacheKeyRef.current, {
              tasks: next,
              projects: projectsRef.current,
              teams: teamsRef.current,
              timestamp: Date.now(),
            });
            return next;
          });
        }
      }
      fetchData(true); // Silent background sync without full-screen loading spinner
    };

    window.addEventListener("taskflow:task-created", handleCreated);
    return () => {
      window.removeEventListener("taskflow:task-created", handleCreated);
    };
  }, [fetchData, level, teamId, projectId]);

  // Keyboard shortcut listener: Press "C" to create a new issue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if ((e.key === "c" || e.key === "C") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setCreateModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCreateModalOpen]);

  // Filter tasks based on current tab, filters, and search
  const filteredTasks = tasks.filter((t) => {
    // 1. Tab filter
    const s = (t.status || "").toLowerCase();
    if (tab === "active") {
      const isActive =
        s === "todo" ||
        s === "unstarted" ||
        s === "in-progress" ||
        s === "started" ||
        s === "in_progress";
      if (!isActive) return false;
    } else if (tab === "backlog") {
      if (s !== "backlog") return false;
    }

    // 2. Team filter (workspace level only)
    if (level === "workspace" && selectedTeamFilter !== "all") {
      const tId = typeof t.teamId === "object" ? t.teamId?._id : t.teamId;
      if (tId?.toString() !== selectedTeamFilter) return false;
    }

    // 3. Project filter (workspace and team levels)
    if (level !== "project" && selectedProjectFilter !== "all") {
      const pId = typeof t.projectId === "object" ? t.projectId?._id : t.projectId;
      if (pId?.toString() !== selectedProjectFilter) return false;
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = t.title?.toLowerCase().includes(q) || false;
      const descMatch = t.description?.toLowerCase().includes(q) || false;
      const idMatch = (t as any).identifier?.toLowerCase().includes(q) || false;
      if (!titleMatch && !descMatch && !idMatch) return false;
    }

    return true;
  });

  const content = (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0f1017]">
      {/* ============================================================== */}
      {/* 1. TOP HEADER: Breadcrumbs + Actions (if !hideTopHeader)        */}
      {/* ============================================================== */}
      {!hideTopHeader && (
        <div className="h-11 px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f1017]/80 backdrop-blur-md sticky top-0 z-20">
          {/* Left: Breadcrumbs + Star */}
          <div className="flex items-center gap-2">
            {level === "team" && team ? (
              <>
                <TeamBadge team={team} />
                <Link
                  href={`/teams/${teamId}`}
                  className="text-[13px] font-medium text-white hover:text-white/80 transition cursor-pointer"
                >
                  {team?.name || "Team"}
                </Link>
                <span className="text-[#626674] text-xs font-mono">›</span>
                <span className="text-[13px] font-medium text-white">Issues</span>
              </>
            ) : level === "project" && project ? (
              <>
                <ProjectCubeIcon className="w-3.5 h-3.5" />
                <Link
                  href={`/projects/${projectId}`}
                  className="text-[13px] font-medium text-white hover:text-white/80 transition cursor-pointer"
                >
                  {project?.name || "Project"}
                </Link>
                <span className="text-[#626674] text-xs font-mono">›</span>
                <span className="text-[13px] font-medium text-white">Issues</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded flex items-center justify-center bg-[#5e6ad2]/15 text-[#858fe8]">
                  <IssuesHeaderIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-medium text-white hover:text-white/80 transition cursor-pointer">
                  {currentWorkspace?.name || "Workspace"}
                </span>
                <span className="text-[#626674] text-xs font-mono">›</span>
                <span className="text-[13px] font-medium text-white">Issues</span>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsStarred(!isStarred)}
              className={`p-1 rounded hover:bg-white/[0.06] transition cursor-pointer ml-0.5 ${
                isStarred ? "text-amber-400" : "text-[#8a8f98] hover:text-white"
              }`}
              title={isStarred ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="w-3.5 h-3.5" fill={isStarred ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Right: Notification Bell + New Issue Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/inbox")}
              className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsGithubImportOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161726] hover:bg-[#1f2133] text-[#c5c8d6] hover:text-white text-xs font-medium border border-white/[0.08] transition cursor-pointer shadow-sm"
              title="Import issues from GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import from GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New issue</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SUBHEADER: Tabs (Active, Backlog, All issues) + Filter Icons */}
      {/* ============================================================== */}
      <div className="h-10 px-6 border-b border-white/[0.04] flex items-center justify-between shrink-0 bg-[#0f1017]">
        {/* Left: Pill Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab("active")}
            className={`px-2.5 py-1 rounded-md text-[12.5px] transition cursor-pointer ${
              tab === "active"
                ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() => setTab("backlog")}
            className={`px-2.5 py-1 rounded-md text-[12.5px] transition cursor-pointer ${
              tab === "backlog"
                ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            Backlog
          </button>

          <button
            type="button"
            onClick={() => setTab("all")}
            className={`px-2.5 py-1 rounded-md text-[12.5px] transition cursor-pointer ${
              tab === "all"
                ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            All issues
          </button>

          <div className="pl-1 text-[#626674]">
            <Box className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Right: Search, Filter Dropdowns, & Layout Buttons */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#707383] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                level === "project"
                  ? "Filter project issues..."
                  : level === "team"
                  ? "Filter team issues..."
                  : "Filter workspace issues..."
              }
              className="w-36 sm:w-44 h-7 pl-8 pr-2.5 rounded-md bg-[#161726]/80 border border-white/[0.06] text-xs text-white placeholder-[#626674] focus:outline-none focus:border-[#5e6ad2] transition"
            />
          </div>

          {/* Team Filter (Workspace level only) */}
          {level === "workspace" && teams.length > 0 && (
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="h-7 px-2 rounded-md bg-[#161726]/80 border border-white/[0.06] text-xs text-[#c5c8d6] focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
              title="Filter by team"
            >
              <option value="all">All teams</option>
              {teams.map((tm) => (
                <option key={tm._id} value={tm._id}>
                  {tm.name}
                </option>
              ))}
            </select>
          )}

          {/* Project Filter (Workspace & Team levels) */}
          {level !== "project" && projects.length > 0 && (
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="h-7 px-2 rounded-md bg-[#161726]/80 border border-white/[0.06] text-xs text-[#c5c8d6] focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
              title="Filter by project"
            >
              <option value="all">All projects</option>
              {projects.map((pr) => (
                <option key={pr._id} value={pr._id}>
                  {pr.name}
                </option>
              ))}
            </select>
          )}

          {/* Filter button */}
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-md bg-[#161726]/60 hover:bg-[#161726] border border-white/[0.06] text-[#8a8f98] hover:text-white transition cursor-pointer"
            title="Filter issues"
          >
            <Filter className="w-3 h-3" />
          </button>

          {/* Display options */}
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-md bg-[#161726]/60 hover:bg-[#161726] border border-white/[0.06] text-[#8a8f98] hover:text-white transition cursor-pointer"
            title="Display options"
          >
            <SlidersHorizontal className="w-3 h-3" />
          </button>

          {/* Layout toggle */}
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-md bg-[#161726]/60 hover:bg-[#161726] border border-white/[0.06] text-[#8a8f98] hover:text-white transition cursor-pointer"
            title="Layout toggle"
          >
            <PanelRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN BODY: Issues List OR Centered Empty State               */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0f1017] w-full">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-xs text-[#8a8f98] py-16">
            <Loader2 className="w-5 h-5 animate-spin text-[#5e6ad2]" />
            <span>Loading issues...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          /* Linear Centered Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto p-6 animate-in fade-in duration-200">
            <h2 className="text-[18px] sm:text-[19px] font-semibold text-white tracking-tight mb-2">
              {tab === "active"
                ? "Active issues"
                : tab === "backlog"
                ? "Backlog"
                : "All issues"}
            </h2>

            <p className="text-[12.5px] text-[#8a8f98] leading-relaxed max-w-[360px] mb-6">
              {tab === "all"
                ? level === "project"
                  ? `All issues is the place where you can see all deliverables and tasks for ${project?.name || "this project"} in one view.`
                  : level === "team"
                  ? `All issues is the place where you can see all your team's work in one view. Once you have created issues for this team, they will show up here.`
                  : "All issues is the place where you can see all workspace work in one view. Once you have created issues, they will show up here."
                : tab === "active"
                ? level === "project"
                  ? "Active issues are items currently in progress or waiting to be started for this project."
                  : "Active issues are items currently in progress or waiting to be started."
                : level === "project"
                ? "Backlog is the place where you can plan and store upcoming work for this project."
                : "Backlog is the place where you can plan and store upcoming work."}
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer shadow-md shadow-[#5e6ad2]/25"
              >
                <span>Create new issue</span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-white font-mono text-[10px]">
                  C
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsGithubImportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1c1e2e] hover:bg-[#25283d] border border-white/[0.08] text-[#c5c8d6] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Import from GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => window.open("https://linear.app/docs", "_blank")}
                className="px-3.5 py-1.5 rounded-lg bg-[#1c1e2e] hover:bg-[#25283d] border border-white/[0.08] text-[#c5c8d6] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                Documentation
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <IssueListView
              tasks={filteredTasks}
              projects={projects}
              groupTitle={tab === "active" ? "Active" : tab === "backlog" ? "Backlog" : "All issues"}
              onTaskClick={(id) => setActiveIssueId(id)}
              onNewIssue={() => setCreateModalOpen(true)}
              onNewIssueWithStatus={() => setCreateModalOpen(true)}
              onTaskUpdated={fetchData}
            />
          </div>
        )}
      </main>

      {/* Drawer */}
      <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchData} />

      {/* GitHub Import Modal */}
      <GitHubImportModal
        isOpen={isGithubImportOpen}
        onClose={() => setIsGithubImportOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
        defaultTeamId={teamId}
        defaultProjectId={projectId}
      />
    </div>
  );

  if (hideSidebar) {
    return content;
  }

  return (
    <div className="flex h-screen bg-[#0f1017] text-[#e2e4ef] overflow-hidden select-none font-sans">
      <Sidebar />
      {content}
    </div>
  );
}

