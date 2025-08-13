'use client';
import React, { useState, useRef } from 'react';
import UploadArea from '../../../components/UploadArea';
import ProgressBar from '../../../components/ProgressBar';
import DownloadButton from '../../../components/DownloadButton';
import { PDFDocument } from 'pdf-lib';

export const metadata = {
  title: 'Compress Resume PDF',
  description: 'Compress your CV under 2MB in the browser. No uploads.',
};

export default function CvCompress() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [target, setTarget] = useState(2);

  const workerRef = useRef<Worker>();

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setBlob(null);
    try {
      const bytes = await file.arrayBuffer();
      workerRef.current = new Worker(
        new URL('../../../workers/compress.worker.ts', import.meta.url)
      );
      workerRef.current.postMessage({ pdfBytes: bytes, quality });
      workerRef.current.onmessage = async (e) => {
        if (e.data.progress) {
          setProgress(e.data.progress);
        }
        if (e.data.images) {
          const out = await PDFDocument.create();
          for (const imgBytes of e.data.images as Uint8Array[]) {
            const jpg = await out.embedJpg(imgBytes);
            const page = out.addPage([jpg.width, jpg.height]);
            page.drawImage(jpg, {
              x: 0,
              y: 0,
              width: jpg.width,
              height: jpg.height,
            });
          }
          const outBytes = await out.save();
          const outBlob = new Blob([outBytes], { type: 'application/pdf' });
          setBlob(outBlob);
          const sizeMb = outBlob.size / (1024 * 1024);
          if (sizeMb > target) {
            console.warn('Target size not met');
          }
          workerRef.current?.terminate();
          setProcessing(false);
        }
      };
    } catch (e) {
      console.error(e);
      setProcessing(false);
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
            name: 'Compress Resume PDF',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <h1 className="text-2xl font-bold">Compress Resume</h1>
      <div className="flex gap-4 items-center">
        <label>
          Target:
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="ml-2 border p-1"
          >
            <option value={2}>{'<'}2MB</option>
            <option value={1}>{'<'}1MB</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Quality
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
        </label>
      </div>
      <UploadArea onFiles={handleFiles} accept="application/pdf" />
      {processing && <ProgressBar value={progress} />}
      {blob && <DownloadButton blob={blob} filename="compressed.pdf" />}
    </div>
  );
}
