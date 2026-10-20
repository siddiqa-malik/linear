"use client";

import React, { useState, useRef, useEffect } from "react";
import { Project } from "@/types/project";
import { api } from "@/lib/api";
import {
  Calendar,
  Users,
  AtSign,
  Flag,
  Trash2,
  ChevronRight,
  Check,
  Signal,
  Loader2,
} from "lucide-react";
import { ProjectStatusIcon } from "@/components/common/ProjectStatusIcon";
import { ProjectPriorityIcon } from "@/components/common/ProjectPriorityIcon";

interface ProjectActionMenuProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export function ProjectActionMenu({
  project,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}: ProjectActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const [activeSubmenu, setActiveSubmenu] = useState<
    "status" | "priority" | "lead" | "members" | "startDate" | "targetDate" | "dependencies" | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  if (!isOpen) return null;

  // Format date helper
  const formatShortDate = (d?: string) => {
    if (!d) return "";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  // Helper for 2-letter initials
  const getInitials = (str: string) => {
    if (!str) return "LD";
    const parts = str.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  // Get lead info
  const leadInfo = (() => {
    if (project.lead) {
      if (typeof project.lead === "object") {
        const name = project.lead.name || project.lead.email || "Lead";
        const initials = project.lead.initials || getInitials(name);
        return { name, initials };
      }
      return { name: project.lead, initials: getInitials(project.lead) };
    }
    if (project.ownerId && typeof project.ownerId === "object") {
      const name = project.ownerId.name || project.ownerId.email || "Lead";
      return { name, initials: getInitials(name) };
    }
    return { name: "Project Lead", initials: "NT" };
  })();

  // Status update
  const handleUpdateStatus = async (statusKey: string) => {
    try {
      await api.patch(`/projects/${project._id}`, {
        status: statusKey === "canceled" ? "archived" : "active",
        projectStatus: statusKey,
      });
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`taskflow_proj_meta_${project._id}`);
          const meta = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            `taskflow_proj_meta_${project._id}`,
            JSON.stringify({ ...meta, projectStatus: statusKey })
          );
        } catch {}
      }
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Priority update
  const handleUpdatePriority = async (priorityKey: string) => {
    try {
      await api.patch(`/projects/${project._id}`, { priority: priorityKey });
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`taskflow_proj_meta_${project._id}`);
          const meta = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            `taskflow_proj_meta_${project._id}`,
            JSON.stringify({ ...meta, priority: priorityKey })
          );
        } catch {}
      }
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  // Date update
  const handleUpdateDate = async (type: "startDate" | "dueDate", val: string) => {
    try {
      await api.patch(`/projects/${project._id}`, { [type]: val || null });
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`taskflow_proj_meta_${project._id}`);
          const meta = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            `taskflow_proj_meta_${project._id}`,
            JSON.stringify({ ...meta, [type]: val || null })
          );
        } catch {}
      }
      onUpdated();
      setActiveSubmenu(null);
    } catch (err) {
      console.error("Failed to update date:", err);
    }
  };

  // Delete project
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${project._id}`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("project-created"));
      }
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 w-64 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 text-[#c5c8d6] shadow-[0_12px_40px_rgba(0,0,0,0.7)] select-none animate-in fade-in zoom-in-95 duration-100 font-sans text-xs"
    >
      {showDeleteConfirm ? (
        /* Delete Confirmation Dialog inside Dropdown */
        <div className="p-3 space-y-2.5">
          <p className="text-[12px] font-medium text-white">
            Delete "{project.name}"?
          </p>
          <p className="text-[11px] text-[#8a8f98] leading-relaxed">
            This will permanently remove this project and all its associated tasks.
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
          {/* SECTION 1: Status & Priority                                  */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "status" ? null : "status")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <ProjectStatusIcon status={project.projectStatus || project.status || "planned"} className="w-3.5 h-3.5" />
                <span>Status</span>
              </div>
              <div className="flex items-center gap-2 text-[#707383]">
                <span className="font-mono text-[10px]">P then S</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Submenu for Status with matching Linear icons */}
            {activeSubmenu === "status" && (
              <div className="absolute right-full top-0 mr-1.5 w-48 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { key: "backlog", label: "Backlog" },
                  { key: "planned", label: "Planned" },
                  { key: "in_progress", label: "In progress" },
                  { key: "completed", label: "Completed" },
                  { key: "canceled", label: "Canceled" },
                ].map(({ key, label }) => {
                  const currentStatus = project.projectStatus || project.status || "planned";
                  const isSelected = currentStatus === key || (key === "canceled" && currentStatus === "archived");
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleUpdateStatus(key)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <ProjectStatusIcon status={key} className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "priority" ? null : "priority")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <ProjectPriorityIcon priority={project.priority || "none"} className="w-3.5 h-3.5" />
                <span>Priority</span>
              </div>
              <div className="flex items-center gap-2 text-[#707383]">
                <span className="font-mono text-[10px]">P then P</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Submenu for Priority matching Linear */}
            {activeSubmenu === "priority" && (
              <div className="absolute right-full top-0 mr-1.5 w-44 rounded-xl border border-[#2a2c3f] bg-[#161724] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { key: "none", label: "No priority" },
                  { key: "urgent", label: "Urgent" },
                  { key: "high", label: "High" },
                  { key: "medium", label: "Medium" },
                  { key: "low", label: "Low" },
                ].map(({ key, label }) => {
                  const currentPriority = project.priority || "none";
                  const isSelected = currentPriority === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleUpdatePriority(key)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <ProjectPriorityIcon priority={key} className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-[#24263a]" />

          {/* ============================================================== */}
          {/* SECTION 2: Project lead & Members                              */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "lead" ? null : "lead")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <AtSign className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Project lead</span>
              </div>
              <div className="flex items-center gap-2 text-[#707383]">
                <span className="font-mono text-[10px]">P then L</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Submenu for Project Lead */}
            {activeSubmenu === "lead" && (
              <div className="absolute right-full top-0 mr-1.5 w-52 rounded-xl border border-[#2a2c3f] bg-[#161724] p-2 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                <p className="px-2 py-1 text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                  Project lead
                </p>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white/[0.04] text-white">
                  <div className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-semibold">
                    {leadInfo.initials}
                  </div>
                  <span className="text-xs truncate font-medium">{leadInfo.name}</span>
                  <Check className="w-3.5 h-3.5 text-[#5e6ad2] ml-auto shrink-0" />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "members" ? null : "members")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Members</span>
              </div>
              <div className="flex items-center gap-2 text-[#707383]">
                <span className="font-mono text-[10px]">P then M</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Submenu for Members */}
            {activeSubmenu === "members" && (
              <div className="absolute right-full top-0 mr-1.5 w-56 rounded-xl border border-[#2a2c3f] bg-[#161724] p-2 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                <p className="px-2 py-1 text-[10px] font-semibold text-[#8a8f98] uppercase tracking-wider">
                  Project members ({project.members?.length || 1})
                </p>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white/[0.04] text-white">
                  <div className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-semibold">
                    {leadInfo.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate font-medium">{leadInfo.name}</p>
                    <p className="text-[10px] text-[#707383]">Owner & Lead</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-[#24263a]" />

          {/* ============================================================== */}
          {/* SECTION 3: Start date..., Target date..., Dependencies        */}
          {/* ============================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "startDate" ? null : "startDate")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Start date...</span>
                {project.startDate && (
                  <span className="text-[#8a8f98] text-[11px]">
                    {formatShortDate(project.startDate)}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-[#707383]">Ctrl Alt S</span>
            </button>

            {/* Date input popover */}
            {activeSubmenu === "startDate" && (
              <div className="absolute right-full top-0 mr-1.5 w-48 rounded-xl border border-[#2a2c3f] bg-[#161724] p-3 shadow-2xl shadow-black z-50">
                <p className="text-[11px] font-semibold text-[#8a8f98] mb-1.5">
                  Set start date:
                </p>
                <input
                  type="date"
                  defaultValue={project.startDate ? project.startDate.split("T")[0] : ""}
                  onChange={(e) => handleUpdateDate("startDate", e.target.value)}
                  className="w-full h-8 px-2 rounded bg-[#10111a] border border-[#2a2c3f] text-white text-xs outline-none focus:border-[#5e6ad2]"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "targetDate" ? null : "targetDate")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Target date...</span>
                {project.dueDate && (
                  <span className="text-[#8a8f98] text-[11px]">
                    {formatShortDate(project.dueDate)}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-[#707383]">Ctrl Alt D</span>
            </button>

            {/* Target Date input popover */}
            {activeSubmenu === "targetDate" && (
              <div className="absolute right-full top-0 mr-1.5 w-48 rounded-xl border border-[#2a2c3f] bg-[#161724] p-3 shadow-2xl shadow-black z-50">
                <p className="text-[11px] font-semibold text-[#8a8f98] mb-1.5">
                  Set target date:
                </p>
                <input
                  type="date"
                  defaultValue={project.dueDate ? project.dueDate.split("T")[0] : ""}
                  onChange={(e) => handleUpdateDate("dueDate", e.target.value)}
                  className="w-full h-8 px-2 rounded bg-[#10111a] border border-[#2a2c3f] text-white text-xs outline-none focus:border-[#5e6ad2]"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveSubmenu(activeSubmenu === "dependencies" ? null : "dependencies")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2">
                <Flag className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                <span>Dependencies</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#707383]" />
            </button>

            {/* Submenu for Dependencies */}
            {activeSubmenu === "dependencies" && (
              <div className="absolute right-full top-0 mr-1.5 w-52 rounded-xl border border-[#2a2c3f] bg-[#161724] p-3 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[11px] font-semibold text-[#8a8f98] mb-1">
                  Dependencies
                </p>
                <p className="text-[11px] text-[#707383] leading-relaxed">
                  No blocking or blocked dependencies set for this project.
                </p>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 4 (Subscribe, Favorite, Copy) WAS OMITTED AS ORDERED  */}
          {/* ============================================================== */}

          {/* Divider */}
          <div className="my-1 border-t border-[#24263a]" />

          {/* ============================================================== */}
          {/* SECTION 5: Delete...                                           */}
          {/* ============================================================== */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete...</span>
          </button>
        </>
      )}
    </div>
  );
}
