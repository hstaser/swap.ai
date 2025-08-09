import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToQueue, addManyToQueue, getQueue, clearQueue } from '../store/queue';
import { getInfluencerStocks } from '../data/influencer.map';

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

describe('Live Queue Integration', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    clearQueue();
  });

  it('LeBron section stocks should have price data', () => {
    const stocks = getInfluencerStocks('lebron-james');
    
    expect(stocks.length).toBeGreaterThan(0);
    
    stocks.forEach(stock => {
      expect(stock).toBeTruthy();
      expect(stock!.symbol).toBeTruthy();
      expect(stock!.name).toBeTruthy();
      expect(stock!.price).toBeDefined();
      expect(typeof stock!.price).toBe('number');
      expect(stock!.price).toBeGreaterThan(0);
      expect(stock!.changePercent).toBeDefined();
      expect(typeof stock!.changePercent).toBe('number');
    });
  });

  it('Add to Queue should work for LeBron stocks', () => {
    const stocks = getInfluencerStocks('lebron-james');
    
    // Add all LeBron stocks to queue
    stocks.forEach(stock => {
      addToQueue(stock!.symbol);
    });
    
    const queue = getQueue();
    expect(queue.length).toBe(stocks.length);
    
    // Verify all symbols are in queue
    stocks.forEach(stock => {
      expect(queue.some(item => item.symbol === stock!.symbol)).toBe(true);
    });
  });

  it('Add Many to Queue should work (Pelosi functionality)', () => {
    const testSymbols = ['NVDA', 'MSFT', 'AAPL'];
    
    addManyToQueue(testSymbols);
    
    const queue = getQueue();
    expect(queue.length).toBe(testSymbols.length);
    
    testSymbols.forEach(symbol => {
      expect(queue.some(item => item.symbol === symbol)).toBe(true);
    });
  });

  it('Queue operations should be additive (no replacement)', () => {
    // Add first batch
    addToQueue('AAPL');
    expect(getQueue().length).toBe(1);
    
    // Add second batch via addManyToQueue
    addManyToQueue(['MSFT', 'GOOGL']);
    expect(getQueue().length).toBe(3);
    
    // Try to add duplicate
    addToQueue('AAPL');
    expect(getQueue().length).toBe(3); // Should not increase
    
    const queue = getQueue();
    expect(queue.map(item => item.symbol)).toEqual(['AAPL', 'MSFT', 'GOOGL']);
  });
});
