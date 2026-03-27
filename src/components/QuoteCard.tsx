"use client";

import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { QuoteData } from '@/store/useCurrencyStore';

interface QuoteCardProps {
  title: string;
  currency: string;
  data: QuoteData[];
  color: string;
}

export function QuoteCard({ title, currency, data, color }: QuoteCardProps) {
  const current = data[data.length - 1];
  const isPositive = current ? parseFloat(current.pctChange) >= 0 : true;

  // For chart data we map string numbers to floats
  const chartData = data.map((item, idx) => ({
    time: item.create_date.split(' ')[1] || idx,
    value: parseFloat(item.bid),
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[320px] transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {current ? `R$ ${parseFloat(current.bid).toFixed(2)}` : 'R$ 0.00'}
            </span>
            <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {current ? `${current.pctChange}%` : '0.00%'}
            </span>
          </div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
          <Activity className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`color-${currency}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-900)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#color-${currency})`} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">
            Carregando do servidor...
          </div>
        )}
      </div>
    </div>
  );
}
