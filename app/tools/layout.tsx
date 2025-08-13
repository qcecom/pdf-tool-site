import Link from 'next/link';
import React from 'react';

const links = [
  { href: '/tools/merge', label: 'Merge PDFs' },
  { href: '/tools/split', label: 'Split PDF' },
  { href: '/tools/compress', label: 'Compress PDF' },
  { href: '/tools/image-to-pdf', label: 'Image to PDF' },
  { href: '/tools/extract-text', label: 'Extract Text' },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow p-4 flex gap-4 justify-center">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-blue-600 hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
}
