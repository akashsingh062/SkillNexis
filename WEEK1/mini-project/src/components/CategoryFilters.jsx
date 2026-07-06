import React from 'react';
import './CategoryFilters.css';

export default function CategoryFilters({ categories = [], activeCategory = "All", onCategorySelect }) {
  return (
    <div className="categories-filter-container">
      <div className="categories-row">
        {categories.map(function(category, idx) {
          return (
            <button 
              key={idx}
              className={`category-pill-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={function() { onCategorySelect(category); }}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
