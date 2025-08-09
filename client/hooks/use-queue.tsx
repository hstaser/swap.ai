import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  addToQueue as storeAddToQueue,
  clearQueue as storeClearQueue,
  isInQueue as storeIsInQueue,
  getQueue
} from "../store/queue";

// Legacy interface for backwards compatibility
export interface QueuedStock {
  symbol: string;
  confidence: "conservative" | "bullish" | "very-bullish";
  addedAt: Date;
}

interface QueueContextType {
  queue: QueuedStock[];
  queueItems: QueueItem[]; // New canonical queue items
  queueStocks: Stock[]; // Fully populated stock objects
  addToQueue: (symbol: string, confidence: QueuedStock["confidence"]) => boolean;
  removeFromQueue: (symbol: string) => boolean;
  clearQueue: () => void;
  isInQueue: (symbol: string) => boolean;
  queueSize: number;
  refreshQueue: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Map confidence to sentiment for new store
const mapConfidenceToSentiment = (confidence: QueuedStock["confidence"]): "bullish" | "bearish" => {
  return confidence === "conservative" ? "bearish" : "bullish";
};

// Map sentiment back to confidence for legacy compatibility
const mapSentimentToConfidence = (sentiment: "bullish" | "bearish"): QueuedStock["confidence"] => {
  return sentiment === "bearish" ? "conservative" : "bullish";
};

export function QueueProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<QueuedStock[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [queueStocks, setQueueStocks] = useState<Stock[]>([]);

  // Refresh queue data from store
  const refreshQueue = () => {
    const currentQueue = getQueue();
    const currentStocks = getQueueStocks();

    // Convert to legacy format for backwards compatibility
    const legacyQueue: QueuedStock[] = currentQueue.map(item => ({
      symbol: item.symbol,
      confidence: mapSentimentToConfidence(item.sentiment),
      addedAt: new Date(item.addedAt)
    }));

    setQueueItems(currentQueue);
    setQueueStocks(currentStocks);
    setQueue(legacyQueue);
  };

  // Initialize and set up polling for queue changes
  useEffect(() => {
    refreshQueue();

    // Poll for changes every second (in real app, this would be event-driven)
    const interval = setInterval(refreshQueue, 1000);

    return () => clearInterval(interval);
  }, []);

  const addToQueue = (
    symbol: string,
    confidence: QueuedStock["confidence"] = "bullish"
  ): boolean => {
    const sentiment = mapConfidenceToSentiment(confidence);
    const result = storeAddToQueue(symbol, sentiment, "swipe");

    if (result.success) {
      refreshQueue(); // Update React state
      return true;
    } else {
      console.error("Failed to add to queue:", result.error);
      return false;
    }
  };

  const removeFromQueue = (symbol: string): boolean => {
    const result = storeRemoveFromQueue(symbol);

    if (result.success) {
      refreshQueue(); // Update React state
      return true;
    } else {
      console.error("Failed to remove from queue:", result.error);
      return false;
    }
  };

  const clearQueue = () => {
    storeClearQueue();
    refreshQueue(); // Update React state
  };

  const isInQueue = (symbol: string): boolean => {
    return storeIsInQueue(symbol);
  };

  const queueSize = getQueueSize();

  return (
    <QueueContext.Provider
      value={{
        queue,
        queueItems,
        queueStocks,
        addToQueue,
        removeFromQueue,
        clearQueue,
        isInQueue,
        queueSize,
        refreshQueue,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
