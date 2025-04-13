
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EstateGiftingData } from '../EstateGiftingWizard';
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Save, Download, Share2 } from "lucide-react";
import TaxDisclaimerWithCheckbox from "@/components/tax/TaxDisclaimerWithCheckbox";

interface ResultsStepProps {
  data: EstateGiftingData;
  onSave: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const ResultsStep: React.FC<ResultsStepProps> = ({ data, onSave }) => {
  const CURRENT_YEAR = new Date().getFullYear();
  
  // Calculate net to heirs for each scenario
  const netToHeirsNoGifting = data.netWorth - data.noGiftingTax;
  const netToHeirsWithGifting = data.netWorth - data.giftingTax + data.heirsBenefit - data.taxSavings;
  
  // Data for pie charts
  const noGiftingData = [
    { name: "To Heirs", value: netToHeirsNoGifting },
    { name: "Estate Tax", value: data.noGiftingTax }
  ];
  
  const giftingData = [
    { name: "To Heirs", value: netToHeirsWithGifting },
    { name: "Estate Tax", value: data.giftingTax }
  ];
  
  const COLORS = ['#00C47C', '#FF4D4F'];
  
  // Estimated years of gifting
  const yearsOfGifting = data.yearOfPassing - CURRENT_YEAR;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">Results Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#353e52] bg-[#1A1F2C]">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-2">Scenario A: No Gifting</h4>
            <div className="h-[180px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={noGiftingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {noGiftingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Projected Estate Value:</span>
                <span className="text-white">{formatCurrency(data.netWorth)}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Estate Tax:</span>
                <span>{formatCurrency(data.noGiftingTax)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Net to Heirs:</span>
                <span className="text-white">{formatCurrency(netToHeirsNoGifting)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#353e52] bg-[#1A1F2C]">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-2">Scenario B: With Gifting</h4>
            <div className="h-[180px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={giftingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {giftingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">
                  {data.giftingStrategy === 'annual' 
                    ? `Annual Gifts (over ${yearsOfGifting} years):` 
                    : 'One-time Gift:'}
                </span>
                <span className="text-green-400">{formatCurrency(data.heirsBenefit - data.taxSavings)}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Estate Tax:</span>
                <span>{formatCurrency(data.giftingTax)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Net to Heirs:</span>
                <span className="text-white">{formatCurrency(netToHeirsWithGifting)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-[#242A38] to-[#1A1F2C] p-6 rounded-lg border border-green-800/30">
        <h4 className="text-white font-medium text-lg mb-4">Your Gifting Strategy Benefit</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-[#B0B0B0] mb-1">Tax Savings from Gifting:</p>
            <p className="text-green-400 text-2xl font-bold">{formatCurrency(data.taxSavings)}</p>
          </div>
          <div>
            <p className="text-[#B0B0B0] mb-1">Additional Amount to Heirs:</p>
            <p className="text-green-400 text-2xl font-bold">{formatCurrency(data.heirsBenefit)}</p>
          </div>
        </div>
        
        <div className="bg-[#1A1F2C] p-4 rounded-lg text-sm">
          <p className="text-white">
            By implementing your gifting strategy, your heirs could potentially receive an additional <strong className="text-green-400">{formatCurrency(data.heirsBenefit)}</strong> compared 
            to taking no action, based on your current assumptions and tax laws as of {CURRENT_YEAR}.
          </p>
          {data.aboveThreshold && (
            <p className="text-[#B0B0B0] mt-2">
              Since your estate may exceed the federal exemption threshold, this gifting strategy could significantly reduce your potential estate tax liability.
            </p>
          )}
          {!data.aboveThreshold && (
            <p className="text-[#B0B0B0] mt-2">
              Even though your estate is currently below the federal exemption threshold, this gifting strategy provides benefits due to removing future asset growth from your taxable estate and 
              potential protection against future reductions in the estate tax exemption.
            </p>
          )}
        </div>
      </div>
    
      <div className="flex flex-wrap gap-2 mt-8">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Scenario
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Share Results
        </Button>
      </div>
      
      <TaxDisclaimerWithCheckbox
        acknowledged={true}
        onAcknowledgeChange={() => {}}
        title="Important Information"
        content={
          <>
            <p>
              This analysis is based on current tax laws as of {CURRENT_YEAR} and the assumptions you provided. 
              Actual results may differ due to changes in tax laws, investment performance, or other factors.
            </p>
            <p className="mt-2">
              The federal estate tax exemption is scheduled to decrease after 2025 unless extended by Congress. 
              This may significantly impact your estate planning needs.
            </p>
            <p className="mt-2 text-yellow-400">
              We strongly recommend consulting with a qualified estate planning attorney and tax advisor to implement 
              and maintain your estate plan based on your specific circumstances.
            </p>
          </>
        }
        checkboxLabel="I understand these results are estimates and will consult with professional advisors"
      />
    </div>
  );
};

export default ResultsStep;
