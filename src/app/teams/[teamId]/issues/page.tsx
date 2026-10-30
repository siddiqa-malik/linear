"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { UnifiedIssuesView } from "@/components/workspace/UnifiedIssuesView";

/*
 * TeamIssuesPage
 * Renders the unified issues screen scoped strictly to this specific team.
 */
export default function TeamIssuesPage() {
  const params = useParams();
  const teamId = params?.teamId as string;

  return (
    <AuthGuard>
      <UnifiedIssuesView level="team" teamId={teamId} />
    </AuthGuard>
  );
}
