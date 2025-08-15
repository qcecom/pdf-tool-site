import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";
import changes from "./changelog.json";

export default function Changelog() {
  useMeta({ title: "Changelog - ATS CV Toolkit", description: "Release history and updates" });
  return (
    <>
      <Header />
      <main className="container">
        <h2>Changelog</h2>
        <ul>
          {changes.map((c) => (
            <li key={c.date}>
              <strong>{c.date}</strong> - {c.text}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
