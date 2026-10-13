"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import {
  Inbox,
  CheckSquare,
  FolderKanban,
  Plus,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  LayoutList,
  PlayCircle,
  CircleDashed,
  Sliders,
} from "lucide-react";
import { LinearLogo } from "../icons/LinearLogo";
import { Avatar } from "../ui/Avatar";
import { Kbd } from "../ui/Kbd";
import { api } from "@/lib/api";
import { Project } from "@/types/project";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    sidebarCollapsed,
    setCommandPaletteOpen,
    setCreateModalOpen,
  } = useUI();
  const [projects, setProjects] = useState<Project[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState<number>(0);

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => {
        const list = res?.data || res || [];
        setProjects(list.slice(0, 10));
      })
      .catch(() => {});

    api
      .get("/notifications")
      .then((res) => {
        const list = res?.data || res || [];
        const unread = list.filter((n: any) => !n.isRead).length;
        setUnreadNotifs(unread);
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    {
      label: "Inbox",
      href: "/inbox",
      icon: Inbox,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
    },
    {
      label: "My Issues",
      href: "/my-issues",
      icon: CheckSquare,
    },
    {
      label: "Active Issues",
      href: "/issues/active",
      icon: PlayCircle,
    },
    {
      label: "Backlog",
      href: "/issues/backlog",
      icon: CircleDashed,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
  ];

  return (
    <aside
      className={`flex h-screen flex-col border-r border-white/[0.08] bg-[#0c0d12] transition-all duration-200 select-none ${
        sidebarCollapsed ? "w-14" : "w-60"
      }`}
    >
      {/* Workspace Switcher Header */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-3.5">
        <Link href="/projects" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#5e6ad2] text-white">
            <LinearLogo className="h-3.5 w-3.5" />
          </div>
          {!sidebarCollapsed && (
            <div className="truncate text-xs font-semibold tracking-tight text-white">
              Linear Workspace
            </div>
          )}
        </Link>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-1 p-2 border-b border-white/[0.06]">
        {/* + New Issue Button */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex w-full items-center justify-between rounded-md bg-[#5e6ad2]/15 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#5e6ad2]/25"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5 text-[#5e6ad2]" />
            {!sidebarCollapsed && <span>New Issue</span>}
          </div>
          {!sidebarCollapsed && <Kbd className="bg-white/10 text-white">C</Kbd>}
        </button>

        {/* Quick Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-[#8a8f98] transition hover:bg-white/[0.04] hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            {!sidebarCollapsed && <span>Search</span>}
          </div>
          {!sidebarCollapsed && <Kbd>⌘K</Kbd>}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "bg-white/[0.07] text-white"
                  : "text-[#8a8f98] hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? "text-[#5e6ad2]" : "text-[#8a8f98]"
                  }`}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
              {!sidebarCollapsed && item.badge && (
                <span className="rounded-full bg-[#5e6ad2] px-1.5 py-0.2 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Projects Disclosure Section */}
        {!sidebarCollapsed && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
              <span>Your Projects</span>
              <button
                onClick={() => router.push("/projects")}
                className="hover:text-white"
                title="Create Project"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-1 space-y-0.5">
              {projects.map((proj) => {
                const isProjectActive = pathname.startsWith(
                  `/projects/${proj._id}`
                );
                return (
                  <Link
                    key={proj._id}
                    href={`/projects/${proj._id}`}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition ${
                      isProjectActive
                        ? "bg-white/[0.07] text-white"
                        : "text-[#8a8f98] hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5e6ad2]" />
                    <span className="truncate">{proj.name}</span>
                  </Link>
                );
              })}
              {projects.length === 0 && (
                <div className="px-2.5 py-2 text-[11px] text-[#62666d]">
                  No projects yet
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Footer User & Settings */}
      <div className="border-t border-white/[0.06] p-2 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
            pathname.startsWith("/settings")
              ? "bg-white/[0.07] text-white"
              : "text-[#8a8f98] hover:bg-white/[0.03] hover:text-white"
          }`}
        >
          <Settings className="h-3.5 w-3.5" />
          {!sidebarCollapsed && <span>Settings</span>}
        </Link>

        {user && (
          <div className="flex items-center justify-between px-2 py-1.5 pt-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar name={user.name || user.email} size="sm" className="w-5 h-5 text-[10px]" />
              {!sidebarCollapsed && (
                <span className="truncate text-xs font-medium text-white">
                  {user.name || user.email}
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={logout}
                className="text-[#8a8f98] hover:text-rose-400 p-1 rounded"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
