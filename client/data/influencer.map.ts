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

export const validateInfluencerMappings = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[]
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(INFLUENCER_MAP).forEach(([slug, mapping]) => {
    // Check for required fields
    if (!mapping.name) {
      errors.push(`${slug}: Missing name field`);
    }

    if (mapping.tickers.length === 0) {
      warnings.push(`${slug}: No tickers defined`);
    }

    // Check all tickers exist in catalog
    mapping.tickers.forEach(ticker => {
      const stock = getStock(ticker);
      if (!stock) {
        errors.push(`${slug}: Invalid ticker ${ticker} not found in stock catalog`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Export counts for monitoring
export const INFLUENCER_COUNT = Object.keys(INFLUENCER_MAP).length;
export const VERIFIED_INFLUENCER_COUNT = Object.values(INFLUENCER_MAP)
  .filter(mapping => Boolean(mapping)).length; // All current entries are considered verified for demo
