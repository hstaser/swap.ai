import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  addToQueue as storeAddToQueue,
  removeFromQueue as storeRemoveFromQueue,
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
    storeAddToQueue(symbol);
    refreshQueue(); // Update React state
  };

  const removeFromQueue = (symbol: string) => {
    storeRemoveFromQueue(symbol);
    refreshQueue(); // Update React state
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
