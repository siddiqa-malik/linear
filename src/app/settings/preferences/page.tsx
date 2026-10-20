"use client";

import React from "react";
import { useUI } from "@/context/UIContext";
import { Kbd } from "@/components/ui/Kbd";
import { Monitor, Sun, Moon } from "lucide-react";

export default function SettingsPreferencesPage() {
  const { compactView, setCompactView, theme, setTheme } = useUI();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-white tracking-wide mb-1">
          Preferences
        </h1>
        <p className="text-[13px] text-[#8a8f98]">
          Customize your interface display density, theme and keyboard preferences.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#0d0e12] border border-white/[0.06] space-y-6">
        <div>
          <label className="block text-[13px] font-medium text-white mb-1.5">
            Interface Theme
          </label>
          <p className="text-[12px] text-[#8a8f98] mb-3">
            Choose your preferred Linear color scheme.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Linear Dark", icon: Moon },
              { id: "midnight", label: "Midnight", icon: Monitor },
              { id: "light", label: "Light", icon: Sun },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all ${
                    isSelected
                      ? "bg-[#5e6ad2]/20 border-[#5e6ad2] text-white"
                      : "bg-[#12141a] border-white/[0.06] text-[#8a8f98] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[12px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div>
            <h4 className="text-[13px] font-medium text-white mb-0.5">Compact Density</h4>
            <p className="text-[12px] text-[#8a8f98]">
              Display denser rows for high-volume task management.
            </p>
          </div>
          <input
            type="checkbox"
            checked={compactView}
            onChange={(e) => setCompactView(e.target.checked)}
            className="w-4 h-4 rounded accent-[#5e6ad2] cursor-pointer"
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Cheatsheet */}
      <div className="p-6 rounded-xl bg-[#0d0e12] border border-white/[0.06]">
        <h3 className="text-[14px] font-medium text-white mb-3">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
            <span className="text-[#8a8f98]">New Issue</span>
            <Kbd>N</Kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
            <span className="text-[#8a8f98]">Command Menu</span>
            <Kbd>⌘K</Kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
            <span className="text-[#8a8f98]">Close Modals</span>
            <Kbd>Esc</Kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
            <span className="text-[#8a8f98]">Toggle Properties</span>
            <Kbd>⌘I</Kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
