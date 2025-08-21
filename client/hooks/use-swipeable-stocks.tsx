import { useState, useEffect, useCallback } from "react";
import {
  getSwipeableStocks,
  recordSwipe,
  getUserPortfolio,
  type SwipeableStock,
  type SwipeAction,
  type SwipeFilters,
} from "@/services/swipe-api";

interface UseSwipeableStocksOptions {
  filters?: SwipeFilters;
  preloadCount?: number;
}

interface UseSwipeableStocksReturn {
  currentStock: SwipeableStock | null;
  isLoading: boolean;
  error: string | null;
  portfolio: string[];
  swipeLeft: () => Promise<void>;
  swipeRight: (
    confidence?: "conservative" | "bullish" | "very-bullish",
  ) => Promise<void>;
  saveForLater: () => Promise<void>;
  refreshStocks: () => Promise<void>;
  updateFilters: (newFilters: SwipeFilters) => void;
  hasMoreStocks: boolean;
}

export function useSwipeableStocks(
  options: UseSwipeableStocksOptions = {},
): UseSwipeableStocksReturn {
  const { filters = {}, preloadCount = 3 } = options;

  const [stockQueue, setStockQueue] = useState<SwipeableStock[]>([]);
  const [currentStock, setCurrentStock] = useState<SwipeableStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SwipeFilters>(filters);

  // Load user's portfolio
  const loadPortfolio = useCallback(async () => {
    try {
      const userPortfolio = await getUserPortfolio();
      setPortfolio(userPortfolio);
    } catch (err) {
      console.warn("Failed to load portfolio:", err);
    }
  }, []);

  // Load next batch of stocks
  const loadNextStocks = useCallback(
    async (filterOverride?: SwipeFilters) => {
      try {
        setIsLoading(true);
        setError(null);

        const activeFilters = filterOverride || currentFilters;
        const stocks = await getSwipeableStocks(activeFilters, preloadCount);

        if (stocks.length === 0) {
          setError("No more stocks available with current filters");
          return;
        }

        // Add to queue and set current if needed
        setStockQueue((prev) => {
          const newQueue = [...prev, ...stocks];
          return newQueue;
        });

        // Set current stock if none exists
        if (!currentStock && stocks.length > 0) {
          setCurrentStock(stocks[0]);
        }
      } catch (err) {
        console.error("Failed to load stocks:", err);
        setError(err instanceof Error ? err.message : "Failed to load stocks");
      } finally {
        setIsLoading(false);
      }
    },
    [currentFilters, preloadCount, currentStock],
  );

  // Record swipe action and move to next stock
  const handleSwipeAction = useCallback(
    async (
      action: "left" | "right" | "save",
      confidence?: "conservative" | "bullish" | "very-bullish",
    ) => {
      if (!currentStock) return;

      try {
        // Record the swipe
        const swipeAction: SwipeAction = {
          symbol: currentStock.symbol,
          action,
          timestamp: new Date(),
          confidence,
        };

        await recordSwipe(swipeAction);

        // Move to next stock
        const nextStockIndex =
          stockQueue.findIndex((s) => s.symbol === currentStock.symbol) + 1;

        if (nextStockIndex < stockQueue.length) {
          // Use next stock from queue
          setCurrentStock(stockQueue[nextStockIndex]);
        } else {
          // Queue is empty, load more stocks
          setCurrentStock(null);
          await loadNextStocks();
        }

        // Remove current stock from queue
        setStockQueue((prev) =>
          prev.filter((s) => s.symbol !== currentStock.symbol),
        );
      } catch (err) {
        console.error("Failed to record swipe:", err);
        setError("Failed to record swipe action");
      }
    },
    [currentStock, stockQueue, loadNextStocks],
  );

  // Public swipe methods
  const swipeLeft = useCallback(
    () => handleSwipeAction("left"),
    [handleSwipeAction],
  );
  const swipeRight = useCallback(
    (confidence?: "conservative" | "bullish" | "very-bullish") =>
      handleSwipeAction("right", confidence),
    [handleSwipeAction],
  );
  const saveForLater = useCallback(
    () => handleSwipeAction("save"),
    [handleSwipeAction],
  );

  // Refresh stocks (reload with current filters)
  const refreshStocks = useCallback(async () => {
    setStockQueue([]);
    setCurrentStock(null);
    await loadNextStocks();
  }, [loadNextStocks]);

  // Update filters and reload stocks
  const updateFilters = useCallback(
    (newFilters: SwipeFilters) => {
      setCurrentFilters(newFilters);
      setStockQueue([]);
      setCurrentStock(null);
      loadNextStocks(newFilters);
    },
    [loadNextStocks],
  );

  // Initial load
  useEffect(() => {
    loadPortfolio();
    loadNextStocks();
  }, [loadPortfolio, loadNextStocks]);

  // Auto-load more stocks when queue is low
  useEffect(() => {
    if (stockQueue.length <= 1 && !isLoading && !error) {
      loadNextStocks();
    }
  }, [stockQueue.length, isLoading, error, loadNextStocks]);

  return {
    currentStock,
    isLoading,
    error,
    portfolio,
    swipeLeft,
    swipeRight,
    saveForLater,
    refreshStocks,
    updateFilters,
    hasMoreStocks: stockQueue.length > 0 || !error,
  };
}
