import { getStock, resolveSymbol } from "./stocks.catalog";
import { extendedStockDatabase } from "./extended-stocks";

export const INFLUENCER_MAP: Record<string, { name: string; tickers: string[] }> = {
  "lebron-james": {
    name: "LeBron James",
    tickers: ["NKE", "PEP", "WMT", "AAPL", "NFLX"] // Nike (lifetime deal), PepsiCo (Blaze Pizza), Walmart (SpringHill), Apple (Beats), Netflix (content)
  },
};

export const INFLUENCER_TICKERS: Record<string, string[]> = {
  "lebron-james": ["NKE", "PEP", "WMT", "AAPL", "NFLX"],
};

export const getInfluencerStocks = (slug: string) => {
  const tickers = INFLUENCER_TICKERS[slug] || [];
  return tickers
    .map(ticker => extendedStockDatabase.find(stock => stock.symbol === ticker))
    .filter(Boolean);
};

export const getInfluencerTickers = (slug: string): string[] => {
  return INFLUENCER_TICKERS[slug] || [];
};

export const getInfluencerInfo = (slug: string) => INFLUENCER_MAP[slug] || null;

export const isInfluencerVerified = (slug: string): boolean => {
  return Boolean(INFLUENCER_MAP[slug]);
};
