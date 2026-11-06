"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";
import { GithubIcon } from "@/components/icons/SocialIcons";
import {
  X,
  Search,
  Check,
  Loader2,
  ExternalLink,
  ChevronRight,
  FolderGit2,
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Tag,
  KeyRound,
  Globe,
  RotateCw,
} from "lucide-react";

export interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTeamId?: string;
  defaultProjectId?: string;
}

interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  description: string | null;
  openIssuesCount: number;
  url: string;
}

interface GithubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  htmlUrl: string;
  user: {
    login: string;
    avatarUrl: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  createdAt: string;
}

export function GitHubImportModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTeamId,
  defaultProjectId,
}: GitHubImportModalProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();

  // Step 1: Config | Step 2: Select Issues | Step 3: Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Authentication & Source Mode
  const [authMode, setAuthMode] = useState<"token" | "public">("token");
  const [token, setToken] = useState("");
  const [saveToken, setSaveToken] = useState(true);

  // Repositories state
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoSearch, setRepoSearch] = useState("");
  const [selectedRepoFullName, setSelectedRepoFullName] = useState("");
  const [manualRepoInput, setManualRepoInput] = useState("");

  // Target Destination
  const [teams, setTeams] = useState<Array<{ _id: string; name: string; key: string }>>([]);
  const [projects, setProjects] = useState<Array<{ _id: string; name: string; teamId?: any }>>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [issueStateFilter, setIssueStateFilter] = useState<"open" | "closed" | "all">("open");
  const [defaultPriority, setDefaultPriority] = useState<"none" | "low" | "medium" | "high" | "urgent">("none");

  // Step 2: Issues List
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [issueSearchQuery, setIssueSearchQuery] = useState("");
  const [selectedIssueNumbers, setSelectedIssueNumbers] = useState<Set<number>>(new Set());

  // Step 3: Import progress & Result
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ importedCount: number; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Initialize Saved Token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taskflow_github_token");
      if (saved) {
        setToken(saved);
      }
    }
  }, []);

  // 2. Fetch Teams and Projects for destination dropdowns
  useEffect(() => {
    async function loadWorkspaceMetadata() {
      if (!currentWorkspace?._id) return;
      try {
        const [teamsRes, projectsRes] = await Promise.all([
          api.get(`/teams?workspaceId=${currentWorkspace._id}`),
          api.get(`/projects?workspaceId=${currentWorkspace._id}`),
        ]);

        const teamsList = teamsRes?.data || teamsRes || [];
        const projectsList = projectsRes?.data || projectsRes || [];

        if (Array.isArray(teamsList)) {
          setTeams(teamsList);
          if (defaultTeamId) {
            setSelectedTeamId(defaultTeamId);
          } else if (teamsList.length > 0) {
            setSelectedTeamId(teamsList[0]._id);
          }
        }

        if (Array.isArray(projectsList)) {
          setProjects(projectsList);
          if (defaultProjectId) {
            setSelectedProjectId(defaultProjectId);
          }
        }
      } catch (err) {
        console.warn("Failed to load teams or projects for GitHub importer:", err);
      }
    }

    if (isOpen) {
      loadWorkspaceMetadata();
    }
  }, [isOpen, currentWorkspace?._id, defaultTeamId, defaultProjectId]);

  // Load User Repositories via GitHub token
  const handleLoadUserRepos = async () => {
    const cleanToken = token.trim();
    if (!cleanToken) {
      setErrorMessage("Please enter a valid GitHub Personal Access Token");
      return;
    }

    setErrorMessage(null);
    setIsLoadingRepos(true);

    try {
      if (saveToken && typeof window !== "undefined") {
        localStorage.setItem("taskflow_github_token", cleanToken);
      }

      const res = await api.get(`/github/repos?token=${encodeURIComponent(cleanToken)}`);
      const list = res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setRepos(list);
        setSelectedRepoFullName(list[0].fullName);
      } else {
        setErrorMessage("No repositories found for this GitHub account.");
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to authenticate with GitHub.");
    } finally {
      setIsLoadingRepos(false);
    }
  };

  // Step 1 -> Step 2: Fetch Issues from target repo
  const handleFetchIssues = async () => {
    setErrorMessage(null);
    let targetOwner = "";
    let targetRepo = "";

    if (authMode === "token" && selectedRepoFullName) {
      const parts = selectedRepoFullName.split("/");
      targetOwner = parts[0];
      targetRepo = parts[1];
    } else if (manualRepoInput.trim()) {
      const cleaned = manualRepoInput.trim().replace(/^https?:\/\/github\.com\//, "");
      const parts = cleaned.split("/");
      if (parts.length >= 2) {
        targetOwner = parts[0];
        targetRepo = parts[1];
      }
    }

    if (!targetOwner || !targetRepo) {
      setErrorMessage("Please select a repository or enter owner/repo (e.g. facebook/react)");
      return;
    }

    if (!selectedTeamId) {
      setErrorMessage("Please select a target Team where imported issues will be created.");
      return;
    }

    setIsLoadingIssues(true);
    try {
      const q = new URLSearchParams({
        owner: targetOwner,
        repo: targetRepo,
        state: issueStateFilter,
      });

      if (token.trim()) {
        q.set("token", token.trim());
      }

      const res = await api.get(`/github/issues?${q.toString()}`);
      const fetchedIssues: GithubIssue[] = res?.data || [];

      if (!Array.isArray(fetchedIssues) || fetchedIssues.length === 0) {
        setErrorMessage(`No ${issueStateFilter} issues found in ${targetOwner}/${targetRepo}`);
        return;
      }

      setIssues(fetchedIssues);
      // Select all by default
      setSelectedIssueNumbers(new Set(fetchedIssues.map((i) => i.number)));
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to fetch issues from GitHub.");
    } finally {
      setIsLoadingIssues(false);
    }
  };

  // Toggle single issue selection
  const toggleIssueSelection = (num: number) => {
    setSelectedIssueNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (selectedIssueNumbers.size === issues.length) {
      setSelectedIssueNumbers(new Set());
    } else {
      setSelectedIssueNumbers(new Set(issues.map((i) => i.number)));
    }
  };

  // Step 2 -> Step 3: Run Batch Import
  const handleRunImport = async () => {
    if (selectedIssueNumbers.size === 0) {
      setErrorMessage("Please select at least one issue to import.");
      return;
    }

    if (!currentWorkspace?._id || !selectedTeamId) {
      setErrorMessage("Workspace or target Team missing.");
      return;
    }

    setErrorMessage(null);
    setIsImporting(true);

    try {
      const selectedIssuesData = issues.filter((i) => selectedIssueNumbers.has(i.number));

      const payload = {
        workspaceId: currentWorkspace._id,
        teamId: selectedTeamId,
        projectId: selectedProjectId || undefined,
        defaultPriority,
        issues: selectedIssuesData.map((i) => ({
          number: i.number,
          title: i.title,
          body: i.body,
          state: i.state,
          htmlUrl: i.htmlUrl,
          labels: i.labels,
          user: i.user,
        })),
      };

      const res = await api.post("/github/import", payload);
      const data = res?.data || res;

      setImportResult({
        importedCount: data?.importedCount || selectedIssuesData.length,
        message: res?.message || `Successfully imported ${selectedIssuesData.length} issue(s) into TaskFlow`,
      });

      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to import issues from GitHub.");
    } finally {
      setIsImporting(false);
    }
  };

  // Filtered issues for search in Step 2
  const filteredIssues = useMemo(() => {
    if (!issueSearchQuery.trim()) return issues;
    const q = issueSearchQuery.toLowerCase().trim();
    return issues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        String(i.number).includes(q) ||
        (i.labels && i.labels.some((l) => l.name.toLowerCase().includes(q)))
    );
  }, [issues, issueSearchQuery]);

  // Filtered repos for search in Step 1
  const filteredRepos = useMemo(() => {
    if (!repoSearch.trim()) return repos;
    const q = repoSearch.toLowerCase().trim();
    return repos.filter((r) => r.fullName.toLowerCase().includes(q));
  }, [repos, repoSearch]);

  const selectedTeamName = teams.find((t) => t._id === selectedTeamId)?.name || "Selected Team";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-[620px] bg-[#141520] border border-white/[0.08] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden select-none">
        {/* ============================================================== */}
        {/* MODAL HEADER                                                  */}
        {/* ============================================================== */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#10111a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#24292f] border border-white/[0.1] flex items-center justify-center text-white shadow-sm">
              <GithubIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white tracking-tight flex items-center gap-2">
                <span>Import from GitHub</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8a8f98]">
                  v3 REST API
                </span>
              </h2>
              <p className="text-[11.5px] text-[#8a8f98]">
                {step === 1 && "Connect repository and select target destination"}
                {step === 2 && `Review & select issues to import (${selectedIssueNumbers.size} selected)`}
                {step === 3 && "Import complete"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 1: CONFIGURATION (Token, Repo, Team, Project)              */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Mode Switcher: Personal Access Token vs Public Repo */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#0c0d14] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setAuthMode("token")}
                className={`py-1.5 px-3 rounded-md text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === "token"
                    ? "bg-[#5e6ad2] text-white shadow-sm"
                    : "text-[#8a8f98] hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Personal Access Token</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("public")}
                className={`py-1.5 px-3 rounded-md text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === "public"
                    ? "bg-[#5e6ad2] text-white shadow-sm"
                    : "text-[#8a8f98] hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Repository</span>
              </button>
            </div>

            {/* Mode A: Token Input */}
            {authMode === "token" ? (
              <div className="space-y-2">
                <label className="text-[11.5px] font-medium text-[#c5c8d6] flex items-center justify-between">
                  <span>GitHub Personal Access Token (PAT)</span>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#7a85e8] hover:underline flex items-center gap-1"
                  >
                    <span>Generate token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_... or github_pat_..."
                    className="flex-1 h-9 px-3 rounded-md bg-[#0c0d14] border border-white/[0.08] focus:border-[#5e6ad2] text-xs text-white placeholder-[#5a5f70] outline-none transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleLoadUserRepos}
                    disabled={isLoadingRepos || !token.trim()}
                    className="h-9 px-3.5 rounded-md bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isLoadingRepos ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Load Repos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveTokenCheckbox"
                    checked={saveToken}
                    onChange={(e) => setSaveToken(e.target.checked)}
                    className="rounded bg-[#0c0d14] border-white/[0.1] text-[#5e6ad2] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="saveTokenCheckbox" className="text-[11px] text-[#8a8f98] cursor-pointer">
                    Remember token in this browser
                  </label>
                </div>

                {/* Repositories Dropdown if loaded */}
                {repos.length > 0 && (
                  <div className="pt-2 space-y-1.5 animate-in fade-in duration-150">
                    <label className="text-[11.5px] font-medium text-[#c5c8d6]">
                      Select Repository ({repos.length} available)
                    </label>
                    <select
                      value={selectedRepoFullName}
                      onChange={(e) => setSelectedRepoFullName(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-[#0c0d14] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
                    >
                      {repos.map((r) => (
                        <option key={r.id} value={r.fullName}>
                          {r.fullName} {r.private ? "🔒 (Private)" : ""} ({r.openIssuesCount} issues)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Public Repo Input */
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-medium text-[#c5c8d6]">
                  Repository URL or Slug (e.g. facebook/react)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#626674] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={manualRepoInput}
                      onChange={(e) => setManualRepoInput(e.target.value)}
                      placeholder="owner/repository (e.g. vercel/next.js)"
                      className="w-full h-9 pl-9 pr-3 rounded-md bg-[#0c0d14] border border-white/[0.08] focus:border-[#5e6ad2] text-xs text-white placeholder-[#5a5f70] outline-none transition font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#8a8f98]">
                  Public repositories can be inspected and imported without any authentication token.
                </p>
              </div>
            )}

            {/* Target Destination Section */}
            <div className="pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Target Team (Required) */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-medium text-[#c5c8d6]">
                  Target Team <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-[#0c0d14] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
                >
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Project (Optional) */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-medium text-[#c5c8d6]">
                  Target Project <span className="text-[#8a8f98] font-normal">(Optional)</span>
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-[#0c0d14] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
                >
                  <option value="">None (Standalone Team Issues)</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter & Priority Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* State Filter */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-medium text-[#c5c8d6]">
                  GitHub State
                </label>
                <select
                  value={issueStateFilter}
                  onChange={(e) => setIssueStateFilter(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md bg-[#0c0d14] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
                >
                  <option value="open">Open Issues Only (Default)</option>
                  <option value="closed">Closed Issues Only</option>
                  <option value="all">All Issues (Open & Closed)</option>
                </select>
              </div>

              {/* Default Priority */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-medium text-[#c5c8d6]">
                  Default Priority
                </label>
                <select
                  value={defaultPriority}
                  onChange={(e) => setDefaultPriority(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md bg-[#0c0d14] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#5e6ad2] transition cursor-pointer"
                >
                  <option value="none">No Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: ISSUE SELECTION & PREVIEW LIST                         */}
        {/* ============================================================== */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Toolbar: Search + Select All */}
            <div className="px-5 py-3 border-b border-white/[0.06] bg-[#0c0d14] flex items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#626674] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={issueSearchQuery}
                  onChange={(e) => setIssueSearchQuery(e.target.value)}
                  placeholder="Search fetched issues..."
                  className="w-full h-8 pl-8 pr-3 rounded-md bg-[#161726] border border-white/[0.06] text-xs text-white placeholder-[#5a5f70] outline-none focus:border-[#5e6ad2]"
                />
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                className="px-2.5 py-1 rounded text-xs text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition cursor-pointer shrink-0 font-medium"
              >
                {selectedIssueNumbers.size === issues.length ? "Deselect all" : "Select all"}
              </button>
            </div>

            {/* Destination summary badge */}
            <div className="px-5 py-2 bg-[#12131f] border-b border-white/[0.04] text-[11.5px] text-[#8a8f98] flex items-center justify-between">
              <div>
                Importing to: <strong className="text-white">{selectedTeamName}</strong>
                {selectedProjectId && (
                  <span>
                    {" "}
                    • Project:{" "}
                    <strong className="text-white">
                      {projects.find((p) => p._id === selectedProjectId)?.name || "Project"}
                    </strong>
                  </span>
                )}
              </div>
              <div>
                <span className="text-[#a5b4fc] font-medium">{selectedIssueNumbers.size}</span> of {issues.length} selected
              </div>
            </div>

            {/* Scrollable Issues List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] p-2">
              {filteredIssues.map((issue) => {
                const isSelected = selectedIssueNumbers.has(issue.number);
                return (
                  <div
                    key={issue.id}
                    onClick={() => toggleIssueSelection(issue.number)}
                    className={`flex items-start gap-3 p-2.5 rounded-lg transition cursor-pointer ${
                      isSelected ? "bg-white/[0.04] hover:bg-white/[0.06]" : "hover:bg-white/[0.02] opacity-75"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div click
                      className="mt-1 rounded bg-[#0c0d14] border-white/[0.2] text-[#5e6ad2] focus:ring-0 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono font-medium text-[#7a85e8]">
                          #{issue.number}
                        </span>

                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                            issue.state === "open"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {issue.state}
                        </span>

                        <span className="text-[13px] font-medium text-white tracking-tight break-words">
                          {issue.title}
                        </span>
                      </div>

                      {/* Labels and Author info */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px] text-[#707383]">
                        <span>by @{issue.user.login}</span>

                        {issue.labels && issue.labels.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {issue.labels.slice(0, 4).map((lbl, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                style={{
                                  backgroundColor: `#${lbl.color}25`,
                                  color: `#${lbl.color}`,
                                  border: `1px solid #${lbl.color}40`,
                                }}
                              >
                                {lbl.name}
                              </span>
                            ))}
                            {issue.labels.length > 4 && (
                              <span className="text-[10px] text-[#707383]">
                                +{issue.labels.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: SUCCESS STATE                                         */}
        {/* ============================================================== */}
        {step === 3 && importResult && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Import Successful!
              </h3>
              <p className="text-xs text-[#8a8f98] mt-1 max-w-[360px]">
                {importResult.message}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0c0d14] border border-white/[0.06] text-xs text-[#c5c8d6] w-full max-w-[360px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#8a8f98]">Issues Imported:</span>
                <strong className="text-white">{importResult.importedCount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8f98]">Target Team:</span>
                <strong className="text-white">{selectedTeamName}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/issues/active");
                }}
                className="px-4 py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer shadow-md"
              >
                View Issues in Workspace
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setIssues([]);
                  setSelectedIssueNumbers(new Set());
                }}
                className="px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition cursor-pointer"
              >
                Import more
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL FOOTER                                                  */}
        {/* ============================================================== */}
        {step !== 3 && (
          <div className="px-5 py-3 border-t border-white/[0.08] flex items-center justify-between bg-[#10111a] shrink-0">
            {step === 1 ? (
              <>
                <div className="text-[11px] text-[#707383]">
                  Supports public and private GitHub repositories
                </div>
                <button
                  type="button"
                  onClick={handleFetchIssues}
                  disabled={isLoadingIssues}
                  className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  {isLoadingIssues ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching issues...</span>
                    </>
                  ) : (
                    <>
                      <span>Fetch Issues</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isImporting}
                  className="px-3 py-1.5 rounded-md text-xs text-[#8a8f98] hover:text-white transition cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleRunImport}
                  disabled={isImporting || selectedIssueNumbers.size === 0}
                  className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Importing {selectedIssueNumbers.size} issues...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Import {selectedIssueNumbers.size} Issues</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

