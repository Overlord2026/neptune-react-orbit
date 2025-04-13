
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import ShareFeature from '@/components/tax-planning/ShareFeature';

const CharitablePlanningPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFD700]">Charitable Contribution Planning</h1>
          <p className="text-muted-foreground">Optimize your tax savings while maximizing your charitable impact.</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareFeature 
            title="Charitable Contribution Planning" 
            description="Evaluate tax-efficient giving strategies to maximize your philanthropic impact."
            variant="button"
          />
          <Link to="/tax-planning/tax-tools" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Tools
          </Link>
        </div>
      </div>

      <Card className="bg-card border-primary/20">
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Welcome to the Charitable Contribution Planning tool. This wizard will help you evaluate how 
            donor-advised funds, QCDs, and other giving strategies can reduce your taxable income and 
            enhance your philanthropic impact.
          </p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#FFD700] mb-4">Available Charitable Planning Strategies</h2>
            
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-[#242A38] flex items-center justify-center text-[#FFD700]">1</div>
                <div>
                  <h3 className="text-lg font-medium text-white">Standard vs. Itemized Deduction Analysis</h3>
                  <p className="text-sm text-[#B0B0B0]">Compare taking the standard deduction versus itemizing deductions with charitable contributions.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-[#242A38] flex items-center justify-center text-[#FFD700]">2</div>
                <div>
                  <h3 className="text-lg font-medium text-white">Multi-Year Bunching Strategy</h3>
                  <p className="text-sm text-[#B0B0B0]">Bundle multiple years of charitable giving into a single tax year to maximize itemized deductions.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-[#242A38] flex items-center justify-center text-[#FFD700]">3</div>
                <div>
                  <h3 className="text-lg font-medium text-white">Qualified Charitable Distributions (QCDs)</h3>
                  <p className="text-sm text-[#B0B0B0]">Analyze the benefits of making direct charitable contributions from your IRA if you're over age 70½.</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-[#242A38] flex items-center justify-center text-[#FFD700]">4</div>
                <div>
                  <h3 className="text-lg font-medium text-white">Donor-Advised Fund Strategy</h3>
                  <p className="text-sm text-[#B0B0B0]">Evaluate the tax advantages of contributing to a donor-advised fund for more strategic giving over time.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <button className="bg-[#007BFF] hover:bg-[#0069d9] text-white px-6 py-3 rounded-md font-medium transition-colors">
              Begin Charitable Planning Analysis
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CharitablePlanningPage;
