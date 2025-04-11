
import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const My404Fallback = () => {
  const error = useRouteError();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <AlertTriangle className="h-16 w-16 text-[#FFD700] mb-4" />
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      {error && (
        <div className="text-sm text-muted-foreground mb-6 p-4 bg-muted rounded-md max-w-md overflow-auto">
          <pre>{(error as any).message || JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Go to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/tax-planning">Tax Planning</Link>
        </Button>
      </div>
    </div>
  );
};

export default My404Fallback;
