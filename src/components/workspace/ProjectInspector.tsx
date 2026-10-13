"use client";

import React from "react";
import { Project } from "@/types/project";
import { Task, UserSummary } from "@/types/task";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  User,
  Users,
  Clock,
  Layers,
  Activity,
  X,
  Target,
} from "lucide-react";

interface ProjectInspectorProps {
  project: Project | null;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectInspector({
  project,
  tasks,
  isOpen,
  onClose,
}: ProjectInspectorProps) {
  if (!isOpen || !project) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const owner: UserSummary | null =
    typeof project.ownerId === "object" && project.ownerId !== null
      ? (project.ownerId as UserSummary)
      : null;
  const ownerName = owner?.name || "Project Lead";

  return (
    <div className="w-[320px] min-w-[320px] border-l border-white/[0.08] bg-[#0b0c10] flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5e6ad2]" />
          <span className="text-[13px] font-semibold text-white tracking-wide">
            Project Properties
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-[15px] font-semibold text-white mb-1.5">{project.name}</h3>
          <p className="text-[12px] text-[#8a8f98] leading-relaxed">
            {project.description || "No project description provided."}
          </p>
        </div>

        <div className="bg-[#12141a] border border-white/[0.06] rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#8a8f98] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#5e6ad2]" />
              Progress
            </span>
            <span className="text-[12px] font-mono font-semibold text-white">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#8089e8] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#8a8f98]">
            <span>{completedTasks} completed</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#8a8f98] flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {project.status || "Active"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#8a8f98] flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Project Lead
            </span>
            <div className="flex items-center gap-1.5">
              <Avatar name={ownerName} size="sm" className="w-5 h-5 text-[10px]" />
              <span className="text-[#e2e4e9] font-medium text-[12px]">{ownerName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#8a8f98] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Start Date
            </span>
            <span className="text-[#e2e4e9] font-mono text-[11px]">
              {project.startDate ? formatDate(project.startDate) : "Not set"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#8a8f98] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Target Date
            </span>
            <span className="text-[#e2e4e9] font-mono text-[11px]">
              {project.dueDate ? formatDate(project.dueDate) : "Not set"}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-[#8a8f98] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Team Members
            </span>
            <span className="text-[11px] font-mono text-[#62666d]">
              {project.members?.length || 1}
            </span>
          </div>

          <div className="space-y-2">
            {project.members && project.members.length > 0 ? (
              project.members.map((m: any, idx: number) => {
                const memberUser = typeof m.userId === "object" ? m.userId : null;
                const mName = memberUser?.name || memberUser?.email || "Member";
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={mName} size="sm" className="w-5 h-5 text-[10px]" />
                      <span className="text-[12px] text-[#e2e4e9]">{mName}</span>
                    </div>
                    <span className="text-[10px] text-[#8a8f98] uppercase tracking-wider font-mono">
                      {m.role || "member"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <Avatar name={ownerName} size="sm" className="w-5 h-5 text-[10px]" />
                <span className="text-[12px] text-[#e2e4e9]">{ownerName} (Lead)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
