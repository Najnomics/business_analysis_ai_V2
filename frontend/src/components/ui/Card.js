import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ 
  children, 
  className = '', 
  padding = 'large', 
  shadow = true,
  hover = false,
  gradient = false,
  ...props 
}) => {
  const { colors } = useTheme();

  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xl: 'p-10'
  };

  const baseStyles = {
    backgroundColor: gradient ? undefined : colors.card,
    borderColor: colors.border,
    background: gradient ? colors.gradient : undefined
  };

  return (
    <div
      className={`
        border rounded-xl
        ${paddings[padding]}
        ${shadow ? 'shadow-sm' : ''}
        ${hover ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''}
        ${gradient ? 'text-white' : ''}
        transition-all duration-300
        ${className}
      `}
      style={baseStyles}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;