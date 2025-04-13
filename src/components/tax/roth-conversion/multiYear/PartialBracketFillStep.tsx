
import React from 'react';
import BasicInformationCard from './cards/BasicInformationCard';
import IncomeInformationCard from './cards/IncomeInformationCard';
import TaxConsiderationWarning from './common/TaxConsiderationWarning';
import { MultiYearScenarioData } from '../types/ScenarioTypes';

interface PartialBracketFillStepProps {
  scenarioData: MultiYearScenarioData;
  onUpdateScenarioData: (newData: Partial<MultiYearScenarioData>) => void;
}

const PartialBracketFillStep: React.FC<PartialBracketFillStepProps> = ({ 
  scenarioData, 
  onUpdateScenarioData 
}) => {
  return (
    <div className="space-y-6">
      <BasicInformationCard
        scenarioData={scenarioData}
        onUpdateScenarioData={onUpdateScenarioData}
      />

      <IncomeInformationCard
        scenarioData={scenarioData}
        onUpdateScenarioData={onUpdateScenarioData}
      />

      <TaxConsiderationWarning />
    </div>
  );
};

export default PartialBracketFillStep;
