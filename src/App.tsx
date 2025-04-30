
import React from 'react';
import { useRoutes } from 'react-router-dom';
import MainLayout from "./components/MainLayout";
import LandingPage from "./pages/LandingPage";
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
import TaxPlanningPricingPage from "./pages/TaxPlanningPricingPage";

function AppRoutes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: "/tax-planning",
      element: <MainLayout><TaxPlanningPage /></MainLayout>
    },
    {
      path: "/tax-filing",
      element: <MainLayout><TaxFilingOptionsPage /></MainLayout>
    },
    {
      path: "/file-my-taxes",
      element: <MainLayout><TaxFilingPage /></MainLayout>
    },
    {
      path: "/tax-vault",
      element: <MainLayout><TaxVaultPage /></MainLayout>
    },
    {
      path: "/tax-planning/tax-tools",
      element: <MainLayout><TaxToolsPage /></MainLayout>
    },
    {
      path: "/tax-planning/roth-conversion",
      element: <MainLayout><RothConversionPage /></MainLayout>
    },
    {
      path: "/tax-planning/roth",
      element: <MainLayout><RothConversionPage /></MainLayout>
    },
    {
      path: "/tax-planning/roth-analysis",
      element: <MainLayout><RothConversionAnalysisPage /></MainLayout>
    },
    {
      path: "/tax-planning/roth-scenarios",
      element: <MainLayout><CompareRothScenariosPage /></MainLayout>
    },
    {
      path: "/tax-planning/estate-gifting",
      element: <MainLayout><EstateGiftingPage /></MainLayout>
    },
    {
      path: "/tax-planning/charitable-giving",
      element: <MainLayout><CharitableGivingPage /></MainLayout>
    },
    {
      path: "/tax-planning/charitable-planning",
      element: <MainLayout><CharitableGivingPage /></MainLayout>
    },
    {
      path: "/tax-planning/analyzer",
      element: <MainLayout><TaxReturnAnalyzerPage /></MainLayout>
    },
    {
      path: "/tax-planning/tax-return",
      element: <MainLayout><TaxReturnAnalyzerPage /></MainLayout>
    },
    {
      path: "/tax-planning/scenario-2025",
      element: <MainLayout><Scenario2025Return /></MainLayout>
    },
    {
      path: "/tax-planning/small-business",
      element: <MainLayout><BusinessIncomePage /></MainLayout>
    },
    {
      path: "/tax-planning/deferred-comp",
      element: <MainLayout><DeferredCompensationPage /></MainLayout>
    },
    {
      path: "/tax-education/:topic",
      element: <MainLayout><TaxEducationPage /></MainLayout>
    },
    {
      path: "/tax-planning/collaboration",
      element: <MainLayout><CollaborationCenterPage /></MainLayout>
    },
    {
      path: "/tax-planning/aggregator",
      element: <MainLayout><TaxDocumentAggregatorPage /></MainLayout>
    },
    {
      path: "/tax-planning/recommended-reading",
      element: <MainLayout><RecommendedReadingPage /></MainLayout>
    },
    {
      path: "/tax-planning/basic-education",
      element: <MainLayout><BasicEducationPage /></MainLayout>
    },
    {
      path: "/tax-planning/advanced-tax-education",
      element: <MainLayout><AdvancedTaxEducationPage /></MainLayout>
    },
    {
      path: "/tax-planning/glossary",
      element: <MainLayout><TaxGlossaryPage /></MainLayout>
    },
    {
      path: "/tax-planning/guides/:guideId",
      element: <MainLayout><TaxGuidePage /></MainLayout>
    },
    {
      path: "/tax-planning/tax-traps",
      element: <MainLayout><TaxTrapCheckerPage /></MainLayout>
    },
    {
      path: "/tax-planning/advanced-strategies",
      element: <MainLayout><AdvancedTaxStrategiesPage /></MainLayout>
    },
    {
      path: "/tax-planning/file-my-taxes",
      element: <MainLayout><TaxFilingPage /></MainLayout>
    },
    {
      path: "/tax-planning/filing-options",
      element: <MainLayout><TaxFilingOptionsPage /></MainLayout>
    },
    {
      path: "/pricing",
      element: <MainLayout><TaxPlanningPricingPage /></MainLayout>
    }
  ]);

  return routes;
}

function App() {
  return <AppRoutes />;
}

export default App;
