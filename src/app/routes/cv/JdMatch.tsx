import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";
import { canUse, consume, isPro } from "@/pro/gating";
import UpgradeModal from "@/app/components/UpgradeModal";

interface Result {
  score: number;
  missing: string[];
}

export default function JdMatch() {
  useMeta({ title: "JD Match - nouploadpdf.com", description: "Find missing keywords from job descriptions" });
  const [jd, setJd] = useState("");
  const [cv, setCv] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [up, setUp] = useState(false);

  const runMatch = () => {
    if (!canUse("jd")) {
      setUp(true);
      return;
    }
    const jdWords = jd.toLowerCase().split(/[^a-z0-9]+/);
    const cvSet = new Set(cv.toLowerCase().split(/[^a-z0-9]+/));
    const matches = jdWords.filter((w) => w && cvSet.has(w));
    const missing = jdWords.filter((w) => w && !cvSet.has(w));
    const score = jdWords.length ? Math.round((matches.length / jdWords.length) * 100) : 0;
    setResult({ score, missing: Array.from(new Set(missing)).slice(0, 10) });
    consume("jd");
  };

  const aiEnabled = import.meta.env.VITE_AI_ENABLED === "true";

  return (
    <>
      <Header />
      <main className="container">
        <h2>JD Match</h2>
        {!aiEnabled && <p>AI disabled in this build.</p>}
        <textarea
          placeholder="Paste Job Description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={8}
          cols={40}
        />
        <textarea
          placeholder="Paste your CV text"
          value={cv}
          onChange={(e) => setCv(e.target.value)}
          rows={8}
          cols={40}
        />
        <button className="btn" onClick={runMatch}>Run JD-Match {isPro()?"(Pro)":"(Free 1/day)"}</button>
        {result && (
          <div>
            <p>Score: {result.score}</p>
            <p>Missing keywords: {result.missing.join(", ")}</p>
          </div>
        )}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Tip: Highlight missing keywords in your CV.</aside>
        <UpgradeModal open={up} onClose={()=>setUp(false)}/>
      </main>
      <Footer />
    </>
  );
}
