import { TaskPriority, TaskStatus } from "@/types/task";

export const TASK_STATUSES: {
  id: TaskStatus;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "todo",
    label: "Todo",
    color: "#8a8f98",
    bgColor: "rgba(138, 143, 152, 0.15)",
  },
  {
    id: "in-progress",
    label: "In Progress",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
  },
  {
    id: "completed",
    label: "Done",
    color: "#5e6ad2",
    bgColor: "rgba(94, 106, 210, 0.15)",
  },
];

export const TASK_PRIORITIES: {
  id: TaskPriority;
  label: string;
  color: string;
  bars: number;
}[] = [
  { id: "high", label: "High", color: "#f97316", bars: 3 },
  { id: "medium", label: "Medium", color: "#eab308", bars: 2 },
  { id: "low", label: "Low", color: "#94a3b8", bars: 1 },
];