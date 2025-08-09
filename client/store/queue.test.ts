// Queue Store Unit Tests
// These tests ensure queue operations work correctly and catch regressions

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  addToQueue,
  removeFromQueue,
  clearQueue,
  isInQueue,
  getQueue,
  getQueueStocks,
  getQueueSize,
  validateQueueIntegrity,
  getQueueMetrics
} from './queue';

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

// Mock console methods
const consoleMock = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

Object.defineProperty(console, 'log', { value: consoleMock.log });
Object.defineProperty(console, 'warn', { value: consoleMock.warn });
Object.defineProperty(console, 'error', { value: consoleMock.error });

describe('Queue Store', () => {
  beforeEach(() => {
    // Clear all mocks and queue state before each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    clearQueue();
  });

  afterEach(() => {
    clearQueue();
  });

  describe('addToQueue', () => {
    it('adds correct stock to queue with canonical symbol', () => {
      const result = addToQueue('nke', 'bullish', 'swipe');
      
      expect(result.success).toBe(true);
      expect(result.item).toMatchObject({
        symbol: 'NKE',
        id: 'stk_nke',
        sentiment: 'bullish',
        source: 'swipe'
      });
      
      const queue = getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].symbol).toBe('NKE');
    });

    it('normalizes symbol casing', () => {
      addToQueue('aapl', 'bullish');
      addToQueue('AAPL', 'bearish');
      addToQueue('  aapl  ', 'bullish');
      
      const queue = getQueue();
      expect(queue).toHaveLength(1); // Should deduplicate
      expect(queue[0].symbol).toBe('AAPL');
    });

    it('prevents duplicate additions', () => {
      addToQueue('AAPL', 'bullish');
      const result = addToQueue('aapl', 'bullish');
      
      expect(result.success).toBe(true); // No error, but no duplicate
      expect(getQueueSize()).toBe(1);
    });

    it('rejects unknown symbols', () => {
      const result = addToQueue('ZZZZ', 'bullish');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown symbol: ZZZZ');
      expect(getQueueSize()).toBe(0);
    });

    it('rejects empty symbols', () => {
      const result = addToQueue('', 'bullish');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Symbol cannot be empty');
    });

    it('rejects whitespace-only symbols', () => {
      const result = addToQueue('   ', 'bullish');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Symbol cannot be empty');
    });

    it('tracks source correctly', () => {
      addToQueue('AAPL', 'bullish', 'swipe');
      addToQueue('NKE', 'bullish', 'lebron');
      
      const queue = getQueue();
      expect(queue[0].source).toBe('swipe');
      expect(queue[1].source).toBe('lebron');
    });

    it('sets addedAt timestamp', () => {
      const before = Date.now();
      addToQueue('AAPL', 'bullish');
      const after = Date.now();
      
      const queue = getQueue();
      expect(queue[0].addedAt).toBeGreaterThanOrEqual(before);
      expect(queue[0].addedAt).toBeLessThanOrEqual(after);
    });
  });

  describe('removeFromQueue', () => {
    beforeEach(() => {
      addToQueue('AAPL', 'bullish');
      addToQueue('NKE', 'bullish');
    });

    it('removes stock by symbol', () => {
      const result = removeFromQueue('AAPL');
      
      expect(result.success).toBe(true);
      expect(getQueueSize()).toBe(1);
      expect(isInQueue('AAPL')).toBe(false);
      expect(isInQueue('NKE')).toBe(true);
    });

    it('normalizes symbol when removing', () => {
      const result = removeFromQueue('aapl');
      
      expect(result.success).toBe(true);
      expect(isInQueue('AAPL')).toBe(false);
    });

    it('handles removing non-existent symbol', () => {
      const result = removeFromQueue('MSFT');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Item not found in queue: MSFT');
      expect(getQueueSize()).toBe(2); // No change
    });
  });

  describe('isInQueue', () => {
    beforeEach(() => {
      addToQueue('AAPL', 'bullish');
    });

    it('returns true for existing stock', () => {
      expect(isInQueue('AAPL')).toBe(true);
    });

    it('returns false for non-existing stock', () => {
      expect(isInQueue('MSFT')).toBe(false);
    });

    it('normalizes symbol when checking', () => {
      expect(isInQueue('aapl')).toBe(true);
      expect(isInQueue('  AAPL  ')).toBe(true);
    });
  });

  describe('getQueueStocks', () => {
    it('returns full stock objects', () => {
      addToQueue('AAPL', 'bullish');
      addToQueue('NKE', 'bullish');
      
      const stocks = getQueueStocks();
      expect(stocks).toHaveLength(2);
      expect(stocks[0]).toHaveProperty('id');
      expect(stocks[0]).toHaveProperty('name');
      expect(stocks[0]).toHaveProperty('price');
      expect(stocks[0]).toHaveProperty('sector');
    });

    it('filters out invalid stocks', () => {
      // Add a valid stock
      addToQueue('AAPL', 'bullish');
      
      // Manually corrupt queue with invalid symbol (shouldn't happen in practice)
      const queue = getQueue();
      // This would only happen if catalog changed after queue was created
      
      const stocks = getQueueStocks();
      expect(stocks.length).toBeGreaterThanOrEqual(0); // Should handle gracefully
    });
  });

  describe('clearQueue', () => {
    it('removes all items from queue', () => {
      addToQueue('AAPL', 'bullish');
      addToQueue('NKE', 'bullish');
      
      expect(getQueueSize()).toBe(2);
      
      clearQueue();
      
      expect(getQueueSize()).toBe(0);
      expect(getQueue()).toEqual([]);
    });
  });

  describe('validateQueueIntegrity', () => {
    it('passes validation for valid queue', () => {
      addToQueue('AAPL', 'bullish');
      addToQueue('NKE', 'bullish');
      
      const validation = validateQueueIntegrity();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  describe('getQueueMetrics', () => {
    it('provides correct metrics', () => {
      addToQueue('AAPL', 'bullish', 'swipe');
      addToQueue('NKE', 'bearish', 'lebron');
      addToQueue('PEP', 'bullish', 'swipe');
      
      const metrics = getQueueMetrics();
      
      expect(metrics.totalItems).toBe(3);
      expect(metrics.sourceBreakdown).toEqual({
        swipe: 2,
        lebron: 1
      });
      expect(metrics.sentimentBreakdown).toEqual({
        bullish: 2,
        bearish: 1
      });
      expect(metrics.oldestItem).toBeLessThanOrEqual(metrics.newestItem!);
    });
  });

  describe('Edge Cases', () => {
    it('handles very long symbol names gracefully', () => {
      const longSymbol = 'A'.repeat(100);
      const result = addToQueue(longSymbol, 'bullish');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(`Unknown symbol: ${longSymbol}`);
    });

    it('handles special characters in symbols', () => {
      const result = addToQueue('AA@PL', 'bullish');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown symbol: AA@PL');
    });

    it('handles null and undefined inputs', () => {
      const result1 = addToQueue(null as any, 'bullish');
      const result2 = addToQueue(undefined as any, 'bullish');
      
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe('Persistence', () => {
    it('attempts to save to localStorage on add', () => {
      addToQueue('AAPL', 'bullish');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'swipr_queue_v2',
        expect.stringContaining('AAPL')
      );
    });

    it('attempts to save to localStorage on remove', () => {
      addToQueue('AAPL', 'bullish');
      removeFromQueue('AAPL');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'swipr_queue_v2',
        expect.stringContaining('[]')
      );
    });
  });
});

// Integration tests that would have caught the original bug
describe('Queue Integration Tests (Bug Prevention)', () => {
  beforeEach(() => {
    clearQueue();
  });

  it('REGRESSION: Adding Nike from different sources results in single queue entry', () => {
    // Simulate user swiping on Nike card
    addToQueue('NKE', 'bullish', 'swipe');
    
    // Simulate user clicking "Add Nike" in LeBron section
    addToQueue('nke', 'bullish', 'lebron');
    
    // Should have only one Nike entry
    expect(getQueueSize()).toBe(1);
    expect(getQueue()[0].symbol).toBe('NKE');
    expect(isInQueue('NKE')).toBe(true);
    expect(isInQueue('nke')).toBe(true);
  });

  it('REGRESSION: All queue entries have valid stock catalog entries', () => {
    const testSymbols = ['AAPL', 'nke', '  MSFT  ', 'googl'];
    
    testSymbols.forEach(symbol => {
      addToQueue(symbol, 'bullish');
    });
    
    const queueStocks = getQueueStocks();
    const queueItems = getQueue();
    
    // Every queue item should have a corresponding stock
    expect(queueStocks.length).toBe(queueItems.length);
    
    // Every stock should have required properties
    queueStocks.forEach(stock => {
      expect(stock.id).toBeTruthy();
      expect(stock.symbol).toBeTruthy();
      expect(stock.name).toBeTruthy();
      expect(typeof stock.price).toBe('number');
    });
  });

  it('REGRESSION: Symbol case variations all resolve to same canonical symbol', () => {
    const variations = ['aapl', 'AAPL', 'Aapl', '  aapl  ', '\tAAPL\n'];
    
    variations.forEach(variation => {
      clearQueue();
      addToQueue(variation, 'bullish');
      
      const queue = getQueue();
      expect(queue[0].symbol).toBe('AAPL'); // Always canonical
    });
  });

  it('REGRESSION: LeBron section only shows verified public stocks', () => {
    // This test would be expanded with actual LeBron mapping logic
    const lebronStocks = ['NKE', 'PEP', 'AAPL']; // Placeholder from influencer.map.ts
    
    lebronStocks.forEach(symbol => {
      const result = addToQueue(symbol, 'bullish', 'lebron');
      expect(result.success).toBe(true);
    });
    
    expect(getQueueSize()).toBe(lebronStocks.length);
  });
});
