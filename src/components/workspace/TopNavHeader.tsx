"use client";

import React from "react";
import Link from "next/link";
import {
  Kanban,
  List as ListIcon,
  Search,
  Plus,
  PanelRight,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";

interface TopNavHeaderProps {
  projectName?: string;
  viewMode: "board" | "list";
  setViewMode: (mode: "board" | "list") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewIssue: () => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
}

export function TopNavHeader({
  projectName,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onNewIssue,
  isInspectorOpen,
  setIsInspectorOpen,
}: TopNavHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.06]">
      {/* Left: Breadcrumbs & View Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[13px]">
          <Link href="/projects" className="text-[#8a8f98] hover:text-white transition-colors">
            Projects
          </Link>
          <span className="text-[#62666d]">/</span>
          <span className="font-semibold text-white tracking-wide">
            {projectName || "All Issues"}
          </span>
        </div>

        {/* View Switcher (Board vs List) */}
        <div className="flex items-center bg-[#12141a] p-0.5 rounded-lg border border-white/[0.06] ml-2">
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
              viewMode === "board"
                ? "bg-white/[0.1] text-white shadow-sm"
                : "text-[#8a8f98] hover:text-white"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Board
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
              viewMode === "list"
                ? "bg-white/[0.1] text-white shadow-sm"
                : "text-[#8a8f98] hover:text-white"
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {/* Right: Search, Inspector Toggle & New Issue */}
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <div className="relative w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#8a8f98] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12141a] border border-white/[0.08] focus:border-[#5e6ad2] rounded-md pl-8 pr-3 py-1 text-[12px] text-white placeholder-[#62666d] focus:outline-none transition-colors"
          />
        </div>

        {/* Inspector Rail Toggle */}
        <button
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          className={`p-1.5 rounded-md border text-[12px] transition-colors ${
            isInspectorOpen
              ? "bg-[#5e6ad2]/20 border-[#5e6ad2]/40 text-white"
              : "bg-[#12141a] border-white/[0.08] text-[#8a8f98] hover:text-white"
          }`}
          title="Toggle Properties Panel"
        >
          <PanelRight className="w-4 h-4" />
        </button>

        {/* New Issue Button */}
        <Button
          onClick={onNewIssue}
          size="sm"
          className="linear-button-primary text-white flex items-center gap-1.5 text-[12px] font-medium py-1 px-3"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New issue</span>
          <Kbd className="bg-black/30 border-white/20 text-[10px] ml-1">N</Kbd>
        </Button>
      </div>
    </div>
  );
}
