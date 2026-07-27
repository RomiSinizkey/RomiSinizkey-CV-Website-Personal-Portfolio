import { Github, Linkedin, Mail, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "@/data/profile";
import "../styles/homeQuickLinks.css";

type QuickLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function HomeQuickLinks() {
  const github = profile.socials.find((s) => s.label.toLowerCase().includes("github"))?.href;
  const linkedin = profile.socials.find((s) => s.label.toLowerCase().includes("linkedin"))?.href;

  const links: QuickLink[] = [
    profile.email && { label: "Contact", href: `mailto:${profile.email}`, icon: Mail },
    profile.cv && { label: "Resume", href: profile.cv, icon: FileText },
    linkedin && { label: "LinkedIn", href: linkedin, icon: Linkedin },
    github && { label: "GitHub", href: github, icon: Github },
  ].filter((link): link is QuickLink => Boolean(link));

  return (
    <div className="homeQuickLinks">
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          className="homeQuickLinkBtn"
        >
          <Icon size={13} strokeWidth={2} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
