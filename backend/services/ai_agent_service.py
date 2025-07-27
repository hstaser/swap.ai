import json
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from collections import defaultdict, Counter

from ..models import (
    UserProfile, UserProfileCreate, SwipeEvent, BehaviorData, 
    AIIntervention, QueuedStock, InterventionType, RiskLevel
)

logger = logging.getLogger(__name__)

class AIAgentService:
    """
    AI Agent service that learns from user behavior and provides intelligent interventions
    """
    
    def __init__(self):
        # In production, this would be a database
        self.user_profiles: Dict[str, UserProfile] = {}
        self.behavior_data: Dict[str, BehaviorData] = {}
        
    def setup_profile(self, user_id: str, profile_create: UserProfileCreate) -> UserProfile:
        """Setup user's AI agent profile"""
        try:
            profile = UserProfile(
                id=str(uuid.uuid4()),
                user_id=user_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                **profile_create.dict()
            )
            
            self.user_profiles[user_id] = profile
            
            # Initialize behavior data
            self.behavior_data[user_id] = BehaviorData(
                user_id=user_id,
                last_activity=datetime.utcnow()
            )
            
            logger.info(f"AI agent profile setup for user {user_id}")
            return profile
            
        except Exception as e:
            logger.error(f"Error setting up AI agent profile: {str(e)}")
            raise
    
    def get_profile(self, user_id: str) -> Optional[UserProfile]:
        """Get user's AI agent profile"""
        return self.user_profiles.get(user_id)
    
    def track_swipe(self, user_id: str, swipe_data: SwipeEvent) -> None:
        """Track user swipe behavior for learning"""
        try:
            if user_id not in self.behavior_data:
                self.behavior_data[user_id] = BehaviorData(
                    user_id=user_id,
                    last_activity=datetime.utcnow()
                )
            
            behavior = self.behavior_data[user_id]
            
            # Add timestamp if not provided
            if not swipe_data.timestamp:
                swipe_data.timestamp = datetime.utcnow()
            
            # Add to swipe history
            behavior.swipe_history.append(swipe_data)
            behavior.last_activity = datetime.utcnow()
            
            # Update preferences
            self._update_sector_preferences(behavior, swipe_data)
            self._update_risk_preferences(behavior, swipe_data)
            
            # Keep only last 100 swipes for performance
            if len(behavior.swipe_history) > 100:
                behavior.swipe_history = behavior.swipe_history[-100:]
            
            logger.info(f"Tracked swipe for user {user_id}: {swipe_data.symbol} -> {swipe_data.action}")
            
        except Exception as e:
            logger.error(f"Error tracking swipe: {str(e)}")
            raise
    
    def _update_sector_preferences(self, behavior: BehaviorData, swipe: SwipeEvent) -> None:
        """Update sector preferences based on swipe action"""
        sector = swipe.sector
        
        # Weight: skip = -1, watchlist = +2, queue = +3
        weight = {
            "skip": -1,
            "watchlist": 2, 
            "queue": 3
        }.get(swipe.action.value, 0)
        
        behavior.sector_preferences[sector] = behavior.sector_preferences.get(sector, 0) + weight
    
    def _update_risk_preferences(self, behavior: BehaviorData, swipe: SwipeEvent) -> None:
        """Update risk preferences based on swipe action"""
        risk_level = swipe.risk.value
        
        weight = {
            "skip": -1,
            "watchlist": 2,
            "queue": 3
        }.get(swipe.action.value, 0)
        
        behavior.risk_preferences[risk_level] = behavior.risk_preferences.get(risk_level, 0) + weight
    
    def generate_interventions(self, user_id: str, queue: List[QueuedStock]) -> List[AIIntervention]:
        """Generate AI interventions based on user behavior and portfolio"""
        try:
            profile = self.get_profile(user_id)
            if not profile:
                return []
            
            behavior = self.behavior_data.get(user_id)
            if not behavior:
                return []
            
            interventions = []
            now = datetime.utcnow()
            
            # Check sector concentration
            sector_intervention = self._check_sector_concentration(profile, queue, now)
            if sector_intervention:
                interventions.append(sector_intervention)
            
            # Check risk alignment
            risk_intervention = self._check_risk_alignment(profile, behavior, queue, now)
            if risk_intervention:
                interventions.append(risk_intervention)
            
            # Check for investment themes
            theme_intervention = self._detect_investment_theme(behavior, now)
            if theme_intervention:
                interventions.append(theme_intervention)
            
            # Check rebalancing needs
            rebalance_intervention = self._check_rebalancing_needs(behavior, queue, now)
            if rebalance_intervention:
                interventions.append(rebalance_intervention)
            
            # Limit to top 2 interventions by priority
            interventions.sort(key=lambda x: {"high": 3, "medium": 2, "low": 1}[x.priority], reverse=True)
            return interventions[:2]
            
        except Exception as e:
            logger.error(f"Error generating interventions: {str(e)}")
            return []
    
    def _check_sector_concentration(self, profile: UserProfile, queue: List[QueuedStock], now: datetime) -> Optional[AIIntervention]:
        """Check if portfolio is too concentrated in one sector"""
        if not queue:
            return None
        
        # Mock sector analysis - in production, would get actual stock sector data
        sector_counts = defaultdict(int)
        total_stocks = len(queue)
        
        # For demo purposes, assume some distribution
        for stock in queue:
            sector_counts["Technology"] += 1  # Mock - would get real sector
        
        max_concentration = max(sector_counts.values()) / total_stocks * 100 if total_stocks > 0 else 0
        
        if max_concentration > profile.maxSectorConcentration:
            dominant_sector = max(sector_counts.keys(), key=lambda k: sector_counts[k])
            
            return AIIntervention(
                id=str(uuid.uuid4()),
                type=InterventionType.DIVERSIFICATION,
                title="Too much in one sector?",
                message=f"You have {max_concentration:.0f}% in {dominant_sector}. Want to diversify?",
                actionText="View suggestions",
                actionType="view_suggestions",
                priority="medium",
                triggerReason=f"Sector concentration above {profile.maxSectorConcentration}%",
                createdAt=now
            )
        
        return None
    
    def _check_risk_alignment(self, profile: UserProfile, behavior: BehaviorData, queue: List[QueuedStock], now: datetime) -> Optional[AIIntervention]:
        """Check if current portfolio aligns with risk tolerance"""
        if not behavior.risk_preferences:
            return None
        
        # Calculate average risk based on preferences
        risk_weights = {"Low": 1, "Medium": 2, "High": 3}
        weighted_risk = sum(
            risk_weights[risk] * weight 
            for risk, weight in behavior.risk_preferences.items()
        )
        total_weight = sum(behavior.risk_preferences.values())
        avg_risk = weighted_risk / total_weight if total_weight > 0 else 2
        
        # Target risk based on tolerance
        target_risk = {"conservative": 1.5, "moderate": 2, "aggressive": 2.5}[profile.riskTolerance.value]
        
        if avg_risk > target_risk + 0.5:
            return AIIntervention(
                id=str(uuid.uuid4()),
                type=InterventionType.RISK_CHECK,
                title="Off-track from your goal?",
                message="You're trending riskier than planned. Want to adjust?",
                actionText="Adjust strategy",
                actionType="adjust_strategy",
                priority="high",
                triggerReason=f"Average risk {avg_risk:.1f} exceeds target {target_risk}",
                createdAt=now
            )
        elif avg_risk < target_risk - 0.5:
            return AIIntervention(
                id=str(uuid.uuid4()),
                type=InterventionType.RISK_CHECK,
                title="Too conservative?",
                message="Your portfolio is more conservative than your goals. Want to add growth?",
                actionText="View suggestions",
                actionType="view_suggestions",
                priority="medium",
                triggerReason=f"Average risk {avg_risk:.1f} below target {target_risk}",
                createdAt=now
            )
        
        return None
    
    def _detect_investment_theme(self, behavior: BehaviorData, now: datetime) -> Optional[AIIntervention]:
        """Detect if user is focusing on a particular investment theme"""
        recent_swipes = [
            swipe for swipe in behavior.swipe_history[-10:]
            if swipe.action.value != "skip"
        ]
        
        if len(recent_swipes) < 3:
            return None
        
        # Count sectors in recent positive swipes
        sector_counts = Counter(swipe.sector for swipe in recent_swipes)
        total_swipes = len(recent_swipes)
        
        for sector, count in sector_counts.items():
            if count >= 3 and (count / total_swipes) >= 0.4:
                return AIIntervention(
                    id=str(uuid.uuid4()),
                    type=InterventionType.STRATEGY_FOCUS,
                    title="High-conviction theme detected?",
                    message=f"You're showing interest in {sector}. Want to bundle these into a focused strategy?",
                    actionText="Create theme",
                    actionType="view_suggestions",
                    priority="low",
                    triggerReason=f"Multiple stocks in {sector} theme",
                    createdAt=now
                )
        
        return None
    
    def _check_rebalancing_needs(self, behavior: BehaviorData, queue: List[QueuedStock], now: datetime) -> Optional[AIIntervention]:
        """Check if portfolio needs rebalancing"""
        days_since_activity = (now - behavior.last_activity).days
        
        if days_since_activity > 7 and len(queue) > 3:
            return AIIntervention(
                id=str(uuid.uuid4()),
                type=InterventionType.REBALANCING,
                title="You've drifted from plan",
                message="No rebalancing in a while. Want to review your strategy?",
                actionText="Rebalance",
                actionType="rebalance",
                priority="medium",
                triggerReason=f"No activity for {days_since_activity} days",
                createdAt=now
            )
        
        return None
    
    def chat(self, user_id: str, message: str) -> str:
        """Chat with AI assistant"""
        try:
            profile = self.get_profile(user_id)
            behavior = self.behavior_data.get(user_id)
            
            # Generate contextual response based on user profile and behavior
            response = self._generate_ai_response(message, profile, behavior)
            
            logger.info(f"AI chat for user {user_id}: {message[:50]}...")
            return response
            
        except Exception as e:
            logger.error(f"Error in AI chat: {str(e)}")
            return "I'm experiencing some technical difficulties. Please try again in a moment."
    
    def _generate_ai_response(self, message: str, profile: Optional[UserProfile], behavior: Optional[BehaviorData]) -> str:
        """Generate contextual AI response"""
        message_lower = message.lower()
        
        # Get user insights
        insights = self._get_behavior_insights(behavior) if behavior else {}
        
        if "what should i buy" in message_lower or "recommend" in message_lower:
            top_sectors = insights.get("top_sectors", ["Technology"])
            risk_pref = insights.get("risk_preference", "Medium")
            
            return f"""Based on your preferences for {', '.join(top_sectors[:2])} and {risk_pref} risk stocks, I'd recommend:

• Looking for undervalued stocks in {top_sectors[0] if top_sectors else 'Technology'}
• Consider diversifying into Consumer Staples for stability
• Check out dividend-paying stocks for income

Would you like specific stock suggestions?"""
        
        elif "risky" in message_lower or "risk" in message_lower:
            risk_pref = insights.get("risk_preference", "Medium")
            top_sectors = insights.get("top_sectors", ["Technology"])
            total_swipes = insights.get("total_swipes", 0)
            
            return f"""Your risk profile shows:

• Preference for {risk_pref} risk stocks
• Heavy focus on {' and '.join(top_sectors[:2])}
• {total_swipes} total investment decisions

You're currently {'aggressive' if risk_pref == 'High' else 'conservative' if risk_pref == 'Low' else 'moderate'} in your approach. Want to adjust?"""
        
        elif "hedge" in message_lower or "protect" in message_lower:
            return """To hedge your current portfolio:

• Consider defensive sectors like Utilities or Consumer Staples
• Look into bonds or treasury funds
• Add some inverse ETFs for downside protection
• Diversify across market caps (small, mid, large)

What specific risks are you most concerned about?"""
        
        elif "portfolio" in message_lower or "analyze" in message_lower:
            top_sectors = insights.get("top_sectors", ["Technology"])
            risk_pref = insights.get("risk_preference", "Medium")
            total_swipes = insights.get("total_swipes", 0)
            streak_days = insights.get("streak_days", 0)
            
            return f"""Portfolio Analysis:

• Sector Focus: {', '.join(top_sectors)}
• Risk Level: {risk_pref}
• Activity: {total_swipes} decisions made
• Streak: {streak_days} days

Strengths: Clear sector preferences
Opportunities: Consider more diversification

Want detailed recommendations?"""
        
        elif "rebalance" in message_lower or "balance" in message_lower:
            top_sector = insights.get("top_sectors", ["Technology"])[0] if insights.get("top_sectors") else "Technology"
            
            return f"""Rebalancing suggestions:

• Your {top_sector} allocation might be high
• Consider adding exposure to Healthcare or Financials
• Review positions older than 6 months
• Take profits on winners, add to underweight sectors

Shall I create a rebalancing plan for you?"""
        
        elif "strategy" in message_lower:
            top_sector = insights.get("top_sectors", ["Technology"])[0] if insights.get("top_sectors") else "Technology"
            risk_pref = insights.get("risk_preference", "Medium")
            total_swipes = insights.get("total_swipes", 0)
            
            return f"""Your investment strategy appears to be:

• Growth-focused with {top_sector} emphasis
• {risk_pref} risk tolerance
• Active decision making ({total_swipes} swipes)

This aligns with a {'aggressive growth' if risk_pref == 'High' else 'balanced growth'} approach. Want to refine it further?"""
        
        return """I'd be happy to help! You can ask me about:

• Investment recommendations
• Risk analysis
• Portfolio review
• Hedging strategies
• Rebalancing advice

What specific area interests you most?"""
    
    def _get_behavior_insights(self, behavior: Optional[BehaviorData]) -> Dict:
        """Get insights from user behavior"""
        if not behavior:
            return {}
        
        # Top sectors by preference
        top_sectors = sorted(
            behavior.sector_preferences.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        top_sectors = [sector for sector, _ in top_sectors]
        
        # Risk preference
        risk_preference = "Medium"
        if behavior.risk_preferences:
            risk_preference = max(behavior.risk_preferences.keys(), key=lambda k: behavior.risk_preferences[k])
        
        return {
            "top_sectors": top_sectors,
            "risk_preference": risk_preference,
            "total_swipes": len(behavior.swipe_history),
            "streak_days": behavior.streak_days
        }
