
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TaxPlanningLandingPage from "./pages/TaxPlanningLandingPage";
import TaxReturnAnalyzerPage from "./pages/TaxReturnAnalyzerPage";
import TaxDocumentAggregatorPage from "./pages/TaxDocumentAggregatorPage";
import RothConversionAnalyzerPage from "./pages/RothConversionAnalyzerPage";
import SocialSecurityCalculatorPage from "./pages/SocialSecurityCalculatorPage";
import DynamicBracketManagerPage from "./pages/DynamicBracketManagerPage";
import TaxVaultPage from "./pages/TaxVaultPage";
import StatCardDemo from "./pages/StatCardDemo";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SystemHealthDashboardPage from "./pages/SystemHealthDashboardPage";
import SystemDiagnosticsPage from "./pages/SystemDiagnosticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Index />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="projects" element={<Projects />} />
            <Route path="team" element={<Team />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="tax-planning" element={<TaxPlanningLandingPage />} />
            <Route path="tax-planning/analyzer" element={<TaxReturnAnalyzerPage />} />
            <Route path="tax-planning/aggregator" element={<TaxDocumentAggregatorPage />} />
            <Route path="tax-planning/roth-conversion" element={<RothConversionAnalyzerPage />} />
            <Route path="tax-planning/social-security" element={<SocialSecurityCalculatorPage />} />
            <Route path="tax-planning/bracket-manager" element={<DynamicBracketManagerPage />} />
            <Route path="tax-planning/tax-vault" element={<TaxVaultPage />} />
            <Route path="system-health" element={<SystemHealthDashboardPage />} />
            <Route path="system-diagnostics" element={<SystemDiagnosticsPage />} />
            <Route path="stat-card-demo" element={<StatCardDemo />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
