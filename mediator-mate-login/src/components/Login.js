import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, OAuthProvider, onAuthStateChanged } from "firebase/auth";
import "./Login.css"; // Import the CSS file
import { auth, googleProvider, microsoftProvider } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to main app or dashboard
        navigate('/');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      // Navigation is handled by the useEffect
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User logged in with Google successfully");
      const user = result.user;
      // Store user info if needed
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: 'google'
      }));
      // Navigation is handled by the useEffect
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Failed to sign in with Google. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      console.log("User logged in with Microsoft successfully");
      
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
      // Navigation is handled by the useEffect
    } catch (error) {
      console.error("Microsoft Sign-In Error:", error);
      setError("Failed to sign in with Microsoft. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="mediator-pro-header">MEDIATOR PRO</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Link to="/forgotemail" className="forgot-link">Forgot email</Link>
            
          </div>
          <div className="input-group">
            
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />        
            <Link to="/password-reset" className="forgot-link">Forgot password?</Link>
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          {/* Social Login Buttons Moved Inside Form */}
          <div className="social-login">
            <div className="social-login-buttons">
              <button 
                type="button" 
                onClick={handleGoogleSignIn} 
                className="google-login-button"
                disabled={loading}
              >
                <i className="fab fa-google"></i> Sign in with Google
              </button>
              <button 
                type="button" 
                onClick={handleMicrosoftSignIn} 
                className="microsoft-login-button"
                disabled={loading}
              >
                <i className="fab fa-microsoft"></i> Sign in with Microsoft
              </button>
            </div>
          </div>
        </form>
        <div className="signup-prompt">
          <p>Not a subscriber to Mediator Pro? Sign up</p>
          <Link to="/signup" className="signup-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;