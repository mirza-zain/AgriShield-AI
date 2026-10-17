#!/usr/bin/env node

import fs from "node:fs";
import admin from "firebase-admin";

// Automatically load environment variables from .env.local or .env if available
if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

console.log("=================================================");
console.log(" AgriShield AI - Firestore Translations Cleanup ");
console.log("=================================================");

// 1. Initialize Firebase Admin safely
const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "agrishield-ai";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.trim().replace(/^['"]|['"]$/g, "");
  privateKey = privateKey.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  if (clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    admin.initializeApp({ projectId });
  }
}

const db = admin.firestore();

async function runCleanup() {
  try {
    console.log(`Connecting to Firestore project: ${projectId}...`);
    const snapshot = await db.collection("scans").get();

    if (snapshot.empty) {
      console.log("No scans found in Firestore.");
      return;
    }

    console.log(`Found ${snapshot.size} total scans in database. Checking for translations...`);
    let cleanedCount = 0;
    let skippedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Protect demo seeds
      if (doc.id.startsWith("seed-")) {
        skippedCount++;
        continue;
      }

      // Check if document has translations field
      if (data.translations !== undefined) {
        await doc.ref.update({
          translations: admin.firestore.FieldValue.delete(),
        });
        console.log(`✔ Cleaned translations from scan: ${doc.id} (${data.crop_name || "Unknown Crop"})`);
        cleanedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log("=================================================");
    console.log(`Cleanup Complete!`);
    console.log(`- Cleaned scans: ${cleanedCount}`);
    console.log(`- Skipped scans: ${skippedCount}`);
    console.log("=================================================");
  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    process.exit(0);
  }
}

runCleanup();
