"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { api } from "@/lib/api";
import { Project } from "@/types/project";

export default function RoadmapsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | "backlog" | "active" | "closed">("active");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      const list = res?.data || res || [];
      setProjects(Array.isArray(list) ? list : []);
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
    const handleCreated = () => fetchProjects();
    window.addEventListener("project-created", handleCreated);
    return () => window.removeEventListener("project-created", handleCreated);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0f15]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0e0f15]">
        <RoadmapTimeline
          projects={projects}
          filter={filter}
          setFilter={setFilter}
          title="All projects"
          breadcrumb="Roadmaps"
          showBreadcrumbPrefix={false}
        />
      </main>
    </div>
  );
}
