import { getDocument } from 'pdfjs-dist';

export type RenderOpts = {
  data: ArrayBuffer; page: number; dpi: number; format: 'jpeg'|'webp'; quality: number;
};

export async function renderPageBlob(opts: RenderOpts): Promise<{blob:Blob; width:number; height:number}> {
  const pdf = await getDocument({ data: opts.data }).promise;
  const page = await pdf.getPage(opts.page);
  const vp = page.getViewport({ scale: opts.dpi / 72 });
  const canvas = new OffscreenCanvas(vp.width, vp.height);
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx as any, viewport: vp }).promise;
  const type = opts.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const blob: Blob = (canvas as any).convertToBlob
    ? await (canvas as any).convertToBlob({ type, quality: opts.quality })
    : await new Promise(res => (canvas as any).toBlob(res, type, opts.quality));
  return { blob, width: vp.width, height: vp.height };
}

export async function textItemsForPage(data: ArrayBuffer, pageNo: number){
  const pdf = await getDocument({ data }).promise;
  const page = await pdf.getPage(pageNo);
  return page.getTextContent();
}
