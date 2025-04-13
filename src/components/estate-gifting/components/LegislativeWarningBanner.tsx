
import React from 'react';
import { FileSignature as FilePdf } from "lucide-react";

const LegislativeWarningBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/30 border border-amber-700/30 rounded-lg p-4 flex gap-3">
      <div className="flex-shrink-0">
        <FilePdf className="w-5 h-5 text-amber-500" />
      </div>
      <div className="text-sm">
        <h5 className="text-amber-400 font-medium mb-1">Legislative Change Warning</h5>
        <p className="text-[#B0B0B0]">
          The federal estate tax exemption is scheduled to be reduced after 2025 unless extended by Congress. 
          This could significantly impact estate tax liabilities. Consider reviewing your plan yearly and 
          before any major legislative changes.
        </p>
      </div>
    </div>
  );
};

export default LegislativeWarningBanner;
