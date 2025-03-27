import React from 'react';

export const Input = ({ 
  className = '', 
  ...props 
}) => (
  <input 
    className={`border p-2 rounded ${className}`} 
    {...props} 
  />
);