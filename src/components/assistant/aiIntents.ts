export type AiIntentKey =
  | "home"
  | "projects"
  | "experience"
  | "education"
  | "about"
  | "skills"
  | "languages"
  | "contact"
  | "github";

export const AI_INTENTS: Record<
  AiIntentKey,
  {
    label: string;
    keywords: string[];
    reply: string;
    action:
      | { type: "route"; route: string; anchorId?: string }
      | { type: "external"; href: string };
  }
> = {
  home: {
    label: "Home",
    keywords: [
      "home",
      "go home",
      "back home",
      "main page",
      "landing page",
      "homepage",
      "start",
      "top",
      "go to top",
    ],
    reply: "Taking you back to Home.",
    action: { type: "route", route: "/", anchorId: "home-section" },
  },

  projects: {
    label: "Projects",
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
    action: { type: "route", route: "/", anchorId: "projects-section" },
  },

  experience: {
    label: "Experience",
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
    label: "Education",
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
    label: "About",
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
    label: "Skills",
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
    action: { type: "route", route: "/", anchorId: "skills-section" },
  },

  languages: {
    label: "Languages",
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
    action: { type: "route", route: "/", anchorId: "languages-section" },
  },

  contact: {
    label: "Contact",
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
    reply: "Here’s the contact area.",
    action: { type: "route", route: "/", anchorId: "side-links" },
  },

  github: {
    label: "GitHub",
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