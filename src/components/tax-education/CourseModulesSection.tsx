
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import GlossaryTerm from '@/components/GlossaryTerm';

interface CourseModule {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
}

interface CourseModulesSectionProps {
  modules: CourseModule[];
}

const CourseModulesSection: React.FC<CourseModulesSectionProps> = ({ modules }) => {
  return (
    <>
      <h3 className="text-2xl font-bold mt-6">Course Modules</h3>
      <div className="grid gap-4">
        {modules.map((module) => (
          <Card key={module.id} className="border-l-4 border-l-[#9b87f5]">
            <CardHeader>
              <div className="flex items-center">
                <span className="bg-[#1A1F2C] text-[#9b87f5] mr-3 px-2 py-1 rounded-md font-mono">
                  Module {module.id}
                </span>
                <CardTitle className="text-xl">{module.title}</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground">Duration: {module.duration}</div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {module.id === 1 ? (
                  <>
                    Master the timing and execution of <GlossaryTerm termId="roth_conversion">Roth conversions</GlossaryTerm> over multiple tax years to minimize tax impact. 
                    Learn how to create a comprehensive conversion strategy that accounts for changing <GlossaryTerm termId="tax_bracket">tax brackets</GlossaryTerm>, 
                    retirement plans, and estate considerations.
                  </>
                ) : module.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {module.topics.map((topic, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 bg-[#1A1F2C] text-[#E5DEFF] text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CourseModulesSection;
