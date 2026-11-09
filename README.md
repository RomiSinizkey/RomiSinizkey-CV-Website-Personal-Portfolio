# Romi Sinizkey — Portfolio

Personal portfolio / CV website. A single scrolling home page (hero, About, Projects,
Education, Experience, Skills, Languages) plus dedicated routes for About, Projects,
Education and Experience. Includes an animated intro loader, a top navigation bar,
a custom cursor, a scroll-reactive background, and a small keyword-based "Ask AI" assistant
that navigates to sections.

Live site (GitHub Pages): https://romisinizkey.github.io/RomiSinizkey-CV-Website-Personal-Portfolio

## Tech stack

- React 19 + TypeScript
- Vite (dev server and build)
- React Router (`HashRouter`, works on static hosting)
- Tailwind CSS v4 + plain CSS files next to their components
- Framer Motion (animations), tsParticles (assistant sparkles), lucide-react (icons)

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 7 requirement; tested with Node 24).

```bash
npm ci            # install exact dependency versions from package-lock.json
npm run dev       # start the dev server (http://localhost:5173)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and publish `dist/` to the `gh-pages` branch (GitHub Pages) |

## Folder structure

```
public/                  Static files, served as-is
  favicon.svg
  Romi_cv.pdf            Resume (download link in the hero)
  images/portrait.jpg    About-page background image
design/                  Design source files (not part of the site)

src/
  main.tsx               Entry point: mounts the app, loads global CSS
  App.tsx                Route definitions
  index.css              Tailwind setup, theme colors, global base styles

  data/profile.ts        ALL personal content (bio, projects, education, skills...)

  pages/                 One file per route
    HomePage.tsx         The scrolling home page (hero + all sections)
    AboutPage.tsx, ProjectsPage.tsx, EducationPage.tsx, ExperiencePage.tsx

  sections/              Content blocks, shown on the home page AND on their own route
    AboutSection.tsx, ProjectsSection.tsx, EducationSection.tsx,
    ExperienceSection.tsx, SkillsSection.tsx, LanguagesSection.tsx
    sections.css         Shared section styles (glass cards, pills, titles)

  layout/                The frame around every page
    RootLayout.tsx       Background, cursor, navbar, assistant, page outlet
    TopNavbar.tsx        Top navigation badges

  components/
    hero/                Home hero: name logo, title, quick links
    assistant/           "Ask AI" widget and its keyword intents
    effects/             Intro loader, cursor, scroll background/progress, overlay
    ui/                  Small reusable primitives (Card, Grid, Button, Badge...)

  lib/                   Helpers: cn() class merger, motion presets, scrollToSection()
  styles/brand.css       Global background texture + text selection color
```

**Conventions**

- A component's CSS file sits next to it with the same name (`TopNavbar.tsx` + `TopNavbar.css`).
- `@/` is an alias for `src/` (e.g. `import { profile } from "@/data/profile"`).
- Files in `public/` must be referenced with `import.meta.env.BASE_URL` as a prefix
  (e.g. `` `${import.meta.env.BASE_URL}images/portrait.jpg` ``), so links keep working
  under the GitHub Pages sub-path.

## Where to edit things

| I want to change... | Edit |
|---|---|
| Name, headline, bio, location, email, phone, socials | `src/data/profile.ts` |
| Projects, education, experience, skills, languages | `src/data/profile.ts` |
| Resume file | Replace `public/Romi_cv.pdf` (keep the name, or update `cv` in `profile.ts`) |
| Hero text ("Student of Computer Science") | `src/components/hero/HeroTitle.tsx` |
| Logo letters ("ROMI") | `src/components/hero/NameLogo.tsx` |
| Hero buttons (Contact / Resume / LinkedIn / GitHub) | `src/components/hero/QuickLinks.tsx` |
| Layout or look of a section | `src/sections/<Name>Section.tsx` (+ `sections.css`) |
| Order of sections on the home page | `src/pages/HomePage.tsx` |
| Navbar items, icons and colors | `badges` array in `src/layout/TopNavbar.tsx` |
| Routes (URLs) | `src/App.tsx` |
| "Ask AI" keywords, replies and targets | `src/components/assistant/aiIntents.ts` |
| "Under construction" overlay rules | `src/layout/RootLayout.tsx` and `src/pages/HomePage.tsx` |
| Theme colors and global styles | `src/index.css` |
| About-page background | `public/images/portrait.jpg` |
| Browser tab title / favicon | `index.html`, `public/favicon.svg` |

When adding a new home-page section, also add its id to the navbar `badges` list
and to the `sectionIds` list in `HomePage.tsx`.

## Deployment

The site is deployed to **GitHub Pages** with `npm run deploy` (publishes `dist/` to the
`gh-pages` branch). Production builds use the base path
`/RomiSinizkey-CV-Website-Personal-Portfolio/` (set in `vite.config.ts`).

`vercel.json` is also present, but a Vercel deployment would need the `base` in
`vite.config.ts` changed to `/`.
