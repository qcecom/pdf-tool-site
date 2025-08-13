'use client';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider, useToast } from '@/components/toast/ToastProvider';
import DropZone from '@/components/DropZone';
import Seo from '@/components/Seo';
import { useQuota } from '@/lib/quota';
import { track } from '@/lib/analytics';
import { createSampleResumePDF, blobUrl } from '@/lib/samples';
import { useState, useEffect } from 'react';

function Inner() {
  const toast = useToast();
  const quota = useQuota();
  const [result, setResult] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(0);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const handle = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!quota.allowed(file.size)) {
      toast({ message: 'Quota exceeded', type: 'error' });
      return;
    }
    quota.consume(file.size);
    track('file_dropped', { tool: 'compress' });
    const worker = new Worker(new URL('../../../../src/workers/compress.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const data = e.data;
      if (data.progress) setProgress(data.progress);
      if (data.bytes) {
        const blob = new Blob([data.bytes], { type: 'application/pdf' });
        setResult(blob);
        setBefore(data.beforeSize);
        setAfter(data.afterSize);
        const u = blobUrl(blob);
        setUrl(u);
        track('task_completed', { tool: 'compress' });
        toast({ message: `Compressed ${(data.beforeSize/1024).toFixed(1)}KB → ${(data.afterSize/1024).toFixed(1)}KB`, type: 'success' });
      }
      if (data.error) toast({ message: data.error, type: 'error' });
    };
    worker.postMessage({ pdfBytes: await file.arrayBuffer() });
  };

  const trySample = async () => {
    const blob = await createSampleResumePDF();
    handle([new File([blob], 'sample.pdf', { type: 'application/pdf' })]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Seo title="Compress" description="Shrink PDF size" />
      <h2 className="text-xl font-semibold mb-4">Compress PDF</h2>
      <DropZone accept="application/pdf" onFiles={handle} />
      <button className="mt-4 text-blue-600 underline" onClick={trySample}>
        Try sample
      </button>
      {progress > 0 && progress < 1 && <p className="mt-2">Progress: {(progress*100).toFixed(0)}%</p>}
      {result && url && (
        <div className="mt-4">
          <p>Before: {(before/1024).toFixed(1)}KB After: {(after/1024).toFixed(1)}KB</p>
          <a href={url} download="compressed.pdf" className="text-blue-600 underline">
            Download
          </a>
          {after > 5 * 1024 * 1024 && <p className="text-sm">Try OCR</p>}
        </div>
      )}
    </div>
  );
}

export default function CompressPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
