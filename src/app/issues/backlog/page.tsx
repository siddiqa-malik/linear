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
import { CircleDashed, Loader2 } from "lucide-react";

export default function BacklogPage() {
  const { activeIssueId, setActiveIssueId } = useUI();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBacklog = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/tasks");
      const all: Task[] = res?.data || res || [];
      setTasks(all.filter((t) => t.status === "todo"));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBacklog();
  }, []);

  return (
    <div className="flex h-screen bg-[#08090a] text-[#f7f8f8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-8 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CircleDashed className="w-4 h-4 text-[#8a8f98]" />
            <h1 className="text-[15px] font-semibold text-white tracking-wide">Backlog</h1>
            <span className="text-[11px] font-mono text-[#8a8f98] bg-white/[0.05] px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
        </div>

        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-[#8a8f98]">
              <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
              <span className="text-[13px]">Loading backlog...</span>
            </div>
          ) : (
            <IssueListView tasks={tasks} onTaskClick={(id) => setActiveIssueId(id)} />
          )}
        </main>
      </div>

      <IssueDrawer taskId={activeIssueId} onTaskUpdated={fetchBacklog} />
      <CreateIssueModal onCreated={fetchBacklog} />
      <CommandPalette />
    </div>
  );
}
