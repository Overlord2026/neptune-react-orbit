
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, UserPlus, ExternalLink } from "lucide-react";

const TaxFilingOptionsPage = () => {
  return (
    <div className="container content-padding section-margin">
      <div className="space-y-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight neptune-gold">Tax Filing Options</h2>
        
        <p className="text-lg text-[#E5DEFF] mb-8">
          Choose a simple do-it-yourself filing tool for basic returns, or connect with a professional for complex situations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* File a Simple Return Card */}
          <Card className="neptune-card interactive hover:border-[#9b87f5]">
            <CardHeader className="space-y-1">
              <div className="flex items-center mb-2">
                <div className="p-3 rounded-full bg-[#1A1F2C] border border-[#9b87f5]">
                  <FileText className="h-8 w-8 text-[#9b87f5]" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">File a Simple Return</CardTitle>
              <CardDescription className="text-[#C8C8C9]">
                Best for W-2 income, minimal deductions, and straightforward returns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[#E5DEFF] mb-4">
                <li className="flex items-start">
                  <span className="text-[#9b87f5] mr-2">•</span> 
                  <span>Guided step-by-step process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#9b87f5] mr-2">•</span> 
                  <span>Automated error checks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#9b87f5] mr-2">•</span> 
                  <span>Instant e-filing options</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#9b87f5] hover:bg-[#8a76e4] text-white" asChild>
                <Link to="/tax-planning/simple-filing">Start Simple Filing</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Need Professional Help Card */}
          <Card className="neptune-card interactive hover:border-[#FFD700]">
            <CardHeader className="space-y-1">
              <div className="flex items-center mb-2">
                <div className="p-3 rounded-full bg-[#1A1F2C] border border-[#FFD700]">
                  <UserPlus className="h-8 w-8 text-[#FFD700]" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Need Professional Help?</CardTitle>
              <CardDescription className="text-[#C8C8C9]">
                For complex returns, past IRS issues, or specialized forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[#E5DEFF] mb-4">
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span> 
                  <span>Access to certified tax professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span> 
                  <span>Personalized tax strategy consulting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span> 
                  <span>Audit support and representation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#222]">
                Find a Tax Professional
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="bg-[#1A1F2C] border border-[#333]">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#222] border border-[#444] flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-[#8E9196]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#FFD700] mb-2">Family Office Marketplace</h3>
                <p className="text-[#E5DEFF]">
                  Explore our curated professionals in the Family Office Marketplace (coming soon). 
                  Get matched with vetted accountants, tax attorneys, and financial advisors specialized in your specific needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-10">
          <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5]" asChild>
            <Link to="/tax-planning">
              Back to Tax Planning Hub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxFilingOptionsPage;
