'use client';
import React, { useState } from 'react';
import UploadArea from '../../../components/UploadArea';
import DownloadButton from '../../../components/DownloadButton';
let pdfjs: typeof import('pdfjs-dist') | null = null;

export default function AtsExport() {
  const [text, setText] = useState('');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [message, setMessage] = useState('');

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setMessage('');
    setText('');
    if (!pdfjs) {
      pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js';
    }
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjs!.getDocument({ data: bytes }).promise;
    let result = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((it: any) => it.str).join(' ');
      result += pageText + '\n';
    }
    if (result.trim().length === 0) {
      setMessage('No text layer found. Try OCR.');
      return;
    }
    setText(result);
    const b = new Blob([result], { type: 'text/plain' });
    setBlob(b);
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ATS Export',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <h1 className="text-2xl font-bold">ATS Export</h1>
      <UploadArea onFiles={handleFiles} accept="application/pdf" />
      {message && <p className="text-red-600">{message}</p>}
      {text && (
        <>
          <textarea
            value={text}
            readOnly
            className="w-full h-48 border p-2"
          />
          <div className="space-x-2">
            <button
              onClick={copy}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Copy
            </button>
            {blob && <DownloadButton blob={blob} filename="resume.txt" />}
          </div>
        </>
      )}
    </div>
  );
}
