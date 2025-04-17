import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './PasswordReset.css';
import { app } from '../firebase';

const auth = getAuth();

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="password-reset-container">
      <h1 className="mediator-pro-header">MEDIATOR PRO</h1> {/* Added Header */}
      <form className="password-reset-form">
          <h2>Reset Password</h2>
          <label htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="password-reset-button">
            Reset Password
          </button>
          <Link to="/login" className="forgot-link">Back to Login</Link>
      </form>
    </div>
  );
};

export default PasswordReset;