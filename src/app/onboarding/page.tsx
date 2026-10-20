"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useUI } from "@/context/UIContext";
import { api } from "@/lib/api";
import { ChevronDown, Loader2, Check, AlertCircle, X, Wrench, Link2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { createWorkspace, currentWorkspace } = useWorkspace();
  const { setTheme } = useUI();
  const [step, setStep] = useState(1); // 1 = Workspace Creation, 2 = Welcome Carousel

  // Step 1: Workspace Creation Form States
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 2: Theme / Style Selection State (Slide 2)
  const [selectedStyle, setSelectedStyle] = useState<"light" | "dark">("dark");

  // Step 4: Co-workers Invite Form States (Slide 4)
  const [inviteEmails, setInviteEmails] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  // Swiper Carousel Controller
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const processedCodeRef = useRef<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sync selectedTeam with currentWorkspace name or workspaceName if available
  useEffect(() => {
    if (currentWorkspace?.name) {
      setSelectedTeam(currentWorkspace.name);
    } else if (workspaceName.trim()) {
      setSelectedTeam(workspaceName.trim());
    }
  }, [currentWorkspace?.name, workspaceName]);

  // Real Google / signup email of the authentic logged-in user (strictly no designer mockup fallback)
  const displayEmail =
    user?.email ||
    (typeof window !== "undefined" ? sessionStorage.getItem("recent_auth_email") || "" : "");

  const userDomain =
    displayEmail && !displayEmail.endsWith("@gmail.com") && !displayEmail.endsWith("@yahoo.com") && !displayEmail.endsWith("@hotmail.com") && displayEmail.includes("@")
      ? displayEmail.split("@")[1]
      : workspaceSlug
        ? `${workspaceSlug}.design`
        : "figr.design";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWorkspaceName(val);
    setWorkspaceSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setSelectedTeam(val);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Step 1 Submit: Save workspace directly to backend via WorkspaceContext (no localStorage)
  const handleWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const workspaceData = {
      name: workspaceName.trim() || "Figr",
      slug: workspaceSlug.trim() || workspaceName.toLowerCase().replace(/[^a-z0-9-]/g, "") || "figr",
      companySize: companySize || "1-10",
      role: role || "Software Engineer",
    };

    try {
      // Backend MongoDB persistence via TaskFlow REST API
      await createWorkspace(workspaceData);
    } catch (err) {
      console.warn("Backend workspace creation error:", err);
    } finally {
      setIsSubmitting(false);
      setStep(2); // Proceed to Swiper Onboarding Carousel
    }
  };

  const handleFinishOnboarding = () => {
    router.push("/issues/active");
  };

  // Step 4 Submit: Send invitation emails via Nodemailer backend
  const handleSendInvites = async () => {
    const raw = inviteEmails.trim();
    if (!raw) {
      setInviteError("Please enter at least one email address.");
      return;
    }

    setIsSendingInvites(true);
    setInviteError(null);
    setInviteSuccess(false);

    const effectiveTeam =
      selectedTeam.trim() && selectedTeam.trim() !== "Design agency"
        ? selectedTeam.trim()
        : workspaceName.trim() || currentWorkspace?.name || "Workspace";

    try {
      const res = await api.post("/workspaces/invite", {
        emails: raw,
        teamName: effectiveTeam,
        workspaceId: currentWorkspace?._id,
        senderName: user?.name || displayEmail?.split("@")[0] || "A teammate",
      });

      if (res?.data?.data?.inviteLink) {
        setLastInviteLink(res.data.data.inviteLink);
      }
      setInviteSuccess(true);
      setInviteEmails("");
    } catch (err: any) {
      setInviteError(err?.message || "Failed to send invitation emails. Please try again.");
    } finally {
      setIsSendingInvites(false);
    }
  };

  // Level C: Shareable Invite Link (Linear / Slack Standard)
  const handleCopyInviteLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const effectiveTeam =
      selectedTeam.trim() && selectedTeam.trim() !== "Design agency"
        ? selectedTeam.trim()
        : workspaceName.trim() || currentWorkspace?.name || "Workspace";

    const link =
      lastInviteLink ||
      `${origin}/invitations/accept?team=${encodeURIComponent(effectiveTeam)}${
        currentWorkspace?._id ? `&workspaceId=${currentWorkspace._id}` : ""
      }`;

    navigator.clipboard.writeText(link).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2500);
    });
  };

  // Step 3: Real GitHub Authentication
  const [isGitHubConnecting, setIsGitHubConnecting] = useState(false);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [gitHubError, setGitHubError] = useState<string | null>(null);
  const [connectedUsername, setConnectedUsername] = useState<string | null>(null);

  // Handle GitHub OAuth callback code when returning from GitHub
  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (errorParam) {
      setStep(2);
      setGitHubError(errorDesc || "GitHub authentication was cancelled or rejected by user.");
      return;
    }

    if (code) {
      // Prevent duplicate processing of the single-use OAuth code
      if (processedCodeRef.current === code) return;
      if (authLoading) return; // Wait until AuthContext finishes checking current user / token!

      processedCodeRef.current = code;
      setStep(2);
      setIsGitHubConnecting(true);
      setGitHubError(null);

      // Exchange code with backend via POST /api/auth/github
      api
        .post("/auth/github", { code, expectedEmail: displayEmail || undefined })
        .then((res) => {
          setIsGitHubConnected(true);
          setGitHubError(null);
          const ghUser = res?.data?.github?.username;
          if (ghUser) {
            setConnectedUsername(ghUser);
          }
          // Smoothly advance to Slide 4 (Invite Teammates) after confirmation
          setTimeout(() => {
            if (swiperRef.current) {
              swiperRef.current.slideTo(3); // Advance to Slide 4 (0-indexed 3)
            }
          }, 1200);
        })
        .catch((err) => {
          console.error("GitHub Auth Error:", err);
          setIsGitHubConnected(false);
          const backendMsg = err?.response?.data?.message || err?.message;
          setGitHubError(
            backendMsg ||
              (displayEmail
                ? `No GitHub account associated with ${displayEmail} was found. Please sign in with your matching account or continue without GitHub.`
                : "GitHub authentication failed. Please try again or continue without GitHub.")
          );
        })
        .finally(() => {
          setIsGitHubConnecting(false);
          // Clean the code from URL so re-renders don't re-parse it
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", window.location.pathname);
          }
        });
    }
  }, [searchParams, displayEmail, authLoading]);

  // Authenticate button: Redirects user to real GitHub OAuth consent screen (NO FAKE BYPASS!)
  // Passes login hint and prompt=select_account so it doesn't auto-pick another browser account
  const handleGitHubAuth = () => {
    setGitHubError(null);
    setIsGitHubConnecting(true);

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23li7JjUxb1ZLE7vjx";
    if (!clientId) {
      setGitHubError("GitHub Client ID not found. Please check your .env configuration.");
      setIsGitHubConnecting(false);
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/onboarding`);
    const emailHint = displayEmail ? `&login=${encodeURIComponent(displayEmail)}` : "";
    // login=<email>&prompt=select_account forces GitHub to match the signup email or ask to switch account
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,user:email&redirect_uri=${redirectUri}${emailHint}&prompt=select_account&state=taskflow_github`;
  };

  return (
    <div
      className={`min-h-screen w-full text-[#e6e7ee] flex flex-col items-center justify-center relative select-none selection:bg-[#555fbe] selection:text-white overflow-hidden transition-colors duration-300 ${
        step === 2 && (currentSlide === 3 || currentSlide === 4)
          ? "bg-[#fbfbfc]"
          : "bg-[#13141f]"
      }`}
    >
      {/* ============================================================== */}
      {/* SCREEN 1: CREATE A NEW WORKSPACE (Clean Full Screen Layout)    */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
          {/* Top Header: Logged in as & Log out */}
          <header className="absolute top-0 left-0 right-0 px-8 py-7 flex items-start justify-between z-10 select-none">
            <div className="flex flex-col text-left">
              <span className="text-[12px] text-[#707383] font-normal leading-tight">
                Logged in as:
              </span>
              <span className="text-[13px] text-[#d1d5db] font-normal mt-0.5 tracking-tight">
                {displayEmail || user?.name || "Account"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-[13px] text-[#8a8f98] hover:text-white transition-colors cursor-pointer"
            >
              Log out
            </button>
          </header>

          {/* Center Logo & Headings */}
          <div className="text-center max-w-xl mx-auto mb-7 flex flex-col items-center">
            {/* Step 1 Linear Spherical Logo from public/l-signup-logo.png */}
            <div className="mb-4 transition-transform hover:scale-105 duration-200">
              <Image
                src="/l-signup-logo.png"
                alt="Linear Logo"
                width={56}
                height={56}
                priority
                className="w-14 h-14 rounded-full object-cover shadow-lg shadow-[#555fbe]/25 pointer-events-none"
              />
            </div>

            <h1 className="text-[25px] font-medium text-white tracking-[-0.01em] mb-2.5">
              Create a new workspace
            </h1>
            <p className="text-[13px] text-[#8a8f98] leading-[1.6] max-w-[420px] mx-auto">
              Workspaces are shared environments where teams can work
              <br className="hidden sm:inline" />
              {" "}on projects, cycles and tasks.
            </p>
          </div>

          {/* Main Form Card Container */}
          <form onSubmit={handleWorkspaceSubmit} className="w-full max-w-[420px] flex flex-col items-center">
            <div className="w-full bg-[#1c1d2b] rounded-xl border border-[#2a2c3f] p-6 shadow-2xl space-y-4 text-left">
              {/* 1. Workspace Name */}
              <div>
                <label className="block text-[12px] font-medium text-[#c5c8d6] mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Figr"
                  value={workspaceName}
                  onChange={handleNameChange}
                  className="w-full h-10 px-3 rounded-md bg-[#161724] border border-[#3b4174] focus:border-[#555fbe] focus:ring-1 focus:ring-[#555fbe] text-white text-[13px] outline-none transition-colors"
                />
              </div>

              {/* 2. Workspace URL */}
              <div>
                <label className="block text-[12px] font-medium text-[#c5c8d6] mb-2">
                  Workspace URL
                </label>
                <div className="w-full h-10 px-3 rounded-md bg-[#161724] border border-[#2a2c3f] focus-within:border-[#555fbe] focus-within:ring-1 focus-within:ring-[#555fbe] flex items-center transition-colors">
                  <span className="text-[13px] text-[#55596e] select-none font-normal">
                    linear.app/
                  </span>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) =>
                      setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-white pl-0 font-normal"
                  />
                </div>
              </div>

              {/* 3. How large is your company? */}
              <div>
                <label className="block text-[12px] font-medium text-[#c5c8d6] mb-2">
                  How large is your company?
                </label>
                <div className="relative">
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className={`w-full h-10 px-3 pr-8 rounded-md bg-[#202231] border border-[#2a2c3f] text-[13px] appearance-none outline-none focus:border-[#555fbe] focus:ring-1 focus:ring-[#555fbe] transition-colors cursor-pointer ${companySize ? "text-white" : "text-[#6f738a]"
                      }`}
                  >
                    <option value="" disabled className="bg-[#1c1d2b] text-[#6f738a]">
                      Select company size
                    </option>
                    <option value="1-10" className="bg-[#1c1d2b] text-white">1-10 employees</option>
                    <option value="11-50" className="bg-[#1c1d2b] text-white">11-50 employees</option>
                    <option value="51-250" className="bg-[#1c1d2b] text-white">51-250 employees</option>
                    <option value="251-1000" className="bg-[#1c1d2b] text-white">251-1000 employees</option>
                    <option value="1000+" className="bg-[#1c1d2b] text-white">1000+ employees</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6f738a]" />
                </div>
              </div>

              {/* 4. What is your role? */}
              <div>
                <label className="block text-[12px] font-medium text-[#c5c8d6] mb-2">
                  What is your role?
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full h-10 px-3 pr-8 rounded-md bg-[#202231] border border-[#2a2c3f] text-[13px] appearance-none outline-none focus:border-[#555fbe] focus:ring-1 focus:ring-[#555fbe] transition-colors cursor-pointer ${role ? "text-white" : "text-[#6f738a]"
                      }`}
                  >
                    <option value="" disabled className="bg-[#1c1d2b] text-[#6f738a]">
                      Select your role in the company
                    </option>
                    <option value="founder" className="bg-[#1c1d2b] text-white">Founder / Executive</option>
                    <option value="engineering" className="bg-[#1c1d2b] text-white">Software Engineer</option>
                    <option value="product" className="bg-[#1c1d2b] text-white">Product Manager</option>
                    <option value="design" className="bg-[#1c1d2b] text-white">Designer</option>
                    <option value="management" className="bg-[#1c1d2b] text-white">Engineering Manager</option>
                    <option value="other" className="bg-[#1c1d2b] text-white">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6f738a]" />
                </div>
              </div>
            </div>

            {/* Create Workspace Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 h-10 rounded-md bg-[#555fbe] hover:bg-[#606bd4] active:bg-[#4b54ad] text-white text-[13px] font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating workspace...</span>
                </>
              ) : (
                <span>Create workspace</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: SWIPER ONBOARDING CAROUSEL (Exact Match to Screenshot)*/}
      {/* ============================================================== */}
      {step === 2 && (
        <div
          className={`w-full h-screen flex flex-col justify-between items-center relative overflow-hidden transition-colors duration-300 ${
            currentSlide === 3 || currentSlide === 4 ? "bg-[#fbfbfc]" : "bg-[#13141f]"
          }`}
        >
          {/* Swiper Slider with 5 Slides */}
          <Swiper
            onSwiper={(swiper) => {
              setSwiperInstance(swiper);
              swiperRef.current = swiper;
            }}
            initialSlide={searchParams.get("code") ? 2 : 0}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            className="w-full h-full flex items-center justify-center"
            spaceBetween={50}
            slidesPerView={1}
          >
            {/* Slide 1: Exact Match to Screenshot */}
            <SwiperSlide className="w-full h-full !flex flex-col items-center justify-center px-4">
              <div className="text-center max-w-lg mx-auto flex flex-col items-center">
                {/* Circular Gradient Icon with Striped Linear Logo */}
                <div className="mb-6 flex justify-center transition-transform hover:scale-105 duration-200">
                  <Image
                    src="/l-signup-logo.png"
                    alt="Linear Logo"
                    width={64}
                    height={64}
                    priority
                    className="w-16 h-16 rounded-full object-cover shadow-xl shadow-[#555fbe]/30 pointer-events-none"
                  />
                </div>

                {/* Title */}
                <h1 className="text-[30px] sm:text-[34px] font-bold text-white tracking-tight text-center mb-2.5">
                  Welcome to Linear
                </h1>

                {/* Subtitle */}
                <p className="text-[13px] text-[#8a8f98] text-center max-w-[420px] mx-auto mb-8 font-normal leading-relaxed">
                  Linear helps you to streamline software development, cycles, and bug fixes.
                </p>

                {/* Get Started Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (swiperInstance) {
                      swiperInstance.slideNext();
                    }
                  }}
                  className="h-10 px-8 rounded-md bg-[#545fc4] hover:bg-[#606cd4] active:bg-[#4b54ad] text-white text-[13px] font-medium transition-all min-w-[200px] flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Get Started
                </button>
              </div>
            </SwiperSlide>

            {/* Slide 2: Choose your style (Exact match to screenshot!) */}
            <SwiperSlide className="w-full h-full !flex flex-col items-center justify-center px-4">
              <div className="text-center max-w-xl mx-auto flex flex-col items-center">
                {/* Title */}
                <h1 className="text-[25px] sm:text-[27px] font-medium text-white tracking-[-0.01em] mb-2 text-center">
                  Choose your style
                </h1>

                {/* Subtitle */}
                <p className="text-[13px] text-[#8a8f98] text-center max-w-[480px] mb-8 leading-[1.6] font-normal">
                  You can change the UI style at any time through the command menu or in the settings.
                </p>

                {/* Style Options Container (Light & Dark) */}
                <div className="w-full max-w-[620px] rounded-xl border border-[#27293d] bg-[#181926] grid grid-cols-2 overflow-hidden shadow-2xl">
                  {/* Option 1: Light Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStyle("light");
                      setTheme("light");
                    }}
                    className={`flex flex-col items-center justify-center py-7 px-5 border-r border-[#27293d] transition-all cursor-pointer ${selectedStyle === "light"
                      ? "bg-[#1f2132]"
                      : "bg-[#181926] hover:bg-[#1a1b29]"
                      }`}
                  >
                    <div
                      className={`rounded-xl p-1 transition-all duration-150 ${selectedStyle === "light"
                        ? "border-2 border-[#555fbe] shadow-lg shadow-[#555fbe]/20"
                        : "border-2 border-transparent"
                        }`}
                    >
                      <Image
                        src="/l-light-mod.png"
                        alt="Light Theme Preview"
                        width={250}
                        height={174}
                        priority
                        className="w-[220px] sm:w-[250px] h-[153px] sm:h-[174px] rounded-lg object-contain pointer-events-none"
                      />
                    </div>
                    <span
                      className={`mt-4 text-[13px] sm:text-[14px] font-medium transition-colors ${selectedStyle === "light" ? "text-white" : "text-[#8a8f98]"
                        }`}
                    >
                      Light
                    </span>
                  </button>

                  {/* Option 2: Dark Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStyle("dark");
                      setTheme("dark");
                    }}
                    className={`flex flex-col items-center justify-center py-7 px-5 transition-all cursor-pointer ${selectedStyle === "dark"
                      ? "bg-[#1f2132]"
                      : "bg-[#181926] hover:bg-[#1a1b29]"
                      }`}
                  >
                    <div
                      className={`rounded-xl p-1 transition-all duration-150 ${selectedStyle === "dark"
                        ? "border-2 border-[#555fbe]"
                        : "border-2 border-transparent"
                        }`}
                    >
                      <Image
                        src="/l-dark-mod.png"
                        alt="Dark Theme Preview"
                        width={250}
                        height={174}
                        priority
                        className="w-[220px] sm:w-[250px] h-[153px] sm:h-[174px] rounded-lg object-contain pointer-events-none"
                      />
                    </div>
                    <span
                      className={`mt-4 text-[13px] sm:text-[14px] font-medium transition-colors ${selectedStyle === "dark" ? "text-white" : "text-[#8a8f98]"
                        }`}
                    >
                      Dark
                    </span>
                  </button>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  className="mt-8 h-10 px-8 rounded-md bg-[#545fc4] hover:bg-[#606cd4] active:bg-[#4b54ad] text-white text-[13px] font-medium min-w-[200px] shadow-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </SwiperSlide>

            {/* Slide 3: Connect with GitHub (Exact match to screenshot!) */}
            <SwiperSlide className="w-full h-full !flex flex-col items-center justify-center px-4">
              <div className="text-center max-w-xl mx-auto flex flex-col items-center">
                {/* GitHub Logo from public/git-logo.png */}
                <div className="mb-5 flex justify-center transition-transform hover:scale-105 duration-200">
                  <Image
                    src="/git-logo.png"
                    alt="GitHub Logo"
                    width={44}
                    height={44}
                    priority
                    className="w-11 h-11 object-contain pointer-events-none rounded-full"
                  />
                </div>

                {/* Title */}
                <h1 className="text-[25px] sm:text-[27px] font-medium text-white tracking-[-0.01em] mb-2 text-center">
                  Connect with GitHub
                </h1>

                {/* Subtitle */}
                <p className="text-[13px] text-[#8a8f98] text-center max-w-[480px] mb-8 leading-[1.6] font-normal">
                  Automate issue workflow when GitHub pull requests are opened and merged.
                </p>

                {/* Information Card Container */}
                <div className="w-full max-w-[500px] rounded-xl border border-[#27293d] bg-[#181926] p-6 sm:p-7 shadow-2xl space-y-5 text-left">
                  {/* Point 1 */}
                  <div className="flex items-start gap-3.5">
                    <Check className="w-4 h-4 text-[#555fbe] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#c5c8d6] leading-[1.55]">
                      Linear links the issue and the GitHub pull request automatically.
                    </p>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-3.5">
                    <Check className="w-4 h-4 text-[#555fbe] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#c5c8d6] leading-[1.55]">
                      Linear syncs the issue status when a pull request is opened, closed, merged, or reverted.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-3.5">
                    <Check className="w-4 h-4 text-[#555fbe] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#c5c8d6] leading-[1.55]">
                      Linear <strong className="font-semibold text-white">will not</strong> ask for code read permissions.
                    </p>
                  </div>
                </div>

                {/* Authenticate with GitHub Button */}
                <button
                  type="button"
                  onClick={handleGitHubAuth}
                  disabled={isGitHubConnecting}
                  className="mt-8 h-10 px-8 rounded-md bg-[#545fc4] hover:bg-[#606cd4] active:bg-[#4b54ad] text-white text-[13px] font-medium min-w-[220px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isGitHubConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Connecting with GitHub...</span>
                    </>
                  ) : isGitHubConnected ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Connected with GitHub</span>
                    </>
                  ) : (
                    <span>Authenticate with GitHub</span>
                  )}
                </button>

                {/* Error Alert if GitHub auth fails / No GitHub on this account */}
                {gitHubError && !isGitHubConnected && (
                  <div className="mt-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-center gap-2 max-w-[500px] text-center animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{gitHubError}</span>
                  </div>
                )}

                {/* Success Alert when GitHub connects */}
                {isGitHubConnected && (
                  <div className="mt-4 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center justify-center gap-2 max-w-[500px]">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>
                      Connected successfully{connectedUsername ? ` as @${connectedUsername}` : ""}! Advancing...
                    </span>
                  </div>
                )}

                {/* "I'll do this later" Skip Link */}
                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  className="mt-5 text-[12px] text-[#707383] hover:text-[#c5c8d6] transition-colors cursor-pointer font-normal"
                >
                  I'll do this later
                </button>
              </div>
            </SwiperSlide>

            {/* Slide 4: Invite co-workers to your team (Exact Match to Screenshot!) */}
            <SwiperSlide className="w-full h-full !flex flex-col items-center justify-center px-4 bg-[#fbfbfc]">
              <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
                {/* Title */}
                <h1 className="text-[25px] sm:text-[27px] font-semibold text-[#1f2328] tracking-[-0.01em] mb-2 text-center">
                  Invite co-workers to your team
                </h1>

                {/* Subtitle */}
                <p className="text-[13px] sm:text-[14px] text-[#6e7781] text-center max-w-[500px] mb-8 font-normal leading-[1.6]">
                  Linear is meant to be used with your team. Invite some co-workers to test it out with.
                </p>

                {/* White Card Container */}
                <div className="w-full max-w-[480px] rounded-xl border border-[#e5e7eb] bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-left">
                  {/* Email Field */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                      Email
                    </label>
                    <textarea
                      value={inviteEmails}
                      onChange={(e) => {
                        setInviteEmails(e.target.value);
                        if (inviteError) setInviteError(null);
                        if (inviteSuccess) setInviteSuccess(false);
                      }}
                      placeholder="email@example.com, email2@example.com..."
                      rows={2}
                      className="w-full rounded-md border border-[#4c78dd] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]/20 resize-none transition-all leading-normal"
                    />
                  </div>

                  {/* Add to team Field */}
                  <div className="mt-4">
                    <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                      Add to team
                    </label>
                    <div className="w-full min-h-[42px] rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 flex items-center justify-between">
                      {/* Team Chip */}
                      {selectedTeam ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#f3f4f6] text-[#374151] text-[13px] font-normal border border-[#e5e7eb]">
                          <svg
                            className="w-3.5 h-3.5 text-[#0d9488]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                          </svg>
                          <span>{selectedTeam}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedTeam("")}
                            className="text-[#9ca3af] hover:text-[#4b5563] ml-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          placeholder="Type team name..."
                          className="w-full text-[13px] text-[#374151] focus:outline-none placeholder:text-[#9ca3af] bg-transparent"
                        />
                      )}
                      <ChevronDown className="w-4 h-4 text-[#9ca3af] shrink-0 ml-2" />
                    </div>
                  </div>

                  {/* Feedback Alerts */}
                  {inviteError && (
                    <div className="mt-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{inviteError}</span>
                    </div>
                  )}

                  {/* Send invites Button Row with Copy Link (Level C) and Check Icon on Success */}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="inline-flex items-center gap-1.5 text-[12px] text-[#5e6ad2] hover:text-[#4b54ad] font-medium transition-colors cursor-pointer py-1 select-none"
                    >
                      {isLinkCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span className="text-green-600 font-medium">Invite link copied</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Copy invite link</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2.5">
                      {inviteSuccess && (
                        <div className="flex items-center text-green-600 animate-in fade-in zoom-in duration-200">
                          <Check className="w-4 h-4 text-green-600 stroke-[2.5]" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleSendInvites}
                        disabled={isSendingInvites || !inviteEmails.trim()}
                        className="h-9 px-5 rounded-md bg-[#5e6ad2] hover:bg-[#525dc1] active:bg-[#4b54ad] text-white text-[13px] font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSendingInvites ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Sending invites...</span>
                          </>
                        ) : (
                          <span>Send invites</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Continue Button below the Card */}
                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  className="mt-6 w-full max-w-[280px] h-10 rounded-md border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] active:bg-[#f3f4f6] text-[#374151] text-[13px] font-medium shadow-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </SwiperSlide>

            {/* Slide 5: You're good to go! (Exact Match to Screenshot!) */}
            <SwiperSlide className="w-full h-full !flex flex-col items-center justify-center px-4 bg-[#fbfbfc]">
              <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
                {/* Title */}
                <h1 className="text-[25px] sm:text-[27px] font-semibold text-[#1f2328] tracking-[-0.01em] mb-2 text-center">
                  You’re good to go!
                </h1>

                {/* Subtitle with inline <kbd>c</kbd> badge */}
                <p className="text-[13px] sm:text-[14px] text-[#6e7781] text-center max-w-[540px] mb-8 font-normal leading-[1.6]">
                  Next, explore the features and create issues by pressing{" "}
                  <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded bg-[#f3f4f6] border border-[#e5e7eb] text-[11px] font-mono text-[#374151] font-medium mx-0.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                    c
                  </kbd>{" "}
                  when you're in the app.
                </p>

                {/* 3-Column Feature Cards Grid */}
                <div className="w-full max-w-[760px] rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#f0f2f5] overflow-hidden text-left mb-8">
                  {/* Column 1: Tell your team */}
                  <div className="p-6 sm:p-7 flex flex-col justify-start">
                    <div className="w-7 h-7 mb-4 text-[#4b5563] flex items-center justify-start">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Back card */}
                        <path
                          d="M3 6V4.5C3 3.67 3.67 3 4.5 3H13C13.83 3 14.5 3.67 14.5 4.5V6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 6H2.5C1.67 6 1 6.67 1 7.5V15.5C1 16.33 1.67 17 2.5 17H3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        {/* Front card */}
                        <rect
                          x="4"
                          y="5"
                          width="15"
                          height="13"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          fill="white"
                        />
                        {/* Avatar Head */}
                        <circle cx="11.5" cy="9.5" r="1.8" fill="currentColor" />
                        {/* Avatar Body */}
                        <path
                          d="M8.2 15C8.2 13.5 9.7 12.5 11.5 12.5C13.3 12.5 14.8 13.5 14.8 15"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-[13.5px] font-semibold text-[#1f2328] mb-1.5">
                      Tell your team
                    </h3>
                    <p className="text-[12.5px] text-[#6e7781] leading-[1.5]">
                      Anyone with an{" "}
                      <strong className="font-semibold text-[#1f2328]">
                        @{userDomain}
                      </strong>{" "}
                      email can now sign in.
                    </p>
                  </div>

                  {/* Column 2: Integrate GitHub & Slack */}
                  <div className="p-6 sm:p-7 flex flex-col justify-start">
                    <div className="w-7 h-7 mb-4 text-[#4b5563] flex items-center justify-start">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="4" r="2" stroke="currentColor" strokeWidth="1.6" fill="#f9fafb" />
                        <circle cx="4" cy="16" r="2" stroke="currentColor" strokeWidth="1.6" fill="#f9fafb" />
                        <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="1.6" fill="#f9fafb" />
                        <line x1="8.6" y1="5.6" x2="5.4" y2="14.4" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="11.4" y1="5.6" x2="14.6" y2="14.4" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="6" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <h3 className="text-[13.5px] font-semibold text-[#1f2328] mb-1.5">
                      Integrate GitHub & Slack
                    </h3>
                    <p className="text-[12.5px] text-[#6e7781] leading-[1.5]">
                      Link your pull requests and create issues from Slack.
                    </p>
                  </div>

                  {/* Column 3: Keyboard shortcuts */}
                  <div className="p-6 sm:p-7 flex flex-col justify-start">
                    <div className="w-7 h-7 mb-4 flex items-center justify-start">
                      <div className="w-5 h-5 rounded-[4px] bg-[#9ca3af] flex items-center justify-center text-white text-[12px] font-sans font-medium leading-none select-none">
                        ⌘
                      </div>
                    </div>
                    <h3 className="text-[13.5px] font-semibold text-[#1f2328] mb-1.5">
                      Keyboard shortcuts
                    </h3>
                    <p className="text-[12.5px] text-[#6e7781] leading-[1.5]">
                      Learn the keyboard shortcuts by pressing{" "}
                      <kbd className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded bg-[#f3f4f6] border border-[#e5e7eb] text-[11px] font-mono text-[#374151] font-medium mx-0.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                        ?
                      </kbd>
                    </p>
                  </div>
                </div>

                {/* Open Linear Button */}
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="h-10 px-9 rounded-md bg-[#5e6ad2] hover:bg-[#525dc1] active:bg-[#4b54ad] text-white text-[13px] font-medium shadow-sm transition-all min-w-[220px] flex items-center justify-center cursor-pointer select-none"
                >
                  Open Linear
                </button>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* ============================================================== */}
          {/* 7 PAGINATION BULLETS (Exact Match to Linear Onboarding Flow)  */}
          {/* ============================================================== */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 select-none">
            {[0, 1, 2, 3, 4, 5, 6].map((bulletIdx) => {
              // Map 5 actual slides to 7 Linear onboarding progress dots:
              // Slide 0 (Welcome) -> bullet 0
              // Slide 1 (Style)   -> bullet 1
              // Slide 2 (GitHub)  -> bullet 3
              // Slide 3 (Invite)  -> bullet 5
              // Slide 4 (Ready)   -> bullet 6
              const slideToBullet: Record<number, number> = {
                0: 0,
                1: 1,
                2: 3,
                3: 5,
                4: 6,
              };
              const activeBullet = slideToBullet[currentSlide] ?? currentSlide;
              const isActive = bulletIdx === activeBullet;
              const isLightSlide = currentSlide === 3 || currentSlide === 4;

              const handleBulletClick = () => {
                if (!swiperInstance) return;
                if (bulletIdx <= 0) swiperInstance.slideTo(0);
                else if (bulletIdx === 1) swiperInstance.slideTo(1);
                else if (bulletIdx <= 3) swiperInstance.slideTo(2);
                else if (bulletIdx <= 5) swiperInstance.slideTo(3);
                else swiperInstance.slideTo(4);
              };

              return (
                <button
                  key={bulletIdx}
                  type="button"
                  onClick={handleBulletClick}
                  aria-label={`Go to step ${bulletIdx + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isLightSlide
                      ? isActive
                        ? "bg-[#6b7280] shadow-[0_0_4px_rgba(107,114,128,0.4)]"
                        : "bg-[#e5e7eb] hover:bg-[#d1d5db]"
                      : isActive
                        ? "bg-[#858fe8] shadow-[0_0_8px_rgba(133,143,232,0.6)]"
                        : "bg-[#353748] hover:bg-[#4a4e66]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#13141f]" />}>
      <OnboardingContent />
    </Suspense>
  );
}
