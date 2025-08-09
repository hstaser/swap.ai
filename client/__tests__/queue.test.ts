import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToQueue, addManyToQueue, getQueue, clearQueue } from '../store/queue';

// Mock localStorage for Node.js test environment
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

beforeEach(() => {
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockClear();
  clearQueue();
});

describe('Queue System Tests', () => {
  it("adds GS from a viewed card without 'not found'", () => {
    addToQueue("GS");
    expect(getQueue().map(i => i.symbol)).toEqual(["GS"]);
  });

  it("handles BRK.B aliases", () => {
    addToQueue("BRKB");
    addToQueue("BRK-B");
    addToQueue("BRK/B");
    expect(getQueue().map(i => i.symbol)).toEqual(["BRK.B"]);
  });

  it("Pelosi Add All appends, does not wipe", () => {
    addToQueue("AAPL");
    addManyToQueue(["NVDA","MSFT","AAPL"]); // AAPL duplicate
    expect(getQueue().map(i => i.symbol)).toEqual(["AAPL","NVDA","MSFT"]);
  });

  it("LeBron adds correct associated tickers and appends", () => {
    addManyToQueue(["TSLA","AMZN"]);
    addManyToQueue(["NKE","PEP","AAPL"]); // LeBron
    expect(getQueue().map(i => i.symbol)).toEqual(["TSLA","AMZN","NKE","PEP","AAPL"]);
  });

  it("handles MU and COIN without errors", () => {
    addToQueue("MU");
    addToQueue("COIN");
    expect(getQueue().map(i => i.symbol)).toEqual(["MU","COIN"]);
  });

  it("normalize symbols consistently", () => {
    addToQueue("aapl");
    addToQueue("AAPL");
    addToQueue("  aapl  ");
    expect(getQueue().map(i => i.symbol)).toEqual(["AAPL"]); // dedupe
  });

  it("append behavior: queue grows, never replaces", () => {
    addToQueue("AAPL");
    expect(getQueue().length).toBe(1);

    addToQueue("MSFT");
    expect(getQueue().length).toBe(2);
    expect(getQueue().map(i => i.symbol)).toEqual(["AAPL", "MSFT"]);

    addToQueue("AAPL"); // duplicate
    expect(getQueue().length).toBe(2); // no change
  });

  it("persistence survives after queue operations", () => {
    addToQueue("NVDA");
    const queue1 = getQueue();

    addManyToQueue(["TSLA", "META"]);
    const queue2 = getQueue();

    expect(queue1.length).toBe(1);
    expect(queue2.length).toBe(3);
    expect(queue2.map(i => i.symbol)).toEqual(["NVDA", "TSLA", "META"]);
  });

  it("handles unknown symbols gracefully", () => {
    addToQueue("UNKNOWN");
    expect(getQueue().length).toBe(0);

    addManyToQueue(["AAPL", "UNKNOWN", "MSFT"]);
    expect(getQueue().map(i => i.symbol)).toEqual(["AAPL", "MSFT"]);
  });

  it("empty and whitespace symbols are ignored", () => {
    addToQueue("");
    addToQueue("   ");
    addToQueue("\t\n");
    expect(getQueue().length).toBe(0);
  });
});
