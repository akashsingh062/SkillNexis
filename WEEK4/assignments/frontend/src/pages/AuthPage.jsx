import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("All fields are required");
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5006${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Something went wrong');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setSuccessMsg(`Registration successful! Role: ${data.role}. Please login.`);
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to backend server");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>{isLogin ? 'Capstone Log In' : 'Capstone Sign Up'}</h2>
        <p className={styles.hint}>Tip: Use "admin" in username to register as an Administrator.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={function(e) { setUsername(e.target.value); }}
              placeholder="Enter username"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              placeholder="Enter password"
              required
            />
          </div>

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}
          {successMsg && <div className={styles.success}>{successMsg}</div>}

          <button type="submit" className={styles.btnSubmit}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.toggleRow}>
          <button 
            className={styles.btnToggle} 
            onClick={function() {
              setIsLogin(!isLogin);
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            {isLogin ? "Create an account" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
