// Pelosi Trades Demo Data (disclosure-style ranges)
export type Trade = {
  symbol: string; 
  lastTradeDate: string; // ISO "2024-10-12"
  amountRange: "$1k–$15k" | "$15k–$50k" | "$50k–$100k" | "$100k–$250k" | "$250k–$500k" | "$500k–$1M" | "$1M+";
  transactionType?: "Buy" | "Sell" | "Exchange";
};

export const PELOSI_TRADES: Trade[] = [
  { symbol: "NVDA", lastTradeDate: "2024-12-15", amountRange: "$100k–$250k", transactionType: "Buy" },
  { symbol: "MSFT", lastTradeDate: "2024-11-28", amountRange: "$50k–$100k", transactionType: "Buy" },
  { symbol: "AAPL", lastTradeDate: "2024-11-12", amountRange: "$15k–$50k", transactionType: "Buy" },
  { symbol: "GOOGL", lastTradeDate: "2024-10-30", amountRange: "$50k–$100k", transactionType: "Buy" },
  { symbol: "AMZN", lastTradeDate: "2024-10-18", amountRange: "$50k–$100k", transactionType: "Buy" },
  { symbol: "META", lastTradeDate: "2024-09-25", amountRange: "$15k–$50k", transactionType: "Sell" },
  { symbol: "TSLA", lastTradeDate: "2024-09-12", amountRange: "$100k–$250k", transactionType: "Sell" },
  { symbol: "CRM", lastTradeDate: "2024-08-30", amountRange: "$15k–$50k", transactionType: "Buy" },
  { symbol: "NFLX", lastTradeDate: "2024-08-15", amountRange: "$50k–$100k", transactionType: "Buy" },
  { symbol: "ADBE", lastTradeDate: "2024-07-28", amountRange: "$15k–$50k", transactionType: "Buy" },
  { symbol: "V", lastTradeDate: "2024-07-10", amountRange: "$50k–$100k", transactionType: "Buy" },
  { symbol: "MA", lastTradeDate: "2024-06-22", amountRange: "$15k–$50k", transactionType: "Buy" },
];
