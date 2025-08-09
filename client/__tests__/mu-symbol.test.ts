import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToQueue, getQueue, clearQueue } from '../store/queue';
import { getStock, resolveSymbol } from '../data/stocks.catalog';

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

describe('MU Symbol Test', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    clearQueue();
  });

  it('should find MU in catalog and return true when adding to queue', () => {
    const stock = getStock('MU');
    expect(stock).toBeTruthy();
    expect(stock?.symbol).toBe('MU');
    
    const resolved = resolveSymbol('MU');
    expect(resolved).toBe('MU');
    
    const result = addToQueue('MU');
    expect(result).toBe(true);
    
    const queue = getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].symbol).toBe('MU');
  });
});
