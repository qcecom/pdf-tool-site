import { classifyDoc } from '../utils/classifyDoc';
import { losslessClean } from '../pipelines/losslessClean';
import { searchableImage } from '../pipelines/searchableImage';
import { rasterAll } from '../pipelines/rasterAll';
import type { PipelineConfig } from '../pipelines/losslessClean';

interface WorkerIn {
  file: File;
  preset: 'SMART' | 'ATS_SAFE' | 'EMAIL' | 'SMALLEST';
  opts?: Partial<PipelineConfig & { targetSizeMB?: number }>;
}

interface Progress {
  page: number;
  total: number;
  stage: string;
}

function deriveConfigFromPreset(
  preset: WorkerIn['preset'],
  kind: 'SCAN' | 'TEXT_HEAVY' | 'IMAGE_HEAVY',
  opts: any = {}
) {
  const cfg: any = { dpi: 150, quality: 0.75, format: 'jpeg', ...opts };
  switch (preset) {
    case 'SMALLEST':
      cfg.dpi = 120;
      cfg.quality = 0.6;
      break;
    case 'EMAIL':
      cfg.targetSizeMB = cfg.targetSizeMB || 2;
      break;
    case 'SMART':
      if (kind !== 'TEXT_HEAVY') cfg.targetSizeMB = cfg.targetSizeMB || 2;
      break;
    case 'ATS_SAFE':
    default:
      break;
  }
  return cfg;
}

function selectPipeline(
  preset: WorkerIn['preset'],
  kind: 'SCAN' | 'TEXT_HEAVY' | 'IMAGE_HEAVY'
) {
  if (preset === 'SMALLEST') return 'rasterAll';
  if (preset === 'ATS_SAFE') return 'lossless';
  if (preset === 'EMAIL') return kind === 'TEXT_HEAVY' ? 'lossless' : 'rasterAll';
  // SMART
  if (kind === 'TEXT_HEAVY') return 'lossless';
  if (kind === 'SCAN') return 'searchableImage';
  return 'rasterAll';
}

async function runPipeline(
  name: string,
  ab: ArrayBuffer,
  cfg: PipelineConfig,
  onProgress: (p: Progress) => void
) {
  if (name === 'lossless') return losslessClean(ab, cfg, onProgress);
  if (name === 'searchableImage') return searchableImage(ab, cfg, onProgress);
  return rasterAll(ab, cfg, onProgress);
}

async function iterateForTarget(
  buildOnce: (cfg: any) => Promise<Blob>,
  startCfg: any,
  targetBytes: number,
  maxTries = 3
) {
  let best = { blob: await buildOnce(startCfg), cfg: { ...startCfg } };
  for (let i = 1; i < maxTries; i++) {
    const cur = best.blob.size;
    if (cur <= targetBytes) break;
    const next = { ...best.cfg };
    next.dpi = Math.max(90, Math.round((next.dpi || 150) * 0.9));
    next.quality = Math.max(0.5, +(next.quality || 0.75 - 0.05).toFixed(2));
    const blob = await buildOnce(next);
    if (blob.size < best.blob.size) best = { blob, cfg: next };
  }
  return best;
}

self.onmessage = async (e: MessageEvent<WorkerIn>) => {
  const post = (m: any) => (self as any).postMessage(m);
  try {
    const { file, preset, opts } = e.data;
    const ab = await file.arrayBuffer();
    const { kind } = await classifyDoc(ab);
    let cfg: any = deriveConfigFromPreset(preset, kind, opts);
    const pipeline = selectPipeline(preset, kind);
    const buildOnce = (c: any) =>
      runPipeline(pipeline, ab, c, (p) => post({ type: 'progress', value: Math.round((p.page / p.total) * 100) }));
    let blob: Blob;
    if (cfg.targetSizeMB) {
      const target = cfg.targetSizeMB * 1024 * 1024;
      const res = await iterateForTarget(buildOnce, cfg, target);
      blob = res.blob;
      cfg = res.cfg;
    } else {
      blob = await buildOnce(cfg);
    }
    post({ type: 'result', data: blob, meta: { cfg, kind, pipeline } });
  } catch (err: any) {
    post({ type: 'error', message: String(err) });
  }
};
