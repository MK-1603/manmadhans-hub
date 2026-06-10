import {
  cacheCategories,
  cacheTools,
  getCachedCategories,
  getCachedTools,
} from '@/lib/offlineCache';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function getToolProxyUrl(toolUrl: string): string {
  const normalized = toolUrl.startsWith('http') ? toolUrl : `https://${toolUrl}`;
  return `${API_BASE}/api/v1/tools/gateway/proxy?url=${encodeURIComponent(normalized)}`;
}

/** Stale-while-revalidate: show cache immediately, refresh in background */
export async function loadCategories(onData: (rows: any[]) => void): Promise<void> {
  const cached = await getCachedCategories();
  if (cached?.length) onData(cached as any[]);

  try {
    const res = await fetch(`${API_BASE}/api/v1/categories`);
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) {
      await cacheCategories(data);
      onData(data);
    }
  } catch {
    if (!cached?.length) onData([]);
  }
}


export async function loadAdminTools(
  onData: (tools: any[]) => void,
  token?: string | null
): Promise<void> {
  const cached = await getCachedTools();
  if (cached?.length) onData(cached as any[]);

  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('Offline');
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/api/v1/tools?all=true`, { headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return;
    const data = await res.json();
    if (data.tools) {
      await cacheTools(data.tools);
      onData(data.tools);
    }
  } catch {
    if (!cached?.length) onData([]);
  }
}

export function categoryCountFromApi(cat: { name: string; toolsCount?: number }): number {
  return Number(cat.toolsCount ?? 0);
}

export function buildCategoryCountMap(
  categories: { name: string; toolsCount?: number }[],
  totalTools?: number
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const cat of categories) {
    map[cat.name] = categoryCountFromApi(cat);
  }
  map.__all__ =
    typeof totalTools === 'number'
      ? totalTools
      : categories.reduce((sum, c) => sum + categoryCountFromApi(c), 0);
  return map;
}

export function buildPricingCounts(tools: { pricing_model?: string }[]) {
  let free = 0;
  let freemium = 0;
  let paid = 0;
  for (const t of tools) {
    const p = (t.pricing_model || 'free').toLowerCase();
    if (p === 'free') free++;
    else if (p === 'freemium') freemium++;
    else if (['paid', 'premium', 'enterprise'].includes(p)) paid++;
  }
  return {
    all: tools.length,
    free,
    freemium,
    paid,
  };
}

/** Pre-index tools by category name for explore sector/category grids */
export function buildToolsByCategory(tools: { category_name?: string }[]) {
  const map = new Map<string, typeof tools>();
  for (const t of tools) {
    const key = t.category_name || '';
    if (!key) continue;
    const list = map.get(key);
    if (list) list.push(t);
    else map.set(key, [t]);
  }
  return map;
}

