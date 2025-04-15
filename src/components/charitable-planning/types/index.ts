
/**
 * Re-export charitable planning types
 */

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type {
  CharitableScenario,
  AnnualGiving,
  DafStrategy,
  QcdStrategy,
  CharitableRemainderTrust,
  YearlyPlanItem,
  MultiYearPlan,
  ResultsSummary
} from './CharitableTypes';

// Define missing types that were being re-exported
export type { CharitableInput } from './CharitablePlanningTypes';
export type { CharitableStrategy } from './CharitablePlanningTypes';
export type { CharitablePlanning } from './CharitablePlanningTypes';
export type { CharitablePlanningStep } from './CharitablePlanningTypes';
export type { DonationOption } from './CharitablePlanningTypes';
export type { CrtType } from './CharitablePlanningTypes';
export type { CrtInput } from './CharitablePlanningTypes';
export type { CrtCalculationResult } from './CharitablePlanningTypes';
export type { QcdInput } from './CharitablePlanningTypes';
export type { QcdCalculationResult } from './CharitablePlanningTypes';
export type { DafInput } from './CharitablePlanningTypes';
export type { DafCalculationResult } from './CharitablePlanningTypes';
export type { CharitablePlanningContext } from './CharitablePlanningTypes';
export type { CharitableActionType } from './CharitablePlanningTypes';
export type { CharitableState } from './CharitablePlanningTypes';
export type { PlanningTimeframe } from './CharitablePlanningTypes';
