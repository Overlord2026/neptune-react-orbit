
export interface SoftwareOption {
  name: string;
  description: string;
  isPopular: boolean;
  authUrl?: string;
  connectionStatus?: 'connected' | 'disconnected';
  lastSynced?: string;
}
