import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import ATSReport from "@/app/components/ATSReport";
import { useWorker } from "@/app/hooks/useWorker";
import ExportWorker from "@/pdf/workers/exportText.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ResultDownloadCard from "@/app/components/ResultDownloadCard";
import { deriveOutputName } from "@/pdf/utils";
import { useMeta } from "@/app/hooks/useMeta";
import type { ExportTextResult, ATSKeywordAnalysis, ATSNormalizationReport } from "@/pdf/types";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function AtsExport() {
  useMeta({ title: "ATS Export - nouploadpdf.com", description: "Extract text ready for ATS parsers" });
  const { run, progress, status, error, result } = useWorker(ExportWorker, "ats-export");
  const [text, setText] = useState("");
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outName, setOutName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [report, setReport] = useState<ATSNormalizationReport | null>(null);
  const [analysis, setAnalysis] = useState<ATSKeywordAnalysis | null>(null);

  const handleFile = (file: File) => {
    DBG && console.log("[ats-export] picked", file.name, file.size);
    setSrcFile(file);
    setText("");
    setOutBlob(null);
    setOutName("");
    setReport(null);
    setAnalysis(null);
  };

  const handleExport = async () => {
    if (!srcFile) return;
    const buf = await srcFile.arrayBuffer();
    run({ file: buf, jobDescription }, [buf]);
  };

  useEffect(() => {
    if (status === "done" && result && srcFile && !outBlob) {
      const { text: resText, report: rep, keywordAnalysis } = result as ExportTextResult;
      DBG && console.log("[ats-export] finished", resText.length);
      setText(resText);
      setReport(rep);
      setAnalysis(keywordAnalysis);
      const blob = new Blob([resText], { type: "text/plain;charset=utf-8" });
      setOutBlob(blob);
      setOutName(deriveOutputName(srcFile.name, "-ats", ".txt"));
    }
  }, [status, result, srcFile, outBlob]);

  useEffect(() => {
    if (status === "error" && error) DBG && console.log("[ats-export] error", error);
  }, [status, error]);

  const reset = () => {
    setSrcFile(null);
    setText("");
    setOutBlob(null);
    setOutName("");
    setJobDescription("");
    setReport(null);
    setAnalysis(null);
  };

  return (
    <>
      <Header />
      <main className="container">
        <h2>ATS Export</h2>
        {!srcFile && <Dropzone onFile={handleFile} />}
        {srcFile && status !== "working" && (
          <>
            <textarea
              placeholder="Paste job description here for keyword matching (optional)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-32 p-3 border rounded"
            />
            <div style={{ marginTop: 8 }}>
              <button className="btn" onClick={handleExport}>
                Export ATS-Ready Text
              </button>
            </div>
          </>
        )}
        {status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        {text && (
          <div>
            <textarea value={text} readOnly rows={10} cols={40} />
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
            </div>
          </div>
        )}
        {report && <ATSReport report={report} analysis={analysis} />}
        {outBlob && srcFile && (
          <ResultDownloadCard
            srcName={srcFile.name}
            srcSize={srcFile.size}
            outName={outName}
            outBlob={outBlob}
            onReset={reset}
          />
        )}
        <aside style={{ marginTop: 12, color: "var(--muted)" }}>
          Tip: Avoid headers/footers and tables for ATS.
        </aside>
      </main>
      <Footer />
    </>
  );
}
