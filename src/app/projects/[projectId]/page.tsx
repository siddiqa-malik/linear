"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopNavHeader } from "@/components/workspace/TopNavHeader";
import { FilterPillBar } from "@/components/workspace/FilterPillBar";
import { KanbanBoard } from "@/components/workspace/KanbanBoard";
import { IssueListView } from "@/components/workspace/IssueListView";
import { ProjectInspector } from "@/components/workspace/ProjectInspector";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import { Project } from "@/types/project";
import { Loader2 } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const { activeIssueId, setActiveIssueId, setCreateModalOpen } = useUI();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectAndTasks = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks?projectId=${projectId}`),
      ]);
      setProject(projRes?.data || projRes);
      setTasks(tasksRes?.data || tasksRes || []);
    } catch (err) {
      console.error("Failed to load project details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-[#08090a] text-[#f7f8f8] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-6">
          <TopNavHeader
            projectName={project?.name}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNewIssue={() => setCreateModalOpen(true)}
            isInspectorOpen={isInspectorOpen}
            setIsInspectorOpen={setIsInspectorOpen}
          />

          <FilterPillBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalCount={filteredTasks.length}
          />
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-[#8a8f98]">
                <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
                <span className="text-[13px]">Loading project workspace...</span>
              </div>
            ) : viewMode === "board" ? (
              <KanbanBoard
                tasks={filteredTasks}
                onTaskClick={(id) => setActiveIssueId(id)}
                onAddTask={() => setCreateModalOpen(true)}
              />
            ) : (
              <IssueListView
                tasks={filteredTasks}
                onTaskClick={(id) => setActiveIssueId(id)}
              />
            )}
          </main>

          <ProjectInspector
            project={project}
            tasks={tasks}
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
          />
        </div>
      </div>

      <IssueDrawer
        taskId={activeIssueId}
        onTaskUpdated={fetchProjectAndTasks}
      />
      <CreateIssueModal onCreated={fetchProjectAndTasks} defaultProjectId={projectId} />
      <CommandPalette />
    </div>
  );
}
