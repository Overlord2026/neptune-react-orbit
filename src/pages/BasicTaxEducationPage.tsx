
import React from 'react';
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
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const BasicTaxEducationPage = () => {
  // Example data for demonstration
  const taxConcepts = [
    {
      title: "Taxable Income",
      description: "The portion of your income that is subject to taxation after deductions and exemptions.",
      example: "If you earn $60,000 but have $10,000 in deductions, your taxable income is $50,000."
    },
    {
      title: "Tax Brackets",
      description: "Income ranges that are taxed at different rates. As income increases, it may fall into higher tax brackets.",
      example: "The first $10,000 might be taxed at 10%, the next $30,000 at 12%, and so on."
    },
    {
      title: "Deductions",
      description: "Expenses that can be subtracted from gross income to reduce taxable income.",
      example: "Common deductions include student loan interest, IRA contributions, and itemized deductions like medical expenses."
    },
    {
      title: "Tax Credits",
      description: "Direct reductions in the amount of tax owed, often more valuable than deductions.",
      example: "The Child Tax Credit or the Earned Income Tax Credit can significantly reduce your tax liability."
    }
  ];

  // Example tax bracket data
  const taxBrackets = [
    { range: "$0 - $10,275", rate: "10%" },
    { range: "$10,276 - $41,775", rate: "12%" },
    { range: "$41,776 - $89,075", rate: "22%" },
    { range: "$89,076 - $170,050", rate: "24%" }
  ];

  // Example form elements
  const status: "single" | "head_of_household" | "married" = "married"; // Fixed: Using a valid type
  const income = 75000;

  return (
    <div className="container mx-auto p-8 bg-[#1e293b] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Understanding Basic Tax Concepts</h1>

      {/* Tax Concepts Accordion */}
      <Accordion type="single" collapsible className="mb-8">
        {taxConcepts.map((concept, index) => (
          <AccordionItem value={`concept-${index}`} key={index} className="border-[#334155]">
            <AccordionTrigger className="text-white hover:text-[#3b82f6] py-4 px-2">{concept.title}</AccordionTrigger>
            <AccordionContent className="text-gray-300 px-2 pb-4">
              <p className="mb-2">{concept.description}</p>
              <p className="font-semibold text-white">Example:</p>
              <p>{concept.example}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Tax Brackets Table */}
      <Card className="mb-8 bg-[#273549] border-[#334155]">
        <CardHeader className="border-b border-[#334155]">
          <CardTitle className="text-white">2023 Tax Brackets (Single Filers)</CardTitle>
          <CardDescription className="text-gray-300">Example tax brackets for single filers in 2023.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-gray-300">Income Range</TableHead>
                <TableHead className="text-gray-300">Tax Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxBrackets.map((bracket, index) => (
                <TableRow key={index} className="border-[#334155]">
                  <TableCell className="font-medium text-white">{bracket.range}</TableCell>
                  <TableCell className="text-white">{bracket.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interactive Form Elements */}
      <Card className="bg-[#273549] border-[#334155]">
        <CardHeader className="border-b border-[#334155]">
          <CardTitle className="text-white">Interactive Form Elements</CardTitle>
          <CardDescription className="text-gray-300">Experiment with different form elements.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="income" className="text-gray-300">Income</Label>
            <Input type="number" id="income" defaultValue={income} className="bg-[#1e293b] border-[#334155] text-white" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-gray-300">Filing Status</Label>
            <Select>
              <SelectTrigger id="status" className="bg-[#1e293b] border-[#334155] text-white">
                <SelectValue placeholder={status} />
              </SelectTrigger>
              <SelectContent className="bg-[#273549] border-[#334155] text-white">
                <SelectItem value="single" className="text-white hover:bg-[#334155]">Single</SelectItem>
                <SelectItem value="married" className="text-white hover:bg-[#334155]">Married</SelectItem>
                <SelectItem value="head_of_household" className="text-white hover:bg-[#334155]">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="about" className="text-gray-300">About</Label>
            <Textarea placeholder="Tell us a little bit about yourself." id="about" className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" className="border-[#334155] data-[state=checked]:bg-[#3b82f6]" />
            <Label htmlFor="terms" className="text-gray-300">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="newsletter" className="bg-[#1e293b] data-[state=checked]:bg-[#3b82f6]" />
            <Label htmlFor="newsletter" className="text-gray-300">Subscribe to newsletter</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slider" className="text-gray-300">Volume</Label>
            <Slider defaultValue={[50]} max={100} step={1} id="slider" className="[&_[role=slider]]:bg-[#3b82f6]" />
          </div>
        </CardContent>
        <CardFooter className="border-t border-[#334155] pt-4">
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center justify-center">
            <span>Calculate Taxes</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BasicTaxEducationPage;
