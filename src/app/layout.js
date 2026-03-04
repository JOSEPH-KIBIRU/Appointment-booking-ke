import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'LunaPay - Kenyan Appointment Booking',
  description: 'Book services and pay with M-Pesa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>  {/* Auth inside Theme - so it can use theme if needed */}
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}