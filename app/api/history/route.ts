import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import { ScanRecord } from "@/lib/types";
import { getSharedScans, sharedSeedScans, deleteSharedScan } from "@/lib/scanStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { scanId, userId } = body;

    if (!scanId || !userId) {
      return NextResponse.json(
        { error: "Scan ID and farmer user ID are required" },
        { status: 400 }
      );
    }

    if (scanId.startsWith("seed-")) {
      return NextResponse.json(
        { error: "Protected record: Community reference demo scans cannot be deleted." },
        { status: 403 }
      );
    }

    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const docRef = adminDb.collection("scans").doc(scanId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const scanData = docSnap.data();
          // STRICT OWNERSHIP CHECK: Only the creating farmer device can delete this scan!
          // (Allow deletion if userId matches, or if it was an earlier guest_farmer test scan)
          if (scanData?.userId && scanData.userId !== "guest_farmer" && scanData.userId !== userId) {
            return NextResponse.json(
              { error: "Unauthorized: You can only delete scans created from your own device." },
              { status: 403 }
            );
          }
          await docRef.delete();
          deleteSharedScan(scanId, userId);
          return NextResponse.json({ success: true, deletedId: scanId });
        }
      } catch (dbErr: any) {
        console.error("Firestore document deletion error:", dbErr);
        return NextResponse.json(
          { error: dbErr?.message || "Database deletion failed" },
          { status: 500 }
        );
      }
    }

    // In-memory fallback delete
    const wasDeleted = deleteSharedScan(scanId, userId);
    return NextResponse.json({ success: true, deletedId: scanId, inMemory: wasDeleted });
  } catch (error: any) {
    console.error("Scan deletion endpoint error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process scan deletion" },
      { status: 500 }
    );
  }
}

