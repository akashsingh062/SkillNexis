import React from 'react';
import './Button.css';

export default function Button({ text = "Click Me", variant = "primary", size = "md", isLoading = false, onClick }) {
  return (
    <button 
      className={`react-button btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : text}
    </button>
  );
}
