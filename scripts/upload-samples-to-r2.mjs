#!/usr/bin/env node

import fs from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Load environment without logging any secrets
if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

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
  console.error("Missing required Cloudflare R2 configuration.");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

const SAMPLES = [
  {
    id: "rotten-apple",
    name: "Rotten Apple",
    fullUrl: "https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=1200&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "spoiled-pumpkin",
    name: "Spoiled Pumpkin",
    fullUrl: "https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=1200&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "drought-corn",
    name: "Drought Corn",
    fullUrl: "https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=1200&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "sweet-corn",
    name: "Sweet Corn",
    fullUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "vine-tomatoes",
    name: "Vine Tomatoes",
    fullUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "green-basil",
    name: "Green Basil",
    fullUrl: "https://images.unsplash.com/photo-1534944645004-bf75556ce377?auto=format&fit=crop&w=1200&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1534944645004-bf75556ce377?auto=format&fit=crop&w=200&q=60",
  },
];

async function uploadSample(sample) {
  console.log(`Processing sample: ${sample.name} (${sample.id})...`);

  // 1. Download and upload full-res inspection copy
  const fullRes = await fetch(sample.fullUrl);
  if (!fullRes.ok) throw new Error(`Failed to fetch ${sample.fullUrl}: ${fullRes.status}`);
  const fullBuffer = Buffer.from(await fullRes.arrayBuffer());

  const fullKey = `samples/${sample.id}.jpg`;
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: fullKey,
      Body: fullBuffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  console.log(`  [✓] Full copy uploaded: ${publicBaseUrl}/${fullKey} (${(fullBuffer.length / 1024).toFixed(1)} KB)`);

  // 2. Download and upload low-res carousel thumbnail
  const thumbRes = await fetch(sample.thumbUrl);
  if (!thumbRes.ok) throw new Error(`Failed to fetch ${sample.thumbUrl}: ${thumbRes.status}`);
  const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());

  const thumbKey = `samples/${sample.id}_thumb.jpg`;
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: thumbKey,
      Body: thumbBuffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  console.log(`  [✓] Thumbnail uploaded: ${publicBaseUrl}/${thumbKey} (${(thumbBuffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log(`Starting Cloudflare R2 Sample Asset Migration to bucket '${bucket}'...`);
  for (const sample of SAMPLES) {
    await uploadSample(sample);
  }
  console.log("\nAll 6 sample images and thumbnails uploaded to Cloudflare R2 successfully!");
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
