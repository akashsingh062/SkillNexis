import React from 'react';
import './BlogHeader.css';

export default function BlogHeader({ title = "DevPulse Blog", subtitle = "Insights on code, design, and audio architecture.", activePostsCount = 0 }) {
  return (
    <header className="blog-header">
      <div className="header-container">
        <div className="logo-brand">
          <span className="pulsing-dot"></span>
          Akash.Blog
        </div>
        
        <div className="header-hero">
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
          <div className="active-count-tag">
            Showing {activePostsCount} {activePostsCount === 1 ? 'Article' : 'Articles'}
          </div>
        </div>
      </div>
    </header>
  );
}
