import { useState, useEffect } from 'react';
import { getUser } from '@/lib/services/items';

export function useRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await getUser();
        setRole(user?.role || null);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, isLoading };
} 