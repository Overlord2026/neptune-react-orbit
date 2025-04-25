
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const IntegrationHeader = () => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-white">Connect Your Accounting Software</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Info className="h-4 w-4" />
              <span className="sr-only">Data Policy</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Data Privacy Policy</h4>
              <p className="text-sm">
                We only import the financial data necessary for tax planning purposes. Your data is encrypted and never shared with third parties.
              </p>
              <p className="text-sm">
                You can disconnect any integration at any time, which will remove all imported data from our system.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-text-secondary text-sm">
        Connect your accounting software to automatically import financial data for more accurate tax projections.
      </p>
    </div>
  );
};

export default IntegrationHeader;
