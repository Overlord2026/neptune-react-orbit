
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Layout from "./components/Layout";
import HomePage from "./pages/Index";
import TaxPlanningPage from "./pages/TaxPlanningLandingPage";
import TaxFilingPage from "./pages/FileMyTaxesPage";
import TaxFilingOptionsPage from "./pages/TaxFilingOptionsPage";
import TaxVaultPage from "./pages/TaxVaultPage";
import TaxToolsPage from "./pages/TaxToolsPage";
import RothConversionPage from "./pages/RothConversionPage";
import RothConversionAnalysisPage from "./pages/RothConversionAnalysisPage";
import EstateGiftingPage from "./pages/EstateGiftingPage";
import CharitableGivingPage from "./pages/CharitablePlanningPage";
import TaxReturnAnalyzerPage from "./pages/TaxReturnAnalyzerPage";
import Scenario2025Return from "./pages/Scenario2025Return";
import BusinessIncomePage from "./pages/SmallBusinessPage";
import DeferredCompensationPage from "./pages/DeferredCompPage";
import TaxEducationPage from "./pages/BasicTaxEducationPage";
import CollaborationCenterPage from "./pages/CollaborationCenterPage";
import TaxDocumentAggregatorPage from "./pages/TaxDocumentAggregatorPage";
import CompareRothScenariosPage from "./pages/CompareRothScenariosPage";
import RecommendedReadingPage from "./pages/RecommendedReadingPage";
import BasicEducationPage from "./pages/BasicTaxEducationPage";
import TaxGuidePage from "./pages/TaxGuidePage";
import AdvancedTaxEducationPage from "./pages/AdvancedTaxEducationPage";
import TaxGlossaryPage from "./pages/TaxGlossaryPage";
import TaxTrapCheckerPage from "./pages/TaxTrapCheckerPage";
import AdvancedTaxStrategiesPage from "./pages/AdvancedTaxStrategiesPage";

// Using the pattern with useRoutes
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
      element: <Layout><TaxFilingOptionsPage /></Layout>
    },
    {
      path: "/file-my-taxes",
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
      path: "/tax-planning/roth",
      element: <Layout><RothConversionPage /></Layout>
    },
    {
      path: "/tax-planning/roth-analysis",
      element: <Layout><RothConversionAnalysisPage /></Layout>
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
      path: "/tax-planning/charitable-planning",
      element: <Layout><CharitableGivingPage /></Layout>
    },
    {
      path: "/tax-planning/analyzer",
      element: <Layout><TaxReturnAnalyzerPage /></Layout>
    },
    {
      path: "/tax-planning/tax-return",
      element: <Layout><TaxReturnAnalyzerPage /></Layout>
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
    },
    {
      path: "/tax-planning/recommended-reading",
      element: <Layout><RecommendedReadingPage /></Layout>
    },
    {
      path: "/tax-planning/basic-education",
      element: <Layout><BasicEducationPage /></Layout>
    },
    {
      path: "/tax-planning/advanced-tax-education",
      element: <Layout><AdvancedTaxEducationPage /></Layout>
    },
    {
      path: "/tax-planning/glossary",
      element: <Layout><TaxGlossaryPage /></Layout>
    },
    {
      path: "/tax-planning/guides/:guideId",
      element: <Layout><TaxGuidePage /></Layout>
    },
    {
      path: "/tax-planning/tax-traps",
      element: <Layout><TaxTrapCheckerPage /></Layout>
    },
    {
      path: "/tax-planning/advanced-strategies",
      element: <Layout><AdvancedTaxStrategiesPage /></Layout>
    },
    // Add direct file-my-taxes route for tax filing
    {
      path: "/tax-planning/file-my-taxes",
      element: <Layout><TaxFilingPage /></Layout>
    },
    {
      path: "/tax-planning/filing-options",
      element: <Layout><TaxFilingOptionsPage /></Layout>
    }
  ]);

  return routes;
}

function App() {
  return <AppRoutes />;
}

export default App;
