const BusinessAnalysis = require('../../models/BusinessAnalysis');
const AIConsensusService = require('../../services/ai/consensus');
const { getDatabase } = require('../../config/database');

class BusinessAnalysisController {
  constructor() {
    this.aiConsensus = new AIConsensusService();
  }

  async createAnalysis(req, res) {
    try {
      const {
        business_idea,
        industry,
        stage = 'seed',
        target_market,
        analysis_types = ['swot'],
        ai_models = ['deepseek', 'gemini'],
        consensus_mode = true,
        depth = 'comprehensive'
      } = req.body;

      const userId = req.user.id;

      // Validate required fields
      if (!business_idea || !industry || !target_market) {
        return res.status(400).json({
          error: 'Missing required fields: business_idea, industry, target_market'
        });
      }

      // Create analysis record
      const analysis = new BusinessAnalysis({
        user_id: userId,
        business_idea,
        industry,
        stage,
        target_market,
        analysis_types,
        ai_models,
        consensus_mode,
        depth,
        status: 'processing'
      });

      // Save to database
      const db = getDatabase();
      await db.collection(BusinessAnalysis.getCollectionName()).insertOne(analysis.toDict());

      // Start background analysis
      this._performBackgroundAnalysis(analysis.id, analysis_types, ai_models, {
        business_idea,
        industry,
        stage,
        target_market,
        depth
      });

      res.status(201).json({
        id: analysis.id,
        status: 'processing',
        message: 'Analysis started successfully'
      });

    } catch (error) {
      console.error('Create analysis error:', error);
      res.status(500).json({
        error: 'Failed to create analysis',
        details: error.message
      });
    }
  }

  async getAnalysis(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const db = getDatabase();
      const analysis = await db.collection(BusinessAnalysis.getCollectionName())
        .findOne({ id, user_id: userId });

      if (!analysis) {
        return res.status(404).json({
          error: 'Analysis not found'
        });
      }

      res.json(analysis);

    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({
        error: 'Failed to retrieve analysis',
        details: error.message
      });
    }
  }

  async getUserAnalyses(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const db = getDatabase();
      const analyses = await db.collection(BusinessAnalysis.getCollectionName())
        .find({ user_id: userId })
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray();

      const total = await db.collection(BusinessAnalysis.getCollectionName())
        .countDocuments({ user_id: userId });

      res.json({
        analyses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Get user analyses error:', error);
      res.status(500).json({
        error: 'Failed to retrieve analyses',
        details: error.message
      });
    }
  }

  async _performBackgroundAnalysis(analysisId, analysisTypes, aiModels, data) {
    try {
      const db = getDatabase();
      const results = {};
      const startTime = Date.now();

      // Perform analysis for each type
      for (const analysisType of analysisTypes) {
        const prompt = this._buildPrompt(analysisType, data);
        const consensusResult = await this.aiConsensus.performConsensusAnalysis(
          prompt,
          analysisType,
          aiModels
        );
        results[analysisType] = consensusResult.results;
      }

      // Calculate overall confidence and consensus
      const overallConsensus = this._calculateOverallConsensus(results);
      const totalTime = (Date.now() - startTime) / 1000;

      // Update analysis with results
      await db.collection(BusinessAnalysis.getCollectionName()).updateOne(
        { id: analysisId },
        {
          $set: {
            results,
            ai_consensus: overallConsensus,
            confidence_score: overallConsensus.consensus_score,
            processing_time: totalTime,
            status: 'completed',
            updated_at: new Date()
          }
        }
      );

    } catch (error) {
      console.error('Background analysis error:', error);
      
      // Update analysis with error status
      const db = getDatabase();
      await db.collection(BusinessAnalysis.getCollectionName()).updateOne(
        { id: analysisId },
        {
          $set: {
            status: 'failed',
            error: error.message,
            updated_at: new Date()
          }
        }
      );
    }
  }

  _buildPrompt(analysisType, data) {
    const baseInfo = `
Business Idea: ${data.business_idea}
Industry: ${data.industry}
Stage: ${data.stage}
Target Market: ${data.target_market}
Analysis Depth: ${data.depth}
`;

    const prompts = {
      swot: `${baseInfo}
Please perform a comprehensive SWOT analysis for this business idea. Include:
- Strengths: Internal positive factors
- Weaknesses: Internal negative factors  
- Opportunities: External positive factors
- Threats: External negative factors
Each factor should include impact level and confidence score.`,

      pestel: `${baseInfo}
Please perform a comprehensive PESTEL analysis for this business idea. Analyze:
- Political factors and their impact
- Economic factors and trends
- Social factors and demographics
- Technological factors and innovations
- Environmental factors and sustainability
- Legal factors and regulations
Include impact scores and trend directions.`,

      porter_five_forces: `${baseInfo}
Please perform a Porter's Five Forces analysis for this business idea. Analyze:
- Competitive rivalry intensity
- Supplier bargaining power
- Buyer bargaining power
- Threat of substitute products
- Barriers to entry
Include intensity scores and key factors for each force.`,

      blue_ocean: `${baseInfo}
Please perform a Blue Ocean Strategy analysis for this business idea. Identify:
- Red ocean factors (existing competition)
- Blue ocean opportunities (uncontested market space)
- Value innovation opportunities
- Strategic canvas recommendations`,

      business_model_canvas: `${baseInfo}
Please create a Business Model Canvas for this business idea. Include all 9 components:
- Key Partners, Key Activities, Key Resources
- Value Propositions
- Customer Relationships, Channels, Customer Segments  
- Cost Structure, Revenue Streams`,

      risk_assessment: `${baseInfo}
Please perform a comprehensive risk assessment for this business idea. Include:
- Market risks and mitigation strategies
- Financial risks and contingencies
- Operational risks and controls
- Strategic risks and responses
Rate probability and impact for each risk.`,

      financial_projections: `${baseInfo}
Please create financial projections for this business idea. Include:
- Revenue forecasting (3-year projection)
- Cost structure analysis
- Unit economics breakdown
- Funding requirements and valuation estimates`,

      market_sizing: `${baseInfo}
Please perform market sizing analysis for this business idea. Include:
- TAM (Total Addressable Market)
- SAM (Serviceable Addressable Market)  
- SOM (Serviceable Obtainable Market)
- Market growth rates and trends`
    };

    return prompts[analysisType] || prompts.swot;
  }

  _calculateOverallConsensus(results) {
    const analysisTypes = Object.keys(results);
    if (analysisTypes.length === 0) {
      return { consensus_score: 0, models_used: [], conflicting_insights: [] };
    }

    let totalScore = 0;
    let validAnalyses = 0;
    const modelsUsed = new Set();
    const conflictingInsights = [];

    analysisTypes.forEach(type => {
      const typeResults = results[type];
      Object.keys(typeResults).forEach(model => {
        modelsUsed.add(model);
        if (typeResults[model].confidence_score) {
          totalScore += typeResults[model].confidence_score;
          validAnalyses++;
        }
      });
    });

    return {
      consensus_score: validAnalyses > 0 ? totalScore / validAnalyses : 0,
      models_used: Array.from(modelsUsed),
      conflicting_insights,
      analysis_count: analysisTypes.length
    };
  }
}

module.exports = BusinessAnalysisController;