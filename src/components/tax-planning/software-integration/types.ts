
export interface SoftwareOption {
  name: string;
  description: string;
  authUrl?: string;
  isPopular?: boolean;
  connectionStatus?: 'connected' | 'disconnected';
  lastSynced?: string;
}
