'use client';
import React, { useState } from 'react';

export default function JdMatchPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    missingKeywords: string[];
    improvedBullets: string[];
  }>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/ai/jd-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription: jobText }),
      });
      if (!res.ok) {
        throw new Error('Request failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JD Match',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <h1 className="text-2xl font-bold">JD Match</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          placeholder="Resume Text"
          className="w-full h-48 border p-2"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <textarea
          placeholder="Job Description"
          className="w-full h-48 border p-2"
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        />
      </div>
      <button
        onClick={analyze}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p className="font-semibold">Score: {result.score}</p>
          <div>
            Missing Keywords:
            <div className="flex flex-wrap gap-2 mt-1">
              {result.missingKeywords.map((k) => (
                <span key={k} className="px-2 py-1 bg-gray-200 rounded">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div>
            Improved Bullets:
            <ul className="list-disc pl-5">
              {result.improvedBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
