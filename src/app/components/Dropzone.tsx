import { useRef } from "react";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function Dropzone({
  onFile, maxMB = 100
}: { onFile: (file: File) => void; maxMB?: number }) {
  const ref = useRef<HTMLInputElement|null>(null);

  const handle = (file: File) => {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    DBG && console.log("[dropzone] picked", file.name, file.size);
    if (!isPdf) {
      alert("Please choose a PDF file.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      alert(`File too large (> ${maxMB}MB).`);
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
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); if (ref.current) ref.current.value=""; }}
      />
      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8 }}>
        <button className="btn" onClick={() => ref.current?.click()}>Choose PDF</button>
      </div>
      <div
        className="card"
        style={{ borderStyle:"dashed", cursor:"pointer" }}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handle(f); }}
      >
        <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
          Drag & drop a PDF here, or tap to choose
        </div>
      </div>
    </div>
  );
}
