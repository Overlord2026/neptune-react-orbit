import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { readingResources, getAllCategories, ReadingResource } from '@/data/recommendedReading';
import { ExternalLink, BookOpen, FileText, Star, ArrowLeft } from 'lucide-react';
import GlossaryTerm from '@/components/GlossaryTerm';
import DynamicContentText from '@/components/DynamicContentText';

const categoryTitles: Record<ReadingResource['category'], string> = {
  'retirement': 'Retirement Planning',
  'small-business': 'Small Business Tax Strategies',
  'wealth-building': 'Wealth Building & Tax Optimization',
  'estate-planning': 'Estate Planning Resources'
};

const ResourceCard = ({ resource }: { resource: ReadingResource }) => {
  const resourceTypeIcon = () => {
    switch (resource.type) {
      case 'book':
        return <BookOpen className="h-5 w-5 text-[#9b87f5]" />;
      case 'guide':
      case 'article':
      default:
        return <FileText className="h-5 w-5 text-[#9b87f5]" />;
    }
  };
  
  const accessLabel = () => {
    switch (resource.access) {
      case 'client-only':
        return <span className="text-xs px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded-full">Client Exclusive</span>;
      case 'purchase':
        return <span className="text-xs px-2 py-1 bg-[#9b87f5]/10 text-[#9b87f5] rounded-full">Purchase Required</span>;
      case 'public':
      default:
        return <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Free Resource</span>;
    }
  };

  const renderRating = () => {
    if (!resource.rating) return null;
    
    return (
      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(resource.rating) ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-400'}`} 
          />
        ))}
        <span className="ml-2 text-sm text-gray-400">{resource.rating.toFixed(1)}</span>
      </div>
    );
  };
  
  const renderTestimonials = () => {
    if (!resource.testimonials?.length) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-[#9b87f5]">What others say:</p>
        {resource.testimonials.map((testimonial, index) => (
          <p key={index} className="text-xs italic text-gray-400">"{testimonial}"</p>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col bg-[#1A1F2C] border border-[#8E9196] hover:border-[#9b87f5] transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {resourceTypeIcon()}
            {accessLabel()}
          </div>
          {renderRating()}
        </div>
        <CardTitle className="text-xl text-white">
          <DynamicContentText>
            {resource.title}
          </DynamicContentText>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 flex justify-center">
            <div 
              className="h-[150px] w-[100px] bg-[#222222] rounded-md flex items-center justify-center shadow-md"
              style={{
                backgroundImage: `url(${resource.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Fallback if image doesn't load */}
              <span className="text-[#555] opacity-50 text-xs text-center px-2">{resource.title}</span>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <DynamicContentText className="text-[#E5DEFF] mb-4">
              {resource.description}
            </DynamicContentText>
            {renderTestimonials()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-[#333]">
        <Button 
          variant={resource.linkType === 'external' ? 'outline' : 'default'} 
          className={resource.linkType === 'external' ? 'w-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white' : 'w-full bg-[#9b87f5] hover:bg-[#8a76e4] text-white'}
          asChild
        >
          {resource.linkType === 'external' ? (
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              Access Resource
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : (
            <Link to={resource.link}>
              Read Guide
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const RecommendedReadingPage = () => {
  const categories = getAllCategories();
  const currentYear = new Date().getFullYear();

  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col md:flex-row items-start justify-between space-y-2 md:space-y-0 mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">Recommended Reading & Guides</h2>
          <p className="text-muted-foreground">
            Explore our curated collection of tax and financial planning resources
          </p>
        </div>
        <div>
          <p className="text-xs text-right text-muted-foreground">
            Data last updated: <DynamicContentText>{`{{tax_data_last_update}}`}</DynamicContentText>
          </p>
        </div>
      </div>
      
      <div className="space-y-10">
        {categories.map(category => (
          <section key={category} className="space-y-4">
            <h3 className="text-2xl font-semibold text-[#E5DEFF]">{categoryTitles[category]}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {readingResources
                .filter(resource => resource.category === category)
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              }
            </div>
          </section>
        ))}
      </div>
      
      <Card className="mt-8 bg-[#1A1F2C] border border-[#8E9196]">
        <CardHeader>
          <CardTitle>Current Retirement Account Limits ({currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              <h4 className="font-semibold mb-2">Contribution Limits</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  Traditional/Roth IRA: <DynamicContentText options={{ year: currentYear }}>{`{{IRA_limit}}`}</DynamicContentText>
                </li>
                <li>
                  401(k)/403(b): <DynamicContentText options={{ year: currentYear }}>{`{{401k_limit}}`}</DynamicContentText>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              <h4 className="font-semibold mb-2">Standard Deduction</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  Single: <DynamicContentText options={{ year: currentYear, filingStatus: 'single' }}>{`{{current_standard_deduction}}`}</DynamicContentText>
                </li>
                <li>
                  Married: <DynamicContentText options={{ year: currentYear, filingStatus: 'married' }}>{`{{current_standard_deduction}}`}</DynamicContentText>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-12 border-t border-[#333] pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            Many of our guides reference <GlossaryTerm termId="tax_bracket">tax brackets</GlossaryTerm>, 
            <GlossaryTerm termId="roth_conversion">Roth conversion</GlossaryTerm> strategies, and 
            <GlossaryTerm termId="tax_loss_harvesting">tax-loss harvesting</GlossaryTerm> techniques.
          </p>
          <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5]" asChild>
            <Link to="/tax-planning" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Education & Resources
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedReadingPage;
