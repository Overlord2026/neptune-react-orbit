
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { formatCurrency } from '@/utils/taxBracketData';

interface CommunityPropertyInfoProps {
  showTitle?: boolean;
  communityPropertySplit: {
    primaryIncome: number;
    spouseIncome: number;
    primaryTax: number;
    spouseTax: number;
    originalPrimaryIncome?: number;
    originalSpouseIncome?: number;
    splitPrimaryIncome?: number;
    splitSpouseIncome?: number;
  };
}

const CommunityPropertyInfo: React.FC<CommunityPropertyInfoProps> = ({ 
  showTitle = true,
  communityPropertySplit 
}) => {
  const { 
    primaryIncome, 
    spouseIncome, 
    primaryTax, 
    spouseTax,
    originalPrimaryIncome = primaryIncome,
    originalSpouseIncome = spouseIncome,
    splitPrimaryIncome = primaryIncome,
    splitSpouseIncome = spouseIncome
  } = communityPropertySplit;

  const totalOriginalIncome = originalPrimaryIncome + originalSpouseIncome;
  const totalSplitIncome = splitPrimaryIncome + splitSpouseIncome;
  const totalTax = primaryTax + spouseTax;

  return (
    <Card className="border-yellow-500/30 bg-yellow-950/10">
      <CardHeader className={showTitle ? "pb-2" : "sr-only"}>
        <CardTitle className="text-lg flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-yellow-500" />
          Community Property Tax Split
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="bg-transparent border-yellow-500/30">
          <AlertTitle className="text-yellow-500">Community Property State Income Splitting</AlertTitle>
          <AlertDescription className="text-sm">
            <p className="mb-2">
              In community property states, income earned during marriage is generally considered equally owned by both spouses,
              which can affect how income is reported on separate tax returns.
            </p>
            
            <div className="space-y-2 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Original Income</p>
                  <p>Primary: {formatCurrency(originalPrimaryIncome)}</p>
                  <p>Spouse: {formatCurrency(originalSpouseIncome)}</p>
                  <p className="font-medium mt-1">Total: {formatCurrency(totalOriginalIncome)}</p>
                </div>
                <div>
                  <p className="font-medium">Split Income</p>
                  <p>Primary: {formatCurrency(splitPrimaryIncome)}</p>
                  <p>Spouse: {formatCurrency(splitSpouseIncome)}</p>
                  <p className="font-medium mt-1">Total: {formatCurrency(totalSplitIncome)}</p>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-yellow-500/20">
                <p className="font-medium">Total Tax: {formatCurrency(totalTax)}</p>
                <div className="flex justify-between">
                  <p>Primary: {formatCurrency(primaryTax)}</p>
                  <p>Spouse: {formatCurrency(spouseTax)}</p>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CommunityPropertyInfo;
