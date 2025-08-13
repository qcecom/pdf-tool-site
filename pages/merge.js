import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

/**
 * Client-side PDF merge tool.
 * Allows users to upload multiple PDFs, merge them in the browser, and
 * download the merged result without uploading files to the server.
 */
export default function Merge() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Handle files selected via the file input element
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Allow drag-and-drop of PDF files into the drop zone
  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const mergePdfs = async () => {
    if (files.length === 0) return;
    setLoading(true);
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Merge PDFs</h1>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded h-64 flex items-center justify-center mb-4 text-gray-500"
      >
        <label htmlFor="file-input" className="text-center cursor-pointer">
          Drag and drop PDFs here or click to select
          <input
            id="file-input"
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mb-4 list-disc list-inside text-sm">
          {files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={mergePdfs}
        disabled={loading || files.length < 2}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Merge PDFs
      </button>

      {loading && (
        <div className="mt-4 flex items-center text-blue-600">
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Merging...
        </div>
      )}

      {downloadUrl && !loading && (
        <a
          href={downloadUrl}
          download="merged.pdf"
          className="block mt-4 text-blue-600 underline"
        >
          Download merged PDF
        </a>
      )}
    </main>
  );
}
