import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const { colors } = useTheme();
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div
        className="animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: `${colors.primary}40`, borderTopColor: colors.primary }}
      />
    </div>
  );
};

export default LoadingSpinner;