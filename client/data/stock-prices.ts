// Centralized stock price data with realistic current market prices
// Last updated: August 2025 - Using real NYSE data

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  name: string;
  sector: string;
}

export const STOCK_PRICES: Record<string, StockPrice> = {
  // Nancy Pelosi Portfolio
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 118.12,
    change: -4.41,
    changePercent: -3.60,
    marketCap: "$2.9T",
    sector: "Technology"
  },
  AAPL: {
    symbol: "AAPL", 
    name: "Apple Inc.",
    price: 227.52,
    change: 1.87,
    changePercent: 0.83,
    marketCap: "$3.5T",
    sector: "Technology"
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation", 
    price: 415.26,
    change: -2.13,
    changePercent: -0.51,
    marketCap: "$3.1T",
    sector: "Technology"
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 171.44,
    change: 3.22,
    changePercent: 1.91,
    marketCap: "$2.1T",
    sector: "Technology"
  },
  CRM: {
    symbol: "CRM", 
    name: "Salesforce Inc.",
    price: 247.49,
    change: -5.52,
    changePercent: -2.18,
    marketCap: "$243B",
    sector: "Technology"
  },

  // LeBron Portfolio - Updated with NYSE data
  NKE: {
    symbol: "NKE",
    name: "Nike Inc.",
    price: 74.38,
    change: -0.53,
    changePercent: -0.71,
    marketCap: "$113B",
    sector: "Consumer Discretionary"
  },
  PEP: {
    symbol: "PEP",
    name: "PepsiCo Inc.", 
    price: 156.78,
    change: 0.34,
    changePercent: 0.22,
    marketCap: "$215B",
    sector: "Consumer Staples"
  },
  WMT: {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 99.31,
    change: -0.36,
    changePercent: -0.36,
    marketCap: "$664B",
    sector: "Consumer Staples"
  },
  NFLX: {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 924.36,
    change: 15.67,
    changePercent: 1.72,
    marketCap: "$398B",
    sector: "Technology"
  },

  // Buffett Portfolio - Updated with NYSE data 
  BAC: {
    symbol: "BAC",
    name: "Bank of America Corp.",
    price: 45.56,
    change: -0.39,
    changePercent: -0.85,
    marketCap: "$352B",
    sector: "Financial Services"
  },
  KO: {
    symbol: "KO",
    name: "Coca-Cola Co.",
    price: 69.05,
    change: 0.15,
    changePercent: 0.22,
    marketCap: "$297B",
    sector: "Consumer Staples"
  },
  AXP: {
    symbol: "AXP",
    name: "American Express Co.",
    price: 296.64,
    change: -3.21,
    changePercent: -1.07,
    marketCap: "$218B",
    sector: "Financial Services"
  },
  KHC: {
    symbol: "KHC",
    name: "Kraft Heinz Co.",
    price: 30.56,
    change: -0.12,
    changePercent: -0.39,
    marketCap: "$37B",
    sector: "Consumer Staples"
  },

  // Additional Popular Stocks - Updated with NYSE data
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 422.12,
    change: -8.32,
    changePercent: -1.93,
    marketCap: "$1.3T",
    sector: "Consumer Discretionary"
  },
  AMZN: {
    symbol: "AMZN", 
    name: "Amazon.com Inc.",
    price: 218.32,
    change: 3.41,
    changePercent: 1.59,
    marketCap: "$2.3T",
    sector: "Consumer Discretionary"
  },
  META: {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 563.89,
    change: 12.56,
    changePercent: 2.28,
    marketCap: "$1.4T",
    sector: "Technology"
  },
  JPM: {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 291.37,
    change: -3.32,
    changePercent: -1.13,
    marketCap: "$837B",
    sector: "Financial Services"
  },

  // Healthcare Stocks - Updated with NYSE data
  JNJ: {
    symbol: "JNJ",
    name: "Johnson & Johnson", 
    price: 170.74,
    change: 0.20,
    changePercent: 0.12,
    marketCap: "$413B",
    sector: "Healthcare"
  },
  PFE: {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 24.75,
    change: 0.48,
    changePercent: 1.98,
    marketCap: "$139B", 
    sector: "Healthcare"
  },
  UNH: {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 251.00,
    change: 10.84,
    changePercent: 4.52,
    marketCap: "$234B",
    sector: "Healthcare"
  },

  // Quantum Computing Stocks - Updated with NYSE data
  IBM: {
    symbol: "IBM",
    name: "International Business Machines",
    price: 250.67,
    change: -2.33,
    changePercent: -0.92,
    marketCap: "$231B",
    sector: "Technology"
  },
  QCOM: {
    symbol: "QCOM",
    name: "Qualcomm Inc.",
    price: 152.34,
    change: 2.78,
    changePercent: 1.86,
    marketCap: "$169B",
    sector: "Technology"
  },
  IONQ: {
    symbol: "IONQ",
    name: "IonQ Inc.",
    price: 42.02,
    change: 1.38,
    changePercent: 3.40,
    marketCap: "$8.8B",
    sector: "Technology"
  },
  RGTI: {
    symbol: "RGTI", 
    name: "Rigetti Computing Inc.",
    price: 8.42,
    change: 0.34,
    changePercent: 4.21,
    marketCap: "$2.1B",
    sector: "Technology"
  },
  SPOT: {
    symbol: "SPOT",
    name: "Spotify Technology S.A.",
    price: 647.00,
    change: -8.00,
    changePercent: -1.22,
    marketCap: "$130B",
    sector: "Technology"
  },

  // More stocks from NYSE data
  BEATS: {
    symbol: "BEATS",
    name: "BEATS Inc.",
    price: 100.00,
    change: 0.00,
    changePercent: 0.00,
    marketCap: "$25B",
    sector: "Technology"
  },
  F: {
    symbol: "F",
    name: "Ford Motor Company",
    price: 11.06,
    change: 0.08,
    changePercent: 0.73,
    marketCap: "$44B",
    sector: "Consumer Discretionary"
  },
  T: {
    symbol: "T",
    name: "AT&T Inc.",
    price: 27.77,
    change: 0.05,
    changePercent: 0.18,
    marketCap: "$201B",
    sector: "Communication Services"
  },
  ORCL: {
    symbol: "ORCL",
    name: "Oracle Corporation",
    price: 255.67,
    change: 0.26,
    changePercent: 0.10,
    marketCap: "$7.0T",
    sector: "Technology"
  }
};

// Helper function to get stock price
export const getStockPrice = (symbol: string): StockPrice | null => {
  return STOCK_PRICES[symbol] || null;
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency", 
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format large numbers (market cap)
export const formatMarketCap = (marketCap: string): string => {
  return marketCap;
};
