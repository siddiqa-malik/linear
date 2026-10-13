import Link from "next/link";
import { LinearLogo } from "../icons/LinearLogo";

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Cycles", href: "#method" },
        { label: "Roadmaps", href: "#roadmaps" },
        { label: "Changelog", href: "#changelog" },
        { label: "Integrations", href: "#integrations" },
        { label: "Method", href: "#method" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Customers", href: "#customers" },
        { label: "Brand", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Community", href: "#" },
        { label: "Status", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "API Reference", href: "#" },
        { label: "GitHub", href: "https://github.com" },
        { label: "Twitter", href: "https://twitter.com" },
        { label: "Discord", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#07080a] py-16 text-xs text-[#8a8f98]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Logo & Copyright */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <LinearLogo className="h-4.5 w-4.5 text-white" />
              <span className="font-semibold text-sm">Linear</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#62666d]">
              Linear is designed for high-performance software teams.
              <br />
              © 2026 Linear Orbit, Inc.
            </p>
          </div>

          {/* Nav Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-semibold text-white tracking-tight">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white"
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