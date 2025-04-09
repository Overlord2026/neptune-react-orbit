
import React from 'react';
import { TaxReturnData } from '../SimpleReturnFilingFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, CreditCard } from 'lucide-react';

interface FilingStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const FilingStep: React.FC<FilingStepProps> = ({ data, onComplete }) => {
  const [bankInfo, setBankInfo] = React.useState(data.bankInfo);
  const [confirmAccuracy, setConfirmAccuracy] = React.useState(false);
  const [confirmPenalty, setConfirmPenalty] = React.useState(false);
  const [processingEfile, setProcessingEfile] = React.useState(false);
  
  const handleBankInfoChange = (field: keyof typeof bankInfo, value: string) => {
    setBankInfo({
      ...bankInfo,
      [field]: value
    });
  };
  
  const handleSubmit = () => {
    // Simulate processing time
    setProcessingEfile(true);
    
    setTimeout(() => {
      // Generate a random reference number
      const referenceNumber = `TAX${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;
      
      onComplete({
        bankInfo,
        referenceNumber
      });
      
      setProcessingEfile(false);
    }, 2000);
  };
  
  const isRefundExpected = data.calculatedRefund > 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">E-File Your Return</h3>
        <p className="text-muted-foreground">
          {isRefundExpected 
            ? "Set up direct deposit for your refund or choose another refund method." 
            : "Set up payment for your tax bill."}
        </p>
      </div>
      
      {/* Summary of refund/owed */}
      <Alert className={isRefundExpected ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
        <div className={`p-1 rounded-full ${isRefundExpected ? "bg-green-100" : "bg-amber-100"} mr-2`}>
          {isRefundExpected ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <CreditCard className="h-4 w-4 text-amber-600" />
          )}
        </div>
        <AlertTitle className={isRefundExpected ? "text-green-800" : "text-amber-800"}>
          {isRefundExpected 
            ? `Tax Refund: $${data.calculatedRefund.toLocaleString()}` 
            : `Tax Owed: $${data.calculatedOwed.toLocaleString()}`}
        </AlertTitle>
        <AlertDescription className="text-slate-600">
          {isRefundExpected 
            ? "Please provide your bank information for direct deposit." 
            : "Please select a payment method for the amount due."}
        </AlertDescription>
      </Alert>
      
      {isRefundExpected ? (
        /* Refund options for direct deposit */
        <div className="space-y-4">
          <h4 className="font-medium">Refund Method</h4>
          <RadioGroup defaultValue="direct-deposit">
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="direct-deposit" id="direct-deposit" />
              <div className="grid gap-1.5">
                <Label htmlFor="direct-deposit" className="font-medium">Direct Deposit</Label>
                <p className="text-sm text-muted-foreground">
                  Get your refund 2-3 weeks faster with direct deposit.
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <div className="border rounded-md p-4 space-y-4">
            <h5 className="font-medium">Bank Information</h5>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  value={bankInfo.routingNumber}
                  onChange={(e) => handleBankInfoChange('routingNumber', e.target.value)}
                  placeholder="9 digit number"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The 9-digit number on the bottom left of your check.
                </p>
              </div>
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  value={bankInfo.accountNumber}
                  onChange={(e) => handleBankInfoChange('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="account-type">Account Type</Label>
                <Select
                  value={bankInfo.accountType}
                  onValueChange={(value) => handleBankInfoChange('accountType', value)}
                >
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Payment options for amount due */
        <div className="space-y-4">
          <h4 className="font-medium">Payment Method</h4>
          <RadioGroup defaultValue="direct-debit">
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="direct-debit" id="direct-debit" />
              <div className="grid gap-1.5">
                <Label htmlFor="direct-debit" className="font-medium">Direct Debit</Label>
                <p className="text-sm text-muted-foreground">
                  Authorize electronic withdrawal from your bank account.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <div className="grid gap-1.5">
                <Label htmlFor="credit-card" className="font-medium">Credit/Debit Card</Label>
                <p className="text-sm text-muted-foreground">
                  Pay with credit or debit card (a processing fee will apply).
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="mail" id="mail" />
              <div className="grid gap-1.5">
                <Label htmlFor="mail" className="font-medium">Mail a Check</Label>
                <p className="text-sm text-muted-foreground">
                  We'll provide instructions for mailing your payment.
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <div className="border rounded-md p-4 space-y-4">
            <h5 className="font-medium">Bank Information</h5>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  value={bankInfo.routingNumber}
                  onChange={(e) => handleBankInfoChange('routingNumber', e.target.value)}
                  placeholder="9 digit number"
                />
              </div>
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  value={bankInfo.accountNumber}
                  onChange={(e) => handleBankInfoChange('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="account-type">Account Type</Label>
                <Select
                  value={bankInfo.accountType}
                  onValueChange={(value) => handleBankInfoChange('accountType', value)}
                >
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation checkboxes */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="confirm-accuracy" 
            checked={confirmAccuracy}
            onCheckedChange={(checked) => setConfirmAccuracy(checked === true)}
          />
          <div>
            <Label htmlFor="confirm-accuracy" className="font-medium">I confirm accuracy</Label>
            <p className="text-sm text-muted-foreground">
              Under penalties of perjury, I declare that I have examined this return and accompanying 
              schedules and statements, and to the best of my knowledge and belief, they are true, 
              correct, and complete.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="confirm-penalty" 
            checked={confirmPenalty}
            onCheckedChange={(checked) => setConfirmPenalty(checked === true)}
          />
          <div>
            <Label htmlFor="confirm-penalty" className="font-medium">I understand penalties</Label>
            <p className="text-sm text-muted-foreground">
              I understand that providing false or fraudulent information may subject me to penalties.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          onClick={handleSubmit}
          disabled={
            !confirmAccuracy || 
            !confirmPenalty || 
            !bankInfo.routingNumber || 
            !bankInfo.accountNumber ||
            !bankInfo.accountType ||
            processingEfile
          }
        >
          {processingEfile ? "Processing..." : "E-File My Return"}
        </Button>
      </div>
    </div>
  );
};

export default FilingStep;
