"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Calendar,
  Loader2,
  Check,
  User,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ProjectStatusIcon } from "./ProjectStatusIcon";
import { ProjectPriorityIcon } from "./ProjectPriorityIcon";

export type ProjectStatusType =
  | "backlog"
  | "planned"
  | "in_progress"
  | "completed"
  | "canceled";

export type ProjectPriorityType = "none" | "urgent" | "high" | "medium" | "low";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  defaultTeamId?: string;
}

interface TeamMemberItem {
  name: string;
  email: string;
  initials: string;
}

interface TeamItem {
  _id: string;
  name: string;
  key?: string;
  color?: string;
  icon?: string;
}

function TeamAvatar({
  team,
  className = "w-4 h-4",
}: {
  team?: TeamItem | null;
  className?: string;
}) {
  if (!team) {
    return (
      <div
        className={`${className} rounded-full bg-[#10b981] flex items-center justify-center shrink-0 text-white shadow-sm`}
      >
        <span className="text-[9px] font-bold">T</span>
      </div>
    );
  }

  const color = team.color || "#10b981";
  const name = (team.name || "").toLowerCase();

  // If team is designer or design or Palette
  if (team.icon === "Palette" || name.includes("design")) {
    return (
      <div
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
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
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
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
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
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
      className={`${className} rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[9px] shadow-sm`}
      style={{ backgroundColor: color }}
      title={team.name}
    >
      {team.name ? team.name.charAt(0).toUpperCase() : "T"}
    </div>
  );
}

const STATUS_CONFIG: Record<
  ProjectStatusType,
  { label: string; color: string }
> = {
  backlog: {
    label: "Backlog",
    color: "#d97706",
  },
  planned: {
    label: "Planned",
    color: "#9ca3af",
  },
  in_progress: {
    label: "In progress",
    color: "#eab308",
  },
  completed: {
    label: "Completed",
    color: "#5e6ad2",
  },
  canceled: {
    label: "Canceled",
    color: "#707383",
  },
};

const PRIORITY_OPTIONS: Array<{
  key: ProjectPriorityType;
  label: string;
  renderIcon: () => React.ReactNode;
}> = [
  {
    key: "none",
    label: "No priority",
    renderIcon: () => <ProjectPriorityIcon priority="none" className="w-3.5 h-3.5" />,
  },
  {
    key: "urgent",
    label: "Urgent",
    renderIcon: () => <ProjectPriorityIcon priority="urgent" className="w-3.5 h-3.5" />,
  },
  {
    key: "high",
    label: "High",
    renderIcon: () => <ProjectPriorityIcon priority="high" className="w-3.5 h-3.5" />,
  },
  {
    key: "medium",
    label: "Medium",
    renderIcon: () => <ProjectPriorityIcon priority="medium" className="w-3.5 h-3.5" />,
  },
  {
    key: "low",
    label: "Low",
    renderIcon: () => <ProjectPriorityIcon priority="low" className="w-3.5 h-3.5" />,
  },
];

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreated,
  defaultTeamId,
}: CreateProjectModalProps) {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatusType>("planned");
  const [priority, setPriority] = useState<ProjectPriorityType>("none");
  const [lead, setLead] = useState<TeamMemberItem | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<TeamMemberItem[]>([]);
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<
    "status" | "priority" | "lead" | "members" | "startDate" | "targetDate" | null
  >(null);

  // Teams state for team selection menu matching screenshot
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [candidateMembers, setCandidateMembers] = useState<TeamMemberItem[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propertiesRowRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Helper for initials
  const getInitials = (str: string) => {
    if (!str) return "U";
    const parts = str.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  // Dynamically load real workspace members from database
  const loadWorkspaceMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    setInviteFeedback(null);
    try {
      const list: TeamMemberItem[] = [];
      const seenEmails = new Set<string>();

      // 1. Current logged-in user is always an available option
      const currentEmail =
        user?.email ||
        (typeof window !== "undefined"
          ? sessionStorage.getItem("recent_auth_email") || ""
          : "");
      const currentName = user?.name || (currentEmail ? currentEmail.split("@")[0] : "You");

      if (currentEmail) {
        list.push({
          name: currentName,
          email: currentEmail,
          initials: getInitials(currentName),
        });
        seenEmails.add(currentEmail.toLowerCase().trim());
      }

      // 2. Fetch current workspace data to get real accepted members
      if (currentWorkspace?._id) {
        try {
          const wsRes = await api.get(`/workspaces/${currentWorkspace._id}`);
          const ws = wsRes?.data || wsRes;

          // Workspace Owner (if different from current user)
          if (ws?.ownerId && typeof ws.ownerId === "object") {
            const ownerEmail = ws.ownerId.email || "";
            if (ownerEmail && !seenEmails.has(ownerEmail.toLowerCase().trim())) {
              const ownerName = ws.ownerId.name || ownerEmail.split("@")[0];
              list.push({
                name: ownerName,
                email: ownerEmail,
                initials: getInitials(ownerName),
              });
              seenEmails.add(ownerEmail.toLowerCase().trim());
            }
          }

          // Members who accepted the invite and joined the workspace
          if (Array.isArray(ws?.members)) {
            ws.members.forEach((m: any) => {
              const memberUser = typeof m.userId === "object" ? m.userId : null;
              if (memberUser && memberUser.email) {
                const em = memberUser.email.toLowerCase().trim();
                if (!seenEmails.has(em)) {
                  const mName = memberUser.name || memberUser.email.split("@")[0];
                  list.push({
                    name: mName,
                    email: memberUser.email,
                    initials: getInitials(mName),
                  });
                  seenEmails.add(em);
                }
              }
            });
          }

          // Accepted invitations in this workspace
          if (Array.isArray(ws?.invitations)) {
            ws.invitations.forEach((inv: any) => {
              if (inv?.status === "accepted" && inv.email) {
                const em = inv.email.toLowerCase().trim();
                if (!seenEmails.has(em)) {
                  const invName = inv.email.split("@")[0];
                  list.push({
                    name: invName,
                    email: inv.email,
                    initials: getInitials(invName),
                  });
                  seenEmails.add(em);
                }
              }
            });
          }
        } catch (wsErr) {
          console.warn("Could not fetch detailed workspace members:", wsErr);
        }

        // 3. Also check any teams in this workspace for accepted team members
        try {
          const teamsRes = await api.get(`/teams?workspaceId=${currentWorkspace._id}`);
          const teams = teamsRes?.data || teamsRes || [];
          if (Array.isArray(teams)) {
            for (const t of teams) {
              if (Array.isArray(t.members)) {
                for (const tm of t.members) {
                  const tu = typeof tm.userId === "object" ? tm.userId : null;
                  if (tu && tu.email) {
                    const em = tu.email.toLowerCase().trim();
                    if (!seenEmails.has(em)) {
                      const tName = tu.name || tu.email.split("@")[0];
                      list.push({
                        name: tName,
                        email: tu.email,
                        initials: getInitials(tName),
                      });
                      seenEmails.add(em);
                    }
                  }
                }
              }
            }
          }
        } catch {
          // Non-fatal
        }
      }

      setCandidateMembers(list);
    } catch (err) {
      console.warn("Failed to load workspace members:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [currentWorkspace?._id, user]);

  // Load members whenever modal opens
  useEffect(() => {
    if (isOpen) {
      loadWorkspaceMembers();
    }
  }, [isOpen, loadWorkspaceMembers]);

  // Dynamically fetch teams and default to the first team
  const fetchTeams = useCallback(async () => {
    if (!currentWorkspace?._id) return;
    try {
      const res = await api.get(`/teams?workspaceId=${currentWorkspace._id}`);
      const list = res?.data || res || [];
      if (Array.isArray(list) && list.length > 0) {
        setTeams(list);
        setSelectedTeam((prev) => {
          if (defaultTeamId) {
            const found = list.find((t: any) => t._id === defaultTeamId);
            if (found) return found;
          }
          if (prev && list.some((t: any) => t._id === prev._id)) {
            return prev;
          }
          // By default, select the very first team
          return list[0];
        });
      } else {
        // Fallback default team if none created yet
        const defaultT: TeamItem = {
          _id: defaultTeamId || "default-team",
          name: "designer",
          key: "DES",
          color: "#10b981",
          icon: "Palette",
        };
        setTeams([defaultT]);
        setSelectedTeam((prev) => prev || defaultT);
      }
    } catch (err) {
      console.warn("Failed to fetch teams:", err);
    }
  }, [currentWorkspace?._id, defaultTeamId]);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen, fetchTeams]);

  // When defaultTeamId changes and teams are available, set selected team
  useEffect(() => {
    if (isOpen && defaultTeamId && teams.length > 0) {
      const match = teams.find((t) => t._id === defaultTeamId);
      if (match) setSelectedTeam(match);
    }
  }, [isOpen, defaultTeamId, teams]);

  // Close property dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        propertiesRowRef.current &&
        !propertiesRowRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [activeDropdown]);

  // Close team dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTeamDropdownOpen(false);
      }
    };
    if (isTeamDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isTeamDropdownOpen]);

  // Keyboard shortcut listener for "P then T" to open team picker
  useEffect(() => {
    let pPressed = false;
    let timer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "p" || e.key === "P") {
        pPressed = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
          pPressed = false;
        }, 1200);
      } else if ((e.key === "t" || e.key === "T") && pPressed) {
        e.preventDefault();
        pPressed = false;
        setIsTeamDropdownOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Reset form when opened or closed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameInputRef.current?.focus(), 80);
    } else {
      setName("");
      setDescription("");
      setStatus("planned");
      setPriority("none");
      setLead(null);
      setSelectedMembers([]);
      setStartDate("");
      setTargetDate("");
      setActiveDropdown(null);
      setIsTeamDropdownOpen(false);
      setTeamSearchQuery("");
      setError(null);
      setInviteFeedback(null);
      setNewMemberEmail("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Workspace team prefix
  const teamPrefix = currentWorkspace?.slug
    ? currentWorkspace.slug.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase()
    : currentWorkspace?.name
    ? currentWorkspace.name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase()
    : "DES";

  // Current logged in user info
  const userEmail =
    user?.email ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("recent_auth_email") || ""
      : "");
  const userNameHandle = userEmail
    ? userEmail.split("@")[0]
    : user?.name || "Member";

  const currentUserItem: TeamMemberItem = {
    name: userNameHandle,
    email: userEmail,
    initials: getInitials(userNameHandle),
  };

  const formatDisplayDate = (d: string) => {
    if (!d) return "";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const assignedLead = lead || currentUserItem;
      const res = await api.post("/projects", {
        name: name.trim(),
        description: description.trim() || undefined,
        status: status === "canceled" ? "archived" : "active",
        projectStatus: status,
        priority: priority,
        lead: assignedLead,
        teamId: selectedTeam?._id,
        teamName: selectedTeam?.name,
        startDate: startDate || undefined,
        dueDate: targetDate || undefined,
      });

      const created = (res && typeof res === "object" && "data" in res) ? (res as any).data : res;
      const projId = created?._id || created?.id;
      if (projId && typeof window !== "undefined") {
        try {
          localStorage.setItem(
            `taskflow_proj_meta_${projId}`,
            JSON.stringify({
              teamId: selectedTeam?._id,
              teamName: selectedTeam?.name,
              teamKey: (selectedTeam?.key || selectedTeam?.name?.replace(/[^a-zA-Z]/g, "").slice(0, 3) || "DES").toUpperCase(),
              projectStatus: status,
              priority: priority,
              lead: assignedLead,
              startDate: startDate || undefined,
              dueDate: targetDate || undefined,
            })
          );
        } catch {}
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("project-created"));
      }
      onCreated?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const currentPriorityConfig =
    PRIORITY_OPTIONS.find((p) => p.key === priority) || PRIORITY_OPTIONS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Container in Linear Dark Blue Theme - Expanded Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl overflow-visible rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-[0_24px_60px_rgba(0,0,0,0.65)] text-[#e6e7ee] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 pt-3.5 pb-2 border-b border-[#24263a]/60 select-none">
            {/* Team Dropdown & Breadcrumb matching screenshot */}
            <div className="flex items-center gap-2 relative" ref={teamDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsTeamDropdownOpen((prev) => !prev);
                  setTeamSearchQuery("");
                }}
                className="h-7 px-2.5 rounded-[6px] bg-[#1f2133] hover:bg-[#25283c] border border-[#2e3149] flex items-center gap-1.5 text-[12.5px] font-semibold text-white transition-colors cursor-pointer select-none"
              >
                <TeamAvatar team={selectedTeam} />
                <span>{selectedTeam?.name || "designer"}</span>
              </button>

              <span className="text-[#55596e] text-[13px] font-normal leading-none select-none">
                ›
              </span>

              <span className="text-[12.5px] text-[#8a8f98] font-normal select-none">
                New project
              </span>

              {/* Dropdown Menu matching user's screenshot */}
              {isTeamDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-[280px] rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-2 z-50 text-[#e6e7ee]">
                  {/* Search Bar with "P then T" badge */}
                  <div className="flex items-center justify-between px-2 py-1 mb-1.5">
                    <input
                      type="text"
                      value={teamSearchQuery}
                      onChange={(e) => setTeamSearchQuery(e.target.value)}
                      placeholder="Change teams..."
                      autoFocus
                      className="bg-transparent text-[13px] text-white placeholder-[#707383] outline-none flex-1 pr-2"
                    />
                    <div className="shrink-0 flex items-center gap-1 text-[10px] text-[#8a8f98] bg-[#222436] px-1.5 py-0.5 rounded border border-[#2f3247]">
                      <span className="font-mono">P</span>
                      <span className="text-[9px] text-[#63677b]">then</span>
                      <span className="font-mono">T</span>
                    </div>
                  </div>

                  {/* Active Selected Team Card */}
                  {selectedTeam &&
                    (!teamSearchQuery ||
                      selectedTeam.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                      (selectedTeam.key && selectedTeam.key.toLowerCase().includes(teamSearchQuery.toLowerCase()))) && (
                      <div className="bg-[#242638] rounded-lg px-2.5 py-2 flex items-center justify-between mb-1 select-none">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-4 h-4 rounded-[4px] bg-[#5e6ad2] flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white stroke-[2.5]" />
                          </div>
                          <TeamAvatar team={selectedTeam} />
                          <span className="text-[13px] font-semibold text-white truncate">
                            {selectedTeam.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#65697e] font-mono tracking-wider ml-2 shrink-0">
                          {(
                            selectedTeam.key ||
                            selectedTeam.name.replace(/[^a-zA-Z]/g, "").slice(0, 3)
                          ).toUpperCase()}
                        </span>
                      </div>
                    )}

                  {/* Section: Your teams */}
                  <div className="text-[11.5px] font-semibold text-[#65697e] px-2.5 pt-2 pb-1.5 select-none">
                    Your teams
                  </div>

                  {/* Other Teams List */}
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {teams.filter((t) => {
                      if (selectedTeam && t._id === selectedTeam._id) return false;
                      if (!teamSearchQuery.trim()) return true;
                      const q = teamSearchQuery.toLowerCase();
                      const tKey = (t.key || t.name.replace(/[^a-zA-Z]/g, "").slice(0, 3)).toLowerCase();
                      return t.name.toLowerCase().includes(q) || tKey.includes(q);
                    }).length === 0 ? (
                      <div className="px-3 py-2 text-xs text-[#707383] italic">
                        {teams.length <= 1 ? "No other teams" : "No matching teams"}
                      </div>
                    ) : (
                      teams
                        .filter((t) => {
                          if (selectedTeam && t._id === selectedTeam._id) return false;
                          if (!teamSearchQuery.trim()) return true;
                          const q = teamSearchQuery.toLowerCase();
                          const tKey = (t.key || t.name.replace(/[^a-zA-Z]/g, "").slice(0, 3)).toLowerCase();
                          return t.name.toLowerCase().includes(q) || tKey.includes(q);
                        })
                        .map((team) => {
                          const teamKey = (
                            team.key || team.name.replace(/[^a-zA-Z]/g, "").slice(0, 3)
                          ).toUpperCase();
                          return (
                            <button
                              key={team._id}
                              type="button"
                              onClick={() => {
                                setSelectedTeam(team);
                                setIsTeamDropdownOpen(false);
                                setTeamSearchQuery("");
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#202232] cursor-pointer transition-colors text-left group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {/* Spacer to align icon with the checkbox of selected team */}
                                <div className="w-4 shrink-0" />
                                <TeamAvatar team={team} />
                                <span className="text-[13px] text-[#c5c8d6] group-hover:text-white transition-colors truncate">
                                  {team.name}
                                </span>
                              </div>
                              <span className="text-[11px] font-medium text-[#65697e] font-mono tracking-wider ml-2 shrink-0">
                                {teamKey}
                              </span>
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {error && (
              <div className="mx-6 mt-3 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Title Row */}
            <div className="px-6 pt-4 pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-6 text-[#4e5264] flex items-center justify-center shrink-0 cursor-grab select-none">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="3.5" r="1.2" />
                    <circle cx="11" cy="3.5" r="1.2" />
                    <circle cx="5" cy="8" r="1.2" />
                    <circle cx="11" cy="8" r="1.2" />
                    <circle cx="5" cy="12.5" r="1.2" />
                    <circle cx="11" cy="12.5" r="1.2" />
                  </svg>
                </div>

                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project name"
                  className="w-full bg-transparent border-none outline-none text-[20px] sm:text-[22px] font-semibold text-white placeholder:text-[#4e5264] tracking-[-0.01em]"
                />
              </div>
            </div>

            {/* ============================================================== */}
            {/* PROPERTIES ROW: ALL OPTIONS IN A SINGLE CLEAN HORIZONTAL LINE  */}
            {/* ============================================================== */}
            <div
              ref={propertiesRowRef}
              className="px-6 py-2 flex items-center gap-2 select-none flex-nowrap relative z-30 text-xs overflow-visible"
            >
              {/* 1. Status Pill */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "status" ? null : "status")
                  }
                  className="h-7 px-2.5 rounded-md border border-[#2a2c3f] bg-[#1c1d2b] hover:bg-[#232537] text-[12px] text-[#c5c8d6] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ProjectStatusIcon status={status} className="w-3.5 h-3.5 shrink-0" />
                  <span>{STATUS_CONFIG[status].label}</span>
                </button>

                {/* Status Dropdown Menu */}
                {activeDropdown === "status" && (
                  <div className="absolute left-0 top-8 z-50 w-44 rounded-lg border border-[#2a2c3f] bg-[#161724] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    {(Object.keys(STATUS_CONFIG) as ProjectStatusType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setStatus(key);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
                          status === key
                            ? "bg-[#282b3e] text-white"
                            : "text-[#c5c8d6] hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ProjectStatusIcon status={key} className="w-3.5 h-3.5 shrink-0" />
                          <span>{STATUS_CONFIG[key].label}</span>
                        </div>
                        {status === key && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Priority Pill (Matching image) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "priority" ? null : "priority")
                  }
                  className="h-7 px-2.5 rounded-md border border-[#2a2c3f] bg-[#1c1d2b] hover:bg-[#232537] text-[12px] text-[#c5c8d6] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {currentPriorityConfig.renderIcon()}
                  <span>{currentPriorityConfig.label}</span>
                </button>

                {/* Priority Dropdown Menu matching uploaded image */}
                {activeDropdown === "priority" && (
                  <div className="absolute left-0 top-8 z-50 w-44 rounded-lg border border-[#2a2c3f] bg-[#161724] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    {PRIORITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setPriority(opt.key);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
                          priority === opt.key
                            ? "bg-[#282b3e] text-white"
                            : "text-[#c5c8d6] hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {opt.renderIcon()}
                          <span>{opt.label}</span>
                        </div>
                        {priority === opt.key && (
                          <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Lead Pill (Selectable from team) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "lead" ? null : "lead")
                  }
                  className={`h-7 px-2.5 rounded-md border text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                    lead
                      ? "bg-[#25283b] text-white border-[#3a3f5d]"
                      : "bg-[#1c1d2b] hover:bg-[#232537] border-[#2a2c3f] text-[#c5c8d6] hover:text-white"
                  }`}
                >
                  {lead ? (
                    <div className="w-4 h-4 rounded-full bg-[#7c3aed] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                      {lead.initials}
                    </div>
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#8a8f98]" />
                  )}
                  <span>{lead ? lead.name : "Lead"}</span>
                </button>

                {/* Lead Selector Dropdown */}
                {activeDropdown === "lead" && (
                  <div className="absolute left-0 top-8 z-50 w-60 rounded-lg border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    <p className="px-2 py-1 text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                      Assign Project Lead
                    </p>

                    {isLoadingMembers ? (
                      <div className="flex items-center gap-2 px-2 py-3 text-xs text-[#8a8f98]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5e6ad2]" />
                        <span>Loading members...</span>
                      </div>
                    ) : candidateMembers.length === 0 ? (
                      <p className="px-2 py-2 text-xs text-[#8a8f98]">No members found</p>
                    ) : (
                      <div className="max-h-44 overflow-y-auto space-y-0.5">
                        {candidateMembers.map((m) => (
                          <button
                            key={m.email}
                            type="button"
                            onClick={() => {
                              setLead(m);
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/[0.06] text-white transition-colors cursor-pointer text-left"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#7c3aed] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                              {m.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate font-medium">{m.name}</p>
                              <p className="text-[10px] text-[#707383] truncate">{m.email}</p>
                            </div>
                            {lead?.email === m.email && (
                              <Check className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {candidateMembers.length <= 1 && !isLoadingMembers && (
                      <div className="px-2 py-1.5 mt-1 border-t border-[#24263a]/60 text-[10.5px] text-[#626674] leading-tight">
                        Invited teammates will appear here once they accept the invitation.
                      </div>
                    )}

                    <div className="border-t border-[#24263a]/60 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setLead(null);
                        setActiveDropdown(null);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.06] text-[#8a8f98] hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>No lead</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Members Pill (Add from team) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "members" ? null : "members")
                  }
                  className={`h-7 px-2.5 rounded-md border text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedMembers.length > 0
                      ? "bg-[#25283b] text-white border-[#3a3f5d]"
                      : "bg-[#1c1d2b] hover:bg-[#232537] border-[#2a2c3f] text-[#c5c8d6] hover:text-white"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#8a8f98]" />
                  <span>
                    {selectedMembers.length > 0
                      ? `${selectedMembers.length} Member${
                          selectedMembers.length > 1 ? "s" : ""
                        }`
                      : "Members"}
                  </span>
                </button>

                {/* Members Dropdown Menu with Add From Team */}
                {activeDropdown === "members" && (
                  <div className="absolute left-0 top-8 z-50 w-72 rounded-lg border border-[#2a2c3f] bg-[#161724] p-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    <p className="px-1 py-1 text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                      Workspace Members
                    </p>

                    {/* Team Members List */}
                    {isLoadingMembers ? (
                      <div className="flex items-center gap-2 px-1 py-3 text-xs text-[#8a8f98]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5e6ad2]" />
                        <span>Loading accepted members...</span>
                      </div>
                    ) : (
                      <div className="max-h-40 overflow-y-auto space-y-1 mb-2 pr-0.5">
                        {candidateMembers.map((c) => {
                          const isSelected = selectedMembers.some(
                            (m) => m.email.toLowerCase() === c.email.toLowerCase()
                          );
                          return (
                            <button
                              key={c.email}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedMembers(
                                    selectedMembers.filter(
                                      (m) => m.email.toLowerCase() !== c.email.toLowerCase()
                                    )
                                  );
                                } else {
                                  setSelectedMembers([...selectedMembers, c]);
                                }
                              }}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#282b3e] text-white"
                                  : "hover:bg-white/[0.05] text-[#c5c8d6]"
                              }`}
                            >
                              <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                                {c.initials}
                              </div>
                              <div className="flex-1 truncate">
                                <p className="text-xs font-medium truncate">{c.name}</p>
                                <p className="text-[10px] text-[#707383] truncate">{c.email}</p>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {candidateMembers.length <= 1 && !isLoadingMembers && (
                      <div className="px-1 py-1 text-[11px] text-[#707383] mb-2 leading-tight">
                        Teammates who accept your workspace invitation will automatically appear in this list.
                      </div>
                    )}

                    {/* Invite by Email */}
                    <div className="pt-2 border-t border-[#24263a]/60">
                      <p className="text-[10px] text-[#8a8f98] mb-1 px-1">
                        Invite teammate by email:
                      </p>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="email"
                          placeholder="colleague@company.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (!newMemberEmail.trim()) return;
                              const emailToInvite = newMemberEmail.trim().toLowerCase();
                              setIsSendingInvite(true);
                              setInviteFeedback(null);
                              try {
                                let link = "";
                                if (currentWorkspace?._id) {
                                  const res: any = await api.post("/workspaces/invite", {
                                    emails: [emailToInvite],
                                    workspaceId: currentWorkspace._id,
                                    teamName: currentWorkspace.name,
                                  });
                                  link = res?.data?.inviteLink || res?.inviteLink || res?.data?.details?.[0]?.inviteLink || "";
                                }

                                const name = emailToInvite.split("@")[0];
                                const initials = getInitials(name);
                                const newItem: TeamMemberItem = { name, email: emailToInvite, initials };

                                if (!selectedMembers.some((m) => m.email.toLowerCase() === emailToInvite)) {
                                  setSelectedMembers([...selectedMembers, newItem]);
                                }
                                if (!candidateMembers.some((m) => m.email.toLowerCase() === emailToInvite)) {
                                  setCandidateMembers([...candidateMembers, newItem]);
                                }

                                setNewMemberEmail("");
                                if (link) {
                                  setLastInviteLink(link);
                                }
                                setInviteFeedback(`Invitation sent to ${emailToInvite}!`);
                              } catch (err: any) {
                                setInviteFeedback(err?.message || "Failed to send invitation");
                              } finally {
                                setIsSendingInvite(false);
                              }
                            }
                          }}
                          className="flex-1 h-7 px-2 rounded bg-[#10111a] border border-[#2a2c3f] text-xs text-white outline-none focus:border-[#5e6ad2]"
                        />
                        <button
                          type="button"
                          disabled={isSendingInvite || !newMemberEmail.trim()}
                          onClick={async () => {
                            if (!newMemberEmail.trim()) return;
                            const emailToInvite = newMemberEmail.trim().toLowerCase();
                            setIsSendingInvite(true);
                            setInviteFeedback(null);
                            try {
                              let link = "";
                              if (currentWorkspace?._id) {
                                const res: any = await api.post("/workspaces/invite", {
                                  emails: [emailToInvite],
                                  workspaceId: currentWorkspace._id,
                                  teamName: currentWorkspace.name,
                                });
                                link = res?.data?.inviteLink || res?.inviteLink || res?.data?.details?.[0]?.inviteLink || "";
                              }

                              const name = emailToInvite.split("@")[0];
                              const initials = getInitials(name);
                              const newItem: TeamMemberItem = { name, email: emailToInvite, initials };

                              if (!selectedMembers.some((m) => m.email.toLowerCase() === emailToInvite)) {
                                setSelectedMembers([...selectedMembers, newItem]);
                              }
                              if (!candidateMembers.some((m) => m.email.toLowerCase() === emailToInvite)) {
                                setCandidateMembers([...candidateMembers, newItem]);
                              }

                              setNewMemberEmail("");
                              if (link) {
                                setLastInviteLink(link);
                              }
                              setInviteFeedback(`Invitation sent to ${emailToInvite}!`);
                            } catch (err: any) {
                              setInviteFeedback(err?.message || "Failed to send invitation");
                            } finally {
                              setIsSendingInvite(false);
                            }
                          }}
                          className="h-7 px-2.5 rounded bg-[#5e6ad2] text-xs font-medium text-white hover:bg-[#6875e5] cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {isSendingInvite ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span>Invite</span>
                          )}
                        </button>
                      </div>

                      {inviteFeedback && (
                        <p className="text-[10.5px] text-[#10b981] mt-1 px-1 font-medium">
                          {inviteFeedback}
                        </p>
                      )}

                      {lastInviteLink && (
                        <div className="mt-2 p-2 rounded-md bg-[#11121d] border border-[#2a2c42] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#8a8f98] font-medium">
                              Direct Invitation Link:
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(lastInviteLink);
                                setHasCopiedLink(true);
                                setTimeout(() => setHasCopiedLink(false), 2000);
                              }}
                              className="px-2 py-0.5 rounded bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[10px] font-medium cursor-pointer transition"
                            >
                              {hasCopiedLink ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                          <p className="text-[9.5px] text-[#707388] truncate select-all font-mono">
                            {lastInviteLink}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Start Date Pill (Functional Date Picker Popover) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "startDate" ? null : "startDate"
                    )
                  }
                  className={`h-7 px-2.5 rounded-md border text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                    startDate
                      ? "bg-[#25283b] text-white border-[#3a3f5d]"
                      : "bg-[#1c1d2b] hover:bg-[#232537] border-[#2a2c3f] text-[#c5c8d6] hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                  <span>
                    {startDate ? `Starts: ${formatDisplayDate(startDate)}` : "Start date"}
                  </span>
                </button>

                {activeDropdown === "startDate" && (
                  <div className="absolute left-0 top-8 z-50 w-64 rounded-lg border border-[#2a2c3f] bg-[#161724] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#8a8f98]">
                        Set start date
                      </span>
                      {startDate && (
                        <button
                          type="button"
                          onClick={() => {
                            setStartDate("");
                            setActiveDropdown(null);
                          }}
                          className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full h-8 px-2.5 rounded bg-[#10111a] border border-[#2a2c3f] text-white text-xs outline-none focus:border-[#5e6ad2]"
                    />
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#24263a]/60">
                      <button
                        type="button"
                        onClick={() => {
                          setStartDate(new Date().toISOString().split("T")[0]);
                          setActiveDropdown(null);
                        }}
                        className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-[#c5c8d6] cursor-pointer"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          setStartDate(d.toISOString().split("T")[0]);
                          setActiveDropdown(null);
                        }}
                        className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-[#c5c8d6] cursor-pointer"
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Target Date Pill (Functional Date Picker Popover) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "targetDate" ? null : "targetDate"
                    )
                  }
                  className={`h-7 px-2.5 rounded-md border text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                    targetDate
                      ? "bg-[#25283b] text-white border-[#3a3f5d]"
                      : "bg-[#1c1d2b] hover:bg-[#232537] border-[#2a2c3f] text-[#c5c8d6] hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                  <span>
                    {targetDate ? `Due: ${formatDisplayDate(targetDate)}` : "Target date"}
                  </span>
                </button>

                {activeDropdown === "targetDate" && (
                  <div className="absolute left-0 top-8 z-50 w-64 rounded-lg border border-[#2a2c3f] bg-[#161724] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#8a8f98]">
                        Set target date
                      </span>
                      {targetDate && (
                        <button
                          type="button"
                          onClick={() => {
                            setTargetDate("");
                            setActiveDropdown(null);
                          }}
                          className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => {
                        setTargetDate(e.target.value);
                        setActiveDropdown(null);
                      }}
                      className="w-full h-8 px-2.5 rounded bg-[#10111a] border border-[#2a2c3f] text-white text-xs outline-none focus:border-[#5e6ad2]"
                    />
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#24263a]/60">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setTargetDate(d.toISOString().split("T")[0]);
                          setActiveDropdown(null);
                        }}
                        className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-[#c5c8d6] cursor-pointer"
                      >
                        In 1 week
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 1);
                          setTargetDate(d.toISOString().split("T")[0]);
                          setActiveDropdown(null);
                        }}
                        className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-[#c5c8d6] cursor-pointer"
                      >
                        In 1 month
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================== */}
            {/* SUBTLE HORIZONTAL DIVIDER LINE                                 */}
            {/* ============================================================== */}
            <div className="border-t border-[#24263a]/60 mx-6 my-1" />

            {/* ============================================================== */}
            {/* DESCRIPTION TEXTAREA BELOW THE LINE                            */}
            {/* ============================================================== */}
            <div className="px-6 py-3 flex-1 flex flex-col relative z-0">
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description, notes, or project specifications..."
                className="w-full bg-transparent border-none outline-none resize-none text-[13px] text-[#c5c8d6] placeholder:text-[#4e5264] leading-relaxed flex-1 min-h-[140px]"
              />
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-3 border-t border-[#24263a] flex items-center justify-end gap-2.5 bg-[#141522]/40 rounded-b-xl select-none">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3.5 rounded-md border border-[#2f334a] bg-transparent hover:bg-white/[0.05] text-[12px] font-medium text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isCreating || !name.trim()}
                className="h-8 px-4 rounded-md bg-[#5e6ad2] hover:bg-[#525dc1] active:bg-[#4b54ad] text-white text-[12px] font-medium shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create project</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
