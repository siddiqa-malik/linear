"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/workspace/Sidebar";
import { AuthGuard } from "@/components/common/AuthGuard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  Star,
  MoreHorizontal,
  Link2,
  Plus,
  Settings,
  ChevronRight,
  MessageSquare,
  Users,
  FileText,
  Loader2,
  ExternalLink,
  Check,
  X,
  Share2,
  BookOpen,
  SlidersHorizontal,
  ArrowDown,
  Search,
  UserPlus,
  LogOut,
  Trash2,
} from "lucide-react";

interface TeamData {
  _id: string;
  name: string;
  key?: string;
  description?: string;
  status?: string;

  color?: string;
  icon?: string;
  isPrivate?: boolean;
  members?: Array<{ userId: any; role: string }>;
  workspaceId?: string;
  createdAt?: string;
}

interface TeamMemberRow {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
  isInvited: boolean;
  status?: string;
  joinedAt?: string | Date;
}

// Helper for initials
const getInitials = (str: string) => {
  if (!str) return "U";
  if (str.includes("@")) {
    const prefix = str.split("@")[0];
    return prefix.slice(0, 2).toUpperCase();
  }
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return str.slice(0, 2).toUpperCase();
};

// Deterministic pleasant avatar backgrounds
const getAvatarBg = (str: string) => {
  const colors = [
    "bg-[#7c3aed]", // Purple
    "bg-[#059669]", // Emerald
    "bg-[#2563eb]", // Blue
    "bg-[#d97706]", // Amber
    "bg-[#475569]", // Slate
    "bg-[#db2777]", // Pink
    "bg-[#0891b2]", // Cyan
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/* ============================================================== */
/* EXACT SVG ICONS MATCHING USER SCREENSHOT                       */
/* ============================================================== */

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
function TeamBadge({
  team,
  size = "md",
}: {
  team: { name: string; color?: string; icon?: string };
  size?: "sm" | "md" | "lg";
}) {
  const color = team.color || "#10b981";
  const name = (team.name || "").toLowerCase();

  const sizeClass =
    size === "lg"
      ? "w-8 h-8 rounded-lg"
      : size === "sm"
        ? "w-4 h-4 rounded-full text-[9px]"
        : "w-5 h-5 rounded-full text-[10px]";

  const iconSizeClass = size === "lg" ? "w-4 h-4" : "w-2.5 h-2.5";

  // If team is designer / design
  if (team.icon === "Palette" || name.includes("design")) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className={iconSizeClass}>
          <circle cx="5" cy="5" r="1.5" />
          <circle cx="11" cy="5" r="1.5" />
          <circle cx="8" cy="11" r="1.5" />
        </svg>
      </div>
    );
  }

  // If team is web developer / developer (green smile face)
  if (team.icon === "Smile" || name.includes("web") || name.includes("dev")) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={iconSizeClass}
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M5.5 9.5C6.2 10.5 7.1 11 8 11C8.9 11 9.8 10.5 10.5 9.5" strokeLinecap="round" />
          <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // Terminal / code
  if (team.icon === "Terminal" || name.includes("tech") || name.includes("code")) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={iconSizeClass}
        >
          <path d="M4 6L6.5 8L4 10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10H12" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default initial
  return (
    <div
      className={`${sizeClass} flex items-center justify-center shrink-0 text-white font-bold shadow-sm`}
      style={{ backgroundColor: color }}
    >
      {team.name ? team.name.charAt(0).toUpperCase() : "T"}
    </div>
  );
}

export default function TeamOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const teamId = params?.teamId as string;

  const [team, setTeam] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs: Overview, Documents, Members
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "members">("overview");

  // Interaction states
  const [isStarred, setIsStarred] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // In-line description edit
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [isSavingDesc, setIsSavingDesc] = useState(false);

  // Resource list
  const [resources, setResources] = useState<Array<{ id: string; title: string; url?: string }>>([]);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");

  // Connect Channel Modal
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelConnected, setChannelConnected] = useState(false);

  // Real Database Members & Invitations State
  const { currentWorkspace } = useWorkspace();
  const [membersList, setMembersList] = useState<TeamMemberRow[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Sorting & Filtering for Members Table
  const [sortAsc, setSortAsc] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Member Modal State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Workspace admin");
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [addMemberToast, setAddMemberToast] = useState<string | null>(null);

  // 3-dots Member Action Menu State
  const [activeMenuMemberId, setActiveMenuMemberId] = useState<string | null>(null);
  const [isProcessingMemberAction, setIsProcessingMemberAction] = useState(false);

  // Check URL tab query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const tabParam = sp.get("tab");
      if (tabParam === "members" || tabParam === "documents") {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Fetch real database members and invitations directly from MongoDB
  const fetchMembersData = useCallback((targetTeam?: TeamData | null) => {
    if (!targetTeam) return;

    try {
      setIsLoadingMembers(true);

      const list: TeamMemberRow[] = [];
      const seenEmails = new Set<string>();

      // 1. Process real database members directly from targetTeam.members
      if (Array.isArray(targetTeam.members) && targetTeam.members.length > 0) {
        targetTeam.members.forEach((tm: any, idx: number) => {
          const u: any = typeof tm.userId === "object" ? tm.userId : null;
          const userEmail = (tm.email || u?.email || "").toLowerCase().trim();
          if (!userEmail || seenEmails.has(userEmail)) return;
          seenEmails.add(userEmail);

          const isInv = tm.status === "invited" || tm.status === "pending" || Boolean(tm.isInvited);
          const userName = u?.name || tm.name || userEmail.split("@")[0];
          const userHandle = userEmail.split("@")[0];

          // Format clean role title
          let roleTitle = "Member";
          if (tm.role === "lead") {
            roleTitle = "Team Lead";
          } else if (tm.role === "admin" || u?.role === "admin") {
            roleTitle = "Workspace admin";
          }

          list.push({
            id: u?._id || tm._id || `team-m-${idx}`,
            name: userName,
            username: userHandle,
            email: userEmail,
            role: roleTitle,
            avatar: u?.avatar || null,
            isInvited: isInv,
            status: tm.status || (isInv ? "invited" : "active"),
            joinedAt: tm.joinedAt || targetTeam.createdAt,
          });
        });
      }

      // 2. Also check targetTeam.invitations if any pending invite exists in DB
      if (Array.isArray((targetTeam as any).invitations)) {
        (targetTeam as any).invitations.forEach((inv: any, idx: number) => {
          if (inv?.email) {
            const em = inv.email.toLowerCase().trim();
            if (!seenEmails.has(em)) {
              seenEmails.add(em);
              list.push({
                id: inv._id || `team-inv-${idx}`,
                name: em.split("@")[0],
                username: em.split("@")[0],
                email: em,
                role: inv.role === "lead" ? "Team Lead" : "Member",
                avatar: null,
                isInvited: true,
                status: "invited",
                joinedAt: inv.createdAt,
              });
            }
          }
        });
      }

      // 3. Fallback: If team members list was completely empty in DB, show current user as Lead
      if (list.length === 0 && user?.email) {
        const em = user.email.toLowerCase().trim();
        seenEmails.add(em);
        list.push({
          id: user._id || "current-user",
          name: user.name || em.split("@")[0],
          username: em.split("@")[0],
          email: user.email,
          role: "Team Lead",
          avatar: user.avatar,
          isInvited: false,
          status: "active",
        });
      }

      setMembersList(list);
    } catch (err) {
      console.error("Failed to parse real members from DB:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [user?.email, user?.name, user?._id, user?.avatar]);

  // Handle Add Member Submission
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !team) return;

    try {
      setIsSubmittingInvite(true);
      setAddMemberError(null);

      const targetEmail = newMemberEmail.trim().toLowerCase();
      const targetRole = newMemberRole.toLowerCase().includes("lead") ? "lead" : "member";

      // Call Team Member API to persist to MongoDB team.members / team.invitations
      const res: any = await api.post(`/teams/${team._id}/members`, {
        email: targetEmail,
        role: targetRole,
      });

      const updatedTeam = res?.data || res?.team || res;
      if (updatedTeam && updatedTeam._id) {
        setTeam(updatedTeam);
        fetchMembersData(updatedTeam);
      } else {
        await fetchTeam();
      }

      setAddMemberToast(`Member / invitation saved for ${targetEmail}`);
      setTimeout(() => setAddMemberToast(null), 3000);

      setNewMemberEmail("");
      setIsAddMemberModalOpen(false);
    } catch (err: any) {
      setAddMemberError(err?.message || "Failed to invite member to team");
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  // Handle Remove Member from Team
  const handleRemoveMember = async (targetMember: TeamMemberRow) => {
    if (!team) return;
    try {
      setIsProcessingMemberAction(true);
      setActiveMenuMemberId(null);

      const targetId = (!targetMember.id || targetMember.id.startsWith("team-"))
        ? targetMember.email
        : targetMember.id;

      // Optimistically remove from state so UI updates immediately
      setMembersList((prev) =>
        prev.filter(
          (m) =>
            m.id !== targetMember.id &&
            m.email.toLowerCase() !== targetMember.email.toLowerCase()
        )
      );

      const res: any = await api.delete(
        `/teams/${team._id}/members/${encodeURIComponent(targetId)}?email=${encodeURIComponent(targetMember.email || "")}`
      );

      const updatedTeam = res?.data || res?.team || res;
      if (updatedTeam && updatedTeam._id) {
        setTeam(updatedTeam);
        fetchMembersData(updatedTeam);
      }

      setAddMemberToast(`${targetMember.name || targetMember.email} removed from ${team.name}`);
      setTimeout(() => setAddMemberToast(null), 3000);
    } catch (err: any) {
      console.error("Failed to remove member:", err);
      fetchTeam();
      setAddMemberToast(err?.message || "Failed to remove member");
      setTimeout(() => setAddMemberToast(null), 3000);
    } finally {
      setIsProcessingMemberAction(false);
    }
  };

  // Handle Admin / User Leave Team
  const handleLeaveTeam = async (targetMember: TeamMemberRow) => {
    if (!team) return;
    const confirmLeave = window.confirm(`Are you sure you want to leave ${team.name}?`);
    if (!confirmLeave) return;

    try {
      setIsProcessingMemberAction(true);
      setActiveMenuMemberId(null);

      const targetId = (!targetMember.id || targetMember.id.startsWith("team-"))
        ? (targetMember.email || user?.email || user?._id || "")
        : targetMember.id;

      // Optimistically remove from state
      setMembersList((prev) =>
        prev.filter(
          (m) =>
            m.id !== targetMember.id &&
            m.email.toLowerCase() !== (targetMember.email || "").toLowerCase()
        )
      );

      const res: any = await api.delete(
        `/teams/${team._id}/members/${encodeURIComponent(targetId)}?email=${encodeURIComponent(targetMember.email || user?.email || "")}`
      );

      const isCurrentLoggedInUser =
        (user?.email && targetMember.email.toLowerCase() === user.email.toLowerCase()) ||
        (user?._id && targetMember.id === user._id);

      if (isCurrentLoggedInUser) {
        setAddMemberToast(`You have left ${team.name}`);
        setTimeout(() => {
          setAddMemberToast(null);
          router.push("/settings/teams");
        }, 600);
      } else {
        const updatedTeam = res?.data || res?.team || res;
        if (updatedTeam && updatedTeam._id) {
          setTeam(updatedTeam);
          fetchMembersData(updatedTeam);
        }
        setAddMemberToast(`${targetMember.name || targetMember.email} has left ${team.name}`);
        setTimeout(() => setAddMemberToast(null), 3000);
      }
    } catch (err: any) {
      console.error("Failed to leave team:", err);
      fetchTeam();
      setAddMemberToast(err?.message || "Failed to leave team");
      setTimeout(() => setAddMemberToast(null), 3000);
    } finally {
      setIsProcessingMemberAction(false);
    }
  };

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    let result = membersList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });
  }, [membersList, searchQuery, sortAsc]);

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/teams/${teamId}`);
      const data = res?.team || res?.data || res;
      if (data && (data._id || data.name)) {
        setTeam(data);
        setDescriptionValue(data.description || "");
        fetchMembersData(data);
      } else {
        setError("Team not found");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load team");
    } finally {
      setIsLoading(false);
    }
  }, [teamId, fetchMembersData]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);


  // Copy link handler
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  // Save Description
  const handleSaveDescription = async () => {
    if (!team) return;
    try {
      setIsSavingDesc(true);
      await api.patch(`/teams/${team._id}`, { description: descriptionValue.trim() });
      setTeam((prev) => (prev ? { ...prev, description: descriptionValue.trim() } : null));
      setIsEditingDesc(false);
    } catch (err) {
      console.error("Failed to update description:", err);
    } finally {
      setIsSavingDesc(false);
    }
  };

  // Add Resource Link
  const handleAddResource = () => {
    if (!newResourceTitle.trim()) return;
    setResources((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newResourceTitle.trim() },
    ]);
    setNewResourceTitle("");
    setIsAddingResource(false);
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex h-screen bg-[#0f1017] text-[#e2e4ef] overflow-hidden select-none font-sans">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-xs text-[#8a8f98]">
              <Loader2 className="w-4 h-4 animate-spin text-[#5e6ad2]" />
              <span>Loading team overview...</span>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !team) {
    return (
      <AuthGuard>
        <div className="flex h-screen bg-[#0f1017] text-[#e2e4ef] overflow-hidden select-none font-sans">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-[14px] text-[#f87171] mb-3">{error || "Team not found"}</p>
            <Link
              href="/settings/teams"
              className="text-xs text-[#5e6ad2] hover:text-[#7884ea] underline"
            >
              Back to teams
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#0f1017] text-[#e2e4ef] overflow-hidden select-none font-sans">
        {/* Left Workspace Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0f1017]">
          {/* ============================================================== */}
          {/* 1. TOP APP BAR MATCHING SCREENSHOT                             */}
          {/*    [icon] team_name  ☆  ...                               🔗 */}
          {/* ============================================================== */}
          <div className="h-11 px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f1017]/80 backdrop-blur-md sticky top-0 z-20">
            {/* Left: [icon] team_name ☆ ... */}
            <div className="flex items-center gap-2.5">
              <TeamBadge team={team} size="sm" />
              <span className="text-[13.5px] font-semibold text-white tracking-tight">
                {team.name}
              </span>

              {/* Star / Favorite button */}
              <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`p-1 rounded hover:bg-white/[0.06] transition cursor-pointer ${isStarred ? "text-amber-400" : "text-[#8a8f98] hover:text-white"
                  }`}
                title={isStarred ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className="w-3.5 h-3.5"
                  fill={isStarred ? "currentColor" : "none"}
                />
              </button>

              {/* More options (...) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  title="Team options"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {isMoreMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsMoreMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-[#161726] border border-[#23253a] shadow-2xl py-1 z-40 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          handleCopyLink();
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-[#c5c8d6] hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                      >
                        <Link2 className="w-3.5 h-3.5 text-[#8a8f98]" />
                        <span>Copy team link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          router.push(`/settings/teams/${team._id}`);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-[#c5c8d6] hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#8a8f98]" />
                        <span>Team settings</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Copy link icon matching screenshot */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer relative"
                title="Copy link"
              >
                {isLinkCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Link2 className="w-3.5 h-3.5" />
                )}

                {isLinkCopied && (
                  <span className="absolute -bottom-7 right-0 text-[11px] bg-[#161726] text-white px-2 py-0.5 rounded shadow border border-white/[0.08] whitespace-nowrap animate-in fade-in">
                    Link copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. TABS ROW: [Overview]  [Documents]  [Members]                */}
          {/* ============================================================== */}
          <div className="px-8 pt-4 pb-2 border-b border-white/[0.04] flex items-center justify-between bg-[#0f1017]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1 rounded-md text-[13px] transition cursor-pointer ${activeTab === "overview"
                  ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                  : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                Overview
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-1 rounded-md text-[13px] transition cursor-pointer ${activeTab === "documents"
                  ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                  : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                Documents
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={`px-3 py-1 rounded-md text-[13px] transition cursor-pointer ${activeTab === "members"
                  ? "bg-[#1c1e2e] text-white font-medium border border-white/[0.08] shadow-sm"
                  : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                Members
              </button>
            </div>

            {/* Right side buttons for Members tab matching user screenshot */}
            {activeTab === "members" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddMemberError(null);
                    setNewMemberEmail("");
                    setIsAddMemberModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-[12px] font-medium transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a member</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-1.5 rounded-md transition cursor-pointer ${isFilterOpen || searchQuery.trim()
                    ? "bg-white/[0.1] text-white"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.06]"
                    }`}
                  title="Filter members"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 3. MAIN CONTENT: OVERVIEW TAB (CENTERED TWO COLUMN LAYOUT)     */}
          {/* ============================================================== */}
          {activeTab === "overview" && (
            <main className="flex-1 overflow-y-auto">
              <div className="w-full max-w-[840px] mx-auto px-6 sm:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
                  {/* -------------------------------------------------------- */}
                  {/* LEFT / MAIN COLUMN (~65%)                                */}
                  {/* -------------------------------------------------------- */}
                  <div className="md:col-span-8 space-y-8">
                    {/* Team Title & Large Icon */}
                    <div>
                      <div className="flex items-center gap-3">
                        <TeamBadge team={team} size="lg" />
                        <h1 className="text-[26px] sm:text-[28px] font-bold text-white tracking-tight">
                          {team.name}
                        </h1>
                      </div>

                      {/* Description: "Add a description..." */}
                      <div className="mt-3 pl-0.5">
                        {isEditingDesc ? (
                          <div className="space-y-2 max-w-lg">
                            <textarea
                              value={descriptionValue}
                              onChange={(e) => setDescriptionValue(e.target.value)}
                              placeholder="What does this team do?"
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg bg-[#161726] border border-[#2a2c42] text-xs text-white placeholder-[#626674] focus:outline-none focus:border-[#5e6ad2] transition"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSaveDescription}
                                disabled={isSavingDesc}
                                className="px-3 py-1 rounded bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                              >
                                {isSavingDesc ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDescriptionValue(team.description || "");
                                  setIsEditingDesc(false);
                                }}
                                className="px-3 py-1 rounded bg-transparent hover:bg-white/[0.06] text-[#8a8f98] text-xs transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : team.description ? (
                          <p
                            onClick={() => setIsEditingDesc(true)}
                            className="text-[13.5px] text-[#a5a9c0] hover:text-white transition cursor-pointer max-w-xl leading-relaxed"
                            title="Click to edit description"
                          >
                            {team.description}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingDesc(true)}
                            className="text-[13.5px] text-[#626674] hover:text-[#8a8f98] transition cursor-pointer"
                          >
                            Add a description...
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Team Resources Section */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <h2 className="text-[16px] font-semibold text-white tracking-tight">
                          Team resources
                        </h2>

                        {/* Right action buttons (+ and split icon) */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setIsAddingResource(true)}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                            title="Add resource"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => router.push(`/projects?team=${team._id}`)}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                            title="View team projects"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[12.5px] text-[#626674] mb-4">
                        Add documents and links. Organize by creating sections.
                      </p>

                      {/* Inline add resource */}
                      {isAddingResource && (
                        <div className="mb-4 p-3 rounded-lg bg-[#161726] border border-[#2a2c42] max-w-md space-y-2">
                          <input
                            type="text"
                            value={newResourceTitle}
                            onChange={(e) => setNewResourceTitle(e.target.value)}
                            placeholder="e.g. Design System Figma, API Docs, Notion..."
                            className="w-full px-2.5 py-1.5 rounded bg-[#10111a] border border-[#2a2c42] text-xs text-white focus:outline-none focus:border-[#5e6ad2]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddResource();
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleAddResource}
                              className="px-2.5 py-1 rounded bg-[#5e6ad2] text-white text-xs font-medium cursor-pointer"
                            >
                              Add link
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingResource(false)}
                              className="px-2.5 py-1 rounded text-[#8a8f98] hover:text-white text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Resources list */}
                      {resources.length > 0 && (
                        <div className="space-y-1.5 max-w-md">
                          {resources.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-[#161726]/40 hover:bg-[#161726] text-xs text-white transition group"
                            >
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-3.5 h-3.5 text-[#8a8f98]" />
                                <span>{r.title}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setResources((prev) => prev.filter((item) => item.id !== r.id))
                                }
                                className="opacity-0 group-hover:opacity-100 text-[#626674] hover:text-white cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* RIGHT COLUMN (SIDEBAR SECTION ~35%)                      */}
                  {/* -------------------------------------------------------- */}
                  <div className="md:col-span-4 md:pl-2 space-y-6">
                    {/* Members */}
                    <div>
                      <h3 className="text-[12px] font-medium text-[#8a8f98] mb-2.5">
                        Members {membersList.length > 0 && `(${membersList.length})`}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {membersList.length > 0 ? (
                          membersList.slice(0, 6).map((m) => {
                            const initials = getInitials(m.name || m.email);
                            const avatarBg = getAvatarBg(m.email || m.name);
                            return (
                              <div
                                key={m.id}
                                onClick={() => setActiveTab("members")}
                                className="relative cursor-pointer group"
                                title={`${m.name} (${m.role}${m.isInvited ? " - Invited" : ""})`}
                              >
                                {m.avatar ? (
                                  <img
                                    src={m.avatar}
                                    alt={m.name}
                                    className="w-6 h-6 rounded-full object-cover border border-white/20 hover:border-white/60 transition"
                                  />
                                ) : (
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white border border-white/20 hover:border-white/60 transition ${avatarBg}`}
                                  >
                                    {initials}
                                  </div>
                                )}
                                {m.isInvited && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#5e6ad2] border border-[#161726]" />
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div
                            onClick={() => router.push(`/settings/teams/${team._id}/members`)}
                            className="w-6 h-6 rounded-full bg-[#0ca678] border border-white/20 text-white text-[10px] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                            title={user?.name || user?.email || "Member"}
                          >
                            {user?.name
                              ? user.name.slice(0, 2).toUpperCase()
                              : user?.email
                                ? user.email.slice(0, 2).toUpperCase()
                                : "U"}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsAddMemberModalOpen(true)}
                          className="w-6 h-6 rounded-full border border-dashed border-white/20 text-[#8a8f98] hover:text-white hover:border-white/40 flex items-center justify-center transition cursor-pointer"
                          title="Add member"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Go to */}
                    <div className="pt-2">
                      <h3 className="text-[12px] font-medium text-[#8a8f98] mb-2">
                        Go to
                      </h3>

                      <div className="space-y-0.5 text-[13px]">
                        {/* 1. Connect channel */}
                        <button
                          type="button"
                          onClick={() => setIsConnectModalOpen(true)}
                          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition cursor-pointer text-left"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Connect channel</span>
                        </button>

                        {/* 2. Team settings */}
                        <Link
                          href={`/settings/teams/${team._id}`}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 shrink-0" />
                          <span>Team settings</span>
                        </Link>

                        {/* 3. Issues */}
                        <Link
                          href={`/teams/${team._id}/issues`}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
                        >
                          <IssueIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>Issues</span>
                        </Link>

                        {/* 4. Projects */}
                        <Link
                          href={`/projects?team=${team._id}`}
                          className="flex items-center justify-between px-2 py-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <ProjectCubeIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>Projects</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-[#626674]" />
                        </Link>

                        {/* 5. Views */}
                        <Link
                          href={`/views?team=${team._id}`}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
                        >
                          <ViewsIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>Views</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ============================================================== */}
          {/* DOCUMENTS TAB                                                  */}
          {/* ============================================================== */}
          {activeTab === "documents" && (
            <main className="flex-1 overflow-y-auto">
              <div className="w-full max-w-[840px] mx-auto px-6 sm:px-8 py-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white tracking-tight">Documents</h2>
                    <p className="text-xs text-[#8a8f98] mt-1">
                      Team knowledge, architecture specs, and roadmaps
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingResource(true)}
                    className="px-3 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create document</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#161726]/40 hover:bg-[#161726] transition cursor-pointer">
                    <div className="flex items-center gap-2 text-white text-sm font-medium mb-1">
                      <FileText className="w-4 h-4 text-[#5e6ad2]" />
                      <span>Team Onboarding Guide</span>
                    </div>
                    <p className="text-xs text-[#8a8f98]">
                      Overview of development practices, code review standards, and tools
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#161726]/40 hover:bg-[#161726] transition cursor-pointer">
                    <div className="flex items-center gap-2 text-white text-sm font-medium mb-1">
                      <FileText className="w-4 h-4 text-[#0ca678]" />
                      <span>Quarterly Objectives & Milestones</span>
                    </div>
                    <p className="text-xs text-[#8a8f98]">
                      Key roadmap initiatives and target deliverables for this quarter
                    </p>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ============================================================== */}
          {/* 4. MEMBERS TAB: FULL WIDTH TABLE MATCHING USER SCREENSHOT       */}
          {/* ============================================================== */}
          {activeTab === "members" && (
            <main className="flex-1 overflow-y-auto px-8 py-3">
              {/* Filter search bar if toggled */}
              {isFilterOpen && (
                <div className="mb-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-[#656a82] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 rounded-md bg-[#161827] border border-[#23263b] text-white text-[12.5px] placeholder-[#52576e] focus:border-[#5e6ad2] outline-none"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#8a8f98] hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {/* Members Table */}
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-12 py-2 border-b border-white/[0.06] text-[12px] font-medium text-[#707383] select-none">
                  <div
                    onClick={() => setSortAsc(!sortAsc)}
                    className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                  >
                    <span>Name</span>
                    <ArrowDown className={`w-3 h-3 transition-transform ${sortAsc ? "rotate-0" : "rotate-180"}`} />
                  </div>
                  <div className="col-span-4">
                    <span>Email</span>
                  </div>
                  <div className="col-span-3">
                    <span>Role</span>
                  </div>
                </div>

                {/* Table Body */}
                {isLoadingMembers ? (
                  <div className="py-16 flex items-center justify-center gap-2 text-xs text-[#8a8f98]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#5e6ad2]" />
                    <span>Loading members from database...</span>
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#8a8f98]">
                    No members or invitations found in database.
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.03]">
                    {filteredMembers.map((m) => {
                      const initials = getInitials(m.name || m.email);
                      const avatarBg = getAvatarBg(m.email || m.name);
                      const isAdmin =
                        m.role.toLowerCase().includes("lead") ||
                        m.role.toLowerCase().includes("admin") ||
                        m.email.toLowerCase() === user?.email?.toLowerCase();
                      const isMenuOpen = activeMenuMemberId === m.id;

                      return (
                        <div
                          key={m.id}
                          className="group relative grid grid-cols-12 py-3 items-center hover:bg-white/[0.02] transition-colors rounded-sm"
                        >
                          {/* Column 1: Avatar + Name + Subtext handle */}
                          <div className="col-span-5 flex items-center gap-3 min-w-0 pr-4">
                            {m.avatar ? (
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-semibold text-white shrink-0 shadow-sm ${avatarBg}`}
                              >
                                {initials}
                              </div>
                            )}

                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-medium text-white truncate">
                                {m.name}
                              </span>
                              {m.username && m.username.toLowerCase() !== m.name.toLowerCase() && (
                                <span className="text-[11.5px] text-[#707383] truncate -mt-0.5">
                                  @{m.username}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Column 2: Email */}
                          <div className="col-span-4 text-[13px] text-[#8a8f98] truncate pr-4">
                            {m.email}
                          </div>

                          {/* Column 3: Real Database Role & Status Badge + 3 Dots Menu */}
                          <div className="col-span-3 flex items-center justify-between pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-medium text-[#c5c8d6]">
                                {m.role || "Member"}
                              </span>
                              {m.isInvited ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-[#5e6ad2]/15 text-[#9aa4fa] border border-[#5e6ad2]/30">
                                  Invited
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-medium text-[#10b981]">
                                  Active
                                </span>
                              )}
                            </div>

                            {/* 3-dots Menu Button */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuMemberId(isMenuOpen ? null : m.id);
                                }}
                                className={`w-7 h-7 rounded flex items-center justify-center text-[#8a8f98] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer ${isMenuOpen ? "opacity-100 bg-white/[0.08]" : "opacity-0 group-hover:opacity-100"
                                  }`}
                                title="Member actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {isMenuOpen && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuMemberId(null);
                                    }}
                                  />
                                  <div
                                    className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-[#141522] border border-[#26283b] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {isAdmin ? (
                                      <button
                                        type="button"
                                        onClick={() => handleLeaveTeam(m)}
                                        disabled={isProcessingMemberAction}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-[#eb5757] hover:bg-rose-500/10 hover:text-[#ff6b6b] transition cursor-pointer"
                                      >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Leave team</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveMember(m)}
                                        disabled={isProcessingMemberAction}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-[#eb5757] hover:bg-rose-500/10 hover:text-[#ff6b6b] transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Remove from team</span>
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>
          )}
        </div>

        {/* Connect Channel Modal */}
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl bg-[#161726] border border-[#23253a] shadow-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#5e6ad2]" />
                  <h3 className="text-sm font-semibold text-white">Connect Slack or Discord</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="text-[#8a8f98] hover:text-white p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Receive notifications when new issues are created, assigned, or closed in {team.name}.
              </p>

              <div>
                <label className="block text-[11px] font-medium text-[#c5c8d6] uppercase tracking-wider mb-1.5">
                  Channel name or Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="#proj-team or https://hooks.slack.com/..."
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10111a] border border-[#2a2c42] text-xs text-white focus:outline-none focus:border-[#5e6ad2]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-xs text-[#8a8f98] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChannelConnected(true);
                    setIsConnectModalOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer"
                >
                  Save channel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Member Modal */}
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl bg-[#161726] border border-[#282b42] shadow-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#5e6ad2]" />
                  <h3 className="text-sm font-semibold text-white">Add a member</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="text-[#8a8f98] hover:text-white p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Invite a teammate to collaborate in <span className="text-white font-medium">{team.name}</span>. An invitation will be saved and sent to their email.
              </p>

              {addMemberError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {addMemberError}
                </div>
              )}

              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#c5c8d6] uppercase tracking-wider mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#10111a] border border-[#2a2c42] text-xs text-white placeholder-[#52576e] focus:outline-none focus:border-[#5e6ad2]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#c5c8d6] uppercase tracking-wider mb-1.5">
                    Role
                  </label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#10111a] border border-[#2a2c42] text-xs text-white focus:outline-none focus:border-[#5e6ad2]"
                  >
                    <option value="Workspace admin">Workspace admin</option>
                    <option value="Member">Member</option>
                    <option value="Team lead">Team lead</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="px-3 py-1.5 rounded-md text-xs text-[#8a8f98] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingInvite || !newMemberEmail.trim()}
                    className="px-4 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmittingInvite ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending invite...</span>
                      </>
                    ) : (
                      <span>Add member</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {addMemberToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1e2030] text-white text-[12px] px-3.5 py-2 rounded-lg border border-[#2a2c3f] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            {addMemberToast}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
