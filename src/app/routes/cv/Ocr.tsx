import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import OcrWorker from "@/pdf/workers/ocrCv.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function Ocr() {
  useMeta({ title: "OCR - ATS CV Toolkit", description: "Turn scanned CVs into editable text" });
  const { run, progress, status, error, result } = useWorker(OcrWorker);
  const [text, setText] = useState("");
  const [lang, setLang] = useState<'eng' | 'vie'>('eng');

  const handleFile = async (file: File) => {
    const key = "ocr-limit";
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem(key) || "{}");
    if (stored.date !== today) stored.count = 0;
    if (stored.count >= 1 && import.meta.env.VITE_PRO !== "true") {
      alert("Free tier: 1 OCR per day");
      return;
    }
    const buf = await file.arrayBuffer();
    run({ file: buf, lang });
    stored.date = today;
    stored.count = (stored.count || 0) + 1;
    localStorage.setItem(key, JSON.stringify(stored));
  };

  useEffect(() => {
    if (status === "done" && typeof result === "string") setText(result);
  }, [status, result]);

  return (
    <>
      <Header />
      <main className="container">
        <h2>OCR</h2>
        <label style={{display:"block",marginBottom:8}}>
          Language:
          <select value={lang} onChange={(e) => setLang(e.target.value as 'eng' | 'vie')}>
            <option value="eng">English</option>
            <option value="vie">Vietnamese</option>
          </select>
        </label>
        <Dropzone onFile={handleFile} />
        {status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        {text && <textarea value={text} readOnly rows={10} cols={40} />}
        <aside style={{marginTop:12,color:"var(--muted)"}}>OCR quality varies; re-type critical sections.</aside>
      </main>
      <Footer />
    </>
  );
}
