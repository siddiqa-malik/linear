"use client";

import React from "react";

export function CustomerLogosWall() {
  const logos = [
    { name: "Mercury", tag: "FINTECH" },
    { name: "OpenSea", tag: "WEB3" },
    { name: "Medallia", tag: "ENTERPRISE" },
    { name: "Brex", tag: "FINTECH" },
    { name: "Twingate", tag: "SECURITY" },
    { name: "Pitch", tag: "COLLABORATION" },
    { name: "Cohere", tag: "AI PLATFORM" },
    { name: "Raycast", tag: "DEVELOPER TOOLS" },
    { name: "MoonPay", tag: "CRYPTO" },
    { name: "ElevenLabs", tag: "VOICE AI" },
    { name: "Zed", tag: "CODE EDITOR" },
    { name: "Remote", tag: "HR TECH" },
    { name: "Rainbow", tag: "WALLET" },
    { name: "Pipe", tag: "CAPITAL" },
    { name: "Polywork", tag: "NETWORK" },
    { name: "Ada", tag: "AUTOMATION" },
    { name: "Amie", tag: "PRODUCTIVITY" },
    { name: "Primer", tag: "PAYMENTS" },
    { name: "Copilot", tag: "AI CODE" },
    { name: "Cursor", tag: "AI IDE" },
    { name: "Warp", tag: "TERMINAL" },
    { name: "Replit", tag: "DEV PLATFORM" },
    { name: "Resend", tag: "EMAIL INFRA" },
    { name: "Railway", tag: "CLOUD INFRA" },
    { name: "Supabase", tag: "DATABASE" },
    { name: "Vanta", tag: "COMPLIANCE" },
    { name: "Perplexity", tag: "AI SEARCH" },
    { name: "PostHog", tag: "ANALYTICS" },
    { name: "Airplane", tag: "INTERNAL TOOLS" },
    { name: "incident.io", tag: "INCIDENTS" },
    { name: "Scale AI", tag: "AI DATA" },
    { name: "Pulumi", tag: "INFRASTRUCTURE" },
    { name: "PlanetScale", tag: "DATABASE" },
    { name: "dbt Labs", tag: "DATA ENG" },
    { name: "WorkOS", tag: "ENTERPRISE SSO" },
    { name: "Hex", tag: "DATA ANALYTICS" },
    { name: "Kitemaker", tag: "DEV TOOLS" },
    { name: "Hightouch", tag: "DATA SYNC" },
    { name: "Livepeer", tag: "VIDEO INFRA" },
    { name: "DatoCMS", tag: "HEADLESS CMS" },
    { name: "Doppler", tag: "SECRETS OPS" },
    { name: "Pronto", tag: "LOGISTICS" },
    { name: "Mistral AI", tag: "FRONTIER AI" },
    { name: "Synthesia", tag: "AI MEDIA" },
    { name: "Anyscale", tag: "RAY COMPUTE" },
  ];

  return (
    <section className="relative py-20 md:py-32">
      {/* Background Starry Scatter Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 opacity-30"
      >
        <div className="h-[600px] w-[900px] rounded-full bg-gradient-to-b from-[#4338ca]/20 via-[#1e1b4b]/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Subtle section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#818cf8]">
            TRUSTED WORLDWIDE
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            High-output teams building on Linear
          </h2>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-6 text-center select-none">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center justify-center py-2 transition-all duration-200 cursor-default"
            >
              <span className="text-base sm:text-lg font-medium tracking-tight text-[#8a8f98] group-hover:text-white transition-colors duration-200">
                {logo.name}
              </span>
              <span className="mt-1 text-[9px] font-mono tracking-wider text-[#62666d] group-hover:text-[#818cf8] transition-colors">
                {logo.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
