
import React from "react";

interface TaxYearSelectorProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
}

const TaxYearSelector: React.FC<TaxYearSelectorProps> = ({ years, selected, onChange }) => (
  <div className="flex items-center gap-2">
    <label htmlFor="tax-year-dropdown" className="text-sm font-medium">Year:</label>
    <select
      id="tax-year-dropdown"
      className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1"
      value={selected}
      onChange={e => onChange(Number(e.target.value))}
    >
      {years.map(year => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  </div>
);

export default TaxYearSelector;
