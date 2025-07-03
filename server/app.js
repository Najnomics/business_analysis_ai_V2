const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import database connection
const { connectDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');

// Import middleware
const { optionalAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 8001;

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://603c72a5-e474-4e48-b254-8766914559c3.preview.emergentagent.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Somna AI - Business Analysis Platform API',
    version: '2.0.0',
    powered_by: 'Elite Global AI',
    endpoints: {
      auth: '/api/auth',
      analysis: '/api/analysis',
      health: '/api/health'
    }
  });
});

// Statistics endpoint (public)
app.get('/api/stats', optionalAuth, async (req, res) => {
  try {
    // Mock statistics for now - can be enhanced with real data
    const stats = {
      total_users: 12847,
      total_analyses: 23156,
      avg_analysis_time: 42,
      success_rate: 98.7,
      active_users_today: 1247,
      analyses_today: 89
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('Database connected successfully');

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Somna AI Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💡 Powered by Elite Global AI`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  const { closeDatabase } = require('./config/database');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  const { closeDatabase } = require('./config/database');
  await closeDatabase();
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;