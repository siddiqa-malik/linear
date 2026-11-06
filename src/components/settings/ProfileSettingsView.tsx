"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { api } from "@/lib/api";
import {
  Pencil,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Upload,
  User as UserIcon,
} from "lucide-react";

/*
 * ProfileSettingsView Component
 *
 * Implements the Linear profile settings screen exactly matching the design:
 * - Profile card with Profile picture (with upload/preview), Email (with edit icon),
 *   Full name, Title ("Your job title or role"), and Username ("One word, like a nickname or first name").
 * - Workspace access section with "Remove yourself from workspace" and "Leave workspace" action.
 * - Separates personal profile (stored in User model) from app preferences (stored in UserSettings model).
 */
export function ProfileSettingsView() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Email edit state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // General profile saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Leave workspace modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  // Hidden avatar file input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize fields from user context
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setTitle(user.title || "");
      setUsername(user.username || (user.email ? user.email.split("@")[0] : ""));
      setAvatar(user.avatar || null);
      setEmailValue(user.email || "");
    }
  }, [user]);

  // Check if form has unsaved changes compared to current user
  const hasProfileChanges =
    (user && (
      fullName.trim() !== (user.name || "").trim() ||
      title.trim() !== (user.title || "").trim() ||
      username.trim() !== (user.username || "").trim() ||
      avatar !== (user.avatar || null)
    )) || false;

  /*
   * Handles local file upload for profile picture.
   * Converts selected image to base64 data URL for preview and storage.
   */
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveError("Please select an image file (PNG, JPG, WebP)");
      return;
    }

    // Limit avatar file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      setSaveError("Avatar image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
        setSaveError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  /*
   * Saves updated profile fields (Full name, Title, Username, Avatar)
   * to the backend User entity via PATCH /api/users/me.
   */
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setSaveError("Full name is required");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await api.patch("/users/me", {
        name: fullName.trim(),
        title: title.trim(),
        username: username.trim(),
        avatar: avatar,
      });

      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * Updates user's email address after inline editing.
   */
  const handleSaveEmail = async () => {
    if (!emailValue.trim() || !emailValue.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailSaving(true);
    setEmailError(null);

    try {
      await api.patch("/users/me", {
        email: emailValue.trim().toLowerCase(),
      });
      await refreshUser();
      setIsEditingEmail(false);
    } catch (err: any) {
      setEmailError(err?.message || "Failed to update email");
    } finally {
      setEmailSaving(false);
    }
  };

  /*
   * Leaves the current active workspace.
   * Calls POST /api/workspaces/:id/leave and switches to another available
   * workspace or navigates to onboarding if the user has no remaining workspaces.
   */
  const handleLeaveWorkspace = async () => {
    if (!currentWorkspace?._id) return;

    setIsLeaving(true);
    setLeaveError(null);

    try {
      await api.post(`/workspaces/${currentWorkspace._id}/leave`);

      // Find an alternate workspace to switch to
      const remaining = (workspaces || []).filter(
        (ws) => ws._id !== currentWorkspace._id
      );

      if (remaining.length > 0) {
        setCurrentWorkspace(remaining[0]);
        setIsLeaveModalOpen(false);
        router.push("/issues");
      } else {
        setIsLeaveModalOpen(false);
        router.push("/onboarding");
      }
    } catch (err: any) {
      setLeaveError(err?.message || "Failed to leave workspace");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto py-10 px-6 sm:px-8 select-none font-sans">
      {/* Page Title */}
      <h1 className="text-[22px] font-semibold text-white tracking-tight mb-6">
        Profile
      </h1>

      {/* Profile Card Container */}
      <div className="bg-[#141521] border border-[#232538] rounded-xl overflow-hidden divide-y divide-[#232538] shadow-sm">
        {/* ============================================================== */}
        {/* ROW 1: Profile picture                                         */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-[13.5px] font-medium text-white">
            Profile picture
          </span>

          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:opacity-80 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#5e6ad2] flex items-center justify-center text-white font-semibold text-sm group-hover:opacity-80 transition shadow-inner">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-5 h-5 text-white/80" />}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Upload className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 2: Email                                                   */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-5 py-3.5 min-h-[56px]">
          <span className="text-[13.5px] font-medium text-white">
            Email
          </span>

          {isEditingEmail ? (
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.target.value);
                  setEmailError(null);
                }}
                className="px-2.5 py-1 text-[13px] bg-[#0c0d15] border border-[#2a2d42] rounded-md text-white focus:border-[#5e6ad2] outline-none w-56 sm:w-64"
                placeholder="name@company.com"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveEmail}
                disabled={emailSaving}
                className="p-1.5 rounded bg-[#5e6ad2] hover:bg-[#6875e5] text-white transition disabled:opacity-50 cursor-pointer"
                title="Save Email"
              >
                {emailSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingEmail(false);
                  setEmailValue(user?.email || "");
                  setEmailError(null);
                }}
                disabled={emailSaving}
                className="p-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[#8b90a4] hover:text-white transition cursor-pointer"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#b4b8c9] font-normal">
                {user?.email || "user@example.com"}
              </span>
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="p-1 rounded text-[#707383] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                title="Edit email"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Email error notice */}
        {emailError && (
          <div className="px-5 py-2 bg-red-500/10 text-red-400 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{emailError}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ROW 3: Full name                                               */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-[13.5px] font-medium text-white">
            Full name
          </span>

          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setSaveError(null);
            }}
            placeholder="Your name"
            className="w-64 sm:w-80 px-3 py-1.5 rounded-lg bg-[#0c0d15] border border-[#25283e] text-white text-[13px] placeholder-[#505468] focus:border-[#5e6ad2] focus:outline-none transition-colors"
          />
        </div>

        {/* ============================================================== */}
        {/* ROW 4: Title                                                   */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex flex-col pr-4">
            <span className="text-[13.5px] font-medium text-white">
              Title
            </span>
            <span className="text-[11.5px] text-[#707383]">
              Your job title or role
            </span>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveError(null);
            }}
            placeholder="e.g. web developer"
            className="w-64 sm:w-80 px-3 py-1.5 rounded-lg bg-[#0c0d15] border border-[#25283e] text-white text-[13px] placeholder-[#505468] focus:border-[#5e6ad2] focus:outline-none transition-colors"
          />
        </div>

        {/* ============================================================== */}
        {/* ROW 5: Username                                                */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex flex-col pr-4">
            <span className="text-[13.5px] font-medium text-white">
              Username
            </span>
            <span className="text-[11.5px] text-[#707383]">
              One word, like a nickname or first name
            </span>
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setSaveError(null);
            }}
            placeholder="e.g. siddiqamalik888"
            className="w-64 sm:w-80 px-3 py-1.5 rounded-lg bg-[#0c0d15] border border-[#25283e] text-white text-[13px] placeholder-[#505468] focus:border-[#5e6ad2] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Save Action Banner */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          {saveError && (
            <span className="text-xs text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {saveError}
            </span>
          )}
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Profile updated successfully
            </span>
          )}
        </div>

        {hasProfileChanges && (
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save changes</span>
            )}
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: Workspace access                                    */}
      {/* ============================================================== */}
      <div className="mt-9">
        <h2 className="text-[15px] font-medium text-white mb-3">
          Workspace access
        </h2>

        <div className="bg-[#141521] border border-[#232538] rounded-xl overflow-hidden px-5 py-4 flex items-center justify-between shadow-sm">
          <span className="text-[13.5px] font-medium text-white">
            Remove yourself from workspace
          </span>

          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="text-[13px] font-medium text-[#f87171] hover:text-[#ef4444] transition-colors cursor-pointer hover:underline"
          >
            Leave workspace
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: Leave Workspace Confirmation Dialog                     */}
      {/* ============================================================== */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161726] border border-[#282a40] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Leave {currentWorkspace?.name || "Workspace"}?
                </h3>
                <p className="text-xs text-[#8a8f98] mt-0.5">
                  You will lose access to all issues, projects, and cycles in this workspace.
                </p>
              </div>
            </div>

            {leaveError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {leaveError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  setLeaveError(null);
                }}
                disabled={isLeaving}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#8a8f98] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLeaveWorkspace}
                disabled={isLeaving}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-600/30"
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Leaving...</span>
                  </>
                ) : (
                  <span>Yes, Leave Workspace</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

