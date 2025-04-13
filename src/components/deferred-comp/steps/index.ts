
export { default as BasicInfoStep } from './BasicInfoStep';
export { default as OptionDetailsStep } from './OptionDetailsStep';
export { default as HoldingPeriodStep } from './HoldingPeriodStep';
export { default as DeferralStrategyStep } from './DeferralStrategyStep';
export { default as MultiYearApproachStep } from './MultiYearApproachStep';
export { default as TaxOutputStep } from './tax-output/TaxOutputStep';

// Export LoadingState component as default (not as a type)
export { default as LoadingState } from './tax-output/LoadingState';

// Export the LoadingState type separately from the types file
export type { LoadingState as LoadingStateType } from '@/types/LoadingState';
