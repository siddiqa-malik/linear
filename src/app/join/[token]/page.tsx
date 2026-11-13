import React, { Suspense } from "react";
import { redirect } from "next/navigation";

/*
 * Disable instant navigation validation requirement during Next.js 16 prerendering
 * because this route performs a dynamic server-side redirect based on the runtime token param.
 */
export const instant = false;

/*
 * Asynchronously extracts the invite token parameter and transparently
 * redirects to /invitations/accept?token=:token on the server.
 * Executing inside Suspense allows Next.js 16 to stream the resolution of dynamic
 * URL parameters without blocking the static App Shell prerendering.
 */
async function JoinRedirectContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (token) {
    redirect(`/invitations/accept?token=${encodeURIComponent(token)}`);
  }
  redirect("/login");
  return null;
}

/*
 * Catch-all /join/:token route matching Linear's alternative invite URL structure.
 * Being wrapped in Suspense with instant=false satisfies Next.js 16 Cache Components rules.
 */
export default function JoinRedirectPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <JoinRedirectContent params={params} />
    </Suspense>
  );
}
