
/**
 * Tax Data Versioning System
 * 
 * This module handles versioned tax data to ensure that historical tax
 * brackets and rates are preserved and that the correct version is used
 * for calculations based on the selected tax year.
 */

import { TaxDataVersion, TaxBracketUpdate, StandardDeductionUpdate } from './dataFeed/types';
import { TaxBracket } from './taxBracketData';

// Mock database of tax data versions (in a real app, this would be in a database)
let taxDataVersions: TaxDataVersion[] = [
  {
    id: 'v2023-01',
    year: 2023,
    version: '1.0',
    effective_date: '2023-01-01',
    published_date: '2022-11-15',
    description: 'Initial 2023 tax brackets and standard deductions'
  },
  {
    id: 'v2022-01',
    year: 2022,
    version: '1.0',
    effective_date: '2022-01-01',
    published_date: '2021-11-10',
    description: 'Initial 2022 tax brackets and standard deductions'
  },
  {
    id: 'v2021-01',
    year: 2021,
    version: '1.0',
    effective_date: '2021-01-01',
    published_date: '2020-10-26',
    description: 'Initial 2021 tax brackets and standard deductions'
  }
];

// In-memory storage of versioned tax brackets (in a real app, this would be in a database)
let versionedTaxBrackets: Record<string, TaxBracket[]> = {};

/**
 * Get all tax data versions
 */
export const getAllTaxDataVersions = (): TaxDataVersion[] => {
  return [...taxDataVersions];
};

/**
 * Get tax data versions for a specific year
 */
export const getTaxDataVersionsForYear = (year: number): TaxDataVersion[] => {
  return taxDataVersions.filter(version => version.year === year);
};

/**
 * Get the latest tax data version for a specific year
 */
export const getLatestTaxDataVersionForYear = (year: number): TaxDataVersion | undefined => {
  const versions = getTaxDataVersionsForYear(year);
  if (versions.length === 0) return undefined;
  
  // Sort by effective date descending to get the most recent version
  return versions.sort((a, b) => {
    return new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime();
  })[0];
};

/**
 * Add a new tax data version
 */
export const addTaxDataVersion = (version: Omit<TaxDataVersion, 'id'>): TaxDataVersion => {
  const id = `v${version.year}-${taxDataVersions.filter(v => v.year === version.year).length + 1}`.padEnd(8, '0');
  const newVersion: TaxDataVersion = {
    ...version,
    id
  };
  
  taxDataVersions.push(newVersion);
  return newVersion;
};

/**
 * Save tax brackets for a specific version
 */
export const saveTaxBracketVersion = (versionId: string, brackets: TaxBracket[]): void => {
  versionedTaxBrackets[versionId] = [...brackets];
};

/**
 * Get tax brackets for a specific version
 */
export const getTaxBracketsForVersion = (versionId: string): TaxBracket[] => {
  return versionedTaxBrackets[versionId] || [];
};

/**
 * Get tax brackets for a specific year (latest version)
 */
export const getTaxBracketsForYear = (year: number): TaxBracket[] => {
  const latestVersion = getLatestTaxDataVersionForYear(year);
  if (!latestVersion) return [];
  
  return getTaxBracketsForVersion(latestVersion.id);
};

/**
 * Check if a year has multiple tax data versions
 * (e.g., due to mid-year legislative changes)
 */
export const hasMidYearUpdates = (year: number): boolean => {
  const versions = getTaxDataVersionsForYear(year);
  return versions.length > 1;
};

/**
 * Get a warning message if there are mid-year updates for a tax year
 */
export const getMidYearUpdateWarning = (year: number): string | null => {
  if (!hasMidYearUpdates(year)) return null;
  
  const versions = getTaxDataVersionsForYear(year);
  return `The tax data for ${year} has been updated ${versions.length} times during the year. Please ensure you're using the correct version for your specific scenario date.`;
};

/**
 * Process tax bracket updates with versioning
 */
export const processTaxBracketsWithVersioning = (
  brackets: TaxBracketUpdate[],
  effectiveDate?: string
): { versionId: string; changesCount: number } => {
  if (brackets.length === 0) {
    return { versionId: '', changesCount: 0 };
  }
  
  // Determine the tax year from the updates
  const year = brackets[0].year;
  
  // Create a new version for this update
  const versionDate = effectiveDate || new Date().toISOString().split('T')[0];
  const newVersion = addTaxDataVersion({
    year,
    version: `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`,
    effective_date: versionDate,
    published_date: new Date().toISOString().split('T')[0],
    description: `Tax brackets update for ${year}`
  });
  
  // Return the version ID and change count
  return { versionId: newVersion.id, changesCount: brackets.length };
};

/**
 * Get the appropriate tax data version to use for a specific scenario
 */
export const getTaxDataVersionForScenario = (
  year: number, 
  scenarioDate?: string
): TaxDataVersion | undefined => {
  const versions = getTaxDataVersionsForYear(year);
  
  if (versions.length === 0) {
    return undefined;
  }
  
  if (!scenarioDate) {
    // If no scenario date is provided, use the latest version
    return getLatestTaxDataVersionForYear(year);
  }
  
  // Find the version that was in effect on the scenario date
  const scenarioTimestamp = new Date(scenarioDate).getTime();
  
  // Filter versions that were effective before or on the scenario date
  const applicableVersions = versions.filter(version => {
    const versionTimestamp = new Date(version.effective_date).getTime();
    return versionTimestamp <= scenarioTimestamp;
  });
  
  if (applicableVersions.length === 0) {
    // If no applicable version is found, use the earliest version for that year
    return versions.sort((a, b) => {
      return new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime();
    })[0];
  }
  
  // Return the latest applicable version
  return applicableVersions.sort((a, b) => {
    return new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime();
  })[0];
};
