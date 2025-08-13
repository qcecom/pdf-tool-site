import Link from 'next/link';
import React from 'react';

const links = [
  { href: '/cv', label: 'Overview' },
  { href: '/cv/compress', label: 'Compress' },
  { href: '/cv/ats-export', label: 'ATS Export' },
  { href: '/cv/ocr', label: 'OCR' },
  { href: '/cv/jd-match', label: 'JD Match' },
];

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <nav className="w-48 bg-white border-r sticky top-0 h-screen p-4 space-y-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block text-blue-600 hover:underline">
            {l.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
