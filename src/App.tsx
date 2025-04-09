
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TaxPlanningLandingPage from "./pages/TaxPlanningLandingPage";
import neptuneLogo from './assets/images/logo.png';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="projects" element={<Projects />} />
            <Route path="team" element={<Team />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tax-planning" element={<TaxPlanningLandingPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <div className="neptune-app min-h-screen w-full neptune-bg">
        <header className="p-4 border-b border-gold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={neptuneLogo} alt="Project Neptune Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold neptune-gold">Project Neptune</h1>
          </div>
        </header>
        <main className="p-6 flex justify-center items-center">
          <h2 className="text-3xl neptune-gold font-bold">Hello, Project Neptune!</h2>
        </main>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
