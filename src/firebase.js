import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDkHdgMtwu68QeKJtb_O6ahYb3f5KPOsZs",
  authDomain: "flyer-portal.firebaseapp.com",
  projectId: "flyer-portal",
  storageBucket: "flyer-portal.firebasestorage.app",
  messagingSenderId: "1085181392799",
  appId: "1:1085181392799:web:3e8212a9e22dd357cd2faa",
  measurementId: "G-EMK0F2KCV1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
