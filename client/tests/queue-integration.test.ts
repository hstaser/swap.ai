// Integration Tests for Queue System
// Run these tests to validate the complete queue flow works as expected

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getInfluencerTickers, isInfluencerVerified } from '../data/influencer.map';
import { getStock, validateStock, getAllStocks, STOCKS } from '../data/stocks.catalog';
import { addToQueue, clearQueue, isInQueue, getQueue } from '../store/queue';

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

describe('Queue Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    clearQueue();
  });

  describe('Stock Catalog Integration', () => {
    it('should have all required stocks in catalog', () => {
      const requiredStocks = ['AAPL', 'NKE', 'PEP', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'AMZN', 'COIN', 'MU'];

      requiredStocks.forEach(symbol => {
        expect(hasStock(symbol)).toBe(true);
        expect(getStock(symbol)).toBeTruthy();
        expect(validateStock(symbol).isValid).toBe(true);
      });
    });

    it('should have valid stock data structure', () => {
      Object.values(STOCKS).forEach(stock => {
        expect(stock.id).toBeTruthy();
        expect(stock.symbol).toBeTruthy();
        expect(stock.name).toBeTruthy();
        expect(typeof stock.price).toBe('number');
        expect(stock.price).toBeGreaterThan(0);
        expect(stock.sector).toBeTruthy();
        expect(stock.exchange).toBeTruthy();
      });
    });
  });

  describe('LeBron James Integration', () => {
    it('should handle LeBron mapping safely when not verified', () => {
      // LeBron mapping should not be verified yet (requires PM/Legal approval)
      expect(isInfluencerVerified('lebron-james')).toBe(false);

      // Should return empty array for unverified mappings in production
      const tickers = getInfluencerTickers('lebron-james');
      expect(Array.isArray(tickers)).toBe(true);
      expect(tickers.length).toBe(0); // Should be empty since not verified
    });
  });

  describe('Queue Operations Integration', () => {
    it('should prevent duplicate additions from multiple sources', () => {
      // Add Nike from swipe
      const result1 = addToQueue('NKE', 'bullish', 'swipe');
      expect(result1.success).toBe(true);

      // Try to add Nike from LeBron section (different source, same stock)
      const result2 = addToQueue('nke', 'bullish', 'lebron');
      expect(result2.success).toBe(true); // No error, but no duplicate

      // Should have only one Nike entry
      expect(getQueue().length).toBe(1);
      expect(isInQueue('NKE')).toBe(true);
    });

    it('should handle case variations correctly', () => {
      const variations = ['aapl', 'AAPL', 'Aapl', '  aapl  '];

      variations.forEach(variation => {
        addToQueue(variation, 'bullish');
      });

      // Should have only one Apple entry
      expect(getQueue().length).toBe(1);
      expect(getQueue()[0].symbol).toBe('AAPL');
    });

    it('should reject invalid symbols gracefully', () => {
      const invalidSymbols = ['ZZZZ', 'FAKE', '', '   ', 'LEBRON123'];

      invalidSymbols.forEach(symbol => {
        const result = addToQueue(symbol, 'bullish');
        expect(result.success).toBe(false);
        expect(result.error).toBeTruthy();
      });

      expect(getQueue().length).toBe(0);
    });

    it('should maintain queue integrity', () => {
      // Add some valid stocks
      addToQueue('AAPL', 'bullish', 'swipe');
      addToQueue('NKE', 'bearish', 'lebron');
      addToQueue('PEP', 'bullish', 'manual');

      const integrity = validateQueueIntegrity();
      expect(integrity.isValid).toBe(true);
      expect(integrity.errors).toEqual([]);
    });
  });

  describe('Real-world Bug Prevention', () => {
    it('REGRESSION: Should prevent Nike duplication from swipe + LeBron', () => {
      // User swipes right on Nike
      addToQueue('NKE', 'bullish', 'swipe');
      expect(getQueue().length).toBe(1);

      // User clicks "Add Nike" in LeBron section
      addToQueue('NKE', 'bullish', 'lebron');
      expect(getQueue().length).toBe(1); // Still only one entry

      const queue = getQueue();
      expect(queue[0].symbol).toBe('NKE');
      expect(queue[0].id).toBe('stk_nke');
    });

    it('REGRESSION: Should handle all catalog stocks in queue operations', () => {
      const allSymbols = Object.keys(STOCKS);

      // Add all stocks to queue
      allSymbols.forEach(symbol => {
        const result = addToQueue(symbol, 'bullish');
        expect(result.success).toBe(true);
      });

      expect(getQueue().length).toBe(allSymbols.length);

      // Verify all have valid stock data
      const integrity = validateQueueIntegrity();
      expect(integrity.isValid).toBe(true);
    });

    it('REGRESSION: Should maintain symbol normalization consistency', () => {
      // Test various input formats
      const testCases = [
        { input: 'aapl', expected: 'AAPL' },
        { input: 'AAPL', expected: 'AAPL' },
        { input: '  aapl  ', expected: 'AAPL' },
        { input: '\tAAPL\n', expected: 'AAPL' },
        { input: 'NkE', expected: 'NKE' },
      ];

      testCases.forEach(({ input, expected }) => {
        clearQueue();
        const result = addToQueue(input, 'bullish');
        expect(result.success).toBe(true);
        expect(getQueue()[0].symbol).toBe(expected);
      });
    });
  });

  describe('Performance and Scale', () => {
    it('should handle adding many stocks efficiently', () => {
      const start = performance.now();

      // Add all available stocks
      Object.keys(STOCKS).forEach(symbol => {
        addToQueue(symbol, 'bullish');
      });

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(100); // 100ms
      expect(getQueue().length).toBe(Object.keys(STOCKS).length);
    });
  });
});

describe('UI Component Integration', () => {
  it('should validate StockCard would only render valid stocks', () => {
    const validStock = getStock('AAPL');
    const invalidStock = { symbol: 'FAKE123', name: 'Fake Company' };

    expect(validStock).toBeTruthy();
    expect(getStock('FAKE123')).toBeNull();

    // StockCard should only render if stock exists in catalog
    // (This would be tested with actual component rendering in real tests)
  });
});
