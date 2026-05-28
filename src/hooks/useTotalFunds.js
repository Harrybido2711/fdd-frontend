import { useEffect, useState } from 'react';
import { fetchTotalFunds } from '@/api/statsApi';

export function useTotalFunds() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const value = await fetchTotalFunds();
        if (mounted) setTotal(value);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { total, loading, error };
}