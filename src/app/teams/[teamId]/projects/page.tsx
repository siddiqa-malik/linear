"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TeamProjectsRedirect() {
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
