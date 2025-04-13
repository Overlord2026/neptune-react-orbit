
import React from 'react';
import { Form, FormControl } from "@/components/ui/form";
import { CharitableScenario, CharitableRemainderTrust } from '../../types/CharitableTypes';
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StepNavButtons from '../StepNavButtons';
import CrtUseTrustToggle from './CrtUseTrustToggle';
import CrtTypeSelect from './CrtTypeSelect';
import CrtFundingAmount from './CrtFundingAmount';
import CrtPayoutRate from './CrtPayoutRate';
import CrtTrustTerm from './CrtTrustTerm';
import CrtBeneficiaryAge from './CrtBeneficiaryAge';
import CrtSpouseBeneficiary from './CrtSpouseBeneficiary';
import CrtSpouseAge from './CrtSpouseAge';
import CrtBenefitsPreview from './CrtBenefitsPreview';

interface CrtFormProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  useCrt: z.boolean(),
  type: z.enum(["CRAT", "CRUT"]),
  fundingAmount: z.number().min(10000, "Minimum funding is $10,000"),
  payoutRate: z.number().min(5, "Minimum 5%").max(50, "Maximum 50%"),
  trustTerm: z.union([z.number().min(2, "Minimum 2 years"), z.literal("lifetime")]),
  beneficiaryAge: z.number().min(18, "Minimum age is 18").max(120, "Maximum age is 120"),
  spouseBeneficiary: z.boolean(),
  spouseAge: z.number().optional(),
});

const CrtForm: React.FC<CrtFormProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      useCrt: scenario.crt?.useCrt || false,
      type: scenario.crt?.type || "CRAT",
      fundingAmount: scenario.crt?.fundingAmount || 100000,
      payoutRate: scenario.crt?.payoutRate || 5,
      trustTerm: scenario.crt?.trustTerm || "lifetime",
      beneficiaryAge: scenario.crt?.beneficiaryAge || 65,
      spouseBeneficiary: scenario.crt?.spouseBeneficiary || false,
      spouseAge: scenario.crt?.spouseAge || 65
    },
  });

  const useCrt = form.watch("useCrt");
  const type = form.watch("type");
  const fundingAmount = form.watch("fundingAmount");
  const payoutRate = form.watch("payoutRate");
  const trustTerm = form.watch("trustTerm");
  const beneficiaryAge = form.watch("beneficiaryAge");
  const spouseBeneficiary = form.watch("spouseBeneficiary");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const crtData: CharitableRemainderTrust = {
      useCrt: values.useCrt,
      type: values.type,
      fundingAmount: values.fundingAmount,
      payoutRate: values.payoutRate,
      trustTerm: values.trustTerm,
      beneficiaryAge: values.beneficiaryAge,
      spouseBeneficiary: values.spouseBeneficiary,
      spouseAge: values.spouseAge
    };

    updateScenario({ crt: crtData });
    onNext();
  };

  return (
    <Card className="bg-primary/10 border border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Gift className="text-[#FFD700]" size={20} />
          <h3 className="font-medium text-lg">Charitable Remainder Trust (CRT)</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CrtUseTrustToggle control={form.control} />

            {useCrt && (
              <>
                <CrtTypeSelect control={form.control} />
                <CrtFundingAmount control={form.control} />
                <CrtPayoutRate control={form.control} />
                <CrtTrustTerm control={form.control} />
                <CrtBeneficiaryAge control={form.control} />
                <CrtSpouseBeneficiary control={form.control} />
                
                {spouseBeneficiary && (
                  <CrtSpouseAge control={form.control} />
                )}

                <CrtBenefitsPreview
                  type={type}
                  fundingAmount={fundingAmount}
                  payoutRate={payoutRate}
                  trustTerm={trustTerm}
                  beneficiaryAge={beneficiaryAge}
                  spouseBeneficiary={spouseBeneficiary}
                  spouseAge={form.watch("spouseAge")}
                />
              </>
            )}

            <StepNavButtons
              onBack={onBack}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CrtForm;
