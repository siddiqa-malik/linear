"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSettings } from "@/types/user";
import { api } from "@/lib/api";

interface UIContextType {
  theme: "dark" | "light" | "system";
  compactView: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  createModalOpen: boolean;
  createProjectModalOpen: boolean;
  activeIssueId: string | null;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setCompactView: (compact: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  setCreateProjectModalOpen: (open: boolean) => void;
  setActiveIssueId: (id: string | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"dark" | "light" | "system">("dark");
  const [compactView, setCompactViewState] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState<boolean>(false);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

  // Global Keyboard shortcuts (⌘K for command palette, N for new issue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl/Cmd modifier shortcuts first
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === "k") {
          e.preventDefault();
          setCommandPaletteOpen((prev) => !prev);
        }
        // Never hijack Ctrl+C / Cmd+C (Copy) or any other modifier combos
        return;
      }

      // Don't trigger if user is typing inside an input, textarea or editable field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest?.("input, textarea, [contenteditable='true']")
      ) {
        return;
      }

      // Single-key shortcut: 'N' for New Issue
      if (!e.altKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        setCreateModalOpen(true);
      } else if (e.key === "Escape") {
        setActiveIssueId(null);
        setCommandPaletteOpen(false);
        setCreateModalOpen(false);
        setCreateProjectModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const setTheme = (newTheme: "dark" | "light" | "system") => {
    setThemeState(newTheme);
    api.put("/settings", { theme: newTheme }).catch(() => {});
  };

  const setCompactView = (newCompact: boolean) => {
    setCompactViewState(newCompact);
    api.put("/settings", { compactView: newCompact }).catch(() => {});
  };

  return (
    <UIContext.Provider
      value={{
        theme,
        compactView,
        sidebarCollapsed,
        commandPaletteOpen,
        createModalOpen,
        createProjectModalOpen,
        activeIssueId,
        setTheme,
        setCompactView,
        setSidebarCollapsed,
        setCommandPaletteOpen,
        setCreateModalOpen,
        setCreateProjectModalOpen,
        setActiveIssueId,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}