import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TaxPlanningPage from "./pages/TaxPlanningPage";
import TaxFilingPage from "./pages/TaxFilingPage";
import TaxVaultPage from "./pages/TaxVaultPage";
import TaxToolsPage from "./pages/TaxToolsPage";
import RothConversionPage from "./pages/RothConversionPage";
import EstateGiftingPage from "./pages/EstateGiftingPage";
import CharitableGivingPage from "./pages/CharitableGivingPage";
import TaxReturnPage from "./pages/TaxReturnPage";
import Scenario2025Return from "./pages/Scenario2025Return";
import BusinessIncomePage from "./pages/BusinessIncomePage";
import DeferredCompensationPage from "./pages/DeferredCompensationPage";
import TaxEducationPage from "./pages/TaxEducationPage";
import CollaborationCenterPage from "./pages/CollaborationCenterPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/tax-planning" element={
          <Layout>
            <TaxPlanningPage />
          </Layout>
        } />
        <Route path="/tax-filing" element={
          <Layout>
            <TaxFilingPage />
          </Layout>
        } />
        <Route path="/tax-vault" element={
          <Layout>
            <TaxVaultPage />
          </Layout>
        } />
        <Route path="/tax-planning/tax-tools" element={
          <Layout>
            <TaxToolsPage />
          </Layout>
        } />
        <Route path="/tax-planning/roth-conversion" element={
          <Layout>
            <RothConversionPage />
          </Layout>
        } />
        <Route path="/tax-planning/estate-gifting" element={
          <Layout>
            <EstateGiftingPage />
          </Layout>
        } />
        <Route path="/tax-planning/charitable-giving" element={
          <Layout>
            <CharitableGivingPage />
          </Layout>
        } />
        <Route path="/tax-filing/tax-return" element={
          <Layout>
            <TaxReturnPage />
          </Layout>
        } />
        <Route path="/tax-planning/scenario-2025" element={
          <Layout>
            <Scenario2025Return />
          </Layout>
        } />
        <Route path="/tax-planning/small-business" element={
          <Layout>
            <BusinessIncomePage />
          </Layout>
        } />
        <Route path="/tax-planning/deferred-comp" element={
          <Layout>
            <DeferredCompensationPage />
          </Layout>
        } />
        <Route path="/tax-education/:topic" element={
          <Layout>
            <TaxEducationPage />
          </Layout>
        } />
        
        {/* Add Collaboration Center route */}
        <Route path="/tax-planning/collaboration" element={
          <Layout>
            <CollaborationCenterPage />
          </Layout>
        } />
        
      </Routes>
    </div>
  );
}

export default App;
