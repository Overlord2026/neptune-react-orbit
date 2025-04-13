
import React from "react";
import { RefreshCw } from "lucide-react";
import { LoadingStateEnum } from "@/types/LoadingState";

interface LoadingStateProps {
  state?: LoadingStateEnum | 'idle' | 'loading' | 'success' | 'error';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ state = LoadingStateEnum.Loading }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        {(state === LoadingStateEnum.Loading || state === 'loading') && 'Calculating tax implications...'}
        {(state === LoadingStateEnum.Error || state === 'error') && 'An error occurred while calculating tax implications.'}
      </p>
    </div>
  );
};

export default LoadingState;
