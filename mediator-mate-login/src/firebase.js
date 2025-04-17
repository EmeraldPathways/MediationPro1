// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8m87YOvTn2y8gYR8gz1VVw-69OIft0ks",
  authDomain: "medation-pro.firebaseapp.com",
  projectId: "medation-pro",
  storageBucket: "medation-pro.firebasestorage.app",
  messagingSenderId: "78821825175",
  appId: "1:78821825175:web:b6be4c0933840d55b727d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set up Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
// Add additional Google scopes if needed
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Set up Microsoft Auth Provider
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  // Optional parameters for Microsoft authentication
  tenant: 'common', // Use 'common' for any organization or consumer accounts, or specify your tenant ID
  prompt: 'consent'
});

// Add scopes for Microsoft Graph API (for email access)
microsoftProvider.addScope('mail.read');
microsoftProvider.addScope('mail.send');
microsoftProvider.addScope('user.read');
microsoftProvider.addScope('calendars.read');
microsoftProvider.addScope('openid');
microsoftProvider.addScope('profile');
microsoftProvider.addScope('offline_access');

export { auth, googleProvider, microsoftProvider };
export default app;