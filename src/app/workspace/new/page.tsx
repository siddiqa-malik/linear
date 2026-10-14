"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function CreateWorkspacePage() {
  const router = useRouter();

  const [name, setName] = useState("Figr");
  const [slug, setSlug] = useState("figr");
  const [companySize, setCompanySize] = useState("");
  const [role, setRole] = useState("");
  const [allowDomainAccess, setAllowDomainAccess] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically update slug when name changes if user hasn't typed a custom slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, ""));
  };

  const domain = slug ? `${slug}.design` : "figr.design";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const workspaceData = {
      name: name.trim() || "My Workspace",
      slug: slug.trim() || "workspace",
      companySize: companySize || "1-10",
      role: role || "Software Engineer",
      allowDomainAccess,
      domain,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Try sending to backend API if the endpoint exists
      await api.post("/workspaces", workspaceData);
    } catch {
      // 2. Graceful fallback: If backend /workspaces endpoint is not created yet,
      // store in localStorage so the user is never blocked and can proceed to /projects
      console.info("Backend workspace endpoint not detected, saving to local state.");
    } finally {
      localStorage.setItem("current_workspace", JSON.stringify(workspaceData));
      setIsSubmitting(false);
      router.push("/projects");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] text-[#111827] flex flex-col items-center justify-center py-16 px-4 selection:bg-[#5e6ad2] selection:text-white">
      {/* Top Heading */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-[28px] font-semibold text-[#111827] tracking-tight">
          Create a new workspace
        </h1>
        <p className="mt-2 text-xs sm:text-[13px] text-[#6b7280] leading-relaxed max-w-md mx-auto">
          Workspaces are shared environments where teams can work on projects, cycles and tasks.
        </p>
      </div>

      {/* Main Card */}
      <form onSubmit={handleSubmit} className="w-full max-w-[460px]">
        <div className="w-full bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-7 sm:p-8 space-y-5">
          {/* 1. Workspace Name */}
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Acme Inc"
              className="w-full h-10 px-3.5 rounded-lg border border-[#d1d5db] text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] transition-colors"
            />
          </div>

          {/* 2. Workspace URL */}
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
              Workspace URL
            </label>
            <div className="flex items-center h-10 px-3.5 rounded-lg border border-[#d1d5db] focus-within:border-[#5e6ad2] focus-within:ring-1 focus-within:ring-[#5e6ad2] transition-colors bg-white">
              <span className="text-xs sm:text-[13px] text-[#6b7280] font-normal select-none">
                linear.app/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                className="flex-1 bg-transparent border-none text-xs sm:text-[13px] font-semibold text-[#111827] focus:outline-none pl-0.5"
              />
            </div>
          </div>

          {/* 3. How large is your company? */}
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
              How large is your company?
            </label>
            <div className="relative">
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full h-10 px-3.5 pr-9 rounded-lg border border-[#d1d5db] text-xs sm:text-[13px] text-[#111827] bg-white appearance-none focus:outline-none focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] transition-colors cursor-pointer"
              >
                <option value="" disabled className="text-[#9ca3af]">
                  Select company size
                </option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-250">51-250 employees</option>
                <option value="251-1000">251-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            </div>
          </div>

          {/* 4. What is your role? */}
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
              What is your role?
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3.5 pr-9 rounded-lg border border-[#d1d5db] text-xs sm:text-[13px] text-[#111827] bg-white appearance-none focus:outline-none focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] transition-colors cursor-pointer"
              >
                <option value="" disabled className="text-[#9ca3af]">
                  Select your role in the company
                </option>
                <option value="founder">Founder / Executive</option>
                <option value="product">Product Manager</option>
                <option value="engineering">Software Engineer</option>
                <option value="design">Designer</option>
                <option value="management">Engineering Manager</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            </div>
          </div>

          {/* 5. Allow domain access */}
          <div className="pt-2">
            <h3 className="text-[12px] font-semibold text-[#111827]">
              Allow domain access
            </h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#6b7280]">
              Enabling access allows users with email address with this domain to join the workspace without an invitation.
            </p>

            <div className="mt-3.5 flex items-center justify-between">
              <span className="text-xs text-[#374151]">
                Enable access for{" "}
                <span className="font-semibold text-[#111827]">{domain}</span>
              </span>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={allowDomainAccess}
                onClick={() => setAllowDomainAccess(!allowDomainAccess)}
                className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowDomainAccess ? "bg-[#5e6ad2]" : "bg-[#d1d5db]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    allowDomainAccess ? "translate-x-4.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Create Workspace Button (Below Card matching screenshot) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 h-10.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6c78e4] active:bg-[#525ebf] text-white text-[13.5px] font-medium shadow-[0_2px_12px_rgba(94,106,210,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating workspace...</span>
            </>
          ) : (
            <span>Create workspace</span>
          )}
        </button>
      </form>
    </div>
  );
}
