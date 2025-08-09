import { getStock, resolveSymbol } from "./stocks.catalog";

export const INFLUENCER_TICKERS: Record<string, string[]> = {
  "lebron-james": ["NKE", "PEP", "AAPL"],
};

export const getInfluencerStocks = (slug: string) =>
  (INFLUENCER_TICKERS[slug] || [])
    .map(resolveSymbol)
    .filter(Boolean)
    .map(sym => getStock(sym!))
    .filter(Boolean);

export const getInfluencerTickers = (slug: string): string[] => {
  return INFLUENCER_TICKERS[slug] || [];
};
