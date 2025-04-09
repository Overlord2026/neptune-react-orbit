
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const SystemDiagnosticsPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  // Initial dummy diagnostic data
  const [diagnostics, setDiagnostics] = useState([
    { name: "Database Connectivity", status: "OK", details: "5ms response time" },
    { name: "API Latency", status: "OK", details: "120ms average" },
    { name: "Cache Hit Rate", status: "OK", details: "98.7%" },
    { name: "Storage Capacity", status: "Warning", details: "82% used" },
    { name: "Memory Usage", status: "OK", details: "45% used" },
    { name: "CPU Load", status: "OK", details: "32% average" },
    { name: "Network Throughput", status: "OK", details: "4.5 GB/s" },
    { name: "Authentication Service", status: "OK", details: "99.99% uptime" }
  ]);

  const runDiagnostics = () => {
    setIsRefreshing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate new random values
      const newDiagnostics = diagnostics.map(diag => {
        const randomValue = Math.random();
        let status = "OK";
        let details = diag.details;
        
        if (diag.name === "API Latency") {
          const latency = Math.floor(Math.random() * 200) + 80;
          details = `${latency}ms average`;
        } else if (diag.name === "Cache Hit Rate") {
          const rate = (Math.random() * 5 + 94).toFixed(1);
          details = `${rate}%`;
        } else if (diag.name === "Storage Capacity") {
          const usage = Math.floor(Math.random() * 20) + 75;
          status = usage > 80 ? "Warning" : "OK";
          details = `${usage}% used`;
        } else if (diag.name === "Memory Usage") {
          const usage = Math.floor(Math.random() * 60) + 20;
          details = `${usage}% used`;
        } else if (diag.name === "CPU Load") {
          const load = Math.floor(Math.random() * 40) + 10;
          details = `${load}% average`;
        }
        
        return {
          ...diag,
          status,
          details
        };
      });
      
      setDiagnostics(newDiagnostics);
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString());
      toast.success("Diagnostics completed successfully");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">
            System Diagnostics
          </h1>
          <p className="text-muted-foreground">
            Detailed system performance analysis and troubleshooting
          </p>
        </div>
        <Link
          to="/admin"
          className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Administration
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl neptune-gold">System Diagnostics</CardTitle>
                <CardDescription>Last refreshed at {lastRefreshed}</CardDescription>
              </div>
              <Button 
                onClick={runDiagnostics} 
                disabled={isRefreshing}
                className="bg-[#FFD700] text-black hover:bg-[#E5C100] flex items-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Run Diagnostics
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="neptune-gold">Service</TableHead>
                  <TableHead className="neptune-gold">Status</TableHead>
                  <TableHead className="neptune-gold">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnostics.map((diag, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{diag.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          diag.status === "OK"
                            ? "bg-green-100/10 text-green-500"
                            : diag.status === "Warning"
                            ? "bg-amber-100/10 text-amber-500"
                            : "bg-red-100/10 text-red-500"
                        }`}
                      >
                        {diag.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{diag.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/admin">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Administration
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SystemDiagnosticsPage;
