import { PDFDocument } from 'pdf-lib';
import { bytesOf } from '@/utils/bytes';
import { rasterAll } from '@/pdf/pipelines/rasterAll';

export type CompressProfile = 'lossless' | 'image' | 'smallest';

export interface CompressOptions {
  profile: CompressProfile;
  dpi?: number; // for raster profiles
  quality?: number; // JPEG quality 0-1
  pngToJpeg?: boolean;
  stripMetadata?: boolean;
}

export interface CompressResult {
  blob: Blob;
  beforeBytes: number;
  afterBytes: number;
  profile: CompressProfile;
  durationMs: number;
  noGain?: boolean;
}

const DEFAULTS: Required<Omit<CompressOptions, 'profile'>> = {
  dpi: 150,
  quality: 0.72,
  pngToJpeg: true,
  stripMetadata: true,
};

async function lossless(data: ArrayBuffer, stripMeta: boolean): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(data, { updateMetadata: !stripMeta });
  if (stripMeta) {
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
  }
  const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
  return out;
}

export async function compressPdf(src: File | Blob | ArrayBuffer, opts: CompressOptions): Promise<CompressResult> {
  const options = { ...DEFAULTS, ...opts };
  const beforeBytes = bytesOf(src);
  const ab = src instanceof ArrayBuffer ? src : await (src as Blob).arrayBuffer();
  const t0 = Date.now();

  let outBlob: Blob;
  if (options.profile === 'lossless' || options.profile === 'image') {
    const u8 = await lossless(ab, options.stripMetadata);
    outBlob = new Blob([u8.buffer as ArrayBuffer], { type: 'application/pdf' });
  } else {
    outBlob = await rasterAll(ab, { dpi: options.dpi, quality: options.quality, format: 'jpeg' });
  }

  const durationMs = Date.now() - t0;
  const afterBytes = outBlob.size;

  let noGain = false;
  if (afterBytes >= beforeBytes * 0.98) {
    noGain = true;
  }

  const blob = noGain ? new Blob([ab], { type: 'application/pdf' }) : outBlob;
  const finalBytes = noGain ? beforeBytes : afterBytes;

  return {
    blob,
    beforeBytes,
    afterBytes: finalBytes,
    profile: options.profile,
    durationMs,
    noGain,
  };
}
