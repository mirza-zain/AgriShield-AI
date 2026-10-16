import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Cache singleton S3 client for Cloudflare R2
let r2Client: S3Client | null = null;

export function getR2Client(): S3Client | null {
  if (r2Client) return r2Client;

  const rawEndpoint = process.env.CLOUDFLARE_R2_ENDPOINT || process.env.CLOUDFLARE_R2;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!rawEndpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  // Ensure endpoint is clean origin (e.g. https://<account_id>.r2.cloudflarestorage.com without bucket suffix)
  let endpoint = rawEndpoint;
  try {
    endpoint = new URL(rawEndpoint).origin;
  } catch {}

  try {
    r2Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    return r2Client;
  } catch (err) {
    console.warn("Failed to initialize Cloudflare R2 S3 Client:", err);
    return null;
  }
}

/**
 * Upload a binary buffer to Cloudflare R2 and return the public CDN URL
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType = "image/jpeg"
): Promise<string | null> {
  const client = getR2Client();
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "");

  if (!client || !bucket) {
    return null;
  }

  try {
    const cleanKey = key.replace(/^\/+/, "");
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=604800",
    });

    await client.send(command);

    if (publicBaseUrl) {
      return `${publicBaseUrl}/${cleanKey}`;
    }

    return null;
  } catch (err) {
    console.error(`Failed to upload ${key} to Cloudflare R2:`, err);
    return null;
  }
}

/**
 * Helper to upload a base64 scan full image directly to Cloudflare R2
 */
export async function uploadScanImageToR2(
  scanId: string,
  base64Data: string,
  mimeType = "image/jpeg"
): Promise<string | null> {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const key = `scans/${scanId}.jpg`;
    return await uploadToR2(key, buffer, mimeType);
  } catch (err) {
    console.warn("Error uploading scan image to Cloudflare R2:", err);
    return null;
  }
}

/**
 * Helper to upload a base64 scan thumbnail directly to Cloudflare R2
 */
export async function uploadScanThumbnailToR2(
  scanId: string,
  base64Data: string,
  mimeType = "image/jpeg"
): Promise<string | null> {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const key = `scans/${scanId}_thumb.jpg`;
    return await uploadToR2(key, buffer, mimeType);
  } catch (err) {
    console.warn("Error uploading thumbnail to Cloudflare R2:", err);
    return null;
  }
}
