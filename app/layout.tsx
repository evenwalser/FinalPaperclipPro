
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from './contexts/CartContext';
import AuthProviders from './providers/authProviders';
import ClientLayout from './clientLayout '; // Import the ClientLayout
const inter = Inter({ subsets: ['latin'] });
import { Toaster } from '@/components/ui/toast'
import { RoleProvider } from './contexts/RoleContext';
import { UserProvider } from './contexts/UserContext';

export const metadata = {
  title: 'Paperclip Consign MVP',
  description: 'Digital inventory management for consignment stores',
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"/>
        <AuthProviders session={session}>
        <UserProvider>
        <RoleProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <CartProvider>
              <ClientLayout>{children}<Toaster /></ClientLayout>
            </CartProvider>
          </ThemeProvider>
          </RoleProvider>
          </UserProvider>
        </AuthProviders>
      </body>
    </html>
  );
}