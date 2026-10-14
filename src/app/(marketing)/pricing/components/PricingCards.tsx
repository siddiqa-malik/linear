"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, User, Users } from "lucide-react";

export function PricingCards() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-6 px-6 max-w-6xl mx-auto w-full mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Free (With #FFFFFF gradient at top) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-3xl flex flex-col shadow-xl"
        >
          <div className="w-full h-full rounded-[23px] p-7 sm:p-8 bg-[#0c0d16]/85 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient top light reflection with #FFFFFF */}
            <div className="absolute top-0 inset-x-0 h-130 bg-gradient-to-b from-[#FFFFFF]/[0.3] to-transparent pointer-events-none" />

            <div>
              <h3 className="text-[15px] font-semibold text-white/80">Free</h3>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-8">
                Free for everyone
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/[0.08] mb-6" />

              {/* Features */}
              <ul className="space-y-3 text-[13px] text-[#c0c4d0]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                  <span>Unlimited members</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                  <span>250 issues (active and archived)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                  <span>Import and export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                  <span>All integrations, API, webhooks</span>
                </li>
              </ul>
            </div>

            <Link href="/signup" className="block mt-10">
              <button className="w-full py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-[13px] font-medium transition-all cursor-pointer">
                Get started with Free
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Standard (Active Card with Linear Gradient: Top #7877C6 -> Bottom #FFFFFF, Canvas Blue Base) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-3xl  bg-gradient-to-b from-[#7877C6] via-[#7877C6]/40 to-[#FFFFFF]/60 flex flex-col z-10"
        >
          {/* Inner Card Container with canvas dark blue background and #7877C6 -> #FFFFFF gradient */}
          <div
            className="w-full h-full rounded-[23px] p-7 sm:p-8 flex flex-col justify-between backdrop-blur-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(120, 119, 198, 0.25) 4%, rgba(248, 242, 242, 0.35) 20%, #12142e 100%)"
            }}
          >
            {/* Ambient top light reflection */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b  from-[#7877C6]/30 to-transparent flex item-center justify-center flex-col pointer-events-none" />

            < div className=" ">
              <h3 className="text-[15px] font-semibold text-white/90">Standard</h3>

              <div className="flex items-center  gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {annual ? "$8" : "$10"} per user/month
                </span>
                {annual && (
                  <span className="text-[11px] font-mono font-semibold text-white bg-[#5e6ad2] px-2 py-0.5 rounded-full shadow-sm">
                    -20%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[12px] text-[#8a8f98] mt-1.5 mb-5">
                <User className="w-3.5 h-3.5 text-[#7877C6]" />
                <span>Best for 1-50 users</span>
              </div>

              {/* Monthly / Annually Pill Toggle */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-black/40 border border-white/[0.08] mb-6">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${!annual ? "bg-[#5e6ad2] text-white shadow-sm" : "text-[#8a8f98] hover:text-white"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${annual ? "bg-[#5e6ad2] text-white shadow-sm" : "text-[#8a8f98] hover:text-white"
                    }`}
                >
                  Annually
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/[0.08] mb-6" />

              {/* Features */}
              <div>
                <span className="text-[12px] font-medium text-white/90 block mb-3">
                  Everything in Free, plus...
                </span>
                <ul className="space-y-3 text-[13px] text-[#c0c4d0]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#7877C6] shrink-0" />
                    <span>Unlimited issues and file uploads</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#7877C6] shrink-0" />
                    <span>Guest accounts, private teams</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#7877C6] shrink-0" />
                    <span>Admin roles</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/signup" className="block mt-10">
              <button className="w-full py-3 rounded-full bg-[#5e6ad2] hover:bg-[#6b77df] text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(94,106,210,0.4)] cursor-pointer">
                Get started with Standard
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Card 3: Plus (With #FFFFFF gradient at top) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-3xl  flex flex-col shadow-xl"
        >
          <div className="w-full h-full rounded-[23px] p-7 sm:p-8 bg-[#0c0d16]/85 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient top light reflection with #FFFFFF */}
            <div className="absolute top-0 inset-x-0 h-130 bg-gradient-to-b from-[#FFFFFF]/[0.3] to-transparent pointer-events-none" />

            <div>
              <h3 className="text-[15px] font-semibold text-white/80">Plus</h3>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
                $14 per user/month
              </div>

              <div className="flex items-center gap-1.5 text-[12px] text-[#8a8f98] mt-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#707dfb]" />
                <span>Best for 50+ users</span>
              </div>

              <span className="text-[11px] text-[#8a8f98] font-mono italic mb-6 block">
                Annual billing only
              </span>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/[0.08] mb-6" />

              {/* Features */}
              <div>
                <span className="text-[12px] font-medium text-white/90 block mb-3">
                  Everything in Standard, plus...
                </span>
                <ul className="space-y-3 text-[13px] text-[#c0c4d0]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                    <span>SAML / Single Sign-On</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                    <span>Advanced authentication controls</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                    <span>Linear Insights and SCIM</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#707dfb] shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/signup" className="block">
                <button className="w-full py-3 rounded-full bg-white hover:bg-[#ededf5] text-[#080915] text-[13px] font-semibold transition-all shadow-lg cursor-pointer">
                  Get started with Plus
                </button>
              </Link>
              <div className="text-center mt-2.5">
                <a href="#contact" className="text-[12px] text-[#8a8f98] hover:text-white underline underline-offset-4 cursor-pointer">
                  or contact sales
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
