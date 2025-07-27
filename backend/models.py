from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum

# Enums
class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium" 
    HIGH = "High"

class RiskTolerance(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class TimeHorizon(str, Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"

class SwipeAction(str, Enum):
    SKIP = "skip"
    QUEUE = "queue"
    WATCHLIST = "watchlist"

class Confidence(str, Enum):
    CONSERVATIVE = "conservative"
    BULLISH = "bullish"
    VERY_BULLISH = "very-bullish"

class InterventionType(str, Enum):
    DIVERSIFICATION = "diversification"
    RISK_CHECK = "risk_check"
    REBALANCING = "rebalancing"
    MARKET_UPDATE = "market_update"
    STRATEGY_FOCUS = "strategy_focus"

# Auth Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Stock Models
class NewsItem(BaseModel):
    title: str
    source: str
    time: str
    summary: str

class Returns(BaseModel):
    oneMonth: float
    sixMonth: float
    oneYear: float

class Stock(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    changePercent: float
    volume: str
    marketCap: str
    pe: Optional[float] = None
    dividendYield: Optional[float] = None
    sector: str
    isGainer: bool
    news: List[NewsItem] = []
    newsSummary: str
    returns: Optional[Returns] = None
    earningsDate: Optional[str] = None
    risk: RiskLevel = RiskLevel.MEDIUM

class StockFilters(BaseModel):
    sector: str = "All"
    marketCap: str = "All"
    performance: str = "All"
    pe: str = "All"
    dividend: str = "All"

# AI Agent Models
class UserProfileCreate(BaseModel):
    riskTolerance: RiskTolerance
    timeHorizon: TimeHorizon
    investmentGoals: List[str]
    preferredSectors: List[str]
    excludedSectors: List[str] = []
    maxSectorConcentration: float = 30.0

class UserProfile(UserProfileCreate):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class SwipeEvent(BaseModel):
    symbol: str
    action: SwipeAction
    confidence: Optional[Confidence] = None
    sector: str
    risk: RiskLevel
    timestamp: Optional[datetime] = None

class BehaviorData(BaseModel):
    user_id: str
    swipe_history: List[SwipeEvent] = []
    sector_preferences: Dict[str, float] = {}
    risk_preferences: Dict[str, float] = {}
    last_activity: datetime
    streak_days: int = 0

class AIIntervention(BaseModel):
    id: str
    type: InterventionType
    title: str
    message: str
    actionText: Optional[str] = None
    actionType: Optional[str] = None
    priority: Literal["low", "medium", "high"]
    triggerReason: str
    createdAt: datetime
    dismissed: bool = False

class ChatRequest(BaseModel):
    message: str

# Queue Models
class QueuedStockCreate(BaseModel):
    symbol: str
    confidence: Confidence

class QueuedStock(QueuedStockCreate):
    id: str
    user_id: str
    addedAt: datetime

# Portfolio Models
class PortfolioHolding(BaseModel):
    symbol: str
    shares: float
    avgCost: float
    currentPrice: float
    totalValue: float
    gainLoss: float
    gainLossPercent: float

class Portfolio(BaseModel):
    user_id: str
    holdings: List[PortfolioHolding] = []
    total_value: float
    total_gain_loss: float = 0.0
    total_gain_loss_percent: float = 0.0
    last_updated: datetime = datetime.utcnow()

class OptimizationRequest(BaseModel):
    investment_amount: float
    risk_tolerance: Optional[RiskTolerance] = None
    preferred_sectors: Optional[List[str]] = None

# Watchlist Models
class WatchlistItemCreate(BaseModel):
    symbol: str
    note: Optional[str] = None
    priority: Literal["low", "medium", "high"] = "medium"

class WatchlistItem(WatchlistItemCreate):
    id: str
    user_id: str
    added_at: datetime

# Market Data
class MarketSentiment(BaseModel):
    symbol: str
    bullish_percent: float
    bearish_percent: float
    total_votes: int
    sentiment_score: float  # -1 to 1

class SectorPerformance(BaseModel):
    sector: str
    performance: float
    volume: str
    top_gainers: List[str]
    top_losers: List[str]
