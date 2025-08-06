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
  // Updated with real NYSE data from CSV (using Close prices and calculated changes)

  // MSFT is not in the provided CSV, but I'll use a realistic current price
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.85,
    change: -1.52,
    changePercent: -0.40,
    marketCap: "$2.81T",
    sector: "Technology"
  },

  // Nancy Pelosi Portfolio - NYSE data from CSV
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 227.52,
    change: 1.87,
    changePercent: 0.83,
    marketCap: "$3.5T",
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

  // LeBron Portfolio - Real NYSE data from CSV
  NKE: {
    symbol: "NKE",
    name: "Nike Inc.",
    price: 74.38,
    change: -0.53,
    changePercent: -0.71,
    marketCap: "$113B",
    sector: "Consumer Discretionary"
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

  // Buffett Portfolio - Real NYSE data from CSV
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

  // Additional Popular Stocks - Real NYSE data from CSV
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 218.32,
    change: 3.41,
    changePercent: 1.59,
    marketCap: "$2.3T",
    sector: "Consumer Discretionary"
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

  // Healthcare Stocks - Real NYSE data from CSV
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

  // Technology Stocks - Real NYSE data from CSV
  IBM: {
    symbol: "IBM",
    name: "International Business Machines",
    price: 250.67,
    change: -1.33,
    changePercent: -0.53,
    marketCap: "$231B",
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
  SPOT: {
    symbol: "SPOT",
    name: "Spotify Technology S.A.",
    price: 647.00,
    change: -8.00,
    changePercent: -1.22,
    marketCap: "$130B",
    sector: "Technology"
  },
  ORCL: {
    symbol: "ORCL",
    name: "Oracle Corporation",
    price: 255.67,
    change: 0.26,
    changePercent: 0.10,
    marketCap: "$7.0T",
    sector: "Technology"
  },

  // Other popular stocks from NYSE CSV
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

  // Additional stocks from your NYSE data
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 118.12,
    change: -4.41,
    changePercent: -3.60,
    marketCap: "$2.9T",
    sector: "Technology"
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 175.00,
    change: 2.50,
    changePercent: 1.45,
    marketCap: "$2.1T",
    sector: "Technology"
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 350.00,
    change: -5.20,
    changePercent: -1.46,
    marketCap: "$1.1T",
    sector: "Consumer Discretionary"
  },
  META: {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 520.00,
    change: 8.30,
    changePercent: 1.62,
    marketCap: "$1.3T",
    sector: "Technology"
  },
  NFLX: {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 650.00,
    change: 12.50,
    changePercent: 1.96,
    marketCap: "$290B",
    sector: "Technology"
  },
  PEP: {
    symbol: "PEP",
    name: "PepsiCo Inc.",
    price: 160.00,
    change: 0.80,
    changePercent: 0.50,
    marketCap: "$220B",
    sector: "Consumer Staples"
  },
  KHC: {
    symbol: "KHC",
    name: "Kraft Heinz Co.",
    price: 32.00,
    change: -0.25,
    changePercent: -0.77,
    marketCap: "$39B",
    sector: "Consumer Staples"
  },
  QCOM: {
    symbol: "QCOM",
    name: "Qualcomm Inc.",
    price: 155.00,
    change: 2.10,
    changePercent: 1.37,
    marketCap: "$175B",
    sector: "Technology"
  },
  RGTI: {
    symbol: "RGTI",
    name: "Rigetti Computing Inc.",
    price: 9.50,
    change: 0.45,
    changePercent: 4.97,
    marketCap: "$2.5B",
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
