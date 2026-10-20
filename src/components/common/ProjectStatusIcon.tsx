import React from "react";

export type ProjectStatusKey =
  | "backlog"
  | "planned"
  | "in_progress"
  | "paused"
  | "completed"
  | "canceled"
  | "active"
  | "archived";

interface ProjectStatusIconProps {
  status: string;
  className?: string;
}

export function ProjectStatusIcon({
  status,
  className = "w-3.5 h-3.5 shrink-0",
}: ProjectStatusIconProps) {
  const norm = status?.toLowerCase() || "planned";

  // 1. Backlog: Dotted amber/orange circle
  if (norm === "backlog") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="8"
          r="5.8"
          stroke="#d97706"
          strokeWidth="1.8"
          strokeDasharray="1.6 2.0"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 2. Planned: Silver/gray hexagon outline
  if (norm === "planned") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2.2L13.2 5.2V10.8L8 13.8L2.8 10.8V5.2Z"
          stroke="#9ca3af"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 3. In Progress (or active): Yellow/gold hexagon with half-filled circle
  if (norm === "in_progress" || norm === "active") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2.2L13.2 5.2V10.8L8 13.8L2.8 10.8V5.2Z"
          stroke="#eab308"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="3.2" stroke="#eab308" strokeWidth="0.9" fill="none" />
        <path d="M8 4.8 A3.2 3.2 0 0 1 8 11.2 Z" fill="#eab308" />
      </svg>
    );
  }

  // Paused: Yellow hexagon with pause bars
  if (norm === "paused") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2.2L13.2 5.2V10.8L8 13.8L2.8 10.8V5.2Z"
          stroke="#eab308"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M6.5 6V10M9.5 6V10" stroke="#eab308" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Completed: Solid filled purple/indigo hexagon with dark checkmark
  if (norm === "completed") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2.2L13.2 5.2V10.8L8 13.8L2.8 10.8V5.2Z"
          fill="#5e6ad2"
          stroke="#5e6ad2"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 8.2L7.2 9.9L10.8 6.3"
          stroke="#10111a"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 5. Canceled (or archived): Gray hexagon with cross X
  if (norm === "canceled" || norm === "archived") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2.2L13.2 5.2V10.8L8 13.8L2.8 10.8V5.2Z"
          stroke="#707383"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="rgba(112, 115, 131, 0.2)"
        />
        <path
          d="M6 6L10 10M10 6L6 10"
          stroke="#9ca3af"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Default fallback: Silver hexagon
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2.2L13.2 5.2V10.8L8 13.8L2.8 10.8V5.2Z"
        stroke="#9ca3af"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
