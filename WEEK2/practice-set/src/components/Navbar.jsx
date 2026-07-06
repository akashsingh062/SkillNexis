import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>My React App</span>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>Products</Link>
          <Link to="/todo" className={styles.link}>To-Do List</Link>
        </nav>
      </div>
    </header>
  );
}
