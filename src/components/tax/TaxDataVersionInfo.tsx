
import React from 'react';
import { 
  AlertCircle,
  Calendar,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TaxResult } from '@/utils/taxCalculator';
import { Link } from 'react-router-dom';

interface TaxDataVersionInfoProps {
  taxResult: TaxResult;
  showWarnings?: boolean;
  isCompact?: boolean;
}

const TaxDataVersionInfo: React.FC<TaxDataVersionInfoProps> = ({ 
  taxResult,
  showWarnings = true,
  isCompact = false
}) => {
  // Don't render anything if we don't have version info
  if (!taxResult.tax_data_updated_at) {
    return null;
  }
  
  // Format the data update date
  const updatedDate = new Date(taxResult.tax_data_updated_at);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(updatedDate);
  
  if (isCompact) {
    return (
      <div className="text-xs text-muted-foreground flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  Tax data: {formattedDate}
                  {taxResult.tax_data_version && ` (v${taxResult.tax_data_version})`}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium">Tax Data Information</p>
                <p className="text-xs mt-1">
                  These calculations use tax data that was last updated on {formattedDate}.
                  {taxResult.tax_data_version && <> Version: {taxResult.tax_data_version}</>}
                </p>
                {taxResult.tax_data_warning && (
                  <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
                    {taxResult.tax_data_warning}
                  </p>
                )}
                <p className="text-xs mt-1">
                  <Link to="/tax-updates-history" className="underline">
                    View update history
                  </Link>
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {showWarnings && taxResult.tax_data_warning && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-3 w-3 ml-2 text-amber-600 dark:text-amber-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{taxResult.tax_data_warning}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            Tax data last updated: <span className="font-medium">{formattedDate}</span>
          </span>
        </div>
        
        {taxResult.tax_data_version && (
          <Badge variant="outline" className="text-xs">
            Version {taxResult.tax_data_version}
          </Badge>
        )}
      </div>
      
      {showWarnings && taxResult.tax_data_warning && (
        <Alert variant="warning" className="py-2 px-3 bg-amber-50 dark:bg-amber-950/30 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
            {taxResult.tax_data_warning}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-xs text-muted-foreground flex items-center justify-end">
        <Info className="h-3 w-3 mr-1" />
        <Link to="/tax-updates-history" className="hover:underline">
          View tax data history
        </Link>
      </div>
    </div>
  );
};

export default TaxDataVersionInfo;
