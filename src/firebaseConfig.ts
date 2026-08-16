// Firebase Configuration for Awaaz-AI
// Connects to Firebase Realtime Database for IoT sensor data ingestion
//
// TODO: Replace the placeholder values below with your actual Firebase project credentials.
// You can find these in your Firebase Console > Project Settings > General > Your apps > Config

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// TODO: Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp | null = null;
let database: Database | null = null;

/**
 * Check if Firebase is configured with real credentials.
 * Returns false if placeholder values are still present.
 */
function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}

// Only initialize Firebase if real credentials are provided
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('[Awaaz-AI] Firebase initialized successfully for IoT sensor data.');
  } catch (error) {
    console.warn('[Awaaz-AI] Firebase initialization failed:', error);
  }
} else {
  console.info(
    '[Awaaz-AI] Firebase not configured — IoT streetlight alerts disabled. ' +
    'Replace placeholder values in src/firebaseConfig.ts with your project credentials.'
  );
}

export { app, database };
