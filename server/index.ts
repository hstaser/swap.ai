import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      endpoints: [
        "/api/ping",
        "/api/onboarding/submit",
        "/api/stocks/swipeable",
        "/api/stocks/swipe",
        "/api/portfolio/holdings",
        "/api/watchlist",
      ],
    });
  });

  // Onboarding endpoints
  app.post("/api/onboarding/submit", (req, res) => {
    try {
      const onboardingData = req.body;

      // In a real app, this would save to a database
      // For now, just return success with mock insights
      const response = {
        status: "success",
        message: "Onboarding completed successfully",
        onboarding_id: `onboarding_${Date.now()}`,
        insights: [
          "Based on your preferences, we recommend focusing on technology and healthcare sectors.",
          "Your moderate risk tolerance suggests a balanced portfolio approach.",
          "Consider diversifying across different market capitalizations.",
        ],
        personalization: {
          recommended_sectors: onboardingData.sector_interests || [
            "technology",
          ],
          risk_level: onboardingData.risk_tolerance || 5,
          ai_assistance: onboardingData.ai_involvement || "advisory",
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Onboarding submission error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to process onboarding data",
      });
    }
  });

  // Swipeable stocks endpoints
  app.get("/api/stocks/swipeable", (req, res) => {
    try {
      const {
        sector,
        market_cap,
        risk_level,
        hide_owned,
        performance,
        pe_range,
        limit = 1,
      } = req.query;

      // Mock portfolio for demo - in real app this would come from database
      const mockPortfolio = ["AAPL", "MSFT", "AMZN", "TSLA", "NVDA"];

      // Mock swipe history - in real app this would come from database
      const mockSwipeHistory = ["META", "AMZN", "JPM"];

      // Mock stock universe (S&P 500 subset)
      const stockUniverse = [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          sector: "Technology",
          marketCap: "Large",
          risk: "Medium",
          price: 175.43,
          change: 2.15,
          changePercent: 1.24,
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          sector: "Technology",
          marketCap: "Large",
          risk: "Low",
          price: 378.85,
          change: -1.22,
          changePercent: -0.32,
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          sector: "Technology",
          marketCap: "Large",
          risk: "Medium",
          price: 138.21,
          change: 3.45,
          changePercent: 2.56,
        },
        {
          symbol: "TSLA",
          name: "Tesla, Inc.",
          sector: "Automotive",
          marketCap: "Large",
          risk: "High",
          price: 242.68,
          change: -5.23,
          changePercent: -2.11,
        },
        {
          symbol: "NVDA",
          name: "NVIDIA Corporation",
          sector: "Technology",
          marketCap: "Large",
          risk: "High",
          price: 875.28,
          change: 12.44,
          changePercent: 1.44,
        },
        {
          symbol: "META",
          name: "Meta Platforms",
          sector: "Technology",
          marketCap: "Large",
          risk: "Medium",
          price: 298.35,
          change: 4.67,
          changePercent: 1.59,
        },
        {
          symbol: "AMZN",
          name: "Amazon.com Inc.",
          sector: "Consumer Discretionary",
          marketCap: "Large",
          risk: "Medium",
          price: 143.75,
          change: -0.85,
          changePercent: -0.59,
        },
        {
          symbol: "JPM",
          name: "JPMorgan Chase",
          sector: "Financial Services",
          marketCap: "Large",
          risk: "Low",
          price: 159.33,
          change: 1.12,
          changePercent: 0.71,
        },
        {
          symbol: "V",
          name: "Visa Inc.",
          sector: "Financial Services",
          marketCap: "Large",
          risk: "Low",
          price: 267.89,
          change: 2.33,
          changePercent: 0.88,
        },
        {
          symbol: "UNH",
          name: "UnitedHealth Group",
          sector: "Healthcare",
          marketCap: "Large",
          risk: "Low",
          price: 524.75,
          change: 3.21,
          changePercent: 0.62,
        },
      ];

      // Filter out already swiped stocks
      let availableStocks = stockUniverse.filter(
        (stock) => !mockSwipeHistory.includes(stock.symbol),
      );

      // Add ownership flags and priority scores
      availableStocks = availableStocks.map((stock) => ({
        ...stock,
        alreadyOwned: mockPortfolio.includes(stock.symbol),
        priorityScore: mockPortfolio.includes(stock.symbol) ? 0.3 : 0.8, // Lower priority for owned
      }));

      // Apply filters
      if (hide_owned === "true") {
        availableStocks = availableStocks.filter(
          (stock) => !stock.alreadyOwned,
        );
      }
      if (sector && sector !== "All") {
        availableStocks = availableStocks.filter(
          (stock) => stock.sector === sector,
        );
      }
      if (risk_level && risk_level !== "All") {
        availableStocks = availableStocks.filter(
          (stock) => stock.risk === risk_level,
        );
      }

      // Sort by priority (owned stocks lower unless hidden)
      availableStocks.sort((a, b) => b.priorityScore - a.priorityScore);

      // Return requested number of stocks
      const stocks = availableStocks.slice(0, parseInt(limit as string));

      res.json({
        stocks,
        total_available: availableStocks.length,
        filters_applied: {
          sector,
          market_cap,
          risk_level,
          hide_owned,
          performance,
          pe_range,
        },
      });
    } catch (error) {
      console.error("Swipeable stocks error:", error);
      res.status(500).json({
        error: "Failed to fetch swipeable stocks",
      });
    }
  });

  // Record swipe action
  app.post("/api/stocks/swipe", (req, res) => {
    try {
      const { symbol, action, timestamp, confidence } = req.body;

      console.log(`Swipe recorded: ${symbol} -> ${action}`, {
        timestamp,
        confidence,
      });

      // In a real app, this would save to database
      // For demo, just log and return success

      res.json({
        status: "success",
        message: "Swipe recorded successfully",
        swipe_id: `swipe_${Date.now()}`,
      });
    } catch (error) {
      console.error("Swipe recording error:", error);
      res.status(500).json({
        error: "Failed to record swipe",
      });
    }
  });

  // Portfolio/holdings endpoint
  app.get("/api/portfolio/holdings", (req, res) => {
    try {
      // Mock portfolio for demo
      const mockHoldings = [
        { symbol: "AAPL", shares: 10, avgCost: 150.0, currentValue: 1754.3 },
        { symbol: "MSFT", shares: 5, avgCost: 350.0, currentValue: 1894.25 },
        { symbol: "GOOGL", shares: 8, avgCost: 120.0, currentValue: 1105.68 },
        { symbol: "TSLA", shares: 3, avgCost: 250.0, currentValue: 728.04 },
        { symbol: "NVDA", shares: 2, avgCost: 800.0, currentValue: 1750.56 },
      ];

      res.json({
        holdings: mockHoldings,
        total_value: mockHoldings.reduce((sum, h) => sum + h.currentValue, 0),
      });
    } catch (error) {
      console.error("Portfolio holdings error:", error);
      res.status(500).json({
        error: "Failed to fetch portfolio holdings",
      });
    }
  });

  // Watchlist endpoints
  app.get("/api/watchlist", (req, res) => {
    try {
      // Mock watchlist for demo
      const mockWatchlist = [
        {
          symbol: "V",
          note: "Good long-term growth potential",
          addedAt: new Date().toISOString(),
        },
        {
          symbol: "UNH",
          note: "Healthcare sector exposure",
          addedAt: new Date().toISOString(),
        },
      ];

      res.json({ watchlist: mockWatchlist });
    } catch (error) {
      console.error("Watchlist fetch error:", error);
      res.status(500).json({
        error: "Failed to fetch watchlist",
      });
    }
  });

  app.post("/api/watchlist", (req, res) => {
    try {
      const { symbol, note } = req.body;

      console.log(`Added to watchlist: ${symbol}`, { note });

      res.json({
        status: "success",
        message: "Added to watchlist successfully",
        watchlist_id: `watch_${Date.now()}`,
      });
    } catch (error) {
      console.error("Watchlist add error:", error);
      res.status(500).json({
        error: "Failed to add to watchlist",
      });
    }
  });

  app.delete("/api/watchlist/:symbol", (req, res) => {
    try {
      const { symbol } = req.params;

      console.log(`Removed from watchlist: ${symbol}`);

      res.json({
        status: "success",
        message: "Removed from watchlist successfully",
      });
    } catch (error) {
      console.error("Watchlist remove error:", error);
      res.status(500).json({
        error: "Failed to remove from watchlist",
      });
    }
  });

  return app;
}
