// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const env = import.meta.env;

// Use placeholder config when env vars are missing (e.g. no .env file)
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

let auth;
let googleProvider;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (err) {
  console.warn('Firebase init failed (missing .env?):', err.message);
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };
