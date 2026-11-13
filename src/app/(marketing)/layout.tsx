import React, { Suspense } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/marketing/Footer";

/*
 * MarketingLayout Component (Server Component)
 *
 * Wraps all marketing pages with a consistent top navigation bar and footer.
 * Navbar uses client-side route introspection (usePathname), so it is wrapped
 * in a Suspense boundary to allow instant static prerendering in Next.js 16.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen text-[#f7f8f8] flex flex-col selection:bg-[#5e6ad2] selection:text-white bg-transparent">
      <Suspense fallback={<div className="h-16 w-full" />}>
        <Navbar />
      </Suspense>
      <div className="flex-1 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}
