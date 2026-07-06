import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(function() {
    if (!token) {
      navigate('/auth');
      return;
    }

    fetchTasks();
  }, [token, filterStatus, filterPriority]);

  async function fetchTasks() {
    try {
      let query = "";
      const params = [];
      
      if (filterStatus !== "All") {
        params.push(`status=${filterStatus}`);
      }
      if (filterPriority !== "All") {
        params.push(`priority=${filterPriority}`);
      }
      
      if (params.length > 0) {
        query = "?" + params.join("&");
      }

      const response = await fetch(`http://localhost:5004/api/tasks${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        setErrorMsg(data.error || 'Failed to load tasks');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server');
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch('http://localhost:5004/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, status, priority })
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data]);
        setTitle("");
        setDescription("");
        setStatus("Pending");
        setPriority("Medium");
      } else {
        setErrorMsg(data.error || 'Failed to create task');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server');
    }
  }

  async function handleUpdateStatus(id, newStatus) {
    try {
      const response = await fetch(`http://localhost:5004/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map(function(t) {
          return t._id === id ? data : t;
        }));
      }
    } catch (err) {
      setErrorMsg('Failed to update task status');
    }
  }

  async function handleDeleteTask(id) {
    try {
      const response = await fetch(`http://localhost:5004/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTasks(tasks.filter(function(t) {
          return t._id !== id;
        }));
      }
    } catch (err) {
      setErrorMsg('Failed to delete task');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h3>Create New Task</h3>
            <form onSubmit={handleAddTask} className={styles.form}>
              <div className={styles.field}>
                <label>Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={function(e) { setTitle(e.target.value); }}
                  placeholder="Task title"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Description</label>
                <textarea 
                  value={description}
                  onChange={function(e) { setDescription(e.target.value); }}
                  placeholder="Task description"
                  rows="3"
                />
              </div>

              <div className={styles.rowFields}>
                <div className={styles.field}>
                  <label>Priority</label>
                  <select value={priority} onChange={function(e) { setPriority(e.target.value); }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Status</label>
                  <select value={status} onChange={function(e) { setStatus(e.target.value); }}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.btnSubmit}>Add Task</button>
            </form>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <h3>My Tasks</h3>
              {errorMsg && <span className={styles.error}>{errorMsg}</span>}
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>Status Filter:</label>
                <select value={filterStatus} onChange={function(e) { setFilterStatus(e.target.value); }}>
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Priority Filter:</label>
                <select value={filterPriority} onChange={function(e) { setFilterPriority(e.target.value); }}>
                  <option value="All">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className={styles.list}>
              {tasks.length === 0 ? (
                <p className={styles.empty}>No tasks matching filters found.</p>
              ) : (
                tasks.map(function(task) {
                  return (
                    <div key={task._id} className={styles.taskItem}>
                      <div className={styles.taskHeader}>
                        <h4>{task.title}</h4>
                        <div className={styles.tags}>
                          <span className={styles[`priority${task.priority}`]}>
                            {task.priority}
                          </span>
                          <span className={styles.statusTag}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      {task.description && <p className={styles.taskDesc}>{task.description}</p>}

                      <div className={styles.taskActions}>
                        <div className={styles.statusControls}>
                          <span>Change Status:</span>
                          <select 
                            value={task.status} 
                            onChange={function(e) { handleUpdateStatus(task._id, e.target.value); }}
                            className={styles.statusSelect}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <button onClick={function() { handleDeleteTask(task._id); }} className={styles.btnDelete}>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
