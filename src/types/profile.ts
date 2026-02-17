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
  projects: ProjectItem[];
  email: string;
  cv?: string;
};
