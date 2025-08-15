import { Link } from "./Link";
export default function Footer() {
  return (
    <footer className="footer container" role="contentinfo">
      <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <span>© {new Date().getFullYear()} nouploadpdf.com — 100% on-device</span>
        <div className="nav" style={{gap:12}}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/security">Security</Link>
          <Link href="/changelog">Changelog</Link>
        </div>
      </div>
    </footer>
  );
}
