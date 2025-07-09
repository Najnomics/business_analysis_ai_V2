import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300"
      style={{ 
        backgroundColor: `${colors.background}dd`,
        borderColor: colors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="https://static.wixstatic.com/media/8f4d64_a953bdcb801f4716878cca06470b74cbf000.jpg"
              alt="Elite Global AI"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
                Somna AI
              </h1>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Powered by Elite Global AI
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: colors.text }}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: colors.text }}
            >
              Pricing
            </Link>
            <Link 
              to="/community" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: colors.text }}
            >
              Community
            </Link>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Welcome, {user.name}
                  </span>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.background
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: colors.textSecondary }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: colors.text }}
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:shadow-lg"
                    style={{ 
                      backgroundColor: colors.accent,
                      color: colors.background
                    }}
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: colors.backgroundTint }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden mt-4 p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border
            }}
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/features" 
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/community" 
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-center transition-all"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.background
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-left hover:opacity-80 transition-opacity"
                    style={{ color: colors.textSecondary }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: colors.text }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      handleGetStarted();
                      setIsMenuOpen(false);
                    }}
                    className="px-6 py-2 rounded-lg text-sm font-medium text-center transition-all"
                    style={{ 
                      backgroundColor: colors.accent,
                      color: colors.background
                    }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;