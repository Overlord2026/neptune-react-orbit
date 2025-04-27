
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1729] to-[#1a1f2c]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Smart Tax Planning Made Simple
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Optimize your tax strategy with our advanced planning tools and real-time insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              asChild
            >
              <Link to="/tax-planning">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#3b82f6] text-[#3b82f6]"
              asChild
            >
              <Link to="/tax-education/basics">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#1e293b]/50 backdrop-blur-sm p-6 rounded-xl border border-[#334155] hover:border-[#3b82f6] transition-all duration-300">
            <div className="bg-[#3b82f6]/10 p-3 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Real-Time Analysis</h3>
            <p className="text-gray-300">
              Get instant insights into your tax situation with our advanced analytics engine
            </p>
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-sm p-6 rounded-xl border border-[#334155] hover:border-[#3b82f6] transition-all duration-300">
            <div className="bg-[#3b82f6]/10 p-3 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Secure Planning</h3>
            <p className="text-gray-300">
              Your data is protected with enterprise-grade security and encryption
            </p>
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-sm p-6 rounded-xl border border-[#334155] hover:border-[#3b82f6] transition-all duration-300">
            <div className="bg-[#3b82f6]/10 p-3 rounded-lg w-fit mb-4">
              <FileText className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Smart Documentation</h3>
            <p className="text-gray-300">
              Automatically organize and manage your tax documents in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
