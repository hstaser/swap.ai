import { QueuedStock } from "@/hooks/use-queue";

export interface UserProfile {
  riskTolerance: "conservative" | "moderate" | "aggressive";
  timeHorizon: "short" | "medium" | "long"; // < 2 years, 2-10 years, 10+ years
  investmentGoals: string[];
  preferredSectors: string[];
  excludedSectors: string[];
  maxSectorConcentration: number; // percentage
}

export interface BehaviorData {
  swipeHistory: Array<{
    symbol: string;
    action: "skip" | "queue" | "watchlist";
    confidence?: "conservative" | "bullish" | "very-bullish";
    timestamp: Date;
    sector: string;
    risk: "Low" | "Medium" | "High";
  }>;
  sectorPreferences: Record<string, number>; // calculated from swipes
  riskPreferences: Record<string, number>;
  lastActivity: Date;
  streakDays: number;
}

export interface AIIntervention {
  id: string;
  type: "diversification" | "risk_check" | "rebalancing" | "market_update" | "strategy_focus";
  title: string;
  message: string;
  actionText?: string;
  actionType?: "rebalance" | "adjust_strategy" | "view_suggestions" | "dismiss";
  priority: "low" | "medium" | "high";
  triggerReason: string;
  createdAt: Date;
  dismissed?: boolean;
}

export class AIAgent {
  private userProfile: UserProfile | null = null;
  private behaviorData: BehaviorData = {
    swipeHistory: [],
    sectorPreferences: {},
    riskPreferences: {},
    lastActivity: new Date(),
    streakDays: 0
  };

  constructor() {
    this.loadData();
  }

  private loadData() {
    const profile = localStorage.getItem('ai_agent_profile');
    const behavior = localStorage.getItem('ai_agent_behavior');
    
    if (profile) {
      this.userProfile = JSON.parse(profile);
    }
    
    if (behavior) {
      const parsed = JSON.parse(behavior);
      this.behaviorData = {
        ...parsed,
        swipeHistory: parsed.swipeHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })),
        lastActivity: new Date(parsed.lastActivity)
      };
    }
  }

  private saveData() {
    if (this.userProfile) {
      localStorage.setItem('ai_agent_profile', JSON.stringify(this.userProfile));
    }
    localStorage.setItem('ai_agent_behavior', JSON.stringify(this.behaviorData));
  }

  setUserProfile(profile: UserProfile) {
    this.userProfile = profile;
    this.saveData();
  }

  trackSwipe(
    symbol: string, 
    action: "skip" | "queue" | "watchlist", 
    stockData: { sector: string; risk: "Low" | "Medium" | "High" },
    confidence?: "conservative" | "bullish" | "very-bullish"
  ) {
    const swipeEvent = {
      symbol,
      action,
      confidence,
      timestamp: new Date(),
      sector: stockData.sector,
      risk: stockData.risk
    };

    this.behaviorData.swipeHistory.push(swipeEvent);
    this.behaviorData.lastActivity = new Date();
    
    // Update preferences
    this.updateSectorPreferences(stockData.sector, action);
    this.updateRiskPreferences(stockData.risk, action);
    
    // Keep only last 100 swipes
    if (this.behaviorData.swipeHistory.length > 100) {
      this.behaviorData.swipeHistory = this.behaviorData.swipeHistory.slice(-100);
    }
    
    this.saveData();
  }

  private updateSectorPreferences(sector: string, action: "skip" | "queue" | "watchlist") {
    if (!this.behaviorData.sectorPreferences[sector]) {
      this.behaviorData.sectorPreferences[sector] = 0;
    }
    
    // Positive for queue/watchlist, negative for skip
    const weight = action === "skip" ? -1 : action === "watchlist" ? 2 : 3;
    this.behaviorData.sectorPreferences[sector] += weight;
  }

  private updateRiskPreferences(risk: "Low" | "Medium" | "High", action: "skip" | "queue" | "watchlist") {
    if (!this.behaviorData.riskPreferences[risk]) {
      this.behaviorData.riskPreferences[risk] = 0;
    }
    
    const weight = action === "skip" ? -1 : action === "watchlist" ? 2 : 3;
    this.behaviorData.riskPreferences[risk] += weight;
  }

  generateInterventions(currentQueue: QueuedStock[]): AIIntervention[] {
    if (!this.userProfile) return [];

    const interventions: AIIntervention[] = [];
    const now = new Date();

    // Check sector concentration
    const sectorConcentration = this.analyzeSectorConcentration(currentQueue);
    const maxConcentration = Math.max(...Object.values(sectorConcentration));
    
    if (maxConcentration > this.userProfile.maxSectorConcentration) {
      const dominantSector = Object.entries(sectorConcentration)
        .find(([_, concentration]) => concentration === maxConcentration)?.[0];
      
      interventions.push({
        id: `diversification_${now.getTime()}`,
        type: "diversification",
        title: "Too much in one sector?",
        message: `You have ${maxConcentration.toFixed(0)}% in ${dominantSector}. Want to diversify?`,
        actionText: "View suggestions",
        actionType: "view_suggestions",
        priority: "medium",
        triggerReason: `Sector concentration above ${this.userProfile.maxSectorConcentration}%`,
        createdAt: now
      });
    }

    // Check risk alignment
    const avgRisk = this.calculateAverageRisk(currentQueue);
    const riskMismatch = this.checkRiskAlignment(avgRisk);
    
    if (riskMismatch) {
      interventions.push({
        id: `risk_check_${now.getTime()}`,
        type: "risk_check",
        title: "Off-track from your goal?",
        message: riskMismatch.message,
        actionText: "Adjust strategy",
        actionType: "adjust_strategy",
        priority: "high",
        triggerReason: riskMismatch.reason,
        createdAt: now
      });
    }

    // Check for theme detection
    const detectedTheme = this.detectInvestmentTheme();
    if (detectedTheme) {
      interventions.push({
        id: `theme_${now.getTime()}`,
        type: "strategy_focus",
        title: "High-conviction theme detected?",
        message: `You're showing interest in ${detectedTheme}. Want to bundle these into a focused strategy?`,
        actionText: "Create theme",
        actionType: "view_suggestions",
        priority: "low",
        triggerReason: `Multiple stocks in ${detectedTheme} theme`,
        createdAt: now
      });
    }

    // Check rebalancing needs (if no activity for a while)
    const daysSinceActivity = (now.getTime() - this.behaviorData.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity > 7 && currentQueue.length > 3) {
      interventions.push({
        id: `rebalance_${now.getTime()}`,
        type: "rebalancing",
        title: "You've drifted from plan",
        message: "No rebalancing in a while. Want to review your strategy?",
        actionText: "Rebalance",
        actionType: "rebalance",
        priority: "medium",
        triggerReason: `No activity for ${Math.round(daysSinceActivity)} days`,
        createdAt: now
      });
    }

    return interventions.slice(0, 2); // Show max 2 interventions at once
  }

  private analyzeSectorConcentration(queue: QueuedStock[]): Record<string, number> {
    // This would need stock data to map symbols to sectors
    // For now, return mock data
    const sectorCounts: Record<string, number> = {};
    const totalStocks = queue.length;
    
    // Mock sector distribution - in real app, fetch from stock data
    queue.forEach(stock => {
      const sector = "Technology"; // Would fetch actual sector
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    
    // Convert to percentages
    const sectorConcentration: Record<string, number> = {};
    Object.entries(sectorCounts).forEach(([sector, count]) => {
      sectorConcentration[sector] = (count / totalStocks) * 100;
    });
    
    return sectorConcentration;
  }

  private calculateAverageRisk(queue: QueuedStock[]): number {
    // Mock risk calculation - in real app, fetch risk levels from stock data
    return 2; // 1=Low, 2=Medium, 3=High
  }

  private checkRiskAlignment(avgRisk: number): { message: string; reason: string } | null {
    if (!this.userProfile) return null;
    
    const targetRisk = {
      "conservative": 1.5,
      "moderate": 2,
      "aggressive": 2.5
    }[this.userProfile.riskTolerance];
    
    if (avgRisk > targetRisk + 0.5) {
      return {
        message: "You're trending riskier than planned. Want to adjust?",
        reason: `Average risk ${avgRisk} exceeds target ${targetRisk}`
      };
    }
    
    if (avgRisk < targetRisk - 0.5) {
      return {
        message: "Your portfolio is more conservative than your goals. Want to add growth?",
        reason: `Average risk ${avgRisk} below target ${targetRisk}`
      };
    }
    
    return null;
  }

  private detectInvestmentTheme(): string | null {
    const recentSwipes = this.behaviorData.swipeHistory
      .filter(swipe => swipe.action !== "skip")
      .slice(-10);
    
    const sectorCounts: Record<string, number> = {};
    recentSwipes.forEach(swipe => {
      sectorCounts[swipe.sector] = (sectorCounts[swipe.sector] || 0) + 1;
    });
    
    // Detect if 40%+ of recent activity is in one sector
    const totalSwipes = recentSwipes.length;
    for (const [sector, count] of Object.entries(sectorCounts)) {
      if (count >= 3 && (count / totalSwipes) >= 0.4) {
        return sector;
      }
    }
    
    return null;
  }

  getBehaviorInsights() {
    const topSectors = Object.entries(this.behaviorData.sectorPreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sector]) => sector);
    
    const riskPreference = Object.entries(this.behaviorData.riskPreferences)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "Medium";
    
    return {
      topSectors,
      riskPreference,
      totalSwipes: this.behaviorData.swipeHistory.length,
      streakDays: this.behaviorData.streakDays
    };
  }

  getUserProfile() {
    return this.userProfile;
  }

  getBehaviorData() {
    return this.behaviorData;
  }
}

// Singleton instance
export const aiAgent = new AIAgent();
