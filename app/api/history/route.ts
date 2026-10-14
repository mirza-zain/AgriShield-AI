import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import { ScanRecord } from "@/lib/types";
import { getSharedScans, sharedSeedScans } from "@/lib/scanStore";

export async function GET() {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const snapshot = await adminDb
          .collection("scans")
          .orderBy("createdAt", "desc")
          .limit(10)
          .get();

        if (!snapshot.empty) {
          const scans: ScanRecord[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as ScanRecord;
            // Clean up any historic truncated thumbnails ending with ...
            if (data.imageThumbnail && data.imageThumbnail.endsWith("...")) {
              data.imageThumbnail = data.imageUrl && !data.imageUrl.endsWith("...") ? data.imageUrl : undefined;
            }
            scans.push({ id: doc.id, ...data });
          });
          return NextResponse.json({ success: true, scans });
        }
      } catch (err) {
        console.warn("Firestore query error (falling back to seed feed):", err);
      }
    }

    const cleanSharedScans = getSharedScans().map((scan) => {
      if (scan.imageThumbnail && scan.imageThumbnail.endsWith("...")) {
        return {
          ...scan,
          imageThumbnail: scan.imageUrl && !scan.imageUrl.endsWith("...") ? scan.imageUrl : undefined,
        };
      }
      return scan;
    });

    return NextResponse.json({
      success: true,
      scans: cleanSharedScans,
    });
  } catch (error: any) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch scan history" },
      { status: 500 }
    );
  }
}
