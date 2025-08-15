import { Link } from "./Link";

export default function Header() {
  return (
    <header className="header container" role="banner">
      <Link href="/" className="brand" ariaLabel="nouploadpdf.com Home">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 5h12l6 6v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm11 0v5h5" />
        </svg>
        <strong>ATS CV Toolkit</strong>
      </Link>
      <nav className="nav" aria-label="Primary">
        <Link href="/#tools">Tools</Link>
        <Link href="/why-ats">Why ATS</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/security">Security</Link>
        <Link href="/faq">FAQ</Link>
      </nav>
    </header>
  );
}
