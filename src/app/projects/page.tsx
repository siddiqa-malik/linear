"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/workspace/Sidebar";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { Project } from "@/types/project";
import { FolderKanban, Plus, Calendar, ArrowRight, Layers } from "lucide-react";
import { formatFullDate } from "@/lib/utils";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"active" | "archived">("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res?.data || res || []);
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await api.post("/projects", {
        name: name.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
      setName("");
      setDescription("");
      setDueDate("");
      setIsModalOpen(false);
      fetchProjects();
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProjects = projects.filter((p) => p.status === filter);

  return (
    <div className="flex h-screen overflow-hidden bg-[#08090a]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-white/[0.08] bg-[#0c0d12]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <FolderKanban className="h-4 w-4 text-[#5e6ad2]" />
              <span>Projects</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-md bg-white/[0.04] p-0.5 text-xs text-[#8a8f98]">
              <button
                onClick={() => setFilter("active")}
                className={`rounded px-2.5 py-1 transition ${
                  filter === "active" ? "bg-white/10 text-white" : "hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("archived")}
                className={`rounded px-2.5 py-1 transition ${
                  filter === "archived" ? "bg-white/10 text-white" : "hover:text-white"
                }`}
              >
                Archived
              </button>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            className="rounded-full px-3.5"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="mx-auto max-w-5xl p-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p) => (
                <Link
                  key={p._id}
                  href={`/projects/${p._id}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0d0e14] p-5 shadow-lg shadow-black/40 transition hover:border-white/20 hover:bg-[#12131b]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1.5 font-medium text-white">
                        <span className="h-2 w-2 rounded-full bg-[#5e6ad2]" />
                        {p.name}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#62666d] transition-transform group-hover:translate-x-1 group-hover:text-white" />
                    </div>

                    <p className="line-clamp-2 text-xs leading-relaxed text-[#8a8f98]">
                      {p.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] text-[#62666d]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {p.dueDate ? formatFullDate(p.dueDate) : "No due date"}
                    </span>
                    <span className="capitalize">{p.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="No projects found"
              description="Create a project to start organizing tasks, managing cycles, and tracking team progress."
              actionLabel="Create first project"
              onAction={() => setIsModalOpen(true)}
            />
          )}
        </div>

        {/* Create Project Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Project"
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
                Project Name
              </label>
              <Input
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Linear Frontend Redesign"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the project goals..."
                className="w-full rounded-md border border-white/10 bg-[#0c0d12] p-2.5 text-xs text-white placeholder:text-[#62666d] outline-none focus:border-[#5e6ad2]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded border border-white/10 bg-[#0c0d12] px-2.5 py-1.5 text-xs text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isCreating}
              >
                Create Project
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}