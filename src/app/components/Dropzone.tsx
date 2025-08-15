import { useCallback } from "react";

interface Props {
  onFile: (file: File) => void;
}

const MAX_SIZE = 50 * 1024 * 1024;

export default function Dropzone({ onFile }: Props) {
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
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

  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) => handleFiles(e.target.files)}
    />
  );
}
