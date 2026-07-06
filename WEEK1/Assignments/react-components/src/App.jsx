import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Button from './components/Button';
import Form from './components/Form';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('neon');
    } else {
      setTheme('dark');
    }
  }

  function handleIncrement() {
    setCount(count + 1);
  }

  function simulateLoading() {
    setIsLoading(true);
    setTimeout(function() {
      setIsLoading(false);
    }, 2000);
  }

  function addSubmission(data) {
    setSubmissions([data, ...submissions]);
  }

  return (
    <div className={`app-wrapper ${theme}`}>
      <Header 
        logoText="Akash Singh" 
        navItems={['Overview', 'Playground', 'Submissions']} 
        currentTheme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="playground-main">
        <section className="intro">
          <h1>React Components Practice</h1>
          <p>Here I built 5 reusable components to learn props and states in React.</p>
        </section>

        <section className="components-grid">
          
          <div className="card-box">
            <h2>1. Card Component</h2>
            <div className="row">
              <Card 
                emoji="⚛️"
                title="React Basics"
                subtitle="Props and State"
                details="Props are passed to components. State is held inside components."
              />
              <Card 
                emoji="⚡"
                title="Vite Compiler"
                subtitle="Fast Dev Server"
                details="Vite runs code modules dynamically for fast coding update rates."
              />
            </div>
          </div>

          <div className="card-box">
            <h2>2. Button Component</h2>
            <div className="buttons-demo">
              <div className="control-group">
                <h3>Click Action</h3>
                <div className="flex-row">
                  <Button text="Click to Add" onClick={handleIncrement} />
                  <span>Count: {count}</span>
                </div>
              </div>

              <div className="control-group">
                <h3>Loading State</h3>
                <div className="flex-row">
                  <Button text="Click to Load" onClick={simulateLoading} variant="secondary" />
                  <Button text="Action Button" isLoading={isLoading} variant="danger" />
                </div>
              </div>

              <div className="control-group">
                <h3>Sizes</h3>
                <div className="flex-row">
                  <Button text="Small" size="sm" />
                  <Button text="Medium" size="md" />
                  <Button text="Large" size="lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="card-box form-grid-box">
            <h2>3. Form Component</h2>
            <div className="form-demo">
              <Form 
                formTitle="Subscribe Newsletter" 
                submitBtnLabel="Join Now" 
                onSubmitSuccess={addSubmission}
              />
              
              <div className="submissions-panel">
                <h3>Form Submissions</h3>
                {submissions.length === 0 ? (
                  <p className="empty-text">No submissions yet.</p>
                ) : (
                  <div className="submissions-list">
                    {submissions.map(function(item, idx) {
                      return (
                        <div key={idx} className="submission-item">
                          <strong>{item.username}</strong> ({item.email})
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        </section>
      </main>

      <Footer 
        copyrightText="© 2026 Akash Singh. React Homework."
        socialLinks={[
          { name: 'GitHub', url: 'https://github.com' },
          { name: 'LinkedIn', url: 'https://linkedin.com' }
        ]}
      />
    </div>
  );
}
