
import { useState, useEffect } from 'react';
import { getTaxDataLastUpdate, getUserTaxAlerts } from '@/utils/taxUpdateUtils';
import { TaxAlert } from '@/utils/dataFeed/types';

export interface TaxDataUpdateInfo {
  lastUpdate: string;
  hasUnreadMajorUpdates: boolean;
  alerts: TaxAlert[];
}

export function useTaxDataUpdate(userId?: string): TaxDataUpdateInfo {
  const [updateInfo, setUpdateInfo] = useState<TaxDataUpdateInfo>({
    lastUpdate: '',
    hasUnreadMajorUpdates: false,
    alerts: []
  });
  
  useEffect(() => {
    // Get the formatted last update date
    const lastUpdateDate = getTaxDataLastUpdate();
    
    // Get user alerts if we have a userId
    let alerts: TaxAlert[] = [];
    let hasUnreadMajorUpdates = false;
    
    if (userId) {
      const userAlerts = getUserTaxAlerts(userId);
      alerts = userAlerts.alerts;
      hasUnreadMajorUpdates = userAlerts.hasUnreadMajorUpdates;
    }
    
    setUpdateInfo({
      lastUpdate: lastUpdateDate,
      hasUnreadMajorUpdates,
      alerts
    });
  }, [userId]);
  
  return updateInfo;
}
