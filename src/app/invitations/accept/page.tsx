"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Check, Loader2, AlertCircle, Users, ArrowRight } from "lucide-react";

function InvitationAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const teamParam = searchParams.get("team");

  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(teamParam || "Design agency");
  const [invitationEmail, setInvitationEmail] = useState<string | null>(null);

  // Fetch token details if token is provided
  useEffect(() => {
    if (token) {
      api
        .get(`/workspaces/invitations/${token}`)
        .then((res) => {
          if (res?.data?.data?.workspace?.name) {
            setWorkspaceName(res.data.data.workspace.name);
          }
          if (res?.data?.data?.invitation?.email) {
            setInvitationEmail(res.data.data.invitation.email);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch token details:", err);
          if (teamParam) setWorkspaceName(teamParam);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, teamParam]);

  const handleAccept = async () => {
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("post_login_redirect", window.location.href);
      }
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      if (token) {
        await api.post(`/workspaces/invitations/${token}/accept`);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/issues/active");
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to accept invitation");
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13141f] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5e6ad2]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-6 transition-transform hover:scale-105 duration-200">
          <Image
            src="/l-signup-logo.png"
            alt="TaskFlow Logo"
            width={56}
            height={56}
            priority
            className="w-14 h-14 rounded-full object-cover shadow-xl shadow-[#555fbe]/30 pointer-events-none"
          />
        </div>

        {/* Card */}
        <div className="w-full bg-[#1c1d2b] rounded-xl border border-[#2a2c3f] p-7 shadow-2xl text-center">
          <div className="w-10 h-10 rounded-full bg-[#5e6ad2]/15 text-[#5e6ad2] flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5" />
          </div>

          <h1 className="text-[20px] font-semibold text-white tracking-tight mb-2">
            You're invited to join
          </h1>
          <p className="text-[17px] font-medium text-[#7a85e8] mb-4">
            {workspaceName}
          </p>

          <p className="text-[13px] text-[#8a8f98] leading-relaxed mb-6 font-normal">
            Collaborate on issues, cycles, bug fixes, and projects with your team on TaskFlow.
          </p>

          {invitationEmail && (
            <div className="mb-5 px-3 py-2 rounded-md bg-[#161724] border border-[#27293d] text-[12px] text-[#8a8f98]">
              Invitation sent to: <span className="text-[#c5c8d6] font-medium">{invitationEmail}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-3 px-4 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[13px] flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Joined successfully! Redirecting...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting || loading}
              className="w-full h-10 rounded-md bg-[#555fbe] hover:bg-[#606bd4] active:bg-[#4b54ad] text-white text-[13px] font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {accepting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Joining workspace...</span>
                </>
              ) : isAuthenticated ? (
                <>
                  <span>Accept & Join Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <span>Sign in to accept invitation</span>
              )}
            </button>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-6 text-[12px] text-[#707383] text-center">
          Linear-style shared workspace environment • Secure invitation link
        </p>
      </div>
    </div>
  );
}

export default function InvitationAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#13141f] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#555fbe]" />
        </div>
      }
    >
      <InvitationAcceptContent />
    </Suspense>
  );
}
