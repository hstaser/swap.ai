// Centralized Queue Store with Stock Validation and Deduplication
// This ensures all queue operations use canonical stock data

import { getStock, validateStock, type Stock } from '../data/stocks.catalog';

export type QueueItem = {
  id: string;           // stock.id from catalog
  symbol: string;       // canonical symbol (uppercase)
  sentiment: 'bullish' | 'bearish';
  addedAt: number;      // timestamp
  source?: 'swipe' | 'lebron' | 'search' | 'manual'; // tracking source
};

export type QueueState = {
  items: QueueItem[];
  lastUpdated: number;
};

// In-memory state (in a real app, this might be Redux/Zustand/etc.)
let queueState: QueueState = {
  items: [],
  lastUpdated: Date.now()
};

// Storage keys
const QUEUE_STORAGE_KEY = 'swipr_queue_v2';
const QUEUE_TELEMETRY_KEY = 'swipr_queue_events';

// Normalization utility
const normalizeSymbol = (symbol: string): string => {
  return symbol.trim().toUpperCase();
};

// Telemetry tracking with proper error monitoring
const trackQueueEvent = (event: string, data: any) => {
  // Deep serialize all objects to prevent [object Object] logging
  const serializedData = JSON.parse(JSON.stringify(data, (key, value) => {
    if (value instanceof Error) {
      return {
        message: value.message,
        name: value.name,
        stack: value.stack
      };
    }
    return value;
  }));

  const eventData = {
    event,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...serializedData
  };

  console.log('[Queue Telemetry]', eventData);

  // In a real app, send to analytics service
  // For now, store locally for monitoring dashboard
  try {
    const existingEvents = JSON.parse(localStorage.getItem(QUEUE_TELEMETRY_KEY) || '[]');
    existingEvents.push(eventData);

    // Keep only last 100 events
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100);
    }

    localStorage.setItem(QUEUE_TELEMETRY_KEY, JSON.stringify(existingEvents));

    // Send critical errors to external monitoring (would be actual service)
    if (event.includes('error') || event.includes('failed')) {
      const errorMessage = serializedData.error || 'Unknown error';
      console.error(`[Queue Error] ${event}:`, {
        ...serializedData,
        error: errorMessage
      });

      // In production, alert on symbol validation failures
      if (event === 'queue_add_failed' && errorMessage.includes && errorMessage.includes('Unknown symbol')) {
        console.error(`🚨 ALERT: Unknown symbol attempted: ${serializedData.symbol}. Catalog may be incomplete.`);
      }
    }

  } catch (error) {
    console.error('Failed to store telemetry:', error);
  }
};

// Monitoring dashboard data
export const getTelemetryEvents = () => {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_TELEMETRY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getTelemetryMetrics = () => {
  const events = getTelemetryEvents();

  const totalEvents = events.length;
  const errorEvents = events.filter((e: any) => e.event.includes('error') || e.event.includes('failed'));
  const successEvents = events.filter((e: any) => e.event.includes('success'));

  const symbolMismatches = events.filter((e: any) =>
    e.event === 'queue_add_failed' && e.error?.includes('Unknown symbol')
  );

  return {
    totalEvents,
    errorEvents: errorEvents.length,
    successEvents: successEvents.length,
    errorRate: totalEvents > 0 ? (errorEvents.length / totalEvents * 100) : 0,
    symbolMismatchCount: symbolMismatches.length,
    lastHour: events.filter((e: any) =>
      Date.now() - e.timestamp < 3600000
    ).length
  };
};

// Load queue from storage
const loadQueue = (): QueueState => {
  try {
    const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Validate stored items against current catalog
      const validItems = parsed.items.filter((item: any) => {
        const isValid = getStock(item.symbol) !== null;
        if (!isValid) {
          console.warn(`Removing invalid queue item: ${item.symbol}`);
          trackQueueEvent('queue_item_invalid', { symbol: item.symbol, reason: 'not_in_catalog' });
        }
        return isValid;
      });

      return {
        items: validItems,
        lastUpdated: parsed.lastUpdated || Date.now()
      };
    }
  } catch (error) {
    console.error('Failed to load queue from storage:', error);
    trackQueueEvent('queue_load_error', { error: error.message });
  }

  return { items: [], lastUpdated: Date.now() };
};

// Persist queue to storage
const persistQueue = (items: QueueItem[]) => {
  try {
    const stateToSave = {
      items,
      lastUpdated: Date.now()
    };

    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(stateToSave));
    queueState.lastUpdated = stateToSave.lastUpdated;
  } catch (error) {
    console.error('Failed to persist queue:', error);
    trackQueueEvent('queue_persist_error', { error: error.message });
  }
};

// Initialize queue state
queueState = loadQueue();

// Core queue operations
export const addToQueue = (
  symbolRaw: string,
  sentiment: 'bullish' | 'bearish' = 'bullish',
  source: QueueItem['source'] = 'manual'
): { success: boolean; error?: string; item?: QueueItem } => {
  try {
    const symbol = normalizeSymbol(symbolRaw);

    // Validate symbol exists in catalog
    const validation = validateStock(symbol);
    if (!validation.isValid) {
      const error = validation.error || `Unknown symbol: ${symbol}`;
      trackQueueEvent('queue_add_failed', {
        symbol: symbolRaw,
        normalizedSymbol: symbol,
        error,
        source
      });
      throw new Error(error);
    }

    const stock = getStock(symbol)!;

    // Check for duplicates
    const existingIndex = queueState.items.findIndex(item => item.symbol === stock.symbol);
    if (existingIndex !== -1) {
      trackQueueEvent('queue_add_duplicate', {
        symbol: stock.symbol,
        source,
        existingItem: queueState.items[existingIndex]
      });
      return { success: true, item: queueState.items[existingIndex] }; // Return existing item, no error
    }

    // Create new queue item
    const newItem: QueueItem = {
      id: stock.id,
      symbol: stock.symbol,
      sentiment,
      addedAt: Date.now(),
      source
    };

    // Add to queue
    queueState.items.push(newItem);
    persistQueue(queueState.items);

    trackQueueEvent('queue_add_success', {
      symbol: stock.symbol,
      id: stock.id,
      sentiment,
      source,
      queueSize: queueState.items.length
    });

    return { success: true, item: newItem };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    trackQueueEvent('queue_add_error', {
      symbol: symbolRaw,
      error: errorMessage,
      source
    });
    return { success: false, error: errorMessage };
  }
};

export const removeFromQueue = (symbol: string): { success: boolean; error?: string } => {
  try {
    const normalizedSymbol = normalizeSymbol(symbol);
    const initialLength = queueState.items.length;

    queueState.items = queueState.items.filter(item => item.symbol !== normalizedSymbol);

    if (queueState.items.length < initialLength) {
      persistQueue(queueState.items);
      trackQueueEvent('queue_remove_success', {
        symbol: normalizedSymbol,
        queueSize: queueState.items.length
      });
      return { success: true };
    } else {
      trackQueueEvent('queue_remove_notfound', { symbol: normalizedSymbol });
      return { success: false, error: `Item not found in queue: ${normalizedSymbol}` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    trackQueueEvent('queue_remove_error', { symbol, error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const clearQueue = (): void => {
  const previousSize = queueState.items.length;
  queueState.items = [];
  persistQueue([]);

  trackQueueEvent('queue_clear', { previousSize });
};

export const isInQueue = (symbol: string): boolean => {
  const normalizedSymbol = normalizeSymbol(symbol);
  return queueState.items.some(item => item.symbol === normalizedSymbol);
};

export const getQueue = (): QueueItem[] => {
  return [...queueState.items]; // Return copy to prevent mutation
};

export const getQueueStocks = (): Stock[] => {
  return queueState.items
    .map(item => getStock(item.symbol))
    .filter(stock => stock !== null) as Stock[];
};

export const getQueueSize = (): number => {
  return queueState.items.length;
};

// Advanced operations
export const updateQueueItemSentiment = (symbol: string, sentiment: 'bullish' | 'bearish'): boolean => {
  const normalizedSymbol = normalizeSymbol(symbol);
  const item = queueState.items.find(item => item.symbol === normalizedSymbol);

  if (item) {
    item.sentiment = sentiment;
    persistQueue(queueState.items);
    trackQueueEvent('queue_sentiment_update', { symbol: normalizedSymbol, sentiment });
    return true;
  }

  return false;
};

export const reorderQueue = (fromIndex: number, toIndex: number): boolean => {
  if (fromIndex < 0 || fromIndex >= queueState.items.length ||
      toIndex < 0 || toIndex >= queueState.items.length) {
    return false;
  }

  const [movedItem] = queueState.items.splice(fromIndex, 1);
  queueState.items.splice(toIndex, 0, movedItem);
  persistQueue(queueState.items);

  trackQueueEvent('queue_reorder', { fromIndex, toIndex });
  return true;
};

// Monitoring and debugging
export const getQueueMetrics = () => {
  const sourceBreakdown = queueState.items.reduce((acc, item) => {
    const source = item.source || 'unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentBreakdown = queueState.items.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalItems: queueState.items.length,
    sourceBreakdown,
    sentimentBreakdown,
    lastUpdated: queueState.lastUpdated,
    oldestItem: queueState.items.length > 0 ? Math.min(...queueState.items.map(i => i.addedAt)) : null,
    newestItem: queueState.items.length > 0 ? Math.max(...queueState.items.map(i => i.addedAt)) : null
  };
};

export const validateQueueIntegrity = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  queueState.items.forEach((item, index) => {
    // Check if stock exists in catalog
    if (!getStock(item.symbol)) {
      errors.push(`Queue item ${index}: Invalid symbol ${item.symbol}`);
    }

    // Check required fields
    if (!item.id) {
      errors.push(`Queue item ${index}: Missing id`);
    }

    if (!item.symbol) {
      errors.push(`Queue item ${index}: Missing symbol`);
    }

    if (!item.addedAt || item.addedAt <= 0) {
      errors.push(`Queue item ${index}: Invalid addedAt timestamp`);
    }
  });

  // Check for duplicates
  const symbols = queueState.items.map(item => item.symbol);
  const uniqueSymbols = new Set(symbols);
  if (symbols.length !== uniqueSymbols.size) {
    errors.push('Queue contains duplicate symbols');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export current state for debugging
export const debugQueue = () => {
  return {
    state: queueState,
    metrics: getQueueMetrics(),
    integrity: validateQueueIntegrity()
  };
};
