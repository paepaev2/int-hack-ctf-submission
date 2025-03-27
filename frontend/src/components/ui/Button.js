import React from 'react';

export const Button = ({ 
  className = '', 
  children, 
  ...props 
}) => (
  <button 
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`} 
    {...props}
  >
    {children}
  </button>
);