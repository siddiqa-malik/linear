"use client";

import React from "react";
import Link from "next/link";
import { LinearLogo } from "../icons/LinearLogo";
import { Twitter, Github } from "../icons/SocialIcons";
import { Globe } from "lucide-react";

export function Footer({ className = "" }: { className?: string }) {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Integrations", href: "/integrations" },
        { label: "Pricing", href: "/pricing" },
        { label: "Changelog", href: "/changelog" },
        { label: "Docs", href: "#" },
        { label: "Linear Method", href: "/method" },
        { label: "Direction 1", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "#" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Customers", href: "/customers" },
        { label: "Brand", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Community", href: "#" },
        { label: "Contact", href: "#" },
        { label: "DPA", href: "#" },
        { label: "Terms of service", href: "#" },
        { label: "Report a vulnerability", href: "#" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "API", href: "#" },
        { label: "Status", href: "#" },
        { label: "GitHub", href: "https://github.com" },
        { label: "Magic", href: "#" },
      ],
    },
  ];

  return (
    <footer
      className={`border-t border-white/[0.06] bg-transparent py-14 sm:py-20 text-xs text-[#8a8f98] ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Logo, Worldwide tag, and Social Icons */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex items-center gap-2 text-white">
              <LinearLogo className="h-4.5 w-4.5 text-white" />
              <span className="text-[13px] text-[#c0c4d0] font-normal tracking-tight">
                Linear - Designed Worldwide
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 text-[#8a8f98] mt-8 md:mt-auto">
              <a
                href="https://twitter.com/linear"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://github.com/linear"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 fill-current" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Global Community"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 4 Navigation Columns matching Linear Figma screenshot */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-[13px] font-medium text-white tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] sm:text-[13px] text-[#8a8f98] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}