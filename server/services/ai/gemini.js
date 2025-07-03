const AI_CONFIG = require('../../config/ai');

class GeminiService {
  constructor() {
    this.client = AI_CONFIG.GEMINI.CLIENT;
    this.apiKey = AI_CONFIG.GEMINI.API_KEY;
  }

  async analyze(prompt, analysisType = 'general') {
    // Check if we're in demo mode or if API key issues
    if (AI_CONFIG.DEMO_MODE || !this.apiKey || !this.client) {
      return this._getMockAnalysis(prompt, analysisType);
    }

    try {
      const model = this.client.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const systemPrompt = this._getSystemPrompt(analysisType);
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const content = response.text();

      // Try to parse JSON from the response
      try {
        return JSON.parse(content);
      } catch (jsonError) {
        return { analysis: content, raw_response: true };
      }
    } catch (error) {
      console.error(`Gemini analysis error: ${error.message}`);
      return this._getMockAnalysis(prompt, analysisType);
    }
  }

  _getSystemPrompt(analysisType) {
    const prompts = {
      swot: "You are a professional business analyst specializing in SWOT analysis. Provide detailed, structured SWOT analysis in JSON format with strengths, weaknesses, opportunities, and threats arrays. Each item should include factor, impact level, and confidence score.",
      pestel: "You are a professional business analyst specializing in PESTEL analysis. Provide detailed Political, Economic, Social, Technological, Environmental, and Legal factor analysis in JSON format with impact scores and trend directions.",
      porter: "You are a professional business analyst specializing in Porter's Five Forces analysis. Provide detailed analysis of competitive rivalry, supplier power, buyer power, threat of substitutes, and barriers to entry in JSON format.",
      blue_ocean: "You are a professional business analyst specializing in Blue Ocean Strategy. Analyze red ocean factors, blue ocean opportunities, value innovation areas, and strategic canvas in JSON format.",
      business_model_canvas: "You are a professional business analyst specializing in Business Model Canvas. Provide detailed analysis of all 9 key components in JSON format.",
      default: "You are a professional business analyst with expertise in strategic analysis frameworks. Provide detailed, structured analysis in JSON format."
    };

    return prompts[analysisType] || prompts.default;
  }

  _getMockAnalysis(prompt, analysisType) {
    const mockData = {
      swot: {
        strengths: [
          { factor: "Strong AI technology foundation", impact: "high", confidence: 0.90 },
          { factor: "Experienced development team", impact: "medium", confidence: 0.85 },
          { factor: "Clear market opportunity", impact: "high", confidence: 0.87 }
        ],
        weaknesses: [
          { factor: "Limited initial funding", impact: "medium", confidence: 0.75 },
          { factor: "No established brand presence", impact: "high", confidence: 0.80 },
          { factor: "Competitive market landscape", impact: "medium", confidence: 0.78 }
        ],
        opportunities: [
          { factor: "Growing demand for AI solutions", impact: "high", confidence: 0.92 },
          { factor: "Strategic partnership potential", impact: "medium", confidence: 0.85 },
          { factor: "Market expansion possibilities", impact: "high", confidence: 0.88 }
        ],
        threats: [
          { factor: "Large tech companies entering market", impact: "high", confidence: 0.83 },
          { factor: "Regulatory changes in AI", impact: "medium", confidence: 0.70 },
          { factor: "Economic downturn impact", impact: "medium", confidence: 0.75 }
        ]
      },
      blue_ocean: {
        red_ocean_factors: [
          "Price competition among existing players",
          "Traditional business analysis methods",
          "Manual consulting processes"
        ],
        blue_ocean_opportunities: [
          "AI-powered automated analysis",
          "Real-time consensus from multiple AI models",
          "Instant strategic recommendations"
        ],
        value_innovation: [
          "Multi-AI consensus engine",
          "Comprehensive framework integration",
          "User-friendly interface with professional insights"
        ],
        strategic_canvas: {
          eliminate: ["Manual analysis processes", "Long waiting times"],
          reduce: ["Cost of business consulting", "Complexity of analysis"],
          raise: ["Analysis accuracy", "Speed of delivery"],
          create: ["AI consensus methodology", "Real-time insights"]
        }
      }
    };

    return mockData[analysisType] || mockData.swot;
  }
}

module.exports = GeminiService;