"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  Paperclip,
  Check,
  ChevronDown,
  User,
  Tag,
  Calendar,
  Loader2,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useUI } from "@/context/UIContext";
import { TaskStatus, TaskPriority } from "@/types/task";
import { Project } from "@/types/project";

interface TeamItem {
  _id: string;
  name: string;
  key?: string;
  color?: string;
  icon?: string;
  workspaceId?: any;
  members?: any[];
}

interface TeamMemberItem {
  id?: string;
  name: string;
  email: string;
  initials: string;
  role?: string;
  avatar?: string;
}

interface CreateIssueModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultProjectId?: string;
  defaultTeamId?: string;
  defaultStatus?: string;
  onCreated?: () => void;
}

// 3D Isometric Cube Icon matching Linear Screenshot
function ProjectCubeIcon({
  className = "w-3.5 h-3.5",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
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

// Dashed Circle Icon for "No project" matching Screenshot 2
function NoProjectIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2.2 2"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
    </svg>
  );
}

// Status Icons
function BacklogIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2.2 2"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
    </svg>
  );
}

function TodoIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
    </svg>
  );
}

function InProgressIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="#eab308"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 2A6 6 0 0 1 8 14Z" fill="#eab308" />
    </svg>
  );
}

function DoneIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="#5e6ad2"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" fill="#5e6ad2" fillOpacity="0.2" />
      <path d="M5 8L7 10L11 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CanceledIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="#707383"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M4 12L12 4" strokeLinecap="round" />
    </svg>
  );
}

// Priority Icons
function NoPriorityBarsIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <rect x="2" y="7.2" width="3" height="1.6" rx="0.8" opacity="0.6" />
      <rect x="6.5" y="7.2" width="3" height="1.6" rx="0.8" opacity="0.6" />
      <rect x="11" y="7.2" width="3" height="1.6" rx="0.8" opacity="0.6" />
    </svg>
  );
}

// Team Avatar Badge
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

  if (team.icon === "Smile" || name.includes("web") || name.includes("dev")) {
    return (
      <div
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
        title={team.name}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-2.5 h-2.5"
        >
          <circle cx="8" cy="8" r="6" />
          <path
            d="M5.5 9.5C6.2 10.5 7.1 11 8 11C8.9 11 9.8 10.5 10.5 9.5"
            strokeLinecap="round"
          />
          <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (team.icon === "Terminal" || name.includes("tech") || name.includes("code")) {
    return (
      <div
        className={`${className} rounded-full flex items-center justify-center shrink-0 text-white shadow-sm`}
        style={{ backgroundColor: color }}
        title={team.name}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-2.5 h-2.5"
        >
          <path d="M4 6L6.5 8L4 10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10H12" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

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

// Project Color Helper
function getProjectColor(project: Project | null | undefined, index = 0): string {
  if (!project) return "#8a8f98";
  const name = (project.name || "").toLowerCase();
  if (name.includes("1") || name.includes("design")) return "#f87171"; // Red/Coral matching screenshot
  if (name.includes("2") || name.includes("web") || name.includes("dev")) return "#eab308"; // Yellow/Amber matching screenshot
  const palette = ["#f87171", "#eab308", "#38bdf8", "#34d399", "#c084fc", "#fb923c"];
  return palette[index % palette.length];
}

const STATUS_OPTIONS = [
  { key: "backlog", label: "Backlog", Icon: BacklogIcon, shortcut: "1" },
  { key: "todo", label: "Todo", Icon: TodoIcon, shortcut: "2" },
  { key: "in-progress", label: "In Progress", Icon: InProgressIcon, shortcut: "3" },
  { key: "completed", label: "Done", Icon: DoneIcon, shortcut: "4" },
  { key: "canceled", label: "Canceled", Icon: CanceledIcon, shortcut: "5" },
];

const PRIORITY_OPTIONS = [
  {
    key: "none",
    label: "No priority",
    renderIcon: () => <NoPriorityBarsIcon className="w-3.5 h-3.5 text-[#707383]" />,
  },
  {
    key: "urgent",
    label: "Urgent",
    renderIcon: () => (
      <div className="w-3.5 h-3.5 rounded-[3px] bg-[#f87171]/20 border border-[#f87171]/40 flex items-center justify-center">
        <span className="text-[#f87171] font-bold text-[10px] leading-none">!</span>
      </div>
    ),
  },
  {
    key: "high",
    label: "High",
    renderIcon: () => (
      <div className="flex items-end gap-0.5 w-3.5 h-3.5">
        <span className="w-1 h-1.5 rounded-xs bg-[#f97316]" />
        <span className="w-1 h-2.5 rounded-xs bg-[#f97316]" />
        <span className="w-1 h-3.5 rounded-xs bg-[#f97316]" />
      </div>
    ),
  },
  {
    key: "medium",
    label: "Medium",
    renderIcon: () => (
      <div className="flex items-end gap-0.5 w-3.5 h-3.5">
        <span className="w-1 h-1.5 rounded-xs bg-[#eab308]" />
        <span className="w-1 h-2.5 rounded-xs bg-[#eab308]" />
        <span className="w-1 h-3.5 rounded-xs bg-white/10" />
      </div>
    ),
  },
  {
    key: "low",
    label: "Low",
    renderIcon: () => (
      <div className="flex items-end gap-0.5 w-3.5 h-3.5">
        <span className="w-1 h-1.5 rounded-xs bg-[#94a3b8]" />
        <span className="w-1 h-2.5 rounded-xs bg-white/10" />
        <span className="w-1 h-3.5 rounded-xs bg-white/10" />
      </div>
    ),
  },
];

const LABEL_OPTIONS = [
  { key: "bug", label: "Bug", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  { key: "feature", label: "Feature", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { key: "improvement", label: "Improvement", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { key: "design", label: "Design", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
];

export function CreateIssueModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultProjectId,
  defaultTeamId,
  defaultStatus,
  onCreated,
}: CreateIssueModalProps) {
  const { createModalOpen, setCreateModalOpen } = useUI();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const isModalOpen = propIsOpen !== undefined ? propIsOpen : createModalOpen;
  const handleCloseModal = () => {
    if (propOnClose) propOnClose();
    setCreateModalOpen(false);
  };

  // Modal Expand toggle state
  const [isExpanded, setIsExpanded] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>(defaultStatus || "todo");
  const [priority, setPriority] = useState<string>("none"); // Default: No priority (--- Priority)
  const [selectedAssignee, setSelectedAssignee] = useState<TeamMemberItem | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>("");
  const [createMore, setCreateMore] = useState(false); // "Create more" toggle in Screenshot 1

  // Teams & Team Switcher State
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  // Assignee Dropdown State
  const [candidateMembers, setCandidateMembers] = useState<TeamMemberItem[]>([]);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

  // Other dropdowns & refs
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  const [isLabelsDropdownOpen, setIsLabelsDropdownOpen] = useState(false);

  // Submission & feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const prevIsOpenRef = useRef(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Helper for initials
  const getInitials = (str: string) => {
    if (!str) return "U";
    const parts = str.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  // Helper for team key (e.g. "DES")
  const getTeamKey = (t?: TeamItem | null): string => {
    if (!t) return "DES";
    if (t.key && t.key.trim()) return t.key.trim().toUpperCase();
    return (t.name || "DES").slice(0, 3).toUpperCase();
  };

  /*
   * Helper to resolve the Team associated with a given Project.
   * In Linear: Every project belongs to a team. If an issue is assigned to a project,
   * it must belong to that project's team.
   */
  const getProjectTeam = useCallback(
    (proj: Project | null, availableTeams: TeamItem[]): TeamItem | null => {
      if (!proj || !availableTeams || availableTeams.length === 0) return null;

      let localMeta: any = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`taskflow_proj_meta_${proj._id}`);
          if (raw) localMeta = JSON.parse(raw);
        } catch {}
      }

      const pTeamId = typeof proj.teamId === "object" ? proj.teamId?._id : (proj.teamId || localMeta?.teamId);
      const pTeamName = (proj.teamName || localMeta?.teamName || "").toLowerCase().trim();

      // 1. Direct ID match
      if (pTeamId && pTeamId !== "default-team") {
        const match = availableTeams.find(
          (t) => t._id === pTeamId || t._id?.toString() === pTeamId?.toString()
        );
        if (match) return match;
      }

      // 2. Name match
      if (pTeamName) {
        const match = availableTeams.find(
          (t) => t.name.toLowerCase().trim() === pTeamName
        );
        if (match) return match;
      }

      // 3. Fallback for demo legacy projects
      if (pTeamId === "default-team" || !pTeamId) {
        const designTeam = availableTeams.find((t) => t.name.toLowerCase().includes("design"));
        if (designTeam && proj.name?.toLowerCase().includes("1")) return designTeam;
        const devTeam = availableTeams.find(
          (t) => t.name.toLowerCase().includes("web") || t.name.toLowerCase().includes("dev")
        );
        if (devTeam && proj.name?.toLowerCase().includes("2")) return devTeam;
      }

      return null;
    },
    []
  );

  /*
   * Initialize modal state ONLY when modal transitions from closed to open.
   * This strictly prevents user manual selections (status, project, priority, title)
   * from ever being reset by re-renders or background fetches.
   */
  useEffect(() => {
    if (isModalOpen && !prevIsOpenRef.current) {
      prevIsOpenRef.current = true;
      setStatus(defaultStatus || "todo");
      setPriority("none");
      setTitle("");
      setDescription("");
      setError(null);
      setSelectedAssignee(null);
      setSelectedLabels([]);
      setDueDate("");

      // Pre-select project if opened inside a project view
      if (defaultProjectId && projects.length > 0) {
        const match = projects.find((p) => p._id === defaultProjectId);
        if (match) {
          setSelectedProject(match);
          const pTeam = getProjectTeam(match, teams);
          if (pTeam) setSelectedTeam(pTeam);
        }
      } else if (!defaultProjectId) {
        setSelectedProject(null);
      }

      // Pre-select team if opened inside a team view
      if (defaultTeamId && teams.length > 0) {
        const matchTeam = teams.find(
          (t) =>
            t._id === defaultTeamId ||
            t.key?.toUpperCase() === defaultTeamId.toUpperCase() ||
            t.name?.toLowerCase() === defaultTeamId.toLowerCase()
        );
        if (matchTeam) setSelectedTeam(matchTeam);
      }
    } else if (!isModalOpen) {
      prevIsOpenRef.current = false;
    }
  }, [isModalOpen, defaultStatus, defaultProjectId, defaultTeamId, projects, teams, getProjectTeam]);

  /*
   * Fetch initial modal options (teams and projects in parallel) when modal opens.
   * Runs only once per open and avoids cyclic dependency loops.
   */
  useEffect(() => {
    if (!isModalOpen) return;

    let isMounted = true;

    async function loadModalData() {
      try {
        const wsParam = currentWorkspace?._id ? `?workspaceId=${currentWorkspace._id}` : "";
        const [teamsRes, projRes] = await Promise.all([
          api.get(`/teams${wsParam}`).catch(() => []),
          api.get("/projects").catch(() => []),
        ]);

        if (!isMounted) return;

        const teamList: TeamItem[] = teamsRes?.data || teamsRes || [];
        const projList: Project[] = projRes?.data || projRes || [];

        if (Array.isArray(teamList) && teamList.length > 0) {
          setTeams(teamList);
          setSelectedTeam((currentSelected) => {
            if (currentSelected) return currentSelected;
            if (defaultTeamId) {
              const match = teamList.find(
                (t) =>
                  t._id === defaultTeamId ||
                  t.key?.toUpperCase() === defaultTeamId.toUpperCase() ||
                  t.name?.toLowerCase() === defaultTeamId.toLowerCase()
              );
              if (match) return match;
            }
            if (defaultProjectId && projList.length > 0) {
              const matchProj = projList.find((p) => p._id === defaultProjectId);
              const pTeam = getProjectTeam(matchProj || null, teamList);
              if (pTeam) return pTeam;
            }
            return teamList[0];
          });
        }

        if (Array.isArray(projList)) {
          setProjects(projList);
          if (defaultProjectId) {
            const match = projList.find((p) => p._id === defaultProjectId);
            if (match) {
              setSelectedProject((curr) => curr || match);
              setSelectedTeam((curr) => curr || getProjectTeam(match, teamList));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load modal data:", err);
      }
    }

    loadModalData();
    setTimeout(() => titleInputRef.current?.focus(), 80);

    return () => {
      isMounted = false;
    };
  }, [isModalOpen, currentWorkspace?._id, defaultTeamId, defaultProjectId, getProjectTeam]);

  /*
   * Fetch candidate members for the assignee dropdown.
   * Runs in parallel and updates candidates.
   */
  const activeTeamId = selectedTeam?._id || defaultTeamId;
  useEffect(() => {
    if (!isModalOpen) return;

    let isMounted = true;

    async function loadMembers() {
      const list: TeamMemberItem[] = [];
      const seenEmails = new Set<string>();

      const addMember = (
        id: string | undefined,
        name: string | undefined,
        email: string | undefined,
        role?: string
      ) => {
        const cleanEmail = (email || "").toLowerCase().trim();
        const cleanName = (name || "").trim();
        if (!cleanEmail && !cleanName) return;

        const key = cleanEmail || cleanName.toLowerCase();
        if (seenEmails.has(key)) return;
        seenEmails.add(key);

        const displayName = cleanName || (cleanEmail ? cleanEmail.split("@")[0] : "Team Member");
        list.push({
          id: id || undefined,
          name: displayName,
          email: email || "",
          initials: getInitials(displayName),
          role,
        });
      };

      // 1. Members already embedded in selectedTeam object
      if (selectedTeam && Array.isArray((selectedTeam as any).members)) {
        (selectedTeam as any).members.forEach((m: any) => {
          const u = typeof m.userId === "object" ? m.userId : null;
          if (u) addMember(u._id || u.id, u.name, u.email, m.role);
        });
      }

      // 2. Fetch fresh team & workspace members in parallel
      const promises: Promise<any>[] = [];
      if (activeTeamId) {
        promises.push(api.get(`/teams/${activeTeamId}`).catch(() => null));
      }
      if (currentWorkspace?._id) {
        promises.push(api.get(`/workspaces/${currentWorkspace._id}`).catch(() => null));
      }

      try {
        const [teamRes, wsRes] = await Promise.all(promises);
        if (!isMounted) return;

        const teamData = teamRes?.data || teamRes?.team || teamRes;
        if (teamData && Array.isArray(teamData.members)) {
          teamData.members.forEach((m: any) => {
            const u = typeof m.userId === "object" ? m.userId : null;
            if (u) addMember(u._id || u.id, u.name, u.email, m.role);
          });
        }

        const ws = wsRes?.data || wsRes;
        const owner = typeof ws?.ownerId === "object" ? ws.ownerId : null;
        if (owner) {
          addMember(owner._id || owner.id, owner.name, owner.email, "owner");
        }
        if (Array.isArray(ws?.members)) {
          ws.members.forEach((m: any) => {
            const u = typeof m.userId === "object" ? m.userId : null;
            if (u) addMember(u._id || u.id, u.name, u.email, m.role);
          });
        }
      } catch (err) {
        console.error("Failed to load members:", err);
      }

      // 3. Current logged-in user
      const curEmail = user?.email || "";
      const curName = user?.name || (curEmail ? curEmail.split("@")[0] : "You");
      const curId = (user as any)?._id || (user as any)?.id;
      if (curEmail || curName) {
        addMember(curId, curName, curEmail, "member");
      }

      if (isMounted) {
        setCandidateMembers(list);
      }
    }

    loadMembers();

    return () => {
      isMounted = false;
    };
  }, [isModalOpen, activeTeamId, currentWorkspace?._id, user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(target)) {
        setIsTeamDropdownOpen(false);
      }
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(target)) {
        setIsProjectDropdownOpen(false);
      }
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(target)) {
        setIsAssigneeDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
        setIsStatusDropdownOpen(false);
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(target)) {
        setIsPriorityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter projects by current team
  const currentTeamProjects = projects.filter((p) => {
    if (!selectedTeam) return false;
    let localMeta: any = null;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`taskflow_proj_meta_${p._id}`);
        if (raw) localMeta = JSON.parse(raw);
      } catch {}
    }
    const teamIdVal = p.teamId || localMeta?.teamId;
    const teamNameVal = (p.teamName || localMeta?.teamName || "").toLowerCase();
    const selName = (selectedTeam.name || "").toLowerCase();

    // Match 1: direct ID match
    if (typeof teamIdVal === "string" && (teamIdVal === selectedTeam._id || teamIdVal.toString() === selectedTeam._id?.toString())) {
      return true;
    }
    if (typeof teamIdVal === "object" && (teamIdVal as any)?._id?.toString() === selectedTeam._id?.toString()) {
      return true;
    }
    // Match 2: direct Name match
    if (teamNameVal && selName && teamNameVal === selName) {
      return true;
    }
    // Match 3: fallback ID match
    if ((teamIdVal === "team-des" || teamIdVal === "default-team") && selName.includes("design")) {
      return true;
    }
    if ((teamIdVal === "team-dev" || teamIdVal === "default-team-dev") && (selName.includes("web") || selName.includes("dev"))) {
      return true;
    }
    // Match 4: Initial legacy demo projects without team tag
    if (!teamIdVal && !teamNameVal) {
      if (selName.includes("design") && p.name?.toLowerCase().includes("1")) return true;
      if ((selName.includes("web") || selName.includes("dev")) && p.name?.toLowerCase().includes("2")) return true;
    }
    return false;
  });

  const otherProjects = projects.filter((p) => !currentTeamProjects.some((cp) => cp._id === p._id));

  // Handle Submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("Please provide an issue title.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Map UI status to Linear backend status
      let backendStatus: "backlog" | "unstarted" | "started" | "completed" | "canceled" = "unstarted";
      if (status === "backlog") backendStatus = "backlog";
      else if (status === "todo") backendStatus = "unstarted";
      else if (status === "in-progress") backendStatus = "started";
      else if (status === "completed") backendStatus = "completed";
      else if (status === "canceled") backendStatus = "canceled";

      // Linear Rule 1: Every issue must belong to a single team.
      // If an issue is assigned to a project, the project's team takes absolute precedence!
      let targetTeam: TeamItem | null = selectedTeam;
      if (selectedProject) {
        const projTeam = getProjectTeam(selectedProject, teams);
        if (projTeam) {
          targetTeam = projTeam;
        }
      }
      const targetTeamId = targetTeam?._id || selectedTeam?._id || defaultTeamId || (teams.length > 0 ? teams[0]._id : undefined);
      if (!targetTeamId) {
        setError("Every issue must belong to a team. Please select a team.");
        setIsSubmitting(false);
        return;
      }

      // Linear Rule 2: Projects are optional. Standalone issues do not have a projectId.
      const targetProjectId = selectedProject ? selectedProject._id : undefined;

      const issuePayload: any = {
        title: title.trim(),
        description: description.trim() || undefined,
        status: backendStatus,
        priority: priority === "none" ? "none" : priority,
        teamId: targetTeamId,
        projectId: targetProjectId,
        workspaceId: currentWorkspace?._id || targetTeam?.workspaceId || selectedTeam?.workspaceId || undefined,
        assignedTo: selectedAssignee?.id || selectedAssignee?.email || undefined,
        dueDate: dueDate || undefined,
        labels: selectedLabels,
      };

      const res = await api.post("/issues", issuePayload);
      const createdTask = res?.data || res;

      showToast("Issue created successfully");

      // Dispatch global events so all pages instantly update
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("taskflow:task-created", {
            detail: createdTask,
          })
        );
        window.dispatchEvent(new Event("task-created"));
      }

      onCreated?.();

      if (createMore) {
        // Reset form but keep team, stay open for next issue
        setTitle("");
        setDescription("");
        setStatus(defaultStatus || "todo");
        setPriority("none");
        setSelectedLabels([]);
        setDueDate("");
        setTimeout(() => titleInputRef.current?.focus(), 50);
      } else {
        setTitle("");
        setDescription("");
        setSelectedProject(null);
        handleCloseModal();
      }
    } catch (err: any) {
      console.error("Issue creation error:", err);
      setError(err?.message || "Failed to create issue. Every issue must have a team and title.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStatusObj =
    STATUS_OPTIONS.find((s) => s.key === status) || STATUS_OPTIONS[0];
  const currentPriorityObj =
    PRIORITY_OPTIONS.find((p) => p.key === priority) || PRIORITY_OPTIONS[0];

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window in Dark Blue Linear Theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className={`relative z-10 w-full overflow-visible rounded-2xl border border-[#2a2c3f] bg-[#161724] shadow-[0_24px_70px_rgba(0,0,0,0.85)] text-[#e6e7ee] flex flex-col transition-all duration-200 ${
            isExpanded ? "max-w-5xl h-[85vh]" : "max-w-3xl"
          }`}
        >
          {/* ============================================================== */}
          {/* 1. TOP HEADER: [icon] DES › New issue        ⤢ ✕               */}
          {/* ============================================================== */}
          <div className="flex items-center justify-between px-6 pt-3.5 pb-2 border-b border-[#24263a]/60">
            {/* Left: Team Button with Dropdown + Breadcrumb */}
            <div className="flex items-center gap-2 relative" ref={teamDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsTeamDropdownOpen((prev) => !prev);
                  setTeamSearchQuery("");
                }}
                className="h-7 px-2.5 rounded-[6px] bg-[#1f2133] hover:bg-[#25283c] border border-[#2e3149] flex items-center gap-1.5 text-[12px] font-semibold text-white transition-colors cursor-pointer select-none"
              >
                <TeamAvatar team={selectedTeam} />
                <span>{getTeamKey(selectedTeam)}</span>
              </button>

              <span className="text-[#55596e] text-xs font-normal leading-none select-none">
                ›
              </span>

              <span className="text-[13px] text-[#8a8f98] font-normal select-none">
                New issue
              </span>

              {/* Team Switcher Menu (Matching Screenshot) */}
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
                      (selectedTeam.key &&
                        selectedTeam.key.toLowerCase().includes(teamSearchQuery.toLowerCase()))) && (
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
                        <span className="text-[11px] font-mono font-medium text-[#707383] ml-2 shrink-0">
                          {getTeamKey(selectedTeam)}
                        </span>
                      </div>
                    )}

                  {/* "Your teams" Section Header */}
                  <div className="px-2 pt-2 pb-1 text-[11px] font-medium text-[#707383] select-none">
                    Your teams
                  </div>

                  {/* Team List Options */}
                  <div className="space-y-0.5 max-h-48 overflow-y-auto">
                    {teams
                      .filter(
                        (t) =>
                          !teamSearchQuery ||
                          t.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                          (t.key && t.key.toLowerCase().includes(teamSearchQuery.toLowerCase()))
                      )
                      .map((t) => {
                        const isCurrent = selectedTeam?._id === t._id;
                        return (
                          <div
                            key={t._id}
                            onClick={() => {
                              setSelectedTeam(t);
                              setIsTeamDropdownOpen(false);
                              if (selectedProject) {
                                const projTeam = getProjectTeam(selectedProject, teams);
                                if (projTeam && projTeam._id !== t._id) {
                                  setSelectedProject(null);
                                }
                              }
                            }}
                            className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-[#202234] text-white"
                                : "text-[#c5c8d6] hover:bg-[#202234] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <TeamAvatar team={t} />
                              <span className="text-[13px] font-normal truncate">
                                {t.name}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[#707383] ml-2 shrink-0">
                              {getTeamKey(t)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Expand and Close Buttons */}
            <div className="flex items-center gap-2 text-[#707383]">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. FORM BODY: Issue Title & Description Input Area             */}
          {/* ============================================================== */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            {error && (
              <div className="mx-6 mt-3 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="px-6 pt-4 pb-2">
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Issue title"
                className="w-full bg-transparent text-[16px] md:text-[17px] font-medium text-white placeholder-[#55596e] outline-none"
              />
            </div>

            <div className="px-6 flex-1 min-h-[130px]">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description..."
                rows={isExpanded ? 14 : 5}
                className="w-full bg-transparent text-[13.5px] text-[#c5c8d6] placeholder-[#55596e] outline-none resize-none leading-relaxed"
              />
            </div>

            {/* ============================================================== */}
            {/* 3. PROPERTIES PILL BAR (Screenshot 1 Layout)                    */}
            {/*    Backlog · Priority · Assignee · Project · Labels · ···      */}
            {/* ============================================================== */}
            <div className="px-6 pb-4 flex flex-wrap items-center gap-1.5 text-[12px] relative z-20">
              {/* STATUS PILL */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    setIsPriorityDropdownOpen(false);
                    setIsProjectDropdownOpen(false);
                    setIsAssigneeDropdownOpen(false);
                  }}
                  className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                    status !== "backlog"
                      ? "bg-[#222438] border-[#343854] text-white"
                      : "bg-[#1c1d2c] border-[#2b2d42] text-[#c5c8d6] hover:bg-[#222438] hover:text-white"
                  }`}
                >
                  <currentStatusObj.Icon className="w-3.5 h-3.5 text-[#8a8f98]" />
                  <span>{currentStatusObj.label}</span>
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-44 rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-2xl p-1 z-50 text-[12.5px]">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => {
                          setStatus(s.key);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <s.Icon className="w-3.5 h-3.5" />
                          <span>{s.label}</span>
                        </div>
                        <span className="text-[10px] text-[#707383] font-mono">
                          {s.shortcut}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRIORITY PILL */}
              <div className="relative" ref={priorityDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                    setIsStatusDropdownOpen(false);
                    setIsProjectDropdownOpen(false);
                    setIsAssigneeDropdownOpen(false);
                  }}
                  className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                    priority !== "none"
                      ? "bg-[#222438] border-[#343854] text-white"
                      : "bg-[#1c1d2c] border-[#2b2d42] text-[#8a8f98] hover:bg-[#222438] hover:text-white"
                  }`}
                >
                  {currentPriorityObj.renderIcon()}
                  <span>{priority === "none" ? "Priority" : currentPriorityObj.label}</span>
                </button>

                {isPriorityDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-44 rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-2xl p-1 z-50 text-[12.5px]">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                          setPriority(p.key);
                          setIsPriorityDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {p.renderIcon()}
                          <span>{p.label}</span>
                        </div>
                        {priority === p.key && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ASSIGNEE PILL */}
              <div className="relative" ref={assigneeDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
                    setIsStatusDropdownOpen(false);
                    setIsPriorityDropdownOpen(false);
                    setIsProjectDropdownOpen(false);
                  }}
                  className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                    selectedAssignee
                      ? "bg-[#222438] border-[#343854] text-white"
                      : "bg-[#1c1d2c] border-[#2b2d42] text-[#8a8f98] hover:bg-[#222438] hover:text-white"
                  }`}
                >
                  {selectedAssignee ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                      {selectedAssignee.initials}
                    </div>
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#8a8f98]" />
                  )}
                  <span>{selectedAssignee ? selectedAssignee.name : "Assignee"}</span>
                </button>

                {isAssigneeDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-60 rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-2xl p-1.5 z-50 text-[12.5px]">
                    <div className="px-2 py-1 text-[11px] font-medium text-[#707383]">
                      Assign to
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssignee(null);
                        setIsAssigneeDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#707383]" />
                      <span>Unassigned</span>
                    </button>
                    <div className="h-px bg-[#24263a] my-1" />
                    {candidateMembers.length === 0 ? (
                      <div className="px-2.5 py-2 text-xs text-[#707383]">
                        No team members found
                      </div>
                    ) : (
                      candidateMembers.map((m) => {
                        const isSelected =
                          (selectedAssignee?.id && selectedAssignee.id === m.id) ||
                          selectedAssignee?.email === m.email;
                        return (
                          <button
                            key={m.email || m.id || m.name}
                            type="button"
                            onClick={() => {
                              setSelectedAssignee(m);
                              setIsAssigneeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#202234] text-white"
                                : "text-[#c5c8d6] hover:bg-[#202234] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-4 h-4 rounded-full bg-[#7c3aed] flex items-center justify-center text-[8.5px] font-bold text-white shrink-0">
                                {m.initials}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="truncate font-medium">{m.name}</span>
                                {m.email && (
                                  <span className="truncate text-[10px] text-[#707383] -mt-0.5">
                                    {m.email}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* PROJECT PILL & DROPDOWN (EXACT MATCH TO SCREENSHOT 2)       */}
              {/* ============================================================ */}
              <div className="relative" ref={projectDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectDropdownOpen(!isProjectDropdownOpen);
                    setIsStatusDropdownOpen(false);
                    setIsPriorityDropdownOpen(false);
                    setIsAssigneeDropdownOpen(false);
                  }}
                  className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                    selectedProject
                      ? "bg-[#222438] border-[#343854] text-white"
                      : "bg-[#1c1d2c] border-[#2b2d42] text-[#8a8f98] hover:bg-[#222438] hover:text-white"
                  }`}
                >
                  {selectedProject ? (
                    <ProjectCubeIcon
                      className="w-3.5 h-3.5"
                      color={getProjectColor(selectedProject)}
                    />
                  ) : (
                    <ProjectCubeIcon className="w-3.5 h-3.5 text-[#8a8f98]" />
                  )}
                  <span className="truncate max-w-[140px]">
                    {selectedProject ? selectedProject.name : "Project"}
                  </span>
                </button>

                {/* Screenshot 2 Dropdown Menu Layout */}
                {isProjectDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-60 rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-1.5 z-50 text-[12.5px] text-[#e6e7ee]">
                    {/* Item 1: No project (with dashed circle, Checkmark and '0') */}
                    <div
                      onClick={() => {
                        setSelectedProject(null);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        !selectedProject
                          ? "bg-[#242638] text-white"
                          : "text-[#c5c8d6] hover:bg-[#202234] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <NoProjectIcon className="w-4 h-4 text-[#8a8f98]" />
                        <span className="font-medium">No project</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#8a8f98]">
                        {!selectedProject && <Check className="w-3.5 h-3.5 text-white" />}
                        <span className="text-[11px] font-mono text-[#707383]">0</span>
                      </div>
                    </div>

                    {/* Section 1: Projects in current team */}
                    <div className="px-2.5 pt-2.5 pb-1 text-[11px] font-medium text-[#707383] select-none truncate">
                      Projects in {selectedTeam?.name || "designer"} te...
                    </div>

                    {currentTeamProjects.length > 0 ? (
                      currentTeamProjects.map((p, idx) => {
                        const isSelected = selectedProject?._id === p._id;
                        const cubeColor = getProjectColor(p, idx);
                        return (
                          <div
                            key={p._id}
                            onClick={() => {
                              setSelectedProject(p);
                              setIsProjectDropdownOpen(false);
                              const pTeam = getProjectTeam(p, teams);
                              if (pTeam) setSelectedTeam(pTeam);
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#202234] text-white"
                                : "text-[#c5c8d6] hover:bg-[#202234] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <ProjectCubeIcon className="w-4 h-4 shrink-0" color={cubeColor} />
                              <span className="truncate">{p.name}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-2.5 py-1 text-[11px] text-[#55596e] italic">
                        No projects in this team
                      </div>
                    )}

                    {/* Section 2: Other projects */}
                    {otherProjects.length > 0 && (
                      <>
                        <div className="px-2.5 pt-2.5 pb-1 text-[11px] font-medium text-[#707383] select-none">
                          Other projects
                        </div>
                        {otherProjects.map((p, idx) => {
                          const isSelected = selectedProject?._id === p._id;
                          const cubeColor = getProjectColor(p, idx + 1);
                          return (
                            <div
                              key={p._id}
                              onClick={() => {
                                setSelectedProject(p);
                                setIsProjectDropdownOpen(false);
                                const pTeam = getProjectTeam(p, teams);
                                if (pTeam) setSelectedTeam(pTeam);
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                isSelected
                              ? "bg-[#202234] text-white"
                              : "text-[#c5c8d6] hover:bg-[#202234] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <ProjectCubeIcon className="w-4 h-4 shrink-0" color={cubeColor} />
                              <span className="truncate">{p.name}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          </div>
                        );
                      })}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* LABELS PILL */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsLabelsDropdownOpen(!isLabelsDropdownOpen);
                    setIsStatusDropdownOpen(false);
                    setIsPriorityDropdownOpen(false);
                    setIsProjectDropdownOpen(false);
                  }}
                  className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                    selectedLabels.length > 0
                      ? "bg-[#222438] border-[#343854] text-white"
                      : "bg-[#1c1d2c] border-[#2b2d42] text-[#8a8f98] hover:bg-[#222438] hover:text-white"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-[#8a8f98]" />
                  <span>
                    {selectedLabels.length > 0
                      ? `${selectedLabels.length} label${selectedLabels.length > 1 ? "s" : ""}`
                      : "Labels"}
                  </span>
                </button>

                {isLabelsDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-44 rounded-xl border border-[#2a2c3f] bg-[#161724] shadow-2xl p-1 z-50 text-[12.5px]">
                    {LABEL_OPTIONS.map((lbl) => {
                      const isChecked = selectedLabels.includes(lbl.label);
                      return (
                        <button
                          key={lbl.key}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setSelectedLabels(selectedLabels.filter((l) => l !== lbl.label));
                            } else {
                              setSelectedLabels([...selectedLabels, lbl.label]);
                            }
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                        >
                          <span className={`px-2 py-0.5 rounded border text-[11px] ${lbl.color}`}>
                            {lbl.label}
                          </span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MORE PILL (···) */}
              <button
                type="button"
                onClick={() => {
                  const d = prompt("Enter due date (YYYY-MM-DD):", dueDate);
                  if (d !== null) setDueDate(d);
                }}
                className={`h-7 px-2 rounded-lg border flex items-center justify-center transition-colors cursor-pointer select-none ${
                  dueDate
                    ? "bg-[#222438] border-[#343854] text-white"
                    : "bg-[#1c1d2c] border-[#2b2d42] text-[#8a8f98] hover:bg-[#222438] hover:text-white"
                }`}
                title={dueDate ? `Due: ${dueDate}` : "More options"}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ============================================================== */}
            {/* 4. BOTTOM FOOTER BAR (Screenshot 1 Layout)                     */}
            {/*    [📎]                    [toggle] Create more  [Create issue]*/}
            {/* ============================================================== */}
            <div className="px-6 py-3 border-t border-[#24263a]/60 flex items-center justify-between bg-[#12131d]/60 select-none">
              {/* Left: Attachment Paperclip Button */}
              <button
                type="button"
                onClick={() => showToast("Attachment upload ready")}
                className="p-1.5 rounded-md text-[#707383] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Right: "Create more" switch + "Create issue" button */}
              <div className="flex items-center gap-4">
                {/* Create more toggle switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setCreateMore(!createMore)}
                    className={`w-7 h-4 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      createMore ? "bg-[#5e6ad2]" : "bg-[#2b2e44]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        createMore ? "translate-x-3" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-[12.5px] text-[#8a8f98] hover:text-white transition-colors">
                    Create more
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] disabled:opacity-50 disabled:pointer-events-none text-white text-[13px] font-medium shadow-md shadow-[#5e6ad2]/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create issue</span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute bottom-16 right-6 z-50 bg-[#1e2030] text-white text-[12px] px-3 py-1.5 rounded-lg border border-[#2a2c3f] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {toastMessage}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}