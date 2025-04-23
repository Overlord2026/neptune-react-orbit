
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const IntegrationHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <h2 className="text-2xl font-semibold text-white mb-2 md:mb-0">Accounting Software Integration</h2>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-[#00C47C]" />
            Data Policy
            <ExternalLink className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-[#1A1F2C] border border-[#242A38] text-[#E5E5E5]">
          <div className="space-y-2">
            <h4 className="font-medium">How We Handle Your Data</h4>
            <p className="text-xs text-[#B0B0B0]">
              We use industry-standard encryption and OAuth protocols to ensure your financial data remains secure.
              Your accounting data is only used for tax projections and planning purposes.
            </p>
            <p className="text-xs text-[#B0B0B0]">
              We never store your accounting software passwords. All connections are made using secure OAuth tokens that you can revoke at any time.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default IntegrationHeader;
