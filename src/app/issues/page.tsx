"use client";

import React from "react";
import { AuthGuard } from "@/components/common/AuthGuard";
import { UnifiedIssuesView } from "@/components/workspace/UnifiedIssuesView";

/*
 * WorkspaceIssuesPage
 * Global View: Renders the unified issues screen displaying all issues across the entire workspace.
 */
export default function WorkspaceIssuesPage() {
  return (
    <AuthGuard>
      <UnifiedIssuesView level="workspace" />
    </AuthGuard>
  );
}
