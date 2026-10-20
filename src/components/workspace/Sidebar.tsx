"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import {
  Inbox,
  Target,
  Layers,
  Map as MapIcon,
  CircleDot,
  LayoutGrid,
  Plus,
  Search,
  Edit3,
  ChevronDown,
  Check,
  Settings,
  Flag,
  BookOpen,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setCommandPaletteOpen, setCreateModalOpen, setCreateProjectModalOpen } = useUI();
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    sanitizeWorkspaceName,
  } = useWorkspace();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showImportBanner, setShowImportBanner] = useState(true);

  const workspaceName = currentWorkspace
    ? sanitizeWorkspaceName(currentWorkspace.name)
    : "Figr";

  const handleSwitchWorkspace = (ws: any) => {
    setCurrentWorkspace(ws);
    setIsWorkspaceMenuOpen(false);
  };

  // Logout handler: Clears credentials & redirects immediately to Home Page
  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    router.push("/");
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

  // User initials for circular badge (e.g. "MG" from screenshot)
  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "MG";

  return (
    <aside className="w-56 h-screen flex flex-col bg-[#0f1017] border-r border-white/[0.06] text-[#e6e7ee] select-none text-[13px] shrink-0">
      {/* ============================================================== */}
      {/* 1. TOP ROW: ORANGE LOGO + WORKSPACE NAME + CHEVRON & AVATAR     */}
      {/* ============================================================== */}
      <div className="relative flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]">
        {/* Workspace Switcher Trigger (No /projects navigation!) */}
        <button
          type="button"
          onClick={() => {
            setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen);
            setIsProfileMenuOpen(false);
          }}
          className="flex items-center gap-2 hover:bg-white/[0.05] p-1 rounded-md transition cursor-pointer max-w-[160px] text-left"
          title="Switch or manage workspace"
        >
          {/* Orange Square Logo matching Screenshot */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#e8590c] text-white text-[11px] font-bold">
            {workspaceName.slice(0, 2) || "Fi"}
          </div>
          <span className="truncate text-[13px] font-medium text-white tracking-tight">
            {workspaceName || "Figr"}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#8a8f98] shrink-0 transition-transform duration-200 ${isWorkspaceMenuOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* User profile avatar on top right with POPUP OPENING ON THE RIGHT */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsWorkspaceMenuOpen(false);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0ca678] text-white text-[10px] font-semibold hover:opacity-90 transition cursor-pointer ring-offset-1 focus:outline-none"
            title={user?.name || user?.email || "User profile"}
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
            <div className="absolute left-3 top-11 z-50 w-56 rounded-lg border border-white/[0.1] bg-[#161722] p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#707383]">
                Workspaces
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5 my-1">
                {workspaces.map((ws: any) => {
                  const isActive = ws.name === workspaceName;
                  return (
                    <button
                      key={ws._id || ws.slug || ws.name}
                      onClick={() => handleSwitchWorkspace(ws)}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition cursor-pointer ${isActive
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-[#8a8f98] hover:bg-white/[0.04] hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#e8590c]/20 text-[#e8590c] text-[10px] font-bold">
                          {ws.name?.[0]?.toUpperCase() || "W"}
                        </div>
                        <span className="truncate">{ws.name}</span>
                      </div>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 text-[#5e6ad2] shrink-0" />
                      )}
                    </button>
                  );
                })}

                {workspaces.length === 0 && (
                  <div className="px-2 py-1.5 text-xs text-white">
                    {workspaceName}
                  </div>
                )}
              </div>

              <div className="my-1 border-t border-white/[0.06]" />

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
                  router.push("/settings/members");
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
      {/* 3. NAVIGATION LINKS (Inbox, My issues, Views, Roadmaps)        */}
      {/* ============================================================== */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
        <div className="px-2 space-y-0.5">
          <Link
            href="/inbox"
            className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${pathname === "/inbox"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
              }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox</span>
          </Link>

          <Link
            href="/my-issues"
            className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${pathname === "/my-issues"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
              }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>My issues</span>
          </Link>

          <Link
            href="/issues/views"
            className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${pathname === "/issues/views"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Views</span>
          </Link>

          <Link
            href="/roadmaps"
            className={`flex items-center gap-2.5 px-2 py-1 rounded-md text-[13px] transition ${pathname === "/roadmaps"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
              }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Roadmaps</span>
          </Link>
        </div>

        {/* ============================================================== */}
        {/* 4. SECTION: "Your teams" (Team -> Issues -> Active, Backlog..) */}
        {/* ============================================================== */}
        <div className="px-2">
          <div className="px-2 py-1 text-[11px] font-medium text-[#626674]">
            Your teams
          </div>

          <div className="mt-0.5">
            {/* Team header matching red circle + Figr + chevron */}
            <div className="flex items-center justify-between px-2 py-1 text-[13px] font-medium text-white hover:bg-white/[0.03] rounded-md cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#e03131] flex items-center justify-center text-[8px] text-white font-bold">
                  ⚡
                </div>
                <span>{workspaceName || "Figr"}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#8a8f98]" />
            </div>

            {/* Tree items under Team */}
            <div className="mt-1 pl-4 space-y-0.5 text-[12.5px]">
              {/* Issues Label */}
              <div className="flex items-center gap-2 px-2 py-1 text-[#8a8f98]">
                <CircleDot className="w-3.5 h-3.5" />
                <span>Issues</span>
              </div>

              {/* Active (Selected state in screenshot!) */}
              <Link
                href="/issues/active"
                className={`flex items-center gap-2 pl-6 pr-2 py-1 rounded-md text-xs font-medium transition ${pathname === "/issues/active" || pathname === "/projects"
                    ? "bg-[#1c1e2b] text-white"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                <span>Active</span>
              </Link>

              {/* Backlog */}
              <Link
                href="/issues/backlog"
                className={`flex items-center gap-2 pl-6 pr-2 py-1 rounded-md text-xs font-normal transition ${pathname === "/issues/backlog"
                    ? "bg-[#1c1e2b] text-white"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                <span>Backlog</span>
              </Link>

              {/* Projects */}
              <div
                className={`group flex items-center justify-between px-2 py-1 rounded-md text-xs font-normal transition ${
                  pathname === "/projects"
                    ? "bg-[#1c1e2b] text-white"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Link
                  href="/projects"
                  className="flex items-center gap-2 flex-1"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Projects</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCreateProjectModalOpen(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-white p-0.5 rounded transition-opacity cursor-pointer"
                  title="New project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Views */}
              <Link
                href="/views"
                className="flex items-center gap-2 px-2 py-1 rounded-md text-xs font-normal text-[#8a8f98] hover:text-white hover:bg-white/[0.03] transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Views</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. BOTTOM SECTION: Invite people, Help & Support, Import card  */}
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
