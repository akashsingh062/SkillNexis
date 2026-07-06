import React, { useState } from 'react';
import './Form.css';

export default function Form({ formTitle = "Sign Up", submitBtnLabel = "Submit", onSubmitSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    if (username.trim() === "") {
      newErrors.username = "Name is required.";
    }

    if (email.trim() === "" || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({ username, email });
      }

      setUsername('');
      setEmail('');
      
      setTimeout(function() {
        setIsSuccess(false);
      }, 4000);
    }
  }

  return (
    <form className="react-form-component" onSubmit={handleSubmit} noValidate>
      <h3>{formTitle}</h3>
      
      <div className="form-field">
        <label>Name</label>
        <input 
          type="text" 
          value={username}
          onChange={function(e) { setUsername(e.target.value); }}
          placeholder="Akash Singh"
          required
        />
        {errors.username && <span className="field-error-text">{errors.username}</span>}
      </div>

      <div className="form-field">
        <label>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={function(e) { setEmail(e.target.value); }}
          placeholder="akash@example.com"
          required
        />
        {errors.email && <span className="field-error-text">{errors.email}</span>}
      </div>

      <button type="submit" className="form-submit-button">
        {submitBtnLabel}
      </button>

      {isSuccess && (
        <div className="form-success-banner">
          Submission successful! Thank you.
        </div>
      )}
    </form>
  );
}
