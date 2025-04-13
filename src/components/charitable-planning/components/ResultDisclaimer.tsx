
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ResultDisclaimer: React.FC = () => {
  return (
    <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
      <div>
        <p className="font-medium text-white">Important Disclaimers</p>
        <p className="text-muted-foreground">
          This analysis is for educational purposes only and not tax advice. Actual tax outcomes depend on your complete financial picture, 
          future tax law changes, and other factors. Consult with a tax professional before implementing any strategy.
        </p>
      </div>
    </div>
  );
};

export default ResultDisclaimer;
