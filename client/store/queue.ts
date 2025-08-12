// Centralized Queue Store — append + dedupe, never replace
import { getStock, resolveSymbol } from "../data/stocks.catalog";
import { STOCK_LOOKUP } from "../data/stocks";

type QueueItem = { id: string; symbol: string; addedAt: number };
type State = { items: QueueItem[] };
const state: State = { items: [] };

const persist = () => localStorage.setItem("swipr_queue", JSON.stringify(state.items));
const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("swipr_queue") || "[]");
    state.items = stored.length > 0 ? stored : [
      // Demo portfolio stocks
      { id: "stk_aapl", symbol: "AAPL", addedAt: Date.now() - 86400000 },
      { id: "stk_msft", symbol: "MSFT", addedAt: Date.now() - 172800000 },
      { id: "stk_googl", symbol: "GOOGL", addedAt: Date.now() - 259200000 },
      { id: "stk_nvda", symbol: "NVDA", addedAt: Date.now() - 345600000 },
      { id: "stk_tsla", symbol: "TSLA", addedAt: Date.now() - 432000000 },
      { id: "stk_amzn", symbol: "AMZN", addedAt: Date.now() - 518400000 },
      { id: "stk_meta", symbol: "META", addedAt: Date.now() - 604800000 },
      { id: "stk_nflx", symbol: "NFLX", addedAt: Date.now() - 691200000 },
      { id: "stk_crm", symbol: "CRM", addedAt: Date.now() - 777600000 },
      { id: "stk_spot", symbol: "SPOT", addedAt: Date.now() - 864000000 }
    ];
  } catch {}
};
load();

export const addToQueue = (raw: string) => {
  const sym = resolveSymbol(raw);
  if (!sym) return false;
  if (!state.items.some(i => i.symbol === sym)) {
    const s = getStock(sym)!;
    state.items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() });
    persist();
  }
  return true; // Return true for successful addition or if already exists
};

export const addManyToQueue = (raws: string[]) => {
  const existing = new Set(state.items.map(i => i.symbol));
  for (const r of raws) {
    const sym = resolveSymbol(r);
    if (sym && !existing.has(sym)) {
      const s = getStock(sym)!;
      state.items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() });
      existing.add(sym);
    }
  }
  persist();
};

export const removeFromQueue = (raw: string) => {
  const sym = resolveSymbol(raw);
  if (!sym) return;
  state.items = state.items.filter(i => i.symbol !== sym);
  persist();
};

export const getQueue = () => state.items.slice();
export const clearQueue = () => { state.items = []; persist(); }; // only on explicit user action
export const isInQueue = (symbol: string) => {
  const resolved = resolveSymbol(symbol);
  return resolved ? state.items.some(i => i.symbol === resolved) : false;
};
