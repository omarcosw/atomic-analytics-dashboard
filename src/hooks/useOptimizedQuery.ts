import { useState, useEffect, useCallback, useRef } from "react";
import { cacheManager } from "@/utils/cacheManager";

type QueryOptions = {
  cacheKey: string;
  cacheTTL?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
};

export function useOptimizedQuery<T>(
  queryFn: () => Promise<T>,
  options: QueryOptions
) {
  const { cacheKey, cacheTTL = 5 * 60 * 1000, enabled = true, refetchOnMount = true } = options;
  
  const [data, setData] = useState<T | null>(() => {
    return cacheManager.get<T>(cacheKey) || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Se já tem cache válido e não é forçado, não buscar
    if (!force && cacheManager.has(cacheKey)) {
      const cached = cacheManager.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      
      if (isMounted.current) {
        setData(result);
        cacheManager.set(cacheKey, result, cacheTTL);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err as Error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        hasFetched.current = true;
      }
    }
  }, [queryFn, cacheKey, cacheTTL, enabled]);

  useEffect(() => {
    isMounted.current = true;

    if (enabled && (!hasFetched.current || refetchOnMount)) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchData, enabled, refetchOnMount]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cacheManager.invalidate(cacheKey);
  }, [cacheKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
    isCached: cacheManager.has(cacheKey),
  };
}
