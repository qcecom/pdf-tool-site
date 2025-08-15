import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import OcrWorker from "@/pdf/workers/ocrCv.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";
import { canUse, consume, isPro } from "@/pro/gating";
import UpgradeModal from "@/app/components/UpgradeModal";

export default function Ocr() {
  useMeta({ title: "OCR - nouploadpdf.com", description: "Turn scanned CVs into editable text" });
  const { run, progress, status, error, result } = useWorker(OcrWorker);
  const [text, setText] = useState("");
  const [lang, setLang] = useState<'eng' | 'vie'>('eng');
  const [up, setUp] = useState(false);

  const handleFile = async (file: File) => {
    if (!canUse("ocr")) { setUp(true); return; }
    const buf = await file.arrayBuffer();
    run({ file: buf, lang }, [buf]);
    consume("ocr");
  };

  useEffect(() => {
    if (status === "done" && typeof result === "string") setText(result);
  }, [status, result]);

  return (
    <>
      <Header />
      <main className="container">
        <h2>OCR</h2>
        <p style={{color:"var(--muted)"}}>{isPro()?"Pro":"Free 1/day"}</p>
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
        <UpgradeModal open={up} onClose={()=>setUp(false)}/>
      </main>
      <Footer />
    </>
  );
}
