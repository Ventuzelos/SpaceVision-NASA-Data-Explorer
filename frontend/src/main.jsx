import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/variables.css";
import "./styles/reset.css";
import "./styles/typography.css";
import "./styles/utilities.css";
import "./styles/global.css";

import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import ScrollToTop from "./components/common/ScrollToTop/ScrollToTop";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />

      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);