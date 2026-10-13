"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LinearLogo } from "@/components/icons/LinearLogo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/projects");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#08090a] px-6 py-12 select-none">
      {/* Ambient Radial Spotlight */}
      <div className="pointer-events-none absolute inset-0 linear-glow-hero -z-10" />

      {/* Brand Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 text-white transition hover:opacity-90">
        <LinearLogo className="h-6 w-6 text-white" />
        <span className="text-base font-semibold tracking-tight">Linear</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e0f14] p-8 shadow-2xl shadow-black/80">
        <h1 className="text-lg font-semibold tracking-tight text-white text-center">
          Log in to your workspace
        </h1>
        <p className="mt-1 text-center text-xs text-[#8a8f98]">
          Welcome back. Enter your credentials below.
        </p>

        {error && (
          <div className="mt-4 rounded border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
              Email Address
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#62666d]">
              <span>Password</span>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full py-2.5 mt-2"
          >
            Continue
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#8a8f98]">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}