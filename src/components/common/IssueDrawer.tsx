"use client";

import React, { useEffect, useState } from "react";
import { Drawer } from "../ui/Drawer";
import { useUI } from "@/context/UIContext";
import { Task, Comment } from "@/types/task";
import { api } from "@/lib/api";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import { TaskPriority, TaskStatus } from "@/types/task";
import { Avatar } from "../ui/Avatar";
import { StatusIcon } from "./StatusIcon";
import { PriorityIcon } from "./PriorityIcon";
import { Button } from "../ui/Button";
import { X, Send, Trash2, Calendar, Tag, User } from "lucide-react";
import { formatFullDate } from "@/lib/utils";

export function IssueDrawer({
  taskId,
  onTaskUpdated,
}: {
  taskId: string | null;
  onTaskUpdated?: () => void;
}) {
  const { setActiveIssueId } = useUI();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      setComments([]);
      return;
    }

    setIsLoading(true);
    // Fetch task details and task comments
    Promise.all([
      api.get(`/tasks/${taskId}`).catch(() => null),
      api.get(`/tasks/${taskId}/comments`).catch(() => null),
    ])
      .then(([taskRes, commentsRes]) => {
        if (taskRes?.data || taskRes) {
          setTask(taskRes.data || taskRes);
        }
        if (commentsRes?.data || commentsRes) {
          setComments(commentsRes.data || commentsRes || []);
        }
      })
      .finally(() => setIsLoading(false));
  }, [taskId]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    setTask({ ...task, status: newStatus });
    await api.put(`/tasks/${task._id}`, { status: newStatus });
    onTaskUpdated?.();
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    if (!task) return;
    setTask({ ...task, priority: newPriority });
    await api.put(`/tasks/${task._id}`, { priority: newPriority });
    onTaskUpdated?.();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    setIsSendingComment(true);
    try {
      const res = await api.post(`/tasks/${task._id}/comments`, {
        content: newComment.trim(),
      });
      const created = res?.data || res;
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task || !confirm("Are you sure you want to delete this issue?")) return;
    await api.delete(`/tasks/${task._id}`);
    setActiveIssueId(null);
    onTaskUpdated?.();
  };

  return (
    <Drawer isOpen={!!taskId} onClose={() => setActiveIssueId(null)}>
      {task && (
        <div className="flex h-full flex-col">
          {/* Drawer Top Navigation Bar */}
          <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-6 text-xs text-[#8a8f98]">
            <div className="flex items-center gap-2 font-mono text-white/70">
              <span className="rounded bg-white/5 px-2 py-0.5 text-[11px]">
                TASK-{task._id.slice(-4).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteTask}
                title="Delete Issue"
                className="rounded p-1 text-[#62666d] hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveIssueId(null)}
                className="rounded p-1 text-[#8a8f98] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Drawer Split Layout: Left Content, Right Properties Rail */}
          <div className="grid flex-1 grid-cols-12 overflow-y-auto">
            {/* Left 75%: Issue Title, Description, Activity */}
            <div className="col-span-8 p-6 space-y-6 border-r border-white/[0.08]">
              {/* Title */}
              <h2 className="text-xl font-semibold tracking-tight text-white leading-snug">
                {task.title}
              </h2>

              {/* Description */}
              <div className="text-xs leading-relaxed text-[#8a8f98] whitespace-pre-wrap">
                {task.description || (
                  <span className="italic text-[#62666d]">No description provided</span>
                )}
              </div>

              {/* Activity & Comments Stream */}
              <div className="pt-6 border-t border-white/[0.08]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#62666d] mb-4">
                  Activity & Discussion
                </div>

                {/* Comment list */}
                <div className="space-y-3">
                  {comments.map((c) => {
                    const authorName =
                      typeof c.userId === "object" ? c.userId.name : "Member";
                    return (
                      <div
                        key={c._id}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar name={authorName} size="xs" />
                            <span className="font-semibold text-white">
                              {authorName}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#62666d]">
                            {formatFullDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-[#8a8f98]">{c.content}</p>
                      </div>
                    );
                  })}
                  {comments.length === 0 && (
                    <div className="text-xs text-[#62666d] italic">
                      No comments yet. Leave a note below.
                    </div>
                  )}
                </div>

                {/* Comment input box */}
                <form onSubmit={handleAddComment} className="mt-4">
                  <div className="relative rounded-lg border border-white/10 bg-[#0c0d12] p-2">
                    <textarea
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Leave a comment... (Markdown supported)"
                      className="w-full bg-transparent text-xs text-white placeholder:text-[#62666d] outline-none resize-none"
                    />
                    <div className="flex justify-end pt-1">
                      <Button
                        type="submit"
                        variant="primary"
                        size="xs"
                        isLoading={isSendingComment}
                        className="rounded px-2.5"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right 25%: Property Attributes Rail */}
            <div className="col-span-4 p-5 space-y-5 text-xs bg-[#0b0c10]">
              {/* Status */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#62666d] block mb-1.5">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="w-full rounded border border-white/10 bg-[#121319] px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#62666d] block mb-1.5">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    handlePriorityChange(e.target.value as TaskPriority)
                  }
                  className="w-full rounded border border-white/10 bg-[#121319] px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#62666d] block mb-1.5">
                  Assignee
                </label>
                <div className="flex items-center gap-2 rounded border border-white/10 bg-[#121319] px-2.5 py-1.5 text-xs text-white">
                  <User className="h-3.5 w-3.5 text-[#8a8f98]" />
                  <span>
                    {task.assignedTo && typeof task.assignedTo === "object"
                      ? task.assignedTo.name
                      : "Unassigned"}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#62666d] block mb-1.5">
                  Due Date
                </label>
                <div className="flex items-center gap-2 rounded border border-white/10 bg-[#121319] px-2.5 py-1.5 text-xs text-white">
                  <Calendar className="h-3.5 w-3.5 text-[#8a8f98]" />
                  <span>
                    {task.dueDate
                      ? formatFullDate(task.dueDate)
                      : "No due date"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}