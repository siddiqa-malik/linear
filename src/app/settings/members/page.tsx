"use client";

import React, { useState } from "react";
import { MembersTable } from "@/components/settings/MembersTable";
import { InviteMemberModal } from "@/components/settings/InviteMemberModal";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";

export default function SettingsMembersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [members, setMembers] = useState([
    {
      _id: "1",
      userId: { _id: "u1", name: "Alex Rivera", email: "alex@linear.app" },
      role: "admin",
    },
    {
      _id: "2",
      userId: { _id: "u2", name: "Sarah Chen", email: "sarah@linear.app" },
      role: "member",
    },
  ]);

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m._id !== id));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-white tracking-wide mb-1">
            Workspace Members
          </h1>
          <p className="text-[13px] text-[#8a8f98]">
            Manage team members and invite collaborators to your workspace.
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          size="sm"
          className="linear-button-primary text-white flex items-center gap-1.5 text-[12px]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Teammate</span>
        </Button>
      </div>

      <MembersTable members={members} onRemove={removeMember} />

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
