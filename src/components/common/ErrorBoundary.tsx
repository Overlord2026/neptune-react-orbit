import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch and handle errors gracefully
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      errorInfo
    });
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, use default error UI
      return (
        <div className="p-6 mx-auto max-w-2xl">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          
          <div className="bg-[#1A202C] border border-red-300/20 rounded-lg p-4 mb-4">
            <p className="font-mono text-sm text-red-400 mb-2">
              {this.state.error?.toString()}
            </p>
            {this.state.errorInfo && (
              <details className="mt-2">
                <summary className="text-sm text-blue-400 cursor-pointer">
                  View technical details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-400 overflow-auto max-h-96 p-2 bg-[#121720] rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button onClick={this.resetErrorBoundary}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
