
// Mock Firestore service for tax planning
export interface CharitableScenario {
  id?: string;
  name?: string;
  annualGiving: {
    amount: number;
    type: string;
  };
  results?: any;
  createdAt?: any;
}

interface TaxPlanningFirestoreService {
  saveCharitableScenario: (scenario: CharitableScenario) => Promise<string>;
  getCharitableScenarios: () => Promise<CharitableScenario[]>;
  getCharitableScenario: (id: string) => Promise<CharitableScenario | null>;
  updateCharitableScenario: (id: string, data: Partial<CharitableScenario>) => Promise<void>;
  deleteCharitableScenario: (id: string) => Promise<void>;
}

export const useTaxPlanningFirestore = (): TaxPlanningFirestoreService => ({
  saveCharitableScenario: async () => 'mock-id',
  getCharitableScenarios: async () => [],
  getCharitableScenario: async () => null,
  updateCharitableScenario: async () => {},
  deleteCharitableScenario: async () => {}
});
