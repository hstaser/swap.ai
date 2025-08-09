// Influencer Stock Mappings
// IMPORTANT: All associations must be verified by PM/Legal before go-live
// Only include public companies with clear, defensible associations

import { hasStock } from './stocks.catalog';

export type InfluencerMapping = {
  name: string;
  tickers: string[];
  notes?: string;
  verified: boolean; // Must be true before shipping
  lastVerified?: string; // Date of last legal review
  disclaimer?: string;
};

// TODO: REQUIRES PM/LEGAL SIGN-OFF BEFORE SHIPPING
// Placeholder data - verify all associations and legal compliance
export const INFLUENCER_STOCKS: Record<string, InfluencerMapping> = {
  "lebron-james": {
    name: "LeBron James",
    tickers: ["NKE", "PEP", "AAPL"], // PLACEHOLDER - VERIFY BEFORE GO LIVE
    notes: "Verify brand partnerships and public associations. Nike (lifetime deal), PepsiCo (historical), Apple (general tech)",
    verified: false, // MUST BE TRUE BEFORE SHIPPING
    disclaimer: "Based on publicly reported business relationships. Not investment advice."
  },
  // Future influencers can be added here after verification
  /*
  "warren-buffett": {
    name: "Warren Buffett",
    tickers: ["AAPL", "BAC", "KO"], // Berkshire holdings
    verified: false,
    notes: "Based on Berkshire Hathaway public filings"
  }
  */
};

// Safe accessor that only returns verified, valid tickers
export const getInfluencerTickers = (slug: string): string[] => {
  const mapping = INFLUENCER_STOCKS[slug];
  
  if (!mapping) {
    console.warn(`No influencer mapping found for: ${slug}`);
    return [];
  }
  
  if (!mapping.verified) {
    console.warn(`Influencer mapping not verified for: ${slug}. Legal review required.`);
    return []; // Return empty array for unverified mappings in production
  }
  
  return mapping.tickers
    .map(ticker => ticker.trim().toUpperCase())
    .filter(ticker => {
      const isValid = hasStock(ticker);
      if (!isValid) {
        console.error(`Invalid ticker ${ticker} in ${slug} mapping`);
      }
      return isValid;
    });
};

export const getInfluencerInfo = (slug: string): InfluencerMapping | null => {
  return INFLUENCER_STOCKS[slug] ?? null;
};

export const isInfluencerVerified = (slug: string): boolean => {
  const mapping = INFLUENCER_STOCKS[slug];
  return mapping?.verified ?? false;
};

// Validation function for deployment checks
export const validateInfluencerMappings = (): { 
  isValid: boolean; 
  errors: string[]; 
  warnings: string[] 
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  Object.entries(INFLUENCER_STOCKS).forEach(([slug, mapping]) => {
    // Check verification status
    if (!mapping.verified) {
      errors.push(`${slug}: Not verified by legal/PM team`);
    }
    
    // Check all tickers exist in catalog
    mapping.tickers.forEach(ticker => {
      if (!hasStock(ticker)) {
        errors.push(`${slug}: Invalid ticker ${ticker} not found in stock catalog`);
      }
    });
    
    // Check for required fields
    if (!mapping.name) {
      errors.push(`${slug}: Missing name field`);
    }
    
    if (mapping.tickers.length === 0) {
      warnings.push(`${slug}: No tickers defined`);
    }
    
    if (!mapping.disclaimer) {
      warnings.push(`${slug}: No disclaimer defined`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Export for monitoring
export const INFLUENCER_COUNT = Object.keys(INFLUENCER_STOCKS).length;
export const VERIFIED_INFLUENCER_COUNT = Object.values(INFLUENCER_STOCKS)
  .filter(mapping => mapping.verified).length;
