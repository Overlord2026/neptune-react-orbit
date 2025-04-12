
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import SingleYearRothConversion from "@/components/tax/roth-conversion/SingleYearRothConversion";
import MultiYearRothConversion from "@/components/tax/roth-conversion/MultiYearRothConversion";
import TaxProjectionDisclaimer from "@/components/tax/TaxProjectionDisclaimer";

const RothConversionPage = () => {
  const [activeTab, setActiveTab] = useState("multi-year");
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Roth Conversion & Multi-Year Planner</h1>
          <p className="text-muted-foreground">
            Model single-year or long-term Roth conversion strategies to optimize your tax situation
          </p>
        </div>
        <Link to="/tax-planning/tax-tools" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Tools
        </Link>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white">Conversion Analysis Mode</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="multi-year" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger 
                value="single-year"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="h-4 w-4" />
                Single-Year Snapshot
              </TabsTrigger>
              <TabsTrigger 
                value="multi-year"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="h-4 w-4" />
                Multi-Year Advanced
              </TabsTrigger>
            </TabsList>
            <TabsContent value="single-year" className="mt-0">
              <SingleYearRothConversion />
            </TabsContent>
            <TabsContent value="multi-year" className="mt-0">
              <MultiYearRothConversion />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TaxProjectionDisclaimer taxYear={currentYear + 1} currentYear={currentYear} />
    </div>
  );
};

export default RothConversionPage;
