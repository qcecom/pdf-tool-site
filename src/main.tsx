import React from "react";
import ReactDOM from "react-dom/client";
import CompressRoute from "./app/routes/Compress";
import AppErrorBoundary from "./AppErrorBoundary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <CompressRoute />
    </AppErrorBoundary>
  </React.StrictMode>
);
