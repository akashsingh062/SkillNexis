import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/auth');
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>MERN Feed Pro</span>
        <nav className={styles.nav}>
          {token ? (
            <>
              <span className={styles.userBadge}>Hello, {username}</span>
              <Link to="/" className={styles.link}>Feed</Link>
              <button onClick={handleLogout} className={styles.btnLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" className={styles.link}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
