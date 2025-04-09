
import { 
  DataFeed, 
  getDataFeedById, 
  updateDataFeed, 
  createDataFeedLog,
  TaxBracketUpdate,
  RetirementLimitUpdate,
  TaxFormUpdate,
  StandardDeductionUpdate
} from './dataFeed';
import { markTaxDataAsCurrent } from './dataFeed/taxDataCurrency';
import { TAX_BRACKETS_DATA, STANDARD_DEDUCTION_BY_YEAR } from './taxBracketData';
import { toast } from "sonner";

// Maximum number of retry attempts
const MAX_RETRY_ATTEMPTS = 3;
// Delay between retries in milliseconds (exponential backoff)
const RETRY_DELAY = 1000;

/**
 * Fetches tax code updates from the configured data feed
 * @param feedId The ID of the data feed to fetch updates from
 * @param manualTrigger Whether the update was triggered manually
 * @returns A promise that resolves when the update is complete
 */
export const fetchTaxCodeUpdates = async (
  feedId: string = "irs-updates", 
  manualTrigger: boolean = false
): Promise<boolean> => {
  console.log(`Starting tax code update fetch for feed: ${feedId}, manual: ${manualTrigger}`);
  
  // Get the data feed
  const dataFeed = getDataFeedById(feedId);
  if (!dataFeed) {
    console.error(`Data feed with ID ${feedId} not found`);
    return false;
  }

  // Function to handle the API request with retries
  const fetchWithRetry = async (url: string, attempt: number = 1): Promise<any> => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < MAX_RETRY_ATTEMPTS) {
        // Wait with exponential backoff before retrying
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, attempt + 1);
      } else {
        throw error;
      }
    }
  };

  try {
    // Start the update process
    console.log(`Fetching updates from ${dataFeed.api_endpoint}`);
    
    // Attempt to fetch data with retry logic
    const data = await fetchWithRetry(dataFeed.api_endpoint);
    
    // Process the fetched data
    const result = await processTaxCodeUpdates(data, feedId);
    
    // Update the data feed with the last update time
    updateDataFeed(feedId, { 
      last_update: new Date().toISOString(),
      status: "active",
      error_message: undefined
    });

    // Create a log entry
    createDataFeedLog({
      feed_id: feedId,
      timestamp: new Date().toISOString(),
      status: 'success',
      message: `Tax code updates successfully fetched and processed.`,
      success: true,
      changes_count: result.changesCount,
      version_info: result.versionInfo
    });

    // Show success notification
    toast.success(`Tax code updates successfully fetched and processed.`);
    
    // Optional: Send notification to administrators
    notifyAdmins({
      feedId,
      success: true,
      message: `${result.changesCount} tax code updates processed successfully.`,
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error("Error fetching tax code updates:", error);
    
    // Update the data feed with error status
    updateDataFeed(feedId, { 
      status: "error",
      error_message: error instanceof Error ? error.message : "Unknown error" 
    });

    // Create an error log entry
    createDataFeedLog({
      feed_id: feedId,
      timestamp: new Date().toISOString(),
      status: 'error',
      message: `Failed to fetch tax code updates: ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
      changes_count: 0,
      error_message: error instanceof Error ? error.message : "Unknown error"
    });

    // Show error notification
    toast.error(`Failed to fetch tax code updates: ${error instanceof Error ? error.message : "Unknown error"}`);
    
    // Optional: Send notification to administrators
    notifyAdmins({
      feedId,
      success: false,
      message: `Error fetching tax code updates: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString()
    });

    return false;
  }
};

/**
 * Process the fetched tax code update data
 */
const processTaxCodeUpdates = async (
  data: any, 
  feedId: string
): Promise<{ changesCount: number, versionInfo?: string }> => {
  console.log("Processing tax code updates:", data);
  
  let changesCount = 0;
  
  // Extract version info if available
  const versionInfo = data.version || data.versionInfo || undefined;
  
  // Process tax brackets
  if (data.taxBrackets && Array.isArray(data.taxBrackets)) {
    changesCount += await processTaxBrackets(data.taxBrackets);
  }
  
  // Process standard deductions
  if (data.standardDeductions && Array.isArray(data.standardDeductions)) {
    changesCount += await processStandardDeductions(data.standardDeductions);
  }
  
  // Process retirement limits
  if (data.retirementLimits && Array.isArray(data.retirementLimits)) {
    changesCount += await processRetirementLimits(data.retirementLimits);
  }
  
  // Process form references
  if (data.taxForms && Array.isArray(data.taxForms)) {
    changesCount += await processTaxForms(data.taxForms);
  }
  
  console.log(`Processed ${changesCount} tax code updates`);
  
  return { changesCount, versionInfo };
};

/**
 * Process tax bracket updates 
 */
const processTaxBrackets = async (brackets: TaxBracketUpdate[]): Promise<number> => {
  console.log("Processing tax brackets:", brackets.length);
  
  // In a real app, this would update a database.
  // For our mock implementation, we'll just log the changes.
  
  let changesCount = 0;
  
  // Compare incoming brackets with existing ones
  brackets.forEach(newBracket => {
    const filingStatus = newBracket.filingStatus || newBracket.filing_status;
    const bracketMin = newBracket.bracket_min;
    const bracketType = newBracket.bracket_type;
    const rate = newBracket.rate;
    
    if (!filingStatus || bracketMin === undefined || !bracketType) {
      console.warn("Incomplete tax bracket data:", newBracket);
      return;
    }
    
    const existingBracket = TAX_BRACKETS_DATA.find(
      b => b.tax_year === newBracket.year && 
           b.filing_status === filingStatus &&
           b.bracket_min === bracketMin &&
           b.bracket_type === bracketType
    );
    
    if (!existingBracket || existingBracket.rate !== rate) {
      console.log(`Change detected in tax bracket: ${newBracket.year}, ${filingStatus} at ${bracketMin}`);
      changesCount++;
      
      // In a real app, update or insert the bracket in the database
      // For now, we just log it
    }
  });
  
  return changesCount;
};

/**
 * Process standard deduction updates
 */
const processStandardDeductions = async (deductions: StandardDeductionUpdate[]): Promise<number> => {
  console.log("Processing standard deductions:", deductions.length);
  
  let changesCount = 0;
  
  deductions.forEach(newDeduction => {
    const year = newDeduction.year.toString();
    const filingStatus = newDeduction.filing_status || '';
    const amount = newDeduction.amount;
    
    // Skip if we don't have the required data
    if (!filingStatus || amount === undefined) {
      console.warn("Incomplete standard deduction data:", newDeduction);
      return;
    }
    
    // Check if the year exists in our data
    if (STANDARD_DEDUCTION_BY_YEAR[year]) {
      // Check if the filing status exists for this year
      if (STANDARD_DEDUCTION_BY_YEAR[year][filingStatus]) {
        // Compare the amounts
        if (STANDARD_DEDUCTION_BY_YEAR[year][filingStatus] !== amount) {
          console.log(`Change detected in standard deduction: ${year}, ${filingStatus}`);
          changesCount++;
          
          // In a real app, update the database
        }
      } else {
        console.log(`New filing status for standard deduction: ${year}, ${filingStatus}`);
        changesCount++;
        
        // In a real app, insert the new filing status
      }
    } else {
      console.log(`New year for standard deduction: ${year}`);
      changesCount++;
      
      // In a real app, insert the new year
    }
  });
  
  return changesCount;
};

/**
 * Process retirement limit updates
 */
const processRetirementLimits = async (limits: RetirementLimitUpdate[]): Promise<number> => {
  console.log("Processing retirement limits:", limits.length);
  
  // In a real app, this would compare with existing limits and update as needed
  // For our mock implementation, we'll just count them all as changes
  
  return limits.length;
};

/**
 * Process tax form updates
 */
const processTaxForms = async (forms: TaxFormUpdate[]): Promise<number> => {
  console.log("Processing tax forms:", forms.length);
  
  // In a real app, this would compare with existing forms and update as needed
  // For our mock implementation, we'll just count them all as changes
  
  return forms.length;
};

/**
 * Send notification to administrators
 */
const notifyAdmins = async (notification: {
  feedId: string;
  success: boolean;
  message: string;
  timestamp: string;
}): Promise<void> => {
  // In a real app, this would send an email or in-app notification
  console.log("Admin notification:", notification);
  
  // For now, just log the notification
};

/**
 * Schedule updates based on refresh frequency
 */
export const scheduleUpdateChecks = () => {
  // In a real app with persistent server, this would set up actual scheduled jobs
  // For our client-side app, we can periodically check if updates are needed
  
  setInterval(() => {
    checkScheduledUpdates();
  }, 60000); // Check every minute (in a real app, this would be much less frequent)
};

/**
 * Check if any feeds are due for an update based on their frequency
 */
const checkScheduledUpdates = async () => {
  const feeds = [
    getDataFeedById("irs-updates"),
    getDataFeedById("state-tax-rates"),
    // Add other feeds as needed
  ].filter(Boolean) as DataFeed[];
  
  for (const feed of feeds) {
    if (shouldUpdate(feed)) {
      console.log(`Scheduled update for ${feed.id}`);
      await fetchTaxCodeUpdates(feed.id, false);
    }
  }
};

/**
 * Determine if a feed should be updated based on its frequency and last update
 */
const shouldUpdate = (feed: DataFeed): boolean => {
  const lastUpdate = new Date(feed.last_update);
  const now = new Date();
  const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  
  switch (feed.refresh_frequency) {
    case "daily":
      return diffHours >= 24;
    case "weekly":
      return diffHours >= 24 * 7;
    case "monthly":
      return diffHours >= 24 * 30;
    default:
      return false;
  }
};

// Added to match the import in the TaxDataUpdatePrompt component
export const refreshTaxData = (sessionId: string): void => {
  markTaxDataAsCurrent(sessionId);
};
