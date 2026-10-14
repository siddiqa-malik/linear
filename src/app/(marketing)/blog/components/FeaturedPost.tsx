"use client";

import React from "react";
import Link from "next/link";
import { BlogPost } from "../data";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="max-w-5xl mx-auto px-6">
      {/* Featured Graphic Banner */}
      <Link
        href={`/blog/${post.slug}`}
        className="group block relative w-full aspect-[16/10] sm:aspect-[2/1] md:aspect-[2.2/1] rounded-2xl overflow-hidden   bg-[#0c0d14] shadow-2xl transition-all duration-300 hover:border-white/20"
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
          loading="eager"
        />
      </Link>

      {/* Post Details */}
      <div className="mt-6 sm:mt-8">
        <span className="text-[12px] font-medium text-[#818cf8] tracking-tight">
          {post.category}
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-white mt-2 mb-3 leading-tight">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-white/80 transition-colors"
          >
            {post.title}
          </Link>
        </h1>

        <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#8a8f98] max-w-4xl mb-4">
          {post.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex items-center gap-2 text-xs text-[#8a8f98]">
          <div
            className={`w-5 h-5 rounded-full bg-gradient-to-br ${post.author.avatarColor} flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-white/10`}
          >
            {post.author.avatarInitials}
          </div>
          <span className="text-white/90 font-medium">{post.author.name}</span>
          <span className="text-white/30">·</span>
          <span>{post.date}</span>
        </div>
      </div>
    </article>
  );
}
