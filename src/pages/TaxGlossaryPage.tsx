
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { taxGlossary } from '@/data/taxGlossary';
import GlossaryTerm from '@/components/GlossaryTerm';

interface Term {
  id: string;
  term: string;
  definition: string;
  category: string;
}

const TaxGlossaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = useMemo(() => {
    const cats = ['all'];
    taxGlossary.forEach(term => {
      if (!cats.includes(term.category)) {
        cats.push(term.category);
      }
    });
    return cats;
  }, []);

  const filteredTerms = useMemo(() => {
    return taxGlossary.filter(term => {
      // First apply category filter
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }
      
      // Then apply search filter
      if (searchQuery === '') {
        return true;
      }
      
      return (
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Tax Glossary
          </h2>
          <p className="text-muted-foreground">
            Comprehensive definitions of tax terms, concepts, and regulations.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start mt-6">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms or definitions"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded ${
                selectedCategory === category 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {selectedCategory === 'all' ? 'All Terms' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Terms`}
            <span className="text-sm text-muted-foreground ml-2">
              ({filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term) => (
                <GlossaryTerm 
                  key={term.id}
                  term={term.term}
                  definition={term.definition}
                  category={term.category}
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-2 text-center py-8">
                No terms found matching your search criteria.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxGlossaryPage;
