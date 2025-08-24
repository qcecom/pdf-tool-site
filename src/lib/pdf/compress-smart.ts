import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib';
import { fileToUint8 } from './bytes';
import { imageBitmapFromBytes, downscaleToJpeg } from './canvas';

export type CompressProfile = 'high' | 'medium' | 'maximum';
const PROFILE: Record<CompressProfile, { scale: number; quality: number }> = {
  high: { scale: 0.9, quality: 0.85 },
  medium: { scale: 0.7, quality: 0.7 },
  maximum: { scale: 0.5, quality: 0.6 },
};

export async function compressSmart(
  file: File,
  profile: CompressProfile = 'medium'
): Promise<Uint8Array> {
  const inputBytes = await fileToUint8(file);
  const pdf = await PDFDocument.load(inputBytes, { updateMetadata: false });
  const { scale, quality } = PROFILE[profile];

  const pages = pdf.getPages();
  for (const page of pages) {
    const resources = page.node.get(PDFName.of('Resources')) as any;
    if (!resources) continue;
    const xobjDict = resources.get(PDFName.of('XObject')) as any;
    if (!xobjDict) continue;

    for (const [key, ref] of xobjDict.dict.entries()) {
      try {
        const xobj: any = pdf.context.lookup(ref);
        const subtype = xobj?.dict?.get(PDFName.of('Subtype'));
        if (subtype?.encodedName !== '/Image') continue;
        if (!(xobj instanceof PDFRawStream)) continue;
        const raw = xobj.contents as Uint8Array;
        const bmp = await imageBitmapFromBytes(raw);
        const resized = await downscaleToJpeg(bmp, scale, quality);
        const embed = await pdf.embedJpg(resized);
        xobj.contents = embed.ref
          ? ((pdf.context.lookup(embed.ref) as any)?.contents ?? resized)
          : resized;
      } catch {
        // ignore
      }
    }
  }

  return await pdf.save({ useObjectStreams: true, addDefaultPage: false });
}
