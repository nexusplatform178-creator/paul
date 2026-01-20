import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTS8ymB6THZZNs4Bka-xx5W8kQ5oUR6NI",
  authDomain: "betting-at-developers-smc.firebaseapp.com",
  databaseURL: "https://betting-at-developers-smc-default-rtdb.firebaseio.com",
  projectId: "betting-at-developers-smc",
  storageBucket: "betting-at-developers-smc.firebasestorage.app",
  messagingSenderId: "1086266960540",
  appId: "1:1086266960540:web:688378cae5d7f170c45b59",
  measurementId: "G-QNQN61GB9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const database: Database = getDatabase(app);
export const analytics: Analytics | null = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
