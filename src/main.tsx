import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "@fontsource-variable/geist/wght.css";
import "./index.css";
import "./styles/global/brand.css";
import "./styles/layout/navbar.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
