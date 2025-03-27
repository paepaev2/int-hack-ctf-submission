import React from 'react';
import '../../index.css';

export const Input = ({ 
  className = '', 
  variant = 'default',
  error = false,
  ...props 
}) => {
  const variantStyles = {
    default: `border-gray-300 focus:border-blue-500 focus:ring-blue-500`,
    error: `border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500`
  };

  return (
    <input 
      className={`
        block 
        w-full 
        rounded-md 
        border 
        p-2.5 
        text-sm 
        transition-all 
        duration-200 
        ease-in-out 
        ${error ? variantStyles.error : variantStyles.default}
        ${className}
      `} 
      {...props} 
    />
  );
};