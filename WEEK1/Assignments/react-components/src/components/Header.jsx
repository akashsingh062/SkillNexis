import React from 'react';
import './Header.css';

export default function Header({ logoText = "Akash Singh", navItems = [], currentTheme, onThemeToggle }) {
  return (
    <header className={`react-header ${currentTheme}`}>
      <div className="header-content">
        <div className="logo-brand">
          <span className="logo-dot"></span>
          {logoText}
        </div>
        
        <nav className="header-nav">
          <ul>
            {navItems.map((item, idx) => (
              <li key={idx}>
                <a href={`#${item.toLowerCase()}`} className="nav-item-link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="header-actions">
          <button className="btn-theme-toggle" onClick={onThemeToggle}>
            {currentTheme === 'dark' ? 'Dark Theme' : 'Neon Theme'}
          </button>
        </div>
      </div>
    </header>
  );
}
