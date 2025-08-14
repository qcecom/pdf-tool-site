'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tools/merge', label: 'All Tools' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/support', label: 'Support' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [secure, setSecure] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.isSecureContext) {
      setSecure(true);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
          <img src="/logo.svg" alt="NoUploadPDF logo" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex space-x-6" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {secure && (
            <span className="hidden md:flex items-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5V11z"
                />
              </svg>
              HTTPS Secured
            </span>
          )}
          <Link
            href="/tools/merge"
            className="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload File
          </Link>
          <button
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 bg-white ${menuOpen ? 'max-h-96 shadow-md' : 'max-h-0'}`}
      >
        <nav className="flex flex-col px-4 pb-4 space-y-2" aria-label="Mobile Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tools/merge"
            className="mt-2 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload File
          </Link>
          {secure && (
            <span className="mt-2 flex items-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5V11z"
                />
              </svg>
              HTTPS Secured
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}

