import { jsPDF } from 'jspdf';
import { renderPageBlob } from '../utils/pdfCanvas';

export type RasterCfg = { dpi:number; quality:number; format:'jpeg'|'webp'; onProgress?:(p:any)=>void };

export async function rasterAll(data:ArrayBuffer, cfg:RasterCfg): Promise<Blob> {
  const { getDocument } = await import('pdfjs-dist');
  const pdf = await getDocument({ data }).promise;
  let out: jsPDF | null = null;

  for (let p=1;p<=pdf.numPages;p++){
    cfg.onProgress?.({stage:'render', page:p, total:pdf.numPages});
    const { blob, width, height } = await renderPageBlob({ data, page: p, dpi: cfg.dpi, format: cfg.format, quality: cfg.quality });

    const dataUrl = await blobToDataURL(blob);
    if (!out) out = new jsPDF({ unit:'pt', compress:true, format:[width,height] });
    else out.addPage([width,height]);
    out.addImage(dataUrl, cfg.format === 'webp' ? 'WEBP' : 'JPEG', 0, 0, width, height);
    cfg.onProgress?.({stage:'compose', page:p, total:pdf.numPages});
  }
  return out!.output('blob');
}

function blobToDataURL(b:Blob){ 
  return new Promise<string>(res => { const r=new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(b); });
}
