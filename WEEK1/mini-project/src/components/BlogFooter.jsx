import React from 'react';
import './BlogFooter.css';

export default function BlogFooter({ copyright = "© 2026 Akash Singh" }) {
  return (
    <footer className="blog-footer">
      <div className="footer-content">
        <p>{copyright}</p>
        <div className="footer-links">
          <a href="#overview">Back to Top</a>
        </div>
      </div>
    </footer>
  );
}
