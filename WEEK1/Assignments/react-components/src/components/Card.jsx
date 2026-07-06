import React, { useState } from 'react';
import './Card.css';

export default function Card({ emoji = "📦", title = "Card Title", subtitle = "Card Subtitle", details = "Detailed card description." }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleExpand() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="react-card">
      <div className="card-header-row">
        <span className="card-icon">{emoji}</span>
        <div className="card-titles">
          <h3>{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>
      
      <div className="card-actions-row">
        <button className="btn-card-toggle" onClick={toggleExpand}>
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {isExpanded && (
        <div className="card-details-panel">
          <p>{details}</p>
        </div>
      )}
    </div>
  );
}
