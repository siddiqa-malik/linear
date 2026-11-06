"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { api } from "@/lib/api";
import { Loader2, Plus, ChevronLeft, AlertCircle } from "lucide-react";

/*
 * Helper to compute clean 2-letter uppercase initials
 * e.g. "Siddiqa Malik" -> "SM"
 */
function getInitials(name?: string): string {
  if (!name) return "TF";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface WorkspaceInvitePayload {
  workspace: {
    id: string;
    name: string;
    slug?: string;
    companySize?: string;
    memberCount?: number;
  };
  invitation: {
    email: string;
    role?: string;
    status?: string;
    expiresAt?: string;
  };
  inviter?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  owner?: {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

function InvitationAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const teamParam = searchParams.get("team");

  const { user, isAuthenticated, logout } = useAuth();
  const { fetchWorkspaces, setCurrentWorkspace } = useWorkspace();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<WorkspaceInvitePayload | null>(null);

  // 1. Fetch Token Details
  useEffect(() => {
    let isMounted = true;

    async function loadTokenDetails() {
      if (!token) {
        setLoading(false);
        setError("No invitation token provided in the link.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/workspaces/invitations/${token}`);
        const data = res?.data || res;
        if (isMounted) {
          if (data?.workspace && data?.invitation) {
            setInviteData(data);
          } else {
            setError("Invitation not found or has expired.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          const msg = err?.data?.message || err?.message || "Invitation not found or has expired.";
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTokenDetails();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // 2. Action: Accept & Join (Scenario A - Logged-in email matches invitation email)
  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);

    try {
      const res = await api.post(`/workspaces/invitations/${token}/accept`);
      const joinedWs = res?.data || res?.workspace;
      const joinedWsId = joinedWs?._id || joinedWs?.id;

      // Store current workspace immediately in localStorage to guarantee active selection
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_invite_token");
        if (joinedWsId) {
          localStorage.setItem("taskflow_current_workspace_id", joinedWsId);
        }
      }

      // Refresh workspaces in context so new workspace is immediately available
      const allWorkspaces = await fetchWorkspaces();
      if (joinedWsId) {
        const found = allWorkspaces.find((w) => w._id === joinedWsId || w.slug === joinedWs?.slug);
        if (found) {
          setCurrentWorkspace(found);
        } else if (joinedWs) {
          setCurrentWorkspace(joinedWs);
        }
      }

      router.push("/issues/active");
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Failed to join workspace.");
      setAccepting(false);
    }
  };

  // 3. Action: Switch Accounts / Log in (Scenario B or Unauthenticated)
  const handleSwitchAccountLogin = () => {
    const targetEmail = inviteData?.invitation?.email || "";
    if (typeof window !== "undefined") {
      if (token) sessionStorage.setItem("pending_invite_token", token);
      if (targetEmail) sessionStorage.setItem("recent_auth_email", targetEmail);
    }

    if (isAuthenticated) {
      logout();
    }

    const q = new URLSearchParams();
    if (targetEmail) q.set("email", targetEmail);
    if (token) q.set("inviteToken", token);
    router.push(`/login?${q.toString()}`);
  };

  // 4. Action: Sign up with invited email
  const handleSwitchAccountSignup = () => {
    const targetEmail = inviteData?.invitation?.email || "";
    if (typeof window !== "undefined") {
      if (token) sessionStorage.setItem("pending_invite_token", token);
      if (targetEmail) sessionStorage.setItem("recent_auth_email", targetEmail);
    }

    if (isAuthenticated) {
      logout();
    }

    const q = new URLSearchParams();
    if (targetEmail) q.set("email", targetEmail);
    if (token) q.set("inviteToken", token);
    router.push(`/signup?${q.toString()}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#08090c] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
        <span className="text-xs text-[#8a8f98] mt-3">Validating invitation...</span>
      </div>
    );
  }

  // Error / Expired state
  if (error && !inviteData) {
    return (
      <div className="min-h-screen w-full bg-[#08090c] text-white flex flex-col items-center justify-center px-4 relative">
        <div className="w-full max-w-[380px] bg-[#161722] border border-white/[0.08] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-[18px] font-semibold text-white tracking-tight mb-2">
            Invitation Expired or Invalid
          </h1>
          <p className="text-[13px] text-[#8a8f98] leading-relaxed mb-6">
            {error}
          </p>
          <Link
            href={isAuthenticated ? "/issues/active" : "/login"}
            className="w-full h-10 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium flex items-center justify-center transition"
          >
            {isAuthenticated ? "Back to TaskFlow" : "Go to Login"}
          </Link>
        </div>
      </div>
    );
  }

  const workspaceName = inviteData?.workspace?.name || teamParam || "Workspace";
  const invitationEmail = (inviteData?.invitation?.email || "").toLowerCase().trim();
  const currentLoggedInEmail = (user?.email || "").toLowerCase().trim();
  const inviterDisplayName =
    inviteData?.inviter?.name ||
    inviteData?.owner?.name ||
    inviteData?.owner?.email?.split("@")[0] ||
    "A team member";

  const isEmailMatching = Boolean(
    isAuthenticated &&
    currentLoggedInEmail &&
    invitationEmail &&
    currentLoggedInEmail === invitationEmail
  );

  return (
    <div className="min-h-screen w-full bg-[#08090c] text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5e6ad2]/[0.05] blur-[140px] rounded-full pointer-events-none" />

      {/* Top Left Navigation: Back to TaskFlow */}
      <Link
        href={isAuthenticated ? "/issues/active" : "/"}
        className="absolute top-6 left-6 sm:left-8 text-xs text-[#8a8f98] hover:text-white flex items-center gap-1 transition z-20"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Back to TaskFlow</span>
      </Link>

      {/* Top Right User Indicator: Logged in as <email> */}
      {isAuthenticated && user?.email && (
        <div className="absolute top-6 right-6 sm:right-8 text-right z-20 leading-tight">
          <div className="text-[11px] text-[#8a8f98]">Logged in as</div>
          <div className="text-[12.5px] font-medium text-[#e2e4ef] break-all">{user.email}</div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENARIO A: Email MATCHES Invitation Email (Screenshot 1)      */}
      {/* ============================================================== */}
      {isEmailMatching ? (
        <div className="w-full max-w-[460px] flex flex-col items-center relative z-10 animate-in fade-in zoom-in-95 duration-200">
          <h1 className="text-[21px] sm:text-[23px] font-semibold text-white tracking-[-0.01em] mb-6 text-center">
            You have access to these workspaces
          </h1>

          {/* Workspaces Card */}
          <div className="w-full bg-[#12131d] border border-white/[0.08] rounded-xl p-3 sm:p-3.5 shadow-2xl">
            {/* Workspace Row */}
            <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.03] transition">
              <div className="flex items-center gap-3 min-w-0">
                {/* Blue Icon with Initials matching Screenshot 1 */}
                <div className="w-9 h-9 rounded-md bg-[#0284c7] text-white font-semibold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm uppercase tracking-wider">
                  {getInitials(workspaceName)}
                </div>

                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[13.5px] font-medium text-white tracking-tight truncate">
                    {workspaceName}
                  </span>
                  <span className="text-[11.5px] text-[#8a8f98] font-normal mt-0.5">
                    {inviteData?.workspace?.memberCount || 1} member
                    {(inviteData?.workspace?.memberCount || 1) > 1 ? "s" : ""}
                    {inviterDisplayName ? ` • Invited by ${inviterDisplayName}` : ""}
                  </span>
                </div>
              </div>

              {/* Join Button */}
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.2] text-white text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 ml-3"
              >
                {accepting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <span>Join</span>
                )}
              </button>
            </div>

            {/* Error message if accept failed */}
            {error && (
              <div className="mt-2 mx-2 p-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/[0.06] my-2 pt-2">
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#8a8f98] hover:text-white transition cursor-pointer text-left rounded-md hover:bg-white/[0.03]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create new workspace</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* SCENARIO B & C: Email MISMATCH OR Not Logged In (Screenshot 2) */
        /* ============================================================== */
        <div className="w-full max-w-[390px] bg-[#161722] border border-white/[0.08] rounded-2xl p-8 sm:p-9 shadow-2xl flex flex-col items-center text-center relative z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Blue Square Avatar with Initials matching Screenshot 2 */}
          <div className="w-12 h-12 rounded-lg bg-[#0284c7] text-white font-bold text-base flex items-center justify-center mb-5 shadow-sm uppercase tracking-wider">
            {getInitials(workspaceName)}
          </div>

          {/* Title: <Inviter> has invited you to <Workspace> */}
          <h1 className="text-[17px] sm:text-[18px] font-semibold text-white tracking-tight mb-2 leading-snug">
            {inviterDisplayName} has invited you to
            <br />
            {workspaceName}
          </h1>

          {/* Subtext: To accept the invitation please login as <email> */}
          <p className="text-[13px] text-[#8a8f98] leading-relaxed mb-6 font-normal max-w-[300px]">
            To accept the invitation please login as{" "}
            <span className="text-white font-medium break-all">
              {invitationEmail || "the invited email"}
            </span>
            .
          </p>

          {/* Error if present */}
          {error && (
            <div className="w-full mb-4 p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {/* Primary Action Button: Log in */}
          <button
            type="button"
            onClick={handleSwitchAccountLogin}
            className="w-full h-10 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] active:bg-[#525dc1] text-white text-[13.5px] font-medium transition cursor-pointer shadow-md shadow-[#5e6ad2]/20 flex items-center justify-center"
          >
            <span>Log in</span>
          </button>

          {/* Secondary Action: Sign up if new user */}
          <div className="mt-4 text-[12px] text-[#8a8f98]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchAccountSignup}
              className="text-[#7a85e8] hover:text-white font-medium transition cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvitationAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#08090c] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
        </div>
      }
    >
      <InvitationAcceptContent />
    </Suspense>
  );
}
