import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';

const AnalysisViewer = ({ analysis, onExport, exportLoading }) => {
  const { colors } = useTheme();
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, framework

  if (!analysis || !analysis.comprehensive_results) {
    return null;
  }

  const frameworks = Object.keys(analysis.comprehensive_results);
  
  const formatFrameworkName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFrameworkIcon = (framework) => {
    const icons = {
      'swot_analysis': '📊',
      'pestel_analysis': '🌍',
      'porter_five_forces': '⚡',
      'business_model_canvas': '🎨',
      'vrio_framework': '💎',
      'bcg_matrix': '📈',
      'competitive_landscape': '🏆',
      'customer_segmentation': '👥',
      'financial_analysis': '💰',
      'break_even_analysis': '📉',
      'unit_economics': '🧮',
      'revenue_model': '💵',
      'risk_assessment': '🛡️',
      'scenario_analysis': '🔮',
      'market_intelligence': '🎯',
      'go_to_market_strategy': '🚀',
      'trend_analysis': '📊',
      'benchmarking': '📏',
      'kpi_dashboard': '📋',
      'process_mapping': '🗺️',
      'value_stream_mapping': '💫',
      'lean_six_sigma': '⚙️',
      'capacity_planning': '📊',
      'cost_benefit_analysis': '⚖️',
      'working_capital_analysis': '🏦'
    };
    return icons[framework] || '📋';
  };

  const renderAnalysisContent = (content, aiModel) => {
    if (!content) return null;

    if (content.analysis) {
      if (typeof content.analysis === 'string') {
        return (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm" style={{ color: colors.text }}>
              {content.analysis}
            </pre>
          </div>
        );
      }

      if (typeof content.analysis === 'object') {
        return (
          <div className="space-y-4">
            {Object.entries(content.analysis).map(([key, value]) => (
              <div key={key}>
                <h4 className="font-semibold mb-2 capitalize" style={{ color: colors.text }}>
                  {key.replace(/_/g, ' ')}
                </h4>
                {Array.isArray(value) ? (
                  <ul className="space-y-2">
                    {value.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <div className="flex-1">
                          {typeof item === 'object' ? (
                            <div>
                              <p style={{ color: colors.text }}>
                                {item.factor || JSON.stringify(item)}
                              </p>
                              {item.impact && (
                                <span className="text-xs px-2 py-1 rounded-full" 
                                      style={{ backgroundColor: colors.backgroundTint, color: colors.textSecondary }}>
                                  Impact: {item.impact}
                                </span>
                              )}
                              {item.confidence && (
                                <span className="text-xs px-2 py-1 rounded-full ml-2" 
                                      style={{ backgroundColor: colors.backgroundTint, color: colors.textSecondary }}>
                                  Confidence: {Math.round(item.confidence * 100)}%
                                </span>
                              )}
                              {item.evidence && (
                                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                                  Evidence: {item.evidence}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p style={{ color: colors.text }}>{item}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : typeof value === 'object' ? (
                  <div className="pl-4 space-y-2">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div key={subKey}>
                        <span className="font-medium" style={{ color: colors.text }}>
                          {subKey.replace(/_/g, ' ')}: 
                        </span>
                        <span className="ml-2" style={{ color: colors.textSecondary }}>
                          {typeof subValue === 'object' ? JSON.stringify(subValue) : subValue}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: colors.text }}>{value}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
    }

    return (
      <p style={{ color: colors.textSecondary }}>
        No detailed analysis available for this framework.
      </p>
    );
  };

  if (viewMode === 'framework' && selectedFramework) {
    const frameworkData = analysis.comprehensive_results[selectedFramework];
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('overview')}
              className="text-2xl hover:opacity-70"
            >
              ←
            </button>
            <div>
              <h2 className="text-2xl font-bold flex items-center space-x-2" style={{ color: colors.text }}>
                <span>{getFrameworkIcon(selectedFramework)}</span>
                <span>{formatFrameworkName(selectedFramework)}</span>
              </h2>
              <p style={{ color: colors.textSecondary }}>
                Detailed analysis from multiple AI models
              </p>
            </div>
          </div>
        </div>

        {/* Framework Content */}
        <div className="space-y-8">
          {frameworkData && Object.entries(frameworkData).map(([aiModel, content]) => (
            <div key={aiModel} 
                 className="p-6 rounded-lg border"
                 style={{ backgroundColor: colors.backgroundTint, borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                  {aiModel.toUpperCase()} Analysis
                </h3>
                {content.confidence_score && (
                  <span className="px-3 py-1 rounded-full text-sm" 
                        style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                    Confidence: {Math.round(content.confidence_score * 100)}%
                  </span>
                )}
              </div>
              {renderAnalysisContent(content, aiModel)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
            Analysis Results
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Comprehensive business analysis across {frameworks.length} frameworks
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'overview' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </Button>
        </div>
      </div>

      {/* Export Options */}
      <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.backgroundTint, borderColor: colors.border }}>
        <h3 className="font-semibold mb-3" style={{ color: colors.text }}>
          📄 Download Complete Report
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Designed Version */}
          <div>
            <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
              Designed Version (with colors & styling)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                disabled={exportLoading === 'pdf-designed'}
                onClick={() => onExport(analysis.id, 'pdf', 'designed')}
                className="text-xs"
              >
                {exportLoading === 'pdf-designed' ? '...' : '📄 PDF'}
              </Button>
              <Button
                size="sm"
                disabled={exportLoading === 'pptx-designed'}
                onClick={() => onExport(analysis.id, 'pptx', 'designed')}
                className="text-xs"
              >
                {exportLoading === 'pptx-designed' ? '...' : '📊 PPTX'}
              </Button>
              <Button
                size="sm"
                disabled={exportLoading === 'docx-designed'}
                onClick={() => onExport(analysis.id, 'docx', 'designed')}
                className="text-xs"
              >
                {exportLoading === 'docx-designed' ? '...' : '📝 DOCX'}
              </Button>
            </div>
          </div>

          {/* Black & White Version */}
          <div>
            <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
              Black & White Version (print-friendly)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={exportLoading === 'pdf-black_and_white'}
                onClick={() => onExport(analysis.id, 'pdf', 'black_and_white')}
                className="text-xs"
              >
                {exportLoading === 'pdf-black_and_white' ? '...' : '📄 PDF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={exportLoading === 'pptx-black_and_white'}
                onClick={() => onExport(analysis.id, 'pptx', 'black_and_white')}
                className="text-xs"
              >
                {exportLoading === 'pptx-black_and_white' ? '...' : '📊 PPTX'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={exportLoading === 'docx-black_and_white'}
                onClick={() => onExport(analysis.id, 'docx', 'black_and_white')}
                className="text-xs"
              >
                {exportLoading === 'docx-black_and_white' ? '...' : '📝 DOCX'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === 'overview' ? (
            <div className="grid md:grid-cols-2 gap-4">
              {frameworks.map((framework) => (
                <div
                  key={framework}
                  className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg"
                  style={{ backgroundColor: colors.backgroundTint, borderColor: colors.border }}
                  onClick={() => {
                    setSelectedFramework(framework);
                    setViewMode('framework');
                  }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">{getFrameworkIcon(framework)}</span>
                    <h3 className="font-semibold" style={{ color: colors.text }}>
                      {formatFrameworkName(framework)}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Click to view detailed analysis
                  </p>
                  <div className="mt-2 flex space-x-2">
                    {Object.keys(analysis.comprehensive_results[framework]).map((model) => (
                      <span key={model} className="text-xs px-2 py-1 rounded-full" 
                            style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                        {model.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {frameworks.map((framework) => (
                <div
                  key={framework}
                  className="p-6 rounded-lg border"
                  style={{ backgroundColor: colors.backgroundTint, borderColor: colors.border }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2" style={{ color: colors.text }}>
                      <span>{getFrameworkIcon(framework)}</span>
                      <span>{formatFrameworkName(framework)}</span>
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFramework(framework);
                        setViewMode('framework');
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                  
                  {/* Quick preview */}
                  <div className="space-y-4">
                    {Object.entries(analysis.comprehensive_results[framework]).slice(0, 1).map(([aiModel, content]) => (
                      <div key={aiModel}>
                        <h4 className="font-medium mb-2" style={{ color: colors.text }}>
                          {aiModel.toUpperCase()} Analysis Preview
                        </h4>
                        <div className="max-h-32 overflow-hidden">
                          {renderAnalysisContent(content, aiModel)}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFramework(framework);
                            setViewMode('framework');
                          }}
                          className="text-sm mt-2 hover:underline"
                          style={{ color: colors.primary }}
                        >
                          Read full analysis →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.backgroundTint, borderColor: colors.border }}>
            <h3 className="font-semibold mb-3" style={{ color: colors.text }}>
              📊 Analysis Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Frameworks Analyzed:</span>
                <span className="font-semibold" style={{ color: colors.text }}>
                  {frameworks.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>AI Models Used:</span>
                <span className="font-semibold" style={{ color: colors.text }}>
                  {analysis.ai_consensus?.models_used?.length || 2}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Confidence Score:</span>
                <span className="font-semibold" style={{ color: colors.text }}>
                  {Math.round(analysis.confidence_score * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Status:</span>
                <span className="font-semibold text-green-600">
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Key Recommendations */}
          {analysis.ai_consensus?.key_recommendations && (
            <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.backgroundTint, borderColor: colors.border }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.text }}>
                🎯 Key Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.ai_consensus.key_recommendations.slice(0, 4).map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm" style={{ color: colors.text }}>
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisViewer;