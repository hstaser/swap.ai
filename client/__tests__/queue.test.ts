import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToQueue, getQueue, clearQueue, addManyToQueue, isInQueue } from "../store/queue";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Queue System', () => {
  beforeEach(() => {
    clearQueue();
    localStorageMock.getItem.mockReturnValue(null);
  });

it("adds the exact symbol", () => {
  addToQueue("nke");
  expect(getQueue()[0].symbol).toBe("NKE");
});

it("addManyToQueue dedupes", () => {
  addManyToQueue(["AAPL", "aapl", "MSFT"]);
  expect(getQueue().map(i => i.symbol)).toEqual(["AAPL", "MSFT"]);
});

it("appends from LeBron without wiping existing queue", () => {
  addToQueue("AAPL", "swipe");
  addToQueue("MSFT", "swipe");
  addManyToQueue(["NKE", "PEP", "AAPL"], "lebron"); // includes a duplicate AAPL
  expect(getQueue().map(i => i.symbol)).toEqual(["AAPL", "MSFT", "NKE", "PEP"]);
});

it("Pelosi Add All merges, preserves order, dedupes", () => {
  addToQueue("TSLA", "swipe");
  addManyToQueue(["NVDA", "AAPL", "NVDA"], "pelosi");
  expect(getQueue().map(i => i.symbol)).toEqual(["TSLA", "NVDA", "AAPL"]);
});

it("normalizes symbol case", () => {
  addToQueue("aapl");
  addToQueue("AAPL");
  addToQueue("  aapl  ");
  expect(getQueue().length).toBe(1);
  expect(getQueue()[0].symbol).toBe("AAPL");
});

it("silently ignores unknown symbols", () => {
  addToQueue("ZZZZ");
  expect(getQueue().length).toBe(0);
});

it("isInQueue works correctly", () => {
  addToQueue("AAPL");
  expect(isInQueue("AAPL")).toBe(true);
  expect(isInQueue("aapl")).toBe(true);
  expect(isInQueue("MSFT")).toBe(false);
});

  it("maintains proper data structure", () => {
    addToQueue("AAPL");
    const queue = getQueue();
    expect(queue[0]).toHaveProperty("id");
    expect(queue[0]).toHaveProperty("symbol");
    expect(queue[0]).toHaveProperty("addedAt");
    expect(typeof queue[0].addedAt).toBe("number");
  });
});
