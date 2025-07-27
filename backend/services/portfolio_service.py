import uuid
from datetime import datetime
from typing import List, Dict, Optional
import logging
import random

from ..models import (
    Portfolio, PortfolioHolding, OptimizationRequest, 
    QueuedStock, RiskTolerance
)
from .stock_service import StockService

logger = logging.getLogger(__name__)

class PortfolioService:
    """Service for managing user portfolios and optimization"""
    
    def __init__(self):
        self.portfolios: Dict[str, Portfolio] = {}
        self.stock_service = StockService()
    
    def get_portfolio(self, user_id: str) -> Optional[Portfolio]:
        """Get user's portfolio"""
        return self.portfolios.get(user_id)
    
    def create_portfolio(self, user_id: str) -> Portfolio:
        """Create empty portfolio for user"""
        portfolio = Portfolio(
            user_id=user_id,
            holdings=[],
            total_value=0.0,
            total_gain_loss=0.0,
            total_gain_loss_percent=0.0,
            last_updated=datetime.utcnow()
        )
        
        self.portfolios[user_id] = portfolio
        logger.info(f"Created portfolio for user {user_id}")
        return portfolio
    
    def add_holding(self, user_id: str, symbol: str, shares: float, purchase_price: float) -> PortfolioHolding:
        """Add holding to portfolio"""
        try:
            stock = self.stock_service.get_stock(symbol)
            if not stock:
                raise ValueError(f"Stock {symbol} not found")
            
            portfolio = self.get_portfolio(user_id)
            if not portfolio:
                portfolio = self.create_portfolio(user_id)
            
            # Check if holding already exists
            existing_holding = next((h for h in portfolio.holdings if h.symbol == symbol), None)
            
            if existing_holding:
                # Update existing holding (average cost)
                total_cost = (existing_holding.shares * existing_holding.avgCost) + (shares * purchase_price)
                total_shares = existing_holding.shares + shares
                existing_holding.shares = total_shares
                existing_holding.avgCost = total_cost / total_shares
                holding = existing_holding
            else:
                # Create new holding
                holding = PortfolioHolding(
                    symbol=symbol,
                    shares=shares,
                    avgCost=purchase_price,
                    currentPrice=stock.price,
                    totalValue=shares * stock.price,
                    gainLoss=(stock.price - purchase_price) * shares,
                    gainLossPercent=((stock.price - purchase_price) / purchase_price) * 100
                )
                portfolio.holdings.append(holding)
            
            # Update portfolio totals
            self._update_portfolio_totals(portfolio)
            
            logger.info(f"Added holding {symbol} to portfolio for user {user_id}")
            return holding
            
        except Exception as e:
            logger.error(f"Error adding holding: {str(e)}")
            raise
    
    def remove_holding(self, user_id: str, symbol: str, shares: Optional[float] = None) -> bool:
        """Remove holding from portfolio (partial or full)"""
        try:
            portfolio = self.get_portfolio(user_id)
            if not portfolio:
                return False
            
            holding = next((h for h in portfolio.holdings if h.symbol == symbol), None)
            if not holding:
                return False
            
            if shares is None or shares >= holding.shares:
                # Remove entire holding
                portfolio.holdings = [h for h in portfolio.holdings if h.symbol != symbol]
                logger.info(f"Removed all {symbol} shares for user {user_id}")
            else:
                # Partial sale
                holding.shares -= shares
                logger.info(f"Removed {shares} {symbol} shares for user {user_id}")
            
            # Update portfolio totals
            self._update_portfolio_totals(portfolio)
            return True
            
        except Exception as e:
            logger.error(f"Error removing holding: {str(e)}")
            return False
    
    def update_portfolio_prices(self, user_id: str) -> Portfolio:
        """Update portfolio with current market prices"""
        try:
            portfolio = self.get_portfolio(user_id)
            if not portfolio:
                raise ValueError("Portfolio not found")
            
            for holding in portfolio.holdings:
                stock = self.stock_service.get_stock(holding.symbol)
                if stock:
                    holding.currentPrice = stock.price
                    holding.totalValue = holding.shares * stock.price
                    holding.gainLoss = (stock.price - holding.avgCost) * holding.shares
                    holding.gainLossPercent = ((stock.price - holding.avgCost) / holding.avgCost) * 100
            
            self._update_portfolio_totals(portfolio)
            portfolio.last_updated = datetime.utcnow()
            
            logger.info(f"Updated portfolio prices for user {user_id}")
            return portfolio
            
        except Exception as e:
            logger.error(f"Error updating portfolio prices: {str(e)}")
            raise
    
    def _update_portfolio_totals(self, portfolio: Portfolio) -> None:
        """Update portfolio total values"""
        if not portfolio.holdings:
            portfolio.total_value = 0.0
            portfolio.total_gain_loss = 0.0
            portfolio.total_gain_loss_percent = 0.0
            return
        
        portfolio.total_value = sum(h.totalValue for h in portfolio.holdings)
        portfolio.total_gain_loss = sum(h.gainLoss for h in portfolio.holdings)
        
        total_cost = sum(h.shares * h.avgCost for h in portfolio.holdings)
        if total_cost > 0:
            portfolio.total_gain_loss_percent = (portfolio.total_gain_loss / total_cost) * 100
        else:
            portfolio.total_gain_loss_percent = 0.0
    
    def optimize_portfolio(self, user_id: str, request: OptimizationRequest) -> Dict:
        """Optimize portfolio allocation based on AI recommendations"""
        try:
            portfolio = self.get_portfolio(user_id)
            if not portfolio:
                portfolio = self.create_portfolio(user_id)
            
            # Get available stocks
            all_stocks = self.stock_service.get_all_stocks()
            
            # Filter by preferred sectors if provided
            if request.preferred_sectors:
                available_stocks = [s for s in all_stocks if s.sector in request.preferred_sectors]
            else:
                available_stocks = all_stocks
            
            # Risk-based allocation
            risk_allocation = self._get_risk_allocation(request.risk_tolerance or RiskTolerance.MODERATE)
            
            # Generate optimized allocation
            optimization_result = self._generate_optimization(
                available_stocks,
                request.investment_amount,
                risk_allocation,
                portfolio
            )
            
            logger.info(f"Generated portfolio optimization for user {user_id}")
            return optimization_result
            
        except Exception as e:
            logger.error(f"Error optimizing portfolio: {str(e)}")
            raise
    
    def _get_risk_allocation(self, risk_tolerance: RiskTolerance) -> Dict[str, float]:
        """Get asset allocation based on risk tolerance"""
        allocations = {
            RiskTolerance.CONSERVATIVE: {
                "stocks": 0.6,
                "bonds": 0.3,
                "cash": 0.1
            },
            RiskTolerance.MODERATE: {
                "stocks": 0.7,
                "bonds": 0.2,
                "cash": 0.1
            },
            RiskTolerance.AGGRESSIVE: {
                "stocks": 0.85,
                "bonds": 0.1,
                "cash": 0.05
            }
        }
        
        return allocations.get(risk_tolerance, allocations[RiskTolerance.MODERATE])
    
    def _generate_optimization(self, stocks: List, amount: float, allocation: Dict, current_portfolio: Portfolio) -> Dict:
        """Generate optimized portfolio allocation"""
        stock_amount = amount * allocation["stocks"]
        
        # Simple diversification strategy
        recommended_stocks = []
        sectors_covered = set()
        
        # Prioritize diversification across sectors
        for stock in sorted(stocks, key=lambda x: x.changePercent, reverse=True):
            if len(recommended_stocks) >= 8:  # Max 8 stocks
                break
            
            # Skip if sector already well-represented
            if stock.sector in sectors_covered and len([s for s in recommended_stocks if s["sector"] == stock.sector]) >= 2:
                continue
            
            # Calculate allocation percentage (simplified)
            if len(recommended_stocks) == 0:
                allocation_percent = 0.25  # 25% for first stock
            elif len(recommended_stocks) < 4:
                allocation_percent = 0.20  # 20% for next 3
            else:
                allocation_percent = 0.05  # 5% for remaining
            
            stock_allocation = stock_amount * allocation_percent
            shares = stock_allocation / stock.price
            
            recommended_stocks.append({
                "symbol": stock.symbol,
                "name": stock.name,
                "sector": stock.sector,
                "currentPrice": stock.price,
                "recommendedShares": round(shares, 2),
                "allocationAmount": round(stock_allocation, 2),
                "allocationPercent": round(allocation_percent * 100, 1),
                "reasoning": f"Diversification in {stock.sector}, strong performance"
            })
            
            sectors_covered.add(stock.sector)
        
        # Calculate fees (1% platform fee + regulatory)
        platform_fee = amount * 0.01
        regulatory_fee = amount * 0.0005  # 0.05% regulatory
        total_fees = platform_fee + regulatory_fee
        
        return {
            "recommendedStocks": recommended_stocks,
            "totalInvestment": amount,
            "stockAllocation": stock_amount,
            "bondAllocation": amount * allocation.get("bonds", 0),
            "cashAllocation": amount * allocation.get("cash", 0),
            "fees": {
                "platformFee": round(platform_fee, 2),
                "regulatoryFee": round(regulatory_fee, 2),
                "totalFees": round(total_fees, 2)
            },
            "expectedReturn": round(random.uniform(8, 12), 1),  # Mock expected return
            "riskScore": round(random.uniform(3, 7), 1),  # Mock risk score
            "diversificationScore": min(len(sectors_covered) * 20, 100)  # Max 100%
        }
    
    def execute_optimization(self, user_id: str, optimization: Dict) -> Portfolio:
        """Execute the optimized portfolio allocation"""
        try:
            portfolio = self.get_portfolio(user_id)
            if not portfolio:
                portfolio = self.create_portfolio(user_id)
            
            # Add recommended holdings
            for stock_rec in optimization["recommendedStocks"]:
                self.add_holding(
                    user_id,
                    stock_rec["symbol"],
                    stock_rec["recommendedShares"],
                    stock_rec["currentPrice"]
                )
            
            # Update portfolio
            self.update_portfolio_prices(user_id)
            
            logger.info(f"Executed portfolio optimization for user {user_id}")
            return portfolio
            
        except Exception as e:
            logger.error(f"Error executing optimization: {str(e)}")
            raise
    
    def get_portfolio_analytics(self, user_id: str) -> Dict:
        """Get portfolio analytics and insights"""
        try:
            portfolio = self.get_portfolio(user_id)
            if not portfolio or not portfolio.holdings:
                return {
                    "totalValue": 0,
                    "dayChange": 0,
                    "totalReturn": 0,
                    "sectorAllocation": {},
                    "riskScore": 0,
                    "dividendYield": 0
                }
            
            # Calculate sector allocation
            sector_allocation = {}
            for holding in portfolio.holdings:
                stock = self.stock_service.get_stock(holding.symbol)
                if stock:
                    sector = stock.sector
                    if sector not in sector_allocation:
                        sector_allocation[sector] = 0
                    sector_allocation[sector] += holding.totalValue
            
            # Convert to percentages
            total_value = portfolio.total_value
            if total_value > 0:
                sector_allocation = {
                    sector: round((value / total_value) * 100, 1)
                    for sector, value in sector_allocation.items()
                }
            
            # Calculate day change
            day_change = sum(
                (stock.change * holding.shares) 
                for holding in portfolio.holdings
                if (stock := self.stock_service.get_stock(holding.symbol))
            )
            
            # Calculate dividend yield
            dividend_yield = 0
            for holding in portfolio.holdings:
                stock = self.stock_service.get_stock(holding.symbol)
                if stock and stock.dividendYield:
                    weight = holding.totalValue / total_value if total_value > 0 else 0
                    dividend_yield += stock.dividendYield * weight
            
            return {
                "totalValue": round(portfolio.total_value, 2),
                "dayChange": round(day_change, 2),
                "totalReturn": round(portfolio.total_gain_loss, 2),
                "totalReturnPercent": round(portfolio.total_gain_loss_percent, 2),
                "sectorAllocation": sector_allocation,
                "riskScore": round(random.uniform(3, 7), 1),  # Mock risk score
                "dividendYield": round(dividend_yield, 2),
                "holdingsCount": len(portfolio.holdings)
            }
            
        except Exception as e:
            logger.error(f"Error getting portfolio analytics: {str(e)}")
            return {}
