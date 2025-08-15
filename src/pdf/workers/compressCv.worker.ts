import { PDFDocument } from "pdf-lib";

type In = { file: ArrayBuffer; target?: "2mb" | "1mb"; quality?: number };
type Out =
  | { type: "progress"; value: number }
  | { type: "result"; data: ArrayBuffer }
  | { type: "error"; message: string };

self.onmessage = async (e: MessageEvent<In>) => {
  const post = (m: Out) => (self as any).postMessage(m);
  try {
    const { file } = e.data;
    post({ type: "progress", value: 5 });

    // Basic re-save to ensure object streams; keeps vectors/text intact.
    // NOTE: actual image downscaling depends on your existing pipeline.
    const pdf = await PDFDocument.load(file, { updateMetadata: true });
    // (Optional) small metadata cleanup to avoid bloating
    pdf.setProducer("");
    pdf.setCreator("");

    post({ type: "progress", value: 60 });
    const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false });

    // Transfer ownership of the buffer (zero-copy)
    post({ type: "result", data: out.buffer }, [out.buffer as any]);
  } catch (err: any) {
    post({ type: "error", message: err?.message || "Compress failed" });
  }
};
