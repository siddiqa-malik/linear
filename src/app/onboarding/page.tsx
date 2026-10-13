"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Button } from "@/components/ui/Button";
import { LinearLogo } from "@/components/icons/LinearLogo";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Moon,
  Sun,
  GitBranch,
  CheckCircle2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedImport, setSelectedImport] = useState<string | null>(null);
  const [inviteEmails, setInviteEmails] = useState(["", ""]);

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      router.push("/projects");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5e6ad2]/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="flex items-center gap-2 mb-8 z-10">
        <LinearLogo className="w-6 h-6 text-white" />
        <span className="font-semibold tracking-wider text-[15px]">LINEAR</span>
      </div>

      <div className="w-full max-w-lg bg-[#0d0e12]/80 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        <StepIndicator currentStep={step} totalSteps={6} />

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-[22px] font-semibold text-white tracking-wide mb-2">
                Welcome to Linear
              </h2>
              <p className="text-[13px] text-[#8a8f98]">
                Let's set up your profile to collaborate with your engineering team.
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
                What is your full name?
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Karri Saarinen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#12141a] border border-white/[0.08] focus:border-[#5e6ad2] rounded-lg px-3.5 py-2.5 text-[14px] text-white focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-[22px] font-semibold text-white tracking-wide mb-2">
                Create your workspace
              </h2>
              <p className="text-[13px] text-[#8a8f98]">
                Where your team plans, tracks, and delivers software.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
                  Workspace name
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                    setWorkspaceUrl(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                  }}
                  className="w-full bg-[#12141a] border border-white/[0.08] focus:border-[#5e6ad2] rounded-lg px-3.5 py-2.5 text-[14px] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#8a8f98] mb-1.5">
                  Workspace URL
                </label>
                <div className="flex items-center bg-[#12141a] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-[14px] text-[#8a8f98]">
                  <span>linear.app/</span>
                  <input
                    type="text"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    className="bg-transparent text-white focus:outline-none flex-1 ml-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-[22px] font-semibold text-white tracking-wide mb-2">
                Choose your theme
              </h2>
              <p className="text-[13px] text-[#8a8f98]">
                You can change this anytime in your preferences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "dark", label: "Linear Dark", icon: Moon, desc: "Default high-focus palette" },
                { id: "light", label: "Clean Light", icon: Sun, desc: "Bright contrast daytime" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTheme(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedTheme === t.id
                      ? "bg-[#5e6ad2]/15 border-[#5e6ad2] shadow-lg shadow-[#5e6ad2]/10"
                      : "bg-[#12141a] border-white/[0.06] hover:border-white/[0.14]"
                  }`}
                >
                  <t.icon className="w-5 h-5 text-white mb-2" />
                  <h4 className="text-[14px] font-semibold text-white">{t.label}</h4>
                  <p className="text-[11px] text-[#8a8f98] mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-[22px] font-semibold text-white tracking-wide mb-2">
                Import existing issues
              </h2>
              <p className="text-[13px] text-[#8a8f98]">
                Migrate tickets directly into your new workspace or start fresh.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: "github", label: "GitHub Issues", desc: "Sync repositories & pull requests" },
                { id: "jira", label: "Jira Software", desc: "Import epics, stories & sprints" },
                { id: "asana", label: "Asana", desc: "Bring tasks, boards & assignees" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImport(item.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedImport === item.id
                      ? "bg-[#5e6ad2]/15 border-[#5e6ad2]"
                      : "bg-[#12141a] border-white/[0.06] hover:bg-white/[0.03]"
                  }`}
                >
                  <div>
                    <h4 className="text-[13px] font-semibold text-white">{item.label}</h4>
                    <p className="text-[11px] text-[#8a8f98]">{item.desc}</p>
                  </div>
                  {selectedImport === item.id && <CheckCircle2 className="w-4 h-4 text-[#5e6ad2]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-[22px] font-semibold text-white tracking-wide mb-2">
                Invite your teammates
              </h2>
              <p className="text-[13px] text-[#8a8f98]">
                Software is better built together. Send invitations via email.
              </p>
            </div>

            <div className="space-y-3">
              {inviteEmails.map((email, idx) => (
                <input
                  key={idx}
                  type="email"
                  placeholder={`teammate-${idx + 1}@company.com`}
                  value={email}
                  onChange={(e) => {
                    const next = [...inviteEmails];
                    next[idx] = e.target.value;
                    setInviteEmails(next);
                  }}
                  className="w-full bg-[#12141a] border border-white/[0.08] focus:border-[#5e6ad2] rounded-lg px-3.5 py-2 text-[13px] text-white focus:outline-none"
                />
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-[24px] font-bold text-white tracking-wide">
              You're all set!
            </h2>
            <p className="text-[13px] text-[#8a8f98] max-w-sm mx-auto leading-relaxed">
              Your workspace is ready. Press **C** anywhere in the app to create your first issue, or press **⌘K** to open the command palette.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/[0.06]">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              size="sm"
              className="flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={handleNext}
            size="sm"
            className="linear-button-primary text-white flex items-center gap-1.5 font-medium px-4"
          >
            <span>{step === 6 ? "Go to Workspace" : "Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
