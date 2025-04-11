
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Bell, ExternalLink, Calendar } from "lucide-react";
import { TaxAlert } from '@/utils/dataFeed/types';
import { markAlertAsRead, dismissAlert } from '@/utils/taxUpdateUtils';
import { Link } from 'react-router-dom';

interface TaxAlertBannerProps {
  alert: TaxAlert;
  userId: string;
  onDismiss?: () => void;
}

const TaxAlertBanner: React.FC<TaxAlertBannerProps> = ({ 
  alert,
  userId,
  onDismiss
}) => {
  const handleMarkAsRead = () => {
    markAlertAsRead(userId, alert.id);
    if (onDismiss) onDismiss();
  };
  
  const handleDismiss = () => {
    dismissAlert(userId, alert.id);
    if (onDismiss) onDismiss();
  };
  
  return (
    <Alert className={`mb-4 border-l-4 ${
      alert.severity === 'major' ? 'border-l-red-500' : 
      alert.severity === 'minor' ? 'border-l-amber-500' : 
      'border-l-blue-500'
    }`}>
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          <Bell className={`h-5 w-5 ${
            alert.severity === 'major' ? 'text-red-500' : 
            alert.severity === 'minor' ? 'text-amber-500' : 
            'text-blue-500'
          }`} />
        </div>
        <div className="flex-1">
          <AlertTitle className="font-semibold">{alert.title}</AlertTitle>
          <AlertDescription className="mt-1">
            {alert.message}
          </AlertDescription>
          
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {alert.link_to_learn_more && (
              <Button size="sm" variant="outline" asChild>
                <Link to={alert.link_to_learn_more}>
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Learn More
                </Link>
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleMarkAsRead}>
              Mark as Read
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            <Calendar className="inline h-3 w-3 mr-1" />
            {new Date(alert.created_at).toLocaleDateString()} 
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default TaxAlertBanner;
