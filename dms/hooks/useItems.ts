import { useCallback, useEffect, useState } from 'react';
import { itemsApi } from '@/services/items.api';
import type { Item } from '@/types/item';

type Params = {
  parentId: number | null;
  page: number;
  limit: number;
  sort?: string;
  search: string;
};

type Result = {
  items: Item[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useItems({ parentId, page, limit, sort, search }: Params): Result {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    itemsApi.list({ parentId, page, limit, sort, search })
      .then(res => {
        if (!cancelled) setItems(res.data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load items.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [parentId, page, limit, sort, search, refreshKey]);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return { items, loading, error, refresh };
}
