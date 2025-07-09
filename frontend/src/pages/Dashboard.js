import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AnalysisViewer from '../components/analysis/AnalysisViewer';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { colors } = useTheme();
  const { user, token } = useAuth();
  const [analysisForm, setAnalysisForm] = useState({
    business_input: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState(null);

  useEffect(() => {
    if (token) {
      fetchAnalysisHistory();
    }
  }, [token, searchTerm]);

  const fetchAnalysisHistory = async () => {
    try {
      const url = searchTerm 
        ? `${API}/analysis/history?search=${encodeURIComponent(searchTerm)}`
        : `${API}/analysis/history`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
    }
  };

  const handleInputChange = (e) => {
    setAnalysisForm({
      ...analysisForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent new analysis if one is already running
    if (currentAnalysis && (currentAnalysis.status === 'pending' || currentAnalysis.status === 'processing')) {
      setError('Please wait for the current analysis to complete or cancel it first.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/analysis/business`, analysisForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCurrentAnalysis(response.data);
      setAnalysisForm({ business_input: '' });
      
      // Poll for results
      pollForResults(response.data.id);
      
    } catch (error) {
      setError(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAnalysis = async () => {
    if (!currentAnalysis) return;

    try {
      await axios.post(`${API}/analysis/${currentAnalysis.id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCurrentAnalysis(prev => ({
        ...prev,
        status: 'cancelled'
      }));
      
      fetchAnalysisHistory(); // Refresh history
      
    } catch (error) {
      console.error('Failed to cancel analysis:', error);
    }
  };

  const pollForResults = async (analysisId) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await axios.get(`${API}/analysis/${analysisId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const analysis = response.data;
        setCurrentAnalysis(analysis);
        
        if (analysis.status === 'completed' && analysis.comprehensive_results && Object.keys(analysis.comprehensive_results).length > 0) {
          fetchAnalysisHistory(); // Refresh history
          return;
        }
        
        if (analysis.status === 'failed' || analysis.status === 'cancelled') {
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Failed to fetch analysis results:', error);
      }
    };

    poll();
  };

  const handleDeleteAnalysis = async (analysisId) => {
    try {
      await axios.delete(`${API}/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from current analysis if it's the one being deleted
      if (currentAnalysis && currentAnalysis.id === analysisId) {
        setCurrentAnalysis(null);
      }
      
      fetchAnalysisHistory(); // Refresh history
      setShowDeleteConfirm(false);
      setAnalysisToDelete(null);
      
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      setError('Failed to delete analysis');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAnalyses.length === 0) return;

    try {
      await axios.delete(`${API}/analysis/bulk`, {
        headers: { Authorization: `Bearer ${token}` },
        data: selectedAnalyses
      });
      
      setSelectedAnalyses([]);
      fetchAnalysisHistory(); // Refresh history
      
    } catch (error) {
      console.error('Failed to delete analyses:', error);
      setError('Failed to delete analyses');
    }
  };

  const handleExport = async (analysisId, format, style = 'designed') => {
    setExportLoading(`${format}-${style}`);
    try {
      const response = await axios.get(`${API}/analysis/${analysisId}/export/${format}?style=${style}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let filename = `business_analysis_${analysisId}.${format}`;
      if (format === 'pptx') filename = `business_analysis_${analysisId}.pptx`;
      if (format === 'docx') filename = `business_analysis_${analysisId}.docx`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to export ${format}:`, error);
      setError(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setExportLoading('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'processing': return colors.primary;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      case 'cancelled': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '🔄';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '⏳';
    }
  };

  const isAnalysisRunning = currentAnalysis && (currentAnalysis.status === 'pending' || currentAnalysis.status === 'processing');

  const frameworks = [
    { key: 'swot_analysis', name: 'SWOT Analysis', icon: '📊' },
    { key: 'pestel_analysis', name: 'PESTEL Analysis', icon: '🌍' },
    { key: 'porter_five_forces', name: "Porter's Five Forces", icon: '⚡' },
    { key: 'business_model_canvas', name: 'Business Model Canvas', icon: '🎨' },
    { key: 'vrio_framework', name: 'VRIO Framework', icon: '💎' },
    { key: 'bcg_matrix', name: 'BCG Matrix', icon: '📈' },
    { key: 'competitive_landscape', name: 'Competitive Landscape', icon: '🏆' },
    { key: 'customer_segmentation', name: 'Customer Segmentation', icon: '👥' },
    { key: 'financial_analysis', name: 'Financial Analysis', icon: '💰' },
    { key: 'risk_assessment', name: 'Risk Assessment', icon: '🛡️' }
  ];

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>
            Create comprehensive business analysis with just one simple input
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analysis Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
              🚀 Start New Analysis
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.backgroundTint,
                    borderColor: '#ef4444',
                    color: '#ef4444'
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label 
                  htmlFor="business_input" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  Business Input *
                </label>
                <textarea
                  id="business_input"
                  name="business_input"
                  required
                  rows={6}
                  value={analysisForm.business_input}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.backgroundTint,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                  placeholder="Enter ONE of the following:

• Business Name: e.g., 'Tesla', 'Airbnb', 'OpenAI'

• Business Description: e.g., 'AI-powered workflow automation platform that helps businesses streamline their operations using machine learning and artificial intelligence'

• Website URL: e.g., 'https://tesla.com', 'https://openai.com'

Just provide one type of input - our AI will analyze it comprehensively!"
                />
                <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                  💡 Tip: You only need to provide ONE input. Our AI will analyze any business name, description, or website URL.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-lg font-semibold"
                disabled={loading || isAnalysisRunning}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing... (25+ frameworks)</span>
                  </div>
                ) : isAnalysisRunning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analysis in Progress...</span>
                  </div>
                ) : (
                  '🔥 Generate Comprehensive Analysis'
                )}
              </Button>
              
              {/* Cancel Button */}
              {isAnalysisRunning && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-2 text-sm"
                  onClick={handleCancelAnalysis}
                >
                  🚫 Cancel Analysis
                </Button>
              )}
            </form>

            {/* Analysis Features */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                📋 What You'll Get:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {frameworks.slice(0, 8).map((framework) => (
                  <div key={framework.key} className="flex items-center space-x-2">
                    <span className="text-lg">{framework.icon}</span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {framework.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-4" style={{ color: colors.textSecondary }}>
                + 15 more advanced frameworks including Financial Analysis, Risk Assessment, and Go-to-Market Strategy
              </p>
            </div>
          </Card>

          {/* Current Analysis Results */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
              📈 Analysis Results
            </h2>
            
            {currentAnalysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                    {currentAnalysis.business_input?.substring(0, 50)}...
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Created: {new Date(currentAnalysis.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg">{getStatusIcon(currentAnalysis.status)}</span>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: getStatusColor(currentAnalysis.status) }}
                    >
                      {currentAnalysis.status.charAt(0).toUpperCase() + currentAnalysis.status.slice(1)}
                    </span>
                  </div>
                </div>

                {currentAnalysis.status === 'completed' && currentAnalysis.comprehensive_results && Object.keys(currentAnalysis.comprehensive_results).length > 0 ? (
                  <AnalysisViewer
                    analysis={currentAnalysis}
                    onExport={handleExport}
                    exportLoading={exportLoading}
                  />
                ) : currentAnalysis.status === 'failed' ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.error }}>
                      Analysis Failed
                    </h3>
                    <p style={{ color: colors.textSecondary }}>
                      {currentAnalysis.error || 'Something went wrong during analysis'}
                    </p>
                  </div>
                ) : currentAnalysis.status === 'cancelled' ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🚫</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textSecondary }}>
                      Analysis Cancelled
                    </h3>
                    <p style={{ color: colors.textSecondary }}>
                      The analysis was cancelled before completion
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
                    <p className="text-lg font-semibold" style={{ color: colors.text }}>
                      Analysis in Progress...
                    </p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      AI models are analyzing your business across 25+ frameworks
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Ready to Analyze Your Business?
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  Enter your business information to get comprehensive AI-powered analysis
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <Card className="mt-8 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                📚 Analysis History
              </h2>
              
              {/* Search and Bulk Actions */}
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                  style={{ 
                    backgroundColor: colors.backgroundTint,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                {selectedAnalyses.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-sm"
                  >
                    🗑️ Delete Selected ({selectedAnalyses.length})
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisHistory.slice(0, 9).map((analysis) => (
                <div 
                  key={analysis.id}
                  className="p-4 rounded-lg border transition-colors hover:shadow-lg relative"
                  style={{ 
                    backgroundColor: colors.backgroundTint,
                    borderColor: colors.border
                  }}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedAnalyses.includes(analysis.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAnalyses([...selectedAnalyses, analysis.id]);
                        } else {
                          setSelectedAnalyses(selectedAnalyses.filter(id => id !== analysis.id));
                        }
                      }}
                      className="rounded"
                    />
                  </div>
                  
                  {/* Delete Button */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => {
                        setAnalysisToDelete(analysis.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete analysis"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
                      {analysis.business_input?.substring(0, 50)}...
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{getStatusIcon(analysis.status)}</span>
                        <span 
                          className="text-xs px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: getStatusColor(analysis.status) + '20',
                            color: getStatusColor(analysis.status)
                          }}
                        >
                          {analysis.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Export buttons for completed analyses */}
                    {analysis.status === 'completed' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <Button
                            size="xs"
                            disabled={exportLoading === `pdf-designed-${analysis.id}`}
                            onClick={() => handleExport(analysis.id, 'pdf', 'designed')}
                            className="text-xs"
                          >
                            📄
                          </Button>
                          <Button
                            size="xs"
                            disabled={exportLoading === `pptx-designed-${analysis.id}`}
                            onClick={() => handleExport(analysis.id, 'pptx', 'designed')}
                            className="text-xs"
                          >
                            📊
                          </Button>
                          <Button
                            size="xs"
                            disabled={exportLoading === `docx-designed-${analysis.id}`}
                            onClick={() => handleExport(analysis.id, 'docx', 'designed')}
                            className="text-xs"
                          >
                            📝
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {analysisHistory.length > 9 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => {/* Load more functionality can be added here */}}
                >
                  Load More
                </Button>
              </div>
            )}
          </Card>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this analysis? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setAnalysisToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleDeleteAnalysis(analysisToDelete)}
                  style={{ backgroundColor: colors.error }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;