import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import BrutalistLoader from "./components/shared/BrutalistLoader";

import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about/AboutPage";
import EducationPage from "./pages/education/EducationPage";
import ExperiencePage from "./pages/experience/ExperiencePage";
import ProjectsPage from "./pages/projects/ProjectsPage";

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <BrutalistLoader onDone={() => setReady(true)} />
      <div style={{ visibility: ready ? "visible" : "hidden" }}>
        <Routes>
          <Route path="/" element={<RootLayout ready={ready} />}>
            <Route index element={<HomePage ready={ready} />} />
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
