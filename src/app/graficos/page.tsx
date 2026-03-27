"use client";

import dynamic from 'next/dynamic';
import { useCurrencyQuotes } from '@/hooks/useCurrencyQuotes';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { aggregateToOHLC } from '@/utils/timeAggregator';
import { useTheme } from 'next-themes';
import { BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

// ApexCharts must be dynamically imported with no SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function GraficosAvancados() {
  useCurrencyQuotes();
  const { usdHistory, jpyHistory } = useCurrencyStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const usdOHLC = aggregateToOHLC(usdHistory);
  const jpyOHLC = aggregateToOHLC(jpyHistory);

  const getChartOptions = (currencyName: string) => ({
    chart: {
      type: 'candlestick' as const,
      background: 'transparent',
      foreColor: theme === 'dark' ? '#94a3b8' : '#64748b',
      toolbar: { show: false },
      animations: { enabled: false }
    },
    title: {
      text: currencyName,
      align: 'left' as const,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: theme === 'dark' ? '#f8fafc' : '#0f172a'
      }
    },
    xaxis: {
      type: 'category' as const,
      labels: {
        style: { colors: theme === 'dark' ? '#94a3b8' : '#64748b' }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: { colors: theme === 'dark' ? '#94a3b8' : '#64748b' },
        formatter: (value: number) => `R$ ${value.toFixed(4)}`
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10b981', // emerald-500
          downward: '#f43f5e' // rose-500
        }
      }
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
    }
  });

  const usdSeries = [{
    name: 'candle',
    data: usdOHLC.map(d => ({
      x: d.time,
      y: [d.open, d.high, d.low, d.close]
    }))
  }];

  const jpySeries = [{
    name: 'candle',
    data: jpyOHLC.map(d => ({
      x: d.time,
      y: [d.open, d.high, d.low, d.close]
    }))
  }];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <header className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Gráficos Avançados
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Velas Japonesas (Candlestick) agrupadas por minuto (OHLC).
            </p>
          </div>
        </div>
      </header>

      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
             {usdOHLC.length > 0 ? (
               <ReactApexChart 
                 options={getChartOptions("Dólar (USD/BRL)")} 
                 series={usdSeries} 
                 type="candlestick" 
                 height={350} 
               />
             ) : (
               <div className="h-full w-full flex items-center justify-center text-slate-400 animate-pulse">
                 Aguardando virada de minuto...
               </div>
             )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
             {jpyOHLC.length > 0 ? (
               <ReactApexChart 
                 options={getChartOptions("Iene (JPY/BRL)")} 
                 series={jpySeries} 
                 type="candlestick" 
                 height={350} 
               />
             ) : (
               <div className="h-full w-full flex items-center justify-center text-slate-400 animate-pulse">
                 Aguardando virada de minuto...
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
