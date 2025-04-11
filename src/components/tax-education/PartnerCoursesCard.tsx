
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import ExternalEnrollmentButton from "@/components/tax-education/ExternalEnrollmentButton";

interface PartnerCourse {
  id: string;
  partnerName: string;
  partnerUrl: string;
  description: string;
}

interface PartnerCoursesCardProps {
  partnerCourses: PartnerCourse[];
}

const PartnerCoursesCard: React.FC<PartnerCoursesCardProps> = ({ partnerCourses }) => {
  return (
    <Card className="border-l-4 border-l-[#FFD700] bg-[#1A1F2C]">
      <CardHeader>
        <CardTitle className="text-xl">Partner Course Offerings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          In addition to our in-house course, we've partnered with industry-leading tax education 
          providers to offer specialized training that complements our curriculum.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {partnerCourses.map(course => (
            <Card key={course.id} className="bg-[#14171F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-lg">{course.partnerName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                <ExternalEnrollmentButton
                  partnerName={course.partnerName}
                  partnerUrl={course.partnerUrl}
                  className="w-full mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerCoursesCard;
