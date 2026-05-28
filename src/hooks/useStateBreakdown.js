import { useEffect, useState } from 'react';
import { fetchStateDollars } from '@/api/statsApi';

export function useStateBreakdown() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchStateDollars().then(setData).catch(console.error);
  }, []);

  return { data };
}