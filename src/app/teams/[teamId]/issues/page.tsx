"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { UnifiedIssuesView } from "@/components/workspace/UnifiedIssuesView";

/*
 * TeamIssuesContent
 * Renders the unified issues screen scoped strictly to this specific team.
 */
function TeamIssuesContent() {
  const params = useParams();
  const teamId = params?.teamId as string;

  return (
    <AuthGuard>
      <UnifiedIssuesView level="team" teamId={teamId} />
    </AuthGuard>
  );
}

/*
 * Dynamic Team Issues Page exported with a Suspense boundary.
 * In Next.js 16 with Partial Prerendering / Cache Components enabled, wrapping
 * Client Components that consume useParams() in Suspense allows Next.js to prerender
 * an instant shell without triggering prerender dynamic-access errors.
 */
export default function TeamIssuesPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#08090a]" />}>
      <TeamIssuesContent />
    </Suspense>
  );
}
