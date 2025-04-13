
import React from 'react';
import { useCharitable } from '../context/CharitableContext';
import { CharitableScenario } from '../types/CharitableTypes';
import CrtForm from '../components/crt/CrtForm';
import { AlertTriangle } from 'lucide-react';

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
      <div className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-md">
        <div className="flex items-start gap-2">
          <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h5 className="text-yellow-500 font-medium">Important CRT Considerations</h5>
            <p className="text-sm text-muted-foreground">
              Charitable Remainder Trusts require proper legal establishment and ongoing administration.
              The IRS requires a minimum 5% annual payout rate and a minimum 10% charitable remainder value.
              Consult with an attorney experienced in charitable planning before establishing any trust.
            </p>
          </div>
        </div>
      </div>
      
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
