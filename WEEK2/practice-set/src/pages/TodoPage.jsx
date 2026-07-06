import React, { useState } from 'react';
import styles from './TodoPage.module.css';

export default function TodoPage() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Read Week 2 PDF files" },
    { id: 2, text: "Complete react router setup" }
  ]);
  const [taskText, setTaskText] = useState("");

  function handleAddTask(e) {
    e.preventDefault();
    if (taskText.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: taskText.trim()
    };

    setTodos([...todos, newTodo]);
    setTaskText("");
  }

  function handleDeleteTask(idToDelete) {
    const updatedTodos = todos.filter(function(todo) {
      return todo.id !== idToDelete;
    });
    setTodos(updatedTodos);
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Task Organizer</h2>
      
      <form onSubmit={handleAddTask} className={styles.form}>
        <input 
          type="text" 
          value={taskText}
          onChange={function(e) { setTaskText(e.target.value); }}
          placeholder="Write a new task..."
          className={styles.input}
        />
        <button type="submit" className={styles.btnAdd}>Add Task</button>
      </form>

      <div className={styles.listContainer}>
        {todos.length === 0 ? (
          <p className={styles.emptyText}>All tasks completed! Nice work.</p>
        ) : (
          <ul className={styles.list}>
            {todos.map(function(todo) {
              return (
                <li key={todo.id} className={styles.item}>
                  <span className={styles.todoText}>{todo.text}</span>
                  <button 
                    onClick={function() { handleDeleteTask(todo.id); }} 
                    className={styles.btnDelete}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
