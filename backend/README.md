# Swipr.AI Backend

Python FastAPI backend for the Swipr.AI stock discovery and portfolio management platform.

## Features

🤖 **AI Agent System**
- Learns from user behavior
- Provides intelligent portfolio interventions
- AI-powered chat assistant

📈 **Stock Management**
- Real-time stock data
- Advanced filtering and search
- News and market sentiment analysis

💼 **Portfolio Operations**
- Portfolio optimization algorithms
- Risk assessment and rebalancing
- Performance analytics

🎯 **Queue System**
- Stock queue management
- Confidence-based ordering
- Batch processing for trades

🔐 **Authentication & Security**
- JWT-based authentication
- Secure password hashing
- Role-based access control

## Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Development Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run development server**
   ```bash
   python start_dev.py
   ```

   Or manually:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the API**
   - API Server: http://localhost:8000
   - Interactive Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Using Docker

```bash
# Build image
docker build -t swipr-backend .

# Run container
docker run -p 8000:8000 swipr-backend
```

## API Documentation

### Authentication
```bash
# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@swipr.ai", "password": "demo123"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/stocks"
```

### Demo Credentials
- Email: `demo@swipr.ai`
- Password: `demo123`

### Key Endpoints

#### AI Agent
- `POST /ai-agent/setup` - Setup AI agent profile
- `GET /ai-agent/profile` - Get agent profile
- `POST /ai-agent/track-swipe` - Track user behavior
- `GET /ai-agent/interventions` - Get AI interventions
- `POST /ai-agent/chat` - Chat with AI assistant

#### Stocks
- `GET /stocks` - Get filtered stocks
- `GET /stocks/{symbol}` - Get stock details
- `GET /stocks/{symbol}/news` - Get stock news

#### Portfolio
- `GET /portfolio` - Get user portfolio
- `POST /portfolio/optimize` - Optimize allocation

#### Queue
- `GET /queue` - Get user's stock queue
- `POST /queue/add` - Add stock to queue
- `DELETE /queue/{symbol}` - Remove from queue

#### Watchlist
- `GET /watchlist` - Get watchlist
- `POST /watchlist/add` - Add to watchlist

## Architecture

```
backend/
├── main.py                 # FastAPI application entry point
├── models.py              # Pydantic models and schemas
├── services/              # Business logic services
│   ├── ai_agent_service.py    # AI agent and behavior tracking
│   ├── stock_service.py       # Stock data and operations
│   ├── portfolio_service.py   # Portfolio management
│   ├── queue_service.py       # Queue operations
│   └── auth_service.py        # Authentication
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
└── start_dev.py         # Development startup script
```

## AI Agent System

The AI agent learns from user behavior and provides intelligent interventions:

### Learning Phase
- Tracks all user swipes (skip, queue, watchlist)
- Analyzes sector and risk preferences
- Builds behavioral profile over time

### Intervention Types
1. **Diversification** - "Too much in one sector?"
2. **Risk Check** - "Off-track from your goal?"
3. **Strategy Focus** - "High-conviction theme detected?"
4. **Rebalancing** - "You've drifted from plan"

### AI Chat Features
- Portfolio analysis
- Investment recommendations
- Risk assessment
- Hedging strategies
- Rebalancing advice

## Production Deployment

### Environment Variables
Copy `.env.example` to `.env` and configure:
- Database credentials
- JWT secret keys
- External API keys
- Email settings

### Database Setup
```bash
# Install PostgreSQL
# Create database and user
# Run migrations (when available)
```

### Monitoring
- Health check endpoint: `/health`
- Logs structured for production monitoring
- Sentry integration for error tracking

## Development

### Code Quality
```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .

# Run tests
pytest
```

### Adding New Features
1. Define models in `models.py`
2. Implement service logic in `services/`
3. Add API endpoints in `main.py`
4. Write tests
5. Update documentation

## Mobile App Integration

This backend is designed for mobile app development:

- **RESTful API** - Standard HTTP endpoints
- **JWT Authentication** - Stateless, mobile-friendly
- **JSON Responses** - Easy to consume in mobile apps
- **Real-time Updates** - WebSocket support planned
- **Offline Support** - Structured for caching strategies

The React frontend can be converted to React Native, consuming these same APIs.

## Support

For development support:
- Check the interactive docs at `/docs`
- Review the code comments
- Examine the example requests
- Test endpoints with the built-in Swagger UI

## License

Proprietary - Swipr.AI Platform
