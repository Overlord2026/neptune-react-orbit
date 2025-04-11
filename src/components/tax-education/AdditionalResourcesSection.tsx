
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Resource {
  title: string;
  description: string;
}

interface AdditionalResourcesSectionProps {
  resources: Resource[];
}

const AdditionalResourcesSection: React.FC<AdditionalResourcesSectionProps> = ({ resources }) => {
  return (
    <>
      <h3 className="text-2xl font-bold mt-6">Additional Resources (Included)</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default AdditionalResourcesSection;
