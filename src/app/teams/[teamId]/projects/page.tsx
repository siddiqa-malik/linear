"use client";

import React, { useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";

function TeamProjectsRedirectContent() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.teamId as string;

  useEffect(() => {
    if (teamId) {
      router.replace(`/projects?team=${teamId}`);
    } else {
      router.replace("/projects");
    }
  }, [teamId, router]);

  return <div className="h-screen bg-[#0e0f15]" />;
}

/*
 * Dynamic Team Projects Redirect exported with a Suspense boundary.
 * In Next.js 16 with Partial Prerendering / Cache Components enabled, wrapping
 * Client Components that consume useParams() in Suspense allows Next.js to prerender
 * an instant shell without triggering prerender dynamic-access errors.
 */
export default function TeamProjectsRedirect() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0e0f15]" />}>
      <TeamProjectsRedirectContent />
    </Suspense>
  );
}
