"use client";

import React, { Suspense } from "react";
import { CreateIssueModal } from "./CreateIssueModal";
import { useUI } from "@/context/UIContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function GlobalCreateIssueModalContent() {
  const { createModalOpen, setCreateModalOpen } = useUI();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const teamFromQuery = searchParams?.get("team");
  const teamFromPath = pathname?.match(/\/teams\/([^/]+)/)?.[1];
  const defaultTeamId = teamFromQuery || teamFromPath || undefined;

  const projectFromQuery = searchParams?.get("project");
  const projectFromPath = pathname?.match(/\/projects\/([^/]+)/)?.[1];
  const defaultProjectId = projectFromQuery || projectFromPath || undefined;
  const isBacklogPage = pathname?.includes("/backlog");
  const defaultStatus = isBacklogPage ? "backlog" : "todo";

  return (
    <CreateIssueModal
      isOpen={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      defaultTeamId={defaultTeamId}
      defaultProjectId={defaultProjectId}
      defaultStatus={defaultStatus}
      onCreated={() => {
        // Modal itself already dispatches taskflow:task-created with payload
      }}
    />
  );
}

export function GlobalCreateIssueModal() {
  return (
    <Suspense fallback={null}>
      <GlobalCreateIssueModalContent />
    </Suspense>
  );
}
