import { create } from 'zustand';

export interface QuoteData {
  bid: string;
  ask: string;
  varBid: string;
  pctChange: string;
  high: string;
  low: string;
  create_date: string;
  timestamp: string;
}

interface CurrencyState {
  usdHistory: QuoteData[];
  jpyHistory: QuoteData[];
  addUsdQuote: (quote: QuoteData) => void;
  addJpyQuote: (quote: QuoteData) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  usdHistory: [],
  jpyHistory: [],
  addUsdQuote: (quote) =>
    set((state) => {
      // Prevent adding duplicate exactly at the same timestamp if API didn't update
      const last = state.usdHistory[state.usdHistory.length - 1];
      if (last && last.create_date === quote.create_date) return state;
      return { usdHistory: [...state.usdHistory, quote] };
    }),
  addJpyQuote: (quote) =>
    set((state) => {
      const last = state.jpyHistory[state.jpyHistory.length - 1];
      if (last && last.create_date === quote.create_date) return state;
      return { jpyHistory: [...state.jpyHistory, quote] };
    }),
}));
