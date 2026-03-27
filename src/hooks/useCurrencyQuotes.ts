import { useEffect } from 'react';
import { useCurrencyStore, QuoteData } from '@/store/useCurrencyStore';

interface AwesomeApiResponse {
  USDBRL: QuoteData;
  JPYBRL: QuoteData;
}

export const useCurrencyQuotes = () => {
  const { addUsdQuote, addJpyQuote } = useCurrencyStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchQuotes = async () => {
      try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,JPY-BRL');
        if (!response.ok) throw new Error('Failed to fetch quotes');
        
        const data: AwesomeApiResponse = await response.json();
        
        if (data.USDBRL) {
            addUsdQuote(data.USDBRL);
        }
        if (data.JPYBRL) {
            addJpyQuote(data.JPYBRL);
        }
      } catch (error) {
        console.error('Error fetching currency quotes:', error);
      }
    };

    // Fetch immediately
    fetchQuotes();
    
    // Set up polling every 5 seconds
    interval = setInterval(fetchQuotes, 5000);

    return () => clearInterval(interval);
  }, [addUsdQuote, addJpyQuote]);
};
