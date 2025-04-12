
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileCheck, FileSearch, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import ShareFeature from '@/components/tax-planning/ShareFeature';

const TaxFilingOptionsPage = () => {
  const [isInTrial, setIsInTrial] = useState(false);
  
  useEffect(() => {
    const trialStatus = localStorage.getItem('is_in_trial') === 'true';
    setIsInTrial(trialStatus);
  }, []);
  
  return (
    <div className="container content-padding section-margin">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight neptune-gold">Tax Filing Options</h2>
              <p className="text-muted-foreground mt-2">
                Choose the tax filing method that works best for your situation.
              </p>
            </div>
            <ShareFeature 
              title="Tax Filing Options" 
              description="Choose the best way to file your taxes with our helpful options."
              variant="button"
            />
          </div>
        </div>
        
        {!isInTrial && (
          <Card className="border-[#9b87f5]/30 bg-[#9b87f5]/5 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-10 w-10 text-[#9b87f5]" />
                  <div>
                    <h3 className="font-semibold text-[#9b87f5]">Unlock Premium Filing Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Start your 90-day free trial to access advanced tax filing options and tools.
                    </p>
                  </div>
                </div>
                <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]" asChild>
                  <Link to="/pricing">Start Free Trial</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <FileText className="h-10 w-10 text-[#FFD700] mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Simple Tax Return</h3>
                <p className="text-muted-foreground mb-4">
                  Ideal for W-2 income, standard deduction, and simple tax situations.
                </p>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link to="/file-my-taxes">Start Simple Return</Link>
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <FileSearch className="h-10 w-10 text-[#9b87f5] mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Tax Return</h3>
                <p className="text-muted-foreground mb-4">
                  For self-employment, investments, multiple income streams and itemized deductions.
                </p>
                {!isInTrial && (
                  <div className="mb-4 text-xs text-[#9b87f5] flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Available with free trial
                  </div>
                )}
              </div>
            </div>
            {isInTrial ? (
              <Button variant="default" asChild>
                <Link to="/file-my-taxes/advanced">Start Advanced Return</Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="cursor-not-allowed">
                Premium Feature
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-[#FFD700] text-[#FFD700]" asChild>
            <Link to="/tax-planning">Back to Tax Planning Hub</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxFilingOptionsPage;
