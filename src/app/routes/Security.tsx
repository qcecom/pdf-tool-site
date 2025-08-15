import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function Security() {
  useMeta({
    title: "Security - nouploadpdf.com",
    description: "On-device processing with Web Workers and transferable buffers",
  });
  return (
    <>
      <Header />
      <main className="container">
        <h2>Security</h2>
        <p>All processing runs on your device using Web Workers. ArrayBuffers are transferred, not copied, so data stays in memory only as long as needed.</p>
        <p>After each task, memory is released and nothing touches our servers.</p>
        <p>The site works offline once loaded. Switch to airplane mode to verify.</p>
      </main>
      <Footer />
    </>
  );
}
