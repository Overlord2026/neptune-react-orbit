
import { getTaxBracketLastUpdateTime, getFormattedUpdateDate } from '@/utils/dataFeedUtils';
import { TaxAlert } from '@/utils/dataFeed/types';

// Mock database for user notifications (in a real app, this would be stored in a database)
const USER_TAX_ALERTS: { [userId: string]: TaxAlert[] } = {};

// Get the tax data last update formatted as a string
export const getFormattedTaxDataLastUpdate = (): string => {
  const lastUpdateTime = getTaxBracketLastUpdateTime();
  return getFormattedUpdateDate(lastUpdateTime);
};

// Function to directly use in components without the dynamic content system
export const getTaxDataLastUpdate = (): string => {
  return getFormattedTaxDataLastUpdate();
};

// Create a new tax alert
export const createTaxAlert = (
  userId: string, 
  title: string, 
  message: string, 
  options: {
    severity: 'major' | 'minor' | 'info',
    update_type: 'tax_bracket' | 'standard_deduction' | 'retirement_limits' | 'tax_forms' | 'other',
    year: number,
    link_to_learn_more?: string
  }
): TaxAlert => {
  const alert: TaxAlert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    title,
    message,
    link_to_learn_more: options.link_to_learn_more,
    created_at: new Date().toISOString(),
    severity: options.severity,
    update_type: options.update_type,
    year: options.year,
    dismissed: false
  };
  
  // Initialize the user's alerts array if it doesn't exist
  if (!USER_TAX_ALERTS[userId]) {
    USER_TAX_ALERTS[userId] = [];
  }
  
  // Add the alert to the user's alerts
  USER_TAX_ALERTS[userId].push(alert);
  
  return alert;
};

// Get all tax alerts for a user
export const getUserTaxAlerts = (userId: string) => {
  const alerts = USER_TAX_ALERTS[userId] || [];
  const hasUnreadMajorUpdates = alerts.some(alert => alert.severity === 'major' && !alert.read_at && !alert.dismissed);
  
  return {
    alerts,
    hasUnreadMajorUpdates
  };
};

// Mark an alert as read
export const markAlertAsRead = (userId: string, alertId: string): boolean => {
  if (!USER_TAX_ALERTS[userId]) return false;
  
  const alertIndex = USER_TAX_ALERTS[userId].findIndex(alert => alert.id === alertId);
  if (alertIndex === -1) return false;
  
  USER_TAX_ALERTS[userId][alertIndex] = {
    ...USER_TAX_ALERTS[userId][alertIndex],
    read_at: new Date().toISOString()
  };
  
  return true;
};

// Dismiss an alert
export const dismissAlert = (userId: string, alertId: string): boolean => {
  if (!USER_TAX_ALERTS[userId]) return false;
  
  const alertIndex = USER_TAX_ALERTS[userId].findIndex(alert => alert.id === alertId);
  if (alertIndex === -1) return false;
  
  USER_TAX_ALERTS[userId][alertIndex] = {
    ...USER_TAX_ALERTS[userId][alertIndex],
    dismissed: true
  };
  
  return true;
};

// Get all alerts for a specific year
export const getYearAlerts = (userId: string, year: number): TaxAlert[] => {
  const userAlerts = USER_TAX_ALERTS[userId] || [];
  return userAlerts.filter(alert => alert.year === year);
};

// Determine if a tax change is major based on configurable criteria
export const isMajorTaxChange = (
  changeType: string, 
  percentChange: number, 
  threshold: {
    tax_bracket: number,
    standard_deduction: number,
    retirement_limits: number,
    tax_forms: number,
    other: number
  } = {
    tax_bracket: 0.05, // 5% change in tax bracket is considered major
    standard_deduction: 0.08, // 8% change in standard deduction is considered major
    retirement_limits: 0.1, // 10% change in retirement limits is considered major
    tax_forms: 0, // Any change to tax forms is considered major
    other: 0.03 // 3% change in other items is considered major
  }
): boolean => {
  const thresholdValue = threshold[changeType as keyof typeof threshold] || threshold.other;
  return Math.abs(percentChange) >= thresholdValue;
};
