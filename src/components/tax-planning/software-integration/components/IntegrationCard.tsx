
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2, RefreshCw } from 'lucide-react';
import { formatDate } from '../utils';
import { SoftwareOption } from '../types';

interface IntegrationCardProps {
  software: SoftwareOption;
  onConnect: (software: SoftwareOption) => void;
  onSync: (software: SoftwareOption) => void;
}

const IntegrationCard = ({ software, onConnect, onSync }: IntegrationCardProps) => {
  const isConnected = software.connectionStatus === 'connected';

  return (
    <Card className="overflow-hidden bg-card border-card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-white">{software.name}</CardTitle>
          {software.isPopular && (
            <Badge className="bg-accent-gold hover:bg-accent-hover text-background-primary">
              Popular
            </Badge>
          )}
        </div>
        <CardDescription className="text-text-secondary">{software.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        {isConnected && software.lastSynced && (
          <p className="text-sm text-muted-foreground">
            Last synced: {formatDate(software.lastSynced)}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2 bg-card-hover bg-opacity-30 py-3">
        <Button
          variant={isConnected ? "outline" : "default"}
          className="flex-1"
          onClick={() => onConnect(software)}
          disabled={!software.authUrl && !isConnected}
        >
          <Link2 className="mr-1 h-4 w-4" />
          {isConnected ? "Disconnect" : "Connect"}
        </Button>

        {isConnected && (
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={() => onSync(software)}
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Sync Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default IntegrationCard;
