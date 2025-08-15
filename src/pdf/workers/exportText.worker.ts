import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { ExportTextPayload } from "@/pdf/types";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

self.onmessage = async (e: MessageEvent<ExportTextPayload>) => {
  try {
    const loadingTask = getDocument({ data: e.data.file });
    const pdf = await loadingTask.promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      text += pageText + "\n";
      (self as any).postMessage({
        type: "progress",
        value: Math.round((i / pdf.numPages) * 100),
      });
    }
    (self as any).postMessage({ type: "result", data: text });
  } catch (err: any) {
    (self as any).postMessage({
      type: "error",
      message: err?.message ?? "Text export failed",
    });
  }
};
