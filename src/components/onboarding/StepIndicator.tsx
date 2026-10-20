"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={idx} className="flex items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-mono transition-all ${isCompleted
                ? "bg-[#5e6ad2] text-white"
                : isCurrent
                  ? "bg-white text-black font-semibold ring-4 ring-[#5e6ad2]/20"
                  : "bg-white/[0.06] text-[#62666d]"
                }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
            </div>
            {idx < totalSteps - 1 && (
              <div
                className={`w-6 h-0.5 mx-1 transition-colors ${stepNum < currentStep ? "bg-[#5e6ad2]" : "bg-white/[0.08]"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
