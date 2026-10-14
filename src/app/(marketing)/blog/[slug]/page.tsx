"use client";

import React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { BLOG_POSTS, FEATURED_POST } from "../data";
import { NewsletterSection } from "../components/NewsletterSection";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const allPosts = [FEATURED_POST, ...BLOG_POSTS];
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="w-full min-h-screen bg-[#050506] text-[#f7f8f8] selection:bg-[#5e6ad2] selection:text-white pt-28 md:pt-36">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-[#8a8f98] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all posts</span>
        </Link>

        {/* Category */}
        <div className="text-xs font-medium text-[#818cf8] mb-3">
          {post.category}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-3 pb-8 border-b border-white/[0.08] text-xs text-[#8a8f98]">
          <div
            className={`w-6 h-6 rounded-full bg-gradient-to-br ${post.author.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/10`}
          >
            {post.author.avatarInitials}
          </div>
          <div>
            <div className="text-white font-medium">{post.author.name}</div>
            <div className="text-[#8a8f98] text-[11px]">{post.date}</div>
          </div>
        </div>

        {/* Post Image */}
        <div className="my-10 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d14] shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none text-[15px] sm:text-base leading-relaxed text-[#c0c4d0] space-y-6">
          <p className="text-lg leading-relaxed text-white/90 font-normal">
            {post.excerpt}
          </p>

          <p>
            When building products at scale, the tools we use shape the way we think and communicate. At Linear, our mission has always been to build software that is purposeful, lightning-fast, and designed with uncompromising attention to detail.
          </p>

          <p>
            We believe that modern product teams perform at their best when mundane administrative friction is removed. By focusing on core workflows, clear status visibility, and seamless keyboard-first navigation, teams can maintain momentum without getting bogged down by unnecessary process.
          </p>

          <h2 className="text-2xl font-semibold text-white tracking-tight mt-10 mb-4">
            Designed for clarity and momentum
          </h2>

          <p>
            Every feature we design starts with a simple question: does this give creators more clarity and agency to do their life's work? As we continue to evolve our platform, we look forward to sharing more deep-dives into our engineering architecture, design decisions, and company practices.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterSection />
    </article>
  );
}
