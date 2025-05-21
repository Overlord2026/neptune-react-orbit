
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1d] to-[#141c2e]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            Smart Tax Planning Made Simple
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Optimize your tax strategy with our advanced planning tools and real-time insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center justify-center"
              asChild
            >
              <Link to="/tax-planning" className="flex items-center justify-center">
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#3b82f6] text-[#3b82f6] flex items-center justify-center"
              asChild
            >
              <Link to="/tax-education/basics" className="flex items-center justify-center">
                <span>Learn More</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-[#141c2e]/80 backdrop-blur-sm p-6 rounded-xl border border-[#202a42] hover:border-[#3b82f6] transition-all duration-300 flex flex-col shadow-lg hover:shadow-xl hover:translate-y-[-2px]">
            <div className="bg-[#3b82f6]/10 p-3 rounded-lg w-fit mb-4 flex items-center justify-center">
              <Zap className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Real-Time Analysis</h3>
            <p className="text-gray-200 flex-grow">
              Get instant insights into your tax situation with our advanced analytics engine
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#141c2e]/80 backdrop-blur-sm p-6 rounded-xl border border-[#202a42] hover:border-[#3b82f6] transition-all duration-300 flex flex-col shadow-lg hover:shadow-xl hover:translate-y-[-2px]">
            <div className="bg-[#3b82f6]/10 p-3 rounded-lg w-fit mb-4 flex items-center justify-center">
              <Shield className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Secure Planning</h3>
            <p className="text-gray-200 flex-grow">
              Your data is protected with enterprise-grade security and encryption
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#141c2e]/80 backdrop-blur-sm p-6 rounded-xl border border-[#202a42] hover:border-[#3b82f6] transition-all duration-300 flex flex-col shadow-lg hover:shadow-xl hover:translate-y-[-2px]">
            <div className="bg-[#3b82f6]/10 p-3 rounded-lg w-fit mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Smart Documentation</h3>
            <p className="text-gray-200 flex-grow">
              Automatically organize and manage your tax documents in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
