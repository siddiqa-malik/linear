"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Workspace, CreateWorkspaceInput } from "@/types/workspace";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  fetchWorkspaces: () => Promise<Workspace[]>;
  createWorkspace: (input: CreateWorkspaceInput) => Promise<Workspace>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  sanitizeWorkspaceName: (name?: string) => string;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function sanitizeWorkspaceName(name?: string): string {
  if (!name || name.includes("'s Team") || name.includes("’s Team")) {
    return "Figr";
  }
  return name.trim();
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWorkspaces = useCallback(async (): Promise<Workspace[]> => {
    if (!isAuthenticated) {
      setWorkspaces([]);
      setCurrentWorkspaceState(null);
      return [];
    }

    setIsLoading(true);
    try {
      const res = await api.get("/workspaces");
      const list = res?.data || res || [];
      const validList: Workspace[] = Array.isArray(list) ? list : [];

      setWorkspaces(validList);

      setCurrentWorkspaceState((prev) => {
        if (prev && validList.some((w) => w._id === prev._id || w.slug === prev.slug)) {
          return prev;
        }
        return validList.length > 0 ? validList[0] : null;
      });

      return validList;
    } catch (err) {
      console.warn("Failed to fetch workspaces from backend:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspaceState(null);
    }
  }, [isAuthenticated, fetchWorkspaces]);

  const createWorkspace = async (input: CreateWorkspaceInput): Promise<Workspace> => {
    setIsLoading(true);
    try {
      const payload = {
        name: sanitizeWorkspaceName(input.name),
        slug: (input.slug || input.name).toLowerCase().replace(/[^a-z0-9-]/g, "") || "figr",
        companySize: input.companySize || "1-10",
        role: input.role || "Software Engineer",
      };

      const res = await api.post("/workspaces", payload);
      const created: Workspace = res?.data || res;

      // Update state in memory directly from backend response
      setWorkspaces((prev) => {
        const filtered = prev.filter((w) => w._id !== created._id && w.slug !== created.slug);
        return [created, ...filtered];
      });
      setCurrentWorkspaceState(created);

      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentWorkspace = (workspace: Workspace | null) => {
    setCurrentWorkspaceState(workspace);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        isLoading,
        fetchWorkspaces,
        createWorkspace,
        setCurrentWorkspace,
        sanitizeWorkspaceName,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
