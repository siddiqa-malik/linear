"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSettings } from "@/types/user";
import { api } from "@/lib/api";

interface UIContextType {
  theme: "dark" | "light" | "system";
  compactView: boolean;
  emailNotifications: boolean;
  taskReminders: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  createModalOpen: boolean;
  createProjectModalOpen: boolean;
  activeIssueId: string | null;
  activeProjectId: string | null;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setCompactView: (compact: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setTaskReminders: (enabled: boolean) => void;
  updateUserSettings: (data: Partial<UserSettings>) => Promise<void>;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  setCreateProjectModalOpen: (open: boolean) => void;
  setActiveIssueId: (id: string | null) => void;
  setActiveProjectId: (id: string | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"dark" | "light" | "system">("dark");
  const [compactView, setCompactViewState] = useState<boolean>(false);
  const [emailNotifications, setEmailNotificationsState] = useState<boolean>(true);
  const [taskReminders, setTaskRemindersState] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState<boolean>(false);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

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

  /*
   * Fetches user settings on mount from /api/settings.
   * Backend auto-initializes defaults (theme: 'system', notifications: true, compactView: false)
   * if no settings document exists yet for this user.
   */
  useEffect(() => {
    api.get("/settings")
      .then((res: any) => {
        const data = res?.data || res;
        if (data) {
          if (data.theme) setThemeState(data.theme);
          if (typeof data.compactView === "boolean") setCompactViewState(data.compactView);
          if (typeof data.emailNotifications === "boolean") setEmailNotificationsState(data.emailNotifications);
          if (typeof data.taskReminders === "boolean") setTaskRemindersState(data.taskReminders);
        }
      })
      .catch(() => {});
  }, []);

  const updateUserSettings = async (data: Partial<UserSettings>) => {
    if (data.theme) setThemeState(data.theme);
    if (typeof data.compactView === "boolean") setCompactViewState(data.compactView);
    if (typeof data.emailNotifications === "boolean") setEmailNotificationsState(data.emailNotifications);
    if (typeof data.taskReminders === "boolean") setTaskRemindersState(data.taskReminders);
    await api.patch("/settings", data);
  };

  const setEmailNotifications = (enabled: boolean) => {
    setEmailNotificationsState(enabled);
    api.patch("/settings", { emailNotifications: enabled }).catch(() => {});
  };

  const setTaskReminders = (enabled: boolean) => {
    setTaskRemindersState(enabled);
    api.patch("/settings", { taskReminders: enabled }).catch(() => {});
  };

  const setTheme = (newTheme: "dark" | "light" | "system") => {
    setThemeState(newTheme);
    api.patch("/settings", { theme: newTheme }).catch(() => {});
  };

  const setCompactView = (newCompact: boolean) => {
    setCompactViewState(newCompact);
    api.patch("/settings", { compactView: newCompact }).catch(() => {});
  };

  return (
    <UIContext.Provider
      value={{
        theme,
        compactView,
        emailNotifications,
        taskReminders,
        sidebarCollapsed,
        commandPaletteOpen,
        createModalOpen,
        createProjectModalOpen,
        activeIssueId,
        activeProjectId,
        setTheme,
        setCompactView,
        setEmailNotifications,
        setTaskReminders,
        updateUserSettings,
        setSidebarCollapsed,
        setCommandPaletteOpen,
        setCreateModalOpen,
        setCreateProjectModalOpen,
        setActiveIssueId,
        setActiveProjectId,
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