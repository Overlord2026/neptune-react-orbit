
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// -------------------------------
// Tax Rate Constants
// -------------------------------
const TAX_RATES = {
  single: [
    { threshold: 0, rate: 0.1 },
    { threshold: 11000, rate: 0.12 },
    { threshold: 44725, rate: 0.22 },
    { threshold: 95375, rate: 0.24 },
    { threshold: 182100, rate: 0.32 },
    { threshold: 231250, rate: 0.35 },
    { threshold: 578125, rate: 0.37 },
  ],
  married: [
    { threshold: 0, rate: 0.1 },
    { threshold: 22000, rate: 0.12 },
    { threshold: 89450, rate: 0.22 },
    { threshold: 190750, rate: 0.24 },
    { threshold: 364200, rate: 0.32 },
    { threshold: 462500, rate: 0.35 },
    { threshold: 693750, rate: 0.37 },
  ],
};

// -------------------------------
// State Initialization & Hooks
// -------------------------------
const defaultInputs = {
  iraBalance: 100000,
  conversionAmount: 25000,
  filingStatus: "single",
  currentAge: 58,
  retirementAge: 65,
  expectedReturn: 0.06,
  years: 20,
  income: 65000,
};

const RothConversionCalculator: React.FC = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState<any>(null);

  // Handle input changes for number fields and select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  // -------------------------------
  // Core Calculation Functions
  // -------------------------------
  function calculateConversionTax(
    conversionAmount: number,
    income: number,
    filingStatus: string
  ) {
    const brackets = TAX_RATES[filingStatus as "single" | "married"];
    let remaining = conversionAmount;
    let tax = 0;
    let currIncome = income;
    let marginalRate = brackets[0].rate;

    for (let i = 0; i < brackets.length && remaining > 0; i++) {
      const nextThreshold =
        i + 1 < brackets.length ? brackets[i + 1].threshold : Infinity;
      const space = Math.max(0, nextThreshold - currIncome);
      const taxed = Math.min(space, remaining);

      if (taxed > 0) {
        tax += taxed * brackets[i].rate;
        marginalRate = brackets[i].rate;
        remaining -= taxed;
        currIncome += taxed;
      }
    }
    return {
      tax: Math.round(tax),
      marginalRate,
      effectiveRate: conversionAmount > 0 ? tax / conversionAmount : 0,
    };
  }

  function calculateFutureValue(
    start: number,
    years: number,
    rate: number
  ) {
    return Math.round(start * Math.pow(1 + rate, years));
  }

  // -------------------------------
  // Additional Calculation Functions (RMD savings, IRMAA impact simple estimate)
  // -------------------------------
  function estimateRMDSavings(conversionAmount: number, years: number, rate: number) {
    // Simple logic: Avoided RMD grows tax free till age 72 and beyond, less tax drag
    const taxDragRate = 0.24; // tapers off in real life but fixed here
    const avoidedTax = conversionAmount * taxDragRate;
    return {
      avoidedRMDGrowth: Math.round((conversionAmount - avoidedTax) * Math.pow(1 + rate, years)),
      avoidedTax,
    };
  }

  function estimateIRMAA(conversionAmount: number, income: number) {
    // Extremely simplified: IRMAA starts at $103,000 single / $206,000 married (2024)
    const irmaaThreshold = inputs.filingStatus === "single" ? 103000 : 206000;
    const newMAGI = income + conversionAmount;
    return newMAGI > irmaaThreshold
      ? {
          impact: "Potential IRMAA Medicare premium increase",
          magi: newMAGI,
        }
      : null;
  }

  // -------------------------------
  // Chart Data Preparation
  // -------------------------------
  function prepareChartData() {
    // Simulate investment growth and compare scenarios
    const { iraBalance, conversionAmount, expectedReturn, years } = inputs;

    let traditional = iraBalance - conversionAmount;
    let roth = conversionAmount;
    const data = [];

    for (let i = 0; i <= years; i++) {
      data.push({
        year: i,
        TraditionalIRA: Math.round(traditional * Math.pow(1 + expectedReturn, i)),
        RothIRA: Math.round(roth * Math.pow(1 + expectedReturn, i)),
      });
    }
    return data;
  }

  // -------- Calculation Submit -------------
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const { iraBalance, conversionAmount, filingStatus, income, expectedReturn, years, retirementAge, currentAge } = inputs;

    if (conversionAmount < 0 || iraBalance < 1) {
      toast({ title: "Invalid values", description: "IRA balance and conversion amount must be positive", variant: "destructive" });
      return;
    }
    if (conversionAmount > iraBalance) {
      toast({ title: "Invalid conversion", description: "Conversion amount cannot exceed IRA balance", variant: "destructive" });
      return;
    }

    const taxResults = calculateConversionTax(conversionAmount, income, filingStatus);
    const rothFV = calculateFutureValue(conversionAmount - taxResults.tax, years, expectedReturn);
    const traditionalFV = calculateFutureValue(iraBalance - conversionAmount, years, expectedReturn);
    const rmd = estimateRMDSavings(conversionAmount, years, expectedReturn);
    const irmaa = estimateIRMAA(conversionAmount, income);

    setResults({
      ...taxResults,
      rothFV,
      traditionalFV,
      rmd,
      irmaa,
      chartData: prepareChartData(),
    });

    toast({
      title: "Analysis Complete",
      description: "Roth conversion scenario calculated.",
    });
  };

  // -------------------------------
  // JSX: Input Form Section
  // -------------------------------
  return (
    <Card className="p-6 mx-auto max-w-2xl">
      <form className="grid gap-4 mb-8" onSubmit={handleCalculate}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Traditional IRA Balance</Label>
            <Input
              name="iraBalance"
              type="number"
              min={1}
              value={inputs.iraBalance}
              onChange={handleChange}
              className="pl-3"
            />
          </div>
          <div>
            <Label>Conversion Amount</Label>
            <Input
              name="conversionAmount"
              type="number"
              min={0}
              max={inputs.iraBalance}
              value={inputs.conversionAmount}
              onChange={handleChange}
              className="pl-3"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Filing Status</Label>
            <select
              name="filingStatus"
              value={inputs.filingStatus}
              onChange={handleChange}
              className="w-full rounded border border-input p-2"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
          <div>
            <Label>Current Age</Label>
            <Input
              name="currentAge"
              type="number"
              min={18}
              max={100}
              value={inputs.currentAge}
              onChange={handleChange}
              className="pl-3"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Annual Income</Label>
            <Input
              name="income"
              type="number"
              min={0}
              value={inputs.income}
              onChange={handleChange}
              className="pl-3"
            />
          </div>
          <div>
            <Label>Years Until End Projection</Label>
            <Input
              name="years"
              type="number"
              min={1}
              value={inputs.years}
              onChange={handleChange}
              className="pl-3"
            />
          </div>
        </div>
        <div>
          <Label>Expected Annual Investment Return (%)</Label>
          <Input
            name="expectedReturn"
            type="number"
            min={0}
            step={0.01}
            value={inputs.expectedReturn}
            onChange={e =>
              setInputs({ ...inputs, expectedReturn: Number(e.target.value) })
            }
            className="pl-3"
          />
        </div>
        <Button className="w-full mt-4" type="submit">
          Calculate Roth Conversion
        </Button>
      </form>

      {/* -------------------------------
        JSX: Results and Visualization
      ------------------------------- */}
      {results && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Roth Conversion Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">Tax Owed on Conversion:</div>
                <div className="text-green-700 font-semibold text-lg">${results.tax.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Marginal Rate:</div>
                <div className="text-primary font-semibold text-lg">{(results.marginalRate * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Effective Rate:</div>
                <div className="text-primary font-semibold text-lg">{(results.effectiveRate * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Future Value of Roth (after-tax):</div>
                <div className="text-secondary font-semibold text-lg">${results.rothFV.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Future Value of Remaining Traditional IRA:</div>
                <div className="text-orange-700 font-semibold text-lg">${results.traditionalFV.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Avoided RMD Growth:</div>
                <div className="text-indigo-700 font-semibold text-lg">${results.rmd.avoidedRMDGrowth.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Assumes avoided RMD at top tax bracket, grows tax free</div>
              </div>
            </div>
          </div>
          {results.irmaa && (
            <div className="flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-600 p-3 my-3 rounded text-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-700" />
              <div>
                <div className="font-bold">IRMAA Alert</div>
                <div>{results.irmaa.impact} (MAGI after conversion: ${results.irmaa.magi.toLocaleString()})</div>
              </div>
            </div>
          )}

          <h3 className="text-lg font-semibold mt-8 mb-4">Projected IRA Growth</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="TraditionalIRA" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="RothIRA" stroke="#3082ce" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RothConversionCalculator;
