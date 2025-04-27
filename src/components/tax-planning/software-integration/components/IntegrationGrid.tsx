
import React from 'react';
import { SoftwareOption } from '../types';
import IntegrationCard from './IntegrationCard';

interface IntegrationGridProps {
  softwareOptions: SoftwareOption[];
  onConnect: (software: SoftwareOption) => void;
  onSync: (software: SoftwareOption) => void;
}

const IntegrationGrid: React.FC<IntegrationGridProps> = ({ 
  softwareOptions, 
  onConnect, 
  onSync 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {softwareOptions.map((software) => (
        <IntegrationCard
          key={software.name}
          software={software}
          onConnect={onConnect}
          onSync={onSync}
        />
      ))}
    </div>
  );
};

export default IntegrationGrid;
