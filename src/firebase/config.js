// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASoKOr-avqgF8UVAQvSg4mBdbSpVW9R0c",
  authDomain: "downriverchristianquestion-web.firebaseapp.com",
  projectId: "downriverchristianquestion-web",
  storageBucket: "downriverchristianquestion-web.firebasestorage.app",
  messagingSenderId: "27365996491",
  appId: "1:27365996491:web:c2c7b87e142e54a807e84e",
  measurementId: "G-TSRMZZLMK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Initialize and export Auth
export const auth = getAuth(app);

export default app;