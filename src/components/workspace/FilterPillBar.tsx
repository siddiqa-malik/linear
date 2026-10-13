"use client";

import React from "react";
import { Filter, X, Check } from "lucide-react";

interface FilterPillBarProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
}

export function FilterPillBar({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
  totalCount,
}: FilterPillBarProps) {
  const hasActiveFilters = statusFilter !== "all" || priorityFilter !== "all" || searchQuery !== "";

  const clearAll = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      <div className="flex items-center gap-1.5 text-[12px] text-[#8a8f98] mr-2">
        <Filter className="w-3.5 h-3.5" />
        <span>Filters:</span>
      </div>

      {/* Status Filter Pill */}
      <div className="flex items-center gap-1 bg-[#12141a] border border-white/[0.08] rounded-md px-2 py-1 text-[12px]">
        <span className="text-[#8a8f98] text-[11px]">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-transparent text-white focus:outline-none cursor-pointer text-[12px]"
        >
          <option value="all" className="bg-[#12141a]">All Statuses</option>
          <option value="todo" className="bg-[#12141a]">To Do</option>
          <option value="in-progress" className="bg-[#12141a]">In Progress</option>
          <option value="completed" className="bg-[#12141a]">Done</option>
        </select>
      </div>

      {/* Priority Filter Pill */}
      <div className="flex items-center gap-1 bg-[#12141a] border border-white/[0.08] rounded-md px-2 py-1 text-[12px]">
        <span className="text-[#8a8f98] text-[11px]">Priority:</span>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-transparent text-white focus:outline-none cursor-pointer text-[12px]"
        >
          <option value="all" className="bg-[#12141a]">All Priorities</option>
          <option value="high" className="bg-[#12141a]">High</option>
          <option value="medium" className="bg-[#12141a]">Medium</option>
          <option value="low" className="bg-[#12141a]">Low</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1 text-[11px] text-[#8a8f98] hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-3 h-3" /> Clear filters
        </button>
      )}

      <div className="ml-auto text-[11px] text-[#62666d] font-mono">
        Showing {totalCount} issues
      </div>
    </div>
  );
}
