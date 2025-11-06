import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";  // ✅ Use App to handle all routes
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
