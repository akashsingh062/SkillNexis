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

  function validateInputs() {
    if (username.trim().length < 3) {
      setErrorMsg("Username must be at least 3 characters long");
      return false;
    }
    if (password.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validateInputs()) return;

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5007${endpoint}`, {
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
        navigate('/');
      } else {
        setSuccessMsg("Registration successful! You can login now.");
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
        <h2>{isLogin ? 'Sign In to Feed' : 'Create Feed Account'}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={function(e) { setUsername(e.target.value); }}
              placeholder="Username (min 3 chars)"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              placeholder="Password (min 6 chars)"
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
            {isLogin ? "New user? Create a profile" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
