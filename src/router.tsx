import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import Integrations from "./pages/Integrations/Integrations";
import Listings from "./pages/Listings/Listings";
import Campaigns from "./pages/Campaigns/Campaigns";
import Conversations from "./pages/Conversations/Conversations";
import SocialMedia from "./pages/SocialMedia/SocialMedia";
import AIInsights from "./pages/AIInsights/AIInsights";
import Analytics from "./pages/Analytics/Analytics";
import Reports from "./pages/Reports/Reports";

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
        path: "customers",
        element: <Customers />,
      },
      {
        path: "listings",
        element: <Listings />,
      },
      {
        path: "campaigns",
        element: <Campaigns />,
      },
      {
        path: "conversations",
        element: <Conversations />,
      },
      {
        path: "social-media",
        element: <SocialMedia />,
      },
      {
        path: "ai-insights",
        element: <AIInsights />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "integrations",
        element: <Integrations />,
      },
    ],
  },
]);
