import { createContext, useContext, useState, ReactNode } from "react";

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

  const addToQueue = (
    symbol: string,
    confidence: QueuedStock["confidence"],
  ) => {
    // Don't add duplicates
    if (!queue.find((item) => item.symbol === symbol)) {
      setQueue((prev) => [
        ...prev,
        { symbol, confidence, addedAt: new Date() },
      ]);
    }
  };

  const removeFromQueue = (symbol: string) => {
    setQueue((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const isInQueue = (symbol: string) => {
    return queue.some((item) => item.symbol === symbol);
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
