from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime, timedelta
import json
import logging

# Import our modules
from .models import *
from .services.ai_agent_service import AIAgentService
from .services.stock_service import StockService
from .services.portfolio_service import PortfolioService
from .services.queue_service import QueueService
from .services.auth_service import AuthService
from .routes.onboarding import router as onboarding_router

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Swipr.AI Backend",
    description="AI-powered stock discovery and portfolio management platform",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Service instances
ai_agent_service = AIAgentService()
stock_service = StockService()
portfolio_service = PortfolioService()
queue_service = QueueService()
auth_service = AuthService()

# Include routers
app.include_router(onboarding_router)

# Dependency for authenticated requests
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    return user

@app.get("/")
async def root():
    return {"message": "Swipr.AI Backend API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Auth endpoints
@app.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Authenticate user and return token"""
    try:
        result = auth_service.authenticate(request.email, request.password)
        return result
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register new user"""
    try:
        result = auth_service.register(request)
        return result
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# AI Agent endpoints
@app.post("/ai-agent/setup")
async def setup_ai_agent(
    profile: UserProfileCreate,
    user: dict = Depends(get_current_user)
):
    """Setup user's AI agent profile"""
    try:
        result = ai_agent_service.setup_profile(user["id"], profile)
        return {"success": True, "profile": result}
    except Exception as e:
        logger.error(f"AI agent setup error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/ai-agent/profile", response_model=UserProfile)
async def get_ai_agent_profile(user: dict = Depends(get_current_user)):
    """Get user's AI agent profile"""
    profile = ai_agent_service.get_profile(user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="AI agent not set up")
    return profile

@app.post("/ai-agent/track-swipe")
async def track_swipe(
    swipe_data: SwipeEvent,
    user: dict = Depends(get_current_user)
):
    """Track user swipe behavior for AI learning"""
    try:
        ai_agent_service.track_swipe(user["id"], swipe_data)
        return {"success": True}
    except Exception as e:
        logger.error(f"Swipe tracking error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/ai-agent/interventions", response_model=List[AIIntervention])
async def get_interventions(user: dict = Depends(get_current_user)):
    """Get AI interventions for user"""
    try:
        queue = queue_service.get_user_queue(user["id"])
        interventions = ai_agent_service.generate_interventions(user["id"], queue)
        return interventions
    except Exception as e:
        logger.error(f"Interventions error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/ai-agent/chat")
async def ai_chat(
    chat_request: ChatRequest,
    user: dict = Depends(get_current_user)
):
    """Chat with AI assistant"""
    try:
        response = ai_agent_service.chat(user["id"], chat_request.message)
        return {"response": response}
    except Exception as e:
        logger.error(f"AI chat error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Stock endpoints
@app.get("/stocks", response_model=List[Stock])
async def get_stocks(
    sector: Optional[str] = None,
    market_cap: Optional[str] = None,
    performance: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    """Get filtered stocks"""
    try:
        filters = StockFilters(
            sector=sector or "All",
            marketCap=market_cap or "All",
            performance=performance or "All"
        )
        stocks = stock_service.get_filtered_stocks(filters, user["id"])
        return stocks
    except Exception as e:
        logger.error(f"Get stocks error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/stocks/{symbol}", response_model=Stock)
async def get_stock(symbol: str, user: dict = Depends(get_current_user)):
    """Get detailed stock information"""
    stock = stock_service.get_stock(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@app.get("/stocks/{symbol}/news", response_model=List[NewsItem])
async def get_stock_news(symbol: str, user: dict = Depends(get_current_user)):
    """Get news for specific stock"""
    news = stock_service.get_stock_news(symbol)
    return news

# Queue endpoints
@app.get("/queue", response_model=List[QueuedStock])
async def get_queue(user: dict = Depends(get_current_user)):
    """Get user's stock queue"""
    queue = queue_service.get_user_queue(user["id"])
    return queue

@app.post("/queue/add")
async def add_to_queue(
    queue_item: QueuedStockCreate,
    user: dict = Depends(get_current_user)
):
    """Add stock to queue"""
    try:
        result = queue_service.add_to_queue(user["id"], queue_item)

        # Track for AI agent
        stock = stock_service.get_stock(queue_item.symbol)
        if stock:
            swipe_data = SwipeEvent(
                symbol=queue_item.symbol,
                action="queue",
                confidence=queue_item.confidence,
                sector=stock.sector,
                risk=stock.risk
            )
            ai_agent_service.track_swipe(user["id"], swipe_data)

        return {"success": True, "queue_item": result}
    except Exception as e:
        logger.error(f"Add to queue error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/queue/{symbol}")
async def remove_from_queue(symbol: str, user: dict = Depends(get_current_user)):
    """Remove stock from queue"""
    try:
        queue_service.remove_from_queue(user["id"], symbol)
        return {"success": True}
    except Exception as e:
        logger.error(f"Remove from queue error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Portfolio endpoints
@app.get("/portfolio", response_model=Portfolio)
async def get_portfolio(user: dict = Depends(get_current_user)):
    """Get user's portfolio"""
    portfolio = portfolio_service.get_portfolio(user["id"])
    if not portfolio:
        # Return empty portfolio for new users
        return Portfolio(user_id=user["id"], holdings=[], total_value=0.0)
    return portfolio

@app.post("/portfolio/optimize")
async def optimize_portfolio(
    optimization_request: OptimizationRequest,
    user: dict = Depends(get_current_user)
):
    """Optimize portfolio allocation"""
    try:
        result = portfolio_service.optimize_portfolio(user["id"], optimization_request)
        return result
    except Exception as e:
        logger.error(f"Portfolio optimization error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Watchlist endpoints
@app.get("/watchlist", response_model=List[WatchlistItem])
async def get_watchlist(user: dict = Depends(get_current_user)):
    """Get user's watchlist"""
    watchlist = stock_service.get_watchlist(user["id"])
    return watchlist

@app.post("/watchlist/add")
async def add_to_watchlist(
    watchlist_item: WatchlistItemCreate,
    user: dict = Depends(get_current_user)
):
    """Add stock to watchlist"""
    try:
        result = stock_service.add_to_watchlist(user["id"], watchlist_item)

        # Track for AI agent
        stock = stock_service.get_stock(watchlist_item.symbol)
        if stock:
            swipe_data = SwipeEvent(
                symbol=watchlist_item.symbol,
                action="watchlist",
                sector=stock.sector,
                risk=stock.risk
            )
            ai_agent_service.track_swipe(user["id"], swipe_data)

        return {"success": True, "watchlist_item": result}
    except Exception as e:
        logger.error(f"Add to watchlist error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
