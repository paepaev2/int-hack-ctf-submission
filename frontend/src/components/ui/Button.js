import React from 'react';
import '../../index.css';

export const Button = ({ 
  variant = 'primary', 
  className = '', 
  children, 
  disabled = false,
  ...props 
}) => {
  const variantStyles = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };

  return (
    <button 
      className={`
        px-4 py-2 
        rounded-md 
        transition-all 
        duration-200 
        ease-in-out 
        text-sm 
        font-medium 
        shadow-sm 
        focus:outline-none 
        ${variantStyles[variant]} 
        ${className}
      `} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};