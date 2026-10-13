import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as admin from "firebase-admin";

// Client-side Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockKeyForDevelopment",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "agrishield-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "agrishield-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "agrishield-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Initialize Client Firebase safely (singleton pattern)
const clientApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const clientAuth = getAuth(clientApp);
const clientDb = getFirestore(clientApp);

// Initialize Firebase Admin SDK for Server-side operations (App Router API routes)
function getAdminDb(): admin.firestore.Firestore | null {
  if (typeof window !== "undefined") {
    // Prevent execution on browser client
    return null;
  }

  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agrishield-ai";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Handle escaped newlines from environment variable strings
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      // In Google Cloud Run or GCP environment, initialize with Google Application Default Credentials (ADC)
      admin.initializeApp({
        projectId,
      });
    }
    return admin.firestore();
  } catch (error) {
    console.warn("Firebase Admin SDK init warning (will gracefully fallback to mock in local demo mode):", error);
    return null;
  }
}

export { clientApp, clientAuth, clientDb, getAdminDb };

