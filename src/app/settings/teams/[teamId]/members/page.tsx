"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Check,
  Plus,
  X,
  Mail,
  Loader2,
  FolderKanban,
  Palette,
  Terminal,
  Rocket,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  UserPlus,
} from "lucide-react";

interface TeamMemberDisplay {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  avatar?: string;
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

export default function TeamMembersPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.teamId as string;
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [team, setTeam] = useState<{
    _id: string;
    name: string;
    icon?: string;
    color?: string;
    members?: Array<{ userId: string | any; role: string }>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [membersList, setMembersList] = useState<TeamMemberDisplay[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);

  // Add Member Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Fetch Team Data
  const fetchTeamAndMembers = useCallback(async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/teams/${teamId}`);
      const data = res?.team || res?.data || res;

      if (data && (data._id || data.name)) {
        setTeam(data);

        // Build member list
        const list: TeamMemberDisplay[] = [];

        // 1. Current user as lead/admin matching screenshot
        const currentUserName = user?.name || "Siddiqa Malik";
        const currentUserEmail = (user?.email || "siddiqamalik808@gmail.com").toLowerCase().trim();
        const currentUserUsername = currentUserEmail.split("@")[0];

        list.push({
          id: user?._id || "current-user",
          name: currentUserName,
          username: currentUserUsername,
          email: currentUserEmail,
          role: "Workspace admin",
          avatar: user?.avatar,
        });

        const seenEmails = new Set<string>([currentUserEmail]);

        // 2. Add members directly from team.members in DB (including invited members)
        if (Array.isArray(data.members)) {
          data.members.forEach((m: any, idx: number) => {
            const memberUser = typeof m.userId === "object" ? m.userId : null;
            const memEmail = (m.email || memberUser?.email || "").toLowerCase().trim();
            if (memEmail && !seenEmails.has(memEmail)) {
              seenEmails.add(memEmail);
              const isInv = m.status === "invited" || m.status === "pending";
              const roleTitle = m.role === "lead"
                ? (isInv ? "Team Lead (Invited)" : "Team Lead")
                : (isInv ? "Member (Invited)" : (m.role || "Member"));

              list.push({
                id: memberUser?._id || m._id || `m-${idx}`,
                name: memberUser?.name || m.name || memEmail.split("@")[0],
                username: memEmail.split("@")[0],
                email: memEmail,
                role: roleTitle,
                avatar: memberUser?.avatar,
              });
            }
          });
        }

        // 3. Team Invitations from DB
        if (Array.isArray(data.invitations)) {
          data.invitations.forEach((inv: any, idx: number) => {
            const invEmail = (inv.email || "").toLowerCase().trim();
            if (invEmail && !seenEmails.has(invEmail)) {
              seenEmails.add(invEmail);
              list.push({
                id: `inv-${idx}`,
                name: invEmail.split("@")[0],
                username: invEmail.split("@")[0],
                email: invEmail,
                role: inv.role === "lead" ? "Team Lead (Invited)" : "Member (Invited)",
              });
            }
          });
        }

        setMembersList(list);
      }
    } catch {
      // Fallback display if API offline
      if (user) {
        setMembersList([
          {
            id: user._id || "1",
            name: user.name || "Siddiqa Malik",
            username: (user.email || "siddiqamalik808@gmail.com").split("@")[0],
            email: user.email || "siddiqamalik808@gmail.com",
            role: "Workspace admin",
            avatar: user.avatar,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [teamId, user]);

  useEffect(() => {
    fetchTeamAndMembers();
  }, [fetchTeamAndMembers]);

  // Filter & Search
  const filteredMembers = useMemo(() => {
    let result = membersList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.username && m.username.toLowerCase().includes(q))
      );
    }

    if (selectedRoleFilter !== "All") {
      result = result.filter(
        (m) => m.role.toLowerCase() === selectedRoleFilter.toLowerCase()
      );
    }

    return [...result].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });
  }, [membersList, searchQuery, selectedRoleFilter, sortAsc]);

  // Export CSV functionality
  const handleExportCSV = () => {
    if (filteredMembers.length === 0) return;

    const headers = ["Name", "Username", "Email", "Role"];
    const rows = filteredMembers.map((m) => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.username || ""}"`,
      `"${m.email.replace(/"/g, '""')}"`,
      `"${m.role}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `team-${team?.name || "members"}-members.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Member Action
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !teamId) return;

    try {
      setIsSubmittingInvite(true);
      setInviteError(null);

      const targetEmail = inviteEmail.trim().toLowerCase();
      const targetRole = inviteRole.toLowerCase().includes("lead") ? "lead" : "member";

      // 1. Call Team Member API to persist directly into MongoDB team.members
      await api.post(`/teams/${teamId}/members`, {
        email: targetEmail,
        role: targetRole,
      });

      // 2. Fetch fresh members directly from MongoDB
      await fetchTeamAndMembers();

      setInviteEmail("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      setInviteError(err?.message || "Failed to add member to team");
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const TeamIconComponent =
    (team?.icon && ICON_MAP[team.icon]) || FolderKanban;
  const teamColor = team?.color || "#10b981";

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#10111a] flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-xs text-[#8b90a4]">
          <Loader2 className="w-4 h-4 animate-spin text-[#5e6ad2]" />
          <span>Loading team members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#10111a] text-[#e2e4ef] select-none flex flex-col justify-start font-sans">
      {/* ============================================================== */}
      {/* TOP-LEFT NAVIGATION: < [Team Logo] [Team Name]                 */}
      {/* ============================================================== */}
      <div className="pt-5 px-6 sm:px-8">
        <Link
          href={`/settings/teams/${teamId}`}
          className="inline-flex items-center gap-2 text-[12.5px] text-[#8b90a4] hover:text-white transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#6b7086] group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <div
            className="w-4 h-4 rounded flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: teamColor }}
          >
            <TeamIconComponent className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-medium text-white tracking-tight">
            {team?.name || "Team"}
          </span>
        </Link>
      </div>

      {/* ============================================================== */}
      {/* PAGE TITLE                                                     */}
      {/* ============================================================== */}
      <div className="px-6 sm:px-8 pt-5 pb-5">
        <h1 className="text-[22px] sm:text-[24px] font-semibold text-white tracking-tight">
          Team members
        </h1>
      </div>

      {/* ============================================================== */}
      {/* TOOLBAR: Search + Filter + Export CSV + Add a member           */}
      {/* ============================================================== */}
      <div className="px-6 sm:px-8 pb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search Bar & Dropdown */}
        <div className="flex items-center gap-2 flex-1 max-w-sm sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#656a82] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md bg-[#161827] border border-[#23263b] text-white text-[12.5px] placeholder-[#52576e] focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] outline-none transition"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
              className="h-8 px-2.5 rounded-md bg-[#161827] border border-[#23263b] hover:border-[#383d5e] text-[12px] text-[#c4c7d7] flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{selectedRoleFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#656a82]" />
            </button>

            {isRoleFilterOpen && (
              <div className="absolute top-9 left-0 z-50 w-36 py-1 rounded-md bg-[#151726] border border-[#292d47] shadow-xl text-xs">
                {["All", "Workspace admin", "Team lead", "Member"].map((roleOption) => (
                  <button
                    key={roleOption}
                    type="button"
                    onClick={() => {
                      setSelectedRoleFilter(roleOption);
                      setIsRoleFilterOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left transition hover:bg-white/[0.04] flex items-center justify-between cursor-pointer ${
                      selectedRoleFilter === roleOption
                        ? "text-white font-medium"
                        : "text-[#8b90a4]"
                    }`}
                  >
                    <span>{roleOption}</span>
                    {selectedRoleFilter === roleOption && (
                      <Check className="w-3 h-3 text-[#5e6ad2]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Export CSV & Add a member */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-8 px-3 rounded-md bg-[#161827] hover:bg-[#1f2237] border border-[#23263b] text-white text-[12px] font-medium transition cursor-pointer"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-3.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12.5px] font-medium transition shadow-[0_1px_2px_rgba(0,0,0,0.3)] cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a member</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MEMBERS TABLE                                                  */}
      {/* ============================================================== */}
      <div className="px-6 sm:px-8 border-t border-[#1c1e30]">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 px-3 py-2 text-[11.5px] font-medium text-[#656a82] border-b border-[#1c1e30]">
          <div
            onClick={() => setSortAsc(!sortAsc)}
            className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
          >
            <span>Name</span>
            <span className="text-[11px]">{sortAsc ? "↓" : "↑"}</span>
          </div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3 text-right pr-2">Role</div>
        </div>

        {/* Members Rows */}
        <div className="divide-y divide-[#181a29]">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 items-center px-3 py-2.5 text-[12.5px] hover:bg-white/[0.02] transition-colors rounded-md group"
            >
              {/* Name + Avatar */}
              <div className="col-span-5 flex items-center gap-2.5 truncate pr-3">
                <div className="w-6 h-6 rounded-full bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden ring-1 ring-white/10 shadow-sm">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{member.name ? member.name[0].toUpperCase() : "U"}</span>
                  )}
                </div>
                <div className="truncate">
                  <p className="font-medium text-white group-hover:text-white truncate">
                    {member.name}
                  </p>
                  {member.username && (
                    <p className="text-[11px] text-[#656a82] truncate">
                      {member.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="col-span-4 text-[#8b90a4] truncate text-[12px]">
                {member.email}
              </div>

              {/* Role */}
              <div className="col-span-3 flex justify-end pr-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1e2034] text-[#a5a9c0] border border-[#2b2e4a]">
                  {member.role || "Member"}
                </span>
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-xs text-[#656a82]">
              No members found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD A MEMBER                                            */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#25283e] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#23253a]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#5e6ad2]" />
                <h3 className="text-[14px] font-semibold text-white">
                  Add member to {team?.name || "team"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8b90a4] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-5 space-y-4">
              {inviteError && (
                <div className="p-2.5 rounded-md bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#f87171] text-xs">
                  {inviteError}
                </div>
              )}

              <div>
                <label className="block text-[11.5px] font-medium text-[#8b90a4] mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#656a82] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-md bg-[#10111a] border border-[#23253a] focus:border-[#5e6ad2] text-white text-[13px] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#8b90a4] mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-[#10111a] border border-[#23253a] focus:border-[#5e6ad2] text-white text-[13px] outline-none transition cursor-pointer"
                >
                  <option value="Member">Member</option>
                  <option value="Team lead">Team lead</option>
                  <option value="Workspace admin">Workspace admin</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#23253a] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#8b90a4] hover:text-white hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInvite || !inviteEmail.trim()}
                  className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#5e6ad2] hover:bg-[#6875e5] text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingInvite && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
