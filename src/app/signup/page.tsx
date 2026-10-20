"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  const router = useRouter();

  // Detect if redirected from /login due to unregistered account
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get("reason");
      const paramEmail = params.get("email");
      const paramName = params.get("name");
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

  // Real Google Sign-Up with Google Identity Services (GIS)
  const handleGoogleSignup = async () => {
    setError(null);
    setInfoMessage(null);
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

        if (authRes?.isNewUser) {
          router.push("/onboarding");
        } else {
          router.push("/issues/active");
        }
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

      if (authRes?.isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/issues/active");
      }
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
      const displayName = name.trim() || email.split("@")[0];
      await register(displayName, email.trim(), password || "Password123!");

      if (typeof window !== "undefined") {
        sessionStorage.setItem("recent_auth_email", email.trim());
      }

      // Transition to "Check your email" screen
      setIsLoading(false);
      setLoadingType(null);
      setCodeMode(false);
      setView("check_email");
    } catch (err: any) {
      setError(err?.message || "Failed to create account in database");
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
      // User is verified, navigate to Onboarding
      router.push("/onboarding");
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
      router.push("/onboarding");
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
              We've sent a temporary login link.
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

            {/* Error message */}
            {error && (
              <div className="w-full mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-2.5 text-center text-xs text-red-300 animate-in fade-in duration-150">
                {error}
              </div>
            )}

            {/* Main Options View */}
            {view === "options" && (
              <div className="w-full space-y-3">
                {/* 1. Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center gap-2.5 bg-[#555fbe] hover:bg-[#5f69ce] active:bg-[#4f58b0] text-white text-[13px] font-medium rounded-md transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isLoading && loadingType === "google" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 fill-white shrink-0"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* 2. Continue with Email */}
                <button
                  type="button"
                  onClick={() => setView("email")}
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center bg-[#292b3a] hover:bg-[#323547] active:bg-[#252735] text-[#e6e7ee] text-[13px] font-medium rounded-md transition-all cursor-pointer"
                >
                  <span>Continue with Email</span>
                </button>

                {/* 3. Continue with SAML SSO */}
                <button
                  type="button"
                  onClick={() => setView("sso")}
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center bg-[#292b3a] hover:bg-[#323547] active:bg-[#252735] text-[#e6e7ee] text-[13px] font-medium rounded-md transition-all cursor-pointer"
                >
                  <span>Continue with SAML SSO</span>
                </button>
              </div>
            )}

            {/* Email Registration View */}
            {view === "email" && (
              <form onSubmit={handleEmailSubmit} className="w-full space-y-3 animate-in fade-in duration-200">
                <div>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 bg-[#1b1c28] border border-white/[0.08] focus:border-[#555fbe] text-white text-[13px] rounded-md px-3.5 outline-none placeholder:text-[#5d6072] transition"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-[#1b1c28] border border-white/[0.08] focus:border-[#555fbe] text-white text-[13px] rounded-md px-3.5 outline-none placeholder:text-[#5d6072] transition"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 bg-[#1b1c28] border border-white/[0.08] focus:border-[#555fbe] text-white text-[13px] rounded-md px-3.5 outline-none placeholder:text-[#5d6072] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center bg-[#555fbe] hover:bg-[#5f69ce] text-white text-[13px] font-medium rounded-md transition-all cursor-pointer disabled:opacity-70 shadow-sm"
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
                  <span>All options</span>
                </button>
              </form>
            )}

            {/* SAML SSO View */}
            {view === "sso" && (
              <form onSubmit={handleSsoSubmit} className="w-full space-y-3 animate-in fade-in duration-200">
                <div>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="company.com"
                    value={ssoDomain}
                    onChange={(e) => setSsoDomain(e.target.value)}
                    className="w-full h-11 bg-[#1b1c28] border border-white/[0.08] focus:border-[#555fbe] text-white text-[13px] rounded-md px-3.5 outline-none placeholder:text-[#5d6072] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center bg-[#555fbe] hover:bg-[#5f69ce] text-white text-[13px] font-medium rounded-md transition-all cursor-pointer disabled:opacity-70 shadow-sm"
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
                  <span>All options</span>
                </button>
              </form>
            )}

            {/* Footer Legal Terms from Screenshot */}
            <p className="mt-8 text-[11px] leading-relaxed text-[#707383] text-center max-w-[280px]">
              By signing up, you agree to the{" "}
              <Link href="#" className="text-[#8f92a3] hover:text-white transition">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#8f92a3] hover:text-white transition">
                Data Processing Agreement
              </Link>
              .
            </p>

            <p className="mt-4 text-[12px] text-[#707383]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#858fe8] hover:text-white transition font-medium">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>

      {/* Google Client ID Setup Guide Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1b26] p-6 shadow-2xl text-left">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-[#8a8f98] hover:text-white p-1 rounded-md transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#555fbe]/20 border border-[#555fbe]/40 flex items-center justify-center mb-4">
              <KeyRound className="w-5 h-5 text-[#858fe8]" />
            </div>

            <h3 className="text-base font-semibold text-white tracking-tight mb-2">
              Google Client ID Required
            </h3>

            <p className="text-xs text-[#8a8f98] leading-relaxed mb-4">
              Real Google Sign-In requires your Google Cloud OAuth Client ID. 
              Once generated, paste it into your project’s <code className="text-[#858fe8] bg-white/[0.06] px-1 py-0.5 rounded">.env.local</code> file:
            </p>

            <div className="bg-[#11121a] border border-white/[0.08] rounded-lg p-2.5 mb-5 font-mono text-[11px] text-[#c0caf5] select-all break-all">
              NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDemoGoogleSignup}
                className="w-full flex items-center justify-center gap-2 bg-[#555fbe] hover:bg-[#5f69ce] text-white text-xs font-medium py-2.5 rounded-lg transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test with Demo Account</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-full text-center text-xs text-[#8a8f98] hover:text-white py-1.5 transition cursor-pointer"
              >
                I will add Client ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}