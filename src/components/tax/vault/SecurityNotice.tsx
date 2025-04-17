
import React from 'react';
import { Shield } from "lucide-react";

const SecurityNotice: React.FC = () => {
  return (
    <div className="bg-[#1f2937]/50 border border-[#3b82f6]/10 rounded-lg p-4 flex items-start gap-3 mx-4 sm:mx-6">
      <Shield className="h-5 w-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
      <div className="text-sm">
        <p className="font-medium mb-1 text-[#3b82f6]">Security & Privacy</p>
        <p className="text-gray-300">
          Your documents are stored securely. Phase 2 will add robust encryption and permission logs.
          We recommend not uploading sensitive personal information until enhanced security features are released.
        </p>
      </div>
    </div>
  );
};

export default SecurityNotice;
