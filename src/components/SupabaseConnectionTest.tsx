
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Database, Key, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  icon: React.ReactNode;
}

const SupabaseConnectionTest: React.FC = () => {
  const [tests, setTests] = useState<ConnectionTest[]>([
    {
      name: 'Supabase Client',
      status: 'pending',
      message: 'Initializing...',
      icon: <Globe className="h-4 w-4" />
    },
    {
      name: 'Database Connection',
      status: 'pending',
      message: 'Testing database access...',
      icon: <Database className="h-4 w-4" />
    },
    {
      name: 'Authentication Status',
      status: 'pending',
      message: 'Checking auth status...',
      icon: <Key className="h-4 w-4" />
    }
  ]);

  const [projectInfo, setProjectInfo] = useState<{
    url: string;
    projectId: string;
  } | null>(null);

  useEffect(() => {
    runConnectionTests();
  }, []);

  const updateTest = (index: number, status: 'success' | 'error', message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ));
  };

  const runConnectionTests = async () => {
    // Extract project info from supabase client
    const url = "https://xcmqjkvyvuhoslbzmlgi.supabase.co";
    const projectId = url.split('//')[1]?.split('.')[0] || 'unknown';
    
    setProjectInfo({ url, projectId });

    // Test 1: Basic client initialization
    try {
      if (supabase && url) {
        updateTest(0, 'success', `Connected to ${projectId}`);
      } else {
        updateTest(0, 'error', 'Supabase client not initialized');
        return;
      }
    } catch (error) {
      updateTest(0, 'error', `Client error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return;
    }

    // Test 2: Database connection
    try {
      // Try a simple query that should work regardless of data
      const { error } = await supabase.from('profiles').select('count').limit(1).single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which means connection works
        updateTest(1, 'error', `Database error: ${error.message}`);
      } else {
        updateTest(1, 'success', 'Database accessible');
      }
    } catch (error) {
      updateTest(1, 'error', `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Authentication
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        updateTest(2, 'error', `Auth error: ${error.message}`);
      } else if (user) {
        updateTest(2, 'success', `Authenticated as ${user.email || 'user'}`);
      } else {
        updateTest(2, 'success', 'Not authenticated (normal for logged out users)');
      }
    } catch (error) {
      updateTest(2, 'error', `Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Testing...</Badge>;
    }
  };

  const allTestsComplete = tests.every(test => test.status !== 'pending');
  const allTestsPassed = tests.every(test => test.status === 'success');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Test
          {allTestsComplete && (
            allTestsPassed ? 
              <CheckCircle className="h-5 w-5 text-green-500" /> : 
              <XCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        {projectInfo && (
          <div className="text-sm text-muted-foreground">
            <p><strong>Project:</strong> {projectInfo.projectId}</p>
            <p><strong>URL:</strong> {projectInfo.url}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map((test, index) => (
          <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {test.icon}
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="text-sm text-muted-foreground">{test.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(test.status)}
              {getStatusBadge(test.status)}
            </div>
          </div>
        ))}
        
        {allTestsComplete && (
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">
              {allTestsPassed ? 
                '✅ All tests passed! Supabase connection is working correctly.' :
                '❌ Some tests failed. Check the error messages above.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;
