"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  Tag,
  FileText,
  Calendar,
  CircleDot,
  CheckSquare,
  CheckCircle2,
  Inbox,
  RefreshCw,
  FolderKanban,
  Palette,
  Terminal,
  Rocket,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  X,
  AlertTriangle,
  Loader2,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

interface TeamMember {
  userId: string;
  role: string;
  name?: string;
  email?: string;
}

interface TeamData {
  _id: string;
  name: string;
  key: string;
  description?: string;
  status?: "active" | "retired" | "deleted";
  icon?: string;
  color?: string;
  isPrivate?: boolean;
  timezone?: string;
  members?: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

const AVAILABLE_COLORS = [
  "#5e6ad2",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#6b7280",
];

const AVAILABLE_ICONS = [
  { name: "FolderKanban", icon: FolderKanban, label: "Projects" },
  { name: "Palette", icon: Palette, label: "Design" },
  { name: "Terminal", icon: Terminal, label: "Engineering" },
  { name: "Rocket", icon: Rocket, label: "Product" },
  { name: "Cpu", icon: Cpu, label: "Backend" },
  { name: "Layers", icon: Layers, label: "Operations" },
  { name: "Shield", icon: Shield, label: "Security" },
  { name: "Sparkles", icon: Sparkles, label: "Growth" },
];

const SlackLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

export default function TeamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.teamId as string;
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuth();

  const [team, setTeam] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Modals
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isStatusesModalOpen, setIsStatusesModalOpen] = useState(false);
  const [isSlackModalOpen, setIsSlackModalOpen] = useState(false);
  const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAutomationsModalOpen, setIsAutomationsModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  // Edit General Form State
  const [editName, setEditName] = useState("");
  const [editKey, setEditKey] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState(AVAILABLE_COLORS[0]);
  const [editIcon, setEditIcon] = useState("FolderKanban");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Danger Zone Actions State
  const [isRetiring, setIsRetiring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Team Data
  const fetchTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/teams/${teamId}`);
      const data = res?.team || res?.data || res;
      if (data && (data._id || data.name)) {
        setTeam(data);
        setEditName(data.name || "");
        setEditKey(data.key || "");
        setEditDescription(data.description || "");
        setEditColor(data.color || AVAILABLE_COLORS[0]);
        setEditIcon(data.icon || "FolderKanban");
        setEditIsPrivate(!!data.isPrivate);
      } else {
        setError("Team not found");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load team");
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Handle Save General Settings
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !editName.trim()) return;

    try {
      setIsSavingGeneral(true);
      const payload = {
        name: editName.trim(),
        key: editKey.trim().toUpperCase(),
        description: editDescription.trim(),
        color: editColor,
        icon: editIcon,
        isPrivate: editIsPrivate,
      };

      const res = await api.patch(`/teams/${team._id}`, payload);
      const updated = res?.team || res?.data || payload;
      setTeam((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsGeneralModalOpen(false);
      window.dispatchEvent(new Event("taskflow_team_created"));
    } catch (err: any) {
      alert(err?.message || "Failed to update team settings");
    } finally {
      setIsSavingGeneral(false);
    }
  };

  // Handle Retire Team
  const handleToggleRetire = async () => {
    if (!team) return;
    try {
      setIsRetiring(true);
      const nextStatus = team.status === "retired" ? "active" : "retired";
      await api.patch(`/teams/${team._id}`, { status: nextStatus });
      setTeam((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      setIsRetireModalOpen(false);
      window.dispatchEvent(new Event("taskflow_team_created"));
    } catch (err: any) {
      alert(err?.message || "Failed to update team status");
    } finally {
      setIsRetiring(false);
    }
  };

  // Handle Delete Team
  const handleDeleteTeam = async () => {
    if (!team) return;
    try {
      setIsDeleting(true);
      await api.delete(`/teams/${team._id}`);
      window.dispatchEvent(new Event("taskflow_team_created"));
      router.push("/settings/teams");
    } catch (err: any) {
      alert(err?.message || "Failed to delete team");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#10111a] flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-xs text-[#8b90a4]">
          <Loader2 className="w-4 h-4 animate-spin text-[#5e6ad2]" />
          <span>Loading team details...</span>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-full bg-[#10111a] text-[#e2e4ef] select-none font-sans">
        <div className="pt-5 px-6 sm:px-8">
          <Link
            href="/settings/teams"
            className="inline-flex items-center gap-1 text-[12.5px] text-[#8b90a4] hover:text-white transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Teams</span>
          </Link>
        </div>
        <div className="max-w-2xl mx-auto text-center py-16 px-6 space-y-4">
          <p className="text-[14px] text-[#f87171]">{error || "Team not found"}</p>
        </div>
      </div>
    );
  }

  const membersCount = team.members?.length || 1;
  const isRetired = team.status === "retired";

  return (
    <div className="min-h-full bg-[#10111a] text-[#e2e4ef] select-none font-sans">
      {/* ============================================================== */}
      {/* TOP LEFT NAVIGATION: < Teams (bilkul top left side par)        */}
      {/* ============================================================== */}
      <div className="pt-5 px-6 sm:px-8">
        <Link
          href="/settings/teams"
          className="inline-flex items-center gap-1 text-[12.5px] text-[#8b90a4] hover:text-white transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Teams</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 pt-3 pb-16">
        {/* ============================================================== */}
        {/* TEAM HEADER                                                    */}
        {/* ============================================================== */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] sm:text-[24px] font-semibold text-white tracking-tight">
                {team.name}
              </h1>
              {isRetired && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-[#3b3d54] text-[#a5a9c0]">
                  Retired
                </span>
              )}
            </div>
            <p className="text-[12.5px] text-[#8b90a4] mt-0.5">
              {team.isPrivate
                ? "Private to team members and workspace admins"
                : "Accessible to all workspace members"}
            </p>
          </div>

          <Link
            href={`/teams/${team._id}`}
            className="inline-flex items-center gap-1 text-[12px] text-[#8b90a4] hover:text-white transition-colors shrink-0 pt-1 cursor-pointer"
          >
            <span>Team overview</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6b7086]" />
          </Link>
        </div>

        {/* ============================================================== */}
        {/* CARD 1: GENERAL, MEMBERS, SLACK NOTIFICATIONS                  */}
        {/* ============================================================== */}
        <div className="bg-[#161726] border border-[#23253a] rounded-xl overflow-hidden divide-y divide-[#1e2034] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          {/* 1. General */}
          <Link
            href={`/settings/teams/${team._id}/general`}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Settings className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">General</p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Name, identifier, timezone, estimates, and broader settings
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors shrink-0" />
          </Link>

          {/* 2. Members */}
          <Link
            href={`/settings/teams/${team._id}/members`}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Users className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">Members</p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">Manage team members</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>{membersCount} member{membersCount === 1 ? "" : "s"}</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </Link>

          {/* 3. Slack notifications */}
          <div
            onClick={() => setIsSlackModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="text-[#8b90a4] group-hover:text-white transition-colors shrink-0">
                <SlackLogo className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Slack notifications
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Broadcast notifications to Slack
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>Off</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: ISSUES, PROJECTS, AND DOCUMENTS                     */}
        {/* ============================================================== */}
        <h2 className="text-[13px] font-medium text-white mb-2 mt-7">
          Issues, projects, and documents
        </h2>
        <div className="bg-[#161726] border border-[#23253a] rounded-xl overflow-hidden divide-y divide-[#1e2034] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          {/* Issue labels */}
          <div
            onClick={() => setIsTemplatesModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Tag className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Issue labels
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Labels available to this team&apos;s issues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>None</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>

          {/* Project labels */}
          <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Tag className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Project labels
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Labels available to this team&apos;s projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#717691] shrink-0">
              <span>Available on Business</span>
            </div>
          </div>

          {/* Templates */}
          <div
            onClick={() => setIsTemplatesModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <FileText className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Templates
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Pre-filled templates for issues, documents, and projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>None</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>

          {/* Recurring issues */}
          <div
            onClick={() => setIsTemplatesModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Calendar className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Recurring issues
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Automatically create issues on a schedule
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>None</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: WORKFLOW                                            */}
        {/* ============================================================== */}
        <h2 className="text-[13px] font-medium text-white mb-2 mt-7">Workflow</h2>
        <div className="bg-[#161726] border border-[#23253a] rounded-xl overflow-hidden divide-y divide-[#1e2034] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          {/* Issue statuses */}
          <div
            onClick={() => setIsStatusesModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <CircleDot className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Issue statuses
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Customize the statuses issues go through
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>6 statuses</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>

          {/* Project statuses */}
          <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <CheckSquare className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Project statuses
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Customize the statuses projects go through
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#717691] shrink-0">
              <span>Available on Business</span>
            </div>
          </div>

          {/* Workflows & automations */}
          <div
            onClick={() => setIsAutomationsModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <CheckCircle2 className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">
                  Workflows & automations
                </p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Manage issue automations, git workflows and other workflows
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors shrink-0" />
          </div>

          {/* Triage */}
          <div
            onClick={() => setIsAutomationsModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Inbox className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">Triage</p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Streamline how you handle requests from outside your team
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>Off</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>

          {/* Cycles */}
          <div
            onClick={() => setIsAutomationsModalOpen(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <RefreshCw className="w-4 h-4 text-[#8b90a4] group-hover:text-white transition-colors shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-white group-hover:text-white">Cycles</p>
                <p className="text-[11.5px] text-[#8b90a4] truncate">
                  Focus your team over short, time-boxed windows
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b90a4] shrink-0">
              <span>Off</span>
              <ChevronRight className="w-4 h-4 text-[#555a73] group-hover:text-[#8b90a4] transition-colors" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 4: DANGER ZONE                                         */}
        {/* ============================================================== */}
        <h2 className="text-[13px] font-medium text-white mb-2 mt-7">Danger zone</h2>
        <div className="bg-[#161726] border border-[#23253a] rounded-xl overflow-hidden divide-y divide-[#1e2034] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          {/* Leave team */}
          <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.01] transition-colors">
            <div className="pr-4">
              <p className="text-[13px] font-medium text-white">Leave team</p>
              <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                Remove yourself as a member of this team
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium text-[#c4c7d7] bg-[#1d1f33] hover:bg-[#252840] border border-[#2b2e48] transition cursor-pointer shrink-0"
            >
              Leave team...
            </button>
          </div>

          {/* Retire team */}
          <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.01] transition-colors">
            <div className="pr-4">
              <p className="text-[13px] font-medium text-white">
                {isRetired ? "Unretire team" : "Retire team"}
              </p>
              <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                Prevent creating and updating issues in this team while preserving all historical data
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRetireModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium text-[#c4c7d7] bg-[#1d1f33] hover:bg-[#252840] border border-[#2b2e48] transition cursor-pointer shrink-0"
            >
              {isRetired ? "Unretire..." : "Retire..."}
            </button>
          </div>

          {/* Delete team */}
          <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.01] transition-colors">
            <div className="pr-4">
              <p className="text-[13px] font-medium text-white">Delete team</p>
              <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                Permanently delete this team and all its data, with a 30-day restoration window
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium text-[#f87171] hover:text-white bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/25 transition cursor-pointer shrink-0"
            >
              Delete...
            </button>
          </div>
        </div>

        <div className="h-16" />
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: GENERAL SETTINGS MODAL                                */}
      {/* ============================================================== */}
      {isGeneralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <h3 className="text-[14px] font-semibold text-white">General Team Settings</h3>
              <button
                type="button"
                onClick={() => setIsGeneralModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGeneral} className="p-5 space-y-4">
              <div>
                <label className="block text-[11.5px] font-medium text-[#8b90a4] mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full h-9 px-3 rounded-md bg-[#10111a] border border-[#23253a] focus:border-[#5e6ad2] text-white text-[13px] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#8b90a4] mb-1">
                  Identifier Key
                </label>
                <input
                  type="text"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value.toUpperCase())}
                  maxLength={5}
                  required
                  className="w-full h-9 px-3 rounded-md bg-[#10111a] border border-[#23253a] focus:border-[#5e6ad2] text-white text-[13px] font-mono uppercase outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#8b90a4] mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-md bg-[#10111a] border border-[#23253a] focus:border-[#5e6ad2] text-white text-[13px] outline-none resize-none transition"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-[11.5px] font-medium text-[#8b90a4] mb-1.5">
                  Team Color
                </label>
                <div className="flex items-center gap-2">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                        editColor === c ? "scale-110 ring-2 ring-white/50" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {editColor === c && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy toggle */}
              <div className="pt-2 border-t border-[#23253a] flex items-center justify-between">
                <div>
                  <p className="text-[12.5px] font-medium text-white">Private team</p>
                  <p className="text-[11px] text-[#8b90a4]">
                    Only team members and admins will have access
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditIsPrivate(!editIsPrivate)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    editIsPrivate ? "bg-[#5e6ad2]" : "bg-[#25283c]"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform ${
                      editIsPrivate ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-[#23253a] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsGeneralModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#8b90a4] hover:text-white hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGeneral}
                  className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#5e6ad2] hover:bg-[#6875e5] text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingGeneral && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: MEMBERS MODAL                                         */}
      {/* ============================================================== */}
      {isMembersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8b90a4]" />
                <h3 className="text-[14px] font-semibold text-white">Team Members</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMembersModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#10111a] border border-[#23253a]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#5e6ad2] flex items-center justify-center text-white text-xs font-bold">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-[12.5px] font-medium text-white">
                      {user?.name || "Team Member"} (You)
                    </p>
                    <p className="text-[11px] text-[#8b90a4]">{user?.email || "owner"}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#818cf8] px-2 py-0.5 rounded bg-[#5e6ad2]/10 border border-[#5e6ad2]/20">
                  Lead
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("Invite link copied or member search")}
                  className="w-full h-8 px-3 rounded-md bg-[#202235] hover:bg-[#282b42] border border-[#2e324c] text-[12px] font-medium text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8b90a4]" />
                  <span>Add team member</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ISSUE STATUSES MODAL                                  */}
      {/* ============================================================== */}
      {isStatusesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <div className="flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-[#8b90a4]" />
                <h3 className="text-[14px] font-semibold text-white">Issue Statuses</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusesModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-2">
              {[
                { name: "Backlog", color: "#6b7280", desc: "Ideas and future initiatives" },
                { name: "Todo", color: "#eab308", desc: "Ready to be picked up" },
                { name: "In Progress", color: "#3b82f6", desc: "Actively being worked on" },
                { name: "In Review", color: "#a855f7", desc: "Ready for code review or QA" },
                { name: "Done", color: "#10b981", desc: "Completed and released" },
                { name: "Canceled", color: "#ef4444", desc: "No longer relevant" },
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#10111a] border border-[#23253a]"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[12.5px] font-medium text-white">{s.name}</span>
                  </div>
                  <span className="text-[11px] text-[#8b90a4]">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: SLACK NOTIFICATIONS MODAL                             */}
      {/* ============================================================== */}
      {isSlackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <div className="flex items-center gap-2">
                <SlackLogo className="w-4 h-4 text-[#8b90a4]" />
                <h3 className="text-[14px] font-semibold text-white">Slack Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSlackModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#202235] flex items-center justify-center mx-auto text-[#8b90a4]">
                <SlackLogo className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13.5px] font-medium text-white">Connect team to Slack</p>
                <p className="text-[12px] text-[#8b90a4] mt-1 max-w-xs mx-auto">
                  Automatically broadcast created issues, cycle progress, and comments to your Slack channels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert("Slack integration setup initiated");
                  setIsSlackModalOpen(false);
                }}
                className="h-8 px-4 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium transition cursor-pointer"
              >
                Connect Slack
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: RETIRE TEAM CONFIRMATION                              */}
      {/* ============================================================== */}
      {isRetireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">
                  {isRetired ? "Unretire Team" : "Retire Team"}
                </h3>
                <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                  {isRetired
                    ? "This team will become active again and allow new issues."
                    : "No new issues can be created in this team, but past data is preserved."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRetireModalOpen(false)}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#8b90a4] hover:text-white hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleRetire}
                disabled={isRetiring}
                className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isRetiring && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isRetired ? "Unretire team" : "Retire team"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: DELETE TEAM CONFIRMATION                              */}
      {/* ============================================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center text-[#ef4444] shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">Delete &ldquo;{team.name}&rdquo;?</h3>
                <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                  This will permanently delete this team and its associated items. You have a 30-day window to restore it.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#8b90a4] hover:text-white hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTeam}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#ef4444] hover:bg-[#dc2626] text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete team</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: LEAVE TEAM CONFIRMATION                               */}
      {/* ============================================================== */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-white">Leave team &ldquo;{team.name}&rdquo;?</h3>
            <p className="text-[11.5px] text-[#8b90a4]">
              You will lose member privileges for this team. You can be re-invited by any team admin.
            </p>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#8b90a4] hover:text-white hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("You have left the team.");
                  setIsLeaveModalOpen(false);
                  router.push("/settings/teams");
                }}
                className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#202235] hover:bg-[#282b42] border border-[#2e324c] text-white transition cursor-pointer"
              >
                Leave team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: AUTOMATIONS & WORKFLOWS                               */}
      {/* ============================================================== */}
      {isAutomationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <h3 className="text-[14px] font-semibold text-white">Workflows & Automations</h3>
              <button
                type="button"
                onClick={() => setIsAutomationsModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="p-3 rounded-lg bg-[#10111a] border border-[#23253a] space-y-1">
                <p className="text-[12.5px] font-medium text-white">Auto-close issues on PR merge</p>
                <p className="text-[11px] text-[#8b90a4]">
                  Automatically set issue status to &quot;Done&quot; when matching GitHub PR merges.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#10111a] border border-[#23253a] space-y-1">
                <p className="text-[12.5px] font-medium text-white">Auto-archive closed issues</p>
                <p className="text-[11px] text-[#8b90a4]">
                  Issues marked as Done or Canceled are archived after 6 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 9: TEMPLATES & LABELS                                    */}
      {/* ============================================================== */}
      {isTemplatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <h3 className="text-[14px] font-semibold text-white">Team Templates & Labels</h3>
              <button
                type="button"
                onClick={() => setIsTemplatesModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-center space-y-2">
              <p className="text-[13px] text-white">No custom templates configured</p>
              <p className="text-[11.5px] text-[#8b90a4]">
                Templates help streamline bug reports and feature requests for this team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
