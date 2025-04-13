
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
      
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-md mb-4">
        <div className="flex items-start gap-2">
          <div>
            <h5 className="text-primary font-medium mb-1">CRT Disclaimers</h5>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>Charitable Remainder Trust calculations require precise IRS tables & discount rates. This tool uses approximate factors. Consult an attorney or specialized planning software to finalize any CRT plan.</li>
              <li>CRTs must pass the 10% remainder test and follow specific IRS rules. Additional constraints apply for CRAT vs. CRUT regarding payout rates.</li>
              <li>Advanced variations like NIMCRUTs or Flip CRUTs require more complex calculations and specialized legal guidance.</li>
            </ul>
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
