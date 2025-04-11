
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TaxCalculatorPage from './pages/TaxCalculatorPage';
import TaxCreditsPage from './pages/TaxCreditsPage';
import TaxPlanningLandingPage from './pages/TaxPlanningLandingPage';
import DataFeedsAndUpdatesPage from './pages/DataFeedsAndUpdatesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TaxUpdatesHistoryPage from './pages/TaxUpdatesHistoryPage';
import TaxDataHistoryPage from './pages/TaxDataHistoryPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <TaxPlanningLandingPage />,
  },
  {
    path: "/tax-calculator",
    element: <TaxCalculatorPage />,
  },
  {
    path: "/tax-credits",
    element: <TaxCreditsPage />,
  },
  {
    path: "/tax-planning",
    element: <TaxPlanningLandingPage />,
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
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
