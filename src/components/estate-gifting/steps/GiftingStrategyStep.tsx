
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EstateGiftingData } from '../EstateGiftingWizard';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InfoIcon } from "lucide-react";

interface GiftingStrategyStepProps {
  data: EstateGiftingData;
  onUpdateField: (field: keyof EstateGiftingData, value: any) => void;
}

const ANNUAL_GIFT_EXCLUSION = 17000;

const GiftingStrategyStep: React.FC<GiftingStrategyStepProps> = ({ data, onUpdateField }) => {
  const calculateAnnualGiftTotal = () => {
    return data.useAnnualGifts ? ANNUAL_GIFT_EXCLUSION * data.numberOfDonees : 0;
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Gifting Strategy</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="use-annual-gifts" 
            checked={data.useAnnualGifts}
            onCheckedChange={(checked) => onUpdateField('useAnnualGifts', checked === true)}
          />
          <div>
            <Label 
              htmlFor="use-annual-gifts" 
              className="text-white cursor-pointer flex items-center gap-2"
            >
              Use Annual Gift Exclusions
              <span className="text-[#FFD700] cursor-pointer hover:text-opacity-80" title="You can give up to $17,000 (2023) per recipient each year without using your lifetime exemption.">
                <InfoIcon className="w-4 h-4" />
              </span>
            </Label>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Currently $17,000 per recipient per year (2023) without affecting your lifetime exemption
            </p>
          </div>
        </div>

        {data.useAnnualGifts && (
          <div className="ml-6 space-y-4 border-l-2 border-[#353e52] pl-4">
            <div>
              <Label htmlFor="numberOfDonees" className="text-white">
                Number of Gift Recipients (Donees)
              </Label>
              <Input
                id="numberOfDonees"
                type="number"
                min={1}
                max={100}
                value={data.numberOfDonees}
                onChange={(e) => onUpdateField('numberOfDonees', Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-[#1A1F2C] border-[#353e52] text-white mt-1"
              />
              {data.numberOfDonees > 0 && (
                <p className="text-sm text-[#B0B0B0] mt-1">
                  Total annual gifts: ${(ANNUAL_GIFT_EXCLUSION * data.numberOfDonees).toLocaleString()} 
                  (${ANNUAL_GIFT_EXCLUSION.toLocaleString()} × {data.numberOfDonees} recipients)
                </p>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Label htmlFor="lifetimeGiftsUsed" className="text-white flex items-center gap-2">
            Lifetime Exemption Used So Far
            <span className="text-[#FFD700] cursor-pointer hover:text-opacity-80" title="The amount of your lifetime gift/estate tax exemption that you've already used for previous taxable gifts.">
              <InfoIcon className="w-4 h-4" />
            </span>
          </Label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="lifetimeGiftsUsed"
              type="text"
              placeholder="0.00"
              value={data.lifetimeGiftsUsed === 0 ? "" : (data.lifetimeGiftsUsed / 1000000).toString()}
              onChange={(e) => {
                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                onUpdateField('lifetimeGiftsUsed', isNaN(value) ? 0 : value * 1000000);
              }}
              className="pl-8 bg-[#1A1F2C] border-[#353e52] text-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">million</span>
          </div>
          <p className="text-sm text-[#B0B0B0] mt-1">
            Enter any portion of your lifetime exemption you've already used from past gifts
          </p>
        </div>

        <div className="pt-4">
          <Label className="text-white mb-2 block">Gifting Strategy Approach</Label>
          <RadioGroup 
            value={data.giftingStrategy} 
            onValueChange={(value) => onUpdateField('giftingStrategy', value as 'lump-sum' | 'annual')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annual" id="annual-gifting" />
              <Label htmlFor="annual-gifting" className="cursor-pointer">Annual gifts over time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lump-sum" id="lump-sum-gifting" />
              <Label htmlFor="lump-sum-gifting" className="cursor-pointer">One-time large gift</Label>
            </div>
          </RadioGroup>
        </div>

        {data.giftingStrategy === 'lump-sum' && (
          <div className="space-y-4 border-l-2 border-[#353e52] pl-4 ml-6">
            <Label htmlFor="lumpSumAmount" className="text-white">
              Lump Sum Gift Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="lumpSumAmount"
                type="text"
                placeholder="1,000,000"
                value={data.lumpSumAmount === 0 ? "" : (data.lumpSumAmount / 1000000).toString()}
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                  onUpdateField('lumpSumAmount', isNaN(value) ? 0 : value * 1000000);
                }}
                className="pl-8 bg-[#1A1F2C] border-[#353e52] text-white"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">million</span>
            </div>
            <p className="text-sm text-[#B0B0B0] mt-1">
              This will use a portion of your lifetime exemption if over the annual exclusion amount
            </p>
          </div>
        )}
      </div>
      
      {(data.useAnnualGifts || data.giftingStrategy === 'lump-sum' && data.lumpSumAmount > 0) && (
        <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#353e52] mt-6">
          <h4 className="text-white font-medium mb-2">Projected Gifting Summary</h4>
          {data.giftingStrategy === 'annual' && data.useAnnualGifts && (
            <p className="text-[#B0B0B0] text-sm">
              Annual Gifting: ${calculateAnnualGiftTotal().toLocaleString()} per year
              ({data.numberOfDonees} recipients × ${ANNUAL_GIFT_EXCLUSION.toLocaleString()})
            </p>
          )}
          {data.giftingStrategy === 'lump-sum' && data.lumpSumAmount > 0 && (
            <p className="text-[#B0B0B0] text-sm">
              Lump Sum Gift: ${data.lumpSumAmount.toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GiftingStrategyStep;
