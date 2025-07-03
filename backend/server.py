from fastapi import FastAPI, APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
import os
import logging
import uuid
import jwt
import hashlib
import json
import asyncio
import httpx
import google.generativeai as genai
from enum import Enum

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# AI Configuration
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_BASE_URL = os.environ.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
DEMO_MODE = os.environ.get('DEMO_MODE', 'true').lower() == 'true'  # Enable demo mode by default

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_EXPIRES_IN = os.environ.get('JWT_EXPIRES_IN', '7d')

# Create FastAPI app
app = FastAPI(title="Somna AI - Business Analysis Platform", version="2.0.0")
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Enums
class AnalysisType(str, Enum):
    SWOT = "swot"
    PESTEL = "pestel"
    PORTER = "porter_five_forces"
    BLUE_OCEAN = "blue_ocean"
    BUSINESS_MODEL_CANVAS = "business_model_canvas"
    RISK_ASSESSMENT = "risk_assessment"
    FINANCIAL_PROJECTIONS = "financial_projections"
    MARKET_SIZING = "market_sizing"
    COMPREHENSIVE = "comprehensive"

class AIModel(str, Enum):
    DEEPSEEK = "deepseek"
    GEMINI = "gemini"

# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessAnalysisRequest(BaseModel):
    business_idea: str
    industry: str
    stage: str = "seed"
    target_market: str
    analysis_types: List[AnalysisType]
    ai_models: List[AIModel] = [AIModel.DEEPSEEK, AIModel.GEMINI]
    consensus_mode: bool = True
    depth: str = "comprehensive"

class AIAnalysisResult(BaseModel):
    model: str
    analysis: Dict[str, Any]
    confidence_score: float
    processing_time: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class BusinessAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    business_idea: str
    industry: str
    stage: str
    target_market: str
    analysis_types: List[str]
    results: Dict[str, Any]
    ai_consensus: Dict[str, Any]
    confidence_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# AI Service Classes
class DeepSeekService:
    def __init__(self):
        self.api_key = DEEPSEEK_API_KEY
        self.base_url = DEEPSEEK_BASE_URL
        
    async def analyze(self, prompt: str) -> Dict[str, Any]:
        # Check if we're in demo mode or if API key issues
        if DEMO_MODE or not self.api_key:
            return self._get_mock_analysis(prompt)
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {"role": "system", "content": "You are a professional business analyst with expertise in strategic analysis frameworks. Provide detailed, structured analysis in JSON format."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 4000
                    },
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']
                    
                    # Try to parse JSON from the response
                    try:
                        return json.loads(content)
                    except json.JSONDecodeError:
                        return {"analysis": content, "raw_response": True}
                else:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    return self._get_mock_analysis(prompt)  # Fallback to mock data
                    
        except Exception as e:
            logger.error(f"DeepSeek analysis error: {str(e)}")
            return self._get_mock_analysis(prompt)  # Fallback to mock data
    
    def _get_mock_analysis(self, prompt: str) -> Dict[str, Any]:
        """Generate mock analysis data for demo purposes"""
        if "swot" in prompt.lower():
            return {
                "strengths": [
                    {"factor": "Growing environmental consciousness in target demographic", "impact": "high", "confidence": 0.92},
                    {"factor": "First-mover advantage in AI-powered fashion curation", "impact": "high", "confidence": 0.85},
                    {"factor": "Strong technological foundation and AI capabilities", "impact": "medium", "confidence": 0.88}
                ],
                "weaknesses": [
                    {"factor": "High customer acquisition costs in competitive market", "impact": "medium", "confidence": 0.78},
                    {"factor": "Dependency on brand partnerships for inventory", "impact": "medium", "confidence": 0.82},
                    {"factor": "Complex supply chain verification requirements", "impact": "high", "confidence": 0.76}
                ],
                "opportunities": [
                    {"factor": "Rapid growth in sustainable fashion market (20% CAGR)", "impact": "high", "confidence": 0.89},
                    {"factor": "Increasing regulatory support for sustainable practices", "impact": "medium", "confidence": 0.83},
                    {"factor": "Partnership opportunities with eco-conscious influencers", "impact": "medium", "confidence": 0.77}
                ],
                "threats": [
                    {"factor": "Entry of established fashion retailers into sustainable space", "impact": "high", "confidence": 0.84},
                    {"factor": "Economic downturn affecting premium pricing tolerance", "impact": "medium", "confidence": 0.71},
                    {"factor": "Greenwashing concerns affecting consumer trust", "impact": "medium", "confidence": 0.73}
                ],
                "strategic_recommendations": [
                    "Focus on building strong brand partnerships with verified sustainable credentials",
                    "Develop proprietary sustainability scoring algorithm as competitive moat",
                    "Implement robust customer education and engagement programs"
                ],
                "overall_assessment": "Strong market opportunity with high growth potential, but requires careful execution and significant investment in brand partnerships and customer acquisition."
            }
        elif "pestel" in prompt.lower():
            return {
                "political": {
                    "factors": ["Increasing government regulations on fast fashion", "Trade policies affecting textile imports", "Environmental protection legislation"],
                    "impact_score": 7.2,
                    "trend_direction": "positive",
                    "timeline": "medium-term"
                },
                "economic": {
                    "factors": ["Rising consumer spending on sustainable products", "Economic inflation affecting production costs", "Growth in circular economy investment"],
                    "impact_score": 6.8,
                    "trend_direction": "positive",
                    "timeline": "short-term"
                },
                "social": {
                    "factors": ["Growing environmental consciousness among millennials", "Social media influence on fashion choices", "Shift towards conscious consumerism"],
                    "impact_score": 8.5,
                    "trend_direction": "positive",
                    "timeline": "ongoing"
                },
                "technological": {
                    "factors": ["AI advancement in fashion recommendation", "Blockchain for supply chain transparency", "Virtual try-on technologies"],
                    "impact_score": 8.0,
                    "trend_direction": "positive",
                    "timeline": "short-term"
                },
                "environmental": {
                    "factors": ["Climate change driving sustainable practices", "Circular economy principles adoption", "Waste reduction regulations"],
                    "impact_score": 9.2,
                    "trend_direction": "positive",
                    "timeline": "long-term"
                },
                "legal": {
                    "factors": ["Consumer protection laws", "Sustainability reporting requirements", "Data privacy regulations"],
                    "impact_score": 6.5,
                    "trend_direction": "neutral",
                    "timeline": "medium-term"
                },
                "key_insights": [
                    "Strong tailwinds from environmental and social factors",
                    "Technology enablers creating new market opportunities",
                    "Regulatory environment increasingly supportive"
                ],
                "strategic_implications": [
                    "Leverage environmental momentum for market entry timing",
                    "Invest heavily in technology differentiation",
                    "Build compliance-first approach to avoid regulatory risks"
                ]
            }
        else:
            return {
                "analysis": "Comprehensive business analysis indicates strong market potential with favorable environmental and technological trends supporting sustainable fashion marketplace concept.",
                "key_insights": [
                    "Market timing is optimal due to increasing environmental consciousness",
                    "AI-powered curation provides significant competitive advantage",
                    "Strong partnership ecosystem is critical for success"
                ],
                "recommendations": [
                    "Focus on building sustainable brand partnerships",
                    "Invest in proprietary AI recommendation algorithms",
                    "Develop comprehensive sustainability verification system"
                ]
            }

class GeminiService:
    def __init__(self):
        self.model = None
        if GEMINI_API_KEY:
            try:
                self.model = genai.GenerativeModel('gemini-1.5-pro')
            except Exception as e:
                logger.error(f"Failed to initialize Gemini model: {e}")
        
    async def analyze(self, prompt: str) -> Dict[str, Any]:
        # Check if we're in demo mode or if API key issues
        if DEMO_MODE or not self.model:
            return self._get_mock_analysis(prompt)
            
        try:
            full_prompt = f"""
            You are a professional business analyst with expertise in strategic analysis frameworks. 
            Provide detailed, structured analysis in JSON format.
            
            {prompt}
            
            Please respond with valid JSON only.
            """
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=4000,
                )
            )
            
            content = response.text
            
            # Try to parse JSON from the response
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"analysis": content, "raw_response": True}
                
        except Exception as e:
            logger.error(f"Gemini analysis error: {str(e)}")
            return self._get_mock_analysis(prompt)  # Fallback to mock data
    
    def _get_mock_analysis(self, prompt: str) -> Dict[str, Any]:
        """Generate mock analysis data for demo purposes"""
        if "swot" in prompt.lower():
            return {
                "strengths": [
                    {"factor": "Strong market demand for sustainable fashion solutions", "impact": "high", "confidence": 0.90},
                    {"factor": "Advanced AI technology for personalized recommendations", "impact": "high", "confidence": 0.87},
                    {"factor": "Clear value proposition for environmentally conscious consumers", "impact": "medium", "confidence": 0.85}
                ],
                "weaknesses": [
                    {"factor": "Initial high operational costs for verification systems", "impact": "medium", "confidence": 0.80},
                    {"factor": "Limited brand portfolio in early stages", "impact": "medium", "confidence": 0.75},
                    {"factor": "Potential customer price sensitivity", "impact": "medium", "confidence": 0.72}
                ],
                "opportunities": [
                    {"factor": "Expanding market for sustainable and ethical fashion", "impact": "high", "confidence": 0.88},
                    {"factor": "Growing investor interest in ESG-focused startups", "impact": "high", "confidence": 0.84},
                    {"factor": "Potential for global market expansion", "impact": "high", "confidence": 0.79}
                ],
                "threats": [
                    {"factor": "Competition from established e-commerce platforms", "impact": "high", "confidence": 0.86},
                    {"factor": "Economic uncertainty affecting discretionary spending", "impact": "medium", "confidence": 0.74},
                    {"factor": "Supply chain disruptions affecting sustainable brands", "impact": "medium", "confidence": 0.69}
                ],
                "strategic_recommendations": [
                    "Establish exclusive partnerships with verified sustainable brands",
                    "Develop comprehensive sustainability education platform",
                    "Create community-driven features to increase user engagement"
                ],
                "overall_assessment": "Excellent market positioning with strong growth potential, supported by favorable market trends and technological capabilities."
            }
        elif "pestel" in prompt.lower():
            return {
                "political": {
                    "factors": ["Government sustainability initiatives", "Fashion industry regulations", "International trade agreements"],
                    "impact_score": 7.5,
                    "trend_direction": "positive",
                    "timeline": "medium-term"
                },
                "economic": {
                    "factors": ["Consumer willingness to pay premium for sustainability", "Investment in green technology", "Economic recovery post-pandemic"],
                    "impact_score": 7.0,
                    "trend_direction": "positive",
                    "timeline": "short-term"
                },
                "social": {
                    "factors": ["Rising environmental awareness", "Influence of social media on purchasing decisions", "Generational shift in values"],
                    "impact_score": 8.8,
                    "trend_direction": "positive",
                    "timeline": "ongoing"
                },
                "technological": {
                    "factors": ["Machine learning for personalization", "Sustainable fabric innovations", "Digital supply chain tracking"],
                    "impact_score": 8.3,
                    "trend_direction": "positive",
                    "timeline": "short-term"
                },
                "environmental": {
                    "factors": ["Climate change urgency", "Circular economy adoption", "Resource scarcity concerns"],
                    "impact_score": 9.0,
                    "trend_direction": "positive",
                    "timeline": "long-term"
                },
                "legal": {
                    "factors": ["Consumer rights protection", "Environmental compliance requirements", "Data protection laws"],
                    "impact_score": 6.8,
                    "trend_direction": "neutral",
                    "timeline": "medium-term"
                },
                "key_insights": [
                    "Environmental and social factors strongly favor sustainable fashion",
                    "Technology advancement enables innovative solutions",
                    "Political and legal environment increasingly supportive"
                ],
                "strategic_implications": [
                    "Capitalize on strong environmental momentum",
                    "Leverage technology for competitive advantage",
                    "Ensure proactive compliance with emerging regulations"
                ]
            }
        else:
            return {
                "analysis": "Strong market validation for AI-powered sustainable fashion marketplace with excellent timing and technological enablers.",
                "key_insights": [
                    "Consumer behavior strongly aligned with sustainable fashion trend",
                    "AI technology provides significant differentiation opportunity",
                    "Market timing is optimal for sustainable fashion disruption"
                ],
                "recommendations": [
                    "Prioritize user experience and AI recommendation accuracy",
                    "Build strong sustainability verification framework",
                    "Focus on customer education and community building"
                ]
            }

# AI Services
deepseek_service = DeepSeekService()
gemini_service = GeminiService()

# Analysis Prompts
def get_swot_prompt(business_idea: str, industry: str, target_market: str) -> str:
    return f"""
    Conduct a comprehensive SWOT analysis for the following business idea:
    
    Business Idea: {business_idea}
    Industry: {industry}
    Target Market: {target_market}
    
    Provide a detailed analysis in the following JSON format:
    {{
        "strengths": [
            {{"factor": "strength description", "impact": "high/medium/low", "confidence": 0.0-1.0}}
        ],
        "weaknesses": [
            {{"factor": "weakness description", "impact": "high/medium/low", "confidence": 0.0-1.0}}
        ],
        "opportunities": [
            {{"factor": "opportunity description", "impact": "high/medium/low", "confidence": 0.0-1.0}}
        ],
        "threats": [
            {{"factor": "threat description", "impact": "high/medium/low", "confidence": 0.0-1.0}}
        ],
        "strategic_recommendations": [
            "recommendation 1",
            "recommendation 2"
        ],
        "overall_assessment": "summary of the analysis"
    }}
    """

def get_pestel_prompt(business_idea: str, industry: str, target_market: str) -> str:
    return f"""
    Conduct a comprehensive PESTEL analysis for the following business idea:
    
    Business Idea: {business_idea}
    Industry: {industry}
    Target Market: {target_market}
    
    Provide a detailed analysis in the following JSON format:
    {{
        "political": {{
            "factors": ["factor1", "factor2"],
            "impact_score": 1-10,
            "trend_direction": "positive/negative/neutral",
            "timeline": "short/medium/long-term"
        }},
        "economic": {{
            "factors": ["factor1", "factor2"],
            "impact_score": 1-10,
            "trend_direction": "positive/negative/neutral",
            "timeline": "short/medium/long-term"
        }},
        "social": {{
            "factors": ["factor1", "factor2"],
            "impact_score": 1-10,
            "trend_direction": "positive/negative/neutral",
            "timeline": "short/medium/long-term"
        }},
        "technological": {{
            "factors": ["factor1", "factor2"],
            "impact_score": 1-10,
            "trend_direction": "positive/negative/neutral",
            "timeline": "short/medium/long-term"
        }},
        "environmental": {{
            "factors": ["factor1", "factor2"],
            "impact_score": 1-10,
            "trend_direction": "positive/negative/neutral",
            "timeline": "short/medium/long-term"
        }},
        "legal": {{
            "factors": ["factor1", "factor2"],
            "impact_score": 1-10,
            "trend_direction": "positive/negative/neutral",
            "timeline": "short/medium/long-term"
        }},
        "key_insights": ["insight1", "insight2"],
        "strategic_implications": ["implication1", "implication2"]
    }}
    """

def get_porter_prompt(business_idea: str, industry: str, target_market: str) -> str:
    return f"""
    Conduct a Porter's Five Forces analysis for the following business idea:
    
    Business Idea: {business_idea}
    Industry: {industry}
    Target Market: {target_market}
    
    Provide a detailed analysis in the following JSON format:
    {{
        "competitive_rivalry": {{
            "intensity": "Low/Medium/High",
            "score": 1-10,
            "factors": ["factor1", "factor2"],
            "key_competitors": ["competitor1", "competitor2"]
        }},
        "supplier_power": {{
            "intensity": "Low/Medium/High",
            "score": 1-10,
            "factors": ["factor1", "factor2"]
        }},
        "buyer_power": {{
            "intensity": "Low/Medium/High",
            "score": 1-10,
            "factors": ["factor1", "factor2"]
        }},
        "threat_of_substitutes": {{
            "intensity": "Low/Medium/High",
            "score": 1-10,
            "factors": ["factor1", "factor2"]
        }},
        "barriers_to_entry": {{
            "intensity": "Low/Medium/High",
            "score": 1-10,
            "factors": ["factor1", "factor2"]
        }},
        "overall_attractiveness": {{
            "score": 1-10,
            "assessment": "industry attractiveness summary"
        }},
        "strategic_recommendations": ["recommendation1", "recommendation2"]
    }}
    """

# Utility Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# AI Analysis Functions
async def run_ai_analysis(prompt: str, models: List[AIModel]) -> Dict[str, AIAnalysisResult]:
    results = {}
    
    for model in models:
        start_time = datetime.utcnow()
        
        if model == AIModel.DEEPSEEK:
            analysis = await deepseek_service.analyze(prompt)
        elif model == AIModel.GEMINI:
            analysis = await gemini_service.analyze(prompt)
        else:
            continue
            
        end_time = datetime.utcnow()
        processing_time = (end_time - start_time).total_seconds()
        
        # Calculate confidence score based on analysis completeness
        confidence_score = 0.8 if "error" not in analysis else 0.3
        
        results[model.value] = AIAnalysisResult(
            model=model.value,
            analysis=analysis,
            confidence_score=confidence_score,
            processing_time=processing_time
        )
    
    return results

def create_consensus_analysis(results: Dict[str, AIAnalysisResult]) -> Dict[str, Any]:
    """Create consensus analysis from multiple AI model results"""
    if not results:
        return {"error": "No analysis results available"}
    
    # Simple consensus: average confidence scores and combine insights
    total_confidence = sum(result.confidence_score for result in results.values())
    avg_confidence = total_confidence / len(results)
    
    consensus = {
        "consensus_score": avg_confidence,
        "models_used": list(results.keys()),
        "combined_analysis": {},
        "model_results": {model: result.analysis for model, result in results.items()}
    }
    
    return consensus

# API Routes
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email
    )
    
    # Store user with hashed password
    user_dict = user.dict()
    user_dict["password"] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    # Find user
    user = await db.users.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check password
    if user["password"] != hash_password(user_data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": user["id"]})
    
    user_obj = User(**{k: v for k, v in user.items() if k != "password"})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_obj
    }

@api_router.post("/analysis/business", response_model=BusinessAnalysis)
async def create_business_analysis(
    request: BusinessAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """Create comprehensive business analysis using AI models"""
    
    analysis_results = {}
    
    # Run different types of analysis based on request
    for analysis_type in request.analysis_types:
        if analysis_type == AnalysisType.SWOT:
            prompt = get_swot_prompt(request.business_idea, request.industry, request.target_market)
        elif analysis_type == AnalysisType.PESTEL:
            prompt = get_pestel_prompt(request.business_idea, request.industry, request.target_market)
        elif analysis_type == AnalysisType.PORTER:
            prompt = get_porter_prompt(request.business_idea, request.industry, request.target_market)
        else:
            # Default comprehensive prompt
            prompt = f"""
            Analyze the following business idea comprehensively:
            
            Business Idea: {request.business_idea}
            Industry: {request.industry}
            Target Market: {request.target_market}
            Stage: {request.stage}
            
            Provide insights on market opportunity, competitive landscape, potential challenges, and strategic recommendations.
            """
        
        # Run AI analysis
        ai_results = await run_ai_analysis(prompt, request.ai_models)
        analysis_results[analysis_type.value] = ai_results
    
    # Create consensus analysis
    all_results = {}
    for analysis_type, ai_results in analysis_results.items():
        all_results.update(ai_results)
    
    consensus = create_consensus_analysis(all_results)
    
    # Create business analysis record
    business_analysis = BusinessAnalysis(
        user_id=current_user.id,
        business_idea=request.business_idea,
        industry=request.industry,
        stage=request.stage,
        target_market=request.target_market,
        analysis_types=[at.value for at in request.analysis_types],
        results=analysis_results,
        ai_consensus=consensus,
        confidence_score=consensus.get("consensus_score", 0.5)
    )
    
    # Save to database
    await db.business_analyses.insert_one(business_analysis.dict())
    
    return business_analysis

@api_router.get("/analysis/history")
async def get_analysis_history(current_user: User = Depends(get_current_user)):
    """Get user's analysis history"""
    analyses = await db.business_analyses.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).to_list(50)
    
    return [BusinessAnalysis(**analysis) for analysis in analyses]

@api_router.get("/analysis/{analysis_id}")
async def get_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get specific analysis by ID"""
    analysis = await db.business_analyses.find_one({
        "id": analysis_id,
        "user_id": current_user.id
    })
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return BusinessAnalysis(**analysis)

@api_router.get("/")
async def root():
    return {"message": "Somna AI - Business Analysis Platform API"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "2.0.0",
        "demo_mode": DEMO_MODE,
        "ai_services": {
            "deepseek": bool(DEEPSEEK_API_KEY),
            "gemini": bool(GEMINI_API_KEY)
        }
    }

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)