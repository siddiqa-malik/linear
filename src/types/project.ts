import { UserSummary } from "./task";

export type ProjectStatus = "active" | "archived";
export type MemberRole = "owner" | "admin" | "member";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  ownerId: string | UserSummary;
  status: ProjectStatus;
  projectStatus?: string;
  priority?: "none" | "urgent" | "high" | "medium" | "low" | string;
  lead?: { name?: string; email?: string; initials?: string } | string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
  members?: Array<{
    _id: string;
    userId: string | UserSummary;
    role: MemberRole;
  }>;
}

export interface ProjectMember {
  _id: string;
  projectId: string;
  userId: string | UserSummary;
  role: MemberRole;
  joinedAt?: string;
  createdAt: string;
}
