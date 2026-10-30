"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";
import Link from "next/link";
import {
  FolderKanban,
  Sparkles,
  Layers,
  Cpu,
  Palette,
  Terminal,
  Rocket,
  Shield,
  ArrowUpCircle,
  ChevronDown,
  ChevronLeft,
  X,
  AlertCircle,
} from "lucide-react";

const AVAILABLE_ICONS = [
  { name: "FolderKanban", icon: FolderKanban, label: "Projects" },
  { name: "Palette", icon: Palette, label: "Design" },
  { name: "Terminal", icon: Terminal, label: "Engineering" },
  { name: "Rocket", icon: Rocket, label: "Product" },
  { name: "Cpu", icon: Cpu, label: "Backend" },
  { name: "Layers", icon: Layers, label: "Operations" },
  { name: "Shield", icon: Shield, label: "Security" },
  { name: "Sparkles", icon: Sparkles, label: "Growth" },
];

const AVAILABLE_COLORS = [
  "#5e6ad2", // Linear Indigo
  "#0ea5e9", // Sky Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#6b7280", // Gray
];

export default function CreateTeamPage() {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();

  // Form State
  const [teamName, setTeamName] = useState("");
  const [teamIdentifier, setTeamIdentifier] = useState("");
  const [isIdentifierManuallyEdited, setIsIdentifierManuallyEdited] = useState(false);
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  // Toggles
  const [copySettings, setCopySettings] = useState(false);
  const [existingTeams, setExistingTeams] = useState<Array<{ _id: string; name: string }>>([]);
  const [selectedExistingTeam, setSelectedExistingTeam] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing teams dynamically for copy settings dropdown
  React.useEffect(() => {
    if (!currentWorkspace?._id) return;
    api
      .get(`/teams?workspaceId=${currentWorkspace._id}`)
      .then((res) => {
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setExistingTeams(list);
          if (list.length > 0) {
            setSelectedExistingTeam(list[0].name);
          }
        }
      })
      .catch(() => null);
  }, [currentWorkspace?._id]);

  // Auto generate identifier from name unless user manually modified it
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTeamName(val);

    if (!isIdentifierManuallyEdited) {
      const words = val.trim().split(/[\s-_]+/);
      let generated = "";
      if (words.length === 1 && words[0].length > 0) {
        generated = words[0].slice(0, 3).toUpperCase();
      } else if (words.length > 1) {
        generated = words
          .slice(0, 3)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
      }
      setTeamIdentifier(generated);
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsIdentifierManuallyEdited(true);
    setTeamIdentifier(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: teamName.trim(),
      key: teamIdentifier.trim() || teamName.slice(0, 3).toUpperCase(),
      workspaceId: currentWorkspace?._id,
      color: selectedColor,
      icon: AVAILABLE_ICONS[selectedIconIndex].name,
      isPrivate,
      copiedFrom: copySettings ? selectedExistingTeam : undefined,
    };

    try {
      if (!currentWorkspace?._id) {
        setErrorMessage("Please select an active workspace first.");
        setIsSubmitting(false);
        return;
      }

      // 1. Save directly to MongoDB via backend
      await api.post("/teams", payload);

      // 2. Clean up any leftover local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("taskflow_custom_teams");
      }

      // 3. Notify SettingsSidebar to re-fetch from database
      window.dispatchEvent(new Event("taskflow_team_created"));

      // 4. Refresh page cleanly as requested (no success message)
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create team in database");
      setIsSubmitting(false);
    }
  };

  const SelectedIconComponent = AVAILABLE_ICONS[selectedIconIndex].icon;

  return (
    <div className="min-h-full bg-[#10111a] text-[#e2e4ef] select-none flex flex-col justify-start">
      {/* Top Left Navigation: < Teams */}
      <div className="pt-5 px-6 sm:px-8">
        <Link
          href="/settings/teams"
          className="inline-flex items-center gap-1 text-[12.5px] text-[#8b90a4] hover:text-white transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Teams</span>
        </Link>
      </div>

      <div className="w-full max-w-[660px] mx-auto px-6 pt-3 pb-12">
        {/* Page Title & Subtitle matching screenshot */}
        <div className="mb-8">
          <h1 className="text-[23px] sm:text-[25px] font-semibold text-white tracking-tight">
            Create a new team
          </h1>
          <p className="text-[13px] sm:text-[13.5px] text-[#8b90a4] mt-1.5 leading-relaxed">
            Create a new team to manage separate cycles, workflows and notifications.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-md bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#f87171] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCreateTeam} className="space-y-6">
          {/* ============================================================== */}
          {/* FIELD 1: Team icon & name                                      */}
          {/* ============================================================== */}
          <div>
            <label className="block text-[13px] font-medium text-white mb-2">
              Team icon & name
            </label>

            <div className="flex items-center gap-2.5 relative">
              {/* Icon & Color Selector Button */}
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                className="w-10 h-10 rounded-md bg-[#161827] border border-[#26283d] hover:border-[#3d4263] flex items-center justify-center transition cursor-pointer shrink-0 group"
                title="Choose team icon and color"
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center transition"
                  style={{ backgroundColor: selectedColor }}
                >
                  <SelectedIconComponent className="w-3.5 h-3.5 text-white" />
                </div>
              </button>

              {/* Icon Picker Popover */}
              {isIconPickerOpen && (
                <div className="absolute top-12 left-0 z-50 w-64 p-3 rounded-lg bg-[#151726] border border-[#292d47] shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-[11.5px] font-medium text-[#8b90a4]">
                    <span>Icon & Color</span>
                    <button
                      type="button"
                      onClick={() => setIsIconPickerOpen(false)}
                      className="text-[#656a82] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center justify-between gap-1">
                    {AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                          selectedColor === color ? "scale-125 ring-2 ring-white/60" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Icons Grid */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#23263b]">
                    {AVAILABLE_ICONS.map((item, idx) => {
                      const Icon = item.icon;
                      const isSelected = idx === selectedIconIndex;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setSelectedIconIndex(idx);
                            setIsIconPickerOpen(false);
                          }}
                          className={`p-2 rounded flex flex-col items-center justify-center text-[10px] transition cursor-pointer ${
                            isSelected
                              ? "bg-[#232742] text-white ring-1 ring-[#5e6ad2]"
                              : "text-[#8b90a4] hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Team Name Input matching placeholder e.g. Engineering */}
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Engineering"
                value={teamName}
                onChange={handleNameChange}
                className="flex-1 h-10 px-3.5 rounded-md bg-[#141624] border border-[#26283d] text-white text-[13.5px] placeholder:text-[#52576e] focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] outline-none transition"
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* FIELD 2: Team identifier                                       */}
          {/* ============================================================== */}
          <div>
            <label className="block text-[13px] font-medium text-white mb-2">
              Team identifier
            </label>

            <div className="flex items-center gap-3.5">
              <input
                type="text"
                placeholder="e.g. ENG"
                value={teamIdentifier}
                onChange={handleIdentifierChange}
                maxLength={6}
                className="w-28 sm:w-32 h-10 px-3.5 rounded-md bg-[#141624] border border-[#26283d] text-white text-[13px] font-mono uppercase tracking-wider placeholder:text-[#52576e] focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] outline-none transition shrink-0"
              />
              <span className="text-[12.5px] text-[#8b90a4] leading-relaxed">
                This is used as the identifier (e.g. ENG-123) for all issues of the team. Keep it short and simple.
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-[#1d1f30]" />

          {/* ============================================================== */}
          {/* FIELD 3: Copy settings from existing team                      */}
          {/* ============================================================== */}
          <div className="pt-2">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <span className="block text-[13.5px] font-medium text-white">
                  Copy settings from existing team
                </span>
                <p className="text-[12.5px] text-[#8b90a4] leading-relaxed mt-1">
                  You can choose to copy the settings of an existing team for your newly created team. All settings including workflow and cycle settings are copied, but Slack notification settings and team members won&apos;t be copied.
                </p>

                {/* Sub-selector if copySettings is toggled ON */}
                {copySettings && (
                  <div className="mt-3 flex items-center gap-2">
                    {existingTeams.length > 0 ? (
                      <>
                        <span className="text-xs text-[#8b90a4]">Copy from:</span>
                        <div className="relative">
                          <select
                            value={selectedExistingTeam}
                            onChange={(e) => setSelectedExistingTeam(e.target.value)}
                            className="h-8 pl-2.5 pr-7 bg-[#161827] border border-[#2a2d45] rounded text-xs text-white outline-none focus:border-[#5e6ad2] cursor-pointer appearance-none"
                          >
                            {existingTeams.map((t) => (
                              <option key={t._id} value={t.name}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#6b7086] absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-[#8b90a4] italic">
                        No existing teams in this workspace to copy from.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={copySettings}
                onClick={() => setCopySettings(!copySettings)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                  copySettings ? "bg-[#5e6ad2]" : "bg-[#25283c]"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform ${
                    copySettings ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-[#1d1f30]" />

          {/* ============================================================== */}
          {/* FIELD 4: Make team private + Upgrade badge                     */}
          {/* ============================================================== */}
          <div className="pt-2">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium text-white">
                    Make team private
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-[#818cf8] border border-[#5e6ad2]/30 bg-[#5e6ad2]/10 hover:bg-[#5e6ad2]/20 transition cursor-pointer"
                  >
                    <ArrowUpCircle className="w-3 h-3 text-[#818cf8]" />
                    <span>Upgrade</span>
                  </button>
                </div>
                <p className="text-[12.5px] text-[#8b90a4] leading-relaxed mt-1">
                  Private teams and their issues are only visible to members of the team and admins. Only admins and team owners can add new users to a private team. Public teams and their issues are visible to anyone in the workspace.
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isPrivate}
                onClick={() => {
                  setIsPrivate(!isPrivate);
                }}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                  isPrivate ? "bg-[#5e6ad2]" : "bg-[#25283c]"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform ${
                    isPrivate ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SUBMIT BUTTON: Create Team                                     */}
          {/* ============================================================== */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !teamName.trim()}
              className="px-4 py-2 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[13px] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-5 rounded-lg bg-[#141624] border border-[#2b2f4c] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-3 right-3 text-[#8b90a4] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 flex items-center justify-center text-[#818cf8] mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Private Teams are on Standard & Plus
            </h3>
            <p className="text-xs text-[#8b90a4] leading-relaxed mb-4">
              Control access to sensitive projects, internal cycles and roadmaps with private teams.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push("/settings?tab=plans");
                }}
                className="flex-1 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6875e5] text-xs font-medium text-white transition text-center cursor-pointer"
              >
                View Plans
              </button>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.08] text-xs text-[#8b90a4] hover:text-white transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
