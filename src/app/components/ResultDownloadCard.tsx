import { formatBytes } from "@/pdf/utils";
import { isBrowser } from "@/utils/env";

type Props = {
  srcName: string;
  srcSize?: number; // in bytes
  outName: string;
  outBlob: Blob; // Blob to download
  meta?: any;
  onReset?: () => void;
};

export default function ResultDownloadCard({
  srcName,
  srcSize,
  outName,
  outBlob,
  meta,
  onReset,
}: Props) {
  const srcBytes = typeof srcSize === "number" ? srcSize : (srcSize?.size ?? 0);
  const outSize = outBlob.size;
  const deltaPct = srcSize != null ? ((outSize - srcBytes) / srcBytes) * 100 : null;
  const badges: string[] = [];
  if (meta?.pipeline !== "rasterAll") {
    badges.push("ATS-safe", "Searchable");
  }
  if (meta?.pipeline !== "losslessClean") {
    badges.push("Lossy");
  }
  if (meta?.ocr === "tesseract.js") badges.push("OCR: tesseract.js");
  if (meta?.ocr === "stub") badges.push("OCR offline (stub)");
  const hint =
    srcSize != null && outSize > srcSize
      ? "This preset kept vector text or metadata; try Smart or lower DPI/quality."
      : null;

  const handleDownload = () => {
    if (!isBrowser) return;
    const url = URL.createObjectURL(outBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Result</h3>
      <div className="mono" style={{ display: "grid", gap: 4 }}>
        <div>
          Source file: <strong>{srcName}</strong>
          {srcSize != null ? ` - ${formatBytes(srcBytes)}` : ""}
        </div>
        <div>
          Output file: <strong>{outName}</strong> - {formatBytes(outSize)}
        </div>
        {deltaPct != null && (
          <div>
            Δ {deltaPct > 0 ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </div>
        )}
      </div>
      {badges.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {badges.map((b) => (
            <span
              key={b}
              style={{ padding: "2px 6px", background: "#eee", borderRadius: 4, fontSize: 12 }}
            >
              {b}
            </span>
          ))}
        </div>
      )}
      {hint && (
        <p className="mono" style={{ color: "orange", marginTop: 8 }}>
          {hint}
        </p>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn" onClick={handleDownload} aria-label="Download processed file">
          Download
        </button>
        {onReset && (
          <button className="btn ghost" onClick={onReset}>
            Process another
          </button>
        )}
      </div>
    </div>
  );
}
