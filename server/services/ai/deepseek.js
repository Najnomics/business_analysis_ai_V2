const httpx = require('axios');
const AI_CONFIG = require('../../config/ai');

class DeepSeekService {
  constructor() {
    this.apiKey = AI_CONFIG.DEEPSEEK.API_KEY;
    this.baseUrl = AI_CONFIG.DEEPSEEK.BASE_URL;
    this.model = AI_CONFIG.DEEPSEEK.MODEL;
  }

  async analyze(prompt, analysisType = 'general') {
    // Check if we're in demo mode or if API key issues
    if (AI_CONFIG.DEMO_MODE || !this.apiKey) {
      return this._getMockAnalysis(prompt, analysisType);
    }

    try {
      const response = await httpx.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this._getSystemPrompt(analysisType)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      if (response.status === 200) {
        const result = response.data;
        const content = result.choices[0].message.content;

        // Try to parse JSON from the response
        try {
          return JSON.parse(content);
        } catch (jsonError) {
          return { analysis: content, raw_response: true };
        }
      } else {
        console.error(`DeepSeek API error: ${response.status} - ${response.data}`);
        return this._getMockAnalysis(prompt, analysisType);
      }
    } catch (error) {
      console.error(`DeepSeek analysis error: ${error.message}`);
      return this._getMockAnalysis(prompt, analysisType);
    }
  }

  _getSystemPrompt(analysisType) {
    const prompts = {
      swot: "You are a professional business analyst specializing in SWOT analysis. Provide detailed, structured SWOT analysis in JSON format with strengths, weaknesses, opportunities, and threats arrays. Each item should include factor, impact level, and confidence score.",
      pestel: "You are a professional business analyst specializing in PESTEL analysis. Provide detailed Political, Economic, Social, Technological, Environmental, and Legal factor analysis in JSON format with impact scores and trend directions.",
      porter: "You are a professional business analyst specializing in Porter's Five Forces analysis. Provide detailed analysis of competitive rivalry, supplier power, buyer power, threat of substitutes, and barriers to entry in JSON format.",
      default: "You are a professional business analyst with expertise in strategic analysis frameworks. Provide detailed, structured analysis in JSON format."
    };

    return prompts[analysisType] || prompts.default;
  }

  _getMockAnalysis(prompt, analysisType) {
    const mockData = {
      swot: {
        strengths: [
          { factor: "Growing environmental consciousness in target demographic", impact: "high", confidence: 0.92 },
          { factor: "First-mover advantage in AI-powered fashion curation", impact: "high", confidence: 0.85 },
          { factor: "Strong technological foundation and AI capabilities", impact: "medium", confidence: 0.88 }
        ],
        weaknesses: [
          { factor: "High customer acquisition costs in competitive market", impact: "medium", confidence: 0.78 },
          { factor: "Dependency on brand partnerships for inventory", impact: "medium", confidence: 0.82 },
          { factor: "Complex supply chain verification requirements", impact: "high", confidence: 0.76 }
        ],
        opportunities: [
          { factor: "Rapid growth in sustainable fashion market (20% CAGR)", impact: "high", confidence: 0.89 },
          { factor: "Increasing regulatory support for sustainable practices", impact: "medium", confidence: 0.83 },
          { factor: "Partnership opportunities with eco-conscious influencers", impact: "medium", confidence: 0.77 }
        ],
        threats: [
          { factor: "Entry of established fashion retailers into sustainable space", impact: "high", confidence: 0.84 },
          { factor: "Economic downturn affecting premium pricing tolerance", impact: "medium", confidence: 0.71 },
          { factor: "Greenwashing concerns affecting consumer trust", impact: "medium", confidence: 0.73 }
        ],
        strategic_recommendations: [
          "Focus on building strong brand partnerships with verified sustainable credentials",
          "Develop proprietary sustainability scoring algorithm as competitive moat",
          "Implement robust customer education and engagement programs"
        ],
        overall_assessment: "Strong market opportunity with high growth potential, but requires careful execution and significant investment in brand partnerships and customer acquisition."
      },
      pestel: {
        political: {
          factors: ["Increasing government regulations on fast fashion", "Trade policies affecting textile imports", "Environmental protection legislation"],
          impact_score: 7.2,
          trend_direction: "positive",
          timeline: "medium-term"
        },
        economic: {
          factors: ["Rising consumer spending on sustainable products", "Economic inflation affecting production costs", "Growth in circular economy investment"],
          impact_score: 6.8,
          trend_direction: "positive",
          timeline: "short-term"
        },
        social: {
          factors: ["Growing environmental consciousness among millennials", "Social media influence on fashion choices", "Shift towards conscious consumerism"],
          impact_score: 8.5,
          trend_direction: "positive",
          timeline: "ongoing"
        },
        technological: {
          factors: ["AI advancement in fashion recommendation", "Blockchain for supply chain transparency", "Virtual try-on technologies"],
          impact_score: 8.0,
          trend_direction: "positive",
          timeline: "short-term"
        },
        environmental: {
          factors: ["Climate change driving sustainable practices", "Circular economy principles adoption", "Waste reduction regulations"],
          impact_score: 9.2,
          trend_direction: "positive",
          timeline: "long-term"
        },
        legal: {
          factors: ["Consumer protection laws", "Sustainability reporting requirements", "Data privacy regulations"],
          impact_score: 6.5,
          trend_direction: "neutral",
          timeline: "medium-term"
        }
      }
    };

    return mockData[analysisType] || mockData.swot;
  }
}

module.exports = DeepSeekService;