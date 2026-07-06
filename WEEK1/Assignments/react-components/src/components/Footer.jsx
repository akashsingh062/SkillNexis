import React from 'react';
import './Footer.css';

export default function Footer({ copyrightText = "© 2026 Akash Singh", socialLinks = [] }) {
  return (
    <footer className="react-footer">
      <div className="footer-content">
        <p className="copyright-text">{copyrightText}</p>
        
        {socialLinks.length > 0 && (
          <div className="social-links-container">
            {socialLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                className="social-footer-link" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
