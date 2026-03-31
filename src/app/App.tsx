import "./index.css"; // これでCSSを読み込み
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  // 設計図（router）に従って画面を表示してね、という命令
  return <RouterProvider router={router} />;
}