import { useState } from 'react';
import Dropzone from '@/app/components/Dropzone';
import { compressWithFallback } from '@/lib/pdf/compress';
import type { CompressProfile } from '@/lib/pdf/compress-smart';
import { prettyBytes } from '@/lib/pdf/bytes';
import { Toast } from '@/ui/toast';

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<CompressProfile>('medium');
  const [lossy, setLossy] = useState(false);
  const [result, setResult] = useState<{
    origSize: number;
    newSize: number;
    mode: 'smart' | 'raster';
  } | null>(null);
  const [outBytes, setOutBytes] = useState<Uint8Array | null>(null);
  const [working, setWorking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const show = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2000);
  };

  const run = async () => {
    if (!file) return;
    setWorking(true);
    show('Processing...');
    try {
      const res = await compressWithFallback(file, profile, lossy);
      setResult({ origSize: res.origSize, newSize: res.newSize, mode: res.mode });
      setOutBytes(res.bytes);
      show('Done');
    } catch {
      show('Failed');
    } finally {
      setWorking(false);
    }
  };

  const download = () => {
    if (!outBytes || !file) return;
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '') + '-compressed.pdf';
    a.click();
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {!file && <Dropzone onFile={setFile} />}
      {file && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <label>
              Quality:
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value as CompressProfile)}
                className="ml-2 border p-1"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="maximum">Maximum</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={lossy}
                onChange={(e) => setLossy(e.target.checked)}
              />
              Lossy Mode
            </label>
          </div>
          <button className="btn" onClick={run} disabled={working}>
            {working ? 'Working...' : 'Compress'}
          </button>
          {result && (
            <div className="mt-2">
              Original: {prettyBytes(result.origSize)} {'->'} New: {prettyBytes(result.newSize)} (
              -{((1 - result.newSize / result.origSize) * 100).toFixed(1)}%) [Mode: {result.mode}]
            </div>
          )}
          {outBytes && (
            <button className="btn" onClick={download}>
              Download
            </button>
          )}
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
