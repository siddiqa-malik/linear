"use client";

import React, { Suspense } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#10111a] text-[#e2e4ef] overflow-hidden select-none">
      <Suspense fallback={<div className="w-[248px] shrink-0 h-screen bg-[#0d0e17] border-r border-[#1d1f30]" />}>
        <SettingsSidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto bg-[#10111a]">{children}</main>
    </div>
  );
}
