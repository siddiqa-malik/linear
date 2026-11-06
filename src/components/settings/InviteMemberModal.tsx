"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { Mail, Check, Copy } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      const res: any = await api.post("/workspaces/invite", {
        emails: [email.trim()],
        role: role,
        workspaceId: currentWorkspace?._id,
        teamName: currentWorkspace?.name || "Workspace",
        senderName: user?.name || (user?.email ? user.email.split("@")[0] : "A teammate"),
      });

      const link =
        res?.data?.inviteLink ||
        res?.inviteLink ||
        res?.data?.details?.[0]?.inviteLink ||
        "";

      if (link) {
        setInviteLink(link);
      }
      setEmail("");
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setInviteLink(null);
    setError("");
    setEmail("");
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Invite Teammates">
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8a8f98] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#12141a] border border-white/[0.08] focus:border-[#5e6ad2] rounded-lg pl-9 pr-3 py-2 text-[13px] text-white placeholder-[#62666d] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-[#12141a] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none cursor-pointer"
          >
            <option value="member">Member (Can create, edit & manage assigned tasks)</option>
            <option value="admin">Admin (Full project management access)</option>
          </select>
        </div>

        {error && <p className="text-[12px] text-rose-400">{error}</p>}

        {inviteLink && (
          <div className="p-3 rounded-lg bg-[#11121d] border border-[#2a2c42] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#10b981] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Invitation sent!
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6875e5] text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#8a8f98] font-mono truncate select-all">{inviteLink}</p>
            <p className="text-[10px] text-[#6b7280]">
              If email is delayed in recipient's spam folder, you can share this link directly with them.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleModalClose} size="sm">
            {inviteLink ? "Done" : "Cancel"}
          </Button>
          <Button type="submit" size="sm" className="linear-button-primary text-white" disabled={isLoading}>
            {isLoading ? "Sending..." : inviteLink ? "Send Another" : "Send Invite"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
