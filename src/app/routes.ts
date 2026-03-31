import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Settings } from "./pages/settings";
import { Layout } from "./components/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "settings", Component: Settings },
    ],
  },
]);
