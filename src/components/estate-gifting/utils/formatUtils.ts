
/**
 * Utility functions for formatting values in the Estate Gifting module
 */

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const getLifeCycleStageLabel = (stage: string): string => {
  switch(stage) {
    case 'young-adult': return 'Young Adult (20-40)';
    case 'mid-career': return 'Mid-Career (40-55)';
    case 'pre-retirement': return 'Pre-Retirement (55-65)';
    case 'retirement': return 'Retirement (65+)';
    default: return 'Not specified';
  }
};

export const getTrustTypeLabel = (type?: string): string => {
  switch(type) {
    case 'revocable': return 'Revocable Living Trust';
    case 'ilit': return 'Irrevocable Life Insurance Trust (ILIT)';
    case 'grat': return 'Grantor Retained Annuity Trust (GRAT)';
    case 'slat': return 'Spousal Lifetime Access Trust (SLAT)';
    case 'dynasty': return 'Dynasty Trust';
    default: return 'No specific trust';
  }
};
