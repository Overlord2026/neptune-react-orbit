
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import GlossaryTerm from '@/components/GlossaryTerm';
import DynamicContentText from '@/components/DynamicContentText';
import { 
  formatCurrency, 
  getBrackets
} from '@/utils/taxBracketData';

interface FilingStatusSectionProps {
  selectedYear: number;
  selectedFilingStatus: 'single' | 'married_joint' | 'head_of_household';
}

const FilingStatusSection: React.FC<FilingStatusSectionProps> = ({
  selectedYear,
  selectedFilingStatus
}) => {
  // Get example brackets for comparison
  const singleBrackets = getBrackets(selectedYear, "single", "ordinary");
  const marriedBrackets = getBrackets(selectedYear, "married_joint", "ordinary");
  const hohBrackets = getBrackets(selectedYear, "head_of_household", "ordinary");
  
  const contentOptions = {
    year: selectedYear,
    filingStatus: selectedFilingStatus,
    format: 'currency' as const
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#1A1F2C]">
        <CardTitle id="filing-status-brackets">Why Filing Status Matters for Your Brackets</CardTitle>
        {selectedYear === 2025 && (
          <p className="text-xs text-gray-400 mt-1">
            Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p>
            Your <GlossaryTerm termId="filing_status">filing status</GlossaryTerm> significantly impacts how much tax you pay by determining your tax brackets, standard deduction amount, and eligibility for certain credits and deductions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              <h4 className="font-semibold mb-2">Single</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Unmarried individuals</li>
                <li>Legally separated under state law</li>
                <li>Divorced as of December 31</li>
                <li>
                  Standard Deduction: <DynamicContentText 
                    options={{...contentOptions, filingStatus: 'single'}}
                  >
                    {`current_standard_deduction`}
                  </DynamicContentText>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              <h4 className="font-semibold mb-2">Married Filing Jointly</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Married couples combining income</li>
                <li>Widows/widowers in certain cases</li>
                <li>Generally most tax-advantageous</li>
                <li>
                  Standard Deduction: <DynamicContentText 
                    options={{...contentOptions, filingStatus: 'married'}}
                  >
                    {`current_standard_deduction`}
                  </DynamicContentText>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              <h4 className="font-semibold mb-2">Head of Household</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Unmarried with qualifying dependents</li>
                <li>Pays more than half of household costs</li>
                <li>Better rates than Single status</li>
                <li>
                  Standard Deduction: <DynamicContentText 
                    options={{...contentOptions, filingStatus: 'head_of_household'}}
                  >
                    {`current_standard_deduction`}
                  </DynamicContentText>
                </li>
              </ul>
            </div>
          </div>
          
          <h4 className="font-medium mt-6">Bracket Threshold Comparison ({selectedYear})</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Single</TableHead>
                  <TableHead>Married Filing Jointly</TableHead>
                  <TableHead>Head of Household</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {singleBrackets.map((bracket, index) => (
                  <TableRow key={index}>
                    <TableCell>{(bracket.rate * 100).toFixed(0)}%</TableCell>
                    <TableCell>
                      {formatCurrency(bracket.bracket_min)} - {bracket.bracket_max === Infinity ? "$∞" : formatCurrency(bracket.bracket_max)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(marriedBrackets[index].bracket_min)} - {marriedBrackets[index].bracket_max === Infinity ? "$∞" : formatCurrency(marriedBrackets[index].bracket_max)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(hohBrackets[index].bracket_min)} - {hohBrackets[index].bracket_max === Infinity ? "$∞" : formatCurrency(hohBrackets[index].bracket_max)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex mt-4">
            <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]" asChild>
              <Link to="/tax-planning/which-bracket" className="flex items-center">
                Find Your Tax Bracket
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filing-status-faq">
              <AccordionTrigger className="text-[#9b87f5]">
                Frequently Asked Questions
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium">What if I'm married but filing separately?</h5>
                    <p className="text-sm mt-1">
                      Married Filing Separately uses different brackets than Married Filing Jointly. This status is generally less tax-advantageous but may be beneficial in specific situations like when one spouse has significant medical expenses or income-based student loan payments.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium">Can I choose any filing status?</h5>
                    <p className="text-sm mt-1">
                      No, you must qualify for a filing status based on your actual marital and household situation as of December 31st of the tax year. However, if you qualify for multiple statuses (e.g., both Single and Head of Household), you can choose the more advantageous one.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium">Does my filing status affect my tax credits?</h5>
                    <p className="text-sm mt-1">
                      Yes, many credits have different income thresholds and phase-out amounts based on filing status, including the Child Tax Credit, Earned Income Credit, and education credits.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md mt-4">
            <p className="text-sm">
              <strong>For Advanced Users:</strong> Learn about advanced strategies for choosing or planning around filing status in our <Link to="/tax-planning/advanced-tax-education" className="text-indigo-600 dark:text-indigo-400 hover:underline">Advanced Tax Education</Link> course.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilingStatusSection;
