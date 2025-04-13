
import React from 'react';
import { 
  FileText, 
  FolderSearch, 
  Banknote, 
  LineChart, 
  HeartHandshake, 
  BarChart2, 
  Lock, 
  Lightbulb,
  FileCheck,
  AlertTriangle,
  Gift,
  HandCoins,
  BarChart
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import TaxTools from '@/components/tax-planning/TaxTools';

const TaxToolsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Tax Tools</h1>
        <p className="text-lg text-muted-foreground">
          Access powerful scenarios for Roth conversions, multi-year planning, tax trap checks, and more.
        </p>
      </div>
      
      <TaxTools />
    </div>
  );
};

export default TaxToolsPage;
