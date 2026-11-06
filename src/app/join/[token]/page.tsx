"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/*
 * Catch-all /join/:token route matching Linear's alternative invite URL structure.
 * Transparently redirects to /invitations/accept?token=:token.
 */
export default function JoinRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  useEffect(() => {
    if (token) {
      router.replace(`/invitations/accept?token=${encodeURIComponent(token)}`);
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return null;
}

