
import React from 'react';
import { Card } from '@/components/ui/card';
import { TaxReturnData } from '../../SimpleReturnFilingFlow';

interface PersonalInfoReviewProps {
  data: TaxReturnData;
}

const PersonalInfoReview: React.FC<PersonalInfoReviewProps> = ({ data }) => {
  return (
    <>
      <h4 className="font-medium">Personal Information</h4>
      <Card className="p-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex justify-between md:block">
            <dt className="font-medium text-muted-foreground">Full Name:</dt>
            <dd>{data.firstName} {data.lastName}</dd>
          </div>
          <div className="flex justify-between md:block">
            <dt className="font-medium text-muted-foreground">SSN:</dt>
            <dd>{data.ssn}</dd>
          </div>
          <div className="flex justify-between md:block">
            <dt className="font-medium text-muted-foreground">Filing Status:</dt>
            <dd>{data.filingStatus === 'single' ? 'Single' : 
                 data.filingStatus === 'married' ? 'Married Filing Jointly' : 
                 data.filingStatus === 'head_of_household' ? 'Head of Household' : ''}</dd>
          </div>
          <div className="flex justify-between md:block">
            <dt className="font-medium text-muted-foreground">Address:</dt>
            <dd>{data.address.street}, {data.address.city}, {data.address.state} {data.address.zipCode}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
};

export default PersonalInfoReview;
