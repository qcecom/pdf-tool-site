import { getPdfFromData } from "../utils/safePdf";
import type { ExportTextPayload } from "@/pdf/types";

self.onmessage = async (e: MessageEvent<ExportTextPayload>) => {
  try {
    const pdf = await getPdfFromData(e.data.file);
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
