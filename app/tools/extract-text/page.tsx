'use client';
import React, { useState } from 'react';
import UploadArea from '../../../components/UploadArea';
import ProgressBar from '../../../components/ProgressBar';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function ExtractTextPage() {
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    try {
      const bytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      let result = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const { data } = await Tesseract.recognize(canvas, 'eng');
        result += data.text + '\n';
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      setText(result);
      const blob = new Blob([result], { type: 'text/plain' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Extract Text</h1>
      <UploadArea onFiles={handleFiles} accept="application/pdf" />
      {processing && <ProgressBar value={progress} />}
      {text && (
        <textarea value={text} readOnly className="w-full h-48 border p-2" />
      )}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="extracted.txt"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Download
        </a>
      )}
    </div>
  );
}
