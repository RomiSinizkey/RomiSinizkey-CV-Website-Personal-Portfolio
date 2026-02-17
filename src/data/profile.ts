import type { Profile } from "../types/profile";

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
  cv: "/cv.pdf",  
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
  projects: [
    {
      name: "smart-order-dashboard",
      desc: "A React+TS dashboard for order management with clean UI and API integration.",
      tech: ["React", "TypeScript", "Vite"],
      link: "https://github.com/RomiSinizkey/smart-order-dashboard",
    },
    {
      name: "web-programming-chatroom",
      desc: "A web chatroom project (web programming course).",
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
 