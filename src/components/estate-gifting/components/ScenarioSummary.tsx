
import React from 'react';
import { Clock, Shield } from "lucide-react";
import { EstateGiftingData } from '../types/EstateGiftingTypes';
import { getLifeCycleStageLabel, getTrustTypeLabel } from '../utils/formatUtils';
import { CURRENT_YEAR } from '../utils/constants';

interface ScenarioSummaryProps {
  data: EstateGiftingData;
}

const ScenarioSummary: React.FC<ScenarioSummaryProps> = ({ data }) => {
  const yearsOfGifting = data.yearOfPassing - CURRENT_YEAR;
  const showTrustInfo = data.useTrustApproach && data.trustType && data.trustType !== 'none';

  return (
    <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#353e52] mb-6">
      <div className="flex items-center gap-2 text-[#B0B0B0] mb-2">
        <Clock className="w-4 h-4" />
        <span>Life Cycle Stage:</span>
        <span className="text-white font-medium">{getLifeCycleStageLabel(data.lifeCycleStage)}</span>
      </div>
      <div className="flex gap-2 text-[#B0B0B0]">
        <span>Planning Timeframe:</span>
        <span className="text-white font-medium">{yearsOfGifting} years</span>
        <span>(until {data.yearOfPassing})</span>
      </div>
      {showTrustInfo && (
        <div className="flex items-center gap-2 text-[#B0B0B0] mt-2">
          <Shield className="w-4 h-4" />
          <span>Trust Strategy:</span>
          <span className="text-white font-medium">{getTrustTypeLabel(data.trustType)}</span>
        </div>
      )}
    </div>
  );
};

export default ScenarioSummary;
