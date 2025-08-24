import { compressSmart, type CompressProfile } from './compress-smart';
import { rasterizePdf } from './compress-raster';

export async function compressWithFallback(
  file: File,
  profile: CompressProfile,
  forceLossy = false
) {
  const origBytes = new Uint8Array(await file.arrayBuffer());
  const origSize = origBytes.byteLength;

  if (forceLossy) {
    const raster = await rasterizePdf(origBytes);
    return { bytes: raster, origSize, newSize: raster.byteLength, mode: 'raster' as const };
  }

  const smart = await compressSmart(file, profile);
  const gain = (origSize - smart.byteLength) / origSize;

  if (gain < 0.2) {
    const raster = await rasterizePdf(origBytes);
    const better = raster.byteLength < smart.byteLength ? raster : smart;
    const mode = better === raster ? 'raster' : 'smart';
    return { bytes: better, origSize, newSize: better.byteLength, mode };
  }

  return { bytes: smart, origSize, newSize: smart.byteLength, mode: 'smart' as const };
}
