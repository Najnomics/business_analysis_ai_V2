import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You could validate token here by making a request to backend
    }
    setLoading(false);
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for auth
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  return token ? children : <Navigate to="/login" />;
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-white">Somna AI</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-white hover:text-blue-300 transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Next-Generation AI-Powered
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block mt-2">
              Business Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your business ideas into actionable strategies with Somna AI's comprehensive analysis suite. 
            Leverage multiple AI models for unparalleled insights and strategic recommendations.
          </p>
          <div className="space-x-4">
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Start Free Analysis
            </Link>
            <Link to="/login" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Multi-AI Analysis</h3>
            <p className="text-gray-300">
              Powered by DeepSeek and Gemini AI for comprehensive business insights with consensus validation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Strategic Frameworks</h3>
            <p className="text-gray-300">
              SWOT, PESTEL, Porter's Five Forces, and Blue Ocean Strategy analysis frameworks.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Investment Ready</h3>
            <p className="text-gray-300">
              Financial projections, risk assessment, and investment readiness scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Component
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      login(response.data.user, response.data.access_token);
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300">Sign in to your Somna AI account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Register Component
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/register`, formData);
      login(response.data.user, response.data.access_token);
      navigate('/dashboard'); // Navigate to dashboard after successful registration
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
          <p className="text-gray-300">Create your Somna AI account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API}/analysis/history`);
      setAnalyses(response.data);
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Navigate to landing page after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900">Somna AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <Link to="/analysis/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              New Analysis
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Business Analyses</h2>
          <p className="text-gray-600">Review and manage your AI-powered business analysis reports</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600 mb-6">Create your first business analysis to get started</p>
            <Link to="/analysis/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create First Analysis
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {analysis.business_idea}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {analysis.industry}
                      </span>
                      <span>{analysis.stage}</span>
                      <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-1">Confidence:</span>
                      <span className="font-semibold">
                        {Math.round(analysis.confidence_score * 100)}%
                      </span>
                    </div>
                    <Link
                      to={`/analysis/${analysis.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{analysis.target_market}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis_types.map((type) => (
                    <span
                      key={type}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {type.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// New Analysis Component
const NewAnalysis = () => {
  const [formData, setFormData] = useState({
    business_idea: '',
    industry: '',
    stage: 'seed',
    target_market: '',
    analysis_types: ['swot'],
    ai_models: ['deepseek', 'gemini'],
    consensus_mode: true,
    depth: 'comprehensive'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const analysisTypes = [
    { value: 'swot', label: 'SWOT Analysis' },
    { value: 'pestel', label: 'PESTEL Analysis' },
    { value: 'porter_five_forces', label: 'Porter\'s Five Forces' },
    { value: 'blue_ocean', label: 'Blue Ocean Strategy' },
    { value: 'business_model_canvas', label: 'Business Model Canvas' },
    { value: 'risk_assessment', label: 'Risk Assessment' },
    { value: 'financial_projections', label: 'Financial Projections' },
    { value: 'market_sizing', label: 'Market Sizing' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${API}/analysis/business`, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/analysis/${response.data.id}`); // Use navigate instead of window.location.href
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnalysisType = (type) => {
    setFormData(prev => ({
      ...prev,
      analysis_types: prev.analysis_types.includes(type)
        ? prev.analysis_types.filter(t => t !== type)
        : [...prev.analysis_types, type]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900">Somna AI</h1>
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Analysis</h2>
          <p className="text-gray-600">Let our AI analyze your business idea with comprehensive frameworks</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Idea *
            </label>
            <textarea
              required
              value={formData.business_idea}
              onChange={(e) => setFormData({...formData, business_idea: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your business idea in detail..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., FinTech, Healthcare, E-commerce"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({...formData, stage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="idea">Idea</option>
                <option value="seed">Seed</option>
                <option value="startup">Startup</option>
                <option value="growth">Growth</option>
                <option value="mature">Mature</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Market *
            </label>
            <input
              type="text"
              required
              value={formData.target_market}
              onChange={(e) => setFormData({...formData, target_market: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your target market and customers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Analysis Frameworks
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {analysisTypes.map((type) => (
                <label key={type.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.analysis_types.includes(type.value)}
                    onChange={() => toggleAnalysisType(type.value)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Analysis created successfully! Redirecting to results...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || formData.analysis_types.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Analysis...' : 'Create Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Analysis Detail Component
const AnalysisDetail = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get analysis ID from URL (you'd use useParams in a real app)
  const analysisId = window.location.pathname.split('/').pop();

  useEffect(() => {
    fetchAnalysis();
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API}/analysis/${analysisId}`);
      setAnalysis(response.data);
    } catch (error) {
      setError('Failed to load analysis');
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Found</h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900">Somna AI</h1>
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{analysis.business_idea}</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {analysis.industry}
            </span>
            <span>{analysis.stage}</span>
            <span>Confidence: {Math.round(analysis.confidence_score * 100)}%</span>
            <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Analysis Overview</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Target Market:</span>
                  <p className="text-sm text-gray-900">{analysis.target_market}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Frameworks Used:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.analysis_types.map((type) => (
                      <span
                        key={type}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {type.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">AI Models:</span>
                  <p className="text-sm text-gray-900">
                    {analysis.ai_consensus?.models_used?.join(', ') || 'Multiple AI models'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* AI Consensus */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Consensus Analysis</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Consensus Score</span>
                  <span className="text-sm font-semibold">
                    {Math.round((analysis.ai_consensus?.consensus_score || 0) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(analysis.ai_consensus?.consensus_score || 0) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            {Object.entries(analysis.results || {}).map(([analysisType, results]) => (
              <div key={analysisType} className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                  {analysisType.replace('_', ' ')} Analysis
                </h3>
                
                {Object.entries(results).map(([model, result]) => (
                  <div key={model} className="mb-6 last:mb-0">
                    <h4 className="text-lg font-medium text-gray-800 mb-3 capitalize">
                      {model} Analysis
                    </h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      {result.analysis && typeof result.analysis === 'object' ? (
                        <div className="space-y-4">
                          {Object.entries(result.analysis).map(([key, value]) => (
                            <div key={key}>
                              <h5 className="font-medium text-gray-700 capitalize mb-2">
                                {key.replace('_', ' ')}
                              </h5>
                              {Array.isArray(value) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {value.map((item, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                      {typeof item === 'object' ? JSON.stringify(item) : item}
                                    </li>
                                  ))}
                                </ul>
                              ) : typeof value === 'object' ? (
                                <div className="bg-white rounded p-3 text-sm">
                                  <pre className="whitespace-pre-wrap text-gray-600">
                                    {JSON.stringify(value, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600">{value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {result.analysis || 'No detailed analysis available'}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Confidence: {Math.round((result.confidence_score || 0) * 100)}%
                      </span>
                      <span>
                        Processing Time: {result.processing_time?.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/analysis/new" element={
              <ProtectedRoute>
                <NewAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/analysis/:id" element={
              <ProtectedRoute>
                <AnalysisDetail />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;