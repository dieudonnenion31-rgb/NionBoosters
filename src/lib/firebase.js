import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0j4ZVzBOg2dbEXkJQJbzJpMd1FkyFAeg",
  authDomain: "nion-booster.firebaseapp.com",
  projectId: "nion-booster",
  storageBucket: "nion-booster.firebasestorage.app",
  messagingSenderId: "921106746345",
  appId: "1:921106746345:web:ff430787c683676f221978",
  measurementId: "G-N1Y0H5CJCZ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
