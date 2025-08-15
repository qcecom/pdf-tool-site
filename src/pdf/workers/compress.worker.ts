import { PDFDocument } from "pdf-lib";
import type { CompressPayload } from "@/pdf/types";

self.onmessage = async (e: MessageEvent<CompressPayload>) => {
  try {
    const { file } = e.data;
    (self as any).postMessage({ type: "progress", value: 5 });
    const pdf = await PDFDocument.load(file, { updateMetadata: false });
    (self as any).postMessage({ type: "progress", value: 50 });
    const out = await pdf.save({ useObjectStreams: true });
    (self as any).postMessage({ type: "result", data: out.buffer }, [out.buffer]);
  } catch (err: any) {
    (self as any).postMessage({
      type: "error",
      message: err?.message ?? "Compression failed"
    });
  }
};
