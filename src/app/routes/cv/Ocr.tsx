import { useState } from 'react';
import { ocrBlob } from '@/lib/ocr/run';
import { enhanceImageData } from '@/lib/ocr/preprocess';
import * as pdfjs from 'pdfjs-dist';
import { Toast } from '@/ui/toast';

(pdfjs as any).GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

export default function OcrPage() {
  const [text, setText] = useState('');
  const [enhance, setEnhance] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const show = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2000);
  };

  const handle = async (file: File) => {
    show('Processing...');
    setLogs([]);
    const logger = (m: any) => setLogs((l) => [...l, JSON.stringify(m)]);
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await (pdfjs as any).getDocument({ data }).promise;
        let out = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const v = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = v.width;
          canvas.height = v.height;
          const ctx = canvas.getContext('2d', { alpha: false })!;
          await page.render({ canvasContext: ctx, viewport: v }).promise;
          let blob: Blob;
          if (enhance) {
            const bmp = await createImageBitmap(canvas);
            const c = enhanceImageData(bmp);
            blob = await new Promise((r) => c.toBlob((b) => r(b!), 'image/png'));
          } else {
            blob = await new Promise((r) => canvas.toBlob((b) => r(b!), 'image/png'));
          }
          out += await ocrBlob(blob, 'eng', logger);
        }
        setText(out);
      } else {
        let bmp = await createImageBitmap(file);
        if (enhance) bmp = await createImageBitmap(enhanceImageData(bmp));
        const blob = await new Promise((r) => {
          const c = document.createElement('canvas');
          c.width = bmp.width;
          c.height = bmp.height;
          const ctx = c.getContext('2d', { alpha: false })!;
          ctx.drawImage(bmp, 0, 0);
          c.toBlob((b) => r(b!), 'image/png');
        });
        const out = await ocrBlob(blob, 'eng', logger);
        setText(out);
      }
      show('Done');
    } catch {
      show('Failed');
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handle(f);
        }}
      />
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={enhance}
          onChange={(e) => setEnhance(e.target.checked)}
        />
        Enhance scan
      </label>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="border p-2" />
      <button
        className="btn"
        onClick={() => {
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ocr.txt';
          a.click();
        }}
      >
        Download TXT
      </button>
      <div className="text-xs whitespace-pre-wrap">{logs.join('\n')}</div>
      {toast && <Toast message={toast} />}
    </div>
  );
}
