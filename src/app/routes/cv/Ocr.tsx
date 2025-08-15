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
import ResultDownloadCard from "@/app/components/ResultDownloadCard";
import { deriveOutputName } from "@/pdf/utils";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function Ocr() {
  useMeta({ title: "OCR - nouploadpdf.com", description: "Turn scanned CVs into editable text" });
  const { run, progress, status, error, result } = useWorker(OcrWorker, "ocr");
  const [text, setText] = useState("");
  const [lang, setLang] = useState<'eng' | 'vie'>('eng');
  const [up, setUp] = useState(false);
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outName, setOutName] = useState("");

  const handleFile = async (file: File) => {
    if (!canUse("ocr")) {
      DBG && console.log("[ocr] gated");
      setUp(true);
      return;
    }
    DBG && console.log("[ocr] picked", file.name, file.size, lang);
    const buf = await file.arrayBuffer();
    setSrcFile(file);
    setText("");
    setOutBlob(null);
    setOutName("");
    run({ file: buf, lang }, [buf]);
    consume("ocr");
  };

  useEffect(() => {
    if (status === "done" && typeof result === "string" && srcFile && !outBlob) {
      DBG && console.log("[ocr] finished", result.length);
      setText(result);
      const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
      setOutBlob(blob);
      setOutName(deriveOutputName(srcFile.name, "-ocr", ".txt"));
    }
  }, [status, result, srcFile, outBlob]);

  useEffect(() => {
    if (status === "error" && error) DBG && console.log("[ocr] error", error);
  }, [status, error]);

  const reset = () => {
    setSrcFile(null);
    setText("");
    setOutBlob(null);
    setOutName("");
  };

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
        {!srcFile && <Dropzone onFile={handleFile} />}
        {srcFile && status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        {text && <textarea value={text} readOnly rows={10} cols={40} />}
        {outBlob && srcFile && (
          <ResultDownloadCard
            srcName={srcFile.name}
            srcSize={srcFile.size}
            outName={outName}
            outBlob={outBlob}
            onReset={reset}
          />
        )}
        <aside style={{marginTop:12,color:"var(--muted)"}}>OCR quality varies; re-type critical sections.</aside>
        <UpgradeModal open={up} onClose={()=>setUp(false)}/>
      </main>
      <Footer />
    </>
  );
}
