"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  User,
  Plus,
} from "lucide-react";

interface SettingsSidebarProps {
  onAddTeam?: () => void;
}

export function SettingsSidebar({ onAddTeam }: SettingsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || (pathname === "/settings" ? "overview" : "");
  const { currentWorkspace, sanitizeWorkspaceName } = useWorkspace();
  const { user } = useAuth();

  const [customTeams, setCustomTeams] = useState<Array<{ _id: string; name: string; color?: string }>>([]);

  useEffect(() => {
    const loadTeams = () => {
      try {
        const stored = localStorage.getItem("taskflow_custom_teams");
        if (stored) {
          setCustomTeams(JSON.parse(stored));
        }
      } catch {}
    };

    loadTeams();
    window.addEventListener("taskflow_team_created", loadTeams);
    window.addEventListener("storage", loadTeams);
    return () => {
      window.removeEventListener("taskflow_team_created", loadTeams);
      window.removeEventListener("storage", loadTeams);
    };
  }, []);

  const baseTeams = [{ _id: "team-design-agency", name: "Design agency", color: "#0ea5e9" }];
  const teams = [...baseTeams, ...customTeams];

  const [integrationsExpanded, setIntegrationsExpanded] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    default: true,
  });

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const isAddTeamActive = pathname === "/settings/teams/new" || currentTab === "add-team";

  const workspaceName = currentWorkspace
    ? sanitizeWorkspaceName(currentWorkspace.name)
    : user?.name
    ? `${user.name}'s Workspace`
    : "My Workspace";

  const isTabActive = (tabKey: string, routePath?: string) => {
    if (routePath && pathname === routePath) return true;
    if (pathname === "/settings") {
      if (tabKey === "overview" && (!currentTab || currentTab === "overview")) return true;
      return currentTab === tabKey;
    }
    return false;
  };

  const workspaceItems = [
    { key: "overview", label: "Overview", href: "/settings?tab=overview" },
    { key: "general", label: "General", href: "/settings?tab=general" },
    { key: "security", label: "Security", href: "/settings?tab=security" },
    { key: "members", label: "Members", href: "/settings/members" },
    { key: "labels", label: "Labels", href: "/settings?tab=labels" },
    { key: "templates", label: "Templates", href: "/settings?tab=templates" },
    { key: "roadmaps", label: "Roadmaps", href: "/settings?tab=roadmaps" },
    { key: "slas", label: "SLAs", href: "/settings?tab=slas" },
    { key: "project-updates", label: "Project Updates", href: "/settings?tab=project-updates" },
    { key: "emojis", label: "Emojis", href: "/settings?tab=emojis" },
    { key: "plans", label: "Plans", href: "/settings?tab=plans" },
    { key: "billing", label: "Billing", href: "/settings?tab=billing" },
    { key: "import-export", label: "Import / Export", href: "/settings?tab=import-export" },
  ];

  const accountItems = [
    { key: "profile", label: "Profile", href: "/settings?tab=profile" },
    { key: "preferences", label: "Preferences", href: "/settings/preferences" },
    { key: "linked-accounts", label: "Linked Accounts", href: "/settings?tab=linked-accounts" },
    { key: "notifications", label: "Notifications", href: "/settings?tab=notifications" },
    { key: "applications", label: "Applications", href: "/settings?tab=applications" },
    { key: "api", label: "API", href: "/settings?tab=api" },
  ];

  return (
    <aside className="w-[248px] shrink-0 border-r border-[#1d1f30] bg-[#0d0e17] flex flex-col h-screen select-none font-sans text-xs">
      <div className="w-full max-w-[208px] mx-auto flex flex-col h-full">
        {/* Top Header: < Settings */}
        <div className="pt-4 pb-2 px-1">
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white hover:text-[#818cf8] transition-colors cursor-pointer group py-1 px-1.5 rounded-[5px]"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#8b90a4] group-hover:text-[#818cf8] transition-colors" />
            <span>Settings</span>
          </button>
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-6 px-1 scrollbar-thin">
        {/* ============================================================== */}
        {/* SECTION 1: WORKSPACE                                           */}
        {/* ============================================================== */}
        <div>
          {/* Section Header with Workspace Icon */}
          <div className="flex items-center gap-2 px-2 py-1 text-[11.5px] font-medium text-[#6b7086]">
            {/* Building/Workspace Icon matching Linear */}
            <svg
              className="w-3.5 h-3.5 text-[#6b7086]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
              <path d="M5.5 6v4M8 6v4M10.5 6v4" strokeLinecap="round" />
            </svg>
            <span>Workspace</span>
          </div>

          <div className="mt-0.5 space-y-0.5">
            {workspaceItems.map((item) => {
              const active = isTabActive(item.key, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`block px-2.5 py-1 rounded-[5px] text-[12px] transition-colors ${
                    active
                      ? "bg-[#23253a] text-white font-medium"
                      : "text-[#8b90a4] hover:text-[#e2e4ef] hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Expandable Integrations Item: ▶ Integrations */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setIntegrationsExpanded(!integrationsExpanded);
                  router.push("/settings?tab=integrations");
                }}
                className={`w-full flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[12px] transition-colors cursor-pointer text-left ${
                  isTabActive("integrations")
                    ? "bg-[#23253a] text-white font-medium"
                    : "text-[#8b90a4] hover:text-[#e2e4ef] hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`text-[9px] text-[#6b7086] transition-transform duration-100 ${
                    integrationsExpanded ? "rotate-90 inline-block" : "inline-block"
                  }`}
                >
                  ▶
                </span>
                <span>Integrations</span>
              </button>

              {integrationsExpanded && (
                <div className="pl-5 mt-0.5 space-y-0.5">
                  <Link
                    href="/settings?tab=integrations"
                    className="block px-2 py-0.5 text-[11.5px] text-[#8b90a4] hover:text-white"
                  >
                    Directory
                  </Link>
                  <Link
                    href="/settings?tab=integrations&filter=connected"
                    className="block px-2 py-0.5 text-[11.5px] text-[#8b90a4] hover:text-white"
                  >
                    Connected
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: ACCOUNT                                             */}
        {/* ============================================================== */}
        <div>
          {/* Section Header with User Icon */}
          <div className="flex items-center gap-2 px-2 py-1 text-[11.5px] font-medium text-[#6b7086]">
            <User className="w-3.5 h-3.5 text-[#6b7086]" />
            <span>Account</span>
          </div>

          <div className="mt-0.5 space-y-0.5">
            {accountItems.map((item) => {
              const active = isTabActive(item.key, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`block px-2.5 py-1 rounded-[5px] text-[12px] transition-colors ${
                    active
                      ? "bg-[#23253a] text-white font-medium"
                      : "text-[#8b90a4] hover:text-[#e2e4ef] hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: TEAMS                                               */}
        {/* ============================================================== */}
        <div>
          {/* Section Header with Teams/Folder Icon */}
          <div className="flex items-center gap-2 px-2 py-1 text-[11.5px] font-medium text-[#6b7086]">
            <svg
              className="w-3.5 h-3.5 text-[#6b7086]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="3" width="12" height="10" rx="1.5" />
              <path d="M2 6h12" />
            </svg>
            <span>Teams</span>
          </div>

          <div className="mt-0.5 space-y-0.5">
            {/* Dynamic Teams List */}
            {teams.map((team, idx) => {
              const teamKey = team._id || `team-${idx}`;
              const isExpanded = expandedTeams[teamKey] ?? (idx === 0);
              const teamInitial = team.name ? team.name[0].toUpperCase() : "T";
              const teamColor = team.color || "#e11d48";
              const isTeamActive = searchParams.get("teamId") === team._id || (idx === 0 && currentTab === "team");

              return (
                <div key={teamKey} className="space-y-0.5">
                  <div className="flex items-center justify-between px-2.5 py-1 rounded-[5px] text-[12px] text-[#8b90a4] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer group">
                    <Link
                      href={`/settings?tab=team&teamId=${team._id}`}
                      className="flex items-center gap-1.5 flex-1 truncate"
                    >
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          toggleTeam(teamKey);
                        }}
                        className={`text-[9px] text-[#6b7086] transition-transform duration-100 ${
                          isExpanded ? "rotate-90 inline-block" : "inline-block"
                        }`}
                      >
                        ▶
                      </span>
                      {/* Circular Team Badge with custom team color */}
                      <div
                        className="w-3.5 h-3.5 rounded-full text-white flex items-center justify-center text-[8.5px] font-bold shrink-0"
                        style={{ backgroundColor: teamColor }}
                      >
                        {teamInitial}
                      </div>
                      <span
                        className={`truncate ${
                          isTeamActive ? "text-white font-medium" : ""
                        }`}
                      >
                        {team.name}
                      </span>
                    </Link>
                  </div>

                  {/* Sub-items for Team when expanded */}
                  {isExpanded && (
                    <div className="pl-6 space-y-0.5">
                      <Link
                        href={`/settings?tab=team&teamId=${team._id}`}
                        className={`block px-2 py-0.5 text-[11.5px] rounded transition-colors ${
                          isTeamActive
                            ? "text-white font-medium"
                            : "text-[#8b90a4] hover:text-white"
                        }`}
                      >
                        General
                      </Link>
                      <Link
                        href={`/settings?tab=team-workflow&teamId=${team._id}`}
                        className="block px-2 py-0.5 text-[11.5px] text-[#8b90a4] hover:text-white rounded transition-colors"
                      >
                        Workflow
                      </Link>
                      <Link
                        href={`/settings?tab=team-estimates&teamId=${team._id}`}
                        className="block px-2 py-0.5 text-[11.5px] text-[#8b90a4] hover:text-white rounded transition-colors"
                      >
                        Estimates
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

            {/* + Add team button matching screenshot with active state */}
            <Link
              href="/settings/teams/new"
              onClick={(e) => {
                if (onAddTeam) {
                  e.preventDefault();
                  onAddTeam();
                }
              }}
              className={`w-full flex items-center gap-1.5 px-2.5 py-1 text-[12px] rounded-[5px] transition-colors cursor-pointer ${
                isAddTeamActive
                  ? "bg-[#23253a] text-white font-medium"
                  : "text-[#8b90a4] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Plus className={`w-3.5 h-3.5 ${isAddTeamActive ? "text-white" : "text-[#6b7086]"}`} />
              <span>Add team</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
}
