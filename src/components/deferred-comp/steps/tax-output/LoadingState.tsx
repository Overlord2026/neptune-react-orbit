
import React from "react";
import { RefreshCw } from "lucide-react";
import { LoadingState } from "@/types/LoadingState";

interface LoadingStateProps {
  state?: LoadingState;
}

export const LoadingStateDisplay: React.FC<LoadingStateProps> = ({ state = LoadingState.Loading }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        {state === LoadingState.Loading && 'Calculating tax implications...'}
        {state === LoadingState.Error && 'An error occurred while calculating tax implications.'}
      </p>
    </div>
  );
};

export default LoadingStateDisplay;
