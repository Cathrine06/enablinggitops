import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Material Icons from Google CDN
const materialIconsLink = document.createElement("link");
materialIconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
materialIconsLink.rel = "stylesheet";
document.head.appendChild(materialIconsLink);

// Add title and meta description for SEO
const title = document.createElement("title");
title.textContent = "ArgoDash - GitOps Workflow Management";
document.head.appendChild(title);

const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "ArgoCD GitOps workflow management dashboard for automated infrastructure management with real-time visualization";
document.head.appendChild(metaDescription);

// Open Graph tags for social sharing
const ogTitle = document.createElement("meta");
ogTitle.property = "og:title";
ogTitle.content = "ArgoDash - GitOps Workflow Management";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.property = "og:description";
ogDescription.content = "Real-time infrastructure visualization and automated GitOps workflow management with ArgoCD";
document.head.appendChild(ogDescription);

createRoot(document.getElementById("root")!).render(<App />);
