export interface IntegrationItem {
  id: string;
  name: string;
  desc: string;
  category: string;
  color: string;
  isPopular?: boolean;
}

export interface IntegrationCategory {
  id: string;
  title: string;
  subtitle: string;
  items: IntegrationItem[];
}

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  // 1. Engineering
  {
    id: "engineering",
    title: "Engineering",
    subtitle: "Automate branch creation, link pull requests, and sync status.",
    items: [
      {
        id: "github",
        name: "GitHub",
        desc: "Pull requests, commit linkages, and automated branch creation.",
        category: "engineering",
        color: "#ffffff",
        isPopular: true,
      },
      {
        id: "gitlab",
        name: "GitLab",
        desc: "Merge request synchronization and CI pipeline triggers.",
        category: "engineering",
        color: "#fc6d26",
      },
      {
        id: "bitbucket",
        name: "Bitbucket",
        desc: "Bi-directional pull request tracking and branch updates.",
        category: "engineering",
        color: "#0052cc",
      },
      {
        id: "sentry",
        name: "Sentry",
        desc: "Link crash stack traces and exception breadcrumbs to issues.",
        category: "engineering",
        color: "#9061f9",
      },
      {
        id: "airbrake",
        name: "Airbrake",
        desc: "Automatic exception triage and error grouping.",
        category: "engineering",
        color: "#ef4444",
      },
      {
        id: "bugsnag",
        name: "Bugsnag",
        desc: "Application stability metrics and crash analytics.",
        category: "engineering",
        color: "#3b82f6",
      },
      {
        id: "launchdarkly",
        name: "LaunchDarkly",
        desc: "Feature flag association and rollout linkages.",
        category: "engineering",
        color: "#405bfa",
      },
      {
        id: "unleash",
        name: "Unleash",
        desc: "Open-source feature toggle management directly in issues.",
        category: "engineering",
        color: "#10b981",
      },
      {
        id: "datadog",
        name: "Datadog",
        desc: "Convert monitoring alert triggers into Linear tasks.",
        category: "engineering",
        color: "#6366f1",
      },
    ],
  },

  // 2. Productivity
  {
    id: "productivity",
    title: "Productivity",
    subtitle: "Streamline daily communication, calendars, and hotkeys.",
    items: [
      {
        id: "slack",
        name: "Slack",
        desc: "Create issues and receive real-time notifications in channels.",
        category: "productivity",
        color: "#e01e5a",
        isPopular: true,
      },
      {
        id: "discord",
        name: "Discord",
        desc: "Community channel discussions, threads, and release announcements.",
        category: "productivity",
        color: "#5865f2",
      },
      {
        id: "google-workspace",
        name: "Google Workspace",
        desc: "Calendar meetings and Gmail thread conversion to tasks.",
        category: "productivity",
        color: "#ea4335",
      },
      {
        id: "raycast",
        name: "Raycast",
        desc: "Lightning-fast keyboard search, triage, and task creation.",
        category: "productivity",
        color: "#ff6363",
        isPopular: true,
      },
      {
        id: "alfred",
        name: "Alfred",
        desc: "Mac keyboard launcher workflows and quick commands.",
        category: "productivity",
        color: "#a855f7",
      },
      {
        id: "pop",
        name: "Pop",
        desc: "Pair programming and screen sharing with issue context.",
        category: "productivity",
        color: "#3b82f6",
      },
      {
        id: "tandem",
        name: "Tandem",
        desc: "Virtual office presence and spontaneous pair rooms.",
        category: "productivity",
        color: "#22c55e",
      },
      {
        id: "superhuman",
        name: "Superhuman",
        desc: "Blazing-fast email client with 1-click issue extraction.",
        category: "productivity",
        color: "#6366f1",
      },
      {
        id: "cron",
        name: "Cron",
        desc: "Next-generation calendar with task scheduling blocks.",
        category: "productivity",
        color: "#f59e0b",
      },
    ],
  },

  // 3. Customer Support
  {
    id: "customer-support",
    title: "Customer Support",
    subtitle: "Turn user feedback and tickets into resolved engineering issues.",
    items: [
      {
        id: "zendesk",
        name: "Zendesk",
        desc: "Two-way support ticket sync and auto-notification on deploy.",
        category: "customer-support",
        color: "#03363d",
        isPopular: true,
      },
      {
        id: "intercom",
        name: "Intercom",
        desc: "Turn customer chat conversations into tracked bug reports.",
        category: "customer-support",
        color: "#286efa",
        isPopular: true,
      },
      {
        id: "front",
        name: "Front",
        desc: "Shared inbox message synchronization and customer history.",
        category: "customer-support",
        color: "#ff5967",
      },
      {
        id: "gorgias",
        name: "Gorgias",
        desc: "E-commerce customer experience and order issue triage.",
        category: "customer-support",
        color: "#1e3a8a",
      },
      {
        id: "kustomer",
        name: "Kustomer",
        desc: "Omnichannel customer operations and CRM ticket links.",
        category: "customer-support",
        color: "#0284c7",
      },
      {
        id: "plain",
        name: "Plain",
        desc: "Modern developer-first support workspace with direct sync.",
        category: "customer-support",
        color: "#64748b",
      },
      {
        id: "help-scout",
        name: "Help Scout",
        desc: "Customer desk discussions linked directly to active sprints.",
        category: "customer-support",
        color: "#127bf8",
      },
      {
        id: "freshdesk",
        name: "Freshdesk",
        desc: "SLA escalation and support ticket lifecycle tracking.",
        category: "customer-support",
        color: "#16a34a",
      },
      {
        id: "deskpro",
        name: "Deskpro",
        desc: "Custom support desks and automated issue forwarding.",
        category: "customer-support",
        color: "#8b5cf6",
      },
    ],
  },

  // 4. Customer Operations
  {
    id: "customer-ops",
    title: "Customer Operations",
    subtitle: "Connect sales, success, and enterprise feature requests.",
    items: [
      {
        id: "salesforce",
        name: "Salesforce",
        desc: "Associate customer opportunities with high-priority roadmap items.",
        category: "customer-ops",
        color: "#00a1e0",
      },
      {
        id: "hubspot",
        name: "HubSpot",
        desc: "CRM contact intelligence and deal impact metrics.",
        category: "customer-ops",
        color: "#ff7a59",
      },
      {
        id: "vitally",
        name: "Vitally",
        desc: "Customer success tracking and account health indicators.",
        category: "customer-ops",
        color: "#3b82f6",
      },
      {
        id: "catalyst",
        name: "Catalyst",
        desc: "Customer success workflows and revenue retention alerts.",
        category: "customer-ops",
        color: "#ec4899",
      },
      {
        id: "churnzero",
        name: "ChurnZero",
        desc: "Customer retention metrics and critical blocker escalations.",
        category: "customer-ops",
        color: "#10b981",
      },
      {
        id: "planhat",
        name: "Planhat",
        desc: "Customer platform operations and lifecycle monitoring.",
        category: "customer-ops",
        color: "#f59e0b",
      },
      {
        id: "totango",
        name: "Totango",
        desc: "Enterprise client alignment and feedback loops.",
        category: "customer-ops",
        color: "#6366f1",
      },
      {
        id: "gainsight",
        name: "Gainsight",
        desc: "Product usage metrics and customer sentiment context.",
        category: "customer-ops",
        color: "#8b5cf6",
      },
      {
        id: "stripe",
        name: "Stripe",
        desc: "Subscription tiers and revenue data attached to issue triage.",
        category: "customer-ops",
        color: "#635bff",
      },
    ],
  },

  // 5. Analytics
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Measure adoption, session replays, and user behavior.",
    items: [
      {
        id: "posthog",
        name: "PostHog",
        desc: "Product analytics, session replays, and feature flag linking.",
        category: "analytics",
        color: "#f97316",
        isPopular: true,
      },
      {
        id: "mixpanel",
        name: "Mixpanel",
        desc: "Event tracking funnels and user retention cohort analysis.",
        category: "analytics",
        color: "#7856ff",
      },
      {
        id: "amplitude",
        name: "Amplitude",
        desc: "Behavioral analytics and product experiment metrics.",
        category: "analytics",
        color: "#0284c7",
      },
      {
        id: "june",
        name: "June.so",
        desc: "B2B SaaS product analytics with automated company insights.",
        category: "analytics",
        color: "#10b981",
      },
      {
        id: "plausible",
        name: "Plausible",
        desc: "Privacy-first lightweight website analytics tracking.",
        category: "analytics",
        color: "#6366f1",
      },
      {
        id: "segment",
        name: "Segment",
        desc: "Customer data platform pipeline and event stream ingestion.",
        category: "analytics",
        color: "#52bd95",
      },
      {
        id: "heap",
        name: "Heap",
        desc: "Automated event capture and behavioral analytics.",
        category: "analytics",
        color: "#ef4444",
      },
      {
        id: "fullstory",
        name: "FullStory",
        desc: "Session replay and digital experience analytics for bug fixes.",
        category: "analytics",
        color: "#3b82f6",
      },
      {
        id: "logrocket",
        name: "LogRocket",
        desc: "Frontend error monitoring with direct console session links.",
        category: "analytics",
        color: "#7c3aed",
      },
    ],
  },

  // 6. Design & Media
  {
    id: "design-media",
    title: "Design & Media",
    subtitle: "Embed live design canvases, prototypes, and videos inside issues.",
    items: [
      {
        id: "figma",
        name: "Figma",
        desc: "Embed interactive canvas frames, components, and design specs.",
        category: "design-media",
        color: "#f24e1e",
        isPopular: true,
      },
      {
        id: "loom",
        name: "Loom",
        desc: "Record and embed video bug walkthroughs with timestamp context.",
        category: "design-media",
        color: "#625df5",
        isPopular: true,
      },
      {
        id: "miro",
        name: "Miro",
        desc: "Collaborative whiteboard canvases and team user story maps.",
        category: "design-media",
        color: "#ffd02f",
      },
      {
        id: "whimsical",
        name: "Whimsical",
        desc: "Flowcharts, wireframes, and architecture mind maps.",
        category: "design-media",
        color: "#a855f7",
      },
      {
        id: "pitch",
        name: "Pitch",
        desc: "Interactive presentation decks and project launch updates.",
        category: "design-media",
        color: "#ec4899",
      },
    ],
  },

  // 7. Automation
  {
    id: "automation",
    title: "Automation",
    subtitle: "Build custom workflow automations and bots without writing code.",
    items: [
      {
        id: "zapier",
        name: "Zapier",
        desc: "Connect Linear to 5,000+ cloud applications with automated Zaps.",
        category: "automation",
        color: "#ff4f00",
        isPopular: true,
      },
      {
        id: "make",
        name: "Make",
        desc: "Visual multi-step automation builder with branching logic.",
        category: "automation",
        color: "#6d28d9",
      },
      {
        id: "n8n",
        name: "n8n",
        desc: "Fair-code self-hosted workflow automation for engineering teams.",
        category: "automation",
        color: "#ea580c",
      },
      {
        id: "tray",
        name: "Tray.io",
        desc: "Enterprise cloud integration platform with advanced governance.",
        category: "automation",
        color: "#2563eb",
      },
      {
        id: "workato",
        name: "Workato",
        desc: "Enterprise automation recipes and secure business workflows.",
        category: "automation",
        color: "#059669",
      },
      {
        id: "pipedream",
        name: "Pipedream",
        desc: "Serverless code workflows and low-latency webhook ingestion.",
        category: "automation",
        color: "#16a34a",
      },
      {
        id: "relay",
        name: "Relay",
        desc: "Incident response runbooks and automated developer playbooks.",
        category: "automation",
        color: "#8b5cf6",
      },
      {
        id: "bardeen",
        name: "Bardeen",
        desc: "Browser-based AI automation shortcuts for daily work.",
        category: "automation",
        color: "#f59e0b",
      },
      {
        id: "gumloop",
        name: "Gumloop",
        desc: "AI-powered web workflows and automated document scrapers.",
        category: "automation",
        color: "#06b6d4",
      },
    ],
  },

  // 8. Community & SDKs
  {
    id: "community",
    title: "Community",
    subtitle: "Community-built applications, plugins, and language SDKs.",
    items: [
      {
        id: "raycast-ext",
        name: "Raycast Extension",
        desc: "Community extension for instant search, quick assign, and triage.",
        category: "community",
        color: "#ff6363",
        isPopular: true,
      },
      {
        id: "linear-cli",
        name: "Linear CLI",
        desc: "Terminal tool to manage issues, cycles, and branches in your shell.",
        category: "community",
        color: "#38bdf8",
      },
      {
        id: "vscode",
        name: "VS Code Extension",
        desc: "Browse and transition Linear tasks directly within your IDE.",
        category: "community",
        color: "#007acc",
      },
      {
        id: "neovim",
        name: "Neovim Plugin",
        desc: "Blazing-fast Vim motions for Linear issues and comments.",
        category: "community",
        color: "#57a143",
      },
      {
        id: "sdk-ts",
        name: "TypeScript SDK",
        desc: "Official typed JavaScript and TypeScript client library.",
        category: "community",
        color: "#3178c6",
        isPopular: true,
      },
      {
        id: "graphql-schema",
        name: "GraphQL Schema",
        desc: "Full GraphQL API introspection schema and typed codegen.",
        category: "community",
        color: "#e10098",
      },
      {
        id: "sdk-python",
        name: "Python SDK",
        desc: "Community Python wrapper for scripts, bots, and ML pipelines.",
        category: "community",
        color: "#3776ab",
      },
      {
        id: "sdk-go",
        name: "Go SDK",
        desc: "Fast Golang bindings for backend microservices and CLIs.",
        category: "community",
        color: "#00add8",
      },
      {
        id: "sdk-rust",
        name: "Rust SDK",
        desc: "High-performance memory-safe Rust bindings for Linear.",
        category: "community",
        color: "#dea584",
      },
    ],
  },
];
