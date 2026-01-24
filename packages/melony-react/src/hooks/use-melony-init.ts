import { useEffect, useState } from "react";

/**
 * A hook to initialize a Melony application by fetching the initial UI state.
 * 
 * @param url The API endpoint to fetch the initial state from.
 * @param params Optional query parameters to include in the request.
 * @returns An object containing the UI data, loading state, and any error encountered.
 */
export function useMelonyInit<T = any>(
  url: string, 
  params: Record<string, string | number | boolean | undefined> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
        
        const queryString = searchParams.toString();
        const fullUrl = queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
        
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to initialize: ${response.statusText}`);
        }
        const json = await response.json();
        
        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(params)]);

  return { data, loading, error };
}
