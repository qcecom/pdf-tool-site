import { useState } from 'react';
import { compressPdf, CompressProfile } from '@/compress';

export default function CompressPanel() {
  const [profile, setProfile] = useState<CompressProfile>('image');
  const [dpi, setDpi] = useState(150);
  const [quality, setQuality] = useState(0.72);
  const [pngToJpeg, setPngToJpeg] = useState(true);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [result, setResult] = useState<any>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const res = await compressPdf(f, { profile, dpi, quality, pngToJpeg, stripMetadata });
    setResult(res);
  };

  const percent = result ? Math.round((1 - result.afterBytes / result.beforeBytes) * 100) : 0;

  return (
    <div>
      <div>
        {(['lossless','image','smallest'] as CompressProfile[]).map(p => (
          <label key={p} style={{ marginRight: 8 }}>
            <input type="radio" name="prof" checked={profile===p} onChange={()=>setProfile(p)} /> {p === 'image' ? 'Image-aware (recommended)' : p === 'smallest' ? 'Smallest (image-only)' : 'Lossless'}
          </label>
        ))}
      </div>
      <details style={{marginTop:8}}>
        <summary>Advanced options</summary>
        <div style={{marginTop:8}}>
          <label>DPI {dpi}
            <input type="range" min={120} max={200} value={dpi} onChange={e=>setDpi(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>JPEG quality {quality.toFixed(2)}
            <input type="range" min={0.6} max={0.85} step={0.01} value={quality} onChange={e=>setQuality(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={pngToJpeg} onChange={e=>setPngToJpeg(e.target.checked)} /> Convert PNG to JPEG
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={stripMetadata} onChange={e=>setStripMetadata(e.target.checked)} /> Strip metadata
          </label>
        </div>
      </details>
      <div style={{marginTop:8}}>
        <input type="file" accept="application/pdf" onChange={onFile} />
      </div>
      {result && (
        <div style={{marginTop:8}}>
          <div>Before: {(result.beforeBytes/1024).toFixed(1)} kB After: {(result.afterBytes/1024).toFixed(1)} kB ({percent}% change)</div>
          {result.noGain || percent < 5 ? <div>Already optimized / No meaningful reduction</div> : null}
        </div>
      )}
    </div>
  );
}
