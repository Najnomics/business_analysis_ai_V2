# Somna AI - Documentation
*Powered by Elite Global AI*

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [API Documentation](#api-documentation)
8. [Frontend Features](#frontend-features)
9. [AI Integration](#ai-integration)
10. [Theme System](#theme-system)
11. [Development Guidelines](#development-guidelines)
12. [Deployment](#deployment)
13. [Testing](#testing)
14. [Contributing](#contributing)

---

## Project Overview

Somna AI is a next-generation AI-powered business analysis platform that transforms business ideas into actionable strategies. Inspired by VenturusAI's proven approach, Somna AI provides comprehensive strategic analysis using multiple AI models and advanced business frameworks.

### Key Features
- **Multi-AI Consensus Engine**: Powered by DeepSeek and Gemini AI
- **Comprehensive Analysis Frameworks**: SWOT, PESTEL, Porter's Five Forces, Blue Ocean Strategy
- **Modern UI/UX**: Light/dark mode with professional Dream Tech color palette
- **Elite Global AI Branding**: Integrated branding and footer links
- **Real-time Analytics**: Live statistics and progress tracking
- **Professional Animations**: Smooth transitions and micro-interactions

---

## Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React + TypeScript)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                     API Gateway (FastAPI + RESTful)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                        AI Orchestration Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │   DeepSeek AI   │  │   Gemini AI     │  │  Consensus AI   │           │
│  │   Engine        │  │   Engine        │  │   Engine        │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
├─────────────────────────────────────────────────────────────────────────────┤
│                     Advanced Analytics Engine                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Risk Analysis  │  │ Business Model  │  │ Market Intel    │           │
│  │  Module         │  │ Generator       │  │ Aggregator      │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
├─────────────────────────────────────────────────────────────────────────────┤
│                        Business Logic Layer                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                          MongoDB Database                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                    External APIs & Data Sources                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  DeepSeek API   │  │  Gemini API     │  │  Elite Global   │           │
│  │  Integration    │  │  Integration    │  │  AI Services    │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture
```
Frontend:
├── React Components (Modular)
├── Context Providers (Theme, Auth)
├── Custom Hooks
├── Service Layer (API)
└── UI Component Library

Backend:
├── FastAPI Application
├── AI Service Layer
├── Business Logic Controllers
├── Database Models
└── Authentication Middleware
```

---

## Technology Stack

### Frontend
- **React 19.0.0**: Modern UI library with latest features
- **React Router DOM 7.6.3**: Client-side routing
- **Axios 1.10.0**: HTTP client for API communication
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

### Backend
- **FastAPI 0.110.1**: Modern Python web framework
- **Motor 3.3.1**: Async MongoDB driver
- **PyJWT 2.10.1**: JSON Web Token implementation
- **BCrypt 4.3.0**: Password hashing
- **Google GenerativeAI 0.8.5**: Gemini AI integration
- **HTTPX 0.28.1**: Async HTTP client for DeepSeek

### Database
- **MongoDB**: Document-based NoSQL database
- **Collections**: users, business_analyses, statistics

### AI Services
- **DeepSeek AI**: Advanced reasoning and analysis
- **Gemini AI**: Multi-modal intelligence and insights
- **Consensus Engine**: Cross-validation and confidence scoring

### DevOps & Tools
- **Supervisor**: Process management
- **CRACO**: Create React App Configuration Override
- **ESLint & Prettier**: Code formatting and linting
- **Git**: Version control

---

## Project Structure

```
somna-ai/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend environment variables
├── frontend/                   # React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── layout/       # Layout components (Header, Footer)
│   │   │   └── ui/            # UI components (Button, Card, etc.)
│   │   ├── contexts/         # React contexts
│   │   │   ├── ThemeContext.js    # Theme management
│   │   │   └── AuthContext.js     # Authentication
│   │   ├── pages/            # Page components
│   │   │   └── LandingPage.js     # Main landing page
│   │   ├── App.js            # Main App component
│   │   ├── App.css           # Global styles
│   │   └── index.js          # Entry point
│   ├── package.json          # Dependencies and scripts
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── postcss.config.js     # PostCSS configuration
│   └── .env                  # Frontend environment variables
├── client/                    # Component library (future)
│   └── src/                  # Reusable components
├── server/                    # Backend modules (future structure)
│   ├── controllers/          # Route controllers
│   ├── services/             # Business logic services
│   ├── models/               # Data models
│   └── config/               # Configuration files
├── tests/                     # Test files
├── DOCUMENTATION.md          # This file
└── README.md                 # Project README
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- Python (v3.11 or higher)
- MongoDB (v4.4 or higher)
- Yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/najnomics/business_analysis_ai_v2.git
cd business_analysis_ai_v2
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Step 4: Database Setup
```bash
# Start MongoDB
sudo systemctl start mongod  # On systemd systems

# Or using Docker
docker run -d -p 27017:27017 --name somna-mongo mongo:latest
```

### Step 5: Start Services
```bash
# Start all services using supervisor
sudo supervisorctl start all

# Or start individually
# Backend: cd backend && python server.py
# Frontend: cd frontend && yarn start
```

---

## Configuration

### Backend Environment Variables (.env)
```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=somna_ai_db

# AI Model Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
GEMINI_API_KEY=your_gemini_api_key

# Model Selection Strategy
PRIMARY_AI_MODEL=deepseek
SECONDARY_AI_MODEL=gemini
CONSENSUS_THRESHOLD=0.75

# Demo Mode (set to false when API keys are working)
DEMO_MODE=true

# JWT Configuration
JWT_SECRET=somna_ai_jwt_secret_key_2024_secure_random_string
JWT_EXPIRES_IN=7d
```

### Frontend Environment Variables (.env)
```env
# Backend API URL
REACT_APP_BACKEND_URL=https://your-backend-url.com

# WebSocket configuration
WDS_SOCKET_PORT=443
```

### AI API Keys Setup

#### DeepSeek API
1. Visit [DeepSeek Developer Portal](https://platform.deepseek.com)
2. Create an account and generate API key
3. Add to backend `.env` as `DEEPSEEK_API_KEY`

#### Gemini AI API
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API key for Gemini
3. Add to backend `.env` as `GEMINI_API_KEY`

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: Same as register
```

### Business Analysis Endpoints

#### Create Business Analysis
```http
POST /api/analysis/business
Authorization: Bearer <token>
Content-Type: application/json

{
  "business_idea": "AI-powered sustainable fashion marketplace",
  "industry": "Fashion & Retail",
  "stage": "seed",
  "target_market": "Environmentally conscious millennials",
  "analysis_types": ["swot", "pestel", "porter_five_forces"],
  "ai_models": ["deepseek", "gemini"],
  "consensus_mode": true,
  "depth": "comprehensive"
}
```

#### Get Analysis Results
```http
GET /api/analysis/{analysis_id}
Authorization: Bearer <token>
```

#### Get Analysis History
```http
GET /api/analysis/history?skip=0&limit=10
Authorization: Bearer <token>
```

### Public Endpoints

#### Statistics
```http
GET /api/stats

Response:
{
  "users": "12,847+",
  "avgGenerationTime": "42 seconds",
  "accountsCreated": "12,847",
  "venturesAnalyzed": "23,156"
}
```

#### Health Check
```http
GET /api/

Response:
{
  "message": "Somna AI - Business Analysis Platform",
  "version": "2.0.0",
  "powered_by": "Elite Global AI"
}
```

---

## Frontend Features

### Landing Page Components

#### Hero Section
- Animated title with gradient text effects
- Call-to-action buttons (Start for Free, Live Demo)
- Trust indicators with live statistics
- Elite Global AI branding

#### Statistics Dashboard
- Real-time user statistics
- Active users, analyses created
- Average generation time
- Professional card layout

#### Features Showcase
- Interactive feature cards with hover effects
- SWOT, PESTEL, Porter's Five Forces highlights
- AI-powered insights section
- Financial projections and risk assessment

#### Testimonials
- Customer feedback section
- Professional avatars and company information
- Social proof elements

#### FAQ Section
- Expandable questions and answers
- Common queries about Somna AI
- Technical and business information

### Theme System

#### Light Mode (Dream Tech Palette)
```css
Primary: #2c3e50 (Deep Indigo)
Secondary: #8e9aaf (Soft Periwinkle)
Accent: #1abc9c (Luminous Teal)
Success: #27ae60 (Sage Green)
Warning: #f39c12 (Warm Amber)
Background: #ffffff (Crisp White)
Text: #2c3e50 (Near Black)
```

#### Dark Mode
```css
Primary: #3b82f6 (Bright Blue)
Secondary: #8b5cf6 (Purple)
Accent: #06b6d4 (Cyan)
Background: #0f172a (Slate 900)
Text: #f8fafc (Slate 50)
```

### UI Components

#### Button Component
- Multiple variants: primary, secondary, accent, outline, ghost
- Size options: small, medium, large, xl
- Loading states with spinner
- Hover animations and focus states

#### Card Component
- Flexible padding options
- Shadow and hover effects
- Gradient support
- Responsive design

#### Theme Toggle
- Smooth transitions between light/dark modes
- Icon animations
- Persistent theme preference

---

## AI Integration

### DeepSeek AI Service
```python
class DeepSeekService:
    def __init__(self):
        self.api_key = DEEPSEEK_API_KEY
        self.base_url = DEEPSEEK_BASE_URL
        
    async def analyze(self, prompt: str) -> Dict[str, Any]:
        # AI analysis implementation
        # Returns structured JSON analysis
```

### Gemini AI Service
```python
class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        
    async def analyze(self, prompt: str) -> Dict[str, Any]:
        # AI analysis implementation
        # Returns structured JSON analysis
```

### Consensus Engine
- Cross-validation between multiple AI models
- Confidence scoring algorithms
- Conflict detection and resolution
- Weighted consensus calculations

### Analysis Types Supported
1. **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
2. **PESTEL Analysis**: Political, Economic, Social, Technological, Environmental, Legal
3. **Porter's Five Forces**: Competitive analysis framework
4. **Blue Ocean Strategy**: Value innovation analysis
5. **Business Model Canvas**: 9-component business model
6. **Risk Assessment**: Comprehensive risk evaluation
7. **Financial Projections**: Revenue forecasting and valuation
8. **Market Sizing**: TAM/SAM/SOM calculations

---

## Development Guidelines

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React best practices and hooks patterns
- Implement TypeScript for type safety (future enhancement)
- Use semantic HTML and accessibility standards

### Component Development
- Create reusable, modular components
- Use compound component patterns where appropriate
- Implement proper prop validation
- Include loading and error states

### State Management
- Use React Context for global state (Theme, Auth)
- Implement custom hooks for business logic
- Keep component state local when possible
- Use proper dependency arrays in useEffect

### API Integration
- Implement proper error handling
- Use loading states for better UX
- Cache API responses where appropriate
- Handle authentication and token refresh

### Testing Strategy
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API endpoints
- E2E tests for critical user flows

---

## Deployment

### Production Environment Setup

#### Backend Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Set production environment variables
export NODE_ENV=production
export DEMO_MODE=false

# Start with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app
```

#### Frontend Deployment
```bash
# Build production assets
yarn build

# Serve with nginx or similar
# Configure reverse proxy to backend
```

#### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

#### Environment Configuration
- Use environment-specific .env files
- Secure API keys with proper secret management
- Configure CORS for production domains
- Set up SSL/TLS certificates

### Monitoring & Logging
- Implement structured logging
- Set up error tracking (Sentry)
- Monitor API performance and usage
- Track user analytics and conversion metrics

---

## Testing

### Backend Testing
```bash
# Run unit tests
pytest tests/

# Run with coverage
pytest --cov=server tests/

# Integration tests
pytest tests/integration/
```

### Frontend Testing
```bash
# Run component tests
yarn test

# Run E2E tests
yarn test:e2e

# Generate coverage report
yarn test:coverage
```

### Test Structure
```
tests/
├── backend/
│   ├── unit/
│   │   ├── test_auth.py
│   │   ├── test_ai_services.py
│   │   └── test_analysis.py
│   ├── integration/
│   │   ├── test_api_endpoints.py
│   │   └── test_database.py
│   └── fixtures/
├── frontend/
│   ├── components/
│   │   ├── Header.test.js
│   │   ├── Footer.test.js
│   │   └── LandingPage.test.js
│   ├── contexts/
│   │   ├── ThemeContext.test.js
│   │   └── AuthContext.test.js
│   └── utils/
└── e2e/
    ├── user_registration.spec.js
    ├── business_analysis.spec.js
    └── theme_switching.spec.js
```

---

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Follow semantic commit message format

### Issue Reporting
- Use issue templates for bug reports and feature requests
- Provide detailed reproduction steps
- Include environment information
- Add relevant labels and assignees

### Code Review Process
- All changes require peer review
- Automated tests must pass
- Documentation must be updated
- Follow security best practices

---

## Support & Contact

### Documentation
- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)

### Community
- [GitHub Discussions](https://github.com/najnomics/business_analysis_ai_v2/discussions)
- [Discord Community](https://discord.gg/somna-ai)

### Elite Global AI Contact
- **Website**: [https://www.eliteglobalai.com](https://www.eliteglobalai.com)
- **Contact**: [https://www.eliteglobalai.com/contact](https://www.eliteglobalai.com/contact)
- **LinkedIn**: [Elite Global AI Company](https://www.linkedin.com/company/elite-global-ai/)
- **Email**: support@eliteglobalai.com

### Technical Support
- **GitHub Issues**: [Report Issues](https://github.com/najnomics/business_analysis_ai_v2/issues)
- **Email**: tech-support@somna-ai.com

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Elite Global AI** for platform development and AI expertise
- **VenturusAI** for inspiration and proven business model approach
- **DeepSeek** and **Google** for AI model access and capabilities
- **Open Source Community** for excellent libraries and frameworks

---

*Built with ❤️ by Elite Global AI*

**Version**: 2.0.0  
**Last Updated**: January 2025  
**Status**: Active Development