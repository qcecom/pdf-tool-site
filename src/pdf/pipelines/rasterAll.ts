import { losslessClean, PipelineConfig } from './losslessClean';

export async function rasterAll(
  ab: ArrayBuffer,
  cfg: PipelineConfig,
  onProgress?: (p: { page: number; total: number; stage: string }) => void
): Promise<Blob> {
  // Placeholder: reuse losslessClean for now
  return losslessClean(ab, cfg, onProgress);
}
