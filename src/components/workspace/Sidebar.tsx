"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import {
  Inbox,
  Target,
  Plus,
  Search,
  Edit3,
  ChevronDown,
  Check,
  Settings,
  Flag,
  BookOpen,
  X,
  MoreHorizontal,
  Map as MapIcon,
  Smile,
} from "lucide-react";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";

interface TeamItem {
  _id: string;
  name: string;
  key?: string;
  color?: string;
  icon?: string;
}

/* ============================================================== */
/* EXACT SVG ICONS MATCHING LINEAR USER SCREENSHOT                */
/* ============================================================== */

// Small solid downward triangle matching screenshot
function CaretDown({
  className = "w-2 h-2",
  isExpanded = true,
}: {
  className?: string;
  isExpanded?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="currentColor"
      className={`${className} transition-transform duration-150 ${
        isExpanded ? "rotate-0" : "-rotate-90"
      }`}
    >
      <path d="M2.5 3.5L5 6.5L7.5 3.5H2.5Z" />
    </svg>
  );
}

// Isometric 3D Cube Icon matching "Projects" in screenshot
function ProjectCubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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
      <path d="M8 1.75L14 5.2V11.2L8 14.65L2 11.2V5.2L8 1.75Z" />
      <path d="M8 1.75V14.65" />
      <path d="M2 5.2L8 8.65L14 5.2" />
    </svg>
  );
}

// Stacked Rhombus / Layers Icon matching "Views" in screenshot
function ViewsIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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
      <path d="M8 1.75L14 5L8 8.25L2 5L8 1.75Z" />
      <path d="M2 7.75L8 11L14 7.75" />
      <path d="M2 10.75L8 14L14 10.75" />
    </svg>
  );
}

// House icon matching "Home" under team in screenshot
function HomeNavIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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
      <path d="M2.5 6.5L8 2L13.5 6.5V13.5A1 1 0 0 1 12.5 14.5H3.5A1 1 0 0 1 2.5 13.5V6.5Z" />
      <path d="M6 14.5V9.5H10V14.5" />
    </svg>
  );
}

// Overlapping rounded squares matching Linear "Issues" in screenshot
function IssueIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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

// Team Avatar matching green design / smiley icons from screenshot
function TeamAvatar({ team }: { team: TeamItem }) {
  const color = team.color || "#10b981";
  const name = (team.name || "").toLowerCase();

  // If team is designer or design
  if (team.icon === "Palette" || name.includes("design")) {
    return (
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
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

  // If team is web developer or dev (renders green smile face from screenshot)
  if (team.icon === "Smile" || name.includes("web") || name.includes("dev")) {
    return (
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
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

  // If team is code / terminal
  if (team.icon === "Terminal" || name.includes("tech") || name.includes("code")) {
    return (
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
        style={{ backgroundColor: color }}
        title={team.name}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5">
          <path d="M4 6L6.5 8L4 10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10H12" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default clean badge with first letter of team name
  return (
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[9px] shadow-sm"
      style={{ backgroundColor: color }}
      title={team.name}
    >
      {team.name ? team.name.charAt(0).toUpperCase() : "T"}
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { setCommandPaletteOpen, setCreateModalOpen } = useUI();
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    sanitizeWorkspaceName,
  } = useWorkspace();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showImportBanner, setShowImportBanner] = useState(true);

  // Sections collapsible state
  const [isWorkspaceSectionExpanded, setIsWorkspaceSectionExpanded] = useState(true);
  const [isYourTeamsSectionExpanded, setIsYourTeamsSectionExpanded] = useState(true);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Dynamic teams state
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  const workspaceName = currentWorkspace
    ? sanitizeWorkspaceName(currentWorkspace.name)
    : user?.name
    ? `${user.name}'s Workspace`
    : "My Workspace";

  const handleSwitchWorkspace = (ws: any) => {
    setCurrentWorkspace(ws);
    setIsWorkspaceMenuOpen(false);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Keyboard shortcut listener for ⌥ ⇧ Q (Alt+Shift+Q) logout
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault();
        handleLogout();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch teams dynamically from MongoDB for the current active workspace
  const fetchTeams = useCallback(async () => {
    if (!currentWorkspace?._id) {
      setTeams([]);
      return;
    }
    try {
      setIsLoadingTeams(true);
      const res = await api.get(`/teams?workspaceId=${currentWorkspace._id}`);
      const list = res?.data || res || [];
      if (Array.isArray(list)) {
        setTeams(list);
        setExpandedTeams((prev) => {
          const next = { ...prev };
          list.forEach((t: any) => {
            if (next[t._id] === undefined) {
              next[t._id] = true; // Default expanded so sub-items (Home, Issues, Projects, Views) are visible
            }
          });
          return next;
        });
      } else {
        setTeams([]);
      }
    } catch (err) {
      console.warn("Sidebar: could not load teams:", err);
      setTeams([]);
    } finally {
      setIsLoadingTeams(false);
    }
  }, [currentWorkspace?._id]);

  useEffect(() => {
    fetchTeams();
    window.addEventListener("taskflow_team_created", fetchTeams);
    window.addEventListener("taskflow_team_updated", fetchTeams);
    window.addEventListener("taskflow_team_deleted", fetchTeams);
    return () => {
      window.removeEventListener("taskflow_team_created", fetchTeams);
      window.removeEventListener("taskflow_team_updated", fetchTeams);
      window.removeEventListener("taskflow_team_deleted", fetchTeams);
    };
  }, [fetchTeams]);

  const toggleTeamExpanded = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: prev[teamId] === false ? true : false,
    }));
  };

  // User initials for circular badge
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside className="w-56 h-screen flex flex-col bg-[#0f1017] border-r border-white/[0.06] text-[#e6e7ee] select-none text-[13px] shrink-0 font-sans">
      {/* ============================================================== */}
      {/* 1. TOP ROW: WORKSPACE NAME & LOGO + AVATAR                      */}
      {/* ============================================================== */}
      <div className="relative flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]">
        {/* Workspace Switcher Trigger */}
        <button
          type="button"
          onClick={() => {
            setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen);
            setIsProfileMenuOpen(false);
          }}
          className="flex items-center gap-2 hover:bg-white/[0.05] p-1 rounded-md transition cursor-pointer max-w-[160px] text-left"
          title="Switch or manage workspace"
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#e8590c] text-white text-[11px] font-bold">
            {workspaceName.slice(0, 2).toUpperCase() || "WS"}
          </div>
          <span className="truncate text-[13px] font-medium text-white tracking-tight">
            {workspaceName}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#8a8f98] shrink-0 transition-transform duration-200 ${
              isWorkspaceMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* User profile avatar on top right with POPUP */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsWorkspaceMenuOpen(false);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0ca678] text-white text-[10px] font-semibold hover:opacity-90 transition cursor-pointer ring-offset-1 focus:outline-none"
            title={user?.email || "Account"}
          >
            {userInitials}
          </button>

          {/* Profile Menu Popup - Opens on the RIGHT side of the profile/sidebar */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div className="absolute left-full ml-3 top-0 z-50 w-56 rounded-xl border border-white/[0.1] bg-[#161722] p-1.5 text-[#e6e7ee] shadow-2xl shadow-black/80 select-none animate-in fade-in zoom-in-95 duration-150 font-sans">
                {/* Item 1: View profile */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>View profile</span>
                  <span className="text-[11px] text-[#707383] font-normal">O then M</span>
                </button>

                {/* Item 2: Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Settings</span>
                  <span className="text-[11px] text-[#707383] font-normal">G then S</span>
                </button>

                {/* Item 3: Download desktop app */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    window.open("https://linear.app/download", "_blank");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Download desktop app</span>
                </button>

                {/* Divider 1 */}
                <div className="my-1 border-t border-white/[0.08]" />

                {/* Item 4: Help */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    window.open("https://linear.app/docs", "_blank");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Help</span>
                  <span className="text-[12px] text-[#707383] font-medium">?</span>
                </button>

                {/* Item 5: Changelog */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    window.open("https://linear.app/changelog", "_blank");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Changelog</span>
                </button>

                {/* Item 6: Documentation */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    window.open("https://linear.app/docs", "_blank");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Documentation</span>
                </button>

                {/* Item 7: Join Slack community */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    window.open("https://linear.app/community", "_blank");
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Join Slack community</span>
                </button>

                {/* Divider 2 */}
                <div className="my-1 border-t border-white/[0.08]" />

                {/* Item 8: Log out (Redirects immediately to Home Page!) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#c5c8d6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                >
                  <span>Log out</span>
                  <span className="text-[12px] text-[#707383] font-normal tracking-wide">⌥ ⇧ Q</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Workspace Switcher Modal Dropdown */}
        {isWorkspaceMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsWorkspaceMenuOpen(false)}
            />
            <div className="absolute left-2 top-full mt-2 w-64 rounded-xl bg-[#141521] border border-[#2a2c42] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 select-none text-left">
              <div className="px-2 py-1 text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                Workspaces
              </div>

              <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
                {workspaces.map((ws) => {
                  const isCurrent = currentWorkspace?._id === ws._id;
                  const cleanName = sanitizeWorkspaceName(ws.name);
                  return (
                    <button
                      key={ws._id}
                      type="button"
                      onClick={() => handleSwitchWorkspace(ws)}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition cursor-pointer ${
                        isCurrent
                          ? "bg-[#1f2133] text-white font-medium"
                          : "text-[#8a8f98] hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#e8590c] text-[9px] font-bold text-white">
                          {cleanName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate">{cleanName}</span>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 text-[#5e6ad2]" />}
                    </button>
                  );
                })}
              </div>

              <div className="my-1 border-t border-[#24263a]/60" />

              <button
                type="button"
                onClick={() => {
                  setIsWorkspaceMenuOpen(false);
                  router.push("/onboarding");
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#8a8f98] hover:bg-white/[0.04] hover:text-white transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-[#5e6ad2]" />
                <span>Create new workspace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWorkspaceMenuOpen(false);
                  router.push("/settings");
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#8a8f98] hover:bg-white/[0.04] hover:text-white transition cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Workspace settings</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. ACTION BUTTONS: [ ✏ New issue ]  [ 🔍 ]                      */}
      {/* ============================================================== */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="flex-1 flex items-center gap-2 h-7 px-2.5 rounded-md bg-[#161722] hover:bg-[#1f202e] border border-white/[0.08] text-xs text-[#c5c8d6] hover:text-white transition font-normal cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#8a8f98]" />
          <span>New issue</span>
        </button>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="h-7 w-7 flex items-center justify-center rounded-md bg-[#161722] hover:bg-[#1f202e] border border-white/[0.08] text-[#8a8f98] hover:text-white transition cursor-pointer"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. NAVIGATION AREA                                              */}
      {/* ============================================================== */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
        {/* Pinned top items: Inbox & My issues */}
        <div className="px-2 space-y-0.5">
          <Link
            href="/inbox"
            className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${
              pathname === "/inbox"
                ? "bg-white/[0.08] text-white font-medium"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox</span>
          </Link>

          <Link
            href="/my-issues"
            className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${
              pathname === "/my-issues"
                ? "bg-white/[0.08] text-white font-medium"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>My issues</span>
          </Link>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: "Workspace ▾" (Projects, Views, More)               */}
        {/* ============================================================== */}
        <div className="px-2">
          {/* Header matching screenshot: Workspace ▾ */}
          <button
            type="button"
            onClick={() => setIsWorkspaceSectionExpanded(!isWorkspaceSectionExpanded)}
            className="flex items-center gap-1.5 px-2 py-1 text-[13px] font-medium text-[#d1d5db] hover:text-white transition w-full text-left cursor-pointer select-none"
          >
            <span>Workspace</span>
            <CaretDown className="w-2 h-2 text-[#8a8f98]" isExpanded={isWorkspaceSectionExpanded} />
          </button>

          {/* Sub-items under Workspace */}
          {isWorkspaceSectionExpanded && (
            <div className="mt-0.5 space-y-0.5">
              {/* Issues */}
              <Link
                href="/issues"
                className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${
                  (pathname === "/issues" || pathname === "/issues/active" || pathname === "/issues/backlog") &&
                  !searchParams?.get("team")
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <IssueIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                <span>Issues</span>
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${
                  pathname === "/projects" && !searchParams?.get("team")
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <ProjectCubeIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                <span>Projects</span>
              </Link>

              {/* Views */}
              <Link
                href="/views"
                className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${
                  pathname === "/views" && !searchParams?.get("team")
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <ViewsIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                <span>Views</span>
              </Link>

              {/* More */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="flex items-center justify-between w-full px-2 py-1 rounded-md text-[13px] text-[#8a8f98] hover:text-white hover:bg-white/[0.03] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MoreHorizontal className="w-3.5 h-3.5 text-[#8a8f98]" />
                    <span>More</span>
                  </div>
                  <ChevronDown
                    className={`w-3 h-3 text-[#626674] transition-transform ${
                      isMoreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMoreOpen && (
                  <div className="mt-0.5 pl-6 space-y-0.5">
                    <Link
                      href="/roadmaps"
                      className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                        pathname === "/roadmaps"
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Roadmaps</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: "Your teams ▾" (Dynamic from MongoDB Database)       */}
        {/* ============================================================== */}
        <div className="px-2">
          {/* Header matching screenshot: Your teams ▾ */}
          <div className="flex items-center justify-between px-2 py-1 group">
            <button
              type="button"
              onClick={() => setIsYourTeamsSectionExpanded(!isYourTeamsSectionExpanded)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#d1d5db] hover:text-white transition cursor-pointer select-none"
            >
              <span>Your teams</span>
              <CaretDown className="w-2 h-2 text-[#8a8f98]" isExpanded={isYourTeamsSectionExpanded} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/settings/teams/new")}
              className="opacity-0 group-hover:opacity-100 hover:text-white text-[#8a8f98] p-0.5 rounded transition cursor-pointer"
              title="Create new team"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dynamic List of Teams */}
          {isYourTeamsSectionExpanded && (
            <div className="mt-0.5 space-y-1">
              {isLoadingTeams && teams.length === 0 ? (
                <div className="py-2 px-3 text-xs text-[#8a8f98] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] animate-pulse" />
                  <span>Loading teams...</span>
                </div>
              ) : teams.length === 0 ? (
                <div className="px-3 py-2 text-xs text-[#8a8f98]">
                  <p className="text-[11px] text-[#626674] mb-1.5">No teams yet</p>
                  <Link
                    href="/settings/teams/new"
                    className="text-[12px] text-[#5e6ad2] hover:text-[#7884ea] font-medium flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create a team</span>
                  </Link>
                </div>
              ) : (
                teams.map((team) => {
                  const isTeamExpanded = expandedTeams[team._id] !== false; // Default expanded true
                  const isCurrentTeamSelected =
                    searchParams?.get("team") === team._id ||
                    pathname === `/teams/${team._id}` ||
                    pathname === `/teams/${team._id}/issues`;

                  return (
                    <div key={team._id} className="space-y-0.5">
                      {/* Team Header Row: [icon] team_name ▾ */}
                      <button
                        type="button"
                        onClick={() => toggleTeamExpanded(team._id)}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[13px] font-medium transition cursor-pointer group hover:bg-white/[0.04] ${
                          isCurrentTeamSelected ? "text-white" : "text-[#e2e4ee]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <TeamAvatar team={team} />
                          <span className="truncate">{team.name}</span>
                        </div>
                        <CaretDown
                          className="w-2 h-2 text-[#8a8f98] group-hover:text-white shrink-0 ml-1"
                          isExpanded={isTeamExpanded}
                        />
                      </button>

                      {/* 4 Indented Sub-Items: Home, Issues, Projects, Views */}
                      {isTeamExpanded && (
                        <div className="pl-6 space-y-0.5 text-[12.5px]">
                          {/* Home */}
                          <Link
                            href={`/teams/${team._id}`}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md transition ${
                              pathname === `/teams/${team._id}`
                                ? "bg-white/[0.08] text-white font-medium"
                                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                            }`}
                          >
                            <HomeNavIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Home</span>
                          </Link>

                          {/* Issues */}
                          <Link
                            href={`/teams/${team._id}/issues`}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md transition ${
                              pathname === `/teams/${team._id}/issues` ||
                              ((pathname === "/issues/active" || pathname === "/issues/backlog") &&
                                searchParams?.get("team") === team._id)
                                ? "bg-white/[0.08] text-white font-medium"
                                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                            }`}
                          >
                            <IssueIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Issues</span>
                          </Link>

                          {/* Projects */}
                          <Link
                            href={`/projects?team=${team._id}`}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md transition ${
                              pathname === "/projects" && searchParams?.get("team") === team._id
                                ? "bg-white/[0.08] text-white font-medium"
                                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                            }`}
                          >
                            <ProjectCubeIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Projects</span>
                          </Link>

                          {/* Views */}
                          <Link
                            href={`/views?team=${team._id}`}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md transition ${
                              pathname === "/views" && searchParams?.get("team") === team._id
                                ? "bg-white/[0.08] text-white font-medium"
                                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                            }`}
                          >
                            <ViewsIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Views</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. BOTTOM SECTION: Invite people, Help & Support, Import card  */}
      {/* ============================================================== */}
      <div className="p-2.5 border-t border-white/[0.06] space-y-1 mt-auto">
        <button
          type="button"
          onClick={() => router.push("/settings/members")}
          className="flex items-center gap-2 px-2 py-1 text-xs text-[#8a8f98] hover:text-white transition w-full cursor-pointer text-left"
        >
          <Plus className="w-3 h-3" />
          <span>Invite people</span>
        </button>

        <button
          type="button"
          onClick={() => window.open("https://linear.app", "_blank")}
          className="flex items-center gap-2 px-2 py-1 text-xs text-[#8a8f98] hover:text-white transition w-full cursor-pointer text-left"
        >
          <Flag className="w-3 h-3" />
          <span>Help & Support</span>
        </button>

        {/* Import Issues Card matching bottom of screenshot */}
        {showImportBanner && (
          <div className="bg-[#151722] border border-white/[0.08] p-3 rounded-lg relative text-left mt-2">
            <button
              type="button"
              onClick={() => setShowImportBanner(false)}
              className="absolute top-2 right-2 text-[#626674] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>Import Issues</span>
            </div>

            <p className="text-[11px] text-[#8a8f98] leading-relaxed mb-2">
              Use our Migration Assistant to copy issues from another service.
            </p>

            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="text-[11px] text-[#858fe8] hover:text-white font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <span>Try Now</span>
              <span>&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function Sidebar() {
  return (
    <Suspense
      fallback={
        <aside className="w-56 h-screen flex flex-col bg-[#0f1017] border-r border-white/[0.06] text-[#e6e7ee] shrink-0" />
      }
    >
      <SidebarContent />
    </Suspense>
  );
}
