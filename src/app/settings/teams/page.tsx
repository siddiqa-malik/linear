"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  Search,
  ChevronDown,
  Plus,
  Download,
  Users,
  Lock,
  Globe,
  Check,
  FolderKanban,
  Sparkles,
  Layers,
  Cpu,
  Palette,
  Terminal,
  Rocket,
  Shield,
  ArrowUpDown,
} from "lucide-react";

interface TeamItem {
  _id: string;
  name: string;
  key: string;
  description?: string;
  status?: "active" | "retired" | "deleted";
  icon?: string;
  color?: string;
  isPrivate?: boolean;
  members?: Array<{ userId: string; role: string }>;
  createdAt?: string;
  updatedAt?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FolderKanban,
  Palette,
  Terminal,
  Rocket,
  Cpu,
  Layers,
  Shield,
  Sparkles,
};

type FilterOption = "active" | "retired" | "deleted";

const FILTER_LABELS: Record<FilterOption, string> = {
  active: "Active",
  retired: "Retire",
  deleted: "Recently deleted",
};

export default function TeamsListPage() {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();

  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("active");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Fetch teams from backend API
  const fetchTeams = useCallback(async () => {
    if (!currentWorkspace?._id) {
      setTeams([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.get(`/teams?workspaceId=${currentWorkspace._id}&status=${selectedFilter}`);
      const list = res?.data || res || [];
      if (Array.isArray(list)) {
        setTeams(list);
      } else {
        setTeams([]);
      }
    } catch {
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace?._id, selectedFilter]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Filtered teams by search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const query = searchQuery.toLowerCase().trim();
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.key.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [teams, searchQuery]);

  // Format date helper: "Oct 22"
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "-";
    }
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    if (filteredTeams.length === 0) return;

    const headers = ["Name", "Identifier", "Description", "Visibility", "Members Count", "Created At"];
    const rows = filteredTeams.map((t) => [
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.key}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      `"${t.isPrivate ? "Private" : "Workspace"}"`,
      t.members?.length || 1,
      `"${t.createdAt ? new Date(t.createdAt).toISOString() : ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `teams-${currentWorkspace?.slug || "workspace"}-${selectedFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-full bg-[#10111a] text-[#e2e4ef] py-10 px-6 sm:px-10 lg:px-12 select-none font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* ============================================================== */}
        {/* 1. TOP TITLE                                                    */}
        {/* ============================================================== */}
        <div className="mb-6">
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-white tracking-tight">
            Teams
          </h1>
        </div>

        {/* ============================================================== */}
        {/* 2. TOOLBAR (Search + Filter Dropdown + Export CSV + Create team) */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Left: Search input + Status dropdown */}
          <div className="flex items-center gap-2.5 flex-1 max-w-md">
            {/* Search input with magnifying glass */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#656a82] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 bg-[#141624] border border-[#24273d] focus:border-[#5e6ad2] rounded-md text-[12.5px] text-white placeholder:text-[#5d627a] outline-none transition"
              />
            </div>

            {/* Dropdown with 3 options: Active, Retire, Recently deleted */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="h-8 px-3 rounded-md bg-[#141624] border border-[#24273d] hover:border-[#353957] text-[12.5px] font-medium text-white flex items-center gap-2 transition cursor-pointer"
              >
                <span>{FILTER_LABELS[selectedFilter]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#737894]" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute left-0 top-9 z-50 w-44 py-1 rounded-lg bg-[#151726] border border-[#272a42] shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                  {(["active", "retired", "deleted"] as FilterOption[]).map((opt) => {
                    const isSelected = selectedFilter === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(opt);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-[#21243b] text-white font-medium"
                            : "text-[#8b90a4] hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <span>{FILTER_LABELS[opt]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#818cf8]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Export CSV & Create team button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredTeams.length === 0}
              className="h-8 px-3 rounded-md bg-[#161827] border border-[#24273d] hover:bg-[#202338] text-[12.5px] font-medium text-[#c4c7d9] hover:text-white flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8b90a4]" />
              <span>Export CSV</span>
            </button>

            <Link
              href="/settings/teams/new"
              className="h-8 px-3.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12.5px] font-medium flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create team</span>
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. TABLE / LIST VIEW                                            */}
        {/* ============================================================== */}
        <div className="mt-4">
          {/* Table Header Columns matching screenshot */}
          <div className="grid grid-cols-12 px-3 py-2 text-[11.5px] font-medium text-[#656a82] border-b border-[#1c1e30]">
            <div className="col-span-5 sm:col-span-4">Name</div>
            <div className="col-span-3 sm:col-span-3">Description</div>
            <div className="col-span-2 sm:col-span-2">Visibility</div>
            <div className="col-span-1 text-center">Members</div>
            <div className="col-span-1 flex items-center justify-center gap-0.5">
              <span>Issues</span>
              <span className="text-[10px]">↑</span>
            </div>
            <div className="col-span-1 text-right">Created</div>
          </div>

          {/* Group Heading matching screenshot: e.g. "Active  2" */}
          {!isLoading && filteredTeams.length > 0 && (
            <div className="px-3 py-2 text-[11.5px] font-medium text-[#737894] flex items-center gap-2">
              <span>{FILTER_LABELS[selectedFilter]}</span>
              <span className="text-[11px] text-[#555a73] font-mono">{filteredTeams.length}</span>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-16 text-center text-xs text-[#737894]">
              Loading teams...
            </div>
          )}

          {/* Teams Rows */}
          {!isLoading && filteredTeams.length > 0 && (
            <div className="divide-y divide-[#181a29]">
              {filteredTeams.map((team) => {
                const IconComponent = (team.icon && ICON_MAP[team.icon]) || FolderKanban;
                const teamColor = team.color || "#e03131";
                const teamInitial = team.name ? team.name[0].toUpperCase() : "T";

                return (
                  <div
                    key={team._id}
                    onClick={() => router.push(`/settings/teams/${team._id}`)}
                    className="grid grid-cols-12 items-center px-3 py-2.5 text-[12.5px] hover:bg-white/[0.03] transition-colors rounded-md cursor-pointer group"
                  >
                    {/* Name + Identifier with Circle Icon */}
                    <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 truncate pr-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] text-white font-bold shrink-0"
                        style={{ backgroundColor: teamColor }}
                      >
                        {teamInitial}
                      </div>
                      <span className="font-medium text-white group-hover:text-[#818cf8] transition-colors truncate">
                        {team.name}
                      </span>
                      <span className="text-[11px] font-mono font-medium text-[#656a82] uppercase shrink-0">
                        {team.key}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="col-span-3 sm:col-span-3 text-[#7b8098] truncate pr-2">
                      {team.description || "-"}
                    </div>

                    {/* Visibility: Workspace / Private */}
                    <div className="col-span-2 sm:col-span-2 flex items-center gap-1.5 text-[#8b90a4]">
                      {team.isPrivate ? (
                        <>
                          <Lock className="w-3 h-3 text-[#818cf8]" />
                          <span>Private</span>
                        </>
                      ) : (
                        <span>Workspace</span>
                      )}
                    </div>

                    {/* Members Count */}
                    <div className="col-span-1 text-center text-[#8b90a4]">
                      {team.members?.length || 1}
                    </div>

                    {/* Issues */}
                    <div className="col-span-1 text-center text-[#656a82]">
                      -
                    </div>

                    {/* Created Date */}
                    <div className="col-span-1 text-right text-[#7b8098] text-[12px]">
                      {formatDate(team.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. EMPTY SCREEN STATE                                          */}
          {/* ============================================================== */}
          {!isLoading && filteredTeams.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#181a2b] border border-[#26283d] flex items-center justify-center text-[#737894] mb-3 shadow-inner">
                <Users className="w-5 h-5 text-[#818cf8]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {searchQuery ? "No matching teams found" : "No teams yet"}
              </h3>
              <p className="text-xs text-[#737894] max-w-sm leading-relaxed mb-5">
                {searchQuery
                  ? `No team matched "${searchQuery}". Try adjusting your search or filter.`
                  : "Create teams to organize separate cycles, issues and notifications across your workspace."}
              </p>
              <Link
                href="/settings/teams/new"
                className="px-4 py-2 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create team</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
