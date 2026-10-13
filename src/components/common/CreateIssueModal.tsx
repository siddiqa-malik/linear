"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useUI } from "@/context/UIContext";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import { TaskPriority, TaskStatus } from "@/types/task";
import { api } from "@/lib/api";
import { StatusIcon } from "./StatusIcon";
import { PriorityIcon } from "./PriorityIcon";

export function CreateIssueModal({
  defaultProjectId,
  onCreated,
}: {
  defaultProjectId?: string;
  onCreated?: () => void;
}) {
  const { createModalOpen, setCreateModalOpen } = useUI();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!defaultProjectId) {
        // Fallback or create in first project
        const projectsRes = await api.get("/projects");
        const projects = projectsRes?.data || projectsRes || [];
        if (!projects.length) {
          throw new Error("Please create a project first before adding tasks.");
        }
        await api.post(`/projects/${projects[0]._id}/tasks`, {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          dueDate: dueDate || undefined,
        });
      } else {
        await api.post(`/projects/${defaultProjectId}/tasks`, {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          dueDate: dueDate || undefined,
        });
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setCreateModalOpen(false);
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || "Failed to create issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      title="Create New Issue"
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <div>
          <Input
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue title (e.g. Implement refresh token rotation)"
            className="text-sm font-medium py-2"
          />
        </div>

        <div>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description, notes, or acceptance criteria..."
            className="w-full rounded-md border border-white/10 bg-[#0c0d12] p-3 text-xs text-white placeholder:text-[#62666d] outline-none transition focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/40"
          />
        </div>

        {/* Property Selectors */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Status selector */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded border border-white/10 bg-[#0c0d12] px-2 py-1.5 text-xs text-white outline-none"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority selector */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded border border-white/10 bg-[#0c0d12] px-2 py-1.5 text-xs text-white outline-none"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded border border-white/10 bg-[#0c0d12] px-2 py-1.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
          <span className="text-[11px] text-[#62666d]">
            Press ⌘+Enter to submit
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Create issue
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}