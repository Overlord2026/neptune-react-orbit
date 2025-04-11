
import React from 'react';

const DisclaimerSection: React.FC = () => {
  return (
    <div className="my-6 p-4 bg-[#1A1F2C] rounded-md border border-[#8E9196]">
      <h4 className="font-medium mb-2">Important Disclaimers</h4>
      <p className="text-sm text-muted-foreground">
        This course offers general education, not personalized tax advice. For specific guidance, 
        consult a licensed professional. Tax laws change frequently and strategies may not be 
        applicable to your specific situation.
      </p>
    </div>
  );
};

export default DisclaimerSection;
