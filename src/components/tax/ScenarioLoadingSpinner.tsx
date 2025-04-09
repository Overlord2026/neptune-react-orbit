
import React from 'react';

interface ScenarioLoadingSpinnerProps {
  message?: string;
}

const ScenarioLoadingSpinner: React.FC<ScenarioLoadingSpinnerProps> = ({ 
  message = "Loading scenarios..." 
}) => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default ScenarioLoadingSpinner;
