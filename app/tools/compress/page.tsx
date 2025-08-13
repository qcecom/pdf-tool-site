'use client';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadArea from '../../../components/UploadArea';

export default function CompressPage() {
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const compressedBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Compress PDF</h1>
      <div>
        <label className="mr-2">Quality:</label>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
        />
        <span className="ml-2">{quality}</span>
      </div>
      <UploadArea onFiles={handleFiles} accept="application/pdf" />
      {processing && <p>Processing...</p>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="compressed.pdf"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Download
        </a>
      )}
    </div>
  );
}
