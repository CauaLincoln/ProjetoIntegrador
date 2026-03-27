"use client";

import { useCurrencyQuotes } from '@/hooks/useCurrencyQuotes';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { calculateSMA, calculateEMA, calculateRSI } from '@/utils/financialMath';
import { TrendingUp, Activity, AlertTriangle, Scale } from 'lucide-react';

function IndicatorCard({ title, value, description, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-md duration-300">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{title}</h3>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex-1 mt-2">
        <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          {value !== null ? value : '--'}
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default function AnaliseFinanceira() {
  useCurrencyQuotes();
  const { usdHistory, jpyHistory } = useCurrencyStore();

  const period = 5;

  const usdSMA = calculateSMA(usdHistory, period);
  const usdEMA = calculateEMA(usdHistory, period);
  const usdRSI = calculateRSI(usdHistory, period);

  const getRsiStatus = (rsi: number | null) => {
    if (rsi === null) return 'Aguardando dados';
    if (rsi >= 70) return 'Sobrecompra (Vender)';
    if (rsi <= 30) return 'Sobrevenda (Comprar)';
    return 'Neutro';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <header className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Análise Financeira
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Algoritmos nativos de análise técnica. (Período: {period} ticks)
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 pl-2 border-l-4 border-purple-500">Indicadores Dólar (USD/BRL)</h2>
        {usdHistory.length < period ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-6 rounded-2xl flex items-center gap-4 border border-amber-200 dark:border-amber-800/30 font-medium">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <p>Aguardando mais dados para calcular os indicadores. Ticks atuais: {usdHistory.length}/{period}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <IndicatorCard
              title="SMA (Média Móvel Simples)"
              value={usdSMA ? `R$ ${usdSMA.toFixed(4)}` : null}
              description="Média limpa não ponderada"
              icon={TrendingUp}
              colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            />
            <IndicatorCard
              title="EMA (Média Móvel Exponencial)"
              value={usdEMA ? `R$ ${usdEMA.toFixed(4)}` : null}
              description="Maior peso aos dados recentes"
              icon={Activity}
              colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
            />
            <IndicatorCard
              title="RSI (Índice de Força Relativa)"
              value={usdRSI !== null ? usdRSI.toFixed(2) : null}
              description={`Status: ${getRsiStatus(usdRSI)}`}
              icon={Activity}
              colorClass="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
            />
          </div>
        )}
      </section>
    </div>
  );
}
