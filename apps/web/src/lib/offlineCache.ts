/**
 * offlineCache.ts
 * IndexedDB-backed offline data store for tools, categories, and auth.
 * Falls back to localStorage if IndexedDB is unavailable.
 */

const DB_NAME = 'manmadhans-hub-offline';
const DB_VERSION = 1;

const STORES = {
  tools: 'tools',
  categories: 'categories',
  auth: 'auth',
} as const;

// ── Open DB ───────────────────────────────────────────────
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      });
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ── Generic get/set ───────────────────────────────────────
async function idbSet(store: string, key: string, value: unknown): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put({ key, value, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      localStorage.setItem(`idb_fallback_${store}_${key}`, JSON.stringify({ value, updatedAt: Date.now() }));
    } catch { /* storage full */ }
  }
}

async function idbGet<T>(store: string, key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result ? (req.result.value as T) : null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(`idb_fallback_${store}_${key}`);
      if (raw) return JSON.parse(raw).value as T;
    } catch { /* parse error */ }
    return null;
  }
}

// ── Tools ─────────────────────────────────────────────────
export async function cacheTools(tools: unknown[]): Promise<void> {
  await idbSet(STORES.tools, 'all', tools);
}

export async function getCachedTools(): Promise<unknown[] | null> {
  return idbGet<unknown[]>(STORES.tools, 'all');
}

// ── Categories ────────────────────────────────────────────
export async function cacheCategories(categories: unknown[]): Promise<void> {
  await idbSet(STORES.categories, 'all', categories);
}

export async function getCachedCategories(): Promise<unknown[] | null> {
  return idbGet<unknown[]>(STORES.categories, 'all');
}

// ── Auth (offline login) ──────────────────────────────────
export interface OfflineAuthRecord {
  email: string;
  /** SHA-256 hash of the passkey — never store plaintext */
  passkeyHash: string;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    mustChangePassword: boolean;
  };
  cachedAt: number;
}

export async function cacheAuthRecord(record: OfflineAuthRecord): Promise<void> {
  await idbSet(STORES.auth, record.email.toLowerCase(), record);
}

export async function getOfflineAuthRecord(email: string): Promise<OfflineAuthRecord | null> {
  return idbGet<OfflineAuthRecord>(STORES.auth, email.toLowerCase());
}

/** SHA-256 hash a string using Web Crypto API */
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Network status helpers ────────────────────────────────
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function onNetworkChange(callback: (online: boolean) => void): () => void {
  const onOnline = () => callback(true);
  const onOffline = () => callback(false);
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
