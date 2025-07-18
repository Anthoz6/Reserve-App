'use client';
import { useAuth } from '@/hooks/useAuth';
import { RoleEnum } from '@/types/role';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import dynamic from 'next/dynamic';

// Implementamos lazy loading con Next.js dynamic imports
const CustomerHome = dynamic(() => import('@/components/home/CustomerHome'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

const ProviderHome = dynamic(() => import('@/components/home/ProviderHome'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

const AdminHome = dynamic(() => import('@/components/home/AdminHome'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isAuthenticated && user ? (
        (() => {
          const userRole = user.role.role.toUpperCase();

          if (userRole === RoleEnum.ADMIN) {
            return <AdminHome user={user} />;
          }

          if (userRole === RoleEnum.PROVIDER) {
            return <ProviderHome user={user} />;
          }

          return <CustomerHome user={user} />;
        })()
      ) : (
        <CustomerHome user={null} isGuest={true} />
      )}
    </Suspense>
  );
}
