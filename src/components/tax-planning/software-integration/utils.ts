
export const getSoftwareOptions = () => [
  {
    name: "QuickBooks",
    description: "Connect to QuickBooks Online for automated tax data import",
    authUrl: "https://quickbooks.intuit.com/oauth2/v1/authorize",
    isPopular: true
  },
  {
    name: "Xero",
    description: "Import your financial data directly from Xero",
    authUrl: "https://login.xero.com/identity/connect/authorize",
    isPopular: true
  },
  {
    name: "FreshBooks",
    description: "Coming soon - Connect your FreshBooks account"
  },
  {
    name: "Wave",
    description: "Coming soon - Sync your Wave accounting data"
  }
];

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};
