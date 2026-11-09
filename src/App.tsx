import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import LogoLoader from "./components/effects/LogoLoader";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import EducationPage from "./pages/EducationPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <LogoLoader onDone={() => setReady(true)} />
      <div style={{ visibility: ready ? "visible" : "hidden" }}>
        <Routes>
          <Route path="/" element={<RootLayout ready={ready} />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="projects" element={<ProjectsPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}
