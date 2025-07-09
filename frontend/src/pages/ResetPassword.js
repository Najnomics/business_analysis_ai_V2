import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResetPassword = () => {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (formData.new_password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/auth/reset-password`, {
        token: token,
        new_password: formData.new_password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{ backgroundColor: colors.background }}>
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
            Password Reset Successful!
          </h1>
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            Your password has been successfully reset. You will be redirected to the login page in a few seconds.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.background
            }}
          >
            Go to Login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{ backgroundColor: colors.background }}>
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Reset Password
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Enter your new password below
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
              htmlFor="new_password" 
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              New Password
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              required
              value={formData.new_password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.backgroundTint,
                borderColor: colors.border,
                color: colors.text
              }}
              placeholder="Enter new password"
              disabled={loading || !token}
            />
          </div>

          <div>
            <label 
              htmlFor="confirm_password" 
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              value={formData.confirm_password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.backgroundTint,
                borderColor: colors.border,
                color: colors.text
              }}
              placeholder="Confirm new password"
              disabled={loading || !token}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold"
            disabled={loading || !token}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Resetting Password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm hover:underline"
            style={{ color: colors.primary }}
          >
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;