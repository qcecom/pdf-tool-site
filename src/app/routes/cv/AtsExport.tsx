import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import ExportWorker from "@/pdf/workers/exportText.worker?worker";
import { downloadText } from "@/pdf/utils";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function AtsExport() {
  useMeta({ title: "ATS Export - nouploadpdf.com", description: "Extract text ready for ATS parsers" });
  const { run, progress, status, error, result } = useWorker(ExportWorker);
  const [text, setText] = useState("");

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    run({ file: buf }, [buf]);
  };

  useEffect(() => {
    if (status === "done" && typeof result === "string") {
      setText(result);
    }
  }, [status, result]);

  return (
    <>
      <Header />
      <main className="container">
        <h2>ATS Export</h2>
        <Dropzone onFile={handleFile} />
        {status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        {text && (
          <div>
            <textarea value={text} readOnly rows={10} cols={40} />
            <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
              <button className="btn" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
              <button className="btn" onClick={() => downloadText(text, "cv.txt")}>Download</button>
            </div>
          </div>
        )}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Tip: Avoid headers/footers and tables for ATS.</aside>
      </main>
      <Footer />
    </>
  );
}
