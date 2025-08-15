import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Link } from "@/app/components/Link";
import { useMeta } from "@/app/hooks/useMeta";

export default function Home() {
  useMeta({ title: "ATS CV Toolkit", description: "Fast, private CV PDF tools" });
  return (
    <>
      <Header />
      <main className="container">
        <section className="hero">
          <h1>Fast, Private CV PDF tools</h1>
          <p>ATS-ready in minutes. No upload, no sign-up.</p>
          <div style={{marginTop:12, display:"flex", gap:10, flexWrap:"wrap"}}>
            <a className="btn" href="#tools">Get Started</a>
            <Link className="btn ghost" href="/why-ats">Why ATS</Link>
          </div>
        </section>

        <section id="tools" style={{marginTop:18}}>
          <div className="grid grid-3">
            {cards.map((c) => (
              <article key={c.href} className="card">
                <h3 style={{marginTop:0}}>{c.title}</h3>
                <p style={{color:"var(--muted)", marginTop:4}}>{c.desc}</p>
                <div style={{marginTop:10}}>
                  <a className="btn" href={c.href} aria-label={`Open ${c.title}`}>Open</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const cards = [
  { title: "Compress", desc: "Target <2MB / <1MB for job portals.", href: "/cv/compress" },
  { title: "Merge", desc: "Combine CV + portfolio and reorder pages.", href: "/cv/merge" },
  { title: "ATS Export", desc: "Extract clean TXT ready for ATS parsers.", href: "/cv/ats-export" },
  { title: "OCR (EN/VI)", desc: "Turn scanned CVs into editable text.", href: "/cv/ocr" },
  { title: "JD Match (AI)", desc: "Find missing keywords and get bullet tips.", href: "/cv/jd-match" },
];
