"use client";

import React, { useState, useRef, useEffect } from "react";
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
}

interface TeamMemberItem {
  name: string;
  email: string;
  initials: string;
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

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propertiesRowRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
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
      setError(null);
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

  const getInitials = (str: string) => {
    if (!str) return "DI";
    const parts = str.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const currentUserItem: TeamMemberItem = {
    name: userNameHandle,
    email: userEmail,
    initials: getInitials(userNameHandle),
  };

  // Team pool
  const candidateMembers: TeamMemberItem[] = [
    currentUserItem,
    { name: "Noman Tariq", email: "noman@linear.app", initials: "NT" },
    { name: "Design Lead", email: "lead@linear.app", initials: "DL" },
  ];

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
            {/* Team Badge & Breadcrumb */}
            <div className="flex items-center gap-2">
              <div className="h-6 px-2 rounded-[5px] bg-[#1f2133] border border-[#2e3149] flex items-center gap-1.5 text-[11px] font-semibold text-[#c5c8d6]">
                <svg
                  className="w-3.5 h-3.5 text-[#8a8f98]"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="2" y="4" width="9" height="9" rx="1.5" />
                  <path d="M5 2h8a1.5 1.5 0 0 1 1.5 1.5v8" strokeLinecap="round" />
                </svg>
                <span>{teamPrefix}</span>
              </div>

              <span className="text-[#55596e] text-[13px] font-normal leading-none">
                ›
              </span>

              <span className="text-[12.5px] text-[#8a8f98] font-normal">
                New project
              </span>
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
                  <div className="absolute left-0 top-8 z-50 w-56 rounded-lg border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    <p className="px-2 py-1 text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                      Assign Project Lead
                    </p>
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
                  <div className="absolute left-0 top-8 z-50 w-64 rounded-lg border border-[#2a2c3f] bg-[#161724] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100">
                    <p className="px-1 py-1 text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                      Add from team
                    </p>

                    {/* Team Members List */}
                    <div className="max-h-36 overflow-y-auto space-y-1 mb-2">
                      {candidateMembers.map((c) => {
                        const isSelected = selectedMembers.some(
                          (m) => m.email === c.email
                        );
                        return (
                          <button
                            key={c.email}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedMembers(
                                  selectedMembers.filter((m) => m.email !== c.email)
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
                            <div className="flex-1 truncate text-xs">{c.name}</div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Invite by Email */}
                    <div className="pt-2 border-t border-[#24263a]/60">
                      <p className="text-[10px] text-[#8a8f98] mb-1 px-1">
                        Add colleague by email:
                      </p>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="email"
                          placeholder="name@company.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="flex-1 h-7 px-2 rounded bg-[#10111a] border border-[#2a2c3f] text-xs text-white outline-none focus:border-[#5e6ad2]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newMemberEmail.trim()) {
                              const email = newMemberEmail.trim();
                              const name = email.split("@")[0];
                              const initials = name.slice(0, 2).toUpperCase();
                              setSelectedMembers([
                                ...selectedMembers,
                                { name, email, initials },
                              ]);
                              setNewMemberEmail("");
                            }
                          }}
                          className="h-7 px-2.5 rounded bg-[#5e6ad2] text-xs font-medium text-white hover:bg-[#6875e5] cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
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
