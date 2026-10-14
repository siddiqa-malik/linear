"use client";

import React from "react";
import { motion } from "framer-motion";

export function PricingHero() {
  return (
    <section className="relative isolate w-full pt-20 sm:pt-24   pb-15 text-center overflow-hidden">
      {/* Soft Ambient Light Glow behind the circle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[220px]  pointer-events-none z-0 rounded-full" />

      {/* Background Graphic Asset from public/pricing-hero-bg.png */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[280px] sm:h-[320px] pointer-events-none z-0 select-none flex justify-center">
        <img
          src="/pricing-hero-bg.png"
          alt="Pricing Hero Background"
          className="w-full h-full object-fill sm:object-contain object-top opacity-100 ]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 mt-6 sm:mt-8"
        >
          Pricing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[15px] sm:text-[17px] text-[#8a8f98] max-w-xl mx-auto leading-relaxed"
        >
          Use Linear for free with your whole team. Upgrade to enable
          <br className="hidden sm:inline" /> unlimited issues, enhanced security, and additional features.
        </motion.p>
      </div>
    </section>
  );
}
