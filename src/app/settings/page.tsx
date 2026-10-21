"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import {
  ExternalLink,
  ChevronRight,
  Check,
  ArrowDownToLine,
  Map,
  PlayCircle,
  Layers,
  GitPullRequest,
  BookOpen,
  Bookmark,
  MessageSquare,
  Video,
  X,
  Shield,
  Save,
  Key,
  Globe,
  Bell,
  Sliders,
  Users,
  CreditCard,
  Plus,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  connected?: boolean;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "github",
    name: "GitHub",
    logo: "/integrations/git-logo.png",
    description: "Link pull requests, commits and automate workflows",
    category: "Developer",
    connected: true,
  },
  {
    id: "gitlab",
    name: "GitLab",
    logo: "/integrations/GitLab-logo.png",
    description: "Link merge requests and automate workflows",
    category: "Developer",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    logo: "/integrations/slack-logo.png",
    description: "Send notifications to channels and create issues from messages",
    category: "Communication",
    connected: true,
  },
  {
    id: "figma",
    name: "Figma",
    logo: "/integrations/Figma.png",
    description: "Embed file previews in issues",
    category: "Design",
    connected: false,
  },
  {
    id: "sentry",
    name: "Sentry",
    logo: "/integrations/sentry.png",
    description: "Link exceptions to issues",
    category: "Developer",
    connected: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    logo: "/integrations/Zapier.png",
    description: "Build custom automations and integrations with other apps",
    category: "Automation",
    connected: false,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    logo: "/integrations/Zendesk.png",
    description: "Link and automate Zendesk tickets with Linear",
    category: "Customer Support",
    connected: false,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    logo: "/integrations/Google-Sheet.png",
    description: "Export issues and build custom analytics",
    category: "Analytics",
    connected: false,
  },
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  const { currentWorkspace, sanitizeWorkspaceName } = useWorkspace();
  const { user } = useAuth();
  const { theme, setTheme, compactView, setCompactView } = useUI();

  // Active integration modal
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [isMigrationOpen, setIsMigrationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const workspaceName = currentWorkspace
    ? sanitizeWorkspaceName(currentWorkspace.name)
    : "My Workspace";
  const [orgName, setOrgName] = useState(workspaceName);
  const [orgSlug, setOrgSlug] = useState(currentWorkspace?.slug || "workspace");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentWorkspace?.name) {
      setOrgName(sanitizeWorkspaceName(currentWorkspace.name));
    }
    if (currentWorkspace?.slug) {
      setOrgSlug(currentWorkspace.slug);
    }
  }, [currentWorkspace]);

  // Team settings states
  const [estimationType, setEstimationType] = useState<"tshirt" | "fibonacci">("fibonacci");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Workspace settings saved successfully");
    }, 600);
  };

  return (
    <div className="min-h-full w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-10 text-[#e2e4ef]">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#1f2138] border border-[#5e6ad2] text-white text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: OVERVIEW (MATCHING SCREENSHOT EXACTLY)                    */}
      {/* ============================================================== */}
      {currentTab === "overview" && (
        <div className="space-y-10 animate-in fade-in duration-150">
          {/* Header */}
          <div>
            <h1 className="text-[22px] font-semibold text-white tracking-tight">
              Workspace
            </h1>
            <p className="text-[13px] text-[#8b90a4] mt-1">
              Manage your workspace settings
            </p>
          </div>

          {/* ============================================================ */}
          {/* 1. Explore features                                          */}
          {/* ============================================================ */}
          <div>
            <h2 className="text-[14px] font-medium text-white mb-3.5">
              Explore features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Card 1: Issue Migration Assistant */}
              <div className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-4 flex flex-col justify-between transition-colors min-h-[148px]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      Issue Migration Assistant
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8b90a4] leading-relaxed my-3 line-clamp-2">
                    Copy over existing issues from Jira, Shortcut, Asana or GitHub
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsMigrationOpen(true)}
                    className="px-2.5 py-1 rounded-[5px] bg-[#222438] hover:bg-[#2c2f4a] text-[#e2e4ef] text-[11px] font-medium border border-[#313450] transition-colors cursor-pointer"
                  >
                    Migrate issues
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMigrationOpen(true)}
                    className="text-[11px] text-[#8b90a4] hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2: Roadmaps */}
              <div className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-4 flex flex-col justify-between transition-colors min-h-[148px]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                      <Map className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      Roadmaps
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8b90a4] leading-relaxed my-3 line-clamp-2">
                    Roadmaps allow you to group and organize projects in your workspace
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[#c5c8d6] bg-[#1e2032] border border-[#2b2e46]">
                    <Check className="w-3 h-3 text-[#5e6ad2]" />
                    <span>Activated</span>
                  </div>
                  <Link
                    href="/projects"
                    className="text-[11px] text-[#8b90a4] hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Cycles */}
              <div className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-4 flex flex-col justify-between transition-colors min-h-[148px]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                      <PlayCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      Cycles
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8b90a4] leading-relaxed my-3 line-clamp-2">
                    Track your team's workload and velocity with Cycles
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => showToast("Cycles feature activated for your team")}
                    className="px-2.5 py-1 rounded-[5px] bg-[#222438] hover:bg-[#2c2f4a] text-[#e2e4ef] text-[11px] font-medium border border-[#313450] transition-colors cursor-pointer"
                  >
                    Try Cycles
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Cycles provide automated sprints and velocity graphs")}
                    className="text-[11px] text-[#8b90a4] hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 4: Views */}
              <div className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-4 flex flex-col justify-between transition-colors min-h-[148px]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      Views
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8b90a4] leading-relaxed my-3 line-clamp-2">
                    Create filtered views that you can save and share with others
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    href="/projects"
                    className="px-2.5 py-1 rounded-[5px] bg-[#222438] hover:bg-[#2c2f4a] text-[#e2e4ef] text-[11px] font-medium border border-[#313450] transition-colors cursor-pointer"
                  >
                    Open views
                  </Link>
                  <Link
                    href="/projects"
                    className="text-[11px] text-[#8b90a4] hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 5: Triage */}
              <div className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-4 flex flex-col justify-between transition-colors min-h-[148px]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                      <GitPullRequest className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      Triage
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8b90a4] leading-relaxed my-3 line-clamp-2">
                    Prioritize issues created from outside your team and customer support integrations
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => showToast("Triage inbox enabled for workspace")}
                    className="px-2.5 py-1 rounded-[5px] bg-[#222438] hover:bg-[#2c2f4a] text-[#e2e4ef] text-[11px] font-medium border border-[#313450] transition-colors cursor-pointer"
                  >
                    Try Triage
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Triage queues incoming requests before assigning to sprints")}
                    className="text-[11px] text-[#8b90a4] hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. Integrations                                              */}
          {/* ============================================================ */}
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-[14px] font-medium text-white">
                Integrations
              </h2>
              <button
                type="button"
                onClick={() => router.push("/settings?tab=integrations")}
                className="ml-2.5 flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-[#1a1c2d] border border-[#2a2d45] text-[11px] text-[#8b90a4] hover:text-white hover:bg-[#22253d] transition-colors cursor-pointer"
              >
                <span>Browse all</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Grid of 8 Integration Cards with Logos from /public/integrations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7">
              {INTEGRATIONS.slice(0, 4).map((item) => (
                <div key={item.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="text-[13px] font-medium text-white">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#8b90a4] leading-relaxed mt-2 mb-3 min-h-[34px]">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIntegration(item)}
                    className="px-2.5 py-1 rounded-[5px] bg-[#1a1c2d] hover:bg-[#25283e] border border-[#2a2d45] text-[#c5c8d6] hover:text-white text-[11px] font-medium transition-colors cursor-pointer w-fit"
                  >
                    Open
                  </button>
                </div>
              ))}

              {/* Subtle Horizontal Divider Line dividing row 1 and row 2 */}
              <div className="col-span-full border-b border-[#202236]" />

              {INTEGRATIONS.slice(4, 8).map((item) => (
                <div key={item.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="text-[13px] font-medium text-white">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#8b90a4] leading-relaxed mt-2 mb-3 min-h-[34px]">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIntegration(item)}
                    className="px-2.5 py-1 rounded-[5px] bg-[#1a1c2d] hover:bg-[#25283e] border border-[#2a2d45] text-[#c5c8d6] hover:text-white text-[11px] font-medium transition-colors cursor-pointer w-fit"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. Go further                                                */}
          {/* ============================================================ */}
          <div>
            <h2 className="text-[14px] font-medium text-white mb-3.5">
              Go further
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Start guide */}
              <a
                href="https://linear.app/docs/start"
                target="_blank"
                rel="noreferrer"
                className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-3.5 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-[12.5px] font-medium text-white group-hover:text-[#a5b4fc] transition-colors truncate">
                      Start guide
                    </p>
                    <p className="text-[11px] text-[#8b90a4] truncate">
                      Quick tips for beginners
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#55596e] group-hover:text-white transition-colors shrink-0 ml-1.5" />
              </a>

              {/* Card 2: Feature guide */}
              <a
                href="https://linear.app/docs"
                target="_blank"
                rel="noreferrer"
                className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-3.5 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-[12.5px] font-medium text-white group-hover:text-[#a5b4fc] transition-colors truncate">
                      Feature guide
                    </p>
                    <p className="text-[11px] text-[#8b90a4] truncate">
                      How Linear works
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#55596e] group-hover:text-white transition-colors shrink-0 ml-1.5" />
              </a>

              {/* Card 3: Linear method */}
              <a
                href="https://linear.app/method"
                target="_blank"
                rel="noreferrer"
                className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-3.5 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-[12.5px] font-medium text-white group-hover:text-[#a5b4fc] transition-colors truncate">
                      Linear method
                    </p>
                    <p className="text-[11px] text-[#8b90a4] truncate">
                      Best practices for building
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#55596e] group-hover:text-white transition-colors shrink-0 ml-1.5" />
              </a>

              {/* Card 4: Join our Slack community */}
              <a
                href="https://linear.app/join-slack"
                target="_blank"
                rel="noreferrer"
                className="bg-[#161726] border border-[#25283e] hover:border-[#353956] rounded-xl p-3.5 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-5 h-5 rounded-[5px] bg-[#5e6ad2]/20 text-[#818cf8] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-[12.5px] font-medium text-white group-hover:text-[#a5b4fc] transition-colors truncate">
                      Join our Slack community
                    </p>
                    <p className="text-[11px] text-[#8b90a4] truncate">
                      Ask questions and meet others
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#55596e] group-hover:text-white transition-colors shrink-0 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: GENERAL (ORGANIZATION LEVEL)                             */}
      {/* ============================================================== */}
      {currentTab === "general" && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-150">
          <div>
            <h1 className="text-[20px] font-semibold text-white tracking-tight mb-1">
              General Workspace Settings
            </h1>
            <p className="text-[13px] text-[#8b90a4]">
              Manage your organization name, URL, and global workspace attributes.
            </p>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#8b90a4] mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-[#0f101a] border border-[#2a2d45] focus:border-[#5e6ad2] rounded-lg px-3 py-2 text-[13px] text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#8b90a4] mb-1.5">
                  Workspace URL
                </label>
                <div className="flex items-center bg-[#0f101a] border border-[#2a2d45] rounded-lg px-3 py-2 text-[13px] text-[#707383]">
                  <span>linear.app/</span>
                  <input
                    type="text"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value)}
                    className="bg-transparent text-white outline-none flex-1 ml-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#8b90a4] mb-1.5">
                  Workspace Logo & Icon
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-base shadow">
                    {orgName.charAt(0).toUpperCase()}
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Logo upload triggered")}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1c2d] border border-[#2a2d45] text-xs text-[#c5c8d6] hover:text-white transition-colors cursor-pointer"
                  >
                    Change logo
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[12px] font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save changes"}</span>
            </button>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: SECURITY (SAML SSO & POLICIES)                           */}
      {/* ============================================================== */}
      {currentTab === "security" && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-150">
          <div>
            <h1 className="text-[20px] font-semibold text-white tracking-tight mb-1">
              Security & Authentication
            </h1>
            <p className="text-[13px] text-[#8b90a4]">
              Manage organization-level SAML Single Sign-On, Two-Factor Authentication, and session policies.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#25283e]">
              <div>
                <p className="text-[13px] font-medium text-white">SAML Single Sign-On (SSO)</p>
                <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                  Enforce sign-in via Okta, Google Workspace, Azure AD or OneLogin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("SAML SSO configuration is available on Enterprise plan")}
                className="px-3 py-1.5 rounded-lg bg-[#1a1c2d] border border-[#2a2d45] text-xs text-white hover:bg-[#25283e] transition-colors cursor-pointer"
              >
                Configure SSO
              </button>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-[#25283e]">
              <div>
                <p className="text-[13px] font-medium text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                  Require all workspace members to have 2FA enabled.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-white">Session Timeout</p>
                <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                  Automatically log out inactive users after 14 days.
                </p>
              </div>
              <span className="text-xs text-[#c5c8d6]">14 Days</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PLANS & BILLING                                           */}
      {/* ============================================================== */}
      {(currentTab === "plans" || currentTab === "billing") && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
          <div>
            <h1 className="text-[20px] font-semibold text-white tracking-tight mb-1">
              Plans & Billing
            </h1>
            <p className="text-[13px] text-[#8b90a4]">
              Manage your subscription tier, seats, invoices, and payment methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free */}
            <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#8b90a4] uppercase tracking-wider">
                  Free
                </span>
                <p className="text-2xl font-bold text-white mt-1 mb-2">$0</p>
                <p className="text-xs text-[#8b90a4] mb-4">
                  For small teams getting started with project tracking.
                </p>
                <ul className="text-xs text-[#c5c8d6] space-y-2 mb-6">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Up to 250 issues
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Unlimited members
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Basic integrations
                  </li>
                </ul>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#1a1c2d] border border-[#2a2d45] text-center text-xs text-[#8b90a4] font-medium">
                Current Plan
              </div>
            </div>

            {/* Standard */}
            <div className="p-5 rounded-xl bg-[#161726] border border-[#5e6ad2]/60 shadow-[0_0_20px_rgba(94,106,210,0.15)] flex flex-col justify-between relative">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#5e6ad2] text-white">
                Popular
              </span>
              <div>
                <span className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider">
                  Standard
                </span>
                <p className="text-2xl font-bold text-white mt-1 mb-2">
                  $8 <span className="text-xs text-[#8b90a4] font-normal">/ user / mo</span>
                </p>
                <p className="text-xs text-[#8b90a4] mb-4">
                  Unlimited issues, roadmaps, and custom workflows.
                </p>
                <ul className="text-xs text-[#c5c8d6] space-y-2 mb-6">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Unlimited active issues
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Full roadmaps & timelines
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Slack, GitHub & GitLab sync
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Custom cycles & triage
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => showToast("Upgraded to Standard plan checkout")}
                className="w-full py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition-colors cursor-pointer shadow-sm"
              >
                Upgrade to Standard
              </button>
            </div>

            {/* Plus / Enterprise */}
            <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#8b90a4] uppercase tracking-wider">
                  Enterprise
                </span>
                <p className="text-2xl font-bold text-white mt-1 mb-2">
                  $14 <span className="text-xs text-[#8b90a4] font-normal">/ user / mo</span>
                </p>
                <p className="text-xs text-[#8b90a4] mb-4">
                  Advanced security, SAML SSO, sub-teams, and audit logs.
                </p>
                <ul className="text-xs text-[#c5c8d6] space-y-2 mb-6">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> SAML SSO & SCIM provisioning
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> SLAs & customer priority support
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5e6ad2]" /> Unlimited sub-teams
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => showToast("Contact sales for Enterprise initiated")}
                className="w-full py-2 rounded-lg bg-[#1a1c2d] hover:bg-[#25283e] border border-[#2a2d45] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PROFILE (USER-LEVEL ACCOUNT)                             */}
      {/* ============================================================== */}
      {currentTab === "profile" && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-150">
          <div>
            <h1 className="text-[20px] font-semibold text-white tracking-tight mb-1">
              Personal Profile
            </h1>
            <p className="text-[13px] text-[#8b90a4]">
              Manage your personal user account, avatar, and contact info.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#8b90a4] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || "Member"}
                className="w-full bg-[#0f101a] border border-[#2a2d45] rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-[#5e6ad2]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#8b90a4] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                defaultValue={user?.email || "user@linear.app"}
                className="w-full bg-[#0f101a] border border-[#2a2d45] rounded-lg px-3 py-2 text-[13px] text-[#707383] outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast("Profile updated successfully")}
            className="px-4 py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: API & WEBHOOKS (DEVELOPER TOOLS)                          */}
      {/* ============================================================== */}
      {currentTab === "api" && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-150">
          <div>
            <h1 className="text-[20px] font-semibold text-white tracking-tight mb-1">
              Personal API Keys & Webhooks
            </h1>
            <p className="text-[13px] text-[#8b90a4]">
              Create personal access tokens and configure webhook endpoints for custom automations.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25283e]">
              <div>
                <p className="text-[13px] font-medium text-white">Personal API Keys</p>
                <p className="text-[11.5px] text-[#8b90a4]">
                  Keys authenticate requests to Linear's GraphQL API on your behalf.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("New API key generated: lin_api_884fbc901a...")}
                className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] text-white text-xs font-medium hover:bg-[#6875e5] transition-colors cursor-pointer"
              >
                + New API Key
              </button>
            </div>

            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center gap-2 font-mono text-[#c5c8d6]">
                <Key className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>lin_api_default_personal_key</span>
              </div>
              <span className="text-[11px] text-[#707383]">Created 3 days ago</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: TEAM SCOPED SETTINGS (WORKFLOWS, ESTIMATES)              */}
      {(currentTab === "team" || currentTab === "team-workflow" || currentTab === "team-estimates") && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-bold">
                F
              </div>
              <h1 className="text-[20px] font-semibold text-white tracking-tight">
                {workspaceName} Team Settings
              </h1>
            </div>
            <p className="text-[13px] text-[#8b90a4] mt-1">
              Every team in Linear has isolated settings for workflows, estimation criteria, and labels.
            </p>
          </div>

          {/* Estimation Criteria */}
          <div className="p-5 rounded-xl bg-[#161726] border border-[#25283e] space-y-4">
            <div>
              <p className="text-[13px] font-medium text-white">Issue Estimation System</p>
              <p className="text-[11.5px] text-[#8b90a4] mt-0.5">
                Choose between Fibonacci point scales (1, 2, 3, 5, 8) or T-Shirt sizes (XS, S, M, L, XL).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setEstimationType("fibonacci")}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  estimationType === "fibonacci"
                    ? "bg-[#1f2138] border-[#5e6ad2] text-white"
                    : "bg-[#0f101a] border-[#25283e] text-[#8b90a4] hover:text-white"
                }`}
              >
                <p className="text-xs font-semibold">Fibonacci Scale</p>
                <p className="text-[11px] text-[#707383] mt-0.5">1, 2, 3, 5, 8, 13 points</p>
              </button>

              <button
                type="button"
                onClick={() => setEstimationType("tshirt")}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  estimationType === "tshirt"
                    ? "bg-[#1f2138] border-[#5e6ad2] text-white"
                    : "bg-[#0f101a] border-[#25283e] text-[#8b90a4] hover:text-white"
                }`}
              >
                <p className="text-xs font-semibold">T-Shirt Sizes</p>
                <p className="text-[11px] text-[#707383] mt-0.5">XS, S, M, L, XL sizes</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INTEGRATION DETAILS MODAL                                      */}
      {/* ============================================================== */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedIntegration(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-[#2a2d45] bg-[#161726] p-6 text-[#e2e4ef] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#25283e] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedIntegration.logo}
                  alt={selectedIntegration.name}
                  className="w-6 h-6 object-contain"
                />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {selectedIntegration.name} Integration
                  </h3>
                  <span className="text-[11px] text-[#8b90a4]">
                    {selectedIntegration.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIntegration(null)}
                className="p-1 rounded text-[#8b90a4] hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#c5c8d6] leading-relaxed">
              {selectedIntegration.description}
            </p>

            <div className="p-3.5 rounded-lg bg-[#0f101a] border border-[#25283e] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8b90a4]">Status</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Ready to connect
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#8b90a4]">Webhook endpoint</span>
                <span className="font-mono text-[10.5px] text-[#707383]">
                  https://api.linear.app/v1/webhook/{selectedIntegration.id}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIntegration(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#8b90a4] hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`${selectedIntegration.name} connected successfully!`);
                  setSelectedIntegration(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition-colors cursor-pointer shadow-sm shadow-[#5e6ad2]/20"
              >
                Connect {selectedIntegration.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ISSUE MIGRATION ASSISTANT MODAL                                */}
      {/* ============================================================== */}
      {isMigrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsMigrationOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-[#2a2d45] bg-[#161726] p-6 text-[#e2e4ef] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#25283e] pb-3">
              <h3 className="text-base font-semibold text-white">
                Issue Migration Assistant
              </h3>
              <button
                type="button"
                onClick={() => setIsMigrationOpen(false)}
                className="p-1 rounded text-[#8b90a4] hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8b90a4] leading-relaxed">
              Select the tool you want to migrate existing projects, cycles, and issues from:
            </p>

            <div className="space-y-2">
              {[
                { name: "Jira Software", note: "Import issues, sprints, epics & attachments" },
                { name: "GitHub Issues", note: "Import repos, issues, labels & milestones" },
                { name: "Asana", note: "Import tasks, sections & subtasks" },
                { name: "Shortcut (Clubhouse)", note: "Import stories, epics & iterations" },
                { name: "CSV / JSON file", note: "Custom spreadsheet format" },
              ].map((tool) => (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => {
                    showToast(`Starting migration wizard from ${tool.name}`);
                    setIsMigrationOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0f101a] border border-[#25283e] hover:border-[#5e6ad2] transition-colors text-left cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-medium text-white group-hover:text-[#a5b4fc]">
                      {tool.name}
                    </p>
                    <p className="text-[11px] text-[#707383]">{tool.note}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#707383] group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-xs text-[#707383]">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
