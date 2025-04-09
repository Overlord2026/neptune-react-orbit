
import { DataFeed, DataFeedLog } from './types';
import { dataFeeds as dataFeedsImport, dataFeedLogs } from './mockData';

// Create a mutable copy of the imported data feeds
let dataFeeds = [...dataFeedsImport];

// Helper function to get a data feed by ID
export const getDataFeedById = (feedId: string): DataFeed | undefined => {
  return dataFeeds.find(feed => feed.id === feedId);
};

// Helper function to update a data feed
export const updateDataFeed = (feedId: string, updates: Partial<DataFeed>): DataFeed | null => {
  const index = dataFeeds.findIndex(feed => feed.id === feedId);
  if (index === -1) return null;
  
  dataFeeds[index] = { ...dataFeeds[index], ...updates };
  return dataFeeds[index];
};

// Helper function to create a log entry
export const createDataFeedLog = (log: Omit<DataFeedLog, 'id'>): DataFeedLog => {
  const newLog: DataFeedLog = {
    id: `log-${Date.now()}`,
    ...log,
  };
  dataFeedLogs.push(newLog);
  return newLog;
};

// Helper function to get logs for a specific feed
export const getDataFeedLogs = (feedId: string): DataFeedLog[] => {
  return dataFeedLogs.filter(log => log.feed_id === feedId);
};

// Export the dataFeeds array for use in components
export const getAllDataFeeds = (): DataFeed[] => {
  return dataFeeds;
};

// Export function to replace all data feeds (used in components)
export const setAllDataFeeds = (feeds: DataFeed[]): void => {
  dataFeeds = feeds;
};
