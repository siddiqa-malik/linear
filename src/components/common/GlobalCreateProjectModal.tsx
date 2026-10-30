"use client";

import React, { Suspense } from "react";
import { CreateProjectModal } from "./CreateProjectModal";
import { useUI } from "@/context/UIContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function GlobalCreateProjectModalContent() {
  const { createProjectModalOpen, setCreateProjectModalOpen } = useUI();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const teamFromQuery = searchParams?.get("team");
  const teamFromPath = pathname?.match(/\/teams\/([^/]+)/)?.[1];
  const defaultTeamId = teamFromQuery || teamFromPath || undefined;

  return (
    <CreateProjectModal
      isOpen={createProjectModalOpen}
      onClose={() => setCreateProjectModalOpen(false)}
      defaultTeamId={defaultTeamId}
      onCreated={() => {
        router.refresh();
      }}
    />
  );
}

export function GlobalCreateProjectModal() {
  return (
    <Suspense fallback={null}>
      <GlobalCreateProjectModalContent />
    </Suspense>
  );
}
