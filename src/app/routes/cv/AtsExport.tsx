import { useState } from 'react';
import Dropzone from '@/app/components/Dropzone';
import { extractTextOrdered, cleanAtsText } from '@/lib/pdf/extract-text';
import { Toast } from '@/ui/toast';

export default function AtsExportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const show = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2000);
  };

  const handleFile = async (f: File) => {
    setFile(f);
    show('Processing...');
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const raw = await extractTextOrdered(bytes);
      setText(cleanAtsText(raw));
      show('Done');
    } catch {
      show('Failed');
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {!file && <Dropzone onFile={handleFile} />}
      {file && (
        <div className="flex flex-col gap-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} className="border p-2" />
          <div className="flex gap-2">
            <button
              className="btn"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              Copy
            </button>
            <button
              className="btn"
              onClick={() => {
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace(/\.pdf$/i, '') + '.txt';
                a.click();
              }}
            >
              Download TXT
            </button>
          </div>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
