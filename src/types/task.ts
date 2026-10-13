export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  createdBy: string | UserSummary;
  assignedTo?: string | UserSummary | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: string | UserSummary;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  assignedTo?: string | "all";
  search?: string;
}