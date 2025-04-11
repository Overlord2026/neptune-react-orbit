
import React from 'react';
import { useTaxDataUpdate } from '@/hooks/useTaxDataUpdate';

interface TaxDataLastUpdateProps {
  className?: string;
  userId?: string;
  showAlerts?: boolean;
}

const TaxDataLastUpdate: React.FC<TaxDataLastUpdateProps> = ({ 
  className = '',
  userId,
  showAlerts = false
}) => {
  const updateInfo = useTaxDataUpdate(userId);
  
  return (
    <span className={className}>
      {updateInfo.lastUpdate}
    </span>
  );
};

export default TaxDataLastUpdate;
