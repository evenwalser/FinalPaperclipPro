import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getUser } from '@/lib/services/items';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        console.log('User at auth check:', user);
        
        if (!user) {
          router.push('/login');
          return;
        }

        if (!allowedRoles.includes(user.role)) {
          console.log('User role:', user.role);
          console.log('Allowed roles:', allowedRoles);
          router.push('/unauthorized');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return isAuthorized ? children : null;
} 