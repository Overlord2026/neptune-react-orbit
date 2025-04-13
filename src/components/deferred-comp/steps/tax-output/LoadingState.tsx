
import React from "react";
import { RefreshCw } from "lucide-react";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Calculating tax implications...</p>
    </div>
  );
};

export default LoadingState;
