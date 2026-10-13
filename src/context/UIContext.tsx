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
  activeIssueId: string | null;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setCompactView: (compact: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  setActiveIssueId: (id: string | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"dark" | "light" | "system">("dark");
  const [compactView, setCompactViewState] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

  // Global Keyboard shortcuts (⌘K for command palette, C for new issue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setCreateModalOpen(true);
      } else if (e.key === "Escape") {
        setActiveIssueId(null);
        setCommandPaletteOpen(false);
        setCreateModalOpen(false);
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
        activeIssueId,
        setTheme,
        setCompactView,
        setSidebarCollapsed,
        setCommandPaletteOpen,
        setCreateModalOpen,
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