import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToQueue, removeFromQueue, getQueue, clearQueue } from '../store/queue';

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

describe('Queue Remove Functionality', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    clearQueue();
  });

  it('should remove specific stock from queue', () => {
    // Add multiple stocks
    addToQueue('AAPL');
    addToQueue('MSFT');
    addToQueue('GOOGL');
    
    expect(getQueue().length).toBe(3);
    expect(getQueue().map(i => i.symbol)).toEqual(['AAPL', 'MSFT', 'GOOGL']);
    
    // Remove one stock
    removeFromQueue('MSFT');
    
    expect(getQueue().length).toBe(2);
    expect(getQueue().map(i => i.symbol)).toEqual(['AAPL', 'GOOGL']);
  });

  it('should handle removing non-existent stock gracefully', () => {
    addToQueue('AAPL');
    expect(getQueue().length).toBe(1);
    
    // Try to remove stock that's not in queue
    removeFromQueue('UNKNOWN');
    
    expect(getQueue().length).toBe(1);
    expect(getQueue()[0].symbol).toBe('AAPL');
  });

  it('should handle case-insensitive removal', () => {
    addToQueue('AAPL');
    expect(getQueue().length).toBe(1);
    
    // Remove using different case
    removeFromQueue('aapl');
    
    expect(getQueue().length).toBe(0);
  });

  it('should handle BRK.B alias removal', () => {
    addToQueue('BRKB');
    expect(getQueue().length).toBe(1);
    expect(getQueue()[0].symbol).toBe('BRK.B');
    
    // Remove using different alias
    removeFromQueue('BRK-B');
    
    expect(getQueue().length).toBe(0);
  });
});
