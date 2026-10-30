"use client";

import React from "react";
import { AuthGuard } from "@/components/common/AuthGuard";
import { UnifiedIssuesView } from "@/components/workspace/UnifiedIssuesView";

/*
 * ActiveIssuesPage Component
 * High performance Active issues view matching Linear standard.
 * Reuses the single-source-of-truth UnifiedIssuesView with cached instant load.
 */
export default function ActiveIssuesPage() {
  return (
    <AuthGuard>
      <UnifiedIssuesView level="workspace" initialTab="active" />
    </AuthGuard>
  );
}
