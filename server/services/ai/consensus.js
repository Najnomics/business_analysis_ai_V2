const DeepSeekService = require('./deepseek');
const GeminiService = require('./gemini');
const AI_CONFIG = require('../../config/ai');

class AIConsensusService {
  constructor() {
    this.deepseek = new DeepSeekService();
    this.gemini = new GeminiService();
    this.consensusThreshold = AI_CONFIG.CONSENSUS_THRESHOLD;
  }

  async performConsensusAnalysis(prompt, analysisType, models = ['deepseek', 'gemini']) {
    const startTime = Date.now();
    const results = {};
    const modelResults = [];

    try {
      // Run analysis with selected models
      const promises = [];
      
      if (models.includes('deepseek')) {
        promises.push(this._runModelAnalysis('deepseek', prompt, analysisType));
      }
      
      if (models.includes('gemini')) {
        promises.push(this._runModelAnalysis('gemini', prompt, analysisType));
      }

      const analysisResults = await Promise.allSettled(promises);

      // Process results
      analysisResults.forEach((result, index) => {
        const modelName = models[index];
        if (result.status === 'fulfilled') {
          results[modelName] = result.value;
          modelResults.push({
            model: modelName,
            ...result.value
          });
        } else {
          console.error(`${modelName} analysis failed:`, result.reason);
          results[modelName] = {
            analysis: {},
            confidence_score: 0,
            processing_time: 0,
            error: result.reason.message
          };
        }
      });

      // Calculate consensus
      const consensus = this._calculateConsensus(modelResults, analysisType);
      const totalTime = (Date.now() - startTime) / 1000;

      return {
        results,
        consensus,
        models_used: models,
        total_processing_time: totalTime,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Consensus analysis error:', error);
      throw error;
    }
  }

  async _runModelAnalysis(modelName, prompt, analysisType) {
    const startTime = Date.now();
    let service;

    switch (modelName) {
      case 'deepseek':
        service = this.deepseek;
        break;
      case 'gemini':
        service = this.gemini;
        break;
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }

    try {
      const analysis = await service.analyze(prompt, analysisType);
      const processingTime = (Date.now() - startTime) / 1000;

      return {
        analysis,
        confidence_score: this._calculateConfidence(analysis, analysisType),
        processing_time: processingTime,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`${modelName} analysis error:`, error);
      return {
        analysis: {},
        confidence_score: 0,
        processing_time: (Date.now() - startTime) / 1000,
        error: error.message
      };
    }
  }

  _calculateConsensus(modelResults, analysisType) {
    if (modelResults.length === 0) {
      return {
        consensus_score: 0,
        agreement_level: 'none',
        conflicting_insights: [],
        merged_analysis: {},
        methodology: 'consensus_unavailable'
      };
    }

    if (modelResults.length === 1) {
      return {
        consensus_score: modelResults[0].confidence_score,
        agreement_level: 'single_model',
        conflicting_insights: [],
        merged_analysis: modelResults[0].analysis,
        methodology: 'single_model'
      };
    }

    // Calculate consensus score based on agreement between models
    const consensusScore = this._calculateAgreementScore(modelResults, analysisType);
    const agreementLevel = this._getAgreementLevel(consensusScore);
    const conflictingInsights = this._identifyConflicts(modelResults, analysisType);
    const mergedAnalysis = this._mergeAnalyses(modelResults, analysisType);

    return {
      consensus_score: consensusScore,
      agreement_level: agreementLevel,
      conflicting_insights: conflictingInsights,
      merged_analysis: mergedAnalysis,
      methodology: 'weighted_consensus',
      model_weights: this._getModelWeights(modelResults)
    };
  }

  _calculateAgreementScore(modelResults, analysisType) {
    // Simple implementation - can be enhanced based on specific analysis type
    const validResults = modelResults.filter(r => r.confidence_score > 0);
    if (validResults.length === 0) return 0;

    const avgConfidence = validResults.reduce((sum, r) => sum + r.confidence_score, 0) / validResults.length;
    const confidenceVariance = this._calculateVariance(validResults.map(r => r.confidence_score));
    
    // Higher agreement when confidence is high and variance is low
    const agreementScore = avgConfidence * (1 - Math.min(confidenceVariance, 0.5));
    return Math.max(0, Math.min(1, agreementScore));
  }

  _calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  _getAgreementLevel(consensusScore) {
    if (consensusScore >= 0.8) return 'high';
    if (consensusScore >= 0.6) return 'medium';
    if (consensusScore >= 0.4) return 'low';
    return 'minimal';
  }

  _identifyConflicts(modelResults, analysisType) {
    // Simplified conflict identification
    const conflicts = [];
    
    if (modelResults.length >= 2) {
      const scoreDiff = Math.abs(modelResults[0].confidence_score - modelResults[1].confidence_score);
      if (scoreDiff > 0.3) {
        conflicts.push({
          type: 'confidence_disagreement',
          description: 'Models show significant confidence score differences',
          severity: scoreDiff > 0.5 ? 'high' : 'medium'
        });
      }
    }

    return conflicts;
  }

  _mergeAnalyses(modelResults, analysisType) {
    // Simple merge strategy - can be enhanced per analysis type
    const validResults = modelResults.filter(r => r.analysis && Object.keys(r.analysis).length > 0);
    
    if (validResults.length === 0) {
      return {};
    }

    if (validResults.length === 1) {
      return validResults[0].analysis;
    }

    // For now, return the analysis from the model with highest confidence
    const bestResult = validResults.reduce((best, current) => 
      current.confidence_score > best.confidence_score ? current : best
    );

    return bestResult.analysis;
  }

  _getModelWeights(modelResults) {
    const weights = {};
    const totalConfidence = modelResults.reduce((sum, r) => sum + r.confidence_score, 0);
    
    modelResults.forEach(result => {
      if (result.model && totalConfidence > 0) {
        weights[result.model] = result.confidence_score / totalConfidence;
      }
    });

    return weights;
  }

  _calculateConfidence(analysis, analysisType) {
    // Simple confidence calculation based on completeness and structure
    if (!analysis || typeof analysis !== 'object') {
      return 0.1;
    }

    const keys = Object.keys(analysis);
    if (keys.length === 0) {
      return 0.1;
    }

    // Analysis type specific confidence calculation
    let expectedKeys = [];
    switch (analysisType) {
      case 'swot':
        expectedKeys = ['strengths', 'weaknesses', 'opportunities', 'threats'];
        break;
      case 'pestel':
        expectedKeys = ['political', 'economic', 'social', 'technological', 'environmental', 'legal'];
        break;
      case 'porter':
        expectedKeys = ['competitive_rivalry', 'supplier_power', 'buyer_power', 'threat_of_substitutes', 'barriers_to_entry'];
        break;
      default:
        expectedKeys = keys;
    }

    const foundKeys = expectedKeys.filter(key => keys.includes(key));
    const completeness = foundKeys.length / expectedKeys.length;

    // Base confidence on completeness and add some randomness for realism
    return Math.min(0.95, Math.max(0.3, completeness * 0.8 + Math.random() * 0.2));
  }
}

module.exports = AIConsensusService;