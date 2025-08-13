import Link from 'next/link';

/**
 * Simple navigation bar shown on all pages.
 */
export default function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/merge">Merge</Link>
        </li>
      </ul>
    </nav>
  );
}
