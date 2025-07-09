import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const { colors } = useTheme();

  const variants = {
    primary: {
      backgroundColor: colors.primary,
      color: colors.background,
      border: 'none'
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.background,
      border: 'none'
    },
    accent: {
      backgroundColor: colors.accent,
      color: colors.background,
      border: 'none'
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text,
      border: 'none'
    }
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    small: 'px-3 py-1.5 text-sm',
    sm: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        hover:scale-105 hover:shadow-lg
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizes[size]}
        ${className}
      `}
      style={{
        ...variants[variant],
        opacity: isDisabled ? 0.6 : 1,
        focusRingColor: colors.primary
      }}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="small" className="mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;