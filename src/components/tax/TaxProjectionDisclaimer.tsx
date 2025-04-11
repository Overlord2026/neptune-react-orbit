
import React from 'react';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { CalendarClock } from 'lucide-react';

interface TaxProjectionDisclaimerProps {
  taxYear: number;
  currentYear?: number; // Optional, defaults to current year
  className?: string;
}

const TaxProjectionDisclaimer: React.FC<TaxProjectionDisclaimerProps> = ({ 
  taxYear,
  currentYear = new Date().getFullYear(),
  className = ''
}) => {
  // Only show for future years
  if (taxYear <= currentYear) {
    return null;
  }
  
  return (
    <Alert 
      variant="default" 
      className={`bg-blue-50 dark:bg-blue-950/30 border-blue-200 ${className}`}
    >
      <CalendarClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-300">
        Future Year Projection
      </AlertTitle>
      <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
        {taxYear > currentYear + 1 ? (
          <>
            <p>
              You are viewing tax information for {taxYear}, which is {taxYear - currentYear} years in the future. 
              These calculations use projected tax data that may change before {taxYear}.
            </p>
            <p className="mt-2">
              Tax laws frequently change. Be sure to check for updates closer to {taxYear} for the most accurate information.
            </p>
          </>
        ) : (
          <p>
            You are viewing tax projections for {taxYear}. While these are based on currently available information, 
            tax laws and amounts may be adjusted before {taxYear}. 
            Check back for updates.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default TaxProjectionDisclaimer;
