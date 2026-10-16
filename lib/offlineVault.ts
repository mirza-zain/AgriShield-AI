import { ScanRecord } from "./types";

const DB_NAME = "agrishield_offline_vault";
const STORE_NAME = "scans";
const DB_VERSION = 1;

// Maximum community/cooperative reference scans preserved in local cache
export const MAX_COMMUNITY_ITEMS = 30;

/**
 * Open or initialize the IndexedDB instance safely
 */
function openVaultDb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn("AgriShield IndexedDB open failed:", request.error);
        resolve(null);
      };
    } catch (e) {
      console.warn("AgriShield IndexedDB initialization error:", e);
      resolve(null);
    }
  });
}

/**
 * Retrieve all saved scan records from the local offline vault (sorted newest first)
 */
export async function getScansFromVault(): Promise<ScanRecord[]> {
  const db = await openVaultDb();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as ScanRecord[]) || [];
        results.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        resolve(results);
      };

      request.onerror = () => {
        console.warn("Failed to read scans from offline vault:", request.error);
        resolve([]);
      };
    } catch (e) {
      console.warn("Vault transaction read error:", e);
      resolve([]);
    }
  });
}

/**
 * Save multiple scans into the local offline vault (upsert).
 * POLICY:
 * - ALL user-owned scans are 100% protected and NEVER auto-pruned.
 * - External community scans are capped to the latest 30 items.
 */
export async function saveScansToVault(
  scans: ScanRecord[],
  currentUserId?: string,
  userScanIds?: string[]
): Promise<void> {
  const db = await openVaultDb();
  if (!db || !scans.length) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      for (const scan of scans) {
        if (scan.id) {
          store.put(scan);
        }
      }

      tx.oncomplete = async () => {
        // Enforce pruning ONLY on community scans, protecting the farmer's personal records
        try {
          const allScans = await getScansFromVault();

          let activeFarmerId = currentUserId;
          let activeMyScanIds = userScanIds;

          if (typeof window !== "undefined") {
            if (!activeFarmerId) {
              activeFarmerId = localStorage.getItem("agrishield_farmer_id") || undefined;
            }
            if (!activeMyScanIds || !activeMyScanIds.length) {
              try {
                const stored = localStorage.getItem("agrishield_my_scans");
                if (stored) activeMyScanIds = JSON.parse(stored);
              } catch {}
            }
          }

          const isUserOwned = (scan: ScanRecord) => {
            if (activeFarmerId && scan.userId && scan.userId === activeFarmerId) return true;
            if (activeMyScanIds && scan.id && activeMyScanIds.includes(scan.id)) return true;
            return false;
          };

          // Filter only community scans for the 30-item capacity limit
          const communityScans = allScans.filter((s) => !isUserOwned(s));

          if (communityScans.length > MAX_COMMUNITY_ITEMS) {
            const toRemove = communityScans.slice(MAX_COMMUNITY_ITEMS);
            const pruneDb = await openVaultDb();
            if (pruneDb) {
              const pruneTx = pruneDb.transaction(STORE_NAME, "readwrite");
              const pruneStore = pruneTx.objectStore(STORE_NAME);
              for (const item of toRemove) {
                if (item.id) pruneStore.delete(item.id);
              }
            }
          }
        } catch {}
        resolve();
      };

      tx.onerror = () => {
        console.warn("Failed to write scans to offline vault:", tx.error);
        resolve();
      };
    } catch (e) {
      console.warn("Vault transaction write error:", e);
      resolve();
    }
  });
}

/**
 * Save a single scan into the local offline vault
 */
export async function saveSingleScanToVault(
  scan: ScanRecord,
  currentUserId?: string,
  userScanIds?: string[]
): Promise<void> {
  if (!scan.id) return;
  return saveScansToVault([scan], currentUserId, userScanIds);
}

/**
 * Remove a scan from the offline vault
 */
export async function deleteScanFromVault(scanId: string): Promise<void> {
  const db = await openVaultDb();
  if (!db || !scanId) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(scanId);

      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Wipe all cached scans from IndexedDB and purge Service Worker Cache Storage on demand
 */
export async function clearOfflineVault(): Promise<boolean> {
  try {
    const db = await openVaultDb();
    if (db) {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }

    // Flush Service Worker Cache Storage (R2 cached images, static shell)
    if (typeof window !== "undefined" && "caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }

    return true;
  } catch (err) {
    console.warn("Failed to clear offline vault cache:", err);
    return false;
  }
}
