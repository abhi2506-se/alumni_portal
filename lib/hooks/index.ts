// lib/hooks/index.ts
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// ── Generic fetcher hook ──────────────────────────────────────────────────────
export function useFetch<T>(url: string | null, options?: RequestInit) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message ?? 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ── Jobs hook ─────────────────────────────────────────────────────────────────
export function useJobs(filters?: { type?: string; location?: string; q?: string }) {
  const params = new URLSearchParams();
  if (filters?.type)     params.set('type', filters.type);
  if (filters?.location) params.set('location', filters.location);
  if (filters?.q)        params.set('q', filters.q);
  const url = `/api/jobs?${params.toString()}`;
  return useFetch<{ data: any[]; total: number }>(url);
}

// ── Events hook ───────────────────────────────────────────────────────────────
export function useEvents(status?: string) {
  const url = status ? `/api/events?status=${status}` : '/api/events';
  return useFetch<{ data: any[]; total: number }>(url);
}

// ── Notifications hook ────────────────────────────────────────────────────────
export function useNotifications() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    const fetchCount = async () => {
      try {
        const res  = await fetch('/api/notifications?unread=true');
        if (!res.ok) return;
        const data = await res.json();
        setCount(data.unreadCount ?? 0);
      } catch { /* non-critical */ }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [session]);

  return { unreadCount: count, setUnreadCount: setCount };
}

// ── Profile hook ──────────────────────────────────────────────────────────────
export function useProfile() {
  return useFetch<any>('/api/users/profile');
}

// ── Mentorship sessions hook ──────────────────────────────────────────────────
export function useMentorships() {
  return useFetch<any[]>('/api/mentorship');
}

// ── Connections hook ──────────────────────────────────────────────────────────
export function useConnections(status?: 'ACCEPTED' | 'PENDING') {
  const url = `/api/users/connections${status ? `?status=${status}` : ''}`;
  return useFetch<any[]>(url);
}

// ── Debounce hook ─────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ── Local storage hook ────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  function setValue(value: T) {
    try {
      setStored(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch { /* ignore */ }
  }

  return [stored, setValue];
}

// ── Media query hook ──────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}
