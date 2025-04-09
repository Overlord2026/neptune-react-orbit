
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getFormattedUpdateDate } from '@/utils/dataFeedUtils';
import { refreshTaxData } from '@/utils/taxCalculator';

interface TaxDataUpdatePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  lastUpdateTime: string;
  sessionId?: string;
}

const TaxDataUpdatePrompt: React.FC<TaxDataUpdatePromptProps> = ({
  isOpen,
  onClose,
  onRefresh,
  lastUpdateTime,
  sessionId = "default"
}) => {
  const handleRefresh = () => {
    // Mark the tax data as current for this session
    refreshTaxData(sessionId);
    
    // Trigger the parent component's refresh handler
    onRefresh();
    
    // Close the dialog
    onClose();
  };
  
  const formattedDate = getFormattedUpdateDate(lastUpdateTime);
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Tax Code Update Available</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">
              A new tax code update is available (last updated on {formattedDate}).
            </p>
            <p className="mb-4">
              Would you like to recalculate your tax scenario using the latest data?
            </p>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800 text-sm">
              <strong>Note:</strong> Using the latest tax data ensures your calculations reflect the most current IRS rules and rates.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, Use Current Data</AlertDialogCancel>
          <AlertDialogAction onClick={handleRefresh} className="bg-primary">
            Yes, Use Latest Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TaxDataUpdatePrompt;
