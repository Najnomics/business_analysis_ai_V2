const { v4: uuidv4 } = require('uuid');

class BusinessAnalysis {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.user_id = data.user_id;
    this.business_idea = data.business_idea;
    this.industry = data.industry;
    this.stage = data.stage || 'seed';
    this.target_market = data.target_market;
    this.analysis_types = data.analysis_types || [];
    this.ai_models = data.ai_models || ['deepseek', 'gemini'];
    this.consensus_mode = data.consensus_mode !== undefined ? data.consensus_mode : true;
    this.depth = data.depth || 'comprehensive';
    this.results = data.results || {};
    this.ai_consensus = data.ai_consensus || {};
    this.confidence_score = data.confidence_score || 0;
    this.processing_time = data.processing_time || 0;
    this.status = data.status || 'pending'; // pending, processing, completed, failed
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
    this.metadata = data.metadata || {
      analysis_depth: 'comprehensive',
      data_sources: 0,
      timestamp: new Date()
    };
  }

  static getCollectionName() {
    return 'business_analyses';
  }

  toDict() {
    return {
      id: this.id,
      user_id: this.user_id,
      business_idea: this.business_idea,
      industry: this.industry,
      stage: this.stage,
      target_market: this.target_market,
      analysis_types: this.analysis_types,
      ai_models: this.ai_models,
      consensus_mode: this.consensus_mode,
      depth: this.depth,
      results: this.results,
      ai_consensus: this.ai_consensus,
      confidence_score: this.confidence_score,
      processing_time: this.processing_time,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      metadata: this.metadata
    };
  }

  updateStatus(status) {
    this.status = status;
    this.updated_at = new Date();
  }

  addResult(analysisType, model, result) {
    if (!this.results[analysisType]) {
      this.results[analysisType] = {};
    }
    this.results[analysisType][model] = result;
    this.updated_at = new Date();
  }

  setConsensus(consensusData) {
    this.ai_consensus = consensusData;
    this.confidence_score = consensusData.consensus_score || 0;
    this.updated_at = new Date();
  }
}

module.exports = BusinessAnalysis;