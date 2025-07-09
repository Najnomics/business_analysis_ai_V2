import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Register = () => {
  const { colors } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: colors.backgroundTint }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://static.wixstatic.com/media/8f4d64_a953bdcb801f4716878cca06470b74cbf000.jpg"
              alt="Somna AI"
              className="w-16 h-16 rounded-xl object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Create Your Account
          </h2>
          <p className="text-lg" style={{ color: colors.textSecondary }}>
            Start your AI-powered business analysis journey
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: '#ef4444',
                  color: '#ef4444'
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Confirm your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: colors.textSecondary }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="hover:underline" style={{ color: colors.primary }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="hover:underline" style={{ color: colors.primary }}>
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mt-8">
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.success }}
              ></div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                Free forever plan
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.success }}
              ></div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;