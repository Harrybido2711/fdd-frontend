// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdW_jKOcqLiY4DwBE-A39Ey7cuSRNkFNQ",
  authDomain: "rsae-fdd.firebaseapp.com",
  projectId: "rsae-fdd",
  storageBucket: "rsae-fdd.firebasestorage.app",
  messagingSenderId: "105464310683",
  appId: "1:105464310683:web:754a0409c8a40231ae8f3e",
  measurementId: "G-XQS4R1D8EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
