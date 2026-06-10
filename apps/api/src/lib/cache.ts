export class MicroCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key: string, data: any, ttlMs: number = 1000) {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs });
  }

  clear() {
    this.cache.clear();
  }
}

export const globalCache = new MicroCache();
