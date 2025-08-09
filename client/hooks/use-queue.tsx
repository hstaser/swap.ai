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
  addToQueue: (symbol: string, confidence: QueuedStock["confidence"]) => void;
  removeFromQueue: (symbol: string) => void;
  clearQueue: () => void;
  isInQueue: (symbol: string) => boolean;
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

  // Refresh queue data from store
  const refreshQueue = () => {
    const currentQueue = getQueue();

    // Convert to legacy format for backwards compatibility
    const legacyQueue: QueuedStock[] = currentQueue.map(item => ({
      symbol: item.symbol,
      confidence: "bullish" as const, // Simple mapping
      addedAt: new Date(item.addedAt)
    }));

    setQueue(legacyQueue);
  };

  // Initialize and refresh on mount
  useEffect(() => {
    refreshQueue();
  }, []);

  const addToQueue = (
    symbol: string,
    confidence: QueuedStock["confidence"] = "bullish"
  ) => {
    storeAddToQueue(symbol, "swipe");
    refreshQueue(); // Update React state
  };

  const removeFromQueue = (symbol: string) => {
    // Note: Remove functionality would need to be added to store
    console.log("Remove from queue:", symbol);
    refreshQueue();
  };

  const clearQueue = () => {
    storeClearQueue();
    refreshQueue(); // Update React state
  };

  const isInQueue = (symbol: string): boolean => {
    return storeIsInQueue(symbol);
  };

  return (
    <QueueContext.Provider
      value={{
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        isInQueue,
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
