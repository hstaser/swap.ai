// Single Source of Truth for Stock Data
// This file serves as the canonical reference for all stocks in the system

export type Stock = {
  id: string;           // uuid or stable slug
  symbol: string;       // canonical, UPPERCASE (e.g., "AAPL")
  name: string;
  exchange?: string;    // e.g., NASDAQ, NYSE
  currency?: string;    // e.g., USD
  logoUrl?: string;
  sector: string;
  marketCap: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  pe: number | null;
  dividendYield: number | null;
  isGainer: boolean;
  newsSummary: string;
  returns?: {
    oneMonth: number;
    sixMonth: number;
    oneYear: number;
  };
  earningsDate?: string;
  beta: number;
  eps: number;
  bookValue: number;
  priceToBook: number;
  revenue: string;
  netIncome: string;
  employees: number;
  founded: string;
};

// Canonical stock records - SINGLE SOURCE OF TRUTH
export const STOCKS: Record<string, Stock> = {
  AAPL: {
    id: "stk_aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Technology",
    marketCap: "2.85T",
    price: 182.52,
    change: 2.31,
    changePercent: 1.28,
    volume: "52.4M",
    pe: 29.8,
    dividendYield: 0.5,
    isGainer: true,
    newsSummary: "Strong iPhone sales, AI momentum",
    returns: { oneMonth: 3.2, sixMonth: 12.7, oneYear: 18.4 },
    earningsDate: "Dec 19, 2025",
    beta: 1.2,
    eps: 6.13,
    bookValue: 4.82,
    priceToBook: 37.9,
    revenue: "394.3B",
    netIncome: "99.8B",
    employees: 164000,
    founded: "1976"
  },

  NKE: {
    id: "stk_nke",
    symbol: "NKE",
    name: "Nike, Inc.",
    exchange: "NYSE",
    currency: "USD",
    sector: "Consumer Discretionary",
    marketCap: "154.2B",
    price: 98.45,
    change: -1.23,
    changePercent: -1.23,
    volume: "8.2M",
    pe: 24.1,
    dividendYield: 1.4,
    isGainer: false,
    newsSummary: "Strong athletic wear demand, expansion in international markets",
    returns: { oneMonth: -2.1, sixMonth: 8.3, oneYear: 12.7 },
    earningsDate: "Mar 21, 2025",
    beta: 0.9,
    eps: 4.08,
    bookValue: 15.23,
    priceToBook: 6.5,
    revenue: "51.2B",
    netIncome: "5.1B",
    employees: 83700,
    founded: "1964"
  },

  PEP: {
    id: "stk_pep",
    symbol: "PEP",
    name: "PepsiCo, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Consumer Staples",
    marketCap: "228.3B",
    price: 165.78,
    change: 0.89,
    changePercent: 0.54,
    volume: "4.1M",
    pe: 25.4,
    dividendYield: 2.9,
    isGainer: true,
    newsSummary: "Steady beverage sales, healthier snack options gaining traction",
    returns: { oneMonth: 1.8, sixMonth: 5.2, oneYear: 7.1 },
    earningsDate: "Feb 12, 2025",
    beta: 0.6,
    eps: 6.53,
    bookValue: 16.84,
    priceToBook: 9.8,
    revenue: "86.4B",
    netIncome: "9.3B",
    employees: 315000,
    founded: "1965"
  },

  MSFT: {
    id: "stk_msft",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Technology",
    marketCap: "2.78T",
    price: 374.12,
    change: 3.45,
    changePercent: 0.93,
    volume: "21.8M",
    pe: 28.2,
    dividendYield: 0.7,
    isGainer: true,
    newsSummary: "Azure cloud growth, AI integration across products",
    returns: { oneMonth: 4.1, sixMonth: 15.3, oneYear: 22.8 },
    earningsDate: "Jan 24, 2025",
    beta: 0.9,
    eps: 13.26,
    bookValue: 25.73,
    priceToBook: 14.5,
    revenue: "211.9B",
    netIncome: "72.4B",
    employees: 221000,
    founded: "1975"
  },

  GOOGL: {
    id: "stk_googl",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Communication Services",
    marketCap: "2.05T",
    price: 163.45,
    change: 2.11,
    changePercent: 1.31,
    volume: "18.7M",
    pe: 23.8,
    dividendYield: 0.0,
    isGainer: true,
    newsSummary: "Search dominance continues, AI advancements in Gemini",
    returns: { oneMonth: 2.8, sixMonth: 11.4, oneYear: 19.2 },
    earningsDate: "Feb 4, 2025",
    beta: 1.1,
    eps: 6.87,
    bookValue: 86.32,
    priceToBook: 1.9,
    revenue: "282.8B",
    netIncome: "59.9B",
    employees: 182502,
    founded: "1998"
  },

  NVDA: {
    id: "stk_nvda",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Technology",
    marketCap: "2.91T",
    price: 118.34,
    change: 4.23,
    changePercent: 3.71,
    volume: "89.2M",
    pe: 63.2,
    dividendYield: 0.03,
    isGainer: true,
    newsSummary: "AI chip demand soaring, data center revenue growth",
    returns: { oneMonth: 8.7, sixMonth: 45.2, oneYear: 178.3 },
    earningsDate: "Feb 21, 2025",
    beta: 1.7,
    eps: 1.87,
    bookValue: 26.12,
    priceToBook: 4.5,
    revenue: "126.0B",
    netIncome: "29.8B",
    employees: 29600,
    founded: "1993"
  },

  TSLA: {
    id: "stk_tsla",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Consumer Discretionary",
    marketCap: "789.2B",
    price: 248.45,
    change: -3.21,
    changePercent: -1.28,
    volume: "45.3M",
    pe: 58.9,
    dividendYield: 0.0,
    isGainer: false,
    newsSummary: "EV deliveries strong, autonomous driving progress",
    returns: { oneMonth: -5.2, sixMonth: 12.4, oneYear: 23.1 },
    earningsDate: "Jan 29, 2025",
    beta: 2.1,
    eps: 4.22,
    bookValue: 25.34,
    priceToBook: 9.8,
    revenue: "96.8B",
    netIncome: "15.0B",
    employees: 140473,
    founded: "2003"
  },

  AMZN: {
    id: "stk_amzn",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Consumer Discretionary",
    marketCap: "1.56T",
    price: 151.23,
    change: 1.87,
    changePercent: 1.25,
    volume: "32.1M",
    pe: 42.3,
    dividendYield: 0.0,
    isGainer: true,
    newsSummary: "AWS growth continues, e-commerce efficiency gains",
    returns: { oneMonth: 3.4, sixMonth: 18.7, oneYear: 28.9 },
    earningsDate: "Feb 1, 2025",
    beta: 1.3,
    eps: 3.58,
    bookValue: 88.15,
    priceToBook: 1.7,
    revenue: "574.8B",
    netIncome: "33.4B",
    employees: 1541000,
    founded: "1994"
  },

  COIN: {
    id: "stk_coin",
    symbol: "COIN",
    name: "Coinbase Global, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Financial Services",
    marketCap: "41.2B",
    price: 165.78,
    change: 4.23,
    changePercent: 2.62,
    volume: "12.3M",
    pe: null,
    dividendYield: 0.0,
    isGainer: true,
    newsSummary: "Crypto trading volume surge, institutional adoption growing",
    returns: { oneMonth: 8.7, sixMonth: 45.2, oneYear: 89.3 },
    earningsDate: "Feb 15, 2025",
    beta: 2.3,
    eps: -1.25,
    bookValue: 34.12,
    priceToBook: 4.9,
    revenue: "5.2B",
    netIncome: "-541M",
    employees: 4948,
    founded: "2012"
  },

  MU: {
    id: "stk_mu",
    symbol: "MU",
    name: "Micron Technology, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    sector: "Technology",
    marketCap: "94.8B",
    price: 85.42,
    change: 2.15,
    changePercent: 2.58,
    volume: "18.7M",
    pe: 15.2,
    dividendYield: 0.0,
    isGainer: true,
    newsSummary: "Memory chip demand recovering, AI and data center growth driving sales",
    returns: { oneMonth: 12.3, sixMonth: 24.1, oneYear: 67.8 },
    earningsDate: "Jan 18, 2025",
    beta: 1.8,
    eps: 5.62,
    bookValue: 28.43,
    priceToBook: 3.0,
    revenue: "24.9B",
    netIncome: "7.8B",
    employees: 48000,
    founded: "1978"
  }
};

// Utility functions for safe stock access
export const getStock = (symbol: string): Stock | null => {
  const normalizedSymbol = symbol.trim().toUpperCase();
  return STOCKS[normalizedSymbol] ?? null;
};

export const hasStock = (symbol: string): boolean => {
  return Boolean(getStock(symbol));
};

export const getAllStocks = (): Stock[] => {
  return Object.values(STOCKS);
};

export const getStocksBySymbols = (symbols: string[]): Stock[] => {
  return symbols
    .map(symbol => getStock(symbol))
    .filter(stock => stock !== null) as Stock[];
};

// Validation helpers
export const validateStock = (symbol: string): { isValid: boolean; error?: string } => {
  const trimmed = symbol.trim();

  if (!trimmed) {
    return { isValid: false, error: "Symbol cannot be empty" };
  }

  const normalized = trimmed.toUpperCase();

  if (!STOCKS[normalized]) {
    return { isValid: false, error: `Unknown symbol: ${normalized}` };
  }

  return { isValid: true };
};

// Export count for monitoring
export const STOCK_COUNT = Object.keys(STOCKS).length;
