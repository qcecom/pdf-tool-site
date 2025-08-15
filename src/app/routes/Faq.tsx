import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function Faq() {
  useMeta({ title: "FAQ - ATS CV Toolkit", description: "Common questions about using the toolkit" });
  return (
    <>
      <Header />
      <main className="container">
        <h2>FAQ</h2>
        <dl>
          <dt>What file size should my CV be?</dt>
          <dd>Aim for under 2MB; some portals require under 1MB.</dd>
          <dt>Which fonts work best?</dt>
          <dd>Stick to system fonts like Arial, Times New Roman, or Roboto.</dd>
          <dt>Can I use tables and columns?</dt>
          <dd>Simple tables are fine but complex layouts can confuse ATS parsing.</dd>
          <dt>What about headers and footers?</dt>
          <dd>Keep them minimal and avoid placing key info there.</dd>
          <dt>Does compression reduce quality?</dt>
          <dd>Text stays sharp; only large images are resized.</dd>
          <dt>Will OCR handle any language?</dt>
          <dd>OCR currently supports English and Vietnamese.</dd>
          <dt>How do I verify it works offline?</dt>
          <dd>Open a tool, switch to airplane mode, then refresh. The app still runs.</dd>
          <dt>Are my files ever uploaded?</dt>
          <dd>No. Processing happens entirely in your browser.</dd>
          <dt>Why might a portal reject my CV?</dt>
          <dd>Large sizes, uncommon fonts, or locked PDFs may cause issues.</dd>
          <dt>How do I merge multiple PDFs?</dt>
          <dd>Use the Merge tool, drop your files, drag to reorder, then download.</dd>
        </dl>
      </main>
      <Footer />
    </>
  );
}
