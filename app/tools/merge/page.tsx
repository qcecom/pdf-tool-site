'use client';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadArea from '../../../components/UploadArea';

export default function MergePage() {
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of Array.from(files)) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copied.forEach((p) => mergedPdf.addPage(p));
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Merge PDFs</h1>
      <UploadArea onFiles={handleFiles} accept="application/pdf" multiple />
      {processing && <p>Processing...</p>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="merged.pdf"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Download
        </a>
      )}
    </div>
  );
}
