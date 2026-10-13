"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Users, Sliders, ArrowLeft, Shield } from "lucide-react";

export function SettingsSidebar() {
  const pathname = usePathname();

  const links = [
    { label: "General", href: "/settings", icon: Settings },
    { label: "Members & Invites", href: "/settings/members", icon: Users },
    { label: "Preferences", href: "/settings/preferences", icon: Sliders },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.06] bg-[#090a0d] p-4 flex flex-col justify-between">
      <div>
        <Link
          href="/projects"
          className="flex items-center gap-2 text-[12px] text-[#8a8f98] hover:text-white mb-6 px-2 py-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to workspace</span>
        </Link>

        <h2 className="text-[12px] font-semibold text-[#8a8f98] uppercase tracking-wider px-2 mb-2 font-mono">
          Workspace Settings
        </h2>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#5e6ad2]/15 text-white border border-[#5e6ad2]/30"
                    : "text-[#8a8f98] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#5e6ad2]" : "text-[#8a8f98]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-[#62666d]">
        <div className="flex items-center gap-1.5 text-[#8a8f98] mb-1">
          <Shield className="w-3.5 h-3.5 text-[#5e6ad2]" />
          <span className="font-medium">Linear Enterprise Ready</span>
        </div>
        <span>Encrypted RBAC workspace</span>
      </div>
    </aside>
  );
}
