import { PDFDocument } from "pdf-lib";
import type { MergePayload } from "@/pdf/types";

self.onmessage = async (e: MessageEvent<MergePayload>) => {
  try {
    const { files } = e.data;
    (self as any).postMessage({ type: "progress", value: 2 });
    const outPdf = await PDFDocument.create();
    let done = 0;
    for (const buf of files) {
      const src = await PDFDocument.load(buf, { updateMetadata: false });
      const copied = await outPdf.copyPages(src, src.getPageIndices());
      copied.forEach((p) => outPdf.addPage(p));
      done++;
      (self as any).postMessage({
        type: "progress",
        value: Math.min(98, Math.round((done / files.length) * 98))
      });
    }
    const out = await outPdf.save({ useObjectStreams: true });
    (self as any).postMessage({ type: "result", data: out.buffer }, [out.buffer]);
  } catch (err: any) {
    (self as any).postMessage({ type: "error", message: err?.message ?? "Merge failed" });
  }
};
