import type { ATSKeywordAnalysis, ATSNormalizationReport } from "@/pdf/types";

interface Props {
  report: ATSNormalizationReport;
  analysis: ATSKeywordAnalysis | null;
}

export default function ATSReport({ report, analysis }: Props) {
  return (
    <div className="bg-green-50 p-4 rounded-lg mt-4">
      <h3 className="font-bold text-green-800 mb-2">✅ ATS Optimization Report</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Original size:</strong> {report.originalLength} chars</p>
          <p><strong>Optimized size:</strong> {report.normalizedLength} chars</p>
          <p><strong>Removed elements:</strong> {report.removedElements.length}</p>
        </div>
        {analysis && (
          <div>
            <p>
              <strong>ATS Score:</strong>
              <span className={`font-bold ${analysis.score >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {analysis.score}%
              </span>
            </p>
            <p><strong>Keywords found:</strong> {analysis.commonKeywords.length}</p>
            {analysis.missingKeywords.length > 0 && (
              <p className="text-orange-600"><strong>Missing keywords:</strong> {analysis.missingKeywords.join(', ')}</p>
            )}
          </div>
        )}
      </div>
      {report.warnings.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-100 rounded">
          <p className="text-yellow-800 font-medium">⚠️ Warnings:</p>
          {report.warnings.map((w, i) => (
            <p key={i} className="text-yellow-700 text-sm">• {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}

