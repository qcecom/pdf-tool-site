import { useCallback, useRef } from "react";

interface Props {
  onFile: (file: File) => void;
}

const MAX_SIZE = 50 * 1024 * 1024;

export default function Dropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files.item(0);
      if (!file) return;
      if (file.type !== "application/pdf") {
        alert("Only PDF files are supported");
        return;
      }
      if (file.size > MAX_SIZE) {
        alert("File is larger than 50MB. Consider splitting it first.");
      }
      onFile(file);
    },
    [onFile]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{ border: "2px dashed #ccc", padding: 20, textAlign: "center" }}
    >
      <p>
        Drop PDF here or
        <button className="btn" type="button" onClick={() => inputRef.current?.click()}>
          Select PDF
        </button>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
