import React from "react";

export type ProjectPriorityKey =
  | "none"
  | "no_priority"
  | "urgent"
  | "high"
  | "medium"
  | "low";

interface ProjectPriorityIconProps {
  priority?: string | null;
  className?: string;
}

export function ProjectPriorityIcon({
  priority,
  className = "w-3.5 h-3.5 shrink-0",
}: ProjectPriorityIconProps) {
  const norm = (priority || "none").toLowerCase().replace(/\s+/g, "_");

  // Urgent: rounded square with exclamation mark (matching Linear & media)
  if (norm === "urgent") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3" fill="#9ca3af" />
        <path
          d="M8 4.6v3.8M8 10.8v.6"
          stroke="#10111a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // High: 3 lit vertical signal bars
  if (norm === "high") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor">
        <rect x="2.5" y="9.5" width="2.5" height="4.5" rx="0.6" fill="#c5c8d6" />
        <rect x="6.8" y="6" width="2.5" height="8" rx="0.6" fill="#c5c8d6" />
        <rect x="11" y="2.5" width="2.5" height="11.5" rx="0.6" fill="#c5c8d6" />
      </svg>
    );
  }

  // Medium: 2 lit bars, 1 dimmed bar
  if (norm === "medium") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor">
        <rect x="2.5" y="9.5" width="2.5" height="4.5" rx="0.6" fill="#c5c8d6" />
        <rect x="6.8" y="6" width="2.5" height="8" rx="0.6" fill="#c5c8d6" />
        <rect
          x="11"
          y="2.5"
          width="2.5"
          height="11.5"
          rx="0.6"
          fill="#707383"
          opacity="0.3"
        />
      </svg>
    );
  }

  // Low: 1 lit bar, 2 dimmed bars
  if (norm === "low") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor">
        <rect x="2.5" y="9.5" width="2.5" height="4.5" rx="0.6" fill="#c5c8d6" />
        <rect
          x="6.8"
          y="6"
          width="2.5"
          height="8"
          rx="0.6"
          fill="#707383"
          opacity="0.3"
        />
        <rect
          x="11"
          y="2.5"
          width="2.5"
          height="11.5"
          rx="0.6"
          fill="#707383"
          opacity="0.3"
        />
      </svg>
    );
  }

  // None / No priority: 3 horizontal dashes (---)
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 8h2.2M6.9 8h2.2M11.3 8h2.2"
        stroke="#707383"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
