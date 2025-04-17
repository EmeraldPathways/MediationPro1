import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, OAuthProvider } from 'firebase/auth';
import './Signup.css'; // Import the CSS file
import { auth, googleProvider, microsoftProvider } from '../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully');
      
      // Store user info if needed
      const user = userCredential.user;
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: 'email'
      }));
      
      // Redirect to the file management page
      navigate('/');
    } catch (error) {
      setError("Failed to sign up. " + (error.message || ""));
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed up with Google successfully");
      
      const user = result.user;
      // Store user info if needed
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: 'google'
      }));
      
      // Redirect to main page
      navigate('/');
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      setError("Failed to sign up with Google. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignUp = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      console.log("User signed up with Microsoft successfully");
      
      // Get Microsoft access token for later use with MS Graph API
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      // Store the token for later use with MS Graph API for emails
      localStorage.setItem('msAccessToken', accessToken);
      
      const user = result.user;
      // Store user info if needed
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: 'microsoft'
      }));
      
      // Redirect to main page
      navigate('/');
    } catch (error) {
      console.error("Microsoft Sign-Up Error:", error);
      setError("Failed to sign up with Microsoft. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="mediator-pro-header">MEDIATOR PRO</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSignup} className="signup-form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {/* Social Sign Up Buttons - styled like login */}
        <div className="social-login">
          <div className="social-login-buttons">
            <button 
              type="button" 
              onClick={handleGoogleSignUp} 
              className="google-login-button"
              disabled={loading}
            >
              <i className="fab fa-google"></i> Sign up with Google
            </button>
            <button 
              type="button" 
              onClick={handleMicrosoftSignUp} 
              className="microsoft-login-button"
              disabled={loading}
            >
              <i className="fab fa-microsoft"></i> Sign up with Microsoft
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;