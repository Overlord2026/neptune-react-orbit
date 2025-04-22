
import React, { useState } from "react";
import TaxSummaryBar from "./TaxSummaryBar";
import TaxYearSelector from "./TaxYearSelector";
import { Calendar } from "lucide-react";

// Dummy records for demonstration
const demoTaxRecords = [
  { year: 2022, income: 97000, tax: 13000 },
  { year: 2023, income: 105000, tax: 14200 },
  { year: 2024, income: 113500, tax: 15500 }
];

const TaxTracker: React.FC = () => {
  const yearList = demoTaxRecords.map(r => r.year).reverse();
  const [selectedYear, setSelectedYear] = useState<number>(yearList[0]);

  const current = demoTaxRecords.find(r => r.year === selectedYear);

  return (
    <section className="w-full max-w-lg mx-auto p-6 rounded-lg bg-[#23273a] shadow-lg border border-[#444857] my-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-[#FFD700]" />
        <h2 className="text-2xl font-bold tracking-tight text-white">Tax Tracker</h2>
      </div>
      <TaxYearSelector
        years={yearList}
        selected={selectedYear}
        onChange={setSelectedYear}
      />
      {current ? (
        <>
          <TaxSummaryBar totalTax={current.tax} income={current.income} />
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-base font-semibold text-white">${current.tax.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total Tax</div>
            </div>
            <div>
              <div className="text-base font-semibold text-white">${current.income.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Gross Income</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">No tax data for this year.</div>
      )}
    </section>
  );
};

export default TaxTracker;
