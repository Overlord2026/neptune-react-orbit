
import React from 'react';
import { useCharitable } from '../context/CharitableContext';
import { CharitableScenario } from '../types/CharitableTypes';
import CrtForm from '../components/crt/CrtForm';

interface CrtStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CrtStep: React.FC<CrtStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  return (
    <div className="space-y-6">
      <CrtForm 
        scenario={scenario}
        updateScenario={updateScenario}
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
};

export default CrtStep;
