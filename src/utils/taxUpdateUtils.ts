
import { getTaxBracketLastUpdateTime, getFormattedUpdateDate } from '@/utils/dataFeedUtils';

// Get the tax data last update formatted as a string
export const getFormattedTaxDataLastUpdate = (): string => {
  const lastUpdateTime = getTaxBracketLastUpdateTime();
  return getFormattedUpdateDate(lastUpdateTime);
};

// Function to directly use in components without the dynamic content system
export const getTaxDataLastUpdate = (): string => {
  return getFormattedTaxDataLastUpdate();
};
