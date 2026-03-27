"use client";

import { useCurrencyQuotes } from '@/hooks/useCurrencyQuotes';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { QuoteCard } from '@/components/QuoteCard';
import { Clock } from 'lucide-react';

export default function Dashboard() {
  useCurrencyQuotes();
  const { usdHistory, jpyHistory } = useCurrencyStore();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Monitoramento das moedas em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/30">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Polling: 5s ativo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 shadow-sm">
        <QuoteCard 
          title="Dólar Americano (USD/BRL)" 
          currency="USD" 
          data={usdHistory} 
          color="#8b5cf6" 
        />
        
        <QuoteCard 
          title="Iene Japonês (JPY/BRL)" 
          currency="JPY" 
          data={jpyHistory} 
          color="#ec4899" 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mt-8">
        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
          <span>Últimos Registros Consolidados</span>
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/80">
              <tr>
                <th className="px-6 py-4">Moeda</th>
                <th className="px-6 py-4">Compra</th>
                <th className="px-6 py-4">Venda</th>
                <th className="px-6 py-4">Variação (%)</th>
                <th className="px-6 py-4">Data/Horário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {[...usdHistory].reverse().slice(0, 5).map((usd, idx) => (
                <tr key={`usd-list-${idx}`} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">USD/BRL</td>
                  <td className="px-6 py-4 font-medium dark:text-slate-300">R$ {parseFloat(usd.bid).toFixed(4)}</td>
                  <td className="px-6 py-4 font-medium dark:text-slate-300">R$ {parseFloat(usd.ask).toFixed(4)}</td>
                  <td className={`px-6 py-4 font-bold ${parseFloat(usd.pctChange) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {parseFloat(usd.pctChange) > 0 ? '+' : ''}{parseFloat(usd.pctChange).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{usd.create_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
