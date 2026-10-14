"use client";

import React, { useState } from "react";
import { ArrowRight, X, Check } from "lucide-react";

export function OpenPositionsSection() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    message: "",
  });

  const departments = [
    {
      name: "Engineering",
      roles: [
        { title: "Senior Full Stack Engineer", location: "Remote (US / Europe)" },
        { title: "Senior Frontend Engineer", location: "Remote (US / Europe)" },
        { title: "Senior Infrastructure Engineer", location: "Remote (US / Europe)" },
      ],
    },
    {
      name: "Product & Design",
      roles: [
        { title: "Product Designer", location: "Remote (US / Europe)" },
        { title: "Design Systems Engineer", location: "Remote (US / Europe)" },
      ],
    },
    {
      name: "Growth & Marketing",
      roles: [
        { title: "Product Marketing Manager", location: "Remote (US / Europe)" },
        { title: "Technical Content Writer", location: "Remote (US / Europe)" },
      ],
    },
    {
      name: "Operations & Support",
      roles: [
        { title: "Customer Support Engineer", location: "Remote (US / Europe)" },
        { title: "Executive Operations Lead", location: "Remote (US / Europe)" },
      ],
    },
  ];

  const handleApply = (roleTitle: string) => {
    setSelectedJob(roleTitle);
    setSubmitted(false);
    setFormData({ name: "", email: "", portfolio: "", message: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="positions" className="relative isolate pt-24 pb-36 overflow-hidden">
      {/* Background Graphic Asset: career-footer-bg.png positioned behind open positions */}
      <div className="pointer-events-none absolute -bottom-24 sm:-bottom-44 left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] md:w-[980px] aspect-square -z-10 select-none flex justify-center">
        <img
          src="/career-footer-bg.png"
          alt="Careers Footer Graphic"
          className="w-full h-full object-contain opacity-90"
          loading="lazy"
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
            Join us. And help us bring software magic back.
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] leading-relaxed">
            We’re looking for extraordinary people who take pride in their craft and want to build the future of software.
          </p>
        </div>

        {/* Roles List grouped by department */}
        <div className="mt-16 space-y-12">
          {departments.map((dept) => (
            <div key={dept.name} className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#818cf8]">
                {dept.name}
              </h3>

              <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-[#0c0d14]/70 backdrop-blur-md overflow-hidden">
                {dept.roles.map((role) => (
                  <div
                    key={role.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:px-6 hover:bg-white/[0.03] transition-colors gap-3"
                  >
                    <div>
                      <h4 className="text-[15px] font-medium text-white tracking-tight">
                        {role.title}
                      </h4>
                      <p className="text-xs text-[#8a8f98] mt-0.5 font-mono">
                        {role.location}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApply(role.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#818cf8] hover:text-white transition-colors cursor-pointer group"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0e18] p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-[#8a8f98] hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 flex items-center justify-center text-white">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">Application Received!</h3>
                <p className="text-xs text-[#8a8f98] max-w-xs mx-auto">
                  Thank you for applying for <span className="text-white font-medium">{selectedJob}</span>. We review all applications and will get back to you soon.
                </p>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="mt-4 px-5 py-2 rounded-full bg-[#5e6ad2] text-xs font-medium text-white hover:bg-[#6e7bf0] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#818cf8]">
                  Job Application
                </span>
                <h3 className="text-xl font-semibold text-white mt-1 mb-4">
                  {selectedJob}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#8a8f98] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#141624] border border-white/10 text-xs text-white placeholder-[#5a5f6b] focus:outline-none focus:border-[#5e6ad2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8a8f98] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#141624] border border-white/10 text-xs text-white placeholder-[#5a5f6b] focus:outline-none focus:border-[#5e6ad2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8a8f98] mb-1">
                      Resume / Portfolio / GitHub Link
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full h-10 px-3.5 rounded-xl bg-[#141624] border border-white/10 text-xs text-white placeholder-[#5a5f6b] focus:outline-none focus:border-[#5e6ad2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8a8f98] mb-1">
                      Why Linear? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about what you love to build..."
                      className="w-full p-3 rounded-xl bg-[#141624] border border-white/10 text-xs text-white placeholder-[#5a5f6b] focus:outline-none focus:border-[#5e6ad2]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#5e6ad2] hover:bg-[#6e7bf0] text-xs font-semibold text-white transition-all shadow-[0_2px_12px_rgba(94,106,210,0.35)] cursor-pointer"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
