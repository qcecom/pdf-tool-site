import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function Privacy() {
  useMeta({ title: "Privacy - ATS CV Toolkit", description: "We do not upload or store your files." });
  return (
    <>
      <Header />
      <main className="container">
        <h2>Privacy</h2>
        <p>We do not upload or store your files. Everything happens in your browser memory.</p>
        <p>No cookies are set by default. Optional analytics is off.</p>
      </main>
      <Footer />
    </>
  );
}
