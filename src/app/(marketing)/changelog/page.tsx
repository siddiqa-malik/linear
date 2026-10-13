"use client";

import React from "react";
import {
  ChangelogHeader,
  ChangelogPost,
  CHANGELOG_POSTS,
  ChangelogPagination,
} from "./components";

export default function ChangelogPage() {
  return (
    <main className="w-full bg-[#080915] text-[#f3f4f8] selection:bg-[#5e6ad2] selection:text-white">
      {/* 1. Header with Title & Subscribe Badge */}
      <ChangelogHeader />

      {/* 2. Timeline List of Releases */}
      <div>
        {CHANGELOG_POSTS.map((post) => (
          <ChangelogPost key={post.id} post={post} />
        ))}
      </div>

      {/* 3. Bottom Pagination */}
      <ChangelogPagination />
    </main>
  );
}
