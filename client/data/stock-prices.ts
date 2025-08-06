// Centralized stock price data with realistic current market prices
// Last updated: December 2024

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
    price: 138.45,
    change: 2.31,
    changePercent: 1.69,
    marketCap: "$3.4T",
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
    price: 317.89,
    change: 4.56,
    changePercent: 1.46,
    marketCap: "$315B",
    sector: "Technology"
  },

  // LeBron Portfolio
  NKE: {
    symbol: "NKE",
    name: "Nike Inc.",
    price: 75.23,
    change: 0.89,
    changePercent: 1.20,
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
    price: 95.67,
    change: 1.23,
    changePercent: 1.30,
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

  // Buffett Portfolio  
  BAC: {
    symbol: "BAC",
    name: "Bank of America Corp.",
    price: 46.89,
    change: 0.78,
    changePercent: 1.69,
    marketCap: "$363B",
    sector: "Financial Services"
  },
  KO: {
    symbol: "KO",
    name: "Coca-Cola Co.",
    price: 59.34,
    change: 0.23,
    changePercent: 0.39,
    marketCap: "$255B",
    sector: "Consumer Staples"
  },
  AXP: {
    symbol: "AXP",
    name: "American Express Co.",
    price: 291.45,
    change: 3.67,
    changePercent: 1.28,
    marketCap: "$207B",
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

  // Additional Popular Stocks
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
    price: 249.78,
    change: 2.13,
    changePercent: 0.86,
    marketCap: "$717B",
    sector: "Financial Services"
  },

  // Healthcare Stocks
  JNJ: {
    symbol: "JNJ",
    name: "Johnson & Johnson", 
    price: 145.67,
    change: 1.34,
    changePercent: 0.93,
    marketCap: "$349B",
    sector: "Healthcare"
  },
  PFE: {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 25.89,
    change: 0.45,
    changePercent: 1.77,
    marketCap: "$145B", 
    sector: "Healthcare"
  },
  UNH: {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 595.23,
    change: 8.90,
    changePercent: 1.52,
    marketCap: "$552B",
    sector: "Healthcare"
  },

  // Quantum Computing Stocks
  IBM: {
    symbol: "IBM",
    name: "International Business Machines",
    price: 231.45,
    change: 4.67,
    changePercent: 2.06,
    marketCap: "$213B",
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
    price: 35.67,
    change: 1.89,
    changePercent: 5.59,
    marketCap: "$7.1B",
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
    price: 478.23,
    change: 18.45,
    changePercent: 4.01,
    marketCap: "$96B",
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
