
# Romi CV

Personal portfolio and CV website built with React, TypeScript, and Vite.

The project combines a one-page scrolling home experience with dedicated route pages for About, Education, Experience, and Projects. It includes animated UI, a floating contact panel, an AI assistant widget, a weather card, and an embedded 3D robot scene.


## Stack

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Tailwind CSS utilities with custom CSS modules/files
- DotLottie for animated assets

## Main Features

- Single-page home flow with anchored sections
- Separate route pages for About, Education, Experience, and Projects
- Animated hero section with embedded external Spline scene
- About section content reused across the home page and About page
- Floating contact links with resume download
- AI assistant widget for section guidance
- Weather card with geolocation and live weather data

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run deploy
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

Build output is generated in [dist](dist).

## Deployment

The project includes:

- GitHub Pages deployment via `npm run deploy`
- [vercel.json](vercel.json) for Vercel configuration

The app uses `HashRouter`, which is suitable for static hosting scenarios such as GitHub Pages.

## Project Structure

```
public/
  about/icon/        # Icons for About page
  Side/              # Lottie animations
  Romi_Sinizkey_CV.pdf  # Resume file
src/
  components/
    assistant/       # AI assistant widget
    layout/          # Top navigation
    shared/          # Shared components
    ui/              # Animated backgrounds
  data/
    profile.ts       # Central profile data
  design-system/     # Primitives, motion, UI
  layout/
    RootLayout.tsx   # Main layout
  pages/
    about/education/experience/home/projects/
      components/    # Subcomponents for each page
      styles/        # Page-specific CSS (home)
  styles/
    assistant/global/layout/shared/  # CSS files
  assets/            # Images
  types/             # Types (currently empty)
```

## Important Files

- [src/App.tsx](src/App.tsx): Route definitions and loader gating
- [src/layout/RootLayout.tsx](src/layout/RootLayout.tsx): Top-level layout with navbar and assistant
- [src/data/profile.ts](src/data/profile.ts): Central profile data source
- [src/pages/home/HomePage.tsx](src/pages/home/HomePage.tsx): Main one-page portfolio experience
- [src/pages/about/components/AboutPageContent.tsx](src/pages/about/components/AboutPageContent.tsx): Reusable About section content
- [src/pages/home/components/WeatherCard.tsx](src/pages/home/components/WeatherCard.tsx): Weather card component
- [src/components/assistant/AIAssistantWidget.tsx](src/components/assistant/AIAssistantWidget.tsx): AI assistant widget

## Assets

- Resume file: [public/Romi_Sinizkey_CV.pdf](public/Romi_Sinizkey_CV.pdf)
- Icons: [public/about/icon/](public/about/icon/)
- Portrait image: [public/about/portrait.jpg](public/about/portrait.jpg)
- Lottie animation: [public/Side/WaveAnimation.lottie](public/Side/WaveAnimation.lottie)

## Notes

- Profile content is managed from [src/data/profile.ts](src/data/profile.ts)
- The resume link should be updated from profile data rather than hardcoded in components
- The home page embeds an external Spline scene and uses cache-busting to avoid stale loads
- The src/types folder is currently empty (for future extensions)
- All CSS files are separated by domain (assistant, layout, shared, etc.)

---

Last update: April 2026
- כל קובצי ה-CSS מופרדים לפי תחום (assistant, layout, shared וכו')

---

עדכון אחרון: אפריל 2026
