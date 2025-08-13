'use client';
import React, { useState } from 'react';
import UploadArea from '../../../components/UploadArea';
import ProgressBar from '../../../components/ProgressBar';
import DownloadButton from '../../../components/DownloadButton';
let TesseractPromise: typeof import('tesseract.js') | null = null;
let pdfjs: typeof import('pdfjs-dist') | null = null;

export default function OcrPage() {
  const [text, setText] = useState('');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  let canceled = false;

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setText('');
    setBlob(null);
    setMessage('');
    try {
      if (!TesseractPromise) {
        TesseractPromise = await import('tesseract.js');
      }
      if (file.type === 'application/pdf') {
        if (!pdfjs) {
          pdfjs = await import('pdfjs-dist');
          pdfjs.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js';
        }
        const bytes = await file.arrayBuffer();
        const pdf = await pdfjs!.getDocument({ data: bytes }).promise;
        let res = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          if (canceled) break;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const { data } = await TesseractPromise.recognize(canvas, 'eng+vie', {
            logger: (m: any) => setProgress(Math.round(m.progress * 100)),
          });
          res += data.text + '\n';
        }
        setText(res);
        const b = new Blob([res], { type: 'text/plain' });
        setBlob(b);
      } else {
        const { data } = await TesseractPromise.recognize(file, 'eng+vie', {
          logger: (m: any) => setProgress(Math.round(m.progress * 100)),
        });
        setText(data.text);
        const b = new Blob([data.text], { type: 'text/plain' });
        setBlob(b);
      }
    } catch (e) {
      console.error(e);
      setMessage('OCR failed');
    } finally {
      setProcessing(false);
    }
  };

  const copy = () => navigator.clipboard.writeText(text);

  const cancel = () => {
    canceled = true;
  };

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'OCR Resume',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <h1 className="text-2xl font-bold">OCR</h1>
      <UploadArea onFiles={handleFiles} accept="application/pdf,image/*" />
      {processing && <ProgressBar value={progress} />}
      {text && (
        <>
          <textarea value={text} readOnly className="w-full h-48 border p-2" />
          <div className="space-x-2">
            <button onClick={copy} className="px-4 py-2 bg-blue-600 text-white rounded">
              Copy
            </button>
            {blob && <DownloadButton blob={blob} filename="ocr.txt" />}
            <button onClick={cancel} className="px-4 py-2 bg-red-600 text-white rounded">
              Cancel
            </button>
          </div>
        </>
      )}
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}
