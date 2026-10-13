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
            scans.push({ id: doc.id, ...doc.data() } as ScanRecord);
          });
          return NextResponse.json({ success: true, scans });
        }
      } catch (err) {
        console.warn("Firestore query error (falling back to seed feed):", err);
      }
    }

    return NextResponse.json({
      success: true,
      scans: getSharedScans(),
    });
  } catch (error: any) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch scan history" },
      { status: 500 }
    );
  }
}
