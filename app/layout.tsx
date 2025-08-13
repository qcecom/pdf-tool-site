import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'PDF Tool Site',
  description: 'Client-side PDF utilities'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
