
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import TaxPlanningLandingPage from './pages/TaxPlanningLandingPage';
import DataFeedsAndUpdatesPage from './pages/DataFeedsAndUpdatesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TaxUpdatesHistoryPage from './pages/TaxUpdatesHistoryPage';
import TaxDataHistoryPage from './pages/TaxDataHistoryPage';
import AdminAuditLogPage from './pages/AdminAuditLogPage';
import AdvancedTaxEducationPage from './pages/AdvancedTaxEducationPage';
import BasicTaxEducationPage from './pages/BasicTaxEducationPage';
import TaxGlossaryPage from './pages/TaxGlossaryPage';
import MyCoursesPage from './pages/MyCoursesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentErrorPage from './pages/PaymentErrorPage';
import FileMyTaxesPage from './pages/FileMyTaxesPage';
import TaxFilingOptionsPage from './pages/TaxFilingOptionsPage';
import TaxPlanningPricingPage from './pages/TaxPlanningPricingPage';
import CompareRothScenariosPage from './pages/CompareRothScenariosPage';
import My404Fallback from './components/My404Fallback';
import { Toaster } from "./components/ui/sonner";
import TaxReturnAnalyzerPage from './pages/TaxReturnAnalyzerPage';
import RothConversionAnalyzerPage from './pages/RothConversionAnalyzerPage';
import RothConversionAnalysisPage from './pages/RothConversionAnalysisPage';
import DynamicBracketManagerPage from './pages/DynamicBracketManagerPage';
import AdvancedTaxStrategiesPage from './pages/AdvancedTaxStrategiesPage';
import TaxDocumentAggregatorPage from './pages/TaxDocumentAggregatorPage';
import TaxVaultPage from './pages/TaxVaultPage';
import SocialSecurityCalculatorPage from './pages/SocialSecurityCalculatorPage';
import RothConversionPage from './pages/RothConversionPage';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <My404Fallback />,
    children: [
      {
        path: "/",
        element: <TaxPlanningLandingPage />,
      },
      {
        path: "/tax-planning",
        element: <TaxPlanningLandingPage />,
      },
      {
        path: "/pricing",
        element: <TaxPlanningPricingPage />,
      },
      {
        path: "/tax-planning/advanced-tax-education",
        element: <AdvancedTaxEducationPage />,
      },
      {
        path: "/tax-planning/basic-education",
        element: <BasicTaxEducationPage />,
      },
      {
        path: "/tax-planning/glossary",
        element: <TaxGlossaryPage />,
      },
      {
        path: "/tax-planning/filing-options",
        element: <TaxFilingOptionsPage />,
      },
      {
        path: "/tax-planning/analyzer",
        element: <TaxReturnAnalyzerPage />,
      },
      {
        path: "/tax-planning/aggregator",
        element: <TaxDocumentAggregatorPage />,
      },
      {
        path: "/tax-planning/roth-conversion",
        element: <RothConversionAnalyzerPage />,
      },
      {
        path: "/tax-planning/roth",
        element: <RothConversionPage />,
      },
      {
        path: "/tax-planning/roth-analysis",
        element: <RothConversionAnalysisPage />,
      },
      {
        path: "/tax-planning/social-security",
        element: <SocialSecurityCalculatorPage />,
      },
      {
        path: "/tax-planning/bracket-manager",
        element: <DynamicBracketManagerPage />,
      },
      {
        path: "/tax-planning/tax-vault",
        element: <TaxVaultPage />,
      },
      {
        path: "/tax-planning/advanced-strategies",
        element: <AdvancedTaxStrategiesPage />,
      },
      {
        path: "/my-courses",
        element: <MyCoursesPage />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "/payment-error",
        element: <PaymentErrorPage />,
      },
      {
        path: "/file-my-taxes",
        element: <FileMyTaxesPage />,
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
        element: <TaxUpdatesHistoryPage />,
      },
      {
        path: "/admin/tax-data-history",
        element: <TaxDataHistoryPage />,
      },
      {
        path: "/admin/audit-log",
        element: <AdminAuditLogPage />,
      },
      {
        path: "/tax-planning/roth-comparison",
        element: <CompareRothScenariosPage />,
      }
    ]
  },
  {
    path: "*",
    element: <My404Fallback />,
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
