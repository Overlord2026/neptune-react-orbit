
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import TaxTrapCheckerPage from './pages/TaxTrapCheckerPage';
import FileMyTaxesPage from './pages/FileMyTaxesPage';
import DeferredCompPage from './pages/DeferredCompPage';
import AvoidingTaxTrapsPage from './pages/AvoidingTaxTrapsPage';
import TaxThresholdCalculatorPage from './pages/TaxThresholdCalculatorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Tax Planning Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-[#1a202c] border border-[#334155] rounded-lg hover:border-[#4299e1] transition-colors shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-white">Tax Trap Checker</h2>
                <p className="text-[#a0aec0] mb-4">Identify potential tax thresholds that could impact your tax liability.</p>
                <a href="/tax-planning/tax-traps" className="text-[#4299e1] hover:text-[#3182ce] transition-colors">
                  Check your tax traps →
                </a>
              </div>
              <div className="p-6 bg-[#1a202c] border border-[#334155] rounded-lg hover:border-[#4299e1] transition-colors shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-white">File My Taxes</h2>
                <p className="text-[#a0aec0] mb-4">Complete your tax return with our step-by-step guided process.</p>
                <a href="/tax-filing" className="text-[#4299e1] hover:text-[#3182ce] transition-colors">
                  Start tax filing →
                </a>
              </div>
              <div className="p-6 bg-[#1a202c] border border-[#334155] rounded-lg hover:border-[#4299e1] transition-colors shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-white">Tax Threshold Calculator</h2>
                <p className="text-[#a0aec0] mb-4">Calculate your tax thresholds and plan ahead to minimize your tax burden.</p>
                <a href="/tax-planning/threshold-calculator" className="text-[#4299e1] hover:text-[#3182ce] transition-colors">
                  Open calculator →
                </a>
              </div>
            </div>
          </div>
        </MainLayout>
      } />
      
      {/* Tax Planning Routes */}
      <Route path="/tax-planning" element={<MainLayout><div className="max-w-6xl mx-auto p-6">Tax Planning Dashboard</div></MainLayout>} />
      <Route path="/tax-planning/tax-traps" element={<MainLayout><TaxTrapCheckerPage /></MainLayout>} />
      <Route path="/tax-planning/threshold-calculator" element={<MainLayout><TaxThresholdCalculatorPage /></MainLayout>} />
      <Route path="/tax-planning/avoiding-tax-traps" element={<MainLayout><AvoidingTaxTrapsPage /></MainLayout>} />
      <Route path="/tax-planning/deferred-comp" element={<MainLayout><DeferredCompPage /></MainLayout>} />
      
      {/* Tax Filing Routes */}
      <Route path="/tax-filing" element={<MainLayout><FileMyTaxesPage /></MainLayout>} />
    </Routes>
  );
}

export default App;
