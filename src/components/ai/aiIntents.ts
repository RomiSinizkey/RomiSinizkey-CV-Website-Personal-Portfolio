export type AiIntentKey =
  | "projects"
  | "experience"
  | "education"
  | "about"
  | "skills"
  | "languages"
  | "military"
  | "contact"
  | "github";

export const SUGGESTIONS = [
  "Show my projects",
  "Open experience",
  "Go to skills",
  "How can I contact you?",
  "Open GitHub",
];

export const AI_INTENTS: Record<
  AiIntentKey,
  {
    keywords: string[];
    reply: string;
    action:
      | { type: "route"; route: string; anchorId?: string; openShowcase?: boolean }
      | { type: "external"; href: string };
  }
> = {
  projects: {
    keywords: [
      "project",
      "projects",
      "portfolio",
      "work",
      "my work",
      "show projects",
      "show my projects",
      "portfolio projects",
      "case studies",
      "showcase",
      "what have you built",
      "stuff you built",
    ],
    reply: "Got it — taking you to Projects.",
    action: { type: "route", route: "/", anchorId: "projects-preview", openShowcase: true },
  },

  experience: {
    keywords: [
      "experience",
      "work experience",
      "jobs",
      "career",
      "employment",
      "where did you work",
      "work history",
      "professional experience",
      "resume experience",
      "cv experience",
    ],
    reply: "Sure — opening Experience.",
    action: { type: "route", route: "/experience" },
  },

  education: {
    keywords: [
      "education",
      "school",
      "university",
      "degree",
      "studies",
      "academic",
      "college",
      "courses",
      "certification",
      "certifications",
      "where did you study",
    ],
    reply: "Opening Education.",
    action: { type: "route", route: "/education" },
  },

  about: {
    keywords: [
      "about",
      "about you",
      "who are you",
      "bio",
      "profile",
      "summary",
      "tell me about yourself",
      "tell me about you",
      "intro",
      "introduction",
    ],
    reply: "Opening About.",
    action: { type: "route", route: "/about" },
  },

  skills: {
    keywords: [
      "skills",
      "skill",
      "stack",
      "tech stack",
      "technologies",
      "tools",
      "frameworks",
      "what do you know",
      "your stack",
      "tech",
      "programming",
    ],
    reply: "Taking you to Skills.",
    action: { type: "route", route: "/skills" },
  },

  languages: {
    keywords: [
      "language",
      "languages",
      "english",
      "hebrew",
      "russian",
      "spoken languages",
      "what languages",
      "how is your english",
      "how is your hebrew",
    ],
    reply: "Opening Languages.",
    action: { type: "route", route: "/languages" },
  },

  military: {
    keywords: [
      "military",
      "army",
      "idf",
      "service",
      "unit",
      "combat",
      "reserve",
      "military service",
      "army service",
      "where did you serve",
    ],
    reply: "Opening Military service.",
    action: { type: "route", route: "/military" },
  },

  contact: {
    keywords: [
      "contact",
      "how do i contact",
      "how can i contact",
      "email",
      "mail",
      "phone",
      "reach",
      "reach out",
      "message",
      "send a message",
      "linkedin",
      "connect",
      "get in touch",
      "where can i reach you",
    ],
    reply: "Here’s how to contact me — showing contact details.",
    // חשוב: אל תכלול כאן "github" כדי שלא יגנוב את הכוונה של GitHub intent
    action: { type: "route", route: "/", anchorId: "side-links" },
  },

  github: {
    keywords: [
      "github",
      "open github",
      "open my github",
      "github profile",
      "github page",
      "github link",
      "repo",
      "repositories",
      "source code",
      "code",
      "view code",
    ],
    reply: "Opening GitHub in a new tab.",
    action: { type: "external", href: "https://github.com/RomiSinizkey" },
  },
};
