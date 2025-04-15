
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Calculator, Lightbulb } from 'lucide-react';

const AdvancedTaxEducationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Advanced Tax Education</h1>
        <p className="text-lg text-muted-foreground">
          Deepen your understanding of complex tax strategies and planning techniques.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-blue-950/30 rounded-t-lg border-b border-primary/10">
            <Badge className="w-fit mb-2 bg-blue-800 hover:bg-blue-700">Advanced Strategy</Badge>
            <CardTitle className="neptune-gold">Multi-Year Roth Conversion Planning</CardTitle>
            <CardDescription>Learn to implement sophisticated multi-year Roth conversion strategies</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Optimizing conversions across different tax years</span>
              </li>
              <li className="flex items-start">
                <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Avoiding IRMAA surcharges and tax cliffs</span>
              </li>
              <li className="flex items-start">
                <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Modeling tax law changes in conversion strategy</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/tax-planning/roth-analysis" className="text-primary flex items-center hover:underline text-sm">
                View strategy guide <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-green-950/30 rounded-t-lg border-b border-primary/10">
            <Badge className="w-fit mb-2 bg-green-800 hover:bg-green-700">Tax Technique</Badge>
            <CardTitle className="neptune-gold">Asset Location Optimization</CardTitle>
            <CardDescription>Strategically place investments across taxable and tax-advantaged accounts</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Evaluating tax efficiency of different asset classes</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Implementing tax-sensitive asset location</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Quantifying the tax alpha of proper asset location</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/tax-planning/advanced-strategies" className="text-primary flex items-center hover:underline text-sm">
                Learn this technique <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-amber-950/30 rounded-t-lg border-b border-primary/10">
            <Badge className="w-fit mb-2 bg-amber-800 hover:bg-amber-700">Advanced Planning</Badge>
            <CardTitle className="neptune-gold">QSBS Exclusion Strategies</CardTitle>
            <CardDescription>Maximize the Qualified Small Business Stock exclusion benefit</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Understanding Section 1202 QSBS requirements</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Structuring investments to qualify for QSBS</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Gift and estate planning with QSBS</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/tax-planning/advanced-strategies" className="text-primary flex items-center hover:underline text-sm">
                Explore strategy <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-purple-950/30 rounded-t-lg border-b border-primary/10">
            <Badge className="w-fit mb-2 bg-purple-800 hover:bg-purple-700">Estate Planning</Badge>
            <CardTitle className="neptune-gold">Advanced Trust Strategies</CardTitle>
            <CardDescription>Leverage sophisticated trust structures for tax-efficient wealth transfer</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Intentionally Defective Grantor Trusts (IDGTs)</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Grantor Retained Annuity Trusts (GRATs)</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Dynasty Trusts and generation-skipping strategies</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/tax-planning/estate-gifting" className="text-primary flex items-center hover:underline text-sm">
                View trust strategies <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-indigo-950/30 rounded-t-lg border-b border-primary/10">
            <Badge className="w-fit mb-2 bg-indigo-800 hover:bg-indigo-700">Business Strategy</Badge>
            <CardTitle className="neptune-gold">Advanced Business Tax Planning</CardTitle>
            <CardDescription>Optimize tax structures and strategies for business owners</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Entity selection and tax implications</span>
              </li>
              <li className="flex items-start">
                <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Compensation planning and fringe benefits</span>
              </li>
              <li className="flex items-start">
                <Calculator className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Exit strategy and succession planning</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/tax-planning/small-business" className="text-primary flex items-center hover:underline text-sm">
                Explore business strategies <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-cyan-950/30 rounded-t-lg border-b border-primary/10">
            <Badge className="w-fit mb-2 bg-cyan-800 hover:bg-cyan-700">Tax Alpha</Badge>
            <CardTitle className="neptune-gold">Advanced Tax-Loss Harvesting</CardTitle>
            <CardDescription>Generate tax alpha through sophisticated tax-loss harvesting</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Optimizing wash sale rule compliance</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Tax-lot identification methods</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Cross-asset class harvesting strategies</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/tax-planning/guides/tax-loss-harvesting" className="text-primary flex items-center hover:underline text-sm">
                View harvesting techniques <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-md mt-6">
        <div className="flex items-start space-x-3">
          <BookOpen className="h-5 w-5 flex-shrink-0 mt-1 text-blue-400" />
          <div>
            <h4 className="text-sm font-medium text-blue-400">Advanced Education Resources</h4>
            <p className="text-sm text-blue-200/80 mt-1">
              These advanced topics are designed for users with a solid foundation in tax principles. 
              If you're new to tax planning, we recommend starting with our 
              <Link to="/tax-planning/basic-education" className="text-blue-300 hover:underline mx-1">Basic Tax Education</Link>
              resources before exploring these more complex concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTaxEducationPage;
