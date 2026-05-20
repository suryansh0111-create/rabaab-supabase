import { useState, useEffect } from 'react';
import { dbService } from '../lib/supabase';

export function useSiteContent(section: string, initialData: any) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dbService.subscribeSiteContent(section, initialData, (updatedData) => {
      setData(updatedData);
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  return { data, loading };
}

export function useCollectionContent(collectionName: string, initialData: any[], sortField: string = 'order') {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dbService.subscribeCollection(collectionName, (updatedData) => {
      // Sorting is done in retrieval, but keep double assurance
      const sorted = [...updatedData].sort((a: any, b: any) => (a[sortField] ?? 0) - (b[sortField] ?? 0));
      setData(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, sortField]);

  return { data, loading };
}
