import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/auth');
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>Task Manager Pro</span>
        <nav className={styles.nav}>
          {token ? (
            <>
              <Link to="/" className={styles.link}>Tasks Board</Link>
              <button onClick={handleLogout} className={styles.btnLogout}>
                Logout
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
