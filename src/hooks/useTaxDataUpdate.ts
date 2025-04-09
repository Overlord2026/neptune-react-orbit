
import { useState, useEffect } from 'react';
import { getTaxDataLastUpdate } from '@/utils/taxUpdateUtils';

export function useTaxDataUpdate() {
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  useEffect(() => {
    // Get the formatted last update date
    setLastUpdate(getTaxDataLastUpdate());
  }, []);
  
  return lastUpdate;
}
