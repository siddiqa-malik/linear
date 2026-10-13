"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { Mail } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      await api.post("/invitations", { email: email.trim(), role });
      setEmail("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Teammates">
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

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" size="sm" className="linear-button-primary text-white" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
