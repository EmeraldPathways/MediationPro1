// frontend/src/App.js
import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from './firebase';
import Signup from './components/Signup';
import Login from './components/Login';
import PasswordReset from './components/PasswordReset';
import ForgotEmail from './components/ForgotEmail';
import FilesPage from './components/FilesPage'; // Assuming this component exists for file management

const auth = getAuth(firebaseApp);

// Create AuthContext
const AuthContext = createContext();

// Create a custom hook to access the AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  return user ? children : <Navigate to="/login" />;
};

// App component
function App() {
  const [user, loading] = useAuthState(auth);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Router>
        <div>
          <nav>
            <ul>
              {user && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
          </nav>

          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/forgotemail" element={<ForgotEmail />} />
            <Route path="/files" element={<PrivateRoute><FilesPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} /> {/* Default to Login */}
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;