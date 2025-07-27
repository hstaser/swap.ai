import { QueuedStock } from "@/hooks/use-queue";

export interface AgenticSuggestion {
  id: string;
  type: "rebalance" | "pair" | "diversify" | "optimize" | "risk_check";
  priority: "low" | "medium" | "high";
  message: string;
  action?: string;
  context?: {
    symbol?: string;
    sector?: string;
    reasoning?: string;
  };
}

export class AgenticAI {
  private static instance: AgenticAI;
  
  static getInstance(): AgenticAI {
    if (!AgenticAI.instance) {
      AgenticAI.instance = new AgenticAI();
    }
    return AgenticAI.instance;
  }

  // Dynamic Portfolio Rebalancing Agent (background)
  analyzePortfolioBalance(queue: QueuedStock[], currentHoldings?: any[]): AgenticSuggestion[] {
    const suggestions: AgenticSuggestion[] = [];
    
    // Check sector concentration
    const sectorCounts = this.analyzeSectorDistribution(queue);
    const totalStocks = queue.length;
    
    for (const [sector, count] of Object.entries(sectorCounts)) {
      const percentage = (count / totalStocks) * 100;
      if (percentage > 40) {
        suggestions.push({
          id: `rebalance_${sector}`,
          type: "rebalance",
          priority: "medium",
          message: `${sector} is ${percentage.toFixed(0)}% of your queue`,
          action: "Consider diversifying",
          context: { sector, reasoning: "Concentration risk detected" }
        });
      }
    }
    
    return suggestions;
  }

  // Exploration-to-Investment Bridge (contextual)
  getComplementaryStockSuggestion(symbol: string, risk: string): AgenticSuggestion | null {
    const pairings: Record<string, {defensive: string, reason: string}> = {
      "AAPL": { defensive: "JNJ", reason: "Tech + Healthcare balance" },
      "TSLA": { defensive: "PG", reason: "Growth + Defensive consumer" },
      "NVDA": { defensive: "VZ", reason: "AI + Stable telecom" },
    };
    
    if (risk === "High" && pairings[symbol]) {
      const pair = pairings[symbol];
      return {
        id: `pair_${symbol}`,
        type: "pair",
        priority: "low",
        message: `High-beta pick. Consider pairing with ${pair.defensive}`,
        action: "Balance risk",
        context: { 
          symbol: pair.defensive, 
          reasoning: pair.reason 
        }
      };
    }
    
    return null;
  }

  // Confidence-to-Action Conversion (background analysis)
  analyzeConfidencePattern(queue: QueuedStock[]): AgenticSuggestion[] {
    const suggestions: AgenticSuggestion[] = [];
    
    const highConfidenceCount = queue.filter(item => 
      item.confidence === "very-bullish"
    ).length;
    
    if (highConfidenceCount > 3) {
      suggestions.push({
        id: "confidence_check",
        type: "risk_check", 
        priority: "medium",
        message: "Multiple high-conviction bets detected",
        action: "Consider position sizing",
        context: { reasoning: "Overconfidence risk management" }
      });
    }
    
    return suggestions;
  }

  // Goal-Based Optimization (intelligent queue building)
  suggestBasedOnGoal(goal: string): string[] {
    const goalStrategies: Record<string, string[]> = {
      "growth": ["NVDA", "AMZN", "GOOGL", "META"],
      "income": ["JNJ", "PG", "KO", "VZ"],
      "defensive": ["JNJ", "PG", "WMT", "HD"],
      "tech": ["AAPL", "MSFT", "NVDA", "GOOGL"],
      "value": ["BRK.B", "JPM", "WMT", "HD"],
    };
    
    return goalStrategies[goal.toLowerCase()] || [];
  }

  // Portfolio Cloning Logic
  getCloneablePortfolios(): Record<string, any> {
    return {
      "nancy_pelosi": {
        name: "Nancy Pelosi",
        description: "Based on congressional trading disclosures", 
        holdings: [
          { symbol: "NVDA", weight: 15, reason: "Recent large purchases" },
          { symbol: "AAPL", weight: 12, reason: "Consistent holding" },
          { symbol: "MSFT", weight: 10, reason: "Tech allocation" },
          { symbol: "GOOGL", weight: 8, reason: "Growth position" },
          { symbol: "CRM", weight: 6, reason: "Software exposure" },
        ]
      },
      "warren_buffett": {
        name: "Warren Buffett (Berkshire)",
        description: "Berkshire Hathaway's latest 13F filings",
        holdings: [
          { symbol: "AAPL", weight: 40, reason: "Largest holding" },
          { symbol: "BAC", weight: 12, reason: "Banking sector bet" },
          { symbol: "KO", weight: 8, reason: "Classic consumer" },
          { symbol: "AXP", weight: 6, reason: "Financial services" },
          { symbol: "KHC", weight: 4, reason: "Consumer staples" },
        ]
      },
      "cathie_wood": {
        name: "Cathie Wood (ARK)",
        description: "ARK Innovation ETF top holdings",
        holdings: [
          { symbol: "TSLA", weight: 18, reason: "EV revolution bet" },
          { symbol: "COIN", weight: 8, reason: "Crypto exposure" },
          { symbol: "ROKU", weight: 6, reason: "Streaming growth" },
          { symbol: "SQ", weight: 5, reason: "Fintech innovation" },
          { symbol: "HOOD", weight: 4, reason: "Democratizing finance" },
        ]
      }
    };
  }

  // Smart Queue Generation
  generateThematicQueue(theme: string): string[] {
    const themes: Record<string, string[]> = {
      "apple_competitors": ["GOOGL", "MSFT", "AMZN", "META", "NFLX", "QCOM"],
      "ai_revolution": ["NVDA", "AMD", "GOOGL", "MSFT", "TSLA", "PLTR"],
      "dividend_aristocrats": ["JNJ", "PG", "KO", "WMT", "HD", "MMM"],
      "recession_proof": ["JNJ", "WMT", "PG", "KO", "VZ", "T"],
      "clean_energy": ["TSLA", "ENPH", "SEDG", "FSLR", "PLUG", "NEE"],
    };
    
    return themes[theme] || [];
  }

  private analyzeSectorDistribution(queue: QueuedStock[]): Record<string, number> {
    // Mock sector mapping - in real implementation, would fetch from stock data
    const sectorMapping: Record<string, string> = {
      "AAPL": "Technology",
      "MSFT": "Technology", 
      "GOOGL": "Technology",
      "AMZN": "Consumer Discretionary",
      "TSLA": "Consumer Discretionary",
      "JNJ": "Healthcare",
      "JPM": "Financial Services",
    };
    
    const counts: Record<string, number> = {};
    queue.forEach(stock => {
      const sector = sectorMapping[stock.symbol] || "Technology";
      counts[sector] = (counts[sector] || 0) + 1;
    });
    
    return counts;
  }

  // Risk Stress Testing Agent
  runStressTest(portfolio: any[]): any {
    return {
      scenarios: {
        market_crash: { impact: -12, risk: "medium" },
        tech_correction: { impact: -18, risk: "high" },
        recession: { impact: -20, risk: "high" }
      },
      recommendations: [
        "Add 10% treasury bonds for stability",
        "Increase healthcare allocation to 15%", 
        "Consider VIX protection"
      ]
    };
  }
}

export const agenticAI = AgenticAI.getInstance();
