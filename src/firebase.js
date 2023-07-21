// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FB_API_KEY,
  // authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID
  apiKey: 'AIzaSyD4M4AAURg5jTeeCGfB8T4L1JgPUPKiT48',
  authDomain: 'stylegacy-e4ba6.firebaseapp.com',
  projectId: 'stylegacy-e4ba6',
  storageBucket: 'stylegacy-e4ba6.appspot.com',
  messagingSenderId: '945307463920',
  appId: '1:945307463920:web:8211831d5ff9a001a21235'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const apiKey = firebaseConfig.apiKey;
