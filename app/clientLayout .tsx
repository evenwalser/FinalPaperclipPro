'use client'; // Mark this as a Client Component

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Define the routes that should exclude the layout
  const authRoutes = [
    '/login', 
    '/reset-password',
    '/update-password',
    '/accept-invite',
    // '/unauthorized'  // Make sure this is included
  ];
 // Add more routes as needed

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.includes(pathname ?? '');

  return isAuthRoute ? (
    <main>{children}</main>
  ) : (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-950 p-0">
          {children}
        </main>
      </div>
    </div>
  );
}