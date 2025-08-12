export type StockCard = {
  id: string;            // e.g., "stk_aapl"
  symbol: string;        // "AAPL"
  name: string;          // "Apple Inc."
  exchange?: string;     // "NASDAQ"
  price?: number;
  changePct?: number;
  marketCap?: string;    // human readable "2.9T"
  divYield?: string;     // "0.5%" or "N/A"
  returns?: { m1?: string; m6?: string; y1?: string };
  newsSummary?: string;
  sentiment?: { bullish: number; bearish: number; total: number };
  sector?: string;
  risk?: "Low" | "Medium" | "High";
};

export const STOCKS: StockCard[] = [
  { id: "stk_aapl", symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology", risk: "Medium" },
  { id: "stk_msft", symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Technology", risk: "Medium" },
  { id: "stk_googl", symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", sector: "Communication Services", risk: "Medium" },
  { id: "stk_amzn", symbol: "AMZN", name: "Amazon.com, Inc.", exchange: "NASDAQ", sector: "Consumer Discretionary", risk: "Medium" },
  { id: "stk_meta", symbol: "META", name: "Meta Platforms, Inc.", exchange: "NASDAQ", sector: "Communication Services", risk: "High" },
  { id: "stk_nvda", symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology", risk: "High" },
  { id: "stk_tsla", symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ", sector: "Consumer Discretionary", risk: "High" },
  { id: "stk_brb", symbol: "BRK.B", name: "Berkshire Hathaway Inc. Class B", exchange: "NYSE", sector: "Financial Services", risk: "Low" },
  { id: "stk_jpm", symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financial Services", risk: "Medium" },
  { id: "stk_v", symbol: "V", name: "Visa Inc.", exchange: "NYSE", sector: "Financial Services", risk: "Low" },
  { id: "stk_ma", symbol: "MA", name: "Mastercard Incorporated", exchange: "NYSE", sector: "Financial Services", risk: "Low" },
  { id: "stk_unh", symbol: "UNH", name: "UnitedHealth Group", exchange: "NYSE", sector: "Healthcare", risk: "Low" },
  { id: "stk_hd", symbol: "HD", name: "The Home Depot, Inc.", exchange: "NYSE", sector: "Consumer Discretionary", risk: "Medium" },
  { id: "stk_pg", symbol: "PG", name: "Procter & Gamble", exchange: "NYSE", sector: "Consumer Staples", risk: "Low" },
  { id: "stk_xom", symbol: "XOM", name: "Exxon Mobil Corporation", exchange: "NYSE", sector: "Energy", risk: "High" },
  { id: "stk_pep", symbol: "PEP", name: "PepsiCo, Inc.", exchange: "NASDAQ", sector: "Consumer Staples", risk: "Low" },
  { id: "stk_cost", symbol: "COST", name: "Costco Wholesale", exchange: "NASDAQ", sector: "Consumer Staples", risk: "Medium" },
  { id: "stk_bac", symbol: "BAC", name: "Bank of America", exchange: "NYSE", sector: "Financial Services", risk: "Medium" },
  { id: "stk_avgo", symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ", sector: "Technology", risk: "Medium" },
  { id: "stk_tsm", symbol: "TSM", name: "Taiwan Semiconductor", exchange: "NYSE", sector: "Technology", risk: "Medium" },
  { id: "stk_orcl", symbol: "ORCL", name: "Oracle Corporation", exchange: "NYSE", sector: "Technology", risk: "Medium" },
  { id: "stk_adbe", symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", sector: "Technology", risk: "Medium" },
  { id: "stk_nflx", symbol: "NFLX", name: "Netflix, Inc.", exchange: "NASDAQ", sector: "Communication Services", risk: "High" },
  { id: "stk_crm", symbol: "CRM", name: "Salesforce, Inc.", exchange: "NYSE", sector: "Technology", risk: "Medium" },
  { id: "stk_intc", symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ", sector: "Technology", risk: "Medium" },
  { id: "stk_amd", symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", sector: "Technology", risk: "High" },
  { id: "stk_dis", symbol: "DIS", name: "The Walt Disney Company", exchange: "NYSE", sector: "Communication Services", risk: "Medium" },
  { id: "stk_mcd", symbol: "MCD", name: "McDonald's Corporation", exchange: "NYSE", sector: "Consumer Discretionary", risk: "Low" },
  { id: "stk_ko", symbol: "KO", name: "Coca-Cola Company", exchange: "NYSE", sector: "Consumer Staples", risk: "Low" },
  { id: "stk_mrk", symbol: "MRK", name: "Merck & Co., Inc.", exchange: "NYSE", sector: "Healthcare", risk: "Low" },
  { id: "stk_pfe", symbol: "PFE", name: "Pfizer Inc.", exchange: "NYSE", sector: "Healthcare", risk: "Low" },
];

export const STOCK_LOOKUP = Object.fromEntries(
  STOCKS.map(s => [s.symbol.toUpperCase(), s])
);
