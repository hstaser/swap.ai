import { getStock, resolveSymbol } from "./stocks.catalog";

export const INFLUENCER_MAP: Record<string, { name: string; tickers: string[] }> = {
  "lebron-james": {
    name: "LeBron James",
    tickers: ["NKE", "PEP", "AAPL"]
  },
};

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

export const getInfluencerInfo = (slug: string) => INFLUENCER_MAP[slug] || null;

export const isInfluencerVerified = (slug: string): boolean => {
  return Boolean(INFLUENCER_MAP[slug]);
};
