"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Trash2, Shield, User } from "lucide-react";

interface MembersTableProps {
  members: Array<{
    _id: string;
    userId: { _id: string; name: string; email: string };
    role: string;
    createdAt?: string;
  }>;
  onRemove: (id: string) => void;
}

export function MembersTable({ members, onRemove }: MembersTableProps) {
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-[#0d0e12]/60 divide-y divide-white/[0.04]">
      <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-white/[0.02] text-[11px] font-medium text-[#8a8f98] uppercase tracking-wider font-mono">
        <div className="col-span-6">Member</div>
        <div className="col-span-3">Role</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {members.map((m) => (
        <div key={m._id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-white/[0.02]">
          <div className="col-span-6 flex items-center gap-3">
            <Avatar name={m.userId?.name || m.userId?.email} size="sm" className="w-7 h-7 text-[11px]" />
            <div>
              <p className="text-[13px] font-medium text-white">{m.userId?.name || "User"}</p>
              <p className="text-[11px] text-[#8a8f98]">{m.userId?.email}</p>
            </div>
          </div>

          <div className="col-span-3 flex items-center gap-1.5 text-[12px] text-[#e2e4e9]">
            {m.role === "admin" ? <Shield className="w-3.5 h-3.5 text-[#5e6ad2]" /> : <User className="w-3.5 h-3.5 text-[#8a8f98]" />}
            <span className="capitalize">{m.role}</span>
          </div>

          <div className="col-span-3 flex justify-end">
            <button
              onClick={() => onRemove(m._id)}
              className="p-1.5 rounded text-[#8a8f98] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove member"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
