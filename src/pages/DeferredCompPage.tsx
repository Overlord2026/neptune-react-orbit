
import React from "react";
import { EquityCompWizard } from "@/components/deferred-comp/EquityCompWizard";
import { Card } from "@/components/ui/card";

const DeferredCompPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Deferred Comp & Stock Option Analysis
        </h1>
        <p className="text-lg text-muted-foreground">
          Plan how exercising stock options or deferring bonuses affects your taxable income and optimize your tax strategy.
        </p>
      </div>

      <Card className="border-[#2A2F3C] bg-[#1A1F2C] p-6">
        <EquityCompWizard />
      </Card>
    </div>
  );
};

export default DeferredCompPage;
