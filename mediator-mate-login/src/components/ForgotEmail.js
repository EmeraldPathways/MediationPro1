import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotEmail.css';

const ForgotEmail = () => {
    const [email, setEmail] = useState('');

  return (
    <div className="forgot-email-container">
      <h1 className="mediator-pro-header">MEDIATOR PRO</h1> {/* Added Header */}
      <form className="forgot-email-form">
        <h2>Forgot Email</h2>
        <p>
            Enter the email you used to sign up and we will send you further instructions.
        </p>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="forgot-email-button">
          Submit
        </button>
      <Link to="/login" className="forgot-link">Back to Login</Link>
      </form>
    </div>
  );
};

export default ForgotEmail;