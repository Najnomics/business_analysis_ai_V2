import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: "12,847+",
    avgGenerationTime: "42 seconds",
    accountsCreated: "12,847",
    venturesAnalyzed: "23,156"
  });

  useEffect(() => {
    // Fetch real statistics
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep default stats
      }
    };

    fetchStats();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "SWOT Analysis",
      description: "Comprehensive analysis of Strengths, Weaknesses, Opportunities, and Threats for strategic planning."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "PESTEL Analysis",
      description: "Political, Economic, Social, Technological, Environmental, and Legal factor analysis."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Porter's Five Forces",
      description: "Analyze competitive dynamics and market structure with Porter's strategic framework."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Insights",
      description: "Advanced AI consensus from multiple models including DeepSeek and Gemini AI."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Financial Projections",
      description: "Revenue forecasting, unit economics analysis, and comprehensive valuation modeling."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Risk Assessment",
      description: "Monte Carlo simulations, sensitivity analysis, and comprehensive risk evaluation."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Startup Founder",
      company: "TechFlow AI",
      feedback: "Somna AI transformed our business strategy. The AI consensus feature gave us confidence in our market entry decisions. Absolutely game-changing!",
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Rodriguez",
      role: "Investment Analyst",
      company: "Venture Capital Partners",
      feedback: "The depth of analysis is incredible. Porter's Five Forces combined with AI insights helped us identify winning investments. ROI increased by 40%.",
      avatar: "👨‍💼"
    },
    {
      name: "Dr. Priya Patel",
      role: "Strategy Consultant",
      company: "Global Strategy Group",
      feedback: "I've used many analysis tools, but Somna AI's multi-framework approach is unmatched. It's like having a team of expert analysts at your fingertips.",
      avatar: "👩‍🔬"
    }
  ];

  const faqs = [
    {
      question: "What is Somna AI?",
      answer: "Somna AI is a next-generation business analysis platform powered by multiple AI models including DeepSeek and Gemini AI. We provide comprehensive strategic analysis using frameworks like SWOT, PESTEL, Porter's Five Forces, and more."
    },
    {
      question: "What types of business analyses can I generate?",
      answer: "You can generate SWOT analysis, PESTEL analysis, Porter's Five Forces, Blue Ocean Strategy, Business Model Canvas, Risk Assessment, Financial Projections, and Market Sizing analysis."
    },
    {
      question: "How does the AI consensus feature work?",
      answer: "Our AI consensus engine runs your analysis through multiple AI models (DeepSeek, Gemini AI) and provides a confidence-scored consensus view, helping you make more informed strategic decisions."
    },
    {
      question: "Who is Somna AI for?",
      answer: "Somna AI is designed for entrepreneurs, startup founders, business analysts, consultants, investors, and anyone who needs comprehensive business analysis and strategic insights."
    },
    {
      question: "How do I get started?",
      answer: "Simply click 'Get Started' to create your free account. You can immediately begin creating business analyses with our intuitive interface."
    },
    {
      question: "What's included in the free version?",
      answer: "The free version includes basic SWOT and PESTEL analysis with limited AI model access. Upgrade for advanced features, multiple frameworks, and full AI consensus capabilities."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: colors.gradient }}
        />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fadeIn">
            <h1 
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: colors.text }}
            >
              Turn Your Start-Up Idea{' '}
              <span 
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Into Reality!
              </span>
            </h1>
            
            <p 
              className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              Revolutionize Your Business Strategies with Somna AI: Analyze, Enhance, and Drive Growth with AI-Powered Insights from DeepSeek and Gemini AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="xl"
                onClick={handleGetStarted}
                className="min-w-[200px] font-semibold shadow-xl"
              >
                Start for Free
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate('/demo')}
                className="min-w-[200px] font-semibold"
              >
                Live Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm" style={{ color: colors.textSecondary }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }}></div>
                <span>Trusted by {stats.users} users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }}></div>
                <span>{stats.venturesAnalyzed} ventures analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }}></div>
                <span>Average {stats.avgGenerationTime} generation time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {stats.users}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Active Users
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {stats.avgGenerationTime}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Avg Generation Time
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {stats.accountsCreated}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Accounts Created
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {stats.venturesAnalyzed}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Ventures Analyzed
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.text }}>
              All-in-One Business Analysis Solution
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Comprehensive strategic frameworks powered by advanced AI to transform your business ideas into actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: colors.backgroundTint, color: colors.primary }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
                  {feature.title}
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: colors.backgroundTint }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.text }}>
              What Our Users Say
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Join thousands of entrepreneurs and analysts who trust Somna AI for their strategic decision-making.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="mb-6 italic" style={{ color: colors.textSecondary }}>
                  "{testimonial.feedback}"
                </p>
                <div>
                  <div className="font-semibold" style={{ color: colors.text }}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.text }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl" style={{ color: colors.textSecondary }}>
              Everything you need to know about Somna AI
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
                  {faq.question}
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: colors.backgroundTint }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.text }}>
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
            Join thousands of entrepreneurs who use Somna AI to make data-driven strategic decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="xl"
              onClick={handleGetStarted}
              className="min-w-[200px] font-semibold shadow-xl"
            >
              Start Free Analysis
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate('/contact')}
              className="min-w-[200px] font-semibold"
            >
              Contact Sales
            </Button>
          </div>

          <p className="text-sm mt-6" style={{ color: colors.textSecondary }}>
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;