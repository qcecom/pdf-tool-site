export type BuildCfg = { dpi: number; quality: number; format: 'jpeg' | 'webp' };
export async function iterateForTarget(
  buildOnce: (cfg: BuildCfg) => Promise<Blob>,
  start: BuildCfg,
  targetBytes: number,
  tries = 3
) {
  let best = { blob: await buildOnce(start), cfg: { ...start } };
  for (let i = 1; i < tries; i++) {
    if (best.blob.size <= targetBytes) break;
    const next = { ...best.cfg };
    next.dpi = Math.max(90, Math.round(next.dpi * 0.9));
    next.quality = Math.max(0.5, +(next.quality - 0.05).toFixed(2));
    const blob = await buildOnce(next);
    if (blob.size < best.blob.size) best = { blob, cfg: next };
  }
  return best;
}
