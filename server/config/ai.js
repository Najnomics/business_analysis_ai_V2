require('dotenv').config();
const genai = require('@google/generative-ai');

// AI Configuration
const AI_CONFIG = {
  DEEPSEEK: {
    API_KEY: process.env.DEEPSEEK_API_KEY,
    BASE_URL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    MODEL: 'deepseek-chat'
  },
  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY,
    PROJECT_ID: process.env.GEMINI_PROJECT_ID
  },
  DEMO_MODE: process.env.DEMO_MODE === 'true',
  PRIMARY_MODEL: process.env.PRIMARY_AI_MODEL || 'deepseek',
  SECONDARY_MODEL: process.env.SECONDARY_AI_MODEL || 'gemini',
  CONSENSUS_THRESHOLD: parseFloat(process.env.CONSENSUS_THRESHOLD) || 0.75
};

// Initialize Gemini AI if API key is available
if (AI_CONFIG.GEMINI.API_KEY) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(AI_CONFIG.GEMINI.API_KEY);
  AI_CONFIG.GEMINI.CLIENT = genAI;
}

module.exports = AI_CONFIG;