import { QuoteData } from '@/store/useCurrencyStore';

export function calculateSMA(data: QuoteData[], period: number): number | null {
  if (data.length < period) return null;
  const slice = data.slice(-period);
  const sum = slice.reduce((acc, curr) => acc + parseFloat(curr.bid), 0);
  return sum / period;
}

export function calculateEMA(data: QuoteData[], period: number): number | null {
  if (data.length < period) return null;
  
  const k = 2 / (period + 1);
  let ema = calculateSMA(data.slice(0, data.length - period + 1), period) || parseFloat(data[data.length - period].bid);

  for (let i = data.length - period + 1; i < data.length; i++) {
    const price = parseFloat(data[i].bid);
    ema = (price - ema) * k + ema;
  }
  
  return ema;
}

export function calculateRSI(data: QuoteData[], period: number = 14): number | null {
  if (data.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = data.length - period; i < data.length; i++) {
    const current = parseFloat(data[i].bid);
    const previous = parseFloat(data[i - 1].bid);
    const change = current - previous;

    if (change > 0) {
      gains += change;
    } else {
      losses -= change; // Make positive
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}
