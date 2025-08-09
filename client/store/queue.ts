// Centralized Queue Store - append + dedupe, never replace
import { getStock, CANONICAL } from "../data/stocks.catalog";

type QueueItem = { id: string; symbol: string; addedAt: number; };
type State = { items: QueueItem[] };
const state: State = { items: [] };

const persist = () => localStorage.setItem("swipr_queue", JSON.stringify(state.items));
const load = () => { 
  try { 
    state.items = JSON.parse(localStorage.getItem("swipr_queue") || "[]"); 
  } catch {} 
};
load();

// normalize once
const norm = (s: string) => s.trim().toUpperCase();

export const addToQueue = (symbolRaw: string, src?: string) => {
  const s = getStock(norm(symbolRaw));
  if (!s) return; // silently ignore unknowns in UI paths
  // ---- append + dedupe (no replacement) ----
  if (!state.items.some(i => i.symbol === s.symbol)) {
    state.items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() });
    persist();
  }
};

export const addManyToQueue = (symbolsRaw: string[], src?: string) => {
  // union of existing + incoming, in order
  const existing = new Set(state.items.map(i => i.symbol));
  for (const raw of symbolsRaw) {
    const s = getStock(norm(raw));
    if (s && !existing.has(s.symbol)) {
      state.items.push({ id: s.id, symbol: s.symbol, addedAt: Date.now() });
      existing.add(s.symbol);
    }
  }
  persist();
};

export const getQueue = () => state.items.slice();
export const clearQueue = () => { state.items = []; persist(); }; // only call via explicit user action
export const isInQueue = (symbol: string) => state.items.some(i => i.symbol === norm(symbol));
