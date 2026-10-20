"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LinearLogo } from "@/components/icons/LinearLogo";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar({ className = "" }: { className?: string }) {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCompanyDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Method", href: "/method" },
    { label: "Customers", href: "/customers" },
    { label: "Changelog", href: "/changelog" },
    { label: "Integrations", href: "/integrations" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,backdrop-filter,border-color] duration-200 ${
        scrolled
          ? "border-b border-white/[0.08] bg-transparent backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      } ${className}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Left: Brand Logo & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white transition hover:opacity-90"
        >
          <LinearLogo className="h-4.5 w-4.5 text-white" />
          <span className="text-[14px] font-semibold tracking-tight text-white">
            Linear
          </span>
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

          {/* Company with Dropdown Caret */}
          <div
            className="relative"
            onMouseEnter={() => setCompanyDropdownOpen(true)}
            onMouseLeave={() => setCompanyDropdownOpen(false)}
          >
            <button
              onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
              className="flex items-center gap-1 text-[13px] font-normal text-[#8a8f98] hover:text-white transition cursor-pointer"
              aria-expanded={companyDropdownOpen}
            >
              <span>Company</span>
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                  companyDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {companyDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 rounded-xl bg-[#0c0e1e]/95 border border-white/[0.1] shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="#"
                  className="block px-4 py-2 text-[12px] text-[#8a8f98] hover:text-white hover:bg-white/[0.05] transition"
                >
                  About us
                </Link>
                <Link
                  href="/blog"
                  className="block px-4 py-2 text-[12px] text-[#8a8f98] hover:text-white hover:bg-white/[0.05] transition"
                >
                  Blog
                </Link>
                <Link
                  href="/careers"
                  className="block px-4 py-2 text-[12px] text-[#8a8f98] hover:text-white hover:bg-white/[0.05] transition"
                >
                  Careers
                </Link>
                <Link
                  href="/customers"
                  className="block px-4 py-2 text-[12px] text-[#8a8f98] hover:text-white hover:bg-white/[0.05] transition"
                >
                  Customers
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 text-[12px] text-[#8a8f98] hover:text-white hover:bg-white/[0.05] transition"
                >
                  Brand
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <Link
              href="/projects"
              className="group flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium text-white bg-[#5e6ad2] hover:bg-[#6e7bf0] shadow-[0_2px_12px_rgba(94,106,210,0.35)] transition-all"
            >
              <span>Open workspace</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-normal text-[#8a8f98] transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-4 py-1.5 text-[13px] font-medium text-white bg-[#5e6ad2] hover:bg-[#6e7bf0] shadow-[0_2px_12px_rgba(94,106,210,0.35)] transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-1.5 text-[#8a8f98] hover:text-white md:hidden cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-white/[0.08] bg-[#080915]/95 backdrop-blur-xl px-6 py-4 md:hidden animate-in slide-in-from-top-2 duration-150">
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
            <Link
              href="/customers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#8a8f98] hover:text-white"
            >
              Company
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#8a8f98] hover:text-white"
            >
              Blog
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#8a8f98] hover:text-white"
            >
              Careers
            </Link>
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              {isAuthenticated ? (
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm text-white font-medium bg-[#5e6ad2] px-4 py-2 rounded-full flex items-center justify-center gap-2"
                >
                  <span>Open workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-[#8a8f98] hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-white font-medium bg-[#5e6ad2] px-3.5 py-1 rounded-full"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
