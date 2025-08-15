import { PDFDocument } from "pdf-lib";
import type { SplitPayload } from "@/pdf/types";

self.onmessage = async (e: MessageEvent<SplitPayload>) => {
  try {
    const { file, ranges } = e.data;
    const src = await PDFDocument.load(file, { updateMetadata: false });
    const results: ArrayBuffer[] = [];
    let done = 0;
    for (const [start, end] of ranges) {
      const out = await PDFDocument.create();
      const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save({ useObjectStreams: true });
      results.push(bytes.buffer);
      done++;
      (self as any).postMessage({
        type: "progress",
        value: Math.min(99, Math.round((done / ranges.length) * 99))
      });
    }
    (self as any).postMessage({ type: "result", data: results }, results);
  } catch (err: any) {
    (self as any).postMessage({ type: "error", message: err?.message ?? "Split failed" });
  }
};
