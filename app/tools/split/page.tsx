'use client';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadArea from '../../../components/UploadArea';
import ProgressBar from '../../../components/ProgressBar';

export default function SplitPage() {
  const [range, setRange] = useState('1-1');
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    try {
      const [startStr, endStr] = range.split('-');
      const start = parseInt(startStr, 10) - 1;
      const end = parseInt(endStr, 10) - 1;
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();
      const indices = pdf.getPageIndices().slice(start, end + 1);
      const copied = await newPdf.copyPages(pdf, indices);
      for (let i = 0; i < copied.length; i++) {
        newPdf.addPage(copied[i]);
        setProgress(Math.round(((i + 1) / copied.length) * 100));
      }
      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Split PDF</h1>
      <div>
        <label className="mr-2">Page Range (e.g., 1-3):</label>
        <input
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border p-1"
        />
      </div>
      <UploadArea onFiles={handleFiles} accept="application/pdf" />
      {processing && <ProgressBar value={progress} />}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="split.pdf"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Download
        </a>
      )}
    </div>
  );
}
