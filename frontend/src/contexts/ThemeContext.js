import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('somna-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('somna-theme', newTheme);
  };

  const colors = {
    light: {
      // Dream Tech Palette
      primary: '#2c3e50',        // Deep Indigo
      secondary: '#8e9aaf',      // Soft Periwinkle
      accent: '#1abc9c',         // Luminous Teal
      success: '#27ae60',        // Sage Green
      warning: '#f39c12',        // Warm Amber
      background: '#ffffff',     // Crisp White
      backgroundTint: '#f8f9fc', // Subtle blue-gray tint
      text: '#2c3e50',          // Near Black
      textSecondary: '#7f8c8d',  // Medium Gray
      border: '#e1e8ed',
      card: '#ffffff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    dark: {
      primary: '#3b82f6',        // Bright Blue for dark mode
      secondary: '#8b5cf6',      // Purple
      accent: '#06b6d4',         // Cyan
      success: '#10b981',        // Emerald
      warning: '#f59e0b',        // Amber
      background: '#0f172a',     // Slate 900
      backgroundTint: '#1e293b', // Slate 800
      text: '#f8fafc',          // Slate 50
      textSecondary: '#94a3b8',  // Slate 400
      border: '#334155',         // Slate 700
      card: '#1e293b',          // Slate 800
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  };

  const value = {
    theme,
    toggleTheme,
    colors: colors[theme],
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme} style={{ 
        backgroundColor: colors[theme].background,
        color: colors[theme].text,
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};