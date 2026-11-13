import { redirect } from "next/navigation";

/*
 * Catch-all /join/:token route matching Linear's alternative invite URL structure.
 * Transparently redirects to /invitations/accept?token=:token on the server.
 * Being a Server Component, it eliminates client useParams hydration boundaries.
 */
export default async function JoinRedirectPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (token) {
    redirect(`/invitations/accept?token=${encodeURIComponent(token)}`);
  }
  redirect("/login");
}
