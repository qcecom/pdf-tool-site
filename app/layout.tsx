import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'PDF Tool Site',
  description: 'Client-side PDF utilities'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js');}",
          }}
        />
      </body>
    </html>
  );
}
