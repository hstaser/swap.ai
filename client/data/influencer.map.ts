// Influencer Stock Mappings (demo/public associations only)
import { CANONICAL, getStock } from "./stocks.catalog";

export const INFLUENCER_MAP: Record<string, { name: string; tickers: string[] }> = {
  "lebron-james": {
    name: "LeBron James",
    tickers: ["NKE", "PEP", "AAPL"] // demo only - public associations
  },
  // more can be added here
};

export const getInfluencerStocks = (slug: string) =>
  (INFLUENCER_MAP[slug]?.tickers || [])
    .map(CANONICAL)
    .map(t => getStock(t))
    .filter(Boolean);

export const getInfluencerTickers = (slug: string): string[] => {
  return INFLUENCER_MAP[slug]?.tickers || [];
};

export const getInfluencerInfo = (slug: string) => INFLUENCER_MAP[slug] || null;

export const isInfluencerVerified = (slug: string): boolean => {
  // For demo purposes, return true for known influencers
  // In production, this would check a verification flag
  return Boolean(INFLUENCER_MAP[slug]);
};
