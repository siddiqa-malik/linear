import { UserSummary } from "./task";

export type NotificationType = "task_assigned" | "task_updated" | "comment_added" | "project_invitation" | "system";

export interface Notification {
  _id: string;
  recipientId: string;
  senderId?: string | UserSummary;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Invitation {
  _id: string;
  projectId: string;
  inviterId: string | UserSummary;
  email: string;
  role: "owner" | "admin" | "member";
  token: string;
  status: "pending" | "accepted" | "rejected";
  expiresAt?: string;
  createdAt: string;
}