"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/workspace/Sidebar";
import { FilterPillBar } from "@/components/workspace/FilterPillBar";
import { KanbanBoard } from "@/components/workspace/KanbanBoard";
import { IssueListView } from "@/components/workspace/IssueListView";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { CommandPalette } from "@/components/common/CommandPalette";
import { UnifiedIssuesView } from "@/components/workspace/UnifiedIssuesView";
import { AuthGuard } from "@/components/common/AuthGuard";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import { Project } from "@/types/project";
import { ProjectStatusIcon } from "@/components/common/ProjectStatusIcon";
import { ProjectPriorityIcon } from "@/components/common/ProjectPriorityIcon";
import {
  Star,
  Bell,
  Link2,
  MoreHorizontal,
  Plus,
  PencilLine,
  Check,
  ChevronDown,
  Calendar,
  Hash,
  Tag,
  Loader2,
  Layers,
  ArrowRight,
  ExternalLink,
  Trash2,
  Copy,
  Archive,
  X,
  Users,
  Box,
  Filter,
  SlidersHorizontal,
  PanelRight,
  Search,
} from "lucide-react";

interface TeamItem {
  _id: string;
  name: string;
  key?: string;
  color?: string;
  icon?: string;
}

interface TeamMemberItem {
  name: string;
  email: string;
  initials: string;
}

interface MilestoneItem {
  id: string;
  title: string;
  dueDate?: string;
  completed?: boolean;
}

interface ResourceItem {
  id: string;
  title: string;
  url: string;
}

// 3D Isometric Cube Icon matching screenshot
function ProjectCubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
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

// Right Panel Toggle Icon matching screenshot [|◫]
function PanelRightToggleIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <path d="M10.5 2.5V13.5" />
    </svg>
  );
}

// Views Icon matching screenshot
function ViewsTabIcon({ className = "w-4 h-4" }: { className?: string }) {
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

// Team Avatar matching screenshot
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
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5">
          <circle cx="8" cy="8" r="6" />
          <path d="M5.5 9.5C6.2 10.5 7.1 11 8 11C8.9 11 9.8 10.5 10.5 9.5" strokeLinecap="round" />
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
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5">
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

// User Initials Badge
function InitialsBadge({
  text = "SM",
  className = "w-4 h-4",
  bgColor = "bg-[#7c3aed]",
}: {
  text?: string;
  className?: string;
  bgColor?: string;
}) {
  return (
    <div
      className={`${className} rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-[9.5px] shrink-0 shadow-sm`}
    >
      {text}
    </div>
  );
}

// Format ordinal dates (e.g. Oct 26th)
function formatOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatLinearDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const day = formatOrdinal(d.getDate());
    return `${month} ${day}`;
  } catch {
    return dateStr;
  }
}

function formatDateRange(start?: string, end?: string) {
  if (start && end) {
    return `${formatLinearDate(start)} → ${formatLinearDate(end)}`;
  }
  if (start) return formatLinearDate(start);
  if (end) return formatLinearDate(end);
  return "Oct 26th → Nov 16th";
}

// Get Theme Color based on Project
function getProjectTheme(name: string, id: string) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("1")) {
    return {
      bg: "bg-[#38161e]",
      border: "border-[#52212d]",
      text: "text-[#f87171]",
      colorName: "coral",
    };
  }
  if (lower.includes("2")) {
    return {
      bg: "bg-[#382b13]",
      border: "border-[#54411c]",
      text: "text-[#eab308]",
      colorName: "amber",
    };
  }
  const colors = [
    { bg: "bg-[#38161e]", border: "border-[#52212d]", text: "text-[#f87171]", colorName: "coral" },
    { bg: "bg-[#382b13]", border: "border-[#54411c]", text: "text-[#eab308]", colorName: "amber" },
    { bg: "bg-[#182938]", border: "border-[#223d54]", text: "text-[#38bdf8]", colorName: "blue" },
    { bg: "bg-[#16382b]", border: "border-[#215441]", text: "text-[#34d399]", colorName: "emerald" },
    { bg: "bg-[#2d1838]", border: "border-[#452254]", text: "text-[#c084fc]", colorName: "purple" },
  ];
  let hash = 0;
  const str = (name || "") + (id || "");
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const STATUS_LIST = [
  { key: "backlog", label: "Backlog" },
  { key: "planned", label: "Planned" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

const PRIORITY_LIST = [
  { key: "urgent", label: "Urgent" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
  { key: "none", label: "No priority" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { activeIssueId, setActiveIssueId, setCreateModalOpen } = useUI();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // View & Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "issues" | "members">("overview");

  // Project Members State (Strictly for this project)
  const [projectMembers, setProjectMembers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: "owner" | "manager" | "member";
    avatar?: string | null;
    joinedAt?: string;
  }>>([]);
  const [isLoadingProjectMembers, setIsLoadingProjectMembers] = useState(false);
  const [isAddProjMemberOpen, setIsAddProjMemberOpen] = useState(false);
  const [projMemberEmail, setProjMemberEmail] = useState("");
  const [projMemberRole, setProjMemberRole] = useState<"manager" | "member">("member");
  const [isSubmittingProjMember, setIsSubmittingProjMember] = useState(false);
  const [projMemberError, setProjMemberError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false); // Closed by default, opens on button click
  const [isStarred, setIsStarred] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable Project Fields
  const [summary, setSummary] = useState("");
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [status, setStatus] = useState("planned");
  const [priority, setPriority] = useState("low");
  const [leadName, setLeadName] = useState("Siddiqa Malik");
  const [memberEmail, setMemberEmail] = useState("siddiqa.malik946@gmail.com");
  const [startDate, setStartDate] = useState("2026-10-26");
  const [targetDate, setTargetDate] = useState("2026-11-16");

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<
    "status" | "priority" | "team" | "lead" | "more" | null
  >(null);

  // Updates & Milestones list
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  const [activities, setActivities] = useState<Array<{ id: string; text: string; date: string }>>([
    {
      id: "act-1",
      text: "Siddiqa Malik created the project",
      date: "Oct 28",
    },
  ]);

  const [isWritingUpdate, setIsWritingUpdate] = useState(false);
  const [updateText, setUpdateText] = useState("");

  // Tabs & filters for project issues tab
  const [issuesTab, setIssuesTab] = useState<"active" | "backlog" | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Fetch Project details, metadata, teams, and tasks
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!projectId) return;
    try {
      if (!isSilent) setIsLoading(true);

      // 1. Fetch backend project & tasks specifically for this project
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/issues?projectId=${projectId}`).catch(() => []),
      ]);

      const projData: Project = projRes?.data || projRes;
      setProject(projData);

      const rawTaskList: Task[] = Array.isArray(tasksRes?.data)
        ? tasksRes.data
        : Array.isArray(tasksRes)
        ? tasksRes
        : [];

      // Strictly ensure that only issues belonging to this project are retained
      const projectOnlyTasks = rawTaskList.filter((t: any) => {
        const pId = typeof t.projectId === "object" ? t.projectId?._id : t.projectId;
        return pId && pId.toString() === projectId.toString();
      });
      setTasks(projectOnlyTasks);

      // 2. Fetch teams for workspace
      if (currentWorkspace?._id) {
        try {
          const teamsRes = await api.get(`/teams?workspaceId=${currentWorkspace._id}`);
          const teamList: TeamItem[] = teamsRes?.data || teamsRes || [];
          if (Array.isArray(teamList)) {
            setTeams(teamList);
          }
        } catch {}
      }

      // 3. Read cached local metadata if available
      let localMeta: any = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`taskflow_proj_meta_${projectId}`);
          if (raw) localMeta = JSON.parse(raw);
        } catch {}
      }

      // Initialize fields matching screenshot
      const currentUserName = user?.name || "Siddiqa Malik";
      const currentUserEmail = user?.email || "siddiqa.malik946@gmail.com";

      const projName = projData?.name || "project 1";
      const isProj2 = projName.toLowerCase().includes("2");

      const initialStatus =
        localMeta?.projectStatus ||
        projData?.projectStatus ||
        (projData?.status === "active" ? "planned" : "planned");
      setStatus(initialStatus);

      const initialPriority =
        localMeta?.priority ||
        projData?.priority ||
        (isProj2 ? "urgent" : "low");
      setPriority(initialPriority);

      const initialLead =
        typeof projData?.lead === "object" && projData.lead?.name
          ? projData.lead.name
          : typeof localMeta?.lead === "object" && localMeta.lead?.name
          ? localMeta.lead.name
          : currentUserName;
      setLeadName(initialLead);

      const initialEmail =
        typeof projData?.lead === "object" && projData.lead?.email
          ? projData.lead.email
          : currentUserEmail;
      setMemberEmail(initialEmail);

      const initialStartDate = localMeta?.startDate || projData?.startDate || "2026-10-26";
      const initialTargetDate =
        localMeta?.dueDate || projData?.dueDate || (isProj2 ? "2026-11-09" : "2026-11-16");
      setStartDate(initialStartDate);
      setTargetDate(initialTargetDate);

      if (projData?.description) {
        setDescription(projData.description);
      } else if (localMeta?.description) {
        setDescription(localMeta.description);
      }

      if (localMeta?.summary) {
        setSummary(localMeta.summary);
      }

      // Selected team resolution:
      // Project 1 screenshot shows designer; Project 2 shows web developer
      const teamId = localMeta?.teamId;
      const teamName = localMeta?.teamName || (isProj2 ? "web developer" : "designer");

      setSelectedTeam({
        _id: teamId || "default-team",
        name: teamName,
        key: isProj2 ? "WEB" : "DES",
        color: "#10b981",
        icon: isProj2 ? "Smile" : "Palette",
      });

      // Milestones & Resources
      if (localMeta?.milestones) setMilestones(localMeta.milestones);
      if (localMeta?.resources) setResources(localMeta.resources);

      // Starred state
      if (typeof window !== "undefined") {
        const favs = localStorage.getItem("taskflow_project_favorites");
        if (favs && JSON.parse(favs).includes(projectId)) {
          setIsStarred(true);
        }
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, currentWorkspace?._id, user]);

  // Fetch only this project's real members from backend
  const fetchProjectMembers = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoadingProjectMembers(true);
      const res = await api.get(`/projects/${projectId}/members`);
      const list = res?.data || res || [];
      if (Array.isArray(list)) {
        const formatted = list.map((m: any, idx: number) => {
          const u = m.user || m.userId;
          const uName = m.name || u?.name || m.email || u?.email?.split("@")[0] || `Member ${idx + 1}`;
          const uEmail = m.email || u?.email || "";
          const uAvatar = m.avatar || u?.avatar || null;
          return {
            id: m._id || u?._id || `pm-${idx}`,
            name: uName,
            email: uEmail,
            role: (m.role || "member") as "owner" | "manager" | "member",
            avatar: uAvatar,
            joinedAt: m.joinedAt ? formatLinearDate(m.joinedAt) : "Oct 28",
          };
        });
        setProjectMembers(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch project members:", err);
    } finally {
      setIsLoadingProjectMembers(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAllData();
    fetchProjectMembers();

    const handleCreated = (e: any) => {
      const newTask = e?.detail;
      if (newTask && newTask._id) {
        const pId = typeof newTask.projectId === "object" ? newTask.projectId?._id : newTask.projectId;
        if (pId && pId.toString() === projectId.toString()) {
          setTasks((prev) => {
            if (prev.some((t) => t._id === newTask._id)) return prev;
            return [newTask, ...prev];
          });
        }
      }
      fetchAllData(true); // Silent background sync without full-screen loading spinner
    };

    window.addEventListener("taskflow:task-created", handleCreated);
    return () => {
      window.removeEventListener("taskflow:task-created", handleCreated);
    };
  }, [fetchAllData, fetchProjectMembers, projectId]);

  // Persist metadata changes
  const saveProjectMeta = (updates: Record<string, any>) => {
    if (typeof window === "undefined" || !projectId) return;
    try {
      const raw = localStorage.getItem(`taskflow_proj_meta_${projectId}`);
      const existing = raw ? JSON.parse(raw) : {};
      const next = { ...existing, ...updates };
      localStorage.setItem(`taskflow_proj_meta_${projectId}`, JSON.stringify(next));
    } catch {}
  };

  // Update Status
  const handleUpdateStatus = async (newStatus: string) => {
    setStatus(newStatus);
    setActiveDropdown(null);
    saveProjectMeta({ projectStatus: newStatus });
    try {
      await api.patch(`/projects/${projectId}`, { projectStatus: newStatus });
    } catch {}
    showToast(`Status updated to ${newStatus}`);
  };

  // Update Priority
  const handleUpdatePriority = async (newPriority: string) => {
    setPriority(newPriority);
    setActiveDropdown(null);
    saveProjectMeta({ priority: newPriority });
    try {
      await api.patch(`/projects/${projectId}`, { priority: newPriority });
    } catch {}
    showToast(`Priority updated to ${newPriority}`);
  };

  // Update Team
  const handleUpdateTeam = async (t: TeamItem) => {
    setSelectedTeam(t);
    setActiveDropdown(null);
    saveProjectMeta({ teamId: t._id, teamName: t.name, teamKey: t.key });
    try {
      await api.patch(`/projects/${projectId}`, { teamId: t._id, teamName: t.name });
    } catch {}
    showToast(`Team changed to ${t.name}`);
  };

  // Favorite toggle
  const toggleStar = () => {
    const next = !isStarred;
    setIsStarred(next);
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("taskflow_project_favorites");
        const list: string[] = raw ? JSON.parse(raw) : [];
        const nextList = next
          ? Array.from(new Set([...list, projectId]))
          : list.filter((id) => id !== projectId);
        localStorage.setItem("taskflow_project_favorites", JSON.stringify(nextList));
      } catch {}
    }
    showToast(next ? "Added to favorites" : "Removed from favorites");
  };

  // Copy link
  const copyProjectLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Project link copied to clipboard");
    }
  };

  // Add Milestone
  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const newM: MilestoneItem = {
      id: `ms-${Date.now()}`,
      title: newMilestoneTitle.trim(),
    };
    const next = [...milestones, newM];
    setMilestones(next);
    setNewMilestoneTitle("");
    setIsAddingMilestone(false);
    saveProjectMeta({ milestones: next });
    showToast("Milestone added");
  };

  // Add Resource
  const handleAddResource = () => {
    if (!newResourceTitle.trim() || !newResourceUrl.trim()) return;
    const newR: ResourceItem = {
      id: `res-${Date.now()}`,
      title: newResourceTitle.trim(),
      url: newResourceUrl.trim(),
    };
    const next = [...resources, newR];
    setResources(next);
    setNewResourceTitle("");
    setNewResourceUrl("");
    setIsAddingResource(false);
    saveProjectMeta({ resources: next });
    showToast("Resource added");
  };

  // Post Project Update
  const handlePostUpdate = () => {
    if (!updateText.trim()) return;
    const newAct = {
      id: `act-${Date.now()}`,
      text: `${leadName}: ${updateText.trim()}`,
      date: "Just now",
    };
    setActivities([newAct, ...activities]);
    setUpdateText("");
    setIsWritingUpdate(false);
    showToast("Project update posted");
  };

  // Close dropdowns on outside click
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [activeDropdown]);

  const projTheme = getProjectTheme(project?.name || "", projectId || "");
  const currentStatusObj = STATUS_LIST.find((s) => s.key === status) || STATUS_LIST[1];
  const currentPriorityObj = PRIORITY_LIST.find((p) => p.key === priority) || PRIORITY_LIST[3];

  const filteredTasks = tasks.filter((task) => {
    // 1. Strictly project issues only (guarantee no other project's issues appear)
    const pId = typeof task.projectId === "object" ? task.projectId?._id : task.projectId;
    if (pId && pId.toString() !== projectId.toString()) return false;

    // 2. Subheader tabs: Active, Backlog, All issues
    const s = (task.status || "").toLowerCase();
    if (issuesTab === "active") {
      const isActive =
        s === "todo" ||
        s === "unstarted" ||
        s === "in-progress" ||
        s === "started" ||
        s === "in_progress";
      if (!isActive) return false;
    } else if (issuesTab === "backlog") {
      if (s !== "backlog") return false;
    }

    // 3. Dropdown status & priority filters
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

    // 4. Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchKey = (task as any).identifier?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc && !matchKey) return false;
    }
    return true;
  });

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#0f1017] text-[#e6e7ee] overflow-hidden font-sans select-none">
        {/* Left Workspace Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0f1017]">
          {/* ============================================================== */}
          {/* 1. TOP APP BAR MATCHING SCREENSHOT                             */}
          {/*    Projects › [Cube] project 1 ☆ ···            🔗 🔔 [|◫]     */}
          {/* ============================================================== */}
          <div className="h-11 px-5 border-b border-[#24263a]/70 flex items-center justify-between shrink-0 bg-[#0f1017] z-20">
            {/* Left: Breadcrumbs & Controls */}
            <div className="flex items-center gap-2">
              <Link
                href="/projects"
                className="text-[13px] font-medium text-[#8a8f98] hover:text-white transition-colors"
              >
                Projects
              </Link>

              <span className="text-[#55596e] text-xs leading-none">›</span>

              {/* Cube Icon in Colored Rounded Badge */}
              <div
                className={`w-5 h-5 rounded-[5px] ${projTheme.bg} ${projTheme.border} ${projTheme.text} border flex items-center justify-center shrink-0 shadow-sm`}
              >
                <ProjectCubeIcon className="w-3.5 h-3.5" />
              </div>

              {/* Project Name */}
              <span className="text-[13px] font-semibold text-white tracking-tight truncate max-w-[200px]">
                {project?.name || "project 1"}
              </span>

              {/* Favorite Star */}
              <button
                type="button"
                onClick={toggleStar}
                className={`p-1 rounded hover:bg-white/[0.06] transition-colors cursor-pointer ${
                  isStarred ? "text-amber-400" : "text-[#707383] hover:text-white"
                }`}
                title={isStarred ? "Favorited" : "Add to favorites"}
              >
                <Star className="w-3.5 h-3.5" fill={isStarred ? "currentColor" : "none"} />
              </button>

              {/* Three dots menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "more" ? null : "more")}
                  className="p-1 rounded text-[#707383] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="More actions"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {activeDropdown === "more" && (
                  <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-[#2a2c3f] bg-[#161724] shadow-2xl py-1 z-50 text-[12.5px]">
                    <button
                      type="button"
                      onClick={copyProjectLink}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#8a8f98]" />
                      Copy link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        showToast("Project duplicated");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#8a8f98]" />
                      Duplicate project
                    </button>
                    <div className="h-px bg-[#24263a] my-1" />
                    <button
                      type="button"
                      onClick={async () => {
                        setActiveDropdown(null);
                        try {
                          await api.patch(`/projects/${projectId}`, { status: "archived" });
                          showToast("Project archived");
                        } catch {}
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5 text-[#8a8f98]" />
                      Archive project
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setActiveDropdown(null);
                        if (confirm("Are you sure you want to delete this project? All associated issues will also be deleted.")) {
                          try {
                            await api.delete(`/projects/${projectId}`);
                            if (typeof window !== "undefined") {
                              localStorage.removeItem(`taskflow_proj_meta_${projectId}`);
                              window.dispatchEvent(new CustomEvent("taskflow:task-created"));
                              window.dispatchEvent(new Event("task-created"));
                              window.dispatchEvent(new Event("project-created"));
                            }
                            router.push("/projects");
                          } catch (err: any) {
                            showToast(err?.message || "Failed to delete project");
                          }
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/10 text-left text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete project
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Link, Notification Bell, and Panel Toggle [|◫] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyProjectLink}
                className="p-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Copy project link"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubscribed(!isSubscribed);
                  showToast(!isSubscribed ? "Subscribed to project updates" : "Unsubscribed");
                }}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isSubscribed
                    ? "text-[#5e6ad2] bg-[#5e6ad2]/10"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Subscribe to notifications"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>

              {/* Right Panel Toggle Button [|◫] (Matches user's screenshot) */}
              <button
                type="button"
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isRightPanelOpen
                    ? "text-white bg-white/[0.08]"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.06]"
                }`}
                title={isRightPanelOpen ? "Hide right panel" : "Show right panel"}
              >
                <PanelRightToggleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. TABS BAR MATCHING SCREENSHOT                                */}
          {/*    Overview  Activity  Issues  [ViewsIcon]                     */}
          {/* ============================================================== */}
          <div className="h-10 px-6 border-b border-[#24263a]/50 flex items-center justify-between shrink-0 bg-[#0f1017]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#202234] text-white shadow-sm border border-[#2d3148]"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Overview
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("activity")}
                className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer ${
                  activeTab === "activity"
                    ? "bg-[#202234] text-white shadow-sm border border-[#2d3148]"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Activity
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("issues")}
                className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer ${
                  activeTab === "issues"
                    ? "bg-[#202234] text-white shadow-sm border border-[#2d3148]"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Issues
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer ${
                  activeTab === "members"
                    ? "bg-[#202234] text-white shadow-sm border border-[#2d3148]"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Members
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("issues")}
                className="p-1 rounded text-[#707383] hover:text-white hover:bg-white/[0.04] transition-colors ml-1 cursor-pointer"
                title="Project views"
              >
                <ViewsTabIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Toast feedback */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#1e2030] text-white text-[12px] px-3.5 py-2 rounded-lg border border-[#2a2c3f] shadow-2xl flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {toastMessage}
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. MAIN WORKSPACE / INSPECTOR SPLIT VIEW                       */}
          {/* ============================================================== */}
          <div className="flex-1 flex min-h-0 overflow-hidden relative">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#8a8f98]">
                <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
                <span className="text-[13px]">Loading project overview...</span>
              </div>
            ) : activeTab === "overview" ? (
              /* ========================================================== */
              /* TAB 1: OVERVIEW (MATCHING SCREENSHOT 1 & 2)                */
              /* ========================================================== */
              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
                <div className="max-w-3xl mx-auto flex flex-col items-start w-full">
                  {/* Cube Icon in Large Colored Badge */}
                <div
                  className={`w-9 h-9 rounded-lg ${projTheme.bg} ${projTheme.border} ${projTheme.text} border flex items-center justify-center shrink-0 shadow-md mb-3.5`}
                >
                  <ProjectCubeIcon className="w-5 h-5" />
                </div>

                {/* Project Title */}
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {project?.name || "project 1"}
                </h1>

                {/* Short Summary Field */}
                <div className="mb-6 w-full">
                  {isEditingSummary ? (
                    <input
                      type="text"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      onBlur={() => {
                        setIsEditingSummary(false);
                        saveProjectMeta({ summary });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIsEditingSummary(false);
                          saveProjectMeta({ summary });
                        }
                      }}
                      autoFocus
                      placeholder="Add a short summary..."
                      className="bg-transparent border-b border-[#5e6ad2] text-[13.5px] text-[#c5c8d6] outline-none w-full pb-0.5"
                    />
                  ) : (
                    <p
                      onClick={() => setIsEditingSummary(true)}
                      className="text-[13.5px] text-[#707383] hover:text-[#9ca3af] cursor-pointer transition-colors"
                    >
                      {summary || "Add a short summary..."}
                    </p>
                  )}
                </div>

                {/* Horizontal Properties Row matching screenshot */}
                <div className="flex flex-wrap items-center gap-3 py-2 text-[12.5px] w-full mb-3 select-none">
                  <span className="text-[#707383] text-xs font-medium w-20 shrink-0">
                    Properties
                  </span>

                  {/* Status Pill */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === "status" ? null : "status")
                      }
                      className="h-6 px-2.5 rounded-[5px] bg-[#1a1c2a] hover:bg-[#222538] border border-[#26283b] flex items-center gap-1.5 text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
                    >
                      <ProjectStatusIcon status={status} className="w-3.5 h-3.5" />
                      <span>{currentStatusObj.label}</span>
                    </button>

                    {activeDropdown === "status" && (
                      <div className="absolute left-0 top-full mt-1 w-36 rounded-lg border border-[#2a2c3f] bg-[#161724] shadow-2xl py-1 z-50 text-[12.5px]">
                        {STATUS_LIST.map((st) => (
                          <button
                            key={st.key}
                            type="button"
                            onClick={() => handleUpdateStatus(st.key)}
                            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <ProjectStatusIcon status={st.key} className="w-3.5 h-3.5" />
                              {st.label}
                            </span>
                            {status === st.key && <Check className="w-3 h-3 text-[#5e6ad2]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Priority Pill */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === "priority" ? null : "priority")
                      }
                      className="h-6 px-2.5 rounded-[5px] bg-[#1a1c2a] hover:bg-[#222538] border border-[#26283b] flex items-center gap-1.5 text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
                    >
                      <ProjectPriorityIcon priority={priority} className="w-3.5 h-3.5" />
                      <span>{currentPriorityObj.label}</span>
                    </button>

                    {activeDropdown === "priority" && (
                      <div className="absolute left-0 top-full mt-1 w-36 rounded-lg border border-[#2a2c3f] bg-[#161724] shadow-2xl py-1 z-50 text-[12.5px]">
                        {PRIORITY_LIST.map((pr) => (
                          <button
                            key={pr.key}
                            type="button"
                            onClick={() => handleUpdatePriority(pr.key)}
                            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <ProjectPriorityIcon priority={pr.key} className="w-3.5 h-3.5" />
                              {pr.label}
                            </span>
                            {priority === pr.key && <Check className="w-3 h-3 text-[#5e6ad2]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lead Pill */}
                  <div className="h-6 px-2.5 rounded-[5px] bg-[#1a1c2a] border border-[#26283b] flex items-center gap-1.5 text-[#c5c8d6]">
                    <InitialsBadge
                      text={leadName.slice(0, 2).toUpperCase()}
                      bgColor="bg-[#eab308]/20 text-amber-300"
                    />
                    <span>{leadName}</span>
                  </div>

                  {/* Members Initials Pill (SI in screenshot) */}
                  <div className="h-6 px-2 rounded-[5px] bg-[#1a1c2a] border border-[#26283b] flex items-center gap-1.5">
                    <InitialsBadge text="SI" bgColor="bg-[#7c3aed]" />
                  </div>

                  {/* Dates Pill */}
                  <div className="h-6 px-2.5 rounded-[5px] bg-[#1a1c2a] border border-[#26283b] flex items-center gap-1.5 text-[#c5c8d6]">
                    <Calendar className="w-3 h-3 text-[#8a8f98]" />
                    <span>{formatDateRange(startDate, targetDate)}</span>
                  </div>

                  {/* Team Pill */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === "team" ? null : "team")
                      }
                      className="h-6 px-2.5 rounded-[5px] bg-[#1a1c2a] hover:bg-[#222538] border border-[#26283b] flex items-center gap-1.5 text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
                    >
                      <TeamAvatar team={selectedTeam} />
                      <span>{selectedTeam?.name || "designer"}</span>
                    </button>

                    {activeDropdown === "team" && (
                      <div className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-[#2a2c3f] bg-[#161724] shadow-2xl py-1 z-50 text-[12.5px]">
                        {teams.map((tm) => (
                          <button
                            key={tm._id}
                            type="button"
                            onClick={() => handleUpdateTeam(tm)}
                            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#202234] text-left text-[#c5c8d6] hover:text-white transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <TeamAvatar team={tm} />
                              {tm.name}
                            </span>
                            {selectedTeam?._id === tm._id && (
                              <Check className="w-3 h-3 text-[#5e6ad2]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* More Properties */}
                  <button
                    type="button"
                    onClick={() => setIsRightPanelOpen((prev) => !prev)}
                    className="h-6 px-2 rounded-[5px] text-[#707383] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
                    title="Toggle properties panel"
                  >
                    ···
                  </button>
                </div>

                {/* Resources Row */}
                <div className="flex items-center gap-3 py-1 text-[12.5px] w-full mb-8">
                  <span className="text-[#707383] text-xs font-medium w-20 shrink-0">
                    Resources
                  </span>

                  {resources.length === 0 && !isAddingResource ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingResource(true)}
                      className="text-xs text-[#707383] hover:text-[#c5c8d6] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add document or link...
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {resources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-6 px-2.5 rounded-[5px] bg-[#1a1c2a] hover:bg-[#222538] border border-[#26283b] flex items-center gap-1 text-[11.5px] text-[#8a8f98] hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{res.title}</span>
                        </a>
                      ))}
                      {!isAddingResource ? (
                        <button
                          type="button"
                          onClick={() => setIsAddingResource(true)}
                          className="p-1 text-[#707383] hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      ) : null}
                    </div>
                  )}

                  {isAddingResource && (
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Title"
                        value={newResourceTitle}
                        onChange={(e) => setNewResourceTitle(e.target.value)}
                        className="bg-[#1f2133] border border-[#2e3149] rounded px-2 py-1 text-white outline-none w-28"
                      />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newResourceUrl}
                        onChange={(e) => setNewResourceUrl(e.target.value)}
                        className="bg-[#1f2133] border border-[#2e3149] rounded px-2 py-1 text-white outline-none w-36"
                      />
                      <button
                        type="button"
                        onClick={handleAddResource}
                        className="px-2 py-1 bg-[#5e6ad2] text-white rounded font-medium"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingResource(false)}
                        className="text-[#707383] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Big Action Card: Write First Project Update */}
                <div className="w-full mb-8">
                  {isWritingUpdate ? (
                    <div className="w-full border border-[#26283b] bg-[#161724] rounded-xl p-4 flex flex-col gap-3">
                      <textarea
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        placeholder="Share progress, blockers, or next steps on this project..."
                        rows={3}
                        autoFocus
                        className="bg-transparent text-[13px] text-white placeholder-[#707383] outline-none resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsWritingUpdate(false)}
                          className="px-3 py-1 rounded text-xs text-[#8a8f98] hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handlePostUpdate}
                          className="px-3 py-1 rounded bg-[#5e6ad2] hover:bg-[#4b55be] text-xs text-white font-medium cursor-pointer"
                        >
                          Post update
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsWritingUpdate(true)}
                      className="w-full border border-[#26283b] bg-[#161724]/40 hover:bg-[#1a1c2b] rounded-xl py-3.5 px-4 flex items-center justify-center cursor-pointer text-[#8a8f98] hover:text-white transition-all group shadow-sm"
                    >
                      <PencilLine className="w-4 h-4 mr-2 text-[#707383] group-hover:text-white transition-colors" />
                      <span className="text-[13px] font-medium">Write first project update</span>
                    </button>
                  )}
                </div>

                {/* Description Section */}
                <div className="w-full mb-8">
                  <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                  {isEditingDescription ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        autoFocus
                        placeholder="Add a detailed description for this project..."
                        className="w-full bg-[#161724] border border-[#2a2c3f] rounded-lg p-3 text-[13px] text-[#c5c8d6] outline-none resize-y"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setIsEditingDescription(false)}
                          className="px-3 py-1 text-xs text-[#8a8f98] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingDescription(false);
                            saveProjectMeta({ description });
                            api.patch(`/projects/${projectId}`, { description }).catch(() => {});
                            showToast("Description saved");
                          }}
                          className="px-3 py-1 bg-[#5e6ad2] text-xs text-white rounded font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className="text-[13px] text-[#707383] hover:text-[#9ca3af] cursor-pointer min-h-[40px] leading-relaxed transition-colors"
                    >
                      {description || "Add description..."}
                    </div>
                  )}
                </div>

                {/* Milestones Section */}
                <div className="w-full mb-12">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Milestones</span>
                  </div>

                  {milestones.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {milestones.map((ms) => (
                        <div
                          key={ms.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#161724] border border-[#24263a] text-xs text-[#c5c8d6]"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={ms.completed}
                              onChange={() => {
                                const next = milestones.map((m) =>
                                  m.id === ms.id ? { ...m, completed: !m.completed } : m
                                );
                                setMilestones(next);
                                saveProjectMeta({ milestones: next });
                              }}
                              className="rounded border-[#2a2c3f] cursor-pointer"
                            />
                            <span className={ms.completed ? "line-through text-[#707383]" : ""}>
                              {ms.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isAddingMilestone ? (
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Milestone title..."
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        className="bg-[#1f2133] border border-[#2e3149] rounded px-2.5 py-1 text-white outline-none flex-1 max-w-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddMilestone}
                        className="px-2.5 py-1 bg-[#5e6ad2] text-white rounded font-medium"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingMilestone(false)}
                        className="text-[#707383] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingMilestone(true)}
                      className="text-xs text-[#707383] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Milestone
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "issues" ? (
            /* ========================================================== */
            /* TAB 2: PROJECT ISSUES (REUSING EXACT SAME UNIFIED ISSUES)  */
            /* ========================================================== */
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0f1017]">
              <UnifiedIssuesView
                level="project"
                projectId={projectId}
                projectData={project}
                hideSidebar
                hideTopHeader
              />
            </div>
          ) : activeTab === "members" ? (
              /* ========================================================== */
              /* TAB: PROJECT MEMBERS (STRICTLY THIS PROJECT'S MEMBERS)    */
              /* ========================================================== */
              <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                  {/* Header & Add Member Button */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#24263a]/60">
                    <div>
                      <h2 className="text-[18px] font-semibold text-white tracking-tight">
                        Project Members
                      </h2>
                      <p className="text-[12.5px] text-[#8a8f98] mt-1">
                        Only members assigned to <span className="text-white font-medium">{project?.name || "this project"}</span> are shown here.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddProjMemberOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {/* Members Table */}
                  <div className="rounded-xl border border-[#24263a] bg-[#12131d] overflow-hidden shadow-lg">
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-[#171824] text-[11px] font-medium text-[#707489] uppercase tracking-wider font-mono border-b border-[#24263a]/60">
                      <div className="col-span-5">Member</div>
                      <div className="col-span-3">Role in Project</div>
                      <div className="col-span-3">Joined</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-[#24263a]/50">
                      {isLoadingProjectMembers ? (
                        <div className="p-8 text-center text-xs text-[#8a8f98] flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#5e6ad2]" />
                          <span>Loading project members...</span>
                        </div>
                      ) : projectMembers.length === 0 ? (
                        <div className="p-8 text-center text-xs text-[#8a8f98]">
                          No members in this project yet.
                        </div>
                      ) : (
                        projectMembers.map((m) => (
                          <div
                            key={m.id}
                            className="grid grid-cols-12 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors text-xs"
                          >
                            {/* Member Name + Avatar */}
                            <div className="col-span-5 flex items-center gap-2.5">
                              {m.avatar ? (
                                <img
                                  src={m.avatar}
                                  alt={m.name}
                                  className="w-7 h-7 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center text-[10.5px] font-semibold shrink-0">
                                  {m.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-[13px] font-medium text-white">{m.name}</p>
                                <p className="text-[11px] text-[#707383]">{m.email}</p>
                              </div>
                            </div>

                            {/* Project Role */}
                            <div className="col-span-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                                  m.role === "owner"
                                    ? "bg-[#371b3e] text-[#c084fc] border border-[#52215c]"
                                    : m.role === "manager"
                                    ? "bg-[#18263e] text-[#60a5fa] border border-[#23385c]"
                                    : "bg-[#1f2133] text-[#8a8f98] border border-[#2a2c42]"
                                }`}
                              >
                                {m.role}
                              </span>
                            </div>

                            {/* Joined */}
                            <div className="col-span-3 text-[#8a8f98] text-[12px]">
                              {m.joinedAt || "Oct 28"}
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 text-right">
                              {m.role !== "owner" && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm(`Remove ${m.name} from project?`)) {
                                      try {
                                        await api.delete(`/projects/${projectId}/members/${m.id}`);
                                        showToast("Member removed from project");
                                        fetchProjectMembers();
                                      } catch (err: any) {
                                        showToast(err?.message || "Failed to remove member");
                                      }
                                    }
                                  }}
                                  className="p-1.5 rounded text-[#707383] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Remove from project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================================== */
              /* TAB 3: ACTIVITY TIMELINE                                   */
              /* ========================================================== */
              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
                <div className="max-w-3xl mx-auto w-full">
                  <h2 className="text-base font-semibold text-white mb-4">Project Activity</h2>
                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[#c5c8d6]">{act.text}</p>
                          <span className="text-[11px] text-[#707383]">{act.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 4. RIGHT SIDEBAR PANEL MATCHING SCREENSHOT 1                */}
            {/*    Properties, Milestones, Activity (Toggleable via [|◫])   */}
            {/* ============================================================ */}
            <AnimatePresence>
              {isRightPanelOpen && (
                <motion.aside
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-0 right-0 bottom-0 w-[340px] border-l border-[#24263a] bg-[#12131d] overflow-y-auto p-5 space-y-6 text-[#e6e7ee] shrink-0 select-none z-30 shadow-2xl shadow-black/80"
                >
                {/* Section 1: Properties Header */}
                <div>
                  <div className="flex items-center justify-between mb-3 text-[#8a8f98]">
                    <button
                      type="button"
                      className="text-[12px] font-semibold text-[#8a8f98] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>Properties</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:text-white cursor-pointer"
                      title="Add property"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Property Rows matching screenshot */}
                  <div className="space-y-2.5 text-[12px]">
                    {/* Status */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Status</span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === "status" ? null : "status")
                        }
                        className="flex-1 flex items-center gap-1.5 text-[#c5c8d6] hover:text-white cursor-pointer transition-colors"
                      >
                        <ProjectStatusIcon status={status} className="w-3.5 h-3.5" />
                        <span>{currentStatusObj.label}</span>
                      </button>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Priority</span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === "priority" ? null : "priority")
                        }
                        className="flex-1 flex items-center gap-1.5 text-[#c5c8d6] hover:text-white cursor-pointer transition-colors"
                      >
                        <ProjectPriorityIcon priority={priority} className="w-3.5 h-3.5" />
                        <span>{currentPriorityObj.label}</span>
                      </button>
                    </div>

                    {/* Lead */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Lead</span>
                      <div className="flex-1 flex items-center gap-1.5 text-[#c5c8d6]">
                        <InitialsBadge
                          text={leadName.slice(0, 2).toUpperCase()}
                          bgColor="bg-[#eab308]/20 text-amber-300"
                        />
                        <span className="truncate">{leadName}</span>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Members</span>
                      <div className="flex-1 flex items-center gap-1.5 text-[#c5c8d6] truncate">
                        {projectMembers.length > 0 ? (
                          <div className="flex items-center -space-x-1">
                            {projectMembers.slice(0, 3).map((pm) => (
                              <div
                                key={pm.id}
                                title={`${pm.name} (${pm.role})`}
                                className="w-5 h-5 rounded-full bg-[#5e6ad2] border border-[#12131d] text-white flex items-center justify-center text-[8.5px] font-bold shrink-0"
                              >
                                {pm.name.slice(0, 2).toUpperCase()}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <InitialsBadge text="SI" bgColor="bg-[#7c3aed]" />
                        )}
                        <span className="truncate text-[11.5px] text-[#8a8f98] ml-1">
                          {projectMembers.length > 0
                            ? `${projectMembers.length} member${projectMembers.length > 1 ? "s" : ""}`
                            : memberEmail}
                        </span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Dates</span>
                      <div className="flex-1 flex items-center gap-1.5 text-[#c5c8d6] text-[11.5px]">
                        <Calendar className="w-3 h-3 text-[#707383]" />
                        <span>{formatDateRange(startDate, targetDate)}</span>
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Teams</span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === "team" ? null : "team")
                        }
                        className="flex-1 flex items-center gap-1.5 text-[#c5c8d6] hover:text-white cursor-pointer"
                      >
                        <TeamAvatar team={selectedTeam} />
                        <span>{selectedTeam?.name || "designer"}</span>
                      </button>
                    </div>

                    {/* Slack */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Slack</span>
                      <div className="flex-1 flex items-center gap-1.5 text-[#707383] hover:text-white cursor-pointer">
                        <Hash className="w-3.5 h-3.5 text-[#707383]" />
                        <span>Slack channel</span>
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-[#707383] w-24">Labels</span>
                      <div className="flex-1 flex items-center gap-1.5 text-[#707383] hover:text-white cursor-pointer">
                        <Tag className="w-3.5 h-3.5 text-[#707383]" />
                        <span>Add label</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#24263a]/60 my-4" />

                {/* Section 2: Milestones Header */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-[#8a8f98]">
                    <button
                      type="button"
                      className="text-[12px] font-semibold text-[#8a8f98] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>Milestones</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingMilestone(true)}
                      className="p-1 hover:text-white cursor-pointer"
                      title="Add milestone"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11.5px] text-[#707383] leading-relaxed">
                    Add milestones to organize work within your project and break it into more granular stages.{" "}
                    <span className="text-[#5e6ad2] hover:underline cursor-pointer">Learn more</span>
                  </p>
                </div>

                <div className="h-px bg-[#24263a]/60 my-4" />

                {/* Section 3: Activity Header */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 text-[#8a8f98]">
                    <button
                      type="button"
                      className="text-[12px] font-semibold text-[#8a8f98] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>Activity</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("activity")}
                      className="text-[11.5px] text-[#8a8f98] hover:text-white cursor-pointer transition-colors"
                    >
                      See all
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activities.slice(0, 3).map((act) => (
                      <div key={act.id} className="flex items-center gap-2 text-[11.5px] text-[#8a8f98]">
                        <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                        <span className="truncate">
                          {act.text} · {act.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
        </div>

        {/* Issue drawer */}
        <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchAllData} />

        {/* Add Project Member Modal */}
        {isAddProjMemberOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => {
                setIsAddProjMemberOpen(false);
                setProjMemberError(null);
              }}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-[#2a2c3f] bg-[#161726] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-[#24263a] pb-3">
                <h3 className="text-sm font-semibold text-white">
                  Add Member to Project
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddProjMemberOpen(false)}
                  className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!projMemberEmail.trim()) return;
                  try {
                    setIsSubmittingProjMember(true);
                    setProjMemberError(null);
                    await api.post(`/projects/${projectId}/members`, {
                      email: projMemberEmail.trim().toLowerCase(),
                      role: projMemberRole,
                    });
                    showToast("Member added to project successfully!");
                    setProjMemberEmail("");
                    setIsAddProjMemberOpen(false);
                    fetchProjectMembers();
                  } catch (err: any) {
                    setProjMemberError(err?.message || "Failed to add member to project");
                  } finally {
                    setIsSubmittingProjMember(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11.5px] font-medium text-[#8a8f98] mb-1.5">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={projMemberEmail}
                    onChange={(e) => setProjMemberEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full bg-[#0f101a] border border-[#2a2c42] focus:border-[#5e6ad2] rounded-lg px-3 py-2 text-[12.5px] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#8a8f98] mb-1.5">
                    Project Role
                  </label>
                  <select
                    value={projMemberRole}
                    onChange={(e) => setProjMemberRole(e.target.value as any)}
                    className="w-full bg-[#0f101a] border border-[#2a2c42] rounded-lg px-3 py-2 text-[12.5px] text-white outline-none cursor-pointer"
                  >
                    <option value="member">Member (Can create, view & resolve issues)</option>
                    <option value="manager">Manager (Can manage issues, cycles & members)</option>
                  </select>
                </div>

                {projMemberError && (
                  <p className="text-xs text-rose-400">{projMemberError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProjMemberOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#8a8f98] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProjMember}
                    className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium cursor-pointer shadow-sm"
                  >
                    {isSubmittingProjMember ? "Adding..." : "Add to Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
