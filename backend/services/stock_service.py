import json
import uuid
from datetime import datetime
from typing import List, Dict, Optional
import logging

from ..models import (
    Stock, NewsItem, Returns, StockFilters, WatchlistItem, 
    WatchlistItemCreate, RiskLevel
)

logger = logging.getLogger(__name__)

class StockService:
    """Service for managing stock data and operations"""
    
    def __init__(self):
        # In production, this would connect to real market data APIs
        self.watchlists: Dict[str, List[WatchlistItem]] = {}
        self._initialize_stock_data()
    
    def _initialize_stock_data(self):
        """Initialize with mock stock data (in production, would fetch from market APIs)"""
        self.stocks = {
            "AAPL": Stock(
                symbol="AAPL",
                name="Apple Inc.",
                price=182.52,
                change=2.31,
                changePercent=1.28,
                volume="52.4M",
                marketCap="2.85T",
                pe=29.8,
                dividendYield=0.5,
                sector="Technology",
                isGainer=True,
                newsSummary="Strong iPhone sales, AI momentum",
                returns=Returns(oneMonth=3.2, sixMonth=12.7, oneYear=18.4),
                earningsDate="Jan 25, 2024",
                risk=RiskLevel.MEDIUM,
                news=[
                    NewsItem(
                        title="Apple unveils new iPhone 15 Pro with titanium design",
                        source="TechCrunch",
                        time="2h ago",
                        summary="Apple's latest flagship phone features a titanium build and improved camera system."
                    )
                ]
            ),
            "GOOGL": Stock(
                symbol="GOOGL",
                name="Alphabet Inc.",
                price=138.21,
                change=1.82,
                changePercent=1.33,
                volume="28.1M",
                marketCap="1.75T",
                pe=27.3,
                dividendYield=None,
                sector="Communication Services",
                isGainer=True,
                newsSummary="Search dominance, AI investments",
                returns=Returns(oneMonth=4.1, sixMonth=15.3, oneYear=22.8),
                risk=RiskLevel.MEDIUM,
                news=[
                    NewsItem(
                        title="Google Search updates combat AI-generated content",
                        source="Search Engine Land",
                        time="2h ago",
                        summary="New algorithm updates aim to prioritize authentic content."
                    )
                ]
            ),
            "TSLA": Stock(
                symbol="TSLA",
                name="Tesla, Inc.",
                price=238.77,
                change=-8.32,
                changePercent=-3.37,
                volume="89.7M",
                marketCap="759.8B",
                pe=73.2,
                dividendYield=None,
                sector="Consumer Discretionary",
                isGainer=False,
                newsSummary="Production delays, competition fears",
                returns=Returns(oneMonth=-5.2, sixMonth=8.1, oneYear=45.2),
                risk=RiskLevel.HIGH,
                news=[
                    NewsItem(
                        title="Tesla recalls Model S vehicles over brake concerns",
                        source="CNN Business",
                        time="1h ago",
                        summary="NHTSA investigation prompts voluntary recall affecting thousands."
                    )
                ]
            ),
            "AMZN": Stock(
                symbol="AMZN",
                name="Amazon.com, Inc.",
                price=144.05,
                change=1.88,
                changePercent=1.32,
                volume="44.3M",
                marketCap="1.50T",
                pe=45.6,
                dividendYield=None,
                sector="Consumer Discretionary",
                isGainer=True,
                newsSummary="AWS growth, retail margins up",
                returns=Returns(oneMonth=2.8, sixMonth=18.9, oneYear=31.7),
                risk=RiskLevel.MEDIUM,
                news=[
                    NewsItem(
                        title="Amazon Prime Day breaks sales records",
                        source="CNBC",
                        time="3h ago",
                        summary="Annual shopping event generates record revenue."
                    )
                ]
            ),
            "NVDA": Stock(
                symbol="NVDA",
                name="NVIDIA Corporation",
                price=722.48,
                change=12.66,
                changePercent=1.78,
                volume="67.8M",
                marketCap="1.78T",
                pe=68.9,
                dividendYield=0.3,
                sector="Technology",
                isGainer=True,
                newsSummary="AI chip demand surging, earnings beat",
                returns=Returns(oneMonth=8.9, sixMonth=42.1, oneYear=186.3),
                risk=RiskLevel.HIGH,
                news=[
                    NewsItem(
                        title="NVIDIA announces next-gen AI chips for data centers",
                        source="Forbes",
                        time="1h ago",
                        summary="New H200 chips promise 2x performance improvement."
                    )
                ]
            ),
            "JPM": Stock(
                symbol="JPM",
                name="JPMorgan Chase & Co.",
                price=154.23,
                change=-0.87,
                changePercent=-0.56,
                volume="12.4M",
                marketCap="452.1B",
                pe=12.8,
                dividendYield=2.4,
                sector="Financial Services",
                isGainer=False,
                newsSummary="Rate concerns, lending slowdown",
                returns=Returns(oneMonth=1.2, sixMonth=5.8, oneYear=12.3),
                risk=RiskLevel.LOW,
                news=[
                    NewsItem(
                        title="JPMorgan raises interest rate outlook for 2024",
                        source="Financial Times",
                        time="2h ago",
                        summary="Bank adjusts economic forecasts citing persistent inflation."
                    )
                ]
            ),
            "JNJ": Stock(
                symbol="JNJ",
                name="Johnson & Johnson",
                price=161.42,
                change=0.34,
                changePercent=0.21,
                volume="8.9M",
                marketCap="427.3B",
                pe=15.2,
                dividendYield=3.1,
                sector="Healthcare",
                isGainer=True,
                newsSummary="Pharmaceutical pipeline strong",
                returns=Returns(oneMonth=0.8, sixMonth=3.2, oneYear=7.9),
                risk=RiskLevel.LOW,
                news=[
                    NewsItem(
                        title="Johnson & Johnson advances cancer treatment trials",
                        source="Reuters",
                        time="4h ago",
                        summary="Promising results in Phase 3 trials for new oncology drug."
                    )
                ]
            )
        }
    
    def get_stock(self, symbol: str) -> Optional[Stock]:
        """Get stock by symbol"""
        return self.stocks.get(symbol.upper())
    
    def get_all_stocks(self) -> List[Stock]:
        """Get all available stocks"""
        return list(self.stocks.values())
    
    def get_filtered_stocks(self, filters: StockFilters, user_id: str) -> List[Stock]:
        """Get stocks filtered by criteria"""
        try:
            stocks = list(self.stocks.values())
            
            # Apply filters
            if filters.sector != "All":
                stocks = [s for s in stocks if s.sector == filters.sector]
            
            if filters.performance != "All":
                stocks = self._filter_by_performance(stocks, filters.performance)
            
            if filters.marketCap != "All":
                stocks = self._filter_by_market_cap(stocks, filters.marketCap)
            
            if filters.pe != "All":
                stocks = self._filter_by_pe(stocks, filters.pe)
            
            if filters.dividend != "All":
                stocks = self._filter_by_dividend(stocks, filters.dividend)
            
            logger.info(f"Filtered stocks for user {user_id}: {len(stocks)} results")
            return stocks
            
        except Exception as e:
            logger.error(f"Error filtering stocks: {str(e)}")
            return []
    
    def _filter_by_performance(self, stocks: List[Stock], performance: str) -> List[Stock]:
        """Filter stocks by performance criteria"""
        if performance == "Today's Gainers (>5%)":
            return [s for s in stocks if s.changePercent > 5]
        elif performance == "Today's Losers (<-5%)":
            return [s for s in stocks if s.changePercent < -5]
        elif performance == "Weekly Gainers (>10%)":
            return [s for s in stocks if s.changePercent > 10]
        elif performance == "Weekly Losers (<-10%)":
            return [s for s in stocks if s.changePercent < -10]
        elif performance == "Monthly Winners (>20%)":
            return [s for s in stocks if s.returns and s.returns.oneMonth > 20]
        elif performance == "Monthly Losers (<-20%)":
            return [s for s in stocks if s.returns and s.returns.oneMonth < -20]
        elif performance == "YTD Winners (>50%)":
            return [s for s in stocks if s.returns and s.returns.oneYear > 50]
        elif performance == "YTD Losers (<-50%)":
            return [s for s in stocks if s.returns and s.returns.oneYear < -50]
        return stocks
    
    def _filter_by_market_cap(self, stocks: List[Stock], market_cap: str) -> List[Stock]:
        """Filter stocks by market cap (simplified for demo)"""
        # In production, would parse actual market cap values
        return stocks
    
    def _filter_by_pe(self, stocks: List[Stock], pe_filter: str) -> List[Stock]:
        """Filter stocks by P/E ratio"""
        if pe_filter == "Low P/E (<15)":
            return [s for s in stocks if s.pe and s.pe < 15]
        elif pe_filter == "Medium P/E (15-25)":
            return [s for s in stocks if s.pe and 15 <= s.pe <= 25]
        elif pe_filter == "High P/E (>25)":
            return [s for s in stocks if s.pe and s.pe > 25]
        return stocks
    
    def _filter_by_dividend(self, stocks: List[Stock], dividend_filter: str) -> List[Stock]:
        """Filter stocks by dividend yield"""
        if dividend_filter == "Dividend Stocks":
            return [s for s in stocks if s.dividendYield and s.dividendYield > 0]
        elif dividend_filter == "No Dividend":
            return [s for s in stocks if not s.dividendYield or s.dividendYield == 0]
        return stocks
    
    def get_stock_news(self, symbol: str) -> List[NewsItem]:
        """Get news for specific stock"""
        stock = self.get_stock(symbol)
        return stock.news if stock else []
    
    def search_stocks(self, query: str, limit: int = 10) -> List[Stock]:
        """Search stocks by symbol or name"""
        query_lower = query.lower()
        results = []
        
        for stock in self.stocks.values():
            if (query_lower in stock.symbol.lower() or 
                query_lower in stock.name.lower()):
                results.append(stock)
                
                if len(results) >= limit:
                    break
        
        return results
    
    def get_watchlist(self, user_id: str) -> List[WatchlistItem]:
        """Get user's watchlist"""
        return self.watchlists.get(user_id, [])
    
    def add_to_watchlist(self, user_id: str, item: WatchlistItemCreate) -> WatchlistItem:
        """Add stock to user's watchlist"""
        try:
            # Check if stock exists
            stock = self.get_stock(item.symbol)
            if not stock:
                raise ValueError(f"Stock {item.symbol} not found")
            
            # Check if already in watchlist
            if user_id not in self.watchlists:
                self.watchlists[user_id] = []
            
            existing = next((w for w in self.watchlists[user_id] if w.symbol == item.symbol), None)
            if existing:
                raise ValueError(f"Stock {item.symbol} already in watchlist")
            
            # Create watchlist item
            watchlist_item = WatchlistItem(
                id=str(uuid.uuid4()),
                user_id=user_id,
                added_at=datetime.utcnow(),
                **item.dict()
            )
            
            self.watchlists[user_id].append(watchlist_item)
            
            logger.info(f"Added {item.symbol} to watchlist for user {user_id}")
            return watchlist_item
            
        except Exception as e:
            logger.error(f"Error adding to watchlist: {str(e)}")
            raise
    
    def remove_from_watchlist(self, user_id: str, symbol: str) -> bool:
        """Remove stock from user's watchlist"""
        try:
            if user_id not in self.watchlists:
                return False
            
            initial_length = len(self.watchlists[user_id])
            self.watchlists[user_id] = [
                w for w in self.watchlists[user_id] 
                if w.symbol != symbol.upper()
            ]
            
            removed = len(self.watchlists[user_id]) < initial_length
            
            if removed:
                logger.info(f"Removed {symbol} from watchlist for user {user_id}")
            
            return removed
            
        except Exception as e:
            logger.error(f"Error removing from watchlist: {str(e)}")
            return False
    
    def get_sector_performance(self) -> Dict[str, Dict]:
        """Get performance data by sector"""
        sector_data = {}
        
        for stock in self.stocks.values():
            sector = stock.sector
            if sector not in sector_data:
                sector_data[sector] = {
                    "stocks": [],
                    "avg_change": 0,
                    "gainers": [],
                    "losers": []
                }
            
            sector_data[sector]["stocks"].append(stock)
            
            if stock.changePercent > 0:
                sector_data[sector]["gainers"].append(stock.symbol)
            else:
                sector_data[sector]["losers"].append(stock.symbol)
        
        # Calculate averages
        for sector, data in sector_data.items():
            if data["stocks"]:
                data["avg_change"] = sum(s.changePercent for s in data["stocks"]) / len(data["stocks"])
                data["gainers"] = data["gainers"][:3]  # Top 3
                data["losers"] = data["losers"][:3]    # Top 3
        
        return sector_data
    
    def get_market_movers(self, limit: int = 10) -> Dict[str, List[Stock]]:
        """Get market movers (gainers and losers)"""
        all_stocks = list(self.stocks.values())
        
        gainers = sorted(
            [s for s in all_stocks if s.changePercent > 0],
            key=lambda x: x.changePercent,
            reverse=True
        )[:limit]
        
        losers = sorted(
            [s for s in all_stocks if s.changePercent < 0],
            key=lambda x: x.changePercent
        )[:limit]
        
        return {
            "gainers": gainers,
            "losers": losers
        }
