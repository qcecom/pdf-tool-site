import { PDFDocument } from 'pdf-lib';

export type PipelineConfig = {
  dpi?: number;
  quality?: number;
  format?: 'jpeg' | 'webp';
};

export async function losslessClean(
  ab: ArrayBuffer,
  _cfg: PipelineConfig,
  onProgress?: (p: { page: number; total: number; stage: string }) => void
): Promise<Blob> {
  const pdf = await PDFDocument.load(ab, { updateMetadata: true });
  pdf.setProducer('');
  pdf.setCreator('');
  const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
  onProgress?.({ page: 1, total: 1, stage: 'compose' });
  return new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
}
