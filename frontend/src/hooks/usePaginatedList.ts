
import { useState, useEffect, useCallback } from 'react';

type Fetcher<T> = (params: { cursor?: string; limit: number; [key: string]: any }) => Promise<{
  items: T[];
  nextCursor: string | null;
}>;

export function usePaginatedList<T>(fetcher: Fetcher<T>, filters: Record<string, any> = {}, defaultLimit = 20) {
  const [items, setItems] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Reset and load first page when filters change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setItems([]);
    setNextCursor(null);
    setError(null);

    fetcher({ limit: defaultLimit, ...filters })
      .then((data) => {
        if (mounted) {
            // Check if data has expected structure, otherwise fallback safely
            const list = data?.items || (Array.isArray(data) ? data : []);
            const cursor = data?.nextCursor || null;
            
            setItems(list);
            setNextCursor(cursor);
            setInitialized(true);
        }
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [JSON.stringify(filters)]); // Deep compare filters to trigger reset

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;

    setLoading(true);
    try {
      const data = await fetcher({ cursor: nextCursor, limit: defaultLimit, ...filters });
      const newItems = data?.items || [];
      const newCursor = data?.nextCursor || null;

      setItems((prev) => [...prev, ...newItems]);
      setNextCursor(newCursor);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, filters, fetcher, defaultLimit]);

  return {
    items,
    nextCursor,
    loading,
    error,
    loadMore,
    initialized
  };
}
