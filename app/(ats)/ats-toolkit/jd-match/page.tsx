'use client';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider, useToast } from '@/components/toast/ToastProvider';
import DropZone from '@/components/DropZone';
import Seo from '@/components/Seo';
import { extractATSSafeText } from '@/lib/ats/export';
import { scoreResumeVsJD } from '@/lib/match/score';
import { track } from '@/lib/analytics';
import { createSampleJDText, createSampleResumePDF } from '@/lib/samples';
import { useState } from 'react';

function Inner() {
  const toast = useToast();
  const [jd, setJd] = useState(createSampleJDText());
  const [resume, setResume] = useState('');
  const [report, setReport] = useState<any>(null);

  const handleResume = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    track('file_dropped', { tool: 'jd-match' });
    const txt = await extractATSSafeText(file);
    setResume(txt);
  };

  const fetchJD = async (url: string) => {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const main = doc.querySelector('main') || doc.body;
      setJd(main?.textContent || '');
    } catch {
      toast({ message: 'Fetch failed', type: 'error' });
    }
  };

  const score = () => {
    track('jd_match_started');
    const r = scoreResumeVsJD(resume, jd);
    setReport(r);
    track('jd_match_scored', { score: r.score0to100 });
  };

  const exportResume = async () => {
    await navigator.clipboard.writeText(resume);
    toast({ message: 'Resume text copied', type: 'success' });
  };

  const downloadMinimalPDF = async () => {
    try {
      const { PDFDocument, StandardFonts } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const page = doc.addPage();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const size = 12;
      const lines = resume.split('\n');
      lines.forEach((line, i) => page.drawText(line, { x: 40, y: page.getHeight() - 40 - i * (size + 4), size, font }));
      const bytes = await doc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ message: 'Install pdf-lib to enable PDF export', type: 'info' });
    }
  };

  const trySampleResume = async () => {
    const blob = await createSampleResumePDF();
    handleResume([new File([blob], 'sample.pdf', { type: 'application/pdf' })]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Seo title="JD Match" description="Score resume vs JD" />
      <h2 className="text-xl font-semibold mb-4">JD Match</h2>
      <textarea
        className="w-full border p-2 rounded mb-2" rows={6}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        aria-label="Job description"
      />
      <div className="flex mb-4 gap-2">
        <input
          type="url"
          placeholder="JD URL"
          className="flex-1 border p-2 rounded"
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchJD((e.target as HTMLInputElement).value);
          }}
          aria-label="JD URL"
        />
        <button className="border px-3 rounded" onClick={() => {
          const input = (document.querySelector('input[type=url]') as HTMLInputElement);
          fetchJD(input.value);
        }}>Fetch JD</button>
      </div>
      <DropZone accept=".pdf,.docx,.txt,.md" onFiles={handleResume} />
      <button className="mt-2 text-blue-600 underline" onClick={trySampleResume}>Try sample</button>
      {resume && (
        <div className="mt-4">
          <button className="border px-3 py-1 rounded" onClick={score}>
            Score
          </button>
        </div>
      )}
      {report && (
        <div className="mt-4">
          <svg width="200" height="100" viewBox="0 0 200 100">
            <path d="M10 100 A90 90 0 0 1 190 100" stroke="#eee" strokeWidth="20" fill="none" />
            <path d={`M10 100 A90 90 0 0 1 ${10 + 180 * (report.score0to100/100)} 100`} stroke="#4ade80" strokeWidth="20" fill="none" />
            <text x="100" y="90" textAnchor="middle" fontSize="20">{report.score0to100}</text>
          </svg>
          <div className="flex gap-8">
            <div>
              <h4 className="font-semibold">Must-have missing</h4>
              <ul className="list-disc pl-5">
                {report.mustHaveMissing.map((m: string) => <li key={m}>{m}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Nice-to-have missing</h4>
              <ul className="list-disc pl-5">
                {report.niceToHaveMissing.map((m: string) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Bullet suggestions</h4>
            <ul className="list-disc pl-5">
              {report.bulletSuggestions.map((b: string, i: number) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <div className="mt-4 space-x-4">
            <button onClick={exportResume} className="text-blue-600 underline">
              Export ATS Text
            </button>
            <button onClick={downloadMinimalPDF} className="text-blue-600 underline">
              Download Minimal PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JDMatchPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
