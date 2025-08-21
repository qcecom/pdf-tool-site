import { useRef } from "react";

export default function Dropzone({
  onFile,
  maxMB = 100,
  multiple = false,
}: { onFile: (file: File) => void; maxMB?: number; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handle = (file: File) => {
    const okType =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!okType) {
      alert("Please choose a PDF file.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      alert(`File is too large (> ${maxMB}MB).`);
      return;
    }
    onFile(file);
  };

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="application/pdf,.pdf"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => {
          const files = e.target.files;
          if (files) Array.from(files).forEach(handle);
        }}
      />
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <button className="btn" onClick={() => ref.current?.click()}>Choose PDF</button>
      </div>
      <div
        className="card"
        style={{ borderStyle: "dashed", cursor: "pointer" }}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files) Array.from(files).forEach(handle);
        }}
      >
        <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
          Drag & drop a PDF here, or tap to choose
        </div>
      </div>
    </div>
  );
}
