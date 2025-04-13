
import React from 'react';
import { 
  Form
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CharitableScenario } from '../types/CharitableTypes';
import { Calendar } from 'lucide-react';
import { generateMultiYearPlan } from '../utils/multiYearPlanUtils';
import MultiYearPreview from '../components/MultiYearPreview';
import IntegrationToggle from '../components/IntegrationToggle';
import StepNavButtons from '../components/StepNavButtons';

interface MultiYearIntegrationStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  isIntegrated: z.boolean(),
});

export const MultiYearIntegrationStep: React.FC<MultiYearIntegrationStepProps> = ({ 
  scenario, 
  updateScenario, 
  onNext, 
  onBack 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isIntegrated: scenario.multiYearPlan.isIntegrated,
    },
  });

  const watchIsIntegrated = form.watch("isIntegrated");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Generate a 5-year projection based on selected strategies
    const years = generateMultiYearPlan(scenario, values.isIntegrated);
    
    updateScenario({
      multiYearPlan: {
        isIntegrated: values.isIntegrated,
        years,
      },
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-[#FFD700]" size={20} />
          <h3 className="font-medium text-lg">Multi-Year Integration</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          See how your charitable giving strategy plays out over multiple years, and how it integrates 
          with your broader tax planning strategy.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <IntegrationToggle form={form} />
            
            <MultiYearPreview
              scenario={scenario}
              isEnabled={watchIsIntegrated}
            />
            
            <StepNavButtons
              onBack={onBack}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MultiYearIntegrationStep;
