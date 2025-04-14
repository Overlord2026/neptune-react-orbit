
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Layout from "./components/Layout";
import HomePage from "./pages/Index";
import TaxPlanningPage from "./pages/TaxPlanningLandingPage";
import TaxFilingPage from "./pages/FileMyTaxesPage";
import TaxVaultPage from "./pages/TaxVaultPage";
import TaxToolsPage from "./pages/TaxToolsPage";
import RothConversionPage from "./pages/RothConversionPage";
import EstateGiftingPage from "./pages/EstateGiftingPage";
import CharitableGivingPage from "./pages/CharitablePlanningPage";
import TaxReturnPage from "./pages/TaxReturnAnalyzerPage";
import Scenario2025Return from "./pages/Scenario2025Return";
import BusinessIncomePage from "./pages/SmallBusinessPage";
import DeferredCompensationPage from "./pages/DeferredCompPage";
import TaxEducationPage from "./pages/BasicTaxEducationPage";
import CollaborationCenterPage from "./pages/CollaborationCenterPage";
import TaxDocumentAggregatorPage from "./pages/TaxDocumentAggregatorPage";
import CompareRothScenariosPage from "./pages/CompareRothScenariosPage";

// Using the pattern you suggested with useRoutes
function AppRoutes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout><HomePage /></Layout>
    },
    {
      path: "/tax-planning",
      element: <Layout><TaxPlanningPage /></Layout>
    },
    {
      path: "/tax-filing",
      element: <Layout><TaxFilingPage /></Layout>
    },
    {
      path: "/tax-vault",
      element: <Layout><TaxVaultPage /></Layout>
    },
    {
      path: "/tax-planning/tax-tools",
      element: <Layout><TaxToolsPage /></Layout>
    },
    {
      path: "/tax-planning/roth-conversion",
      element: <Layout><RothConversionPage /></Layout>
    },
    {
      path: "/tax-planning/roth-scenarios",
      element: <Layout><CompareRothScenariosPage /></Layout>
    },
    {
      path: "/tax-planning/estate-gifting",
      element: <Layout><EstateGiftingPage /></Layout>
    },
    {
      path: "/tax-planning/charitable-giving",
      element: <Layout><CharitableGivingPage /></Layout>
    },
    {
      path: "/tax-filing/tax-return",
      element: <Layout><TaxReturnPage /></Layout>
    },
    {
      path: "/tax-planning/scenario-2025",
      element: <Layout><Scenario2025Return /></Layout>
    },
    {
      path: "/tax-planning/small-business",
      element: <Layout><BusinessIncomePage /></Layout>
    },
    {
      path: "/tax-planning/deferred-comp",
      element: <Layout><DeferredCompensationPage /></Layout>
    },
    {
      path: "/tax-education/:topic",
      element: <Layout><TaxEducationPage /></Layout>
    },
    {
      path: "/tax-planning/collaboration",
      element: <Layout><CollaborationCenterPage /></Layout>
    },
    {
      path: "/tax-planning/aggregator",
      element: <Layout><TaxDocumentAggregatorPage /></Layout>
    }
  ]);

  return routes;
}

function App() {
  return <AppRoutes />;
}

export default App;
