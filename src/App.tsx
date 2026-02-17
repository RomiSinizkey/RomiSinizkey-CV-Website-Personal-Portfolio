import { Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import EducationPage from "./pages/EducationPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<AboutPage />} />
        <Route path="/languages" element={<AboutPage />} />
        <Route path="/military" element={<ExperiencePage />} />

      </Route>
    </Routes>
  );
}
