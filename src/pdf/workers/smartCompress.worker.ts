import { classifyDoc } from '../utils/classifyDoc';
import { supportsWebP } from '../utils/detectWebP';
import { iterateForTarget, BuildCfg } from '../utils/iterateForTarget';
import { rasterAll } from '../pipelines/rasterAll';
import { searchableImage } from '../pipelines/searchableImage';
import { losslessClean } from '../pipelines/losslessClean';

type Preset = 'smart'|'ats_safe'|'email_2mb'|'smallest';
type Msg = { file: File; preset: Preset; opts?: any };

self.onmessage = async (e: MessageEvent<Msg>) => {
  try {
    const { file, preset, opts } = e.data;
    const ab = await file.arrayBuffer();
    const webp = await supportsWebP();
    const kind = (await classifyDoc(ab)).kind; // SCAN | TEXT_HEAVY | IMAGE_HEAVY

    const def: BuildCfg = { dpi: kind==='TEXT_HEAVY'?180:150, quality: 0.75, format: webp?'webp':'jpeg' };
    const targetMB = preset==='email_2mb' ? 2 : (opts?.maxSizeMB ?? null);

    const buildOnce = async (cfg: BuildCfg) => {
      if (preset==='ats_safe' && kind==='TEXT_HEAVY') return await losslessClean(ab);
      if (preset==='ats_safe' && kind!=='TEXT_HEAVY') return await searchableImage(ab, { dpi: cfg.dpi, quality: cfg.quality, format: cfg.format, lang: opts?.lang, onProgress: progress });
      if (preset==='smallest') return await rasterAll(ab, { dpi: Math.max(110, cfg.dpi-20), quality: Math.min(cfg.quality, 0.65), format: cfg.format, onProgress: progress });
      // smart/email: choose path
      if (kind==='TEXT_HEAVY') return await losslessClean(ab);
      // scans or image-heavy → searchable image for smart; raster for smallest already handled
      return await searchableImage(ab, { dpi: cfg.dpi, quality: cfg.quality, format: cfg.format, lang: opts?.lang, onProgress: progress });
    };

    let out: { blob: Blob; cfg: BuildCfg };
    if (targetMB){
      out = await iterateForTarget(buildOnce, def, targetMB * 1024 * 1024, 3);
    } else {
      const blob = await buildOnce(def);
      out = { blob, cfg: def };
    }

    const pipeline = preset==='smallest' ? 'rasterAll'
      : (preset==='ats_safe' && kind==='TEXT_HEAVY') ? 'losslessClean'
      : (kind==='TEXT_HEAVY' ? 'losslessClean' : 'searchableImage');

    self.postMessage({ type:'ok', blob: out.blob, meta:{ cfg: out.cfg, preset, kind, pipeline } }, undefined as any);
  } catch (err) {
    self.postMessage({ type:'error', message: String(err) });
  }

  function progress(ev:any){ self.postMessage({ type:'progress', ...ev }); }
};
