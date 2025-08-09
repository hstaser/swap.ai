import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToQueue, getQueue, clearQueue } from '../store/queue';
import { getStock, resolveSymbol } from '../data/stocks.catalog';
import { extendedStockDatabase } from '../data/extended-stocks';

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

describe('F Symbol Queue Test', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    clearQueue();
  });

  it('should find F in simplified catalog', () => {
    const stock = getStock('F');
    expect(stock).toBeTruthy();
    expect(stock?.symbol).toBe('F');
    expect(stock?.name).toBe('Ford Motor Company');
  });

  it('should find F in extended database', () => {
    const stock = extendedStockDatabase.find(s => s.symbol === 'F');
    expect(stock).toBeTruthy();
    expect(stock?.symbol).toBe('F');
    expect(stock?.name).toBe('Ford Motor Company');
    expect(stock?.price).toBe(12.34);
  });

  it('should resolve F symbol correctly', () => {
    const resolved = resolveSymbol('F');
    expect(resolved).toBe('F');
  });

  it('should add F to queue successfully', () => {
    addToQueue('F');
    const queue = getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].symbol).toBe('F');
  });

  it('should handle case variations of F', () => {
    addToQueue('f');
    const queue = getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].symbol).toBe('F');
  });
});
