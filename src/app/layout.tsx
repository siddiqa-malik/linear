import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { CommandPalette } from "@/components/common/CommandPalette";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";

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
        <AuthProvider>
          <UIProvider>
            {children}
            <CommandPalette />
            <CreateIssueModal />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}