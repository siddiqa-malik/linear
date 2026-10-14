export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: "Product" | "Design" | "News" | "Practices / Building" | "Craft" | "Company";
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatarInitials: string;
    avatarColor?: string;
  };
  date: string;
}

export const FEATURED_POST: BlogPost = {
  id: "featured-project-updates",
  slug: "how-we-built-project-updates",
  title: "How we built Project Updates",
  category: "Product",
  excerpt:
    '"Updates" are one of the most effective tools to keep teams aligned and prevent unexpected surprises. That\'s why we\'re excited to announce our new Project Updates feature. Built on the core experience of Linear, Project Updates make it easy to follow status, share learnings, and surface blockers, with none of the friction or overhead of traditional status reports.',
  image: "/blog-hero-bg.png",
  author: {
    name: "Tuomas Artman",
    avatarInitials: "TA",
    avatarColor: "from-[#ec4899] to-[#8b5cf6]",
  },
  date: "Aug 18, 2022",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "settings-are-not-a-design-failure",
    title: "Settings are not a design failure",
    category: "Design",
    excerpt:
      "A frequent debate within digital product design is the utility and visual hierarchy of settings menus. Many believe that if a design is good enough, settings shouldn't be necessary. However, settings allow us to build products with specialized workflows that cater to varied and advanced use cases—without bloating the core experience for everyone else.",
    image: "/blog-1.png",
    author: {
      name: "Adrien Denat",
      avatarInitials: "AD",
      avatarColor: "from-[#6366f1] to-[#a855f7]",
    },
    date: "Nov 11, 2021",
  },
  {
    id: "blog-2",
    slug: "linear-2021-wrapped",
    title: "Linear — 2021 Wrapped",
    category: "Company",
    excerpt:
      "2021 has been an exciting and transformative year for our team at Linear. As we look back on our journey, we want to share some of the milestones and achievements we've celebrated along the way with our incredible community and customers.",
    image: "/blog-2.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#3b82f6] to-[#06b6d4]",
    },
    date: "Dec 21, 2021",
  },
  {
    id: "blog-3",
    slug: "fast-growing-startups-are-built-on-linear",
    title: "Fast growing startups are built on Linear",
    category: "Practices / Building",
    excerpt:
      "We started Linear to create a system that modern software companies need to scale and move quickly. When we spoke with early users, we learned how teams at Ramp, Retool, and Loom used Linear to scale from tiny seed-stage teams to industry leaders. Here are some of the practices and frameworks we've seen work best for them.",
    image: "/blog-3.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#ef4444] to-[#f59e0b]",
    },
    date: "Jul 28, 2021",
  },
  {
    id: "blog-4",
    slug: "building-at-the-early-stage",
    title: "Building at the early stage",
    category: "Practices / Building",
    excerpt:
      "In the early days of a startup, finding product-market fit takes precedence over everything else. In this post, we discuss how founders should think about team structures, tooling, and workflows when speed and learning velocity are the only metrics that matter.",
    image: "/blog-4.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#10b981] to-[#3b82f6]",
    },
    date: "Jul 14, 2021",
  },
  {
    id: "blog-5",
    slug: "linear-raises-13m-series-a-sequoia",
    title: "Linear raises $13M in Series A funding from Sequoia Capital",
    category: "News",
    excerpt:
      "Today we're announcing that we've raised $13M in Series A funding led by Sequoia Capital to continue our work of building a modern software development tool. In this post, we reflect on our journey so far and share our vision for the future of issue tracking and team collaboration.",
    image: "/blog-5.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#ec4899] to-[#6366f1]",
    },
    date: "Dec 9, 2020",
  },
  {
    id: "blog-6",
    slug: "invisible-details-contextual-menus",
    title: "Invisible details - Building contextual menus",
    category: "Craft",
    excerpt:
      "We recently built and launched contextual menus in Linear. While they seem simple on the surface, making them fast, accessible, and intuitive required meticulous attention to keyboard interactions, mouse positioning, and visual feedback. Here's how we approached their design and implementation.",
    image: "/blog-6.png",
    author: {
      name: "Tuomas Artman",
      avatarInitials: "TA",
      avatarColor: "from-[#8b5cf6] to-[#ec4899]",
    },
    date: "Oct 15, 2020",
  },
  {
    id: "blog-7",
    slug: "practices-for-building-linear-open-for-all",
    title: "Practices for Building — Linear is now open for all",
    category: "News",
    excerpt:
      "We started Linear to help build software better and faster, and we've spent the last year working closely with early customers. Today, we're excited to open Linear to everyone without waiting in line.",
    image: "/blog-7.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#f59e0b] to-[#10b981]",
    },
    date: "Jun 30, 2020",
  },
  {
    id: "blog-8",
    slug: "startups-write-changelogs",
    title: "Startups, Write Changelogs",
    category: "Practices / Building",
    excerpt:
      "A changelog is a powerful way to communicate your progress, build trust with users, and motivate your team. Here are our insights on why startups should write changelogs and how to do it well.",
    image: "/blog-8.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#3b82f6] to-[#8b5cf6]",
    },
    date: "May 12, 2020",
  },
  {
    id: "blog-9",
    slug: "linears-next-chapter-announcing-4-2m-seed-round",
    title: "Linear's Next Chapter: Announcing our $4.2M Seed Round",
    category: "News",
    excerpt:
      "When we started Linear, we wanted to build a product that we would love to use every day. Today we're excited to share that we've raised $4.2M in seed funding led by Sequoia Capital, with participation from incredible angel investors. Here's a look at why we're building Linear and what's next.",
    image: "/blog-9.png",
    author: {
      name: "Karri Saarinen",
      avatarInitials: "KS",
      avatarColor: "from-[#6366f1] to-[#3b82f6]",
    },
    date: "Nov 12, 2019",
  },
];
