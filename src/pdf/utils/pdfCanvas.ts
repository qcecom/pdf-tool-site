import { getDocument } from 'pdfjs-dist';
import { ensurePdfWorker } from './ensurePdfWorker';

export type RenderOpts = {
  data: ArrayBuffer; page: number; dpi: number; format: 'jpeg'|'webp'; quality: number;
};

export async function renderPageBlob(opts: RenderOpts): Promise<{blob:Blob; width:number; height:number}> {
  await ensurePdfWorker();
  const pdf = await getDocument({ data: opts.data }).promise;
  const page = await pdf.getPage(opts.page);
  const vp = page.getViewport({ scale: opts.dpi / 72 });

  // OffscreenCanvas when available, fallback to HTMLCanvas
  const anySelf: any = (typeof self !== 'undefined') ? self : globalThis;
  let canvas: any;
  if (typeof anySelf.OffscreenCanvas !== 'undefined') {
    canvas = new anySelf.OffscreenCanvas(vp.width, vp.height);
  } else {
    // @ts-ignore
    const c = (anySelf.document || {}).createElement ? anySelf.document.createElement('canvas') : null;
    if (!c) throw new Error('Canvas not available');
    c.width = vp.width; c.height = vp.height;
    canvas = c;
  }

  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx as any, viewport: vp }).promise;

  const type = opts.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const toBlob = (canvas as any).convertToBlob
    ? (canvas as any).convertToBlob({ type, quality: opts.quality })
    : new Promise<Blob>(res => (canvas as any).toBlob((b: Blob) => res(b!), type, opts.quality));

  const blob: Blob = await toBlob;
  return { blob, width: vp.width, height: vp.height };
}

export async function textItemsForPage(data: ArrayBuffer, pageNo: number){
  await ensurePdfWorker();
  const pdf = await getDocument({ data }).promise;
  const page = await pdf.getPage(pageNo);
  return page.getTextContent();
}
