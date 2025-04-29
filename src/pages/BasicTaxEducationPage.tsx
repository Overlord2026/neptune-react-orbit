
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilingStatusType } from '@/types/tax/filingTypes';
import TaxYearSelector from '@/components/tax-education/TaxYearSelector';
import TaxBracketsSection from '@/components/tax-education/TaxBracketsSection';
import DeductionsVsCreditsSection from '@/components/tax-education/DeductionsVsCreditsSection';
import CapitalGainsSection from '@/components/tax-education/CapitalGainsSection';

const BasicTaxEducationPage = () => {
  // State for the tax year and filing status
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedFilingStatus, setSelectedFilingStatus] = useState<FilingStatusType>("single");

  // Example tax bracket data based on selected year
  const getTaxBrackets = () => {
    // This would ideally come from the taxBracketData utility based on year
    // For now we'll use sample data
    if (selectedYear === 2023) {
      return [
        { range: "$0 - $11,000", rate: "10%" },
        { range: "$11,001 - $44,725", rate: "12%" },
        { range: "$44,726 - $95,375", rate: "22%" },
        { range: "$95,376 - $182,100", rate: "24%" }
      ];
    } else if (selectedYear === 2024) {
      return [
        { range: "$0 - $11,600", rate: "10%" },
        { range: "$11,601 - $47,150", rate: "12%" },
        { range: "$47,151 - $100,525", rate: "22%" },
        { range: "$100,526 - $191,950", rate: "24%" }
      ];
    } else if (selectedYear === 2025) {
      return [
        { range: "$0 - $12,050", rate: "10%" },
        { range: "$12,051 - $49,050", rate: "12%" },
        { range: "$49,051 - $104,525", rate: "22%" },
        { range: "$104,526 - $199,650", rate: "24%" }
      ];
    } else {
      return [
        { range: "$0 - $10,275", rate: "10%" },
        { range: "$10,276 - $41,775", rate: "12%" },
        { range: "$41,776 - $89,075", rate: "22%" },
        { range: "$89,076 - $170,050", rate: "24%" }
      ];
    }
  };

  // Example data for demonstration
  const taxConcepts = [
    {
      title: "Taxable Income",
      description: "The portion of your income that is subject to taxation after deductions and exemptions.",
      example: `If you earn $60,000 but have $${selectedYear >= 2023 ? "13,850" : "12,950"} in standard deductions, your taxable income is $${selectedYear >= 2023 ? "46,150" : "47,050"}.`
    },
    {
      title: "Tax Brackets",
      description: "Income ranges that are taxed at different rates. As income increases, it may fall into higher tax brackets.",
      example: `The first $${selectedYear >= 2023 ? "11,000" : "10,275"} might be taxed at 10%, the next $${selectedYear >= 2023 ? "33,725" : "31,500"} at 12%, and so on.`
    },
    {
      title: "Deductions",
      description: "Expenses that can be subtracted from gross income to reduce taxable income.",
      example: "Common deductions include student loan interest, IRA contributions, and itemized deductions like medical expenses."
    },
    {
      title: "Tax Credits",
      description: "Direct reductions in the amount of tax owed, often more valuable than deductions.",
      example: `The Child Tax Credit (${selectedYear >= 2023 ? "$2,000" : "$3,600"} per qualifying child in ${selectedYear}) or the Earned Income Tax Credit can significantly reduce your tax liability.`
    }
  ];

  // Example form values
  const income = 75000;

  return (
    <div className="container mx-auto p-4 sm:p-8 bg-[#0b1120] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Understanding Basic Tax Concepts</h1>
      
      {/* Year and Filing Status Selector */}
      <TaxYearSelector
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedFilingStatus={selectedFilingStatus}
        setSelectedFilingStatus={setSelectedFilingStatus}
      />

      {/* Tax Concepts Accordion */}
      <Accordion type="single" collapsible className="mb-8">
        {taxConcepts.map((concept, index) => (
          <AccordionItem value={`concept-${index}`} key={index} className="border-[#2d3748]">
            <AccordionTrigger className="text-white hover:text-[#4299e1] py-4 px-2">{concept.title}</AccordionTrigger>
            <AccordionContent className="text-[#e2e8f0] px-2 pb-4">
              <p className="mb-2">{concept.description}</p>
              <p className="font-semibold text-white">Example:</p>
              <p>{concept.example}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Tax Brackets Section */}
      <TaxBracketsSection 
        selectedYear={selectedYear}
        selectedFilingStatus={selectedFilingStatus}
      />
      
      {/* Deductions vs Credits Section */}
      <DeductionsVsCreditsSection />
      
      {/* Capital Gains Section */}
      <CapitalGainsSection 
        selectedYear={selectedYear}
        selectedFilingStatus={selectedFilingStatus === "married_joint" ? "married" : selectedFilingStatus as any}
      />

      {/* Tax Brackets Table */}
      <Card className="mb-8 bg-[#1a202c] border-[#2d3748]">
        <CardHeader className="border-b border-[#2d3748]">
          <CardTitle className="text-white">{selectedYear} Tax Brackets ({selectedFilingStatus.replace('_', ' ')})</CardTitle>
          <CardDescription className="text-[#a0aec0]">
            Current tax brackets for {selectedFilingStatus.replace('_', ' ')} filers in {selectedYear}.
            {selectedYear === 2025 && " (Projected)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-[#a0aec0]">Income Range</TableHead>
                <TableHead className="text-[#a0aec0]">Tax Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getTaxBrackets().map((bracket, index) => (
                <TableRow key={index} className="border-[#2d3748]">
                  <TableCell className="font-medium text-white">{bracket.range}</TableCell>
                  <TableCell className="text-white">{bracket.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interactive Form Elements */}
      <Card className="bg-[#1a202c] border-[#2d3748]">
        <CardHeader className="border-b border-[#2d3748]">
          <CardTitle className="text-white">Interactive Tax Calculator</CardTitle>
          <CardDescription className="text-[#a0aec0]">Experiment with different values to see how they affect your taxes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="income" className="text-[#e2e8f0]">Income</Label>
            <Input type="number" id="income" defaultValue={income} className="bg-[#0b1120] border-[#2d3748] text-white focus:border-[#4299e1]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-[#e2e8f0]">Filing Status</Label>
            <select 
              id="status" 
              className="bg-[#0b1120] border-[#2d3748] text-white p-2 rounded-md"
              value={selectedFilingStatus}
              onChange={(e) => setSelectedFilingStatus(e.target.value as FilingStatusType)}
            >
              <option value="single">Single</option>
              <option value="married_joint">Married Filing Jointly</option>
              <option value="head_of_household">Head of Household</option>
              <option value="married_separate">Married Filing Separately</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slider" className="text-[#e2e8f0]">Deductions ({selectedYear >= 2023 ? "$13,850" : "$12,950"} standard)</Label>
            <Slider defaultValue={[selectedYear >= 2023 ? 13850 : 12950]} max={30000} step={100} id="slider" className="[&_[role=slider]]:bg-[#4299e1]" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="itemized" className="border-[#2d3748] data-[state=checked]:bg-[#4299e1]" />
            <Label htmlFor="itemized" className="text-[#e2e8f0]">Use itemized deductions</Label>
          </div>
        </CardContent>
        <CardFooter className="border-t border-[#2d3748] pt-4">
          <Button className="bg-[#4299e1] hover:bg-[#3182ce] text-white flex items-center justify-center">
            <span>Calculate Taxes</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BasicTaxEducationPage;
