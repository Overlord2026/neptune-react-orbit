
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getTaxGlossaryCategories, getTaxGlossaryTerms, getTaxGlossaryTermsByCategory } from '@/data/taxGlossary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlossaryTerm from "@/components/GlossaryTerm";
import { SearchIcon } from 'lucide-react';

const TaxGlossaryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const allTerms = getTaxGlossaryTerms();
  const categories = getTaxGlossaryCategories();
  
  // Filter terms based on search query
  const filteredTerms = allTerms.filter(term => 
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Tax Planning Glossary</h1>
        <p className="text-muted-foreground">
          Navigate tax terminology with definitions and explanations of common tax planning concepts.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tax terms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {searchQuery ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Search Results ({filteredTerms.length})</h2>
          {filteredTerms.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredTerms.map((term) => (
                <Card key={term.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        <GlossaryTerm termId={term.id}>
                          {term.term}
                        </GlossaryTerm>
                      </CardTitle>
                      <Badge 
                        variant={term.category === 'basic' ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {term.category === 'basic' ? 'Basic' : 'Advanced'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{term.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No matching terms found. Try a different search term.</p>
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Terms</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {allTerms.map((term) => (
                <Card key={term.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        <GlossaryTerm termId={term.id}>
                          {term.term}
                        </GlossaryTerm>
                      </CardTitle>
                      <Badge 
                        variant={term.category === 'basic' ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {term.category === 'basic' ? 'Basic' : 'Advanced'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{term.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {getTaxGlossaryTermsByCategory(category).map((term) => (
                  <Card key={term.id} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{term.term}</CardTitle>
                        <Badge 
                          variant={term.category === 'basic' ? 'outline' : 'secondary'}
                          className="text-xs"
                        >
                          {term.category === 'basic' ? 'Basic' : 'Advanced'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{term.definition}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default TaxGlossaryPage;
