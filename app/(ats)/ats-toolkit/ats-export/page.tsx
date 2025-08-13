'use client';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider, useToast } from '@/components/toast/ToastProvider';
import DropZone from '@/components/DropZone';
import Seo from '@/components/Seo';
import { extractATSSafeText } from '@/lib/ats/export';
import { createSampleResumePDF, blobUrl } from '@/lib/samples';
import { useState, useEffect } from 'react';
import { track } from '@/lib/analytics';

function Inner() {
  const toast = useToast();
  const [text, setText] = useState('');
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const handle = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    track('file_dropped', { tool: 'ats-export' });
    const t = await extractATSSafeText(file);
    setText(t);
    const blob = new Blob([t], { type: 'text/plain' });
    const u = blobUrl(blob);
    setUrl(u);
    track('task_completed', { tool: 'ats-export' });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast({ message: 'Copied', type: 'success' });
  };

  const trySample = async () => {
    const pdf = await createSampleResumePDF();
    handle([new File([pdf], 'sample.pdf', { type: 'application/pdf' })]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Seo title="ATS Export" description="Extract text" />
      <h2 className="text-xl font-semibold mb-4">ATS Export</h2>
      <DropZone accept=".pdf,.docx,.txt,.md" onFiles={handle} onText={(t) => setText(t)} />
      <button className="mt-4 text-blue-600 underline" onClick={trySample}>
        Try sample
      </button>
      {text && (
        <div className="mt-4">
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-96 overflow-auto">{text}</pre>
          <div className="mt-2 space-x-4">
            <button onClick={copy} className="text-blue-600 underline">
              Copy
            </button>
            {url && (
              <a href={url} download="export.txt" className="text-blue-600 underline">
                Download .txt
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ATSExportPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
