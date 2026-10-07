import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import Users from "./pages/Users";
import IntegrationPage from "./pages/IntegrationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "integrations",
        element: <IntegrationPage />,
      },
    ],
  },
]);
