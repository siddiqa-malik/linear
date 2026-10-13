"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { IssueListView } from "@/components/workspace/IssueListView";
import { IssueDrawer } from "@/components/common/IssueDrawer";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import { PlayCircle, Loader2 } from "lucide-react";

export default function ActiveIssuesPage() {
  const { activeIssueId, setActiveIssueId } = useUI();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveIssues = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/tasks");
      const all: Task[] = res?.data || res || [];
      setTasks(all.filter((t) => t.status === "in-progress" || t.status === "todo"));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveIssues();
  }, []);

  return (
    <div className="flex h-screen bg-[#08090a] text-[#f7f8f8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-8 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <h1 className="text-[15px] font-semibold text-white tracking-wide">Active Issues</h1>
            <span className="text-[11px] font-mono text-[#8a8f98] bg-white/[0.05] px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
        </div>

        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-[#8a8f98]">
              <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
              <span className="text-[13px]">Loading active sprint...</span>
            </div>
          ) : (
            <IssueListView tasks={tasks} onTaskClick={(id) => setActiveIssueId(id)} />
          )}
        </main>
      </div>

      <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchActiveIssues} />
      <CreateIssueModal onCreated={fetchActiveIssues} />
      <CommandPalette />
    </div>
  );
}
