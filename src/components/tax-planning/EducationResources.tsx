
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BookText, Library, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EducationResourcesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EducationResources: React.FC<EducationResourcesProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="w-full mb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight neptune-gold">Tax Education & Resources</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <span className="sr-only">{isOpen ? "Close" : "Open"}</span>
            {isOpen ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M4 9.5L7.5 6L11 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M4 6L7.5 9.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="pt-2">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <p className="text-[#E5DEFF] mb-4">
              Explore guides, books, and courses to deepen your understanding of key tax concepts.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <Button className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white" asChild>
                <Link to="/tax-planning/basic-education">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Basic Tax Education
                </Link>
              </Button>
              <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#1A1F2C]/50" asChild>
                <Link to="/tax-planning/advanced-tax-education">
                  <BookText className="mr-2 h-4 w-4" />
                  Advanced Tax Education (Paid Course)
                </Link>
              </Button>
              <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#1A1F2C]/50" asChild>
                <Link to="/tax-planning/recommended-reading">
                  <Library className="mr-2 h-4 w-4" />
                  Recommended Reading & Guides
                </Link>
              </Button>
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#1A1F2C]/50" asChild>
                <Link to="/tax-planning/glossary">
                  <BookText className="mr-2 h-4 w-4" />
                  View Full Glossary
                </Link>
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#E5DEFF] mb-2">Recommended Reading</h3>
              <ul className="space-y-2 text-[#F1F0FB]">
                <li className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                  <Link to="/tax-planning/recommended-reading" className="hover:underline">Browse All Guides & Books</Link>
                </li>
                <li className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                  <Link to="/tax-planning/guides/understanding-tax-brackets" className="hover:underline">Guide 1: Understanding Tax Brackets</Link>
                </li>
                <li className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                  <Link to="/tax-planning/guides/retirement-tax-strategies" className="hover:underline">Guide 2: Retirement Tax Strategies</Link>
                </li>
                <li className="flex items-center">
                  <BookText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                  <a href="https://example.com/books/tax-optimization" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                    My Book on Tax Optimization
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4 text-[#9b87f5]" />
                  <a href="https://www.irs.gov/forms-instructions" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                    IRS Forms & Publications
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EducationResources;
