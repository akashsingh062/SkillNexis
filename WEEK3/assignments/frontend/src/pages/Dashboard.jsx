import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(function() {
    if (!token) {
      navigate('/auth');
      return;
    }

    fetchTodos();
  }, [token]);

  async function fetchTodos() {
    try {
      const response = await fetch('http://localhost:5003/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTodos(data);
      } else {
        setErrorMsg(data.error || 'Failed to load tasks');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server');
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await fetch('http://localhost:5003/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, imageUrl })
      });
      const data = await response.json();
      if (response.ok) {
        setTodos([...todos, data]);
        setText("");
        setImageUrl("");
      } else {
        setErrorMsg(data.error || 'Failed to create task');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server');
    }
  }

  async function handleToggle(id, completedVal) {
    try {
      const response = await fetch(`http://localhost:5003/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !completedVal })
      });
      const data = await response.json();
      if (response.ok) {
        setTodos(todos.map(function(t) {
          return t._id === id ? data : t;
        }));
      }
    } catch (err) {
      setErrorMsg('Failed to toggle task');
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:5003/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTodos(todos.filter(function(t) {
          return t._id !== id;
        }));
      }
    } catch (err) {
      setErrorMsg('Failed to delete task');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Task Dashboard</h2>
        
        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleAdd} className={styles.form}>
          <input 
            type="text" 
            value={text}
            onChange={function(e) { setText(e.target.value); }}
            placeholder="Write task text..."
            required
            className={styles.input}
          />
          <input 
            type="text" 
            value={imageUrl}
            onChange={function(e) { setImageUrl(e.target.value); }}
            placeholder="Image URL (optional)"
            className={styles.input}
          />
          <button type="submit" className={styles.btnAdd}>Add Todo</button>
        </form>

        <div className={styles.list}>
          {todos.length === 0 ? (
            <p className={styles.empty}>No tasks created yet.</p>
          ) : (
            todos.map(function(item) {
              return (
                <div key={item._id} className={styles.item}>
                  <div className={styles.todoContent}>
                    <input 
                      type="checkbox" 
                      checked={item.completed}
                      onChange={function() { handleToggle(item._id, item.completed); }}
                      className={styles.checkbox}
                    />
                    <div className={styles.textGroup}>
                      <span className={item.completed ? styles.completedText : styles.todoText}>
                        {item.text}
                      </span>
                      {item.imageUrl && (
                        <div className={styles.thumbnailBox}>
                          <img src={item.imageUrl} alt="Attachment" className={styles.thumbnail} />
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={function() { handleDelete(item._id); }} className={styles.btnDelete}>
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
