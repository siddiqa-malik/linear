"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { User, Check, Search } from "lucide-react";

interface UserPickerProps {
  users: Array<{ _id: string; name: string; email: string }>;
  selectedUserId?: string;
  onSelect: (userId: string) => void;
}

export function UserPicker({ users, selectedUserId, onSelect }: UserPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = users.find((u) => u._id === selectedUserId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#12141a] border border-white/[0.08] hover:border-white/[0.16] text-[12px] text-white transition-colors"
      >
        {selectedUser ? (
          <>
            <Avatar name={selectedUser.name || selectedUser.email} size="sm" className="w-4 h-4 text-[9px]" />
            <span>{selectedUser.name || selectedUser.email}</span>
          </>
        ) : (
          <>
            <User className="w-3.5 h-3.5 text-[#8a8f98]" />
            <span className="text-[#8a8f98]">Assignee</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-56 bg-[#0f1015] border border-white/[0.1] rounded-lg shadow-2xl p-1 z-50">
          <div className="p-1 mb-1">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.04] rounded text-[12px]">
              <Search className="w-3 h-3 text-[#8a8f98]" />
              <input
                type="text"
                placeholder="Search member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-white focus:outline-none w-full text-[12px]"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filtered.map((u) => (
              <button
                key={u._id}
                type="button"
                onClick={() => {
                  onSelect(u._id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/[0.06] text-left text-[12px] text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Avatar name={u.name || u.email} size="sm" className="w-4 h-4 text-[9px]" />
                  <span>{u.name || u.email}</span>
                </div>
                {u._id === selectedUserId && <Check className="w-3.5 h-3.5 text-[#5e6ad2]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
