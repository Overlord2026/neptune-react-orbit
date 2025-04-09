
import React from 'react';
import StatCard from '../components/StatCard';
import { Wallet, TrendingUp, TrendingDown, CreditCard, PiggyBank } from 'lucide-react';

const StatCardDemo = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">Your financial metrics at a glance.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Income" 
          value="$9,650" 
          change="+4.5%" 
          timeframe="vs last month" 
          budget="$12,500 monthly goal" 
          icon={<Wallet className="h-4 w-4 text-[#FFD700]" />} 
        />
        
        <StatCard 
          title="Expenses" 
          value="$7,230" 
          change="+2.3%" 
          timeframe="vs last month" 
          budget="$8,000 monthly budget" 
          icon={<CreditCard className="h-4 w-4 text-[#FFD700]" />} 
        />
        
        <StatCard 
          title="Savings" 
          value="$2,420" 
          change="+12.5%" 
          timeframe="vs last month" 
          budget="$3,000 monthly goal" 
          icon={<PiggyBank className="h-4 w-4 text-[#FFD700]" />} 
        />
        
        <StatCard 
          title="Investment Returns" 
          value="$1,856" 
          change="-2.1%" 
          timeframe="vs last quarter" 
          budget="7% annual target" 
          icon={<TrendingDown className="h-4 w-4 text-[#FFD700]" />} 
        />
      </div>
    </div>
  );
};

export default StatCardDemo;
