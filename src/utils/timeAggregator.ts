import { QuoteData } from '@/store/useCurrencyStore';

export interface OHLCData {
  time: string; // The minute
  open: number;
  high: number;
  low: number;
  close: number;
}

export function aggregateToOHLC(data: QuoteData[]): OHLCData[] {
  if (data.length === 0) return [];

  // Group by minute
  const grouped: Record<string, QuoteData[]> = {};

  data.forEach(quote => {
    // create_date is typically "YYYY-MM-DD HH:mm:ss"
    // We want to group by "HH:mm"
    const timeMatch = quote.create_date.match(/\d{2}:\d{2}/);
    if (!timeMatch) return;
    const minute = timeMatch[0];
    
    if (!grouped[minute]) {
      grouped[minute] = [];
    }
    grouped[minute].push(quote);
  });

  const ohlc: OHLCData[] = [];

  for (const minute in grouped) {
    const quotes = grouped[minute];
    
    const open = parseFloat(quotes[0].bid);
    const close = parseFloat(quotes[quotes.length - 1].bid);
    const high = Math.max(...quotes.map(q => parseFloat(q.bid)));
    const low = Math.min(...quotes.map(q => parseFloat(q.bid)));

    ohlc.push({
      time: minute,
      open,
      high,
      low,
      close
    });
  }

  return ohlc;
}
