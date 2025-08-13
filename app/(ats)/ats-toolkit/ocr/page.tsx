'use client';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider, useToast } from '@/components/toast/ToastProvider';
import DropZone from '@/components/DropZone';
import Seo from '@/components/Seo';
import { track } from '@/lib/analytics';
import { createSampleScanJPG } from '@/lib/samples';
import { useState } from 'react';

function Inner() {
  const toast = useToast();
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);

  const handle = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    track('file_dropped', { tool: 'ocr' });
    if (file.type === 'application/pdf') {
      try {
        const pdfjs = await import('pdfjs-dist');
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        let full = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const canvas = document.createElement('canvas');
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext('2d') as any, viewport }).promise;
          const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b || new Blob()), 'image/jpeg'));
          const textChunk = await runOCR(blob);
          full += textChunk.text + '\n';
        }
        setText(full);
        setConfidence(null);
      } catch {
        toast({ message: 'PDF OCR unavailable', type: 'error' });
      }
    } else {
      const res = await runOCR(file);
      setText(res.text);
      setConfidence(res.meanConfidence || null);
    }
    track('task_completed', { tool: 'ocr' });
  };

  async function runOCR(blob: Blob): Promise<{ text: string; meanConfidence?: number }> {
    return await new Promise((resolve) => {
      const worker = new Worker(new URL('../../../../src/workers/ocr.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        const data = e.data;
        if (data.text) resolve({ text: data.text, meanConfidence: data.meanConfidence });
        if (data.error) {
          toast({ message: data.error, type: 'error' });
          resolve({ text: data.error });
        }
      };
      worker.postMessage({ blob });
    });
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast({ message: 'Copied', type: 'success' });
  };

  const trySample = async () => {
    const jpg = await createSampleScanJPG();
    handle([new File([jpg], 'scan.jpg', { type: 'image/jpeg' })]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Seo title="OCR" description="Image to text" />
      <h2 className="text-xl font-semibold mb-4">OCR</h2>
      <DropZone accept=".pdf,.png,.jpg,.jpeg" onFiles={handle} />
      <button className="mt-4 text-blue-600 underline" onClick={trySample}>
        Try sample
      </button>
      {text && (
        <div className="mt-4">
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-96 overflow-auto">{text}</pre>
          {confidence !== null && <p className="text-sm">Confidence: {confidence?.toFixed(1)}</p>}
          <button onClick={copy} className="text-blue-600 underline mt-2">
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

export default function OCRPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
