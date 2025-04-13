
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface YearSelectorProps {
  activeYear: "current" | "next";
  setActiveYear: (year: "current" | "next") => void;
  currentYear: number;
  showTabs: boolean;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  activeYear,
  setActiveYear,
  currentYear,
  showTabs
}) => {
  if (!showTabs) return null;

  return (
    <Tabs defaultValue="current" className="w-full" onValueChange={(val) => setActiveYear(val as "current" | "next")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="current">
          {currentYear} Tax Impact
        </TabsTrigger>
        <TabsTrigger value="next">
          {currentYear + 1} Tax Impact
        </TabsTrigger>
      </TabsList>
      <TabsContent value="current" className="pt-4"></TabsContent>
      <TabsContent value="next" className="pt-4"></TabsContent>
    </Tabs>
  );
};
