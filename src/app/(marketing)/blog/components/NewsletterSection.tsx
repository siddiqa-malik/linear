"use client";

import React, { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 text-center max-w-xl mx-auto px-6">
      <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-white">
        Subscribe to our newsletter
      </h3>
      <p className="mt-2 text-xs sm:text-[13px] text-[#8a8f98]">
        Receive new blog posts right in your inbox every month.
      </p>

      {subscribed ? (
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 px-4 py-2.5 text-xs text-white">
          <span>✓ Thanks for subscribing! Check your inbox soon.</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex items-center justify-center gap-2 max-w-sm mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="h-9 sm:h-9.5 px-3.5 rounded-lg bg-[#0e1017] border border-white/[0.1] text-xs sm:text-[13px] text-white placeholder-[#5a5f6b] focus:outline-none focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2] transition-colors flex-1"
          />
          <button
            type="submit"
            className="h-9 sm:h-9.5 px-4 rounded-lg bg-[#5e6ad2] hover:bg-[#6e7bf0] text-white text-xs sm:text-[13px] font-medium transition-colors shadow-[0_2px_12px_rgba(94,106,210,0.35)] cursor-pointer"
          >
            Join
          </button>
        </form>
      )}
    </section>
  );
}
