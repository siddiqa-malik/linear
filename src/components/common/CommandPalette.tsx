"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useUI } from "@/context/UIContext";
import { Search, FolderKanban, Inbox, CheckSquare, Plus, SunMoon, LayoutList } from "lucide-react";
import { useRouter } from "next/navigation";
import { Kbd } from "../ui/Kbd";

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCreateModalOpen,
    compactView,
    setCompactView,
    theme,
    setTheme,
  } = useUI();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const commands = [
    {
      id: "create-issue",
      title: "Create new issue...",
      shortcut: "N",
      icon: Plus,
      action: () => {
        setCommandPaletteOpen(false);
        setCreateModalOpen(true);
      },
    },
    {
      id: "inbox",
      title: "Go to Inbox",
      shortcut: "G I",
      icon: Inbox,
      action: () => {
        setCommandPaletteOpen(false);
        router.push("/inbox");
      },
    },
    {
      id: "my-issues",
      title: "Go to My Issues",
      shortcut: "G M",
      icon: CheckSquare,
      action: () => {
        setCommandPaletteOpen(false);
        router.push("/my-issues");
      },
    },
    {
      id: "projects",
      title: "Go to Projects",
      shortcut: "G P",
      icon: FolderKanban,
      action: () => {
        setCommandPaletteOpen(false);
        router.push("/projects");
      },
    },
    {
      id: "compact-view",
      title: `Toggle Compact View (Currently ${compactView ? "Enabled" : "Disabled"})`,
      shortcut: "",
      icon: LayoutList,
      action: () => {
        setCompactView(!compactView);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "theme",
      title: `Toggle Theme (Current: ${theme})`,
      shortcut: "",
      icon: SunMoon,
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal
      isOpen={commandPaletteOpen}
      onClose={() => setCommandPaletteOpen(false)}
      className="p-0 max-w-lg"
    >
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4 py-3">
        <Search className="h-4 w-4 text-[#8a8f98]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search..."
          className="w-full bg-transparent text-xs text-white placeholder:text-[#62666d] outline-none"
        />
        <Kbd>Esc</Kbd>
      </div>

      <div className="max-h-72 overflow-y-auto p-2">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
          Navigation & Actions
        </div>
        <div className="space-y-0.5">
          {filteredCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs text-[#8a8f98] transition hover:bg-white/[0.05] hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 text-[#5e6ad2]" />
                  <span>{cmd.title}</span>
                </div>
                {cmd.shortcut && <Kbd>{cmd.shortcut}</Kbd>}
              </button>
            );
          })}
          {filteredCommands.length === 0 && (
            <div className="py-8 text-center text-xs text-[#62666d]">
              No matching commands found
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}