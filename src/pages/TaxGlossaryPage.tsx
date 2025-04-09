
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, BookText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { getAllGlossaryTerms, GlossaryTerm } from '@/data/taxGlossary';

const TaxGlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const allTerms = useMemo(() => getAllGlossaryTerms(), []);
  
  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) return allTerms;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return allTerms.filter(
      term => term.term.toLowerCase().includes(lowercaseSearch) || 
              term.definition.toLowerCase().includes(lowercaseSearch)
    );
  }, [allTerms, searchTerm]);
  
  const basicTerms = useMemo(() => 
    filteredTerms.filter(term => term.category === 'basic'),
    [filteredTerms]
  );
  
  const advancedTerms = useMemo(() => 
    filteredTerms.filter(term => term.category === 'advanced'),
    [filteredTerms]
  );

  const renderTerm = (term: GlossaryTerm) => (
    <Card key={term.term} className="mb-4 overflow-hidden">
      <CardHeader className="bg-[#1A1F2C] py-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{term.term}</span>
          {term.category === 'advanced' && (
            <span className="text-xs bg-[#9b87f5] text-white px-2 py-1 rounded-full">
              Advanced
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p>{term.definition}</p>
        {term.category === 'advanced' && (
          <div className="mt-3 flex items-center text-sm text-[#9b87f5]">
            <BookText className="h-4 w-4 mr-1" />
            <Link to="/tax-planning/advanced-tax-education" className="hover:underline">
              Learn more in our Advanced Tax Education course
            </Link>
          </div>
        )}
        {term.link && term.category === 'basic' && (
          <Link 
            to={term.link} 
            className="mt-3 text-sm text-[#9b87f5] hover:underline flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Read more about {term.term}
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center">
            <BookText className="mr-2 h-6 w-6" />
            Tax Glossary
          </h2>
          <p className="text-muted-foreground">
            A comprehensive reference guide to tax terminology used throughout the application.
          </p>
        </div>
      </div>

      <div className="my-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search glossary terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Terms ({filteredTerms.length})</TabsTrigger>
          <TabsTrigger value="basic">Basic ({basicTerms.length})</TabsTrigger>
          <TabsTrigger value="advanced">Advanced ({advancedTerms.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-2">
          {filteredTerms.length > 0 ? (
            filteredTerms.map(renderTerm)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No terms match your search.</p>
          )}
        </TabsContent>
        
        <TabsContent value="basic" className="space-y-2">
          {basicTerms.length > 0 ? (
            basicTerms.map(renderTerm)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No basic terms match your search.</p>
          )}
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-2">
          {advancedTerms.length > 0 ? (
            advancedTerms.map(renderTerm)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No advanced terms match your search.</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-between">
        <Button asChild variant="outline">
          <Link to="/tax-planning">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tax Planning
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TaxGlossaryPage;
