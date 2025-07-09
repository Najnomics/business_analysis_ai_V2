# Somna AI - Business Analysis Platform Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Frontend Documentation](#frontend-documentation)
8. [Deployment](#deployment)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)

## Overview

Somna AI is a next-generation AI-powered business analysis platform that provides comprehensive business intelligence across 25+ analytical frameworks. Built by Elite Global AI, it leverages multiple AI models (DeepSeek and Gemini) to deliver deep, actionable business insights.

### Key Capabilities
- **Multi-AI Analysis**: Consensus-driven insights from multiple AI models
- **25+ Frameworks**: Comprehensive coverage of business analysis methodologies
- **Professional Reports**: Export to PDF, PowerPoint, and Word formats
- **Real-time Processing**: Live analysis status updates
- **User Management**: Complete authentication and authorization system
- **Email Notifications**: Automated welcome and completion emails

## Features

### Core Analysis Frameworks
1. **Strategic Analysis**
   - SWOT Analysis
   - PESTEL Analysis
   - Porter's Five Forces
   - Blue Ocean Strategy
   - VRIO Framework
   - BCG Matrix

2. **Business Model Analysis**
   - Business Model Canvas
   - Revenue Model Analysis
   - Unit Economics
   - Break-even Analysis

3. **Market Intelligence**
   - Competitive Landscape
   - Customer Segmentation
   - Market Intelligence
   - Trend Analysis
   - Benchmarking

4. **Financial Analysis**
   - Financial Analysis
   - Cost-Benefit Analysis
   - Working Capital Analysis
   - Scenario Analysis

5. **Operational Excellence**
   - Process Mapping
   - Value Stream Mapping
   - Lean Six Sigma
   - Capacity Planning
   - KPI Dashboard

6. **Strategic Planning**
   - Go-to-Market Strategy
   - Risk Assessment
   - Scenario Analysis

### Advanced Features
- **AI Consensus Engine**: Multi-model validation and confidence scoring
- **Professional Export**: Designed and print-friendly document formats
- **Analysis History**: Complete audit trail and searchable history
- **Real-time Updates**: Live status tracking and progress monitoring
- **Email Integration**: Automated notifications and password reset

## Architecture

### Technology Stack

#### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **AI Integration**: DeepSeek API, Google Gemini API
- **Authentication**: JWT with bcrypt password hashing
- **Email**: aiosmtplib with HTML templates
- **Document Generation**: ReportLab (PDF), python-pptx (PowerPoint), python-docx (Word)

#### Frontend
- **Framework**: React 19.0.0
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios 1.10.0
- **Styling**: Tailwind CSS 3.4.17
- **Build Tool**: CRACO (Create React App Configuration Override)

#### Infrastructure
- **Containerization**: Docker-ready configuration
- **Process Management**: Supervisor for production deployment
- **Environment Management**: Environment-specific configurations
- **CORS**: Cross-origin resource sharing enabled

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React + TypeScript)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                           API Gateway (FastAPI)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                        AI Orchestration Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │   DeepSeek AI   │  │   Gemini AI     │  │  Consensus AI   │           │
│  │   Engine        │  │   Engine        │  │   Engine        │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
├─────────────────────────────────────────────────────────────────────────────┤
│                     Business Analysis Engine                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Strategic      │  │ Financial       │  │ Operational     │           │
│  │  Analysis       │  │ Analysis        │  │ Analysis        │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
├─────────────────────────────────────────────────────────────────────────────┤
│                        Business Logic Layer                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                           MongoDB Database                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                         Email Service Layer                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Welcome Email  │  │  Reset Email    │  │ Completion Email│           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites
- Node.js 18.0.0 or higher
- Python 3.8 or higher
- MongoDB 4.4 or higher
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/najnomics/business_analysis_ai_v2.git
   cd business_analysis_ai_v2
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name somna-mongo mongo:latest
   
   # Or start local MongoDB service
   systemctl start mongod
   ```

### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   yarn install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Configuration

### Backend Configuration (.env)

```env
# MongoDB Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="somna_ai"

# AI API Keys
DEEPSEEK_API_KEY="your_deepseek_api_key_here"
GEMINI_API_KEY="your_gemini_api_key_here"
DEEPSEEK_BASE_URL="https://api.deepseek.com"

# Application Settings
DEMO_MODE="false"
JWT_SECRET="your_jwt_secret_key_here_make_it_long_and_random"
JWT_EXPIRES_IN="7d"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASSWORD="your_app_password"
SMTP_FROM_NAME="Somna AI"
SMTP_FROM_EMAIL="noreply@somna-ai.com"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### Frontend Configuration (.env)

```env
# Backend API URL
REACT_APP_BACKEND_URL="http://localhost:8001"

# WebSocket Configuration
WDS_SOCKET_PORT="443"

# Environment
NODE_ENV="development"
```

### Email Template Configuration

Email templates are configured in `backend/email_templates.py`:

- **Welcome Email**: Sent when users register
- **Password Reset Email**: Sent for password reset requests
- **Analysis Complete Email**: Sent when analysis finishes

Templates support HTML formatting and variable substitution.

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
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "new_password": "newSecurePassword123"
}
```

### Business Analysis Endpoints

#### Create Analysis
```http
POST /api/analysis/business
Authorization: Bearer <token>
Content-Type: application/json

{
  "business_input": "AI-powered sustainable fashion marketplace",
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

#### Cancel Analysis
```http
POST /api/analysis/{analysis_id}/cancel
Authorization: Bearer <token>
```

#### Export Analysis
```http
GET /api/analysis/{analysis_id}/export/{format}?style={style}
Authorization: Bearer <token>
```

Where:
- `format`: pdf, pptx, docx
- `style`: designed, black_and_white

### Response Format

```json
{
  "success": true,
  "data": {
    "id": "analysis_id",
    "business_input": "AI-powered sustainable fashion marketplace",
    "comprehensive_results": {
      "swot_analysis": {
        "deepseek": {
          "analysis": {...},
          "confidence_score": 0.85,
          "processing_time": 2.3
        },
        "gemini": {
          "analysis": {...},
          "confidence_score": 0.82,
          "processing_time": 1.9
        }
      }
    },
    "ai_consensus": {
      "consensus_score": 0.84,
      "models_used": ["deepseek", "gemini"],
      "frameworks_analyzed": 25,
      "key_recommendations": [...]
    },
    "confidence_score": 0.84,
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  }
}
```

## Frontend Documentation

### Component Structure

```
src/
├── components/
│   ├── analysis/
│   │   └── AnalysisViewer.js     # Complete analysis display
│   ├── layout/
│   │   ├── Header.js             # Navigation header
│   │   └── Footer.js             # Site footer
│   └── ui/
│       ├── Button.js             # Reusable button component
│       ├── Card.js               # Card container component
│       └── ThemeToggle.js        # Dark/light mode toggle
├── contexts/
│   ├── AuthContext.js            # Authentication state management
│   └── ThemeContext.js           # Theme state management
├── pages/
│   ├── Dashboard.js              # Main application dashboard
│   ├── ForgotPassword.js         # Password reset request
│   ├── LandingPage.js            # Marketing landing page
│   ├── Login.js                  # User authentication
│   ├── Register.js               # User registration
│   └── ResetPassword.js          # Password reset form
└── App.js                        # Main application component
```

### Key Features

#### Analysis Viewer Component
- **Overview Mode**: Grid view of all frameworks
- **Detailed Mode**: Expanded view with previews
- **Framework Mode**: Deep dive into specific framework
- **Export Integration**: Direct export functionality
- **Real-time Updates**: Live status monitoring

#### Authentication Flow
- **Registration**: User signup with email verification
- **Login**: JWT-based authentication
- **Password Reset**: Secure token-based password recovery
- **Session Management**: Persistent login state

#### Theme System
- **Dark/Light Mode**: User preference-based theming
- **Consistent Styling**: Theme-aware component system
- **Responsive Design**: Mobile-first approach

## Deployment

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV="production"
MONGO_URL="mongodb://your-production-mongo-url"
JWT_SECRET="your-production-jwt-secret-very-long-and-random"
DEEPSEEK_API_KEY="your-production-deepseek-key"
GEMINI_API_KEY="your-production-gemini-key"
FRONTEND_URL="https://your-domain.com"
SMTP_HOST="your-production-smtp-host"
SMTP_USER="your-production-email"
SMTP_PASSWORD="your-production-email-password"
```

#### Frontend (.env)
```env
NODE_ENV="production"
REACT_APP_BACKEND_URL="https://your-api-domain.com"
```

### Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### Supervisor Configuration

#### Backend Service
```ini
[program:somna-backend]
command=uvicorn server:app --host 0.0.0.0 --port 8001
directory=/app/backend
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend.err.log
stdout_logfile=/var/log/supervisor/backend.out.log
```

#### Frontend Service
```ini
[program:somna-frontend]
command=yarn start
directory=/app/frontend
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/frontend.err.log
stdout_logfile=/var/log/supervisor/frontend.out.log
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Development Guide

### Backend Development

#### Adding New Analysis Frameworks

1. **Update Framework List**
   ```python
   frameworks = [
       "existing_framework",
       "new_framework_name"
   ]
   ```

2. **Add Framework Prompt**
   ```python
   framework_prompts = {
       "new_framework_name": f"""{base_context}
       Detailed prompt for the new framework analysis...
       """
   }
   ```

3. **Update Mock Analysis**
   ```python
   def _get_mock_analysis(self, prompt: str) -> Dict[str, Any]:
       if "new_framework" in prompt.lower():
           return {
               "analysis": "Mock analysis for new framework"
           }
   ```

#### Email Template Customization

Edit `backend/email_templates.py`:

```python
NEW_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Your custom styles */
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Custom Email</h1>
        <p>Hello {user_name},</p>
        <!-- Your content -->
    </div>
</body>
</html>
"""
```

### Frontend Development

#### Adding New Pages

1. **Create Page Component**
   ```jsx
   // src/pages/NewPage.js
   import React from 'react';
   import { useTheme } from '../contexts/ThemeContext';

   const NewPage = () => {
       const { colors } = useTheme();
       
       return (
           <div style={{ backgroundColor: colors.background }}>
               {/* Your page content */}
           </div>
       );
   };

   export default NewPage;
   ```

2. **Add Route**
   ```jsx
   // src/App.js
   import NewPage from './pages/NewPage';

   <Routes>
       <Route path="/new-page" element={<NewPage />} />
   </Routes>
   ```

#### Theme Customization

Edit theme colors in `src/contexts/ThemeContext.js`:

```jsx
const lightTheme = {
    primary: '#667eea',
    accent: '#764ba2',
    background: '#ffffff',
    // Add your custom colors
};

const darkTheme = {
    primary: '#667eea',
    accent: '#764ba2',
    background: '#0f172a',
    // Add your custom colors
};
```

## Troubleshooting

### Common Issues

#### Backend Issues

**MongoDB Connection Error**
```bash
# Check MongoDB status
systemctl status mongod

# Restart MongoDB
systemctl restart mongod

# Check logs
tail -f /var/log/mongodb/mongod.log
```

**AI API Rate Limits**
- Check API key validity
- Monitor usage quotas
- Implement exponential backoff
- Use demo mode for development

**Email Delivery Issues**
- Verify SMTP credentials
- Check spam/junk folders
- Test with email provider tools
- Review email templates

#### Frontend Issues

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# Clear build cache
yarn build --reset-cache
```

**API Connection Issues**
- Verify backend URL in .env
- Check CORS configuration
- Inspect network requests in DevTools
- Verify authentication tokens

### Performance Optimization

#### Backend Optimization
- Implement response caching
- Add database indexing
- Use connection pooling
- Optimize AI API calls

#### Frontend Optimization
- Implement code splitting
- Add lazy loading
- Optimize bundle size
- Use React.memo for expensive components

### Monitoring and Logging

#### Backend Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

#### Frontend Error Tracking
```jsx
// Add error boundary
class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }
}
```

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and test**
4. **Commit with conventional format**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
5. **Push and create Pull Request**

### Code Standards

#### Backend Standards
- Follow PEP 8 Python style guide
- Use type hints where appropriate
- Write comprehensive docstrings
- Add unit tests for new features

#### Frontend Standards
- Use ESLint configuration
- Follow React best practices
- Write component tests
- Use semantic HTML

### Testing

#### Backend Testing
```bash
cd backend
pytest tests/ -v
```

#### Frontend Testing
```bash
cd frontend
yarn test
```

### Security Considerations

- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Regular security audits

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Documentation
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Deployment Guide](#deployment)

### Contact
- **Email**: support@somna-ai.com
- **Website**: [https://somna-ai.com](https://somna-ai.com)

---

*Built with ❤️ by the Somna AI team - Powered by Elite Global AI*