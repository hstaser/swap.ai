import jwt
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional
import hashlib
import logging

from ..models import RegisterRequest, AuthResponse

logger = logging.getLogger(__name__)

class AuthService:
    """Service for user authentication and authorization"""
    
    def __init__(self):
        # In production, use proper secret management
        self.jwt_secret = "your-secret-key-change-in-production"
        self.algorithm = "HS256"
        self.token_expiry_hours = 24
        
        # In production, this would be a database
        self.users: Dict[str, Dict] = {}
        
        # Create demo user
        self._create_demo_user()
    
    def _create_demo_user(self):
        """Create a demo user for development"""
        demo_user = {
            "id": str(uuid.uuid4()),
            "email": "demo@swipr.ai",
            "password_hash": self._hash_password("demo123"),
            "first_name": "Demo",
            "last_name": "User",
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        self.users[demo_user["email"]] = demo_user
        logger.info("Created demo user: demo@swipr.ai / demo123")
    
    def _hash_password(self, password: str) -> str:
        """Hash password using SHA-256 (use bcrypt in production)"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        return self._hash_password(password) == password_hash
    
    def _generate_token(self, user: Dict) -> str:
        """Generate JWT token for user"""
        payload = {
            "user_id": user["id"],
            "email": user["email"],
            "exp": datetime.utcnow() + timedelta(hours=self.token_expiry_hours),
            "iat": datetime.utcnow()
        }
        
        return jwt.encode(payload, self.jwt_secret, algorithm=self.algorithm)
    
    def register(self, request: RegisterRequest) -> AuthResponse:
        """Register new user"""
        try:
            # Check if user already exists
            if request.email in self.users:
                raise ValueError("User with this email already exists")
            
            # Create new user
            user = {
                "id": str(uuid.uuid4()),
                "email": request.email,
                "password_hash": self._hash_password(request.password),
                "first_name": request.first_name,
                "last_name": request.last_name,
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            
            self.users[request.email] = user
            
            # Generate token
            token = self._generate_token(user)
            
            # Return response (don't include password hash)
            user_data = {k: v for k, v in user.items() if k != "password_hash"}
            
            logger.info(f"Registered new user: {request.email}")
            
            return AuthResponse(
                access_token=token,
                user=user_data
            )
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            raise
    
    def authenticate(self, email: str, password: str) -> AuthResponse:
        """Authenticate user with email and password"""
        try:
            # Find user
            user = self.users.get(email)
            if not user:
                raise ValueError("Invalid credentials")
            
            # Verify password
            if not self._verify_password(password, user["password_hash"]):
                raise ValueError("Invalid credentials")
            
            # Check if user is active
            if not user.get("is_active", True):
                raise ValueError("Account is disabled")
            
            # Generate token
            token = self._generate_token(user)
            
            # Return response (don't include password hash)
            user_data = {k: v for k, v in user.items() if k != "password_hash"}
            
            logger.info(f"Authenticated user: {email}")
            
            return AuthResponse(
                access_token=token,
                user=user_data
            )
            
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise
    
    def verify_token(self, token: str) -> Optional[Dict]:
        """Verify JWT token and return user data"""
        try:
            # Decode token
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.algorithm])
            
            # Get user
            user_id = payload.get("user_id")
            email = payload.get("email")
            
            if not user_id or not email:
                return None
            
            # Find user in database
            user = self.users.get(email)
            if not user or user["id"] != user_id:
                return None
            
            # Check if user is still active
            if not user.get("is_active", True):
                return None
            
            # Return user data (without password hash)
            return {k: v for k, v in user.items() if k != "password_hash"}
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return None
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            return None
    
    def refresh_token(self, token: str) -> Optional[str]:
        """Refresh JWT token"""
        try:
            # Verify current token
            user = self.verify_token(token)
            if not user:
                return None
            
            # Generate new token
            new_token = self._generate_token(user)
            
            logger.info(f"Refreshed token for user: {user['email']}")
            return new_token
            
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return None
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        try:
            for user in self.users.values():
                if user["id"] == user_id:
                    return {k: v for k, v in user.items() if k != "password_hash"}
            return None
            
        except Exception as e:
            logger.error(f"Get user error: {str(e)}")
            return None
    
    def update_user(self, user_id: str, updates: Dict) -> Optional[Dict]:
        """Update user information"""
        try:
            # Find user
            user = None
            user_email = None
            for email, u in self.users.items():
                if u["id"] == user_id:
                    user = u
                    user_email = email
                    break
            
            if not user:
                return None
            
            # Update allowed fields
            allowed_fields = ["first_name", "last_name", "is_active"]
            for field, value in updates.items():
                if field in allowed_fields:
                    user[field] = value
            
            # Handle password update separately
            if "password" in updates:
                user["password_hash"] = self._hash_password(updates["password"])
            
            # Handle email update (requires re-keying the dict)
            if "email" in updates and updates["email"] != user_email:
                new_email = updates["email"]
                if new_email in self.users:
                    raise ValueError("Email already exists")
                
                # Remove old email key and add new one
                del self.users[user_email]
                user["email"] = new_email
                self.users[new_email] = user
            
            logger.info(f"Updated user: {user['email']}")
            
            # Return user data without password hash
            return {k: v for k, v in user.items() if k != "password_hash"}
            
        except Exception as e:
            logger.error(f"Update user error: {str(e)}")
            raise
    
    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        try:
            updates = {"is_active": False}
            result = self.update_user(user_id, updates)
            
            if result:
                logger.info(f"Deactivated user: {result['email']}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Deactivate user error: {str(e)}")
            return False
