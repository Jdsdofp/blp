import React from "react";
import { createRoot } from "react-dom/client";
import "./global.css"

import App from "./App";
import { NotificationsProvider } from "./contexts/NotificationsContext";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <NotificationsProvider>
      <App/>
    </NotificationsProvider>
  </React.StrictMode>
);
