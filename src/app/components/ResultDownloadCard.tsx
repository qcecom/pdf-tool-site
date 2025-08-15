import { formatBytes } from "@/pdf/utils";

type Props = {
  srcName: string;
  srcSize?: number;          // in bytes
  outName: string;
  outBlob: Blob;             // Blob to download
  onReset?: () => void;
};

export default function ResultDownloadCard({ srcName, srcSize, outName, outBlob, onReset }: Props) {
  const outSize = outBlob.size;

  const handleDownload = () => {
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
        <div>Source file: <strong>{srcName}</strong>{srcSize!=null ? ` - ${formatBytes(srcSize)}` : ""}</div>
        <div>Output file: <strong>{outName}</strong> - {formatBytes(outSize)}</div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn" onClick={handleDownload} aria-label="Download processed file">Download</button>
        {onReset && <button className="btn ghost" onClick={onReset}>Process another</button>}
      </div>
    </div>
  );
}
