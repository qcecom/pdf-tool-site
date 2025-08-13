import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-8 text-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">PDF Tools</h1>
        <p className="mb-4">Client-side utilities for your documents.</p>
        <Link
          href="/tools/merge"
          className="px-6 py-3 bg-blue-600 text-white rounded text-lg"
        >
          Generic PDF Tools
        </Link>
      </div>
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-2">ATS-ready CV Toolkit</h2>
        <p className="mb-4">Make your PDF resume ATS-friendly in minutes — private and free.</p>
        <Link
          href="/cv"
          className="px-6 py-3 bg-green-600 text-white rounded text-lg"
        >
          Explore CV Tools
        </Link>
      </div>
    </main>
  );
}
