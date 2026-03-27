"use client";

import { Globe, TrendingUp, DollarSign, Percent } from 'lucide-react';

interface MacroData {
  country: string;
  flag: string;
  interestRate: number;
  inflation: number;
  gdpGrowth: number;
  gdpTotal: string;
  unemployment: number;
}

const mockData: { US: MacroData, JP: MacroData } = {
  US: {
    country: 'Estados Unidos',
    flag: '🇺🇸',
    interestRate: 5.50,
    inflation: 3.1,
    gdpGrowth: 2.5,
    gdpTotal: '$25.4T',
    unemployment: 3.7
  },
  JP: {
    country: 'Japão',
    flag: '🇯🇵',
    interestRate: -0.10,
    inflation: 2.8,
    gdpGrowth: 1.2,
    gdpTotal: '$4.2T',
    unemployment: 2.5
  }
};

function ComparisonBar({ title, val1, val2, suffix = '%', reverseGoodIndicator = false }: any) {
  const max = Math.max(Math.abs(val1), Math.abs(val2)) * 1.2;
  const w1 = `${(Math.abs(val1) / max) * 100}%`;
  const w2 = `${(Math.abs(val2) / max) * 100}%`;

  const isVal1Better = reverseGoodIndicator ? val1 < val2 : val1 > val2;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center justify-end gap-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {val1 > 0 ? '+' : ''}{val1}{suffix}
          </span>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex justify-end">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isVal1Better ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-600'}`}
              style={{ width: w1 }}
            />
          </div>
        </div>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex-1 flex items-center justify-start gap-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex justify-start">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${!isVal1Better ? 'bg-rose-500' : 'bg-slate-400 dark:bg-slate-600'}`}
              style={{ width: w2 }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {val2 > 0 ? '+' : ''}{val2}{suffix}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Economia() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <header className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Cenário Macroeconômico
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Comparativo de balanços entre Estados Unidos e Japão.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-9xl">{mockData.US.flag}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10 flex items-center gap-3">
            <span>{mockData.US.flag}</span>
            {mockData.US.country}
          </h2>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <Percent className="w-5 h-5" /> Taxa de Juros (Fed)
              </div>
              <span className="text-xl font-bold">{mockData.US.interestRate}%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <TrendingUp className="w-5 h-5" /> Inflação Anual (CPI)
              </div>
              <span className="text-xl font-bold text-rose-500">{mockData.US.inflation}%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <DollarSign className="w-5 h-5" /> PIB Total
              </div>
              <span className="text-xl font-bold text-emerald-500">{mockData.US.gdpTotal}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-9xl">{mockData.JP.flag}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10 flex items-center gap-3">
            <span>{mockData.JP.flag}</span>
            {mockData.JP.country}
          </h2>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <Percent className="w-5 h-5" /> Taxa de Juros (BOJ)
              </div>
              <span className="text-xl font-bold text-indigo-500">{mockData.JP.interestRate}%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <TrendingUp className="w-5 h-5" /> Inflação Anual (CPI)
              </div>
              <span className="text-xl font-bold text-amber-500">{mockData.JP.inflation}%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
                <DollarSign className="w-5 h-5" /> PIB Total
              </div>
              <span className="text-xl font-bold text-emerald-500">{mockData.JP.gdpTotal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 text-center flex items-center justify-center gap-4">
          <span className="flex items-center gap-2">{mockData.US.flag} Estados Unidos</span>
          <span className="text-slate-400 font-normal">vs</span>
          <span className="flex items-center gap-2">Japão {mockData.JP.flag}</span>
        </h3>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <ComparisonBar 
            title="Crescimento do PIB (%)" 
            val1={mockData.US.gdpGrowth} 
            val2={mockData.JP.gdpGrowth} 
          />
          <ComparisonBar 
            title="Inflação Anual (%)" 
            val1={mockData.US.inflation} 
            val2={mockData.JP.inflation} 
            reverseGoodIndicator={true} // Lower inflation is generally better
          />
          <ComparisonBar 
            title="Taxa de Desemprego (%)" 
            val1={mockData.US.unemployment} 
            val2={mockData.JP.unemployment} 
            reverseGoodIndicator={true} // Lower unemployment is better
          />
        </div>
      </div>
    </div>
  );
}
