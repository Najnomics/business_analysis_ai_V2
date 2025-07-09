import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ForgotPassword = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{ backgroundColor: colors.background }}>
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
            Check Your Email
          </h1>
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            If an account with that email exists, we've sent you a password reset link. Please check your email and follow the instructions.
          </p>
          <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
            Don't see the email? Check your spam folder or try again.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full px-6 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 text-center"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.background
              }}
            >
              Back to Login
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="block w-full px-6 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 text-center"
              style={{ 
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `1px solid ${colors.primary}`
              }}
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{ backgroundColor: colors.background }}>
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Forgot Password?
          </h1>
          <p style={{ color: colors.textSecondary }}>
            No worries! Enter your email address and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div 
              className="p-4 rounded-lg border text-center"
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
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.backgroundTint,
                borderColor: colors.border,
                color: colors.text
              }}
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending Reset Link...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p style={{ color: colors.textSecondary }}>
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: colors.primary }}
            >
              Sign in
            </Link>
          </p>
          <p style={{ color: colors.textSecondary }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium hover:underline"
              style={{ color: colors.primary }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;