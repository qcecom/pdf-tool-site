import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 mt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-sm text-gray-400">
              NoUploadPDF is a secure online tool for converting and processing files without storing them on our servers.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools/merge" className="hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <p className="text-sm">
              <a
                href="mailto:support@nouploadpdf.com"
                className="hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                support@nouploadpdf.com
              </a>
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          All files are processed securely and deleted automatically after completion.
        </p>
        <div className="border-t border-gray-700 pt-4 text-sm text-gray-400 text-center">
          © {year} NoUploadPDF — All rights reserved.
        </div>
      </div>
    </footer>
  );
}

