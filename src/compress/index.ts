import { PDFDocument } from 'pdf-lib';
import { bytesOf } from '@/utils/bytes';

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

async function smallestStub(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage([300, 300]);
  return doc.save();
}

export async function compressPdf(src: File | Blob | ArrayBuffer, opts: CompressOptions): Promise<CompressResult> {
  const options = { ...DEFAULTS, ...opts };
  const beforeBytes = bytesOf(src);
  const ab = src instanceof ArrayBuffer ? src : await (src as Blob).arrayBuffer();
  const t0 = Date.now();
  let out: Uint8Array;

  if (options.profile === 'lossless') {
    out = await lossless(ab, options.stripMetadata);
  } else if (options.profile === 'image') {
    // Placeholder: re-save similar to lossless; real impl would recompress images
    out = await lossless(ab, options.stripMetadata);
  } else {
    out = await smallestStub();
  }

  const durationMs = Date.now() - t0;
  const afterBytes = out.byteLength;

  let noGain = false;
  if (options.profile !== 'smallest' && afterBytes >= beforeBytes * 0.98) {
    noGain = true;
  }

  const blob = noGain
    ? new Blob([ab], { type: 'application/pdf' })
    : new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
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
