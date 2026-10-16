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

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agrishield-ai";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Strip accidental wrapping quotes from Vercel env input
    privateKey = privateKey.trim().replace(/^['"]|['"]$/g, "");
    // Handle escaped newlines from environment variable strings
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const hasExplicitCert = Boolean(clientEmail && privateKey);
  const isCloudRun = Boolean(process.env.K_SERVICE || process.env.FUNCTION_NAME || process.env.GAE_SERVICE);

  // In local development without complete explicit credentials, return null immediately to avoid metadata network timeout!
  if (!hasExplicitCert && !isCloudRun) {
    return null;
  }

  if (admin.apps.length > 0) {
    const db = admin.firestore();
    try {
      db.settings({ ignoreUndefinedProperties: true });
    } catch (e) {}
    return db;
  }

  try {
    const storageBucket =
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${projectId}.appspot.com`;

    if (hasExplicitCert) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: clientEmail!,
          privateKey: privateKey!,
        }),
        storageBucket,
      });
    } else {
      // In Google Cloud Run or GCP environment, initialize with Google Application Default Credentials (ADC)
      admin.initializeApp({
        projectId,
        storageBucket,
      });
    }
    const db = admin.firestore();
    try {
      db.settings({ ignoreUndefinedProperties: true });
    } catch (e) {}
    return db;
  } catch (error) {
    console.warn("Firebase Admin SDK init warning (gracefully falling back to in-memory store):", error);
    return null;
  }
}

// Access Firebase Admin Storage bucket
function getAdminStorage(): admin.storage.Storage | null {
  if (typeof window !== "undefined") return null;

  const db = getAdminDb();
  if (!db || admin.apps.length === 0) return null;

  try {
    return admin.storage();
  } catch (err) {
    console.warn("Firebase Admin Storage access warning:", err);
    return null;
  }
}

// Upload scan image buffer to Firebase Storage and return public HTTPS URL
async function uploadScanImageToStorage(
  scanId: string,
  base64Data: string,
  mimeType = "image/jpeg"
): Promise<string | null> {
  if (typeof window !== "undefined") return null;

  try {
    const storage = getAdminStorage();
    if (!storage) return null;

    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agrishield-ai"}.appspot.com`;

    const bucket = storage.bucket(bucketName);
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const filePath = `scans/${scanId}.jpg`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        cacheControl: "public, max-age=31536000, immutable",
      },
      resumable: false,
    });

    try {
      await file.makePublic();
    } catch {
      // In case bucket has uniform bucket-level access enabled, makePublic may be a no-op
    }

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
    return publicUrl;
  } catch (uploadErr) {
    console.warn("Firebase Storage upload skipped (falling back):", uploadErr);
    return null;
  }
}

export { clientApp, clientAuth, clientDb, getAdminDb, getAdminStorage, uploadScanImageToStorage };
