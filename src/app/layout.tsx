import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { UIProvider } from "@/context/UIContext";
import { CommandPalette } from "@/components/common/CommandPalette";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { GlobalCreateProjectModal } from "@/components/common/GlobalCreateProjectModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linear — A better way to build products",
  description:
    "The issue tracking tool you'll enjoy using. Streamline issues, sprints, and product roadmaps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08090a] text-[#f7f8f8]">
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        <AuthProvider>
          <WorkspaceProvider>
            <UIProvider>
              {children}
              <CommandPalette />
              <CreateIssueModal />
              <GlobalCreateProjectModal />
            </UIProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}