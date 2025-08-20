"""
Onboarding Service
Handles user onboarding data collection, validation, and storage
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import json
import uuid

class OnboardingService:
    def __init__(self):
        # In production, this would connect to a database
        self.onboarding_data = {}
    
    async def save_onboarding_data(self, user_id: str, onboarding_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Save user onboarding preferences and goals
        
        Args:
            user_id: Unique user identifier
            onboarding_data: Dictionary containing all onboarding responses
            
        Returns:
            Dictionary with saved data and metadata
        """
        
        # Validate required fields
        required_fields = ['user_type', 'sector_interests', 'primary_goal', 'risk_tolerance']
        missing_fields = [field for field in required_fields if field not in onboarding_data]
        
        if missing_fields and not onboarding_data.get('skipped', False):
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
        
        # Process and enrich data
        processed_data = {
            'user_id': user_id,
            'onboarding_id': str(uuid.uuid4()),
            'completed_at': datetime.utcnow().isoformat(),
            'version': '1.0',
            'data': onboarding_data,
            'derived_insights': self._derive_insights(onboarding_data)
        }
        
        # Store data (in production, save to database)
        self.onboarding_data[user_id] = processed_data
        
        return {
            'success': True,
            'onboarding_id': processed_data['onboarding_id'],
            'insights': processed_data['derived_insights'],
            'personalization_ready': True
        }
    
    def _derive_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Derive insights and personalization data from onboarding responses
        """
        insights = {
            'risk_profile': self._calculate_risk_profile(data),
            'investment_style': self._determine_investment_style(data),
            'ai_assistance_level': data.get('ai_involvement', 'advisory'),
            'sector_focus': data.get('sector_interests', []),
            'recommended_allocation': self._suggest_allocation(data),
            'onboarding_score': self._calculate_completion_score(data)
        }
        
        return insights
    
    def _calculate_risk_profile(self, data: Dict[str, Any]) -> str:
        """Calculate user's risk profile based on responses"""
        risk_tolerance = data.get('risk_tolerance', 5)
        loss_comfort = data.get('loss_comfort', 'stay-calm')
        target_return = data.get('target_return', 'moderate')
        
        risk_score = 0
        
        # Risk tolerance scale (1-10)
        risk_score += risk_tolerance
        
        # Loss comfort adjustment
        loss_comfort_scores = {
            'panic-sell': -2,
            'worry-hold': 0,
            'stay-calm': 2,
            'buy-more': 4
        }
        risk_score += loss_comfort_scores.get(loss_comfort, 0)
        
        # Target return adjustment
        return_scores = {
            'conservative': -1,
            'moderate': 1,
            'aggressive': 3,
            'speculative': 5
        }
        risk_score += return_scores.get(target_return, 0)
        
        # Categorize final score
        if risk_score <= 6:
            return 'conservative'
        elif risk_score <= 12:
            return 'moderate'
        else:
            return 'aggressive'
    
    def _determine_investment_style(self, data: Dict[str, Any]) -> str:
        """Determine user's investment style preferences"""
        user_type = data.get('user_type', 'intermediate')
        primary_goal = data.get('primary_goal', 'wealth-building')
        timeline = data.get('investment_timeline', 'medium')
        
        if user_type == 'beginner' or primary_goal == 'learning':
            return 'educational'
        elif primary_goal == 'income' or timeline == 'short':
            return 'income-focused'
        elif primary_goal == 'retirement' or timeline == 'long':
            return 'growth-focused'
        else:
            return 'balanced'
    
    def _suggest_allocation(self, data: Dict[str, Any]) -> Dict[str, float]:
        """Suggest portfolio allocation based on user profile"""
        risk_profile = self._calculate_risk_profile(data)
        investment_amount = data.get('investment_amount', 'medium')
        
        # Base allocations by risk profile
        allocations = {
            'conservative': {'stocks': 40, 'bonds': 50, 'cash': 10},
            'moderate': {'stocks': 60, 'bonds': 30, 'cash': 10},
            'aggressive': {'stocks': 80, 'bonds': 15, 'cash': 5}
        }
        
        base_allocation = allocations.get(risk_profile, allocations['moderate'])
        
        # Adjust based on investment amount
        if investment_amount == 'small':
            # Smaller amounts should focus on stocks for growth
            base_allocation['stocks'] += 10
            base_allocation['bonds'] -= 10
        
        return base_allocation
    
    def _calculate_completion_score(self, data: Dict[str, Any]) -> float:
        """Calculate how complete the onboarding is (0-100)"""
        if data.get('skipped', False):
            return 25.0  # Minimal score for skipped onboarding
        
        total_questions = 16  # Total questions in our schema
        answered_questions = len([k for k, v in data.items() if v is not None and v != []])
        
        return min(100.0, (answered_questions / total_questions) * 100)
    
    async def get_onboarding_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user's onboarding data"""
        return self.onboarding_data.get(user_id)
    
    async def update_preferences(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update specific user preferences after onboarding"""
        existing_data = self.onboarding_data.get(user_id)
        if not existing_data:
            raise ValueError("No onboarding data found for user")
        
        # Merge updates
        existing_data['data'].update(updates)
        existing_data['derived_insights'] = self._derive_insights(existing_data['data'])
        existing_data['updated_at'] = datetime.utcnow().isoformat()
        
        return existing_data
    
    async def get_personalization_config(self, user_id: str) -> Dict[str, Any]:
        """Get personalization configuration for frontend"""
        data = await self.get_onboarding_data(user_id)
        if not data:
            return self._get_default_config()
        
        insights = data['derived_insights']
        
        return {
            'news_sources': self._get_recommended_news_sources(data['data']),
            'stock_filters': {
                'sectors': data['data'].get('sector_interests', []),
                'risk_level': insights['risk_profile'],
                'themes': data['data'].get('investment_themes', [])
            },
            'ai_settings': {
                'involvement_level': data['data'].get('ai_involvement', 'advisory'),
                'notifications': data['data'].get('notification_preferences', []),
                'research_depth': data['data'].get('research_depth', 'balanced')
            },
            'portfolio_suggestions': {
                'allocation': insights['recommended_allocation'],
                'rebalancing_frequency': 'monthly' if insights['risk_profile'] == 'conservative' else 'quarterly'
            }
        }
    
    def _get_recommended_news_sources(self, data: Dict[str, Any]) -> List[str]:
        """Get recommended news sources based on interests"""
        sectors = data.get('sector_interests', [])
        themes = data.get('investment_themes', [])
        
        sources = ['Reuters', 'Yahoo Finance']  # Default free sources
        
        # Add specialized sources based on interests
        if 'technology' in sectors or 'ai' in themes:
            sources.extend(['TechCrunch', 'Ars Technica'])
        if 'healthcare' in sectors or 'genomics' in themes:
            sources.extend(['BioPharma Dive', 'STAT News'])
        if 'financial' in sectors or 'fintech' in themes:
            sources.extend(['Financial Times', 'American Banker'])
        
        return list(set(sources))  # Remove duplicates
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Default configuration for users without onboarding"""
        return {
            'news_sources': ['Reuters', 'Yahoo Finance'],
            'stock_filters': {
                'sectors': ['technology', 'healthcare', 'financial'],
                'risk_level': 'moderate',
                'themes': []
            },
            'ai_settings': {
                'involvement_level': 'advisory',
                'notifications': ['major-moves', 'earnings'],
                'research_depth': 'balanced'
            },
            'portfolio_suggestions': {
                'allocation': {'stocks': 60, 'bonds': 30, 'cash': 10},
                'rebalancing_frequency': 'quarterly'
            }
        }
