"use client";

import React from "react";
import { AuthGuard } from "@/components/common/AuthGuard";
import { UnifiedIssuesView } from "@/components/workspace/UnifiedIssuesView";

/*
 * BacklogIssuesPage Component
 * High performance Backlog issues view matching Linear standard.
 * Reuses the single-source-of-truth UnifiedIssuesView with cached instant load.
 */
export default function BacklogIssuesPage() {
  return (
    <AuthGuard>
      <UnifiedIssuesView level="workspace" initialTab="backlog" />
    </AuthGuard>
  );
}
