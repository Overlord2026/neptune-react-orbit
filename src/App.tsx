
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
      <Route path="/" element={<MainLayout><div>Home Page</div></MainLayout>} />
      
      {/* Tax Planning Routes */}
      <Route path="/tax-planning" element={<MainLayout><div>Tax Planning Dashboard</div></MainLayout>} />
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
