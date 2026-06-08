import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL,
};

let db = null;

// Only initialize if we are running in the browser and credentials are valid
if (
  typeof window !== 'undefined' &&
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your-api-key-here' &&
  firebaseConfig.projectId
) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getDatabase(app);
  } catch (error) {
    console.warn('Failed to initialize Firebase client SDK:', error);
  }
} else if (typeof window !== 'undefined') {
  console.warn(
    'Firebase API key is missing or using placeholders. Like button will operate in offline mock mode.'
  );
}

export { db };
