// BasicTaxEducationPage.tsx
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Understanding Basic Tax Concepts</h1>

      {/* Tax Concepts Accordion */}
      <Accordion type="single" collapsible className="mb-8">
        {taxConcepts.map((concept, index) => (
          <AccordionItem value={`concept-${index}`} key={index}>
            <AccordionTrigger>{concept.title}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">{concept.description}</p>
              <p className="font-semibold">Example:</p>
              <p>{concept.example}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Tax Brackets Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2023 Tax Brackets (Single Filers)</CardTitle>
          <CardDescription>Example tax brackets for single filers in 2023.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Income Range</TableHead>
                <TableHead>Tax Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxBrackets.map((bracket, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{bracket.range}</TableCell>
                  <TableCell>{bracket.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interactive Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Form Elements</CardTitle>
          <CardDescription>Experiment with different form elements.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="income">Income</Label>
            <Input type="number" id="income" defaultValue={income} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Filing Status</Label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder={status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="head_of_household">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea placeholder="Tell us a little bit about yourself." id="about" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="newsletter" />
            <Label htmlFor="newsletter">Subscribe to newsletter</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slider">Volume</Label>
            <Slider defaultValue={[50]} max={100} step={1} id="slider" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Calculate Taxes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BasicTaxEducationPage;
