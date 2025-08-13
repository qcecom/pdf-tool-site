'use client';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadArea from '../../../components/UploadArea';

export default function ImageToPdfPage() {
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of Array.from(files)) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(bytes);
        } else {
          image = await pdfDoc.embedJpg(bytes);
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Image to PDF</h1>
      <UploadArea onFiles={handleFiles} accept="image/png,image/jpeg" multiple />
      {processing && <p>Processing...</p>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="images.pdf"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Download
        </a>
      )}
    </div>
  );
}
