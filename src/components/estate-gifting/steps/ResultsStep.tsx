import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EstateGiftingData } from '../types/EstateGiftingTypes';
import TaxDisclaimerWithCheckbox from "@/components/tax/TaxDisclaimerWithCheckbox";
import ScenarioSummary from '../components/ScenarioSummary';
import EstateDistributionPieChart from '../components/EstateDistributionPieChart';
import StrategyBenefitCard from '../components/StrategyBenefitCard';
import LegislativeWarningBanner from '../components/LegislativeWarningBanner';
import ActionButtons from '../components/ActionButtons';
import EstateDisclaimerContent from '../components/EstateDisclaimerContent';
import { formatCurrency } from '../utils/formatUtils';
import { CURRENT_YEAR } from '../utils/constants';
import ShareScenarioCard from '@/components/tax-planning/collaboration/ShareScenarioCard';

interface ResultsStepProps {
  data: EstateGiftingData;
  onSave: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ data, onSave }) => {
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  
  // Calculate net to heirs for each scenario
  const netToHeirsNoGifting = data.netWorth - data.noGiftingTax;
  const netToHeirsWithGifting = data.netWorth - data.giftingTax + data.heirsBenefit - data.taxSavings;
  
  // Data for pie charts
  const noGiftingData = [
    { name: "To Heirs", value: netToHeirsNoGifting },
    { name: "Estate Tax", value: data.noGiftingTax }
  ];
  
  const giftingData = [
    { name: "To Heirs", value: netToHeirsWithGifting },
    { name: "Estate Tax", value: data.giftingTax }
  ];
  
  // Estimated years of gifting
  const yearsOfGifting = data.yearOfPassing - CURRENT_YEAR;
  
  // Trust-related information
  const showTrustInfo = data.useTrustApproach && data.trustType && data.trustType !== 'none';
  const trustReductionValue = data.useTrustApproach ? data.trustReductionFactor * 100 : 0;

  // Footer data for charts
  const noGiftingFooterData = [
    { label: "Projected Estate Value:", value: formatCurrency(data.netWorth) },
    { label: "Estate Tax:", value: formatCurrency(data.noGiftingTax), className: "text-red-400" },
    { label: "Net to Heirs:", value: formatCurrency(netToHeirsNoGifting), className: "font-medium" }
  ];

  const giftingFooterData = [
    { 
      label: data.giftingStrategy === 'annual' 
        ? `Annual Gifts (over ${yearsOfGifting} years):` 
        : 'One-time Gift:', 
      value: formatCurrency(data.heirsBenefit - data.taxSavings), 
      className: "text-green-400" 
    },
    ...(showTrustInfo ? [{ 
      label: "Trust Benefit:", 
      value: `~${trustReductionValue.toFixed(0)}% reduction`, 
      className: "text-blue-400" 
    }] : []),
    { label: "Estate Tax:", value: formatCurrency(data.giftingTax), className: "text-red-400" },
    { label: "Net to Heirs:", value: formatCurrency(netToHeirsWithGifting), className: "font-medium" }
  ];

  // Mock tax vault documents
  const taxVaultDocuments = [
    { id: '1', name: 'Will.pdf', type: 'pdf' },
    { id: '2', name: 'Trust Document.pdf', type: 'pdf' },
    { id: '3', name: 'Estate Inventory.xlsx', type: 'spreadsheet' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">Results Summary</h3>

      <ScenarioSummary data={data} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#353e52] bg-[#1A1F2C]">
          <CardContent className="p-4">
            <EstateDistributionPieChart
              title="Scenario A: No Gifting"
              data={noGiftingData}
              footerData={noGiftingFooterData}
            />
          </CardContent>
        </Card>

        <Card className="border-[#353e52] bg-[#1A1F2C]">
          <CardContent className="p-4">
            <EstateDistributionPieChart
              title="Scenario B: With Gifting"
              data={giftingData}
              footerData={giftingFooterData}
            />
          </CardContent>
        </Card>
      </div>

      <StrategyBenefitCard data={data} />
      
      <LegislativeWarningBanner />
      
      <ShareScenarioCard
        scenarioId={`estate-${CURRENT_YEAR}-${data.yearOfPassing}`}
        scenarioType="estate"
        scenarioName={`Estate & Gifting Strategy (${CURRENT_YEAR}-${data.yearOfPassing})`}
        documents={taxVaultDocuments}
      />
    
      <ActionButtons onSave={onSave} />
      
      <TaxDisclaimerWithCheckbox
        acknowledged={disclaimerAcknowledged}
        onAcknowledgeChange={setDisclaimerAcknowledged}
        title="Important Information"
        content={<EstateDisclaimerContent showTrustInfo={showTrustInfo} />}
        checkboxLabel="I understand these results are estimates and will consult with professional advisors"
      />
    </div>
  );
};

export default ResultsStep;
