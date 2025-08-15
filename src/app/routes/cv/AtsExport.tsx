import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import ExportWorker from "@/pdf/workers/exportText.worker?worker";
import { downloadText } from "@/pdf/utils";

export default function AtsExport() {
  const { run, progress, status, error, result } = useWorker(ExportWorker);
  const [text, setText] = useState("");

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    run({ file: buf });
  };

  useEffect(() => {
    if (status === "done" && typeof result === "string") {
      setText(result);
    }
  }, [status, result]);

  return (
    <div>
      <h2>ATS Export</h2>
      <Dropzone onFile={handleFile} />
      {status === "working" && <ProgressBar progress={progress} />}
      {error && <Toast message={error} onClose={() => {}} />}
      {text && (
        <div>
          <textarea value={text} readOnly rows={10} cols={40} />
          <div>
            <button onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
            <button onClick={() => downloadText(text, "cv.txt")}>Download</button>
          </div>
        </div>
      )}
      <aside>Tip: Avoid headers/footers and tables for ATS.</aside>
    </div>
  );
}
