import { Github, Linkedin, Mail, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "@/data/profile";
import "./QuickLinks.css";

type QuickLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
};

export default function QuickLinks() {
  const github = profile.socials.find((s) => s.label.toLowerCase().includes("github"))?.href;
  const linkedin = profile.socials.find((s) => s.label.toLowerCase().includes("linkedin"))?.href;

  // Resume is the primary action, so it comes first and gets the solid orange style.
  const links: QuickLink[] = [
    profile.cv && { label: "Resume", href: profile.cv, icon: FileText, primary: true },
    profile.email && { label: "Contact", href: `mailto:${profile.email}`, icon: Mail },
    linkedin && { label: "LinkedIn", href: linkedin, icon: Linkedin },
    github && { label: "GitHub", href: github, icon: Github },
  ].filter((link): link is QuickLink => Boolean(link));

  return (
    <div className="homeQuickLinks">
      {links.map(({ label, href, icon: Icon, primary }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          className={primary ? "homeQuickLinkBtn is-primary" : "homeQuickLinkBtn"}
        >
          <Icon size={16} strokeWidth={2} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
