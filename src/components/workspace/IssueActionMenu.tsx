"use client";

import React, { useState, useRef, useEffect } from "react";
import { Task } from "@/types/task";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  ChevronRight,
  Check,
  User,
  Trash2,
  Copy,
  Link2,
  Loader2,
  Box,
  FolderMinus,
} from "lucide-react";

interface IssueActionMenuProps {
  issue: Task;
  projects?: any[];
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

// Linear Status Icons
function StatusDotIcon({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "backlog") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="#707383" strokeWidth="1.5" strokeDasharray="2.2 2" className="w-3.5 h-3.5">
        <circle cx="8" cy="8" r="6" />
      </svg>
    );
  }
  if (s === "todo" || s === "unstarted") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="#8a8f98" strokeWidth="1.5" className="w-3.5 h-3.5">
        <circle cx="8" cy="8" r="6" />
      </svg>
    );
  }
  if (s === "in-progress" || s === "started" || s === "in_progress") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="#eab308" strokeWidth="1.5" className="w-3.5 h-3.5">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 2A6 6 0 0 1 8 14Z" fill="#eab308" />
      </svg>
    );
  }
  if (s === "completed" || s === "done") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="#5e6ad2" strokeWidth="1.5" className="w-3.5 h-3.5">
        <circle cx="8" cy="8" r="6" fill="#5e6ad2" />
        <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (s === "canceled" || s === "cancelled") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="#707383" strokeWidth="1.5" className="w-3.5 h-3.5">
        <circle cx="8" cy="8" r="6" />
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#707383" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />;
}

// Linear Priority Icon
function PriorityIcon({ priority }: { priority?: string }) {
  const p = (priority || "").toLowerCase();
  if (p === "urgent") {
    return (
      <div className="w-3.5 h-3.5 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px]">
        !
      </div>
    );
  }
  if (p === "high") {
    return (
      <svg viewBox="0 0 14 14" fill="#f97316" className="w-3.5 h-3.5">
        <rect x="2" y="8.5" width="2" height="4" rx="0.5" />
        <rect x="6" y="5.5" width="2" height="7" rx="0.5" />
        <rect x="10" y="2.5" width="2" height="10" rx="0.5" />
      </svg>
    );
  }
  if (p === "medium") {
    return (
      <svg viewBox="0 0 14 14" fill="#eab308" className="w-3.5 h-3.5">
        <rect x="2" y="8.5" width="2" height="4" rx="0.5" />
        <rect x="6" y="5.5" width="2" height="7" rx="0.5" />
        <rect x="10" y="2.5" width="2" height="10" rx="0.5" opacity="0.3" />
      </svg>
    );
  }
  if (p === "low") {
    return (
      <svg viewBox="0 0 14 14" fill="#38bdf8" className="w-3.5 h-3.5">
        <rect x="2" y="8.5" width="2" height="4" rx="0.5" />
        <rect x="6" y="5.5" width="2" height="7" rx="0.5" opacity="0.3" />
        <rect x="10" y="2.5" width="2" height="10" rx="0.5" opacity="0.3" />
      </svg>
    );
  }
  return <span className="text-[11px] text-[#707383] font-mono leading-none">---</span>;
}

/*
 * IssueActionMenu Component
 *
 * Linear-style 3-dots actions menu for issues:
 * Provides instant quick settings for Status, Priority, Assignee, Project,
 * Copying Identifier, and Deletion with confirmation dialog.
 */
export function IssueActionMenu({
  issue,
  projects = [],
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}: IssueActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentWorkspace } = useWorkspace();

  const [activeSubmenu, setActiveSubmenu] = useState<
    "status" | "priority" | "assignee" | "project" | null
  >(null);
  const [members, setMembers] = useState<any[]>([]);
  const [availableProjects, setAvailableProjects] = useState<any[]>(projects);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen, onClose]);

  // Fetch workspace members for assignee selection
  useEffect(() => {
    if (!isOpen) return;

    if (currentWorkspace?._id) {
      api
        .get(`/workspaces/${currentWorkspace._id}`)
        .then((res) => {
          const ws = res?.data || res;
          const list: any[] = [];
          if (ws?.ownerId && typeof ws.ownerId === "object") {
            list.push(ws.ownerId);
          }
          if (Array.isArray(ws?.members)) {
            ws.members.forEach((m: any) => {
              const u = typeof m.userId === "object" ? m.userId : null;
              if (u && !list.some((existing) => existing._id === u._id)) {
                list.push(u);
              }
            });
          }
          setMembers(list);
        })
        .catch(() => {});
    }

    if (availableProjects.length === 0) {
      api
        .get("/projects")
        .then((res) => {
          const list = res?.data || res || [];
          if (Array.isArray(list)) setAvailableProjects(list);
        })
        .catch(() => {});
    }
  }, [isOpen, currentWorkspace?._id, availableProjects.length]);

  if (!isOpen) return null;

  // Status mapping
  const handleUpdateStatus = async (statusKey: string) => {
    try {
      await api.patch(`/issues/${issue._id}`, { status: statusKey });
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error("Failed to update issue status:", err);
    }
  };

  // Priority mapping
  const handleUpdatePriority = async (priorityKey: string) => {
    try {
      await api.patch(`/issues/${issue._id}`, { priority: priorityKey });
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error("Failed to update issue priority:", err);
    }
  };

  // Assignee mapping
  const handleUpdateAssignee = async (userId: string | null) => {
    try {
      await api.patch(`/issues/${issue._id}`, { assignedTo: userId });
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error("Failed to update issue assignee:", err);
    }
  };

  // Project mapping (assign or standalone)
  const handleUpdateProject = async (projectId: string | null) => {
    try {
      await api.patch(`/issues/${issue._id}`, { projectId });
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error("Failed to update issue project:", err);
    }
  };

  // Copy identifier or link
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
      onClose();
    }, 800);
  };

  // Delete issue
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/issues/${issue._id}`);
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Failed to delete issue:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const currentIdentifier = (issue as any).identifier || (issue as any).key || "Issue";
  const currentStatus = (issue.status || "unstarted").toLowerCase();
  const currentPriority = (issue.priority || "none").toLowerCase();
  const currentProjectId = typeof issue.projectId === "object" ? (issue.projectId as any)?._id : issue.projectId;
  const currentAssigneeId = typeof issue.assignedTo === "object" ? (issue.assignedTo as any)?._id : issue.assignedTo;

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-7 z-50 w-60 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 text-[#c5c8d6] shadow-[0_16px_40px_rgba(0,0,0,0.8)] select-none animate-in fade-in zoom-in-95 duration-100 font-sans text-xs"
    >
      {showDeleteConfirm ? (
        /* Delete Confirmation Dialog inside Dropdown */
        <div className="p-3 space-y-2.5">
          <p className="text-[12px] font-medium text-white">
            Delete {currentIdentifier}?
          </p>
          <p className="text-[11px] text-[#8a8f98] leading-relaxed">
            This will permanently remove this issue and its comments.
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2.5 py-1 rounded text-[11px] text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              <span>Delete</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. STATUS SUBMENU                                              */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "status" ? null : "status")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <StatusDotIcon status={currentStatus} />
                <span>Status</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#707383]">
                <span className="font-mono text-[10px]">S</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {activeSubmenu === "status" && (
              <div className="absolute right-full top-0 mr-1.5 w-44 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { key: "backlog", label: "Backlog" },
                  { key: "unstarted", label: "Todo" },
                  { key: "started", label: "In Progress" },
                  { key: "completed", label: "Completed" },
                  { key: "canceled", label: "Canceled" },
                ].map(({ key, label }) => {
                  const isSelected =
                    currentStatus === key ||
                    (key === "unstarted" && currentStatus === "todo") ||
                    (key === "started" && (currentStatus === "in-progress" || currentStatus === "in_progress"));
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleUpdateStatus(key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <StatusDotIcon status={key} />
                        <span>{label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 2. PRIORITY SUBMENU                                            */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "priority" ? null : "priority")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <PriorityIcon priority={currentPriority} />
                <span>Priority</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#707383]">
                <span className="font-mono text-[10px]">P</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {activeSubmenu === "priority" && (
              <div className="absolute right-full top-0 mr-1.5 w-44 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { key: "none", label: "No priority" },
                  { key: "urgent", label: "Urgent" },
                  { key: "high", label: "High" },
                  { key: "medium", label: "Medium" },
                  { key: "low", label: "Low" },
                ].map(({ key, label }) => {
                  const isSelected = currentPriority === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleUpdatePriority(key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <PriorityIcon priority={key} />
                        <span>{label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 3. ASSIGNEE SUBMENU                                            */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "assignee" ? null : "assignee")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Assignee</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#707383]">
                <span className="font-mono text-[10px]">A</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {activeSubmenu === "assignee" && (
              <div className="absolute right-full top-0 mr-1.5 w-48 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleUpdateAssignee(null)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left text-[#8a8f98]"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Unassigned</span>
                  </div>
                  {!currentAssigneeId && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                </button>

                <div className="my-1 border-t border-[#24263a]" />

                {members.map((m) => {
                  const isSelected = currentAssigneeId && currentAssigneeId.toString() === m._id?.toString();
                  const displayName = m.name || m.email || "Member";
                  return (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() => handleUpdateAssignee(m._id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-4 h-4 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[8.5px] font-bold shrink-0">
                          {displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate">{displayName}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 4. PROJECT SUBMENU                                             */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "project" ? null : "project")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Project</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#707383]" />
            </button>

            {activeSubmenu === "project" && (
              <div className="absolute right-full top-0 mr-1.5 w-52 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleUpdateProject(null)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left text-[#8a8f98]"
                >
                  <div className="flex items-center gap-2">
                    <FolderMinus className="w-3.5 h-3.5" />
                    <span>No project (Standalone)</span>
                  </div>
                  {!currentProjectId && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                </button>

                <div className="my-1 border-t border-[#24263a]" />

                {availableProjects.map((p) => {
                  const isSelected = currentProjectId && currentProjectId.toString() === p._id?.toString();
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => handleUpdateProject(p._id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Box className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                        <span className="truncate">{p.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-[#24263a]" />

          {/* ============================================================== */}
          {/* 5. COPY ACTIONS                                                */}
          {/* ============================================================== */}
          <button
            type="button"
            onClick={() => handleCopy(currentIdentifier, "ID copied")}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Copy className="w-3.5 h-3.5 text-[#8a8f98]" />
              <span>Copy issue ID</span>
            </div>
            {copiedText === "ID copied" ? (
              <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
            ) : (
              <span className="text-[10px] text-[#707383] font-mono">{currentIdentifier}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              handleCopy(
                typeof window !== "undefined" ? `${window.location.origin}/issues?id=${issue._id}` : "",
                "Link copied"
              )
            }
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-[#8a8f98]" />
              <span>Copy link</span>
            </div>
            {copiedText === "Link copied" && (
              <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
            )}
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-[#24263a]" />

          {/* ============================================================== */}
          {/* 6. DELETE ACTION                                               */}
          {/* ============================================================== */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-[#8a8f98] hover:text-red-400 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete issue</span>
            </div>
            <span className="text-[10px] text-[#707383] font-mono">⌫</span>
          </button>
        </>
      )}
    </div>
  );
}

