
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BellOff, Calendar, Filter, Search } from "lucide-react";
import TaxAlertsContainer from '@/components/tax/TaxAlertsContainer';
import { useTaxDataUpdate } from '@/hooks/useTaxDataUpdate';

const MOCK_USER_ID = "current-user";

const TaxUpdatesHistoryPage = () => {
  const { alerts } = useTaxDataUpdate(MOCK_USER_ID);
  const [filter, setFilter] = useState("all"); // "all", "major", "minor", "info"
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const availableYears = [...new Set(alerts.map(alert => alert.year))].sort((a, b) => b - a);
  
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filter === "all" || alert.severity === filter;
    const matchesYear = yearFilter === "all" || alert.year.toString() === yearFilter;
    const matchesSearch = searchQuery === "" || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesYear && matchesSearch;
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tax Updates History</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Tax Updates</CardTitle>
          <CardDescription>
            Stay informed about important tax code changes that may affect your financial planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Tax laws and regulations change regularly. This page shows all tax updates and alerts 
            from the system based on changes detected in our regular data feeds from official sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search updates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Severity</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Updates</SelectItem>
                  <SelectItem value="major">Major Only</SelectItem>
                  <SelectItem value="minor">Minor Only</SelectItem>
                  <SelectItem value="info">Info Only</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Year</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="alerts">Tax Alerts</TabsTrigger>
          <TabsTrigger value="changelog">Tax Code Changelog</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts">
          {filteredAlerts.length > 0 ? (
            <TaxAlertsContainer userId={MOCK_USER_ID} maxAlerts={100} showViewAllLink={false} />
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tax alerts found</h3>
                <p className="text-muted-foreground mb-6">
                  {filter !== "all" || yearFilter !== "all" || searchQuery !== "" ? 
                    "Try changing your filters or search terms." :
                    "There are no tax alerts to display at this time."}
                </p>
                {(filter !== "all" || yearFilter !== "all" || searchQuery !== "") && (
                  <Button variant="outline" onClick={() => {
                    setFilter("all");
                    setYearFilter("all");
                    setSearchQuery("");
                  }}>
                    Clear all filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="changelog">
          <Card>
            <CardHeader>
              <CardTitle>Tax Code Changelog</CardTitle>
              <CardDescription>
                A detailed record of all changes to tax rates, brackets, and regulations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[2023, 2022, 2021].map(year => (
                <div key={year} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <span>{year}</span>
                    <Badge variant="outline" className="ml-2">Tax Year</Badge>
                  </h3>
                  <div className="space-y-2">
                    <div className="pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium">Standard Deduction Adjustment</p>
                      <p className="text-sm text-muted-foreground">
                        Standard deduction increased by 7% for all filing statuses.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated on {new Date(`${year}-11-10`).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium">Tax Bracket Inflation Adjustment</p>
                      <p className="text-sm text-muted-foreground">
                        All tax brackets adjusted upward by approximately 3.1% for inflation.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated on {new Date(`${year}-10-18`).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium">Retirement Contribution Limits</p>
                      <p className="text-sm text-muted-foreground">
                        401(k) contribution limit increased to ${year === 2023 ? '22,500' : year === 2022 ? '20,500' : '19,500'}.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated on {new Date(`${year}-11-01`).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" asChild>
                <a href="https://www.irs.gov/newsroom" target="_blank" rel="noopener noreferrer">
                  View IRS Newsroom
                </a>
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Download Full Changelog
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxUpdatesHistoryPage;
