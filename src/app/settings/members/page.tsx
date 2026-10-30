"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { InviteMemberModal } from "@/components/settings/InviteMemberModal";
import {
  Search,
  ChevronDown,
  ArrowDown,
  Loader2,
  Check,
  X,
  UserPlus,
} from "lucide-react";

interface MemberItem {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  roleBadge?: "admin" | "admin-invited" | "member" | "left";
  teamsCount: number;
  teamsLabel: string;
  joinedDate: string;
  lastSeen: string;
  isOnline?: boolean;
  avatar?: string | null;
  section: "active" | "invited" | "inactive";
}

// Helper to get initials
function getInitials(str: string): string {
  if (!str) return "U";
  if (str.includes("@")) {
    const local = str.split("@")[0];
    return local.slice(0, 2).toUpperCase();
  }
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return str.slice(0, 2).toUpperCase();
}

// Format date to MMM D (e.g. Oct 21)
function formatDateShort(dateVal: any): string {
  if (!dateVal) return "-";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  } catch {
    return String(dateVal);
  }
}

export default function SettingsMembersPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);

  // Raw fetched data
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch real database workspace members, invitations, and teams
  const fetchWorkspaceMembers = useCallback(async () => {
    try {
      setIsLoading(true);

      const wsId = currentWorkspace?._id;
      let wsData: any = null;

      if (wsId) {
        try {
          const wsRes = await api.get(`/workspaces/${wsId}`);
          wsData = wsRes?.data || wsRes;
        } catch {
          try {
            const listRes = await api.get("/workspaces");
            const list = listRes?.data || listRes || [];
            if (Array.isArray(list) && list.length > 0) {
              wsData = list.find((w: any) => w._id === wsId) || list[0];
            }
          } catch {}
        }
      }

      // Fetch teams in current workspace to compute exact team counts
      let teamsList: any[] = [];
      if (wsId) {
        try {
          const teamsRes = await api.get(`/teams?workspaceId=${wsId}`);
          teamsList = teamsRes?.data || teamsRes || [];
        } catch {}
      }

      const totalTeamsInWs = Array.isArray(teamsList) ? teamsList.length : 0;

      // Count teams helper for a specific user
      const countTeamsForUser = (userId?: string, email?: string): number => {
        if (!Array.isArray(teamsList) || teamsList.length === 0) return 0;
        const cleanEmail = email ? email.toLowerCase().trim() : "";
        const cleanUserId = userId ? userId.toString() : "";
        const c = teamsList.filter((tm) => {
          const hasMember = Array.isArray(tm.members) && tm.members.some((m: any) => {
            const mId = typeof m.userId === "object" ? m.userId?._id?.toString() : m.userId?.toString();
            const mEmail = typeof m.userId === "object" ? m.userId?.email?.toLowerCase().trim() : "";
            return (cleanUserId && mId === cleanUserId) || (cleanEmail && mEmail === cleanEmail);
          });
          const hasInvited = Array.isArray(tm.invitations) && tm.invitations.some((i: any) => {
            return cleanEmail && i.email?.toLowerCase().trim() === cleanEmail;
          });
          return hasMember || hasInvited;
        }).length;
        return c;
      };

      const result: MemberItem[] = [];
      const seenEmails = new Set<string>();

      // 1. Workspace Owner (Active)
      if (wsData?.ownerId) {
        const owner = typeof wsData.ownerId === "object" ? wsData.ownerId : null;
        const ownerEmail = owner?.email || user?.email;
        if (ownerEmail && !seenEmails.has(ownerEmail.toLowerCase().trim())) {
          seenEmails.add(ownerEmail.toLowerCase().trim());
          const ownerName = owner?.name || user?.name || ownerEmail.split("@")[0];
          const ownerAvatar = owner?.avatar || user?.avatar || null;
          const ownerJoined = wsData?.createdAt ? formatDateShort(wsData.createdAt) : "Oct 21";
          const ownerTeamsCount = countTeamsForUser(owner?._id || user?._id, ownerEmail);
          const isUserOnline = user?.email?.toLowerCase().trim() === ownerEmail.toLowerCase().trim();

          result.push({
            id: owner?._id || user?._id || "owner-1",
            name: ownerName,
            username: ownerEmail.split("@")[0],
            email: ownerEmail,
            role: "Admin",
            roleBadge: "admin",
            teamsCount: ownerTeamsCount,
            teamsLabel: ownerTeamsCount > 0 ? `${ownerTeamsCount} team${ownerTeamsCount === 1 ? "" : "s"}` : "-",
            joinedDate: ownerJoined,
            lastSeen: isUserOnline ? "Online" : ownerJoined,
            isOnline: isUserOnline,
            avatar: ownerAvatar,
            section: "active",
          });
        }
      }

      // 2. Workspace Members (From MongoDB wsData.members)
      if (Array.isArray(wsData?.members)) {
        wsData.members.forEach((m: any, idx: number) => {
          const u = typeof m.userId === "object" ? m.userId : null;
          const uId = u?._id?.toString() || (typeof m.userId === "string" ? m.userId : null);
          const em = (u?.email || "").toLowerCase().trim();

          if (em && !seenEmails.has(em)) {
            seenEmails.add(em);
            const teamsC = countTeamsForUser(uId, em);
            const isUserOnline = user?.email?.toLowerCase().trim() === em;
            const roleStr = m.role === "owner" || m.role === "admin" ? "Admin" : "Member";

            result.push({
              id: uId || `ws-m-${idx}`,
              name: u?.name || em.split("@")[0],
              username: em.split("@")[0],
              email: em,
              role: roleStr,
              roleBadge: roleStr === "Admin" ? "admin" : "member",
              teamsCount: teamsC,
              teamsLabel: teamsC > 0 ? `${teamsC} team${teamsC === 1 ? "" : "s"}` : "-",
              joinedDate: m.joinedAt ? formatDateShort(m.joinedAt) : formatDateShort(wsData.createdAt),
              lastSeen: isUserOnline ? "Online" : formatDateShort(m.joinedAt || wsData.createdAt),
              isOnline: isUserOnline,
              avatar: u?.avatar || null,
              section: "active",
            });
          }
        });
      }

      // 3. Workspace Invitations (From MongoDB wsData.invitations)
      const invitations: any[] = Array.isArray(wsData?.invitations) ? wsData.invitations : [];

      invitations.forEach((inv, idx) => {
        const invEmail = (inv.email || "").toLowerCase().trim();
        if (!invEmail) return;

        // Accepted Invitation: Show in Active section
        if (inv.status === "accepted") {
          if (!seenEmails.has(invEmail)) {
            seenEmails.add(invEmail);
            const teamsC = countTeamsForUser(undefined, invEmail);
            const isUserOnline = user?.email?.toLowerCase().trim() === invEmail;
            result.push({
              id: `inv-acc-${inv._id || idx}`,
              name: invEmail,
              username: invEmail.split("@")[0],
              email: invEmail,
              role: inv.role === "admin" ? "Admin" : "Member",
              roleBadge: inv.role === "admin" ? "admin" : "member",
              teamsCount: teamsC,
              teamsLabel: teamsC > 0 ? `${teamsC} team${teamsC === 1 ? "" : "s"}` : "-",
              joinedDate: inv.createdAt ? formatDateShort(inv.createdAt) : "Oct 23",
              lastSeen: isUserOnline ? "Online" : formatDateShort(inv.createdAt),
              isOnline: isUserOnline,
              avatar: null,
              section: "active",
            });
          }
          return;
        }

        // Inactive / Left member
        if (inv.status === "left" || inv.status === "inactive" || inv.status === "expired") {
          if (!seenEmails.has(invEmail)) {
            seenEmails.add(invEmail);
            result.push({
              id: `inactive-${inv._id || idx}`,
              name: invEmail,
              username: invEmail.split("@")[0],
              email: invEmail,
              role: "Left workspace",
              roleBadge: "left",
              teamsCount: 0,
              teamsLabel: "",
              joinedDate: inv.createdAt ? formatDateShort(inv.createdAt) : "Oct 22",
              lastSeen: formatDateShort(inv.createdAt),
              avatar: null,
              section: "inactive",
            });
          }
          return;
        }

        // Pending Invitations: Show in Invited section
        if (inv.status === "pending" || !inv.status) {
          if (!seenEmails.has(invEmail)) {
            seenEmails.add(invEmail);
            const teamsC = countTeamsForUser(undefined, invEmail);
            const roleTitle = inv.role === "admin" ? "Admin (Invited)" : "Member (Invited)";
            result.push({
              id: `invited-${inv._id || inv.token || idx}`,
              name: invEmail,
              username: invEmail.split("@")[0],
              email: invEmail,
              role: roleTitle,
              roleBadge: inv.role === "admin" ? "admin-invited" : "member",
              teamsCount: teamsC,
              teamsLabel: teamsC > 0 ? `${teamsC} team${teamsC === 1 ? "" : "s"}` : "-",
              joinedDate: inv.createdAt ? formatDateShort(inv.createdAt) : "Oct 23",
              lastSeen: "",
              avatar: null,
              section: "invited",
            });
          }
        }
      });

      // 4. Also check all teams in workspace to ensure no member or team invitation is omitted
      if (Array.isArray(teamsList)) {
        teamsList.forEach((tm) => {
          if (Array.isArray(tm.members)) {
            tm.members.forEach((m: any, mIdx: number) => {
              const u = typeof m.userId === "object" ? m.userId : null;
              const em = (m.email || u?.email || "").toLowerCase().trim();
              if (em && !seenEmails.has(em)) {
                seenEmails.add(em);
                const teamsC = countTeamsForUser(u?._id, em);
                const isInv = m.status === "invited" || m.status === "pending";
                const isUserOnline = user?.email?.toLowerCase().trim() === em;

                if (isInv) {
                  result.push({
                    id: u?._id || m._id || `team-inv-m-${mIdx}`,
                    name: em,
                    username: em.split("@")[0],
                    email: em,
                    role: m.role === "lead" ? "Team Lead (Invited)" : "Member (Invited)",
                    roleBadge: "member",
                    teamsCount: teamsC,
                    teamsLabel: teamsC > 0 ? `${teamsC} team${teamsC === 1 ? "" : "s"}` : "-",
                    joinedDate: m.joinedAt ? formatDateShort(m.joinedAt) : "Oct 23",
                    lastSeen: "",
                    avatar: null,
                    section: "invited",
                  });
                } else {
                  result.push({
                    id: u?._id || m._id || `team-user-${mIdx}`,
                    name: u?.name || em.split("@")[0],
                    username: em.split("@")[0],
                    email: em,
                    role: m.role === "lead" ? "Team Lead" : "Member",
                    roleBadge: "member",
                    teamsCount: teamsC,
                    teamsLabel: teamsC > 0 ? `${teamsC} team${teamsC === 1 ? "" : "s"}` : "-",
                    joinedDate: m.joinedAt ? formatDateShort(m.joinedAt) : "Oct 23",
                    lastSeen: isUserOnline ? "Online" : formatDateShort(m.joinedAt),
                    isOnline: isUserOnline,
                    avatar: u?.avatar || null,
                    section: "active",
                  });
                }
              }
            });
          }

          if (Array.isArray(tm.invitations)) {
            tm.invitations.forEach((inv: any, iIdx: number) => {
              if (inv?.email) {
                const em = inv.email.toLowerCase().trim();
                if (!seenEmails.has(em)) {
                  seenEmails.add(em);
                  const teamsC = countTeamsForUser(undefined, em);
                  result.push({
                    id: `tm-inv-${iIdx}`,
                    name: em,
                    username: em.split("@")[0],
                    email: em,
                    role: "Member (Invited)",
                    roleBadge: "member",
                    teamsCount: teamsC,
                    teamsLabel: teamsC > 0 ? `${teamsC} team${teamsC === 1 ? "" : "s"}` : "-",
                    joinedDate: inv.createdAt ? formatDateShort(inv.createdAt) : "Oct 23",
                    lastSeen: "",
                    avatar: null,
                    section: "invited",
                  });
                }
              }
            });
          }
        });
      }

      setMembers(result);
    } catch (err) {
      console.error("Failed to fetch workspace members:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace?._id, user]);

  useEffect(() => {
    fetchWorkspaceMembers();
  }, [fetchWorkspaceMembers]);

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    let list = members;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== "All") {
      if (roleFilter === "Admin") {
        list = list.filter((m) => m.role.includes("Admin"));
      } else if (roleFilter === "Member") {
        list = list.filter((m) => m.role.toLowerCase().includes("member"));
      } else if (roleFilter === "Left workspace") {
        list = list.filter((m) => m.role === "Left workspace");
      }
    }

    // Sort order by Name
    return [...list].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });
  }, [members, searchQuery, roleFilter, sortAsc]);

  const activeMembers = useMemo(
    () => filteredMembers.filter((m) => m.section === "active"),
    [filteredMembers]
  );

  const invitedMembers = useMemo(
    () => filteredMembers.filter((m) => m.section === "invited"),
    [filteredMembers]
  );

  const inactiveMembers = useMemo(
    () => filteredMembers.filter((m) => m.section === "inactive"),
    [filteredMembers]
  );

  // Export CSV handler
  const handleExportCSV = () => {
    try {
      const headers = ["Name", "Username", "Email", "Role", "Teams", "Joined", "Last seen"];
      const rows = filteredMembers.map((m) => [
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.username.replace(/"/g, '""')}"`,
        `"${m.email.replace(/"/g, '""')}"`,
        `"${m.role.replace(/"/g, '""')}"`,
        `"${m.teamsLabel.replace(/"/g, '""')}"`,
        `"${m.joinedDate}"`,
        `"${m.isOnline ? "Online" : m.lastSeen}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `workspace-members-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("CSV exported successfully");
    } catch {
      showToast("Failed to export CSV");
    }
  };

  return (
    <div className="min-h-full w-full bg-[#08090a] text-[#e2e4ef] px-6 sm:px-10 py-8 select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg bg-[#1a1b28] border border-[#5e6ad2] text-white text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header: Members */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-white tracking-tight">
          Members
        </h1>
      </div>

      {/* Toolbar: [🔍 Search by name or email] [All ▾] ... [Export CSV] [Invite] */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Left Controls: Search + Role Filter */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#6c7185] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full bg-[#12131b] border border-[#232537] focus:border-[#5e6ad2] rounded-lg pl-9 pr-3 py-1.5 text-[12.5px] text-white placeholder-[#6c7185] outline-none transition-colors"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-8 px-3 rounded-lg bg-[#12131b] hover:bg-[#1a1b26] border border-[#232537] flex items-center gap-1.5 text-[12px] text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
            >
              <span>{roleFilter}</span>
              <ChevronDown className="w-3 h-3 text-[#6c7185]" />
            </button>

            {isFilterDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsFilterDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-36 rounded-lg border border-[#232537] bg-[#12131b] shadow-2xl py-1 z-40 text-xs">
                  {["All", "Admin", "Member", "Left workspace"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setRoleFilter(opt);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors cursor-pointer ${
                        roleFilter === opt
                          ? "bg-[#1f2133] text-white font-medium"
                          : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span>{opt}</span>
                      {roleFilter === opt && <Check className="w-3 h-3 text-[#5e6ad2]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Controls: [Export CSV] [Invite] */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg bg-[#161722] hover:bg-[#1e202f] border border-[#26283b] hover:border-[#383a54] text-[#e2e4ef] hover:text-white text-[12px] font-medium transition-colors cursor-pointer"
          >
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium transition-colors cursor-pointer shadow-sm shadow-[#5e6ad2]/25"
          >
            Invite
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MEMBERS TABLE MATCHING SCREENSHOT EXACTLY                      */}
      {/* ============================================================== */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Table Header: Name ↓  Email  Role  Teams  Joined  Last seen */}
          <thead>
            <tr className="border-b border-[#1b1c28] text-[11.5px] font-medium text-[#707489]">
              <th className="py-2.5 pr-4 font-normal">
                <button
                  type="button"
                  onClick={() => setSortAsc(!sortAsc)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Name</span>
                  <ArrowDown
                    className={`w-3 h-3 transition-transform ${
                      sortAsc ? "" : "rotate-180"
                    }`}
                  />
                </button>
              </th>
              <th className="py-2.5 px-4 font-normal">Email</th>
              <th className="py-2.5 px-4 font-normal">Role</th>
              <th className="py-2.5 px-4 font-normal">Teams</th>
              <th className="py-2.5 px-4 font-normal">Joined</th>
              <th className="py-2.5 pl-4 font-normal">Last seen</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#707489]">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#5e6ad2]" />
                    <span>Loading workspace members...</span>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* ====================================================== */}
                {/* SECTION 1: Active {count}                              */}
                {/* ====================================================== */}
                {activeMembers.length > 0 && (
                  <>
                    <tr>
                      <td
                        colSpan={6}
                        className="pt-6 pb-2 text-[11.5px] font-medium text-[#6c7185] tracking-wide"
                      >
                        Active{" "}
                        <span className="text-[#55596e] ml-1">
                          {activeMembers.length}
                        </span>
                      </td>
                    </tr>

                    {activeMembers.map((m) => (
                      <tr
                        key={m.id}
                        className="group hover:bg-[#11121c] border-b border-[#151622]/60 transition-colors"
                      >
                        {/* Name + Subtext (username) */}
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            {/* Avatar */}
                            {m.avatar ? (
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                                {getInitials(m.name || m.username)}
                              </div>
                            )}

                            <div>
                              <p className="text-[12.5px] font-medium text-white leading-tight">
                                {m.name}
                              </p>
                              {m.username && (
                                <p className="text-[11px] text-[#6c7185] leading-tight mt-0.5">
                                  {m.username}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-[12px] text-[#8a8f98]">
                          {m.email}
                        </td>

                        {/* Role (Pill badge: Admin) */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#22263d] text-[#7084ff] text-[11px] font-medium">
                            {m.role}
                          </span>
                        </td>

                        {/* Teams */}
                        <td className="py-3 px-4 text-[12px] text-[#8a8f98]">
                          {m.teamsLabel || "-"}
                        </td>

                        {/* Joined */}
                        <td className="py-3 px-4 text-[12px] text-[#8a8f98]">
                          {m.joinedDate}
                        </td>

                        {/* Last seen */}
                        <td className="py-3 pl-4 text-[12px]">
                          {m.isOnline ? (
                            <span className="inline-flex items-center gap-1.5 text-white">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Online</span>
                            </span>
                          ) : (
                            <span className="text-[#8a8f98]">{m.lastSeen || "-"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {/* ====================================================== */}
                {/* SECTION 2: Invited {count}                             */}
                {/* ====================================================== */}
                {invitedMembers.length > 0 && (
                  <>
                    <tr>
                      <td
                        colSpan={6}
                        className="pt-7 pb-2 text-[11.5px] font-medium text-[#6c7185] tracking-wide"
                      >
                        Invited{" "}
                        <span className="text-[#55596e] ml-1">
                          {invitedMembers.length}
                        </span>
                      </td>
                    </tr>

                    {invitedMembers.map((m) => (
                      <tr
                        key={m.id}
                        className="group hover:bg-[#11121c] border-b border-[#151622]/60 transition-colors"
                      >
                        {/* Name with Dotted Outline Avatar */}
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            {/* Dotted Avatar Circle */}
                            <div className="w-6 h-6 rounded-full border border-dashed border-[#55596e] text-[#8a8f98] flex items-center justify-center text-[9.5px] font-medium shrink-0">
                              {getInitials(m.email)}
                            </div>

                            <p className="text-[12.5px] font-medium text-white">
                              {m.name}
                            </p>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-[12px] text-[#8a8f98]">
                          {m.email}
                        </td>

                        {/* Role (Pill badge: Admin (Invited)) */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#22263d] text-[#7084ff] text-[11px] font-medium">
                            {m.role}
                          </span>
                        </td>

                        {/* Teams */}
                        <td className="py-3 px-4 text-[12px] text-[#8a8f98]">
                          {m.teamsLabel || "-"}
                        </td>

                        {/* Joined / Invited Date */}
                        <td className="py-3 px-4 text-[12px] text-[#8a8f98]">
                          {m.joinedDate}
                        </td>

                        {/* Last seen (empty for invited) */}
                        <td className="py-3 pl-4 text-[12px] text-[#8a8f98]">
                          {m.lastSeen || ""}
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {/* ====================================================== */}
                {/* SECTION 3: Inactive {count}                            */}
                {/* ====================================================== */}
                {inactiveMembers.length > 0 && (
                  <>
                    <tr>
                      <td
                        colSpan={6}
                        className="pt-7 pb-2 text-[11.5px] font-medium text-[#6c7185] tracking-wide"
                      >
                        Inactive{" "}
                        <span className="text-[#55596e] ml-1">
                          {inactiveMembers.length}
                        </span>
                      </td>
                    </tr>

                    {inactiveMembers.map((m) => (
                      <tr
                        key={m.id}
                        className="group hover:bg-[#11121c] border-b border-[#151622]/60 transition-colors"
                      >
                        {/* Name (Dim text) + Dim Avatar */}
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            {/* Dim grey avatar */}
                            <div className="w-6 h-6 rounded-full bg-[#1b1c29] text-[#55596e] flex items-center justify-center text-[9.5px] font-medium shrink-0">
                              {getInitials(m.email)}
                            </div>

                            <div>
                              <p className="text-[12.5px] font-medium text-[#8a8f98]">
                                {m.name}
                              </p>
                              {m.username && (
                                <p className="text-[11px] text-[#55596e] mt-0.5">
                                  {m.username}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-[12px] text-[#55596e]">
                          {m.email}
                        </td>

                        {/* Role: Left workspace (Plain text, no pill!) */}
                        <td className="py-3 px-4 text-[12px] text-[#55596e]">
                          {m.role}
                        </td>

                        {/* Teams (Empty) */}
                        <td className="py-3 px-4 text-[12px] text-[#55596e]">
                          {m.teamsLabel || ""}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3 px-4 text-[12px] text-[#55596e]">
                          {m.joinedDate}
                        </td>

                        {/* Last seen */}
                        <td className="py-3 pl-4 text-[12px] text-[#55596e]">
                          {m.lastSeen}
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {/* Empty State */}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#6c7185]">
                      No members found matching &quot;{searchQuery}&quot;
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => {
          showToast("Invitation sent and saved!");
          fetchWorkspaceMembers();
        }}
      />
    </div>
  );
}
