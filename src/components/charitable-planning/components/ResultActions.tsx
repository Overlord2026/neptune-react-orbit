
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Share2, Download } from 'lucide-react';

interface ResultActionsProps {
  onBack: () => void;
  onRecalculate: () => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({ onBack, onRecalculate }) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="flex-1 flex justify-end gap-3">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={onRecalculate}
        >
          <Calculator className="mr-2 h-4 w-4" /> Recalculate
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share Results
        </Button>
        
        <Button
          className="bg-[#007BFF] hover:bg-[#0069d9] flex items-center"
        >
          <Download className="mr-2 h-4 w-4" /> Save Plan
        </Button>
      </div>
    </div>
  );
};

export default ResultActions;
