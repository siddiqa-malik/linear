"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlowEffectProps {
  /** Hex or RGBA color. Default is Linear signature '#455EB5' */
  color?: string;
  /** Shape and spread preset */
  variant?: "hero" | "spotlight" | "ambient" | "beacon" | "ellipse";
  /** Size scale */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  /** Custom blur intensity */
  blur?: "md" | "lg" | "xl" | "2xl" | "3xl";
  /** Opacity override from 0 to 1 */
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GlowEffect({
  color = "#455EB5",
  variant = "spotlight",
  size = "lg",
  blur = "3xl",
  opacity,
  className,
  style,
}: GlowEffectProps) {
  // Size dimensions map
  const sizeClasses = {
    sm: "w-[240px] h-[160px]",
    md: "w-[420px] h-[260px]",
    lg: "w-[650px] h-[400px]",
    xl: "w-[900px] h-[550px]",
    "2xl": "w-[1200px] h-[700px]",
    "7xl": "w-[700px] h-[2000px]",
  }[size];

  // Blur map
  const blurClasses = {
    md: "blur-xl",
    lg: "blur-2xl",
    xl: "blur-[90px]",
    "2xl": "blur-[130px]",
    "3xl": "blur-[160px]",
  }[blur];

  // Specific variant layouts
  if (variant === "hero") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 -z-10 select-none overflow-visible",
          className
        )}
        style={style}
      >
        <div
          className={cn("rounded-full", sizeClasses, blurClasses)}
          style={{
            background: `radial-gradient(circle 600px at 50% 30%, ${color}, rgba(69, 94, 181, 0.15) 50%, transparent 75%)`,
            opacity: opacity ?? 0.35,
          }}
        />
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] h-[350px] rounded-full blur-[120px]"
          style={{
            background: color,
            opacity: opacity ? opacity * 0.45 : 0.18,
          }}
        />
      </div>
    );
  }

  if (variant === "ambient") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 -z-10 flex items-center justify-center select-none", className)}
        style={style}
      >
        <div
          className={cn("rounded-full", sizeClasses, blurClasses)}
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${color}, transparent 70%)`,
            opacity: opacity ?? 0.22,
          }}
        />
      </div>
    );
  }

  if (variant === "beacon") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute -z-10 flex items-center justify-center select-none", className)}
        style={style}
      >
        <div
          className="w-24 h-24 rounded-full blur-2xl"
          style={{
            background: color,
            opacity: opacity ?? 0.65,
          }}
        />
      </div>
    );
  }

  // Default spotlight / ellipse
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 select-none",
        sizeClasses,
        blurClasses,
        className
      )}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        opacity: opacity ?? 0.3,
        ...style,
      }}
    />
  );
}
