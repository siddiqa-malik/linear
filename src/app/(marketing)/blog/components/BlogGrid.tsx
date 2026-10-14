"use client";

import React from "react";
import Link from "next/link";
import { BlogPost } from "../data";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="max-w-5xl mx-auto px-6 mt-16 sm:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col">
            {/* Card Graphic */}
            <Link
              href={`/blog/${post.slug}`}
              className="group block relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0d14] shadow-md transition-all duration-300 hover:border-white/25 hover:shadow-xl"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            </Link>

            {/* Post Information */}
            <div className="mt-4 flex flex-col flex-1">
              <span className="text-[11px] font-medium text-[#818cf8] tracking-tight">
                {post.category}
              </span>

              <h2 className="text-[17px] sm:text-[18px] font-semibold tracking-tight text-white mt-1.5 mb-2 leading-snug">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-white/80 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-[13px] leading-relaxed text-[#8a8f98] mb-4 flex-1 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="flex items-center gap-2 text-xs text-[#8a8f98] mt-auto">
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br ${post.author.avatarColor} flex items-center justify-center text-[8.5px] font-bold text-white ring-1 ring-white/10`}
                >
                  {post.author.avatarInitials}
                </div>
                <span className="text-white/90 font-medium">{post.author.name}</span>
                <span className="text-white/30">·</span>
                <span>{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
