
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
import BasicTaxEducationPage from './pages/BasicTaxEducationPage';
import TaxGlossaryPage from './pages/TaxGlossaryPage';
import MyCoursesPage from './pages/MyCoursesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentErrorPage from './pages/PaymentErrorPage';
import FileMyTaxesPage from './pages/FileMyTaxesPage';
import TaxFilingOptionsPage from './pages/TaxFilingOptionsPage';
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <TaxPlanningLandingPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning",
    element: <TaxPlanningLandingPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/advanced-tax-education",
    element: <AdvancedTaxEducationPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/basic-education",
    element: <BasicTaxEducationPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/glossary",
    element: <TaxGlossaryPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/filing-options",
    element: <TaxFilingOptionsPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/analyzer",
    element: <TaxReturnAnalyzerPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/aggregator",
    element: <TaxDocumentAggregatorPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/roth-conversion",
    element: <RothConversionAnalyzerPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/roth-analysis",
    element: <RothConversionAnalysisPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/social-security",
    element: <SocialSecurityCalculatorPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/bracket-manager",
    element: <DynamicBracketManagerPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/tax-vault",
    element: <TaxVaultPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-planning/advanced-strategies",
    element: <AdvancedTaxStrategiesPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/my-courses",
    element: <MyCoursesPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/payment-success",
    element: <PaymentSuccessPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/payment-error",
    element: <PaymentErrorPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/file-my-taxes",
    element: <FileMyTaxesPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/admin/data-feeds",
    element: <DataFeedsAndUpdatesPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/tax-updates-history",
    element: <TaxUpdatesHistoryPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/admin/tax-data-history",
    element: <TaxDataHistoryPage />,
    errorElement: <My404Fallback />,
  },
  {
    path: "/admin/audit-log",
    element: <AdminAuditLogPage />,
    errorElement: <My404Fallback />,
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
