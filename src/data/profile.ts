export type Social = { label: string; href: string };

export type EducationItem = {
  institution: string;
  degree: string;
  years?: string;
  details?: string[];
};

export type ExperienceItem = {
  title: string;
  company: string;
  years?: string;
  bullets: string[];
};

export type ProjectItem = {
  name: string;
  desc: string;
  tech: string[];
  link?: string;
};

export type Profile = {
  fullName: string;
  headline: string;
  location?: string;
  summary: string;
  socials: Social[];
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: { group: string; items: string[] }[];
  languages: string[];
  projects: ProjectItem[];
  email: string;
  phone?: string;
  cv?: string;
};

export const profile: Profile = {
  fullName: "Romi Sinizkey",
  headline: "Computer Science Student | Full-Stack Developer",
  location: "Israel",
  summary:
    "I build clean, maintainable software. Strong with React + TypeScript, Node.js, Docker and SQL. I like shipping features with solid architecture and great UX.",
  socials: [
    { label: "GitHub", href: "https://github.com/RomiSinizkey" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/romi-sinizkey-30a7b7322/" }
  ],
  email: "sinizromi@gmail.com",
  phone: "0544276740",
  cv: "/Romi_Sinizkey_CV.pdf",
  education: [
    {
      institution: "The Open University of Israel",
      degree: "B.Sc. in Computer Science (Year 1)",
      years: "2024–Present",
      details: ["Algorithms, Data Structures, Systems, and more"]
    }
  ],
  experience: [
    {
      title: "Sales Agent",
      company: "Bug Computers",
      years: "Post-service",
      bullets: [
        "Customer-facing role: diagnosing needs and recommending tech solutions",
        "Strong communication, responsibility, and teamwork"
      ]
    }
  ],
  skills: [
    { group: "Frontend", items: ["React", "TypeScript", "Vite"] },
    { group: "Backend", items: ["Node.js", "Express", "Python"] },
    { group: "Tools", items: ["Docker", "Git", "SQL (MariaDB/MySQL)"] }
  ],
  languages: ["Hebrew", "English"],
  projects: [
    {
      name: "Smart Order Dashboard",
      desc: "A React+TS dashboard for order management with clean UI and API integration.",
      tech: ["React", "TypeScript", "Vite"],
      link: "https://github.com/RomiSinizkey/smart-order-dashboard",
    },
    {
      name: "Web Programming Chatroom",
      desc: "A web chatroom project with Node.js backend and MariaDB database.",
      tech: ["Node.js", "Express", "EJS", "MariaDB"],
      link: "https://github.com/RomiSinizkey/web-programming-chatroom",
    },
    {
      name: "GTA-Clone",
      desc: "GTA clone project (open-source) – gameplay & systems exploration.",
      tech: ["Unity", "C#"],
      link: "https://github.com/GTA-Clone/GTA-Clone",
    },
  ]

};
 
