
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EstateGiftingData } from '../EstateGiftingWizard';
import { Slider } from "@/components/ui/slider";
import { InfoIcon, AlertTriangle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InheritanceScenarioStepProps {
  data: EstateGiftingData;
  onUpdateField: (field: keyof EstateGiftingData, value: any) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const MAX_PROJECTION_YEARS = 50;

const InheritanceScenarioStep: React.FC<InheritanceScenarioStepProps> = ({ data, onUpdateField }) => {
  const handleGrowthRateChange = (values: number[]) => {
    onUpdateField('growthRate', values[0] / 100);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Inheritance Scenario Planning</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="text-white mb-2 block">Life Cycle Stage</Label>
          <RadioGroup 
            value={data.lifeCycleStage || 'mid-career'} 
            onValueChange={(value) => {
              onUpdateField('lifeCycleStage', value);
              
              // Update the year of passing based on life cycle stage
              let yearsToAdd = 30;
              switch(value) {
                case 'young-adult':
                  yearsToAdd = 50;
                  break;
                case 'mid-career':
                  yearsToAdd = 30;
                  break;
                case 'pre-retirement':
                  yearsToAdd = 20;
                  break;
                case 'retirement':
                  yearsToAdd = 15;
                  break;
              }
              onUpdateField('yearOfPassing', CURRENT_YEAR + yearsToAdd);
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-start space-x-2 bg-[#1A1F2C] border border-[#353e52] p-3 rounded-md">
              <RadioGroupItem value="young-adult" id="young-adult" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="young-adult" className="text-white cursor-pointer font-medium">Young Adult (20-40)</Label>
                <p className="text-xs text-[#B0B0B0]">Long-term planning, typically 40-60 years</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 bg-[#1A1F2C] border border-[#353e52] p-3 rounded-md">
              <RadioGroupItem value="mid-career" id="mid-career" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="mid-career" className="text-white cursor-pointer font-medium">Mid-Career (40-55)</Label>
                <p className="text-xs text-[#B0B0B0]">Building wealth, typically 25-40 years</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 bg-[#1A1F2C] border border-[#353e52] p-3 rounded-md">
              <RadioGroupItem value="pre-retirement" id="pre-retirement" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="pre-retirement" className="text-white cursor-pointer font-medium">Pre-Retirement (55-65)</Label>
                <p className="text-xs text-[#B0B0B0]">Wealth preservation, typically 15-25 years</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 bg-[#1A1F2C] border border-[#353e52] p-3 rounded-md">
              <RadioGroupItem value="retirement" id="retirement" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="retirement" className="text-white cursor-pointer font-medium">Retirement (65+)</Label>
                <p className="text-xs text-[#B0B0B0]">Legacy planning, typically 10-20 years</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="yearOfPassing" className="text-white">
            Assumed Year of Passing (for planning purposes)
          </Label>
          <Input
            id="yearOfPassing"
            type="number"
            min={CURRENT_YEAR}
            max={CURRENT_YEAR + MAX_PROJECTION_YEARS}
            value={data.yearOfPassing}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                onUpdateField('yearOfPassing', Math.min(CURRENT_YEAR + MAX_PROJECTION_YEARS, Math.max(CURRENT_YEAR, value)));
              }
            }}
            className="bg-[#1A1F2C] border-[#353e52] text-white"
          />
          <p className="text-sm text-[#B0B0B0] mt-1">
            This is used to estimate future asset values and project estate tax exposure
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="growthRate" className="text-white flex items-center gap-2">
              Estimated Annual Asset Growth Rate
              <span className="text-[#FFD700] cursor-pointer hover:text-opacity-80" title="The assumed average annual rate of return on your investments and other assets.">
                <InfoIcon className="w-4 h-4" />
              </span>
            </Label>
            <span className="text-white">{(data.growthRate * 100).toFixed(1)}%</span>
          </div>
          
          <Slider
            defaultValue={[data.growthRate * 100]}
            max={15}
            min={0}
            step={0.5}
            value={[data.growthRate * 100]}
            onValueChange={handleGrowthRateChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-[#B0B0B0]">
            <span>0%</span>
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
          </div>
          <p className="text-sm text-[#B0B0B0] mt-3">
            This affects how much your assets will grow between now and the assumed year of passing
          </p>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="useTrustApproach" 
            checked={data.useTrustApproach}
            onCheckedChange={(checked) => onUpdateField('useTrustApproach', checked === true)}
          />
          <div>
            <Label 
              htmlFor="useTrustApproach" 
              className="text-white cursor-pointer"
            >
              I'm interested in trust-based approaches
            </Label>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Various trust structures may help optimize estate planning beyond direct gifting
            </p>
          </div>
        </div>
        
        {data.useTrustApproach && (
          <>
            <div className="ml-8 mt-2 space-y-4">
              <div>
                <Label htmlFor="trustType" className="text-white flex items-center gap-2">
                  Anticipated Trust Approach
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-[#FFD700] cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-slate-900 text-white border-slate-800">
                        <p>This is for estimation purposes only. Actual effectiveness varies by personal circumstances.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select 
                  value={data.trustType || "none"} 
                  onValueChange={(value) => {
                    onUpdateField('trustType', value);
                    
                    // Update the estate tax reduction factor based on trust type
                    let reductionFactor = 0;
                    switch(value) {
                      case "revocable":
                        reductionFactor = 0.05; // 5% reduction
                        break;
                      case "ilit":
                        reductionFactor = 0.15; // 15% reduction
                        break;
                      case "grat":
                        reductionFactor = 0.25; // 25% reduction
                        break;
                      case "slat":
                        reductionFactor = 0.20; // 20% reduction
                        break;
                      case "dynasty":
                        reductionFactor = 0.30; // 30% reduction
                        break;
                      default:
                        reductionFactor = 0;
                    }
                    onUpdateField('trustReductionFactor', reductionFactor);
                  }}
                >
                  <SelectTrigger className="w-full bg-[#1A1F2C] border-[#353e52] text-white">
                    <SelectValue placeholder="Select trust type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1F2C] border-[#353e52] text-white">
                    <SelectItem value="none">No specific trust selected</SelectItem>
                    <SelectItem value="revocable">Revocable Living Trust</SelectItem>
                    <SelectItem value="ilit">Irrevocable Life Insurance Trust (ILIT)</SelectItem>
                    <SelectItem value="grat">Grantor Retained Annuity Trust (GRAT)</SelectItem>
                    <SelectItem value="slat">Spousal Lifetime Access Trust (SLAT)</SelectItem>
                    <SelectItem value="dynasty">Dynasty Trust</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#B0B0B0] mt-1">
                  Select a trust type to see how it might affect your estate tax projection
                </p>
              </div>

              <Alert className="bg-blue-950/20 border-blue-800/30">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-300">
                  <p className="font-medium mb-1">Advanced Estate Planning Techniques</p>
                  <p className="text-sm">
                    GRATs, ILITs, dynasty trusts, and spousal lifetime access trusts may further reduce estate taxes. 
                    This tool provides high-level estimates only—consult an estate attorney for specifics.
                  </p>
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-amber-950/20 border-amber-800/30">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-300">
                  <p className="font-medium mb-1">Legal Disclaimer</p>
                  <p className="text-sm">
                    We do not practice law or provide individualized legal advice. This module's numbers are 
                    approximate for your reference only. Trust strategies require legal expertise.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
        
        {!data.useTrustApproach && (
          <Alert className="bg-blue-950/20 border-blue-800/30">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-300">
              Common trust structures include Revocable Living Trusts, Irrevocable Life Insurance Trusts (ILITs), 
              Grantor Retained Annuity Trusts (GRATs), and Charitable Remainder Trusts. Consult with an estate planning attorney 
              to determine which trust structure is appropriate for your situation.
            </AlertDescription>
          </Alert>
        )}
        
        <Alert className="bg-amber-950/20 border-amber-800/30">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-300">
            The federal estate tax exemption is scheduled to be reduced in 2026 when certain provisions of the 
            Tax Cuts and Jobs Act expire. This calculator factors in current law, but we recommend revisiting 
            your planning as tax laws change.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default InheritanceScenarioStep;
