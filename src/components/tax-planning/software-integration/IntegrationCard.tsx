
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, Calendar, Info, Check } from 'lucide-react';
import { SoftwareOption } from './types';
import { formatDate } from './utils';

interface IntegrationCardProps {
  software: SoftwareOption;
  onConnect: (software: SoftwareOption) => void;
  onSync: (software: SoftwareOption) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  software,
  onConnect,
  onSync,
}) => {
  return (
    <Card key={software.name} className="overflow-hidden bg-[#1A1F2C] border border-[#242A38] hover:border-[#007BFF] transition-colors">
      <CardHeader className="bg-[#242A38] pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#E5E5E5] text-xl">
            {software.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {software.connectionStatus === 'connected' && (
              <Badge className="bg-[#00C47C] text-white hover:bg-[#00a067] flex items-center gap-1">
                Connected <Check className="h-3 w-3" />
              </Badge>
            )}
            {software.isPopular && !software.connectionStatus && (
              <Badge className="bg-[#007BFF] text-white hover:bg-[#0069d9]">Popular</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-[#B0B0B0] mb-4">
          {software.description}
        </p>
        
        {software.connectionStatus === 'connected' && software.lastSynced && (
          <div className="flex items-center text-xs text-[#B0B0B0] mb-3">
            <Calendar className="mr-1 h-3 w-3" /> 
            <span>Last synced: {software.lastSynced}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          {software.connectionStatus === 'connected' ? (
            <>
              <Button 
                variant="outline"
                className="text-[#007BFF] border-[#353e52] hover:bg-[#242A38] hover:border-[#007BFF] flex-1"
                onClick={() => onSync(software)}
              >
                Sync Now
                <RefreshCw className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                className="text-[#00C47C] border-[#353e52] hover:bg-[#242A38] hover:border-[#00C47C]"
                onClick={() => onConnect(software)}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button 
              variant="outline"
              className="text-[#007BFF] border-[#353e52] hover:bg-[#242A38] hover:border-[#007BFF] group w-full"
              onClick={() => onConnect(software)}
            >
              Connect
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>

        {!software.connectionStatus && (
          <div className="flex items-start mt-2 space-x-1.5">
            <Info className="h-3.5 w-3.5 text-[#808080] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#808080]">
              By connecting, you grant us permission to access your financial data for tax projections. 
              Your credentials are protected by OAuth; we never store your password.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
