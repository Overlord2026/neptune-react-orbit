
import { TaxDataCacheInfo } from './types';
import { taxDataCache } from './mockData';
import { getDataFeedById } from './dataFeedCore';

// Get the last update time for tax brackets
export const getTaxBracketLastUpdateTime = (): string => {
  const irsFeed = getDataFeedById("irs-updates");
  return irsFeed?.last_update || new Date().toISOString();
};

// Check if user's tax data is current or needs update
export const checkTaxDataCurrency = (
  sessionId: string = "default",
  cacheTimeoutMinutes: number = 15
): TaxDataCacheInfo => {
  const now = new Date();
  const dataLastUpdated = getTaxBracketLastUpdateTime();
  
  // If we don't have cache info for this session, create it
  if (!taxDataCache[sessionId]) {
    taxDataCache[sessionId] = {
      lastChecked: now.toISOString(),
      dataUpdatedAt: dataLastUpdated,
      isCurrent: true
    };
    return taxDataCache[sessionId];
  }
  
  const cacheInfo = taxDataCache[sessionId];
  const lastChecked = new Date(cacheInfo.lastChecked);
  const cacheExpired = (now.getTime() - lastChecked.getTime()) > (cacheTimeoutMinutes * 60 * 1000);

  // Check if tax data has been updated since we last checked
  const dataUpdatedSinceLastCheck = new Date(dataLastUpdated) > new Date(cacheInfo.dataUpdatedAt);
  
  // If cache has expired or data has been updated, refresh the cache info
  if (cacheExpired || dataUpdatedSinceLastCheck) {
    taxDataCache[sessionId] = {
      lastChecked: now.toISOString(),
      dataUpdatedAt: dataLastUpdated,
      isCurrent: !dataUpdatedSinceLastCheck
    };
  }
  
  return taxDataCache[sessionId];
};

// Mark session's tax data as current (after user has refreshed their data)
export const markTaxDataAsCurrent = (sessionId: string = "default"): void => {
  if (!taxDataCache[sessionId]) {
    checkTaxDataCurrency(sessionId);
    return;
  }
  
  taxDataCache[sessionId] = {
    ...taxDataCache[sessionId],
    lastChecked: new Date().toISOString(),
    dataUpdatedAt: getTaxBracketLastUpdateTime(),
    isCurrent: true
  };
};
