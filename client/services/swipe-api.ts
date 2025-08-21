/**
 * Swipe API Service
 * Handles communication with the new backend endpoints for stock swiping
 */

export interface SwipeableStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  marketCap: string;
  pe: number | null;
  dividendYield: number | null;
  volume: string;
  isGainer: boolean;
  risk?: "Low" | "Medium" | "High";
  alreadyOwned?: boolean; // NEW: Indicates if user already owns this stock
  priorityScore?: number; // NEW: Backend-calculated priority score
  returns?: {
    oneMonth: number;
    sixMonth: number;
    oneYear: number;
  };
  earningsDate?: string;
  newsSummary: string;
}

export interface SwipeAction {
  symbol: string;
  action: "left" | "right" | "save"; // left = skip, right = queue, save = watchlist
  timestamp: Date;
  confidence?: "conservative" | "bullish" | "very-bullish";
}

export interface SwipeFilters {
  sector?: string;
  marketCap?: string;
  riskLevel?: string;
  hideOwned?: boolean; // NEW: Option to hide already owned stocks
  performance?: string;
  peRange?: string;
}

/**
 * Fetch next swipeable stock(s) for the user
 */
export async function getSwipeableStocks(
  filters?: SwipeFilters,
  limit: number = 1
): Promise<SwipeableStock[]> {
  try {
    const params = new URLSearchParams();

    if (filters?.sector && filters.sector !== "All") {
      params.append("sector", filters.sector);
    }
    if (filters?.marketCap && filters.marketCap !== "All") {
      params.append("market_cap", filters.marketCap);
    }
    if (filters?.riskLevel && filters.riskLevel !== "All") {
      params.append("risk_level", filters.riskLevel);
    }
    if (filters?.hideOwned !== undefined) {
      params.append("hide_owned", filters.hideOwned.toString());
    }
    if (filters?.performance && filters.performance !== "All") {
      params.append("performance", filters.performance);
    }
    if (filters?.peRange && filters.peRange !== "All") {
      params.append("pe_range", filters.peRange);
    }
    params.append("limit", limit.toString());

    const response = await fetch(`/api/stocks/swipeable?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.stocks || [];
  } catch (error) {
    console.warn("Swipeable stocks API not available, using fallback:", error);

    // Fallback to current frontend logic for development
    return getFallbackSwipeableStocks(filters, limit);
  }
}

/**
 * Record a swipe action
 */
export async function recordSwipe(swipeAction: SwipeAction): Promise<void> {
  try {
    const response = await fetch("/api/stocks/swipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(swipeAction),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Track locally for immediate UI updates
    trackSwipeLocally(swipeAction);
  } catch (error) {
    console.warn("Swipe recording API not available, storing locally:", error);

    // Fallback to local storage for development
    trackSwipeLocally(swipeAction);
  }
}

/**
 * Get user's portfolio/owned stocks
 */
export async function getUserPortfolio(): Promise<string[]> {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch("/api/portfolio/holdings", {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const portfolio = data.holdings?.map((h: any) => h.symbol) || [];

    // Cache the result for better performance
    localStorage.setItem("user_portfolio", JSON.stringify({
      portfolio,
      lastUpdated: new Date().toISOString()
    }));

    return portfolio;
  } catch (error) {
    console.warn("Portfolio API not available, using fallback:", error);

    // Try to get cached portfolio first
    try {
      const cached = localStorage.getItem("user_portfolio");
      if (cached) {
        const { portfolio, lastUpdated } = JSON.parse(cached);
        const cacheAge = Date.now() - new Date(lastUpdated).getTime();

        // Use cache if less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          console.log("Using cached portfolio data");
          return portfolio;
        }
      }
    } catch (cacheError) {
      console.warn("Failed to load cached portfolio:", cacheError);
    }

    // Return mock portfolio for development
    return getMockPortfolio();
  }
}

/**
 * Watchlist API functions
 */
export async function getWatchlist(): Promise<string[]> {
  try {
    const response = await fetch("/api/watchlist");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.watchlist?.map((w: any) => w.symbol) || [];
  } catch (error) {
    console.warn("Watchlist API not available, using local storage:", error);

    // Fallback to localStorage
    const localWatchlist = localStorage.getItem("watchlist");
    return localWatchlist ? JSON.parse(localWatchlist) : [];
  }
}

export async function addToWatchlist(symbol: string, note?: string): Promise<void> {
  try {
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol, note }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn("Watchlist add API not available, storing locally:", error);

    // Fallback to localStorage
    const currentWatchlist = await getWatchlist();
    const updatedWatchlist = [...new Set([...currentWatchlist, symbol])];
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  }
}

export async function removeFromWatchlist(symbol: string): Promise<void> {
  try {
    const response = await fetch(`/api/watchlist/${symbol}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn("Watchlist remove API not available, storing locally:", error);

    // Fallback to localStorage
    const currentWatchlist = await getWatchlist();
    const updatedWatchlist = currentWatchlist.filter(s => s !== symbol);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  }
}

/**
 * Fallback functions for development
 */
function getFallbackSwipeableStocks(filters?: SwipeFilters, limit: number = 1): SwipeableStock[] {
  // Import current stock data and add ownership flags
  const { extendedStockDatabase } = require("../data/extended-stocks");
  const mockPortfolio = getMockPortfolio();

  // Convert to swipeable format with ownership info
  const stocks = Object.values(extendedStockDatabase).map((stock: any) => ({
    ...stock,
    alreadyOwned: mockPortfolio.includes(stock.symbol),
    priorityScore: mockPortfolio.includes(stock.symbol) ? 0.3 : 0.8, // Lower priority for owned stocks
  }));

  // Apply filters
  let filtered = stocks;
  if (filters?.hideOwned) {
    filtered = filtered.filter(stock => !stock.alreadyOwned);
  }
  if (filters?.sector && filters.sector !== "All") {
    filtered = filtered.filter(stock => stock.sector === filters.sector);
  }

  // Sort by priority (owned stocks lower unless hidden)
  filtered.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  return filtered.slice(0, limit);
}

function trackSwipeLocally(swipeAction: SwipeAction): void {
  const swipeHistory = JSON.parse(localStorage.getItem("swipe_history") || "[]");
  swipeHistory.push({
    ...swipeAction,
    timestamp: swipeAction.timestamp.toISOString(),
  });

  // Keep only last 1000 swipes to prevent storage bloat
  if (swipeHistory.length > 1000) {
    swipeHistory.splice(0, swipeHistory.length - 1000);
  }

  localStorage.setItem("swipe_history", JSON.stringify(swipeHistory));
}

function getMockPortfolio(): string[] {
  // Mock portfolio for development - simulate user owning some stocks
  return ["AAPL", "MSFT", "AMZN", "TSLA", "NVDA"];
}
