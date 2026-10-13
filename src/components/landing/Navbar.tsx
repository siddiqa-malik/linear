"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LinearLogo } from "../icons/LinearLogo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Method", href: "/method" },
    { label: "Customers", href: "/customers" },
    { label: "Changelog", href: "/changelog" },
    { label: "Integrations", href: "/integrations" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050506]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Left: Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 text-white transition hover:opacity-90">
          <LinearLogo className="h-4.5 w-4.5 text-white" />
          <span className="text-sm font-semibold tracking-tight text-white">Linear</span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] transition ${
                  isActive
                    ? "font-medium text-white"
                    : "font-normal text-[#8a8f98] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#8a8f98] transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="linear-button-primary rounded-full px-4 py-1.5 text-[13px] font-medium text-white shadow-lg shadow-[#5e6ad2]/20 transition"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-1.5 text-[#8a8f98] hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-white/[0.08] bg-[#0a0c1e] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-[#8a8f98] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <Link href="/login" className="text-sm text-[#8a8f98] hover:text-white">
                Log in
              </Link>
              <Link href="/signup" className="text-sm text-white font-medium">
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
