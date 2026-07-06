import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/auth');
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>SoundMarket Capstone</span>
        <nav className={styles.nav}>
          {token ? (
            <>
              <Link to="/" className={styles.link}>Catalog</Link>
              {role === 'admin' && (
                <Link to="/admin" className={styles.linkAdmin}>Admin Panel</Link>
              )}
              {role !== 'admin' && (
                <span className={styles.cartTag}>Cart ({cartCount})</span>
              )}
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
