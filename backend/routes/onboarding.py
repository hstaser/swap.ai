"""
Onboarding API Routes
Handles user onboarding data submission and retrieval
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from ..services.onboarding_service import OnboardingService

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])
onboarding_service = OnboardingService()

class OnboardingSubmission(BaseModel):
    """Model for onboarding data submission"""
    user_type: Optional[str] = Field(None, description="User experience level")
    investment_timeline: Optional[str] = Field(None, description="Investment time horizon")
    sector_interests: Optional[List[str]] = Field(None, description="Preferred sectors")
    investment_themes: Optional[List[str]] = Field(None, description="Investment themes")
    primary_goal: Optional[str] = Field(None, description="Primary investment goal")
    target_return: Optional[str] = Field(None, description="Expected return level")
    investment_amount: Optional[str] = Field(None, description="Initial investment size")
    risk_tolerance: Optional[int] = Field(None, ge=1, le=10, description="Risk tolerance scale")
    loss_comfort: Optional[str] = Field(None, description="Comfort with losses")
    volatility_comfort: Optional[str] = Field(None, description="Comfort with volatility")
    ai_involvement: Optional[str] = Field(None, description="Preferred AI assistance level")
    notification_preferences: Optional[List[str]] = Field(None, description="Notification preferences")
    research_depth: Optional[str] = Field(None, description="Research detail preference")
    marketing_consent: Optional[bool] = Field(None, description="Marketing communication consent")
    data_sharing: Optional[str] = Field(None, description="Data sharing preference")
    skipped: Optional[bool] = Field(False, description="Whether onboarding was skipped")

class OnboardingUpdate(BaseModel):
    """Model for updating specific preferences"""
    preferences: Dict[str, Any] = Field(..., description="Updated preferences")

@router.post("/submit")
async def submit_onboarding(
    submission: OnboardingSubmission,
    user_id: str = "demo_user"  # In production, get from auth token
):
    """
    Submit user onboarding data
    
    Processes and stores user preferences, generates insights,
    and returns personalization configuration.
    """
    try:
        # Convert Pydantic model to dict, excluding None values
        onboarding_data = {
            k: v for k, v in submission.dict().items() 
            if v is not None
        }
        
        # Save onboarding data
        result = await onboarding_service.save_onboarding_data(
            user_id=user_id,
            onboarding_data=onboarding_data
        )
        
        # Get personalization config
        personalization = await onboarding_service.get_personalization_config(user_id)
        
        return {
            "status": "success",
            "message": "Onboarding completed successfully",
            "onboarding_id": result["onboarding_id"],
            "insights": result["insights"],
            "personalization": personalization
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process onboarding data")

@router.get("/data")
async def get_onboarding_data(
    user_id: str = "demo_user"  # In production, get from auth token
):
    """
    Retrieve user's onboarding data
    """
    try:
        data = await onboarding_service.get_onboarding_data(user_id)
        
        if not data:
            raise HTTPException(status_code=404, detail="No onboarding data found")
        
        return {
            "status": "success",
            "data": data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve onboarding data")

@router.get("/personalization")
async def get_personalization_config(
    user_id: str = "demo_user"  # In production, get from auth token
):
    """
    Get personalization configuration based on onboarding data
    """
    try:
        config = await onboarding_service.get_personalization_config(user_id)
        
        return {
            "status": "success",
            "personalization": config
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get personalization config")

@router.put("/preferences")
async def update_preferences(
    update: OnboardingUpdate,
    user_id: str = "demo_user"  # In production, get from auth token
):
    """
    Update specific user preferences after onboarding
    """
    try:
        updated_data = await onboarding_service.update_preferences(
            user_id=user_id,
            updates=update.preferences
        )
        
        # Get updated personalization config
        personalization = await onboarding_service.get_personalization_config(user_id)
        
        return {
            "status": "success",
            "message": "Preferences updated successfully",
            "personalization": personalization
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update preferences")

@router.get("/schema")
async def get_onboarding_schema():
    """
    Get the current onboarding schema for dynamic form generation
    
    This endpoint returns the schema configuration that can be used
    to dynamically generate the onboarding form on the frontend.
    """
    try:
        # In production, this would be loaded from a database or config file
        from ...client.data.onboarding_schema import ONBOARDING_SCHEMA
        
        return {
            "status": "success",
            "schema": {
                "version": "1.0",
                "steps": ONBOARDING_SCHEMA,
                "metadata": {
                    "total_steps": len(ONBOARDING_SCHEMA),
                    "estimated_time": "3-5 minutes",
                    "schema_updated": "2024-01-15T00:00:00Z"
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get onboarding schema")

@router.post("/validate")
async def validate_onboarding_data(submission: OnboardingSubmission):
    """
    Validate onboarding data without saving
    
    Useful for real-time validation during form completion.
    """
    try:
        onboarding_data = {
            k: v for k, v in submission.dict().items() 
            if v is not None
        }
        
        # Perform validation without saving
        validation_result = {
            "valid": True,
            "errors": [],
            "completeness": 0.0
        }
        
        # Check required fields
        required_fields = ['user_type', 'sector_interests', 'primary_goal', 'risk_tolerance']
        missing_fields = [field for field in required_fields if field not in onboarding_data]
        
        if missing_fields and not onboarding_data.get('skipped', False):
            validation_result["valid"] = False
            validation_result["errors"] = [f"Missing required field: {field}" for field in missing_fields]
        
        # Calculate completeness
        total_fields = 15  # Total possible fields
        completed_fields = len([v for v in onboarding_data.values() if v is not None and v != []])
        validation_result["completeness"] = (completed_fields / total_fields) * 100
        
        return {
            "status": "success",
            "validation": validation_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Validation failed")
