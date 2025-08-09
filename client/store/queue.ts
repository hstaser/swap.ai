// Centralized Queue Store — append + dedupe, never replace
import { getStock, resolveSymbol } from "../data/stocks.catalog";

type QueueItem = { id: string; symbol: string; addedAt: number };
type State = { items: QueueItem[] };
const state: State = { items: [] };

const persist = () => localStorage.setItem("swipr_queue", JSON.stringify(state.items));
const load = () => {
  try {
    state.items = JSON.parse(localStorage.getItem("swipr_queue") || "[]");
  } catch {}
};
load();

export const addToQueue = (raw: string) => {
  const sym = resolveSymbol(raw);
  if (!sym) return;
  if (!state.items.some(i => i.symbol === sym)) {
    const s = getStock(sym)!;
    state.items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() });
    persist();
  }
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
