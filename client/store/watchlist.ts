// Centralized Watchlist Store
import { getStock } from "../data/stocks.catalog";

type WLItem = { id: string; symbol: string; addedAt: number; };
let items: WLItem[] = [];
const persist = () => localStorage.setItem("swipr_watchlist", JSON.stringify(items));
const load = () => { 
  try { 
    items = JSON.parse(localStorage.getItem("swipr_watchlist") || "[]"); 
  } catch {} 
};
load();

export const addToWatchlist = (symbol: string) => {
  const s = getStock(symbol);
  if (!s) throw new Error(`Unknown symbol: ${symbol}`);
  if (items.some(i => i.symbol === s.symbol)) return;
  items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() }); 
  persist();
};

export const addManyToWatchlist = (symbols: string[]) => {
  const existing = new Set(items.map(i => i.symbol));
  for (const symbol of symbols) {
    const s = getStock(symbol);
    if (s && !existing.has(s.symbol)) {
      items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() });
      existing.add(s.symbol);
    }
  }
  persist();
};

export const getWatchlist = () => items.slice();
export const isInWatchlist = (symbol: string) => items.some(i => i.symbol === symbol.trim().toUpperCase());
export const removeFromWatchlist = (symbol: string) => {
  items = items.filter(i => i.symbol !== symbol.trim().toUpperCase());
  persist();
};
