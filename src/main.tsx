import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import AppErrorBoundary from "./AppErrorBoundary";
import "./ui/theme.css";
import "./ui/ui.css";

const routes: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  "/": () => import("@/app/routes/Home"),
  "/cv/compress": () => import("@/app/routes/cv/Compress"),
  "/cv/merge": () => import("@/app/routes/cv/Merge"),
  "/cv/ats-export": () => import("@/app/routes/cv/AtsExport"),
  "/cv/ocr": () => import("@/app/routes/cv/Ocr"),
  "/cv/jd-match": () => import("@/app/routes/cv/JdMatch"),
  "/why-ats": () => import("@/app/routes/WhyAts"),
  "/privacy": () => import("@/app/routes/Privacy"),
  "/security": () => import("@/app/routes/Security"),
  "/faq": () => import("@/app/routes/Faq"),
  "/changelog": () => import("@/app/routes/Changelog"),
};

const loadRoute = (routes[window.location.pathname] || routes["/"]) as () => Promise<{
  default: React.ComponentType<any>;
}>;
const LazyComp = lazy(loadRoute);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Suspense fallback={<div />}> 
        <LazyComp />
      </Suspense>
    </AppErrorBoundary>
  </React.StrictMode>
);
