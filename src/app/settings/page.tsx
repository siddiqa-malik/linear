"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Building2, Save } from "lucide-react";

export default function SettingsGeneralPage() {
  const [workspaceName, setWorkspaceName] = useState("Acme Labs");
  const [workspaceUrl, setWorkspaceUrl] = useState("acme");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-white tracking-wide mb-1">
          General Settings
        </h1>
        <p className="text-[13px] text-[#8a8f98]">
          Manage your organization workspace name and unique URL identifier.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-xl bg-[#0d0e12] border border-white/[0.06] space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
              Workspace Name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-[#12141a] border border-white/[0.08] focus:border-[#5e6ad2] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
              Workspace URL
            </label>
            <div className="flex items-center bg-[#12141a] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-[#8a8f98]">
              <span>linear.app/</span>
              <input
                type="text"
                value={workspaceUrl}
                onChange={(e) => setWorkspaceUrl(e.target.value)}
                className="bg-transparent text-white focus:outline-none flex-1 ml-1"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" className="linear-button-primary text-white flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </Button>
          {isSaved && <span className="text-[12px] text-emerald-400">Settings saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
