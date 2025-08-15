import { useState } from "react";

interface Result {
  score: number;
  missing: string[];
}

export default function JdMatch() {
  const [jd, setJd] = useState("");
  const [cv, setCv] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const runMatch = () => {
    const key = "jd-limit";
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem(key) || "{}");
    if (stored.date !== today) stored.count = 0;
    if (stored.count >= 1 && import.meta.env.VITE_PRO !== "true") {
      alert("Free tier: 1 match per day");
      return;
    }
    const jdWords = jd.toLowerCase().split(/[^a-z0-9]+/);
    const cvSet = new Set(cv.toLowerCase().split(/[^a-z0-9]+/));
    const matches = jdWords.filter((w) => w && cvSet.has(w));
    const missing = jdWords.filter((w) => w && !cvSet.has(w));
    const score = jdWords.length ? Math.round((matches.length / jdWords.length) * 100) : 0;
    setResult({ score, missing: Array.from(new Set(missing)).slice(0, 10) });
    stored.date = today;
    stored.count = (stored.count || 0) + 1;
    localStorage.setItem(key, JSON.stringify(stored));
  };

  const aiEnabled = import.meta.env.VITE_AI_ENABLED === "true";

  return (
    <div>
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
      <button onClick={runMatch}>Match</button>
      {result && (
        <div>
          <p>Score: {result.score}</p>
          <p>Missing keywords: {result.missing.join(", ")}</p>
        </div>
      )}
      <aside>Tip: Highlight missing keywords in your CV.</aside>
    </div>
  );
}
