const express = require('express');
const BusinessAnalysisController = require('../controllers/analysis/businessController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const businessController = new BusinessAnalysisController();

// All analysis routes require authentication
router.use(authenticateToken);

// Business analysis routes
router.post('/business', (req, res) => businessController.createAnalysis(req, res));
router.get('/history', (req, res) => businessController.getUserAnalyses(req, res));
router.get('/:id', (req, res) => businessController.getAnalysis(req, res));

module.exports = router;