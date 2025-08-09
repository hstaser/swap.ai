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
        expect(getStock(symbol)).toBeTruthy();
        expect(validateStock(symbol).isValid).toBe(true);
      });
    });

    it('should have valid stock data structure', () => {
      Object.values(STOCKS).forEach(stock => {
        expect(stock.id).toBeTruthy();
        expect(stock.symbol).toBeTruthy();
        expect(stock.name).toBeTruthy();
        expect(stock.exchange).toBeTruthy();
      });
    });
  });

  describe('LeBron James Integration', () => {
    it('should handle LeBron mapping when verified', () => {
      expect(isInfluencerVerified('lebron-james')).toBe(true);

      const tickers = getInfluencerTickers('lebron-james');
      expect(Array.isArray(tickers)).toBe(true);
      expect(tickers).toEqual(['NKE', 'PEP', 'AAPL']);
    });
  });

  describe('Queue Operations Integration', () => {
    it('should prevent duplicate additions from multiple sources', () => {
      addToQueue('NKE');
      addToQueue('nke'); // Different case, same stock
      
      expect(getQueue().length).toBe(1);
      expect(isInQueue('NKE')).toBe(true);
    });

    it('should handle case variations correctly', () => {
      const variations = ['aapl', 'AAPL', '  aapl  '];
      
      variations.forEach(variation => {
        addToQueue(variation);
      });
      
      expect(getQueue().length).toBe(1);
      expect(getQueue()[0].symbol).toBe('AAPL');
    });

    it('should reject invalid symbols gracefully', () => {
      addToQueue('INVALID_SYMBOL');
      addToQueue('');
      addToQueue('  ');
      
      expect(getQueue().length).toBe(0);
    });

    it('should maintain queue integrity', () => {
      const testSymbols = ['AAPL', 'MSFT', 'GOOGL'];
      
      testSymbols.forEach(symbol => {
        addToQueue(symbol);
      });
      
      expect(getQueue().length).toBe(testSymbols.length);
      
      testSymbols.forEach(symbol => {
        expect(isInQueue(symbol)).toBe(true);
      });
    });
  });

  describe('Real-world Bug Prevention', () => {
    it('REGRESSION: Should prevent Nike duplication from swipe + LeBron', () => {
      // Simulate user swiping on Nike card
      addToQueue('NKE');
      
      // Simulate user clicking "Add Nike" in LeBron section
      addToQueue('nke');
      
      // Should have only one Nike entry
      expect(getQueue().length).toBe(1);
      expect(getQueue()[0].symbol).toBe('NKE');
      expect(isInQueue('NKE')).toBe(true);
      expect(isInQueue('nke')).toBe(true); // Case insensitive check
    });

    it('REGRESSION: Should handle all catalog stocks in queue operations', () => {
      const testSymbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'AMZN'];
      
      testSymbols.forEach(symbol => {
        addToQueue(symbol);
      });
      
      const queue = getQueue();
      expect(queue.length).toBe(testSymbols.length);
      
      // Every queue item should have a valid stock
      queue.forEach(item => {
        const stock = getStock(item.symbol);
        expect(stock).toBeTruthy();
        expect(stock!.id).toBeTruthy();
        expect(stock!.symbol).toBeTruthy();
        expect(stock!.name).toBeTruthy();
      });
    });

    it('REGRESSION: Should maintain symbol normalization consistency', () => {
      const variations = ['aapl', 'AAPL', 'Aapl', '  aapl  ', '\tAAPL\n'];
      
      variations.forEach(variation => {
        clearQueue();
        addToQueue(variation);
        
        const queue = getQueue();
        expect(queue[0].symbol).toBe('AAPL'); // Always canonical
      });
    });
  });

  describe('Performance and Scale', () => {
    it('should handle adding many stocks efficiently', () => {
      const allSymbols = Object.keys(STOCKS);
      
      const start = performance.now();
      
      allSymbols.forEach(symbol => {
        addToQueue(symbol);
      });
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      expect(getQueue().length).toBe(allSymbols.length);
    });
  });
});

describe('UI Component Integration', () => {
  it('should validate StockCard would only render valid stocks', () => {
    // Simulate what a StockCard component would do
    const testSymbols = ['AAPL', 'INVALID', 'NKE', '', 'MSFT'];
    
    const validStocks = testSymbols
      .map(symbol => getStock(symbol))
      .filter(Boolean);
    
    expect(validStocks.length).toBe(3); // AAPL, NKE, MSFT
    
    validStocks.forEach(stock => {
      expect(stock!.id).toBeTruthy();
      expect(stock!.symbol).toBeTruthy();
      expect(stock!.name).toBeTruthy();
      expect(stock!.exchange).toBeTruthy();
    });
  });
});
