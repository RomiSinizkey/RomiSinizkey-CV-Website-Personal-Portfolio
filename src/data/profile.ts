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
  headline: "Computer Science Student | Software Developer",
  location: "Israel, Tzur Hadassah",
  summary:
    "3rd-year Computer Science student with strong foundations in algorithms, data structures, operating systems, and web development. I work hands-on with Python, JavaScript, C, C++, and SQL, and I'm currently building a live production platform at a startup — full-stack, from customer order search to data management and system integration. Looking for an internship or entry-level role where I can keep growing as a backend, full-stack, or frontend engineer.",
  socials: [
    { label: "GitHub", href: "https://github.com/RomiSinizkey" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/romi-sinizkey-30a7b7322/" }
  ],
  email: "sinizromi@gmail.com",
  phone: "0544276740",
  cv: "/Romi_Sinizkey_CV.pdf",
  education: [
    {
      institution: "Jerusalem Multidisciplinary College",
      degree: "B.Sc. in Computer Science",
      years: "2023–2027",
      details: ["Grade: 88", "Algorithms, Data Structures, Systems, and more"]
    }
  ],
  experience: [
    {
      title: "Full Stack Engineer",
      company: "Bridgify",
      years: "Dec 2025 (Temporary)",
      bullets: [
        "Building both frontend and backend features on a live production platform, including UIs with React and server-side logic with Python",
        "Designing, developing, and improving system components, and integrating new features into existing systems",
        "Collaborating closely with the development team on feature development, debugging, and maintaining production-quality code"
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
 
