
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const DisclaimerSection: React.FC = () => {
  return (
    <Card className="bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 mt-8">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="min-w-[24px] mt-0.5">
              <Shield className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-1">Disclaimer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All calculations presented here are estimates based on the information you've provided and current IRS guidelines. 
                Real outcomes may differ based on changing tax laws, state-specific rules, and individual circumstances. 
                For detailed advice tailored to your situation, consult a licensed tax professional or financial advisor.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="min-w-[24px] mt-0.5">
              <Shield className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-1">Data Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This application stores your scenario data securely, but we recommend you do not input sensitive information 
                beyond what is necessary for planning purposes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisclaimerSection;
