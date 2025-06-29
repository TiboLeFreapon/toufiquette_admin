import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWUQhWf7vNJhUShwHFv4AcYW_Sfa0y8YE",
  authDomain: "toufiquette-57f90.firebaseapp.com",
  projectId: "toufiquette-57f90",
  storageBucket: "toufiquette-57f90.firebasestorage.app",
  messagingSenderId: "604676880150",
  appId: "1:604676880150:web:da40b710e2c0aa9718c237",
  measurementId: "G-VCQYDNTNSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 