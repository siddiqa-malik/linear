"use client";

import React from "react";
import { FEATURED_POST, BLOG_POSTS } from "./data";
import {
  BlogHeader,
  FeaturedPost,
  BlogGrid,
  NewsletterSection,
} from "./components";

export default function BlogPage() {
  return (
    <main className="w-full min-h-screen bg-[#050506] text-[#f7f8f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Subheader: Breadcrumb & Twitter Icon */}
      <BlogHeader />

      {/* 2. Featured Hero Post: How we built Project Updates with blog-hero-bg.png */}
      <FeaturedPost post={FEATURED_POST} />

      {/* 3. 2-Column Grid of 9 Blog Posts (blog-1 to blog-9) */}
      <BlogGrid posts={BLOG_POSTS} />

      {/* 4. Newsletter Subscription Form */}
      <NewsletterSection />
    </main>
  );
}
