"use client";

import React from "react";
import { CreateProjectModal } from "./CreateProjectModal";
import { useUI } from "@/context/UIContext";
import { useRouter } from "next/navigation";

export function GlobalCreateProjectModal() {
  const { createProjectModalOpen, setCreateProjectModalOpen } = useUI();
  const router = useRouter();

  return (
    <CreateProjectModal
      isOpen={createProjectModalOpen}
      onClose={() => setCreateProjectModalOpen(false)}
      onCreated={() => {
        router.refresh();
      }}
    />
  );
}
