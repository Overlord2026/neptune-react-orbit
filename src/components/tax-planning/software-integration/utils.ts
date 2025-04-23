
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getSoftwareOptions = () => [
  {
    name: "QuickBooks",
    description: "Connect your QuickBooks account to automatically import income and expense data for tax projections.",
    isPopular: true,
    authUrl: "https://appcenter.intuit.com/connect/oauth2",
    connectionStatus: 'disconnected',
  },
  {
    name: "Xero",
    description: "Sync your Xero accounting data to simplify tax filing and ensure accuracy in your deductions.",
    isPopular: false,
    authUrl: "https://login.xero.com/identity/connect/authorize",
    connectionStatus: 'disconnected',
  },
  {
    name: "Wave",
    description: "Link your Wave account for seamless integration of your financial data with our tax planning tools.",
    isPopular: false,
  },
  {
    name: "FreshBooks",
    description: "Import your FreshBooks data to streamline tax preparation and maximize potential deductions.",
    isPopular: true,
  },
];
