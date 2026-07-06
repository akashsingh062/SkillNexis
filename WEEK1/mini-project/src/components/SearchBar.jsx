import React from 'react';
import './SearchBar.css';

export default function SearchBar({ searchQuery = "", onSearchChange }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={function(e) { onSearchChange(e.target.value); }}
          placeholder="Search articles..."
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={function() { onSearchChange(""); }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
