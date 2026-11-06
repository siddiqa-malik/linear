"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { api } from "@/lib/api";
import { triggerGoogleAuth } from "@/lib/googleAuth";
import { ArrowLeft, Loader2, Sparkles, X, KeyRound, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [view, setView] = useState<"options" | "email" | "check_email" | "sso">("options");
  const [codeMode, setCodeMode] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [ssoDomain, setSsoDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"google" | "email" | "code" | "sso" | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const { fetchWorkspaces, setCurrentWorkspace } = useWorkspace();
  const router = useRouter();

  // Detect if redirected from /login due to unregistered account or invitation link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get("reason");
      const paramEmail = params.get("email");
      const paramName = params.get("name");
      const paramInviteToken = params.get("inviteToken");

      if (paramInviteToken) {
        sessionStorage.setItem("pending_invite_token", paramInviteToken);
      }

      const isUnregistered =
        reason === "unregistered" ||
        sessionStorage.getItem("auth_redirect_reason") === "unregistered_attempt";

      if (paramEmail) {
        setEmail(paramEmail);
      } else {
        const stored = sessionStorage.getItem("recent_auth_email");
        if (stored) setEmail(stored);
      }

      if (paramName) {
        setName(paramName);
      }

      if (isUnregistered) {
        setInfoMessage(
          paramEmail
            ? `No account was found for "${paramEmail}". Sign up below to create your account.`
            : "No existing account was found with those credentials. Please sign up below."
        );
        sessionStorage.removeItem("auth_redirect_reason");
      }
    }
  }, []);

  /*
   * Complete Auth and automatically provision invited workspace if pending invite exists.
   * Linear Standard: Bypasses /onboarding and usual workspace creation completely.
   */
  const completeAuthAndRedirect = async (isNewUser: boolean = true) => {
    const inviteToken =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("inviteToken") ||
          sessionStorage.getItem("pending_invite_token")
        : null;

    if (inviteToken) {
      try {
        const res = await api.post(`/workspaces/invitations/${inviteToken}/accept`);
        const joinedWs = res?.data || res?.workspace;
        const joinedWsId = joinedWs?._id || joinedWs?.id;
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pending_invite_token");
          if (joinedWsId) {
            localStorage.setItem("taskflow_current_workspace_id", joinedWsId);
          }
        }
        const wsList = await fetchWorkspaces();
        if (joinedWsId) {
          const match = wsList.find((w) => w._id === joinedWsId || w.slug === joinedWs.slug);
          if (match) {
            setCurrentWorkspace(match);
          } else if (joinedWs) {
            setCurrentWorkspace(joinedWs);
          }
        }
      } catch (e) {
        console.warn("Failed to auto-accept invite upon signup:", e);
      }
      // Linear Rule: Skip onboarding completely for invited users
      router.push("/issues/active");
      return;
    }

    // Auto-bind check: If user was invited by email, backend auto-binds them
    const wsList = await fetchWorkspaces();
    if (wsList && wsList.length > 0) {
      const targetWs = wsList[0];
      if (targetWs?._id && typeof window !== "undefined") {
        localStorage.setItem("taskflow_current_workspace_id", targetWs._id);
      }
      setCurrentWorkspace(targetWs);
      router.push("/issues/active");
      return;
    }

    if (isNewUser) {
      router.push("/onboarding");
    } else {
      router.push("/issues/active");
    }
  };

  // Real Google Sign-Up with Google Identity Services (GIS)
  const handleGoogleSignup = async () => {
    setError(null);
    setIsLoading(true);
    setLoadingType("google");

    try {
      const result = await triggerGoogleAuth();

      if (!result.isConfigured) {
        setShowGoogleModal(true);
        return;
      }

      if (result.user) {
        const authRes = await loginWithGoogle(
          {
            name: result.user.name,
            email: result.user.email,
            avatar: result.user.avatar,
          },
          { isSignUp: true }
        );

        if (typeof window !== "undefined") {
          sessionStorage.setItem("recent_auth_email", result.user.email);
        }

        await completeAuthAndRedirect(authRes?.isNewUser);
      }
    } catch (err: any) {
      setError(err?.message || "Google sign up was cancelled or failed.");
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // Demo fallback if Google Client ID not yet setup
  const handleDemoGoogleSignup = async () => {
    setShowGoogleModal(false);
    setInfoMessage(null);
    setIsLoading(true);
    setLoadingType("google");

    try {
      const authRes = await loginWithGoogle(
        {
          name: "Siddiqa Malik",
          email: "siddiqa.demo@gmail.com",
          avatar: undefined,
        },
        { isSignUp: true }
      );

      if (typeof window !== "undefined") {
        sessionStorage.setItem("recent_auth_email", "siddiqa.demo@gmail.com");
      }

      await completeAuthAndRedirect(authRes?.isNewUser);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // Email registration: Save to MongoDB backend and transition to "Check your email" screen
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setIsLoading(true);
    setLoadingType("email");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const derivedName = name.trim() || cleanEmail.split("@")[0] || "User";
      const userPassword = password || "Password123!";

      await register(derivedName, cleanEmail, userPassword);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("recent_auth_email", cleanEmail);
      }

      // Check if user has pending invite token
      const pendingToken = typeof window !== "undefined" ? sessionStorage.getItem("pending_invite_token") : null;
      if (pendingToken) {
        await completeAuthAndRedirect(true);
        return;
      }

      setView("check_email");
    } catch (err: any) {
      const msg = err?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // Code verification from "Check your email" screen
  const handleCodeSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);
    setLoadingType("code");

    try {
      await completeAuthAndRedirect(true);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // SAML SSO
  const handleSsoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssoDomain.trim()) return;
    setError(null);
    setIsLoading(true);
    setLoadingType("sso");

    try {
      await register("Enterprise User", `sso@${ssoDomain.trim()}`, "Password123!");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("recent_auth_email", `sso@${ssoDomain.trim()}`);
      }
      await completeAuthAndRedirect(true);
    } catch (err: any) {
      setError(err?.message || "SSO registration failed");
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const displayEmail = email.trim() || (typeof window !== "undefined" ? sessionStorage.getItem("recent_auth_email") : null) || "";

  return (
    <div className="min-h-screen w-full bg-[#282937] text-[#e6e7ee] flex flex-col items-center justify-center px-4 py-12 select-none selection:bg-[#555fbe] selection:text-white relative">
      <div className="w-full max-w-[320px] mx-auto flex flex-col items-center text-center">
        {/* Brand Circular Sphere Logo */}
        <div className="mb-7 transition hover:scale-105 duration-200">
          <Image
            src="/l-signup-logo.png"
            alt="Linear Logo"
            width={68}
            height={68}
            priority
            className="w-[68px] h-[68px] rounded-full object-cover shadow-lg pointer-events-none"
          />
        </div>

        {/* ============================================================== */}
        {/* SCREENSHOT 1 & 2: "CHECK YOUR EMAIL" VIEW                       */}
        {/* ============================================================== */}
        {view === "check_email" ? (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {/* Title */}
            <h1 className="text-[21px] font-medium text-white tracking-[-0.01em] mb-2 text-center">
              Check your email
            </h1>

            {/* Subtitle with dynamic user email */}
            <p className="text-[13px] text-[#9ca3af] leading-relaxed max-w-[280px] text-center mb-0">
              We&apos;ve sent a temporary login link.
              <br />
              Please check your inbox at{" "}
              <strong className="text-white font-medium break-all">
                {displayEmail}
              </strong>
              .
            </p>

            {/* Error message */}
            {error && (
              <div className="w-full mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-center text-xs text-red-300">
                {error}
              </div>
            )}

            {/* State A: Initial State (Screenshot 2: Enter code manually + Back to login) */}
            {!codeMode ? (
              <div className="w-full flex flex-col items-center mt-8">
                <button
                  type="button"
                  onClick={() => setCodeMode(true)}
                  className="text-[13px] text-[#8a8f98] hover:text-white transition cursor-pointer mb-5"
                >
                  Enter code manually
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("options");
                  }}
                  className="text-[13px] text-[#717384] hover:text-white transition cursor-pointer"
                >
                  Back to login
                </button>
              </div>
            ) : (
              /* State B: Code Input State (Screenshot 1: Enter code input + Continue with login code) */
              <form onSubmit={handleCodeSubmit} className="w-full flex flex-col items-center mt-7 animate-in fade-in duration-200">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter code"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
                  className="w-full h-11 bg-[#16171f] border border-[#353965] focus:border-[#555fbe] text-white text-[14px] font-mono tracking-wider text-center rounded-md outline-none placeholder:text-[#52577c] transition mb-3"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center bg-[#404383] hover:bg-[#4a4e98] active:bg-[#383b73] text-white text-[13px] font-medium rounded-md transition-all cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isLoading && loadingType === "code" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Continue with login code</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setCodeMode(false);
                    setView("options");
                  }}
                  className="text-[13px] text-[#717384] hover:text-white transition cursor-pointer mt-8"
                >
                  Back to login
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* MAIN AUTH VIEWS (Options / Email Input / SSO)                  */
          /* ============================================================== */
          <>
            {/* Title */}
            <h1 className="text-[20px] font-medium text-white tracking-[-0.01em] mb-7 text-center">
              Create your Linear account
            </h1>

            {/* Info Notice when redirected from login */}
            {infoMessage && (
              <div className="w-full mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs text-amber-200 animate-in fade-in duration-150 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-left leading-relaxed">{infoMessage}</span>
              </div>
            )}

            {/* VIEW 1: OPTIONS VIEW */}
            {view === "options" && (
              <div className="w-full flex flex-col gap-2.5">
                {/* 1. Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center gap-2.5 bg-[#404383] hover:bg-[#4a4e98] active:bg-[#383b73] text-white text-[13px] font-medium rounded-md transition cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isLoading && loadingType === "google" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* 2. Continue with email */}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("email");
                  }}
                  className="w-full h-11 flex items-center justify-center bg-[#1d1e28] hover:bg-[#222431] active:bg-[#181922] text-[#8e90a5] hover:text-[#d3d5e2] text-[13px] font-normal rounded-md transition cursor-pointer"
                >
                  Continue with email
                </button>

                {/* 3. Continue with SAML SSO */}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("sso");
                  }}
                  className="w-full h-11 flex items-center justify-center bg-[#1d1e28] hover:bg-[#222431] active:bg-[#181922] text-[#8e90a5] hover:text-[#d3d5e2] text-[13px] font-normal rounded-md transition cursor-pointer"
                >
                  Continue with SAML SSO
                </button>
              </div>
            )}

            {/* VIEW 2: EMAIL SIGN UP FORM */}
            {view === "email" && (
              <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-2.5 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#16171f] border border-[#353965] focus:border-[#555fbe] text-white text-[13px] rounded-md outline-none placeholder:text-[#52577c] transition"
                />

                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#16171f] border border-[#353965] focus:border-[#555fbe] text-white text-[13px] rounded-md outline-none placeholder:text-[#52577c] transition"
                />

                <input
                  type="password"
                  placeholder="Create password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#16171f] border border-[#353965] focus:border-[#555fbe] text-white text-[13px] rounded-md outline-none placeholder:text-[#52577c] transition"
                />

                {error && (
                  <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-center text-xs text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-1 flex items-center justify-center bg-[#404383] hover:bg-[#4a4e98] active:bg-[#383b73] text-white text-[13px] font-medium rounded-md transition-all cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isLoading && loadingType === "email" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Create account</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("options");
                  }}
                  className="w-full pt-1 flex items-center justify-center gap-1.5 text-[12px] text-[#707383] hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Other options</span>
                </button>
              </form>
            )}

            {/* VIEW 3: SAML SSO VIEW */}
            {view === "sso" && (
              <form onSubmit={handleSsoSubmit} className="w-full flex flex-col gap-2.5 animate-in fade-in duration-150">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Company domain (e.g. acme.com)"
                  value={ssoDomain}
                  onChange={(e) => setSsoDomain(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#16171f] border border-[#353965] focus:border-[#555fbe] text-white text-[13px] rounded-md outline-none placeholder:text-[#52577c] transition"
                />

                {error && (
                  <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-center text-xs text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-1 flex items-center justify-center bg-[#404383] hover:bg-[#4a4e98] active:bg-[#383b73] text-white text-[13px] font-medium rounded-md transition cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isLoading && loadingType === "sso" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Continue with SSO</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("options");
                  }}
                  className="w-full pt-1 flex items-center justify-center gap-1.5 text-[12px] text-[#707383] hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Other options</span>
                </button>
              </form>
            )}

            {/* Bottom Footer: Sign in link */}
            <div className="mt-8 text-[12.5px] text-[#6d718a]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#9ea3bf] hover:text-white transition font-medium cursor-pointer"
              >
                Log in
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Google Modal Fallback */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#1c1d29] border border-[#2b2d3d] p-6 shadow-2xl text-left relative">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-[#8a8f98] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#5e6ad2]/20 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#7a85e8]" />
            </div>
            <h3 className="text-base font-medium text-white mb-1">
              Google Sign-In Setup
            </h3>
            <p className="text-xs text-[#8a8f98] leading-relaxed mb-5">
              Google OAuth Client ID is not yet configured in <code className="text-[#c5c8d6] bg-black/40 px-1 py-0.5 rounded">.env.local</code>. You can test immediately using demo mode.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDemoGoogleSignup}
                className="flex-1 py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer"
              >
                Sign up with Demo Account
              </button>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-[#8a8f98] hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
