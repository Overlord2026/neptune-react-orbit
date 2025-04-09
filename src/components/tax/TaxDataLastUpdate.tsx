
import React from 'react';
import { useTaxDataUpdate } from '@/hooks/useTaxDataUpdate';

interface TaxDataLastUpdateProps {
  className?: string;
}

const TaxDataLastUpdate: React.FC<TaxDataLastUpdateProps> = ({ className = '' }) => {
  const lastUpdate = useTaxDataUpdate();
  
  return (
    <span className={className}>
      {lastUpdate}
    </span>
  );
};

export default TaxDataLastUpdate;
