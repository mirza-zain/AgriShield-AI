#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";
import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Automatically load environment variables from .env.local or .env if available
if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

console.log("=================================================");
console.log(" AgriShield AI - Cloudflare R2 Image Migration   ");
console.log("=================================================");

// 1. Initialize Firebase Admin (Firestore)
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

// 2. Initialize Cloudflare R2 S3 Client with normalized origin endpoint
const rawEndpoint = process.env.CLOUDFLARE_R2_ENDPOINT || process.env.CLOUDFLARE_R2;
let endpoint = rawEndpoint;
try {
  endpoint = new URL(rawEndpoint).origin;
} catch {}

const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucket = process.env.CLOUDFLARE_R2_BUCKET;
const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "");

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
  console.error("\n[!] Missing required Cloudflare R2 configuration:");
  console.error("Endpoint   :", Boolean(endpoint));
  console.error("Access Key :", Boolean(accessKeyId));
  console.error("Secret Key :", Boolean(secretAccessKey));
  console.error("Bucket     :", Boolean(bucket));
  console.error("Public URL :", Boolean(publicBaseUrl));
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

console.log(`Connected to Firestore : ${projectId}`);
console.log(`Target Cloudflare R2   : Bucket '${bucket}'`);
console.log(`Public CDN Base URL    : ${publicBaseUrl}\n`);

async function runMigration() {
  try {
    // Clean up any double-prefixed keys from earlier run
    const existingList = await r2.send(new ListObjectsV2Command({ Bucket: bucket }));
    if (existingList.Contents) {
      for (const obj of existingList.Contents) {
        if (obj.Key?.startsWith(`${bucket}/`)) {
          const cleanKey = obj.Key.substring(bucket.length + 1);
          console.log(`Normalizing R2 object: ${obj.Key} -> ${cleanKey}`);
          await r2.send(
            new CopyObjectCommand({
              Bucket: bucket,
              CopySource: `${bucket}/${obj.Key}`,
              Key: cleanKey,
              ContentType: "image/jpeg",
              MetadataDirective: "REPLACE",
            })
          );
          await r2.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: obj.Key,
            })
          );
        }
      }
    }

    console.log("Querying 'scans' collection from Firestore...");
    const snapshot = await db.collection("scans").get();

    if (snapshot.empty) {
      console.log("No scan records found in Firestore.");
      return;
    }

    console.log(`Found ${snapshot.size} total scan document(s).\n`);

    let migratedDocs = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates = {};
      let needsUpdate = false;

      const cleanImageUrl = `${publicBaseUrl}/scans/${doc.id}.jpg`;
      const cleanThumbUrl = `${publicBaseUrl}/scans/${doc.id}_thumb.jpg`;

      // Check if imageUrl needs normalization or migration
      if (data.imageUrl !== cleanImageUrl) {
        updates.imageUrl = cleanImageUrl;
        needsUpdate = true;
      }

      // Check if imageThumbnail needs normalization or migration
      if (data.imageThumbnail !== cleanThumbUrl) {
        updates.imageThumbnail = cleanThumbUrl;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await doc.ref.update(updates);
        console.log(`  [✓] Updated Firestore scan '${doc.id}' with clean CDN URLs.`);
        migratedDocs++;
      }
    }

    console.log("\n=================================================");
    console.log(" Cloudflare R2 Normalization & Migration Complete! ");
    console.log("=================================================");
    console.log(`Documents Updated : ${migratedDocs}`);
    console.log("All scans now reference clean Cloudflare CDN URLs.");
    console.log("=================================================\n");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

runMigration();
