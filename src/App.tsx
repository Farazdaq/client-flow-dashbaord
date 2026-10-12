import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useFavicon } from "./components/Logo/useFavicon";

export default function App() {
  useFavicon();
  return <RouterProvider router={router} />;
}
