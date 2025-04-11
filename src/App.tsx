
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TaxPlanningLandingPage from './pages/TaxPlanningLandingPage';
import DataFeedsAndUpdatesPage from './pages/DataFeedsAndUpdatesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TaxUpdatesHistoryPage from './pages/TaxUpdatesHistoryPage';
import TaxDataHistoryPage from './pages/TaxDataHistoryPage';
import AdminAuditLogPage from './pages/AdminAuditLogPage';
import AdvancedTaxEducationPage from './pages/AdvancedTaxEducationPage';
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TaxPlanningLandingPage />,
  },
  {
    path: "/tax-planning",
    element: <TaxPlanningLandingPage />,
  },
  {
    path: "/tax-planning/advanced-tax-education",
    element: <AdvancedTaxEducationPage />,
  },
  {
    path: "/admin/data-feeds",
    element: <DataFeedsAndUpdatesPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardPage />,
  },
  {
    path: "/tax-updates-history",
    element: <TaxUpdatesHistoryPage />
  },
  {
    path: "/admin/tax-data-history",
    element: <TaxDataHistoryPage />
  },
  {
    path: "/admin/audit-log",
    element: <AdminAuditLogPage />
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </React.StrictMode>
  );
}

export default App;
